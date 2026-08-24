// ICTU Quiz Assistant - Cloudflare All-In-One Edge Worker
const FRONTEND_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICTU Quiz Assistant - Cloudflare AI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background-color: #0b0f19; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .card { background-color: #151d30; border: 1px solid #24324f; border-radius: 16px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.4); }
        .form-control, .form-select { background-color: #0b0f19; border: 1px solid #24324f; color: #f1f5f9; border-radius: 10px; }
        .form-control:focus, .form-select:focus { background-color: #0b0f19; color: #f1f5f9; border-color: #38bdf8; box-shadow: 0 0 0 0.25rem rgba(56,189,248,0.25); }
        .btn-primary { background: linear-gradient(135deg, #0284c7, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
        .btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px; font-weight: 600; color: #fff; }
        .badge-status { font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; }
        .result-box { background-color: #070b13; border: 1px solid #24324f; border-radius: 12px; padding: 18px; margin-top: 15px; }
        .highlight-dot { color: #4ade80; font-weight: bold; background: rgba(74, 222, 128, 0.1); padding: 2px 6px; border-radius: 4px; }
        .code-snippet { background: #070b13; border: 1px solid #24324f; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 0.85rem; color: #38bdf8; }
    </style>
</head>
<body class="p-3 p-md-4">
    <div class="container" style="max-width: 760px;">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-3">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f38020, #faad3f); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(243,128,32,0.3);">
                    ⚡
                </div>
                <div>
                    <h4 class="mb-0 fw-bold">ICTU Quiz Assistant</h4>
                    <small class="text-secondary">Cloudflare Edge AI • Gemini 3.7 / 2.0 Flash</small>
                </div>
            </div>
            <span class="badge bg-success badge-status"><i class="bi bi-cloud-check me-1"></i> Cloudflare Online</span>
        </div>

        <!-- Cấu hình API -->
        <div class="card p-4 mb-3">
            <h5 class="fw-bold mb-3"><i class="bi bi-sliders text-info me-2"></i>Cấu hình Bộ não AI</h5>
            <div class="mb-3">
                <label class="form-label text-light">Google Gemini API Key:</label>
                <div class="input-group">
                    <input type="password" id="apiKeyInput" class="form-control" placeholder="Dán mã API Key của bạn">
                    <button class="btn btn-outline-secondary" type="button" onclick="toggleApiKey()"><i class="bi bi-eye" id="eyeIcon"></i></button>
                </div>
                <small class="text-secondary">Lấy miễn phí tại <a href="https://aistudio.google.com" target="_blank" class="text-info">aistudio.google.com</a> (Lưu trữ an toàn trên thiết bị của bạn)</small>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label text-light">Model AI:</label>
                    <select id="modelSelect" class="form-select">
                        <option value="gemini-2.0-flash" selected>Gemini 3.7 / 2.0 Flash (Siêu tốc ~0.8s)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tải nhẹ & Ổn định)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Tư duy chuyên sâu)</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label text-light">Tên miền hệ thống thi:</label>
                    <input type="text" id="targetHostInput" class="form-control" value="lms.ictu.edu.vn">
                </div>
            </div>
            <div class="mt-3 text-end">
                <button class="btn btn-primary px-4" onclick="saveConfig()"><i class="bi bi-save me-1"></i> Lưu cấu hình</button>
            </div>
        </div>

        <!-- Thử nghiệm AI -->
        <div class="card p-4 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0"><i class="bi bi-lightning-charge text-warning me-2"></i>Thử nghiệm giải đề mẫu (Test Run)</h5>
                <button class="btn btn-warning btn-sm fw-bold px-3" onclick="runTest()"><i class="bi bi-play-fill"></i> Chạy thử ngay</button>
            </div>
            <p class="text-secondary small mb-2">Gửi đề thi 4 dạng câu hỏi lên Cloudflare Edge để Gemini Flash giải & gắn dấu.</p>
            <div id="testResultArea" style="display: none;">
                <div class="result-box" id="testResultContent"></div>
            </div>
        </div>

        <!-- Hướng dẫn sử dụng khi vào phòng thi -->
        <div class="card p-4">
            <h5 class="fw-bold mb-3"><i class="bi bi-shield-lock text-success me-2"></i>Cơ chế hoạt động khi thi</h5>
            <ul class="list-unstyled mb-0 small text-light">
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i><strong>Trắc nghiệm 1 hoặc nhiều đáp án:</strong> Cuối phương án đúng có dấu chấm: <code>B. Hà Nội .</code></li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i><strong>Điền từ:</strong> Cuối câu hỏi có gợi ý: <code>...hiện tượng gì? (Gợi ý: quang hợp)</code></li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i><strong>Kéo thả / Ghép cặp:</strong> Đánh số theo cặp: <code>[1] Paris</code> ghép với <code>[1] Thủ đô Pháp</code></li>
            </ul>
        </div>
    </div>

    <script>
        function toggleApiKey() {
            const input = document.getElementById("apiKeyInput");
            const icon = document.getElementById("eyeIcon");
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("bi-eye", "bi-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("bi-eye-slash", "bi-eye");
            }
        }

        function loadConfig() {
            const key = localStorage.getItem("gemini_api_key") || "";
            const model = localStorage.getItem("gemini_model") || "gemini-2.0-flash";
            const host = localStorage.getItem("target_host") || "lms.ictu.edu.vn";
            if (key) document.getElementById("apiKeyInput").value = key;
            document.getElementById("modelSelect").value = model;
            document.getElementById("targetHostInput").value = host;
        }

        function saveConfig() {
            const key = document.getElementById("apiKeyInput").value.trim();
            const model = document.getElementById("modelSelect").value;
            const host = document.getElementById("targetHostInput").value.trim();
            localStorage.setItem("gemini_api_key", key);
            localStorage.setItem("gemini_model", model);
            localStorage.setItem("target_host", host);
            alert("Đã lưu cấu hình thành công!");
        }

        async function runTest() {
            const apiKey = document.getElementById("apiKeyInput").value.trim();
            const model = document.getElementById("modelSelect").value;
            if (!apiKey) {
                alert("Vui lòng nhập Google Gemini API Key trước khi thử nghiệm!");
                return;
            }

            const area = document.getElementById("testResultArea");
            const box = document.getElementById("testResultContent");
            area.style.display = "block";
            box.innerHTML = "<div class="text-secondary"><span class="spinner-border spinner-border-sm me-2 text-warning"></span> Cloudflare Edge đang gửi đề sang Gemini Flash giải...</div>";

            try {
                const res = await fetch("/api/test-solve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ api_key: apiKey, model: model })
                });
                const data = await res.json();
                if (data.status === "success") {
                    let html = \`<div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-success px-3 py-2"><i class="bi bi-check-circle me-1"></i> Đã giải & tiêm đáp án trong \${data.time_ms} ms</span>
                        <small class="text-secondary">\${data.model}</small>
                    </div>\`;
                    data.questions.forEach((q, i) => {
                        html += \`<div class="mb-3 pb-3 border-bottom border-secondary">\`;
                        html += \`<div class="fw-bold text-light mb-2">Câu \${i+1}: \${q.title}</div>\`;
                        if (q.options) {
                            q.options.forEach(opt => {
                                const hasDot = opt.endsWith(" .") || opt.endsWith(".");
                                html += \`<div class="ms-3 mb-1 \${hasDot ? "text-success fw-bold" : "text-secondary"}">\${opt} \${hasDot ? "<span class="highlight-dot ms-2">👈 (Đáp án đúng)</span>" : ""}</div>\`;
                            });
                        }
                        html += \`</div>\`;
                    });
                    box.innerHTML = html;
                } else {
                    box.innerHTML = \`<div class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i> Lỗi: \${data.message}</div>\`;
                }
            } catch (e) {
                box.innerHTML = \`<div class="text-danger">Lỗi kết nối Cloudflare: \${e}</div>\`;
            }
        }

        window.onload = loadConfig;
    </script>
</body>
</html>
`;

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

    // 2. API: Chay thu nghiem giai de mau (Test Run)
    if (url.pathname === "/api/test-solve" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = body.api_key || env.GEMINI_API_KEY;
        const modelName = body.model || "gemini-2.0-flash";

        if (!apiKey) {
          return new Response(JSON.stringify({ status: "error", message: "Vui long nhap Google Gemini API Key truoc!" }), {
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
3. Chỉ trả về JSON thuần, không kèm định dạng markdown hay giải thích thừa.
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

  const results = aiResult.results || [];
  const questions = data.questions || (Array.isArray(data) ? data : []);

  for (const item of results) {
    const idx = item.index;
    if (idx !== undefined && idx < questions.length) {
      const q = questions[idx];
      const qType = item.type || "choice";

      // 1. Trac nghiem -> Gan dau cham "." vao cuoi dap an dung
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
