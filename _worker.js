// Cloudflare Worker / Pages Edge Runtime
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. API: Giải đề thực tế & tiêm đáp án (Inject Hints)
    if (url.pathname === "/api/solve" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = body.api_key || env.GEMINI_API_KEY;
        const modelName = body.model || "gemini-2.0-flash";
        const quizData = body.payload;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing Gemini API Key" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const modifiedData = await solveAndInject(quizData, apiKey, modelName);
        return new Response(JSON.stringify(modifiedData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 2. API: Chạy thử nghiệm giải đề mẫu (Test Run)
    if (url.pathname === "/api/test-solve" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = body.api_key || env.GEMINI_API_KEY;
        const modelName = body.model || "gemini-2.0-flash";

        if (!apiKey) {
          return new Response(JSON.stringify({ status: "error", message: "Vui lòng nhập Google Gemini API Key trước!" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const mockQuiz = {
          questions: [
            {
              title: "Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là gì?",
              type: "choice",
              options: ["A. TP. Hồ Chí Minh", "B. Hà Nội", "C. Đà Nẵng", "D. Hải Phòng"]
            },
            {
              title: "Những thành phần nào dưới đây thuộc phần cứng của máy tính? (Chọn nhiều đáp án)",
              type: "choice",
              options: ["A. Bộ vi xử lý CPU", "B. Hệ điều hành Windows", "C. Bộ nhớ RAM", "D. Trình duyệt Chrome"]
            },
            {
              title: "Quá trình cây xanh sử dụng năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ gọi là hiện tượng gì?",
              type: "fill"
            },
            {
              title: "Trái Đất là hành tinh thứ ba tính từ Mặt Trời trong Hệ Mặt Trời.",
              type: "choice",
              options: ["A. Đúng", "B. Sai"]
            }
          ]
        };

        const t0 = Date.now();
        const modified = await solveAndInject(mockQuiz, apiKey, modelName);
        const t1 = Date.now();

        return new Response(JSON.stringify({
          status: "success",
          time_ms: t1 - t0,
          model: modelName,
          questions: modified.questions || []
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ status: "error", message: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Default: Serve frontend static assets (Pages)
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("ICTU Quiz Assistant API Edge", { headers: corsHeaders });
  }
};

// Core AI Solver & Invisible Hint Injection Engine
async function solveAndInject(data, apiKey, modelName) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const systemPrompt = `
Bạn là chuyên gia giải đề thi đại học trên hệ thống LMS/Moodle (Đặc biệt là các môn CNTT, Triết học, Pháp luật, Tiếng Anh).
Nhiệm vụ: Giải chính xác toàn bộ danh sách câu hỏi trắc nghiệm dưới đây và trả về DUY NHẤT một JSON theo cấu trúc sau:
{
  "results": [
    {
      "index": 0,
      "type": "choice",
      "correct_option_indices": [1]
    },
    {
      "index": 1,
      "type": "fill",
      "hint_text": "quang hợp"
    },
    {
      "index": 2,
      "type": "match",
      "pairs": [{"target": "Thủ đô Pháp", "match": "Paris"}]
    }
  ]
}
Quy tắc:
1. "correct_option_indices": mảng chứa các chỉ số (index từ 0) của phương án đúng. Nếu là câu chọn 1 đáp án thì có 1 phần tử [0], nếu chọn nhiều đáp án thì chứa tất cả các phương án đúng [0, 2].
2. "hint_text": từ hoặc cụm từ chính xác cần điền vào ô trống cho câu điền từ.
3. Chỉ trả về JSON thuần, KHÔNG kèm markdown \`\`\`json hay giải thích.
`;

  const payload = {
    contents: [
      {
        parts: [{ text: `${systemPrompt}\n\nNội dung đề thi:\n${JSON.stringify(data)}` }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google AI API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
  const cleanJson = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
  const aiResult = JSON.parse(cleanJson);

  // Thực hiện gắn dấu đáp án (Invisible Hint Injection)
  const results = aiResult.results || [];
  const questions = data.questions || (Array.isArray(data) ? data : []);

  for (const item of results) {
    const idx = item.index;
    if (idx !== undefined && idx < questions.length) {
      const q = questions[idx];
      const qType = item.type || "choice";

      // 1. Trắc nghiệm (Chọn 1 hoặc nhiều đáp án / Đúng-Sai) -> Gắn dấu chấm "." vào cuối đáp án đúng
      if (qType === "choice" && Array.isArray(q.options)) {
        const correctIndices = item.correct_option_indices || [];
        for (const optIdx of correctIndices) {
          if (optIdx < q.options.length) {
            const opt = q.options[optIdx];
            if (typeof opt === "object" && opt.text) {
              if (!opt.text.endsWith(".")) opt.text = `${opt.text} .`;
            } else if (typeof opt === "string") {
              if (!opt.endsWith(".")) q.options[optIdx] = `${opt} .`;
            }
          }
        }
      }

      // 2. Điền từ vào chỗ trống -> Chèn gợi ý vào cuối câu hỏi
      else if (qType === "fill") {
        const hint = item.hint_text || "";
        if (hint) {
          for (const key of ["title", "question_text", "text", "prompt", "stem"]) {
            if (q[key] && typeof q[key] === "string") {
              q[key] = `${q[key]} (Gợi ý: ${hint})`;
              break;
            }
          }
        }
      }

      // 3. Kéo thả / Ghép cặp -> Đánh số cặp [1], [2]...
      else if (qType === "match") {
        const pairs = item.pairs || [];
        pairs.forEach((pair, pIdx) => {
          const num = pIdx + 1;
          const target = pair.target || "";
          const matchItem = pair.match || "";
          if (Array.isArray(q.items)) {
            q.items.forEach(it => {
              if (it && typeof it === "object" && it.text) {
                if (it.text.includes(target) || it.text.includes(matchItem)) {
                  it.text = `[${num}] ${it.text}`;
                }
              }
            });
          }
        });
      }
    }
  }

  return data;
}
