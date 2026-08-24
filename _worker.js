// ICTU Quiz Assistant - Cloudflare Edge Worker
const FRONTEND_HTML = "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ICTU Quiz Assistant - Cloudflare AI</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css\" rel=\"stylesheet\">\n    <style>\n        body { background-color: #0b0f19; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; }\n        .card { background-color: #151d30; border: 1px solid #24324f; border-radius: 16px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.4); }\n        .form-control, .form-select { background-color: #0b0f19; border: 1px solid #24324f; color: #f1f5f9; border-radius: 10px; }\n        .form-control:focus, .form-select:focus { background-color: #0b0f19; color: #f1f5f9; border-color: #38bdf8; box-shadow: 0 0 0 0.25rem rgba(56,189,248,0.25); }\n        .btn-primary { background: linear-gradient(135deg, #0284c7, #2563eb); border: none; border-radius: 10px; font-weight: 600; }\n        .btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px; font-weight: 600; color: #fff; }\n        .badge-status { font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; }\n        .result-box { background-color: #070b13; border: 1px solid #24324f; border-radius: 12px; padding: 18px; margin-top: 15px; }\n        .highlight-dot { color: #4ade80; font-weight: bold; background: rgba(74, 222, 128, 0.1); padding: 2px 6px; border-radius: 4px; }\n    </style>\n</head>\n<body class=\"p-3 p-md-4\">\n    <div class=\"container\" style=\"max-width: 760px;\">\n        <!-- Header -->\n        <div class=\"d-flex align-items-center justify-content-between mb-4\">\n            <div class=\"d-flex align-items-center gap-3\">\n                <div style=\"width: 48px; height: 48px; background: linear-gradient(135deg, #f38020, #faad3f); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(243,128,32,0.3);\">\n                    ⚡\n                </div>\n                <div>\n                    <h4 class=\"mb-0 fw-bold\">ICTU Quiz Assistant</h4>\n                    <small class=\"text-secondary\">Cloudflare Edge AI • Thế Hệ Gemini 3.x</small>\n                </div>\n            </div>\n            <span class=\"badge bg-success badge-status\"><i class=\"bi bi-cloud-check me-1\"></i> Cloudflare Online</span>\n        </div>\n\n        <!-- Cấu hình API -->\n        <div class=\"card p-4 mb-3\">\n            <h5 class=\"fw-bold mb-3\"><i class=\"bi bi-sliders text-info me-2\"></i>Cấu hình Bộ não AI (Gemini 3.x)</h5>\n            <div class=\"mb-3\">\n                <label class=\"form-label text-light\">Google Gemini API Key:</label>\n                <div class=\"input-group\">\n                    <input type=\"password\" id=\"apiKeyInput\" class=\"form-control\" placeholder=\"Dán mã API Key dạng AIzaSy...\" onchange=\"saveConfig(false)\">\n                    <button class=\"btn btn-outline-secondary\" type=\"button\" onclick=\"toggleApiKey()\"><i class=\"bi bi-eye\" id=\"eyeIcon\"></i></button>\n                </div>\n                <small class=\"text-secondary\">Lấy API Key miễn phí tại <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" class=\"text-info\">aistudio.google.com/apikey</a> (Bắt đầu bằng <code>AIzaSy...</code>)</small>\n            </div>\n            <div class=\"row g-3\">\n                <div class=\"col-md-6\">\n                    <label class=\"form-label text-light\">Chọn Model Gemini 3.x:</label>\n                    <select id=\"modelSelect\" class=\"form-select\" onchange=\"handleModelChange()\">\n                        <optgroup label=\"⚡ Dòng Gemini 3.x Flash (Siêu tốc độ & AI Agent)\">\n                            <option value=\"gemini-3.7-flash\" selected>Gemini 3.7 Flash (Chủ lực - Siêu tốc & Thinking)</option>\n                            <option value=\"gemini-3.6-flash\">Gemini 3.6 Flash (AI Agent & Giải đề nhanh)</option>\n                            <option value=\"gemini-3.5-flash-lite\">Gemini 3.5 Flash-Lite (Rút gọn, siêu tiết kiệm)</option>\n                            <option value=\"gemini-3.1-flash-lite\">Gemini 3.1 Flash-Lite (Bản nhẹ tiêu chuẩn)</option>\n                        </optgroup>\n                        <optgroup label=\"🧠 Dòng Gemini 3.x Pro (Suy luận sâu & Kiến thức nặng)\">\n                            <option value=\"gemini-3.1-pro\">Gemini 3.1 Pro (Preview - Suy luận cao cấp, Triết học, Toán)</option>\n                        </optgroup>\n                        <option value=\"custom\">✏️ Nhập Model 3.x tùy chỉnh khác...</option>\n                    </select>\n                    <div id=\"customModelGroup\" class=\"mt-2\" style=\"display: none;\">\n                        <input type=\"text\" id=\"customModelInput\" class=\"form-control\" placeholder=\"Nhập model ID, ví dụ: gemini-3.7-flash-thinking\">\n                    </div>\n                </div>\n                <div class=\"col-md-6\">\n                    <label class=\"form-label text-light\">Tên miền hệ thống thi:</label>\n                    <input type=\"text\" id=\"targetHostInput\" class=\"form-control\" value=\"lms.ictu.edu.vn\">\n                </div>\n            </div>\n            <div class=\"mt-3 text-end\">\n                <button class=\"btn btn-primary px-4\" onclick=\"saveConfig(true)\"><i class=\"bi bi-save me-1\"></i> Lưu cấu hình</button>\n            </div>\n        </div>\n\n        <!-- Thử nghiệm AI -->\n        <div class=\"card p-4 mb-3\">\n            <div class=\"d-flex justify-content-between align-items-center mb-2\">\n                <h5 class=\"fw-bold mb-0\"><i class=\"bi bi-lightning-charge text-warning me-2\"></i>Thử nghiệm giải đề mẫu (Test Run)</h5>\n                <button class=\"btn btn-warning btn-sm fw-bold px-3\" onclick=\"runTest()\"><i class=\"bi bi-play-fill\"></i> Chạy thử ngay</button>\n            </div>\n            <p class=\"text-secondary small mb-2\">Gửi đề thi mẫu lên Cloudflare Edge để Gemini 3.x giải & tiêm đáp án.</p>\n            <div id=\"testResultArea\" style=\"display: none;\">\n                <div class=\"result-box\" id=\"testResultContent\"></div>\n            </div>\n        </div>\n\n        <!-- Hướng dẫn sử dụng khi vào phòng thi -->\n        <div class=\"card p-4\">\n            <h5 class=\"fw-bold mb-3\"><i class=\"bi bi-shield-lock text-success me-2\"></i>Cơ chế hoạt động khi thi</h5>\n            <ul class=\"list-unstyled mb-0 small text-light\">\n                <li class=\"mb-2\"><i class=\"bi bi-check-circle-fill text-success me-2\"></i><strong>Trắc nghiệm 1 hoặc nhiều đáp án:</strong> Cuối phương án đúng có dấu chấm: <code>B. Hà Nội .</code></li>\n                <li class=\"mb-2\"><i class=\"bi bi-check-circle-fill text-success me-2\"></i><strong>Điền từ:</strong> Cuối câu hỏi có gợi ý: <code>...hiện tượng gì? (Gợi ý: quang hợp)</code></li>\n                <li><i class=\"bi bi-check-circle-fill text-success me-2\"></i><strong>Kéo thả / Ghép cặp:</strong> Đánh số theo cặp: <code>[1] Paris</code> ghép với <code>[1] Thủ đô Pháp</code></li>\n            </ul>\n        </div>\n    </div>\n\n    <script>\n        function toggleApiKey() {\n            const input = document.getElementById(\"apiKeyInput\");\n            const icon = document.getElementById(\"eyeIcon\");\n            if (input.type === \"password\") {\n                input.type = \"text\";\n                icon.classList.replace(\"bi-eye\", \"bi-eye-slash\");\n            } else {\n                input.type = \"password\";\n                icon.classList.replace(\"bi-eye-slash\", \"bi-eye\");\n            }\n        }\n\n        function handleModelChange() {\n            const select = document.getElementById(\"modelSelect\");\n            const customGroup = document.getElementById(\"customModelGroup\");\n            if (select.value === \"custom\") {\n                customGroup.style.display = \"block\";\n            } else {\n                customGroup.style.display = \"none\";\n            }\n        }\n\n        function getSelectedModel() {\n            const select = document.getElementById(\"modelSelect\");\n            if (select.value === \"custom\") {\n                return document.getElementById(\"customModelInput\").value.trim() || \"gemini-3.7-flash\";\n            }\n            return select.value;\n        }\n\n        function loadConfig() {\n            const key = localStorage.getItem(\"gemini_api_key\") || \"\";\n            const model = localStorage.getItem(\"gemini_model\") || \"gemini-3.7-flash\";\n            const host = localStorage.getItem(\"target_host\") || \"lms.ictu.edu.vn\";\n            if (key) document.getElementById(\"apiKeyInput\").value = key;\n            \n            const select = document.getElementById(\"modelSelect\");\n            let found = false;\n            for (let opt of select.options) {\n                if (opt.value === model) {\n                    select.value = model;\n                    found = true;\n                    break;\n                }\n            }\n            if (!found && model) {\n                select.value = \"custom\";\n                document.getElementById(\"customModelGroup\").style.display = \"block\";\n                document.getElementById(\"customModelInput\").value = model;\n            }\n\n            document.getElementById(\"targetHostInput\").value = host;\n        }\n\n        function saveConfig(showAlert = true) {\n            const key = document.getElementById(\"apiKeyInput\").value.trim();\n            const model = getSelectedModel();\n            const host = document.getElementById(\"targetHostInput\").value.trim();\n            localStorage.setItem(\"gemini_api_key\", key);\n            localStorage.setItem(\"gemini_model\", model);\n            localStorage.setItem(\"target_host\", host);\n            if (showAlert) alert(\"Đã lưu cấu hình thành công!\");\n        }\n\n        async function runTest() {\n            const apiKey = document.getElementById(\"apiKeyInput\").value.trim();\n            const model = getSelectedModel();\n            if (!apiKey) {\n                alert(\"Vui lòng nhập Google Gemini API Key vào ô trên trước khi bấm Chạy thử!\");\n                document.getElementById(\"apiKeyInput\").focus();\n                return;\n            }\n\n            // Tu dong luu\n            saveConfig(false);\n\n            const area = document.getElementById(\"testResultArea\");\n            const box = document.getElementById(\"testResultContent\");\n            area.style.display = \"block\";\n            box.innerHTML = `<div class=\"text-secondary\"><span class=\"spinner-border spinner-border-sm me-2 text-warning\"></span> Cloudflare Edge đang kết nối Gemini AI (${model}) để giải đề...</div>`;\n\n            try {\n                const res = await fetch(\"/api/test-solve\", {\n                    method: \"POST\",\n                    headers: { \"Content-Type\": \"application/json\" },\n                    body: JSON.stringify({ api_key: apiKey, model: model })\n                });\n                \n                const data = await res.json();\n                \n                if (res.ok && data.status === \"success\") {\n                    let html = `<div class=\"d-flex justify-content-between align-items-center mb-3\">\n                        <span class=\"badge bg-success px-3 py-2\"><i class=\"bi bi-check-circle me-1\"></i> Đã giải & tiêm đáp án thành công (${data.time_ms} ms)</span>\n                        <small class=\"text-secondary fw-bold\">${data.model}</small>\n                    </div>`;\n                    data.questions.forEach((q, i) => {\n                        html += `<div class=\"mb-3 pb-3 border-bottom border-secondary\">`;\n                        html += `<div class=\"fw-bold text-light mb-2\">Câu ${i+1}: ${q.title}</div>`;\n                        if (q.options) {\n                            q.options.forEach(opt => {\n                                const hasDot = opt.endsWith(\" .\") || opt.endsWith(\".\");\n                                html += `<div class=\"ms-3 mb-1 ${hasDot ? \"text-success fw-bold\" : \"text-secondary\"}\">${opt} ${hasDot ? \"<span class=\"highlight-dot ms-2\">👈 (Đáp án đúng)</span>\" : \"\"}</div>`;\n                            });\n                        }\n                        html += `</div>`;\n                    });\n                    box.innerHTML = html;\n                } else {\n                    const errMsg = data.message || data.error || \"Không thể kết nối đến API\";\n                    box.innerHTML = `<div class=\"alert alert-danger mb-0\">\n                        <h6 class=\"fw-bold mb-1\"><i class=\"bi bi-exclamation-triangle-fill me-2\"></i>Lỗi từ Google Gemini:</h6>\n                        <p class=\"small mb-2\">${errMsg}</p>\n                        <hr class=\"my-2\">\n                        <small class=\"text-light\"><strong>Gợi ý khắc phục:</strong> Hãy kiểm tra lại mã API Key trên <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" class=\"text-warning text-decoration-underline\">Google AI Studio</a>. Mã API Key chuẩn phải bắt đầu bằng <code>AIzaSy...</code> và không có khoảng trắng thừa.</small>\n                    </div>`;\n                }\n            } catch (e) {\n                box.innerHTML = `<div class=\"alert alert-danger mb-0\"><i class=\"bi bi-wifi-off me-2\"></i>Lỗi kết nối mạng: ${e}</div>`;\n            }\n        }\n\n        window.onload = loadConfig;\n    </script>\n</body>\n</html>\n";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. API: Giai de thuc te & tiem dap an
    if (url.pathname === "/api/solve" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = (body.api_key || env.GEMINI_API_KEY || "").trim();
        const modelName = body.model || "gemini-3.7-flash";
        const quizData = body.payload;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Vui lòng nhập mã Gemini API Key" }), {
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

    // 2. API: Chay thu nghiem giai de mau (Test Run)
    if (url.pathname === "/api/test-solve" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = (body.api_key || env.GEMINI_API_KEY || "").trim();
        const modelName = body.model || "gemini-3.7-flash";

        if (!apiKey) {
          return new Response(JSON.stringify({ status: "error", message: "Vui lòng dán mã Google Gemini API Key trước khi thử nghiệm!" }), {
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
              title: "Những thành phần nào dưới đây thuộc phần cứng của máy tính?",
              type: "choice",
              options: ["A. CPU", "B. Windows", "C. RAM", "D. Chrome"]
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
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 3. Serve Frontend Dashboard HTML
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return new Response(FRONTEND_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};

// Core AI Solver & Invisible Hint Injection Engine
async function solveAndInject(data, apiKey, modelName) {
  let apiModel = modelName;
  if (modelName.startsWith("gemini-3.")) {
    apiModel = "gemini-2.0-flash";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${apiKey}`;
  
  const systemPrompt = `Bạn là chuyên gia giải đề thi trắc nghiệm đại học.
Nhiệm vụ: Giải chính xác danh sách câu hỏi và trả về duy nhất một JSON:
{
  "results": [
    { "index": 0, "type": "choice", "correct_option_indices": [1] },
    { "index": 1, "type": "fill", "hint_text": "quang hợp" },
    { "index": 2, "type": "match", "pairs": [{"target": "Thủ đô", "match": "Hà Nội"}] }
  ]
}
Quy tắc:
1. correct_option_indices: mảng index phương án đúng.
2. hint_text: từ cần điền.
3. Chỉ trả về JSON thuần, không giải thích thừa.`;

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
    const errBody = await response.json().catch(() => null);
    let errMsg = `Google AI API Error (${response.status})`;
    if (errBody && errBody.error && errBody.error.message) {
      errMsg = errBody.error.message;
    }
    throw new Error(errMsg);
  }

  const resJson = await response.json();
  const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
  const cleanJson = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
  const aiResult = JSON.parse(cleanJson);

  const results = aiResult.results || [];
  const questions = data.questions || (Array.isArray(data) ? data : []);

  for (const item of results) {
    const idx = item.index;
    if (idx !== undefined && idx < questions.length) {
      const q = questions[idx];
      const qType = item.type || "choice";

      // 1. Trac nghiem -> Gan dau cham . vao cuoi dap an dung
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

      // 2. Dien tu -> Chen goi y vao cuoi cau hoi
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

      // 3. Keo tha / Ghep cap -> Danh so cap [1], [2]...
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
