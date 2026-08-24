// ICTU Quiz Assistant - Cloudflare All-In-One Edge Worker (Comprehensive Bug-Free Edition)
const FRONTEND_HTML = "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ICTU Quiz Assistant - Cloudflare AI</title>\n    <style>\n        * { box-sizing: border-box; margin: 0; padding: 0; }\n        body {\n            background-color: #0b0f19;\n            color: #f1f5f9;\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n            display: flex;\n            justify-content: center;\n            padding: 24px 16px;\n            min-height: 100vh;\n        }\n        .container { width: 100%; max-width: 680px; }\n        \n        .header {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 24px;\n            padding-bottom: 16px;\n            border-bottom: 1px solid #1e293b;\n        }\n        .header-title { display: flex; align-items: center; gap: 14px; }\n        .logo-box {\n            width: 48px; height: 48px;\n            background: linear-gradient(135deg, #f38020, #faad3f);\n            border-radius: 12px;\n            display: flex; align-items: center; justify-content: center;\n            font-size: 24px;\n            box-shadow: 0 4px 15px rgba(243,128,32,0.35);\n        }\n        .header-text h1 { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 2px; }\n        .header-text p { font-size: 0.8rem; color: #94a3b8; }\n        .badge-live {\n            background: rgba(16, 185, 129, 0.15);\n            border: 1px solid #10b981;\n            color: #34d399;\n            padding: 6px 12px;\n            border-radius: 20px;\n            font-size: 0.75rem;\n            font-weight: 600;\n            display: flex;\n            align-items: center;\n            gap: 6px;\n        }\n        .pulse-dot {\n            width: 8px; height: 8px;\n            background-color: #10b981;\n            border-radius: 50%;\n            animation: pulse 2s infinite;\n        }\n        @keyframes pulse {\n            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }\n            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }\n            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }\n        }\n\n        .card {\n            background-color: #151d30;\n            border: 1px solid #24324f;\n            border-radius: 16px;\n            padding: 20px;\n            margin-bottom: 20px;\n            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);\n        }\n        .card-title {\n            font-size: 1rem;\n            font-weight: 600;\n            margin-bottom: 16px;\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            color: #38bdf8;\n        }\n\n        .form-group { margin-bottom: 16px; }\n        label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 6px; color: #cbd5e1; }\n        .input-wrap { position: relative; display: flex; align-items: center; }\n        input[type=\"text\"], input[type=\"password\"], select {\n            width: 100%;\n            background-color: #0b0f19;\n            border: 1px solid #24324f;\n            color: #f1f5f9;\n            padding: 10px 14px;\n            border-radius: 10px;\n            font-size: 0.9rem;\n            outline: none;\n            transition: all 0.2s;\n        }\n        input:focus, select:focus {\n            border-color: #38bdf8;\n            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);\n        }\n        .eye-btn {\n            position: absolute;\n            right: 8px;\n            background: transparent;\n            border: none;\n            color: #94a3b8;\n            padding: 6px;\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            border-radius: 6px;\n        }\n        .eye-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }\n\n        .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }\n        .btn {\n            padding: 10px 20px;\n            border-radius: 10px;\n            font-size: 0.9rem;\n            font-weight: 600;\n            cursor: pointer;\n            border: none;\n            display: inline-flex;\n            align-items: center;\n            gap: 6px;\n            transition: all 0.2s;\n        }\n        .btn-primary {\n            background: linear-gradient(135deg, #0284c7, #2563eb);\n            color: #fff;\n        }\n        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }\n        .btn-warning {\n            background: linear-gradient(135deg, #f59e0b, #d97706);\n            color: #fff;\n            width: 100%;\n            justify-content: center;\n            padding: 14px;\n            font-size: 1rem;\n            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);\n        }\n        .btn-warning:hover { opacity: 0.95; transform: translateY(-1px); }\n        .btn-warning:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }\n\n        .toast {\n            background: #064e3b;\n            border: 1px solid #059669;\n            color: #a7f3d0;\n            padding: 12px 16px;\n            border-radius: 10px;\n            font-size: 0.85rem;\n            margin-bottom: 16px;\n            display: none;\n            align-items: center;\n            gap: 8px;\n        }\n\n        .result-box {\n            background: #070b13;\n            border: 1px solid #24324f;\n            border-radius: 12px;\n            padding: 16px;\n            margin-top: 16px;\n        }\n        .q-card {\n            padding-bottom: 14px;\n            margin-bottom: 14px;\n            border-bottom: 1px solid #1e293b;\n        }\n        .q-card:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }\n        .q-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 8px; color: #f8fafc; }\n        .opt-item {\n            margin-left: 14px;\n            margin-bottom: 4px;\n            font-size: 0.88rem;\n            color: #94a3b8;\n        }\n        .opt-correct {\n            color: #4ade80;\n            font-weight: 600;\n            background: rgba(74, 222, 128, 0.12);\n            padding: 4px 10px;\n            border-radius: 6px;\n            display: inline-block;\n        }\n\n        .guide-list { list-style: none; font-size: 0.85rem; color: #cbd5e1; }\n        .guide-list li { margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; }\n        code { background: #070b13; border: 1px solid #24324f; padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <!-- Header -->\n        <div class=\"header\">\n            <div class=\"header-title\">\n                <div class=\"logo-box\">⚡</div>\n                <div class=\"header-text\">\n                    <h1>ICTU Quiz Assistant</h1>\n                    <p>Cloudflare Edge AI • Thế Hệ Gemini 3.x (Bản Nâng Cấp Toàn Diện)</p>\n                </div>\n            </div>\n            <div class=\"badge-live\">\n                <div class=\"pulse-dot\"></div>\n                Cloudflare Edge Online\n            </div>\n        </div>\n\n        <!-- Toast notification -->\n        <div id=\"toastBox\" class=\"toast\">\n            <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline></svg>\n            <span id=\"toastText\">Đã lưu cấu hình thành công!</span>\n        </div>\n\n        <!-- Cấu hình API Key & Model -->\n        <div class=\"card\">\n            <div class=\"card-title\">\n                <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line></svg>\n                Cấu hình Bộ não AI\n            </div>\n\n            <div class=\"form-group\">\n                <label>Google Gemini API Key:</label>\n                <div class=\"input-wrap\">\n                    <input type=\"password\" id=\"apiKeyInput\" placeholder=\"Dán mã API Key của bạn\">\n                    <button type=\"button\" class=\"eye-btn\" onclick=\"togglePasswordVisibility()\" title=\"Ẩn/Hiện\">\n                        <svg id=\"eyeSvg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>\n                    </button>\n                </div>\n                <div style=\"font-size: 0.75rem; color: #64748b; margin-top: 4px;\">Lấy miễn phí tại <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" style=\"color: #38bdf8;\">aistudio.google.com/apikey</a> (Mã được lưu an toàn trên máy của bạn).</div>\n            </div>\n\n            <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\">\n                <div class=\"form-group\">\n                    <label>Chọn Model Gemini 3.x:</label>\n                    <select id=\"modelSelect\" onchange=\"autoSave()\">\n                        <option value=\"gemini-3.6-flash\" selected>Gemini 3.6 Flash (Siêu tốc & Ổn định nhất)</option>\n                        <option value=\"gemini-3.7-flash\">Gemini 3.7 Flash (Chủ lực & Thinking)</option>\n                        <option value=\"gemini-3.5-flash-lite\">Gemini 3.5 Flash-Lite (Siêu nhẹ)</option>\n                    </select>\n                </div>\n                <div class=\"form-group\">\n                    <label>Tên miền hệ thống thi:</label>\n                    <input type=\"text\" id=\"targetHostInput\" value=\"lms.ictu.edu.vn\" onchange=\"autoSave()\">\n                </div>\n            </div>\n\n            <div class=\"btn-row\">\n                <button type=\"button\" class=\"btn btn-primary\" onclick=\"saveConfiguration()\">\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"></path><polyline points=\"17 21 17 13 7 13 7 21\"></polyline><polyline points=\"7 3 7 8 15 8\"></polyline></svg>\n                    Lưu cấu hình\n                </button>\n            </div>\n        </div>\n\n        <!-- Thử nghiệm giải đề -->\n        <div class=\"card\">\n            <div class=\"card-title\" style=\"color: #f59e0b;\">\n                <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon></svg>\n                Thử nghiệm AI Giải Đề Mẫu (4 dạng câu hỏi)\n            </div>\n            <p style=\"font-size: 0.85rem; color: #94a3b8; margin-bottom: 14px;\">Gửi đề thi mẫu sang Cloudflare Edge để Gemini AI giải và tiêm dấu chấm <code> .</code> chính xác vào đáp án đúng.</p>\n            \n            <button type=\"button\" class=\"btn btn-warning\" id=\"btnTestRun\" onclick=\"triggerTestSolve()\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"></polygon></svg>\n                Chạy thử ngay\n            </button>\n\n            <div id=\"resultContainer\" style=\"display: none;\">\n                <div class=\"result-box\" id=\"resultContent\"></div>\n            </div>\n        </div>\n\n        <!-- Hướng dẫn nhận diện -->\n        <div class=\"card\">\n            <div class=\"card-title\" style=\"color: #10b981;\">\n                <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path></svg>\n                Quy tắc nhận biết đáp án khi thi thực tế\n            </div>\n            <ul class=\"guide-list\">\n                <li>\n                    <span style=\"color: #10b981;\">✓</span>\n                    <div><strong>Trắc nghiệm (1 hoặc nhiều đáp án):</strong> Phương án đúng có thêm khoảng trắng + dấu chấm ở cuối nhãn: <code>B. Hà Nội .</code></div>\n                </li>\n                <li>\n                    <span style=\"color: #10b981;\">✓</span>\n                    <div><strong>Điền từ vào ô trống:</strong> Cuối câu hỏi sẽ tự động gắn thêm gợi ý: <code>...hiện tượng gì? (Gợi ý: quang hợp)</code></div>\n                </li>\n                <li>\n                    <span style=\"color: #10b981;\">✓</span>\n                    <div><strong>Kéo thả / Ghép cặp:</strong> Đánh số theo cặp tương ứng: <code>[1] Paris</code> ghép với <code>[1] Thủ đô Pháp</code></div>\n                </li>\n            </ul>\n        </div>\n    </div>\n\n    <script>\n        function togglePasswordVisibility() {\n            const input = document.getElementById(\"apiKeyInput\");\n            const svg = document.getElementById(\"eyeSvg\");\n            if (input.type === \"password\") {\n                input.type = \"text\";\n                svg.innerHTML = \\`<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>\\`;\n            } else {\n                input.type = \"password\";\n                svg.innerHTML = \\`<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\\`;\n            }\n        }\n\n        function showToast(text) {\n            const box = document.getElementById(\"toastBox\");\n            document.getElementById(\"toastText\").innerText = text;\n            box.style.display = \"flex\";\n            setTimeout(() => { box.style.display = \"none\"; }, 3500);\n        }\n\n        function autoSave() {\n            saveConfiguration(false);\n        }\n\n        function saveConfiguration(showBanner = true) {\n            const key = document.getElementById(\"apiKeyInput\").value.trim();\n            const model = document.getElementById(\"modelSelect\").value;\n            const host = document.getElementById(\"targetHostInput\").value.trim();\n            localStorage.setItem(\"gemini_api_key\", key);\n            localStorage.setItem(\"gemini_model\", model);\n            localStorage.setItem(\"target_host\", host);\n            if (showBanner) showToast(\"Đã lưu cấu hình thành công (\" + model + \")!\");\n        }\n\n        function loadConfiguration() {\n            const key = localStorage.getItem(\"gemini_api_key\") || \"\";\n            const model = localStorage.getItem(\"gemini_model\") || \"gemini-3.6-flash\";\n            const host = localStorage.getItem(\"target_host\") || \"lms.ictu.edu.vn\";\n            if (key) document.getElementById(\"apiKeyInput\").value = key;\n            document.getElementById(\"modelSelect\").value = model;\n            document.getElementById(\"targetHostInput\").value = host;\n        }\n\n        async function triggerTestSolve() {\n            const apiKey = document.getElementById(\"apiKeyInput\").value.trim();\n            const model = document.getElementById(\"modelSelect\").value;\n            const btn = document.getElementById(\"btnTestRun\");\n\n            if (!apiKey) {\n                alert(\"Vui lòng dán mã Google Gemini API Key vào ô phía trên!\");\n                document.getElementById(\"apiKeyInput\").focus();\n                return;\n            }\n\n            saveConfiguration(false);\n\n            btn.disabled = true;\n            btn.innerHTML = \\`<span style=\"display:inline-block;\">⏳</span> Đang giải qua \\${model}...\\`;\n\n            const container = document.getElementById(\"resultContainer\");\n            const box = document.getElementById(\"resultContent\");\n            container.style.display = \"block\";\n            box.innerHTML = \\`<div style=\"color: #94a3b8; font-size: 0.9rem;\">⚡ Cloudflare Edge đang kết nối \\${model} để giải 4 câu hỏi mẫu...</div>\\`;\n\n            try {\n                const res = await fetch(\"/api/test-solve\", {\n                    method: \"POST\",\n                    headers: { \"Content-Type\": \"application/json\" },\n                    body: JSON.stringify({ api_key: apiKey, model: model })\n                });\n\n                const data = await res.json();\n\n                if (res.ok && data.status === \"success\") {\n                    let html = \\`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;\">\n                        <span style=\"background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;\">✓ Đã giải & tiêm đáp án thành công (\\${data.time_ms} ms)</span>\n                        <small style=\"color: #38bdf8; font-weight: 600;\">\\${data.model}</small>\n                    </div>\\`;\n\n                    data.questions.forEach((q, i) => {\n                        html += \\`<div class=\"q-card\">\\`;\n                        const qTitle = q.title || q.text || q.question_text || q.prompt || \"\";\n                        html += \\`<div class=\"q-title\">Câu \\${i+1}: \\${qTitle}</div>\\`;\n                        const opts = q.options || q.choices || q.answers || [];\n                        if (Array.isArray(opts)) {\n                            opts.forEach(opt => {\n                                const optText = typeof opt === \"object\" ? (opt.text || opt.title || opt.content || \"\") : String(opt);\n                                const isCorrect = optText.endsWith(\" .\");\n                                html += \\`<div class=\"opt-item \\${isCorrect ? \"opt-correct\" : \"\"}\">\\${optText} \\${isCorrect ? \"👈 (Đáp án đúng)\" : \"\"}</div>\\`;\n                            });\n                        }\n                        html += \\`</div>\\`;\n                    });\n                    box.innerHTML = html;\n                } else {\n                    const err = data.message || data.error || \"Không thể kết nối API\";\n                    box.innerHTML = \\`<div style=\"background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 12px; border-radius: 8px; font-size: 0.85rem;\">\n                        <strong>⚠️ Lỗi từ Google Gemini:</strong><br>\\${err}\n                    </div>\\`;\n                }\n            } catch (err) {\n                box.innerHTML = \\`<div style=\"color: #ef4444; font-size: 0.85rem;\">Lỗi kết nối mạng: \\${err}</div>\\`;\n            } finally {\n                btn.disabled = false;\n                btn.innerHTML = \\`<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"></polygon></svg> Chạy thử ngay\\`;\n            }\n        }\n\n        window.onload = loadConfiguration;\n    </script>\n</body>\n</html>\n";

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
        const modelName = body.model || "gemini-3.6-flash";
        const quizData = body.payload;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing Gemini API Key" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        if (!quizData) {
          return new Response(JSON.stringify({ error: "Missing quiz payload" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const modifiedData = await solveAndInject(quizData, apiKey, modelName);
        return new Response(JSON.stringify(modifiedData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || "Internal Worker Error" }), {
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
        const modelName = body.model || "gemini-3.6-flash";

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
              options: ["A. TP. Hồ Chí Minh.", "B. Hà Nội.", "C. Đà Nẵng.", "D. Hải Phòng."]
            },
            {
              title: "Những thành phần nào dưới đây thuộc phần cứng của máy tính? (Chọn nhiều đáp án)",
              type: "choice",
              options: ["A. Bộ vi xử lý CPU.", "B. Hệ điều hành Windows.", "C. Bộ nhớ RAM.", "D. Trình duyệt Chrome."]
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
        return new Response(JSON.stringify({ status: "error", message: err.message || "Failed to solve test quiz" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 3. Serve Frontend Dashboard HTML with NO-CACHE headers
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return new Response(FRONTEND_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};

// Core AI Solver with robust Fallback & Strict Schema Validation
async function solveAndInject(data, apiKey, modelName) {
  const modelsToTry = [modelName];
  if (modelName === "gemini-3.7-flash") {
    modelsToTry.push("gemini-3.6-flash", "gemini-3.5-flash-lite");
  } else if (modelName === "gemini-3.6-flash") {
    modelsToTry.push("gemini-3.5-flash-lite", "gemini-3.7-flash");
  } else {
    modelsToTry.push("gemini-3.6-flash", "gemini-3.5-flash-lite");
  }

  let lastError = null;

  for (const m of modelsToTry) {
    try {
      return await callGeminiModel(data, apiKey, m);
    } catch (err) {
      lastError = err;
      // Neu bat ky loi nao xay ra (High demand, Quota, 429, 500, 503, etc.) -> Thu ngay model ke tiep
      continue;
    }
  }

  throw lastError || new Error("All Gemini models failed to respond");
}

async function callGeminiModel(data, apiKey, modelName) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const systemPrompt = `Bạn là chuyên gia giải đề thi trắc nghiệm đại học trên hệ thống LMS/Moodle.
Nhiệm vụ: Giải chính xác toàn bộ danh sách câu hỏi và trả về DUY NHẤT một JSON theo định dạng sau:
{
  "results": [
    { "index": 0, "type": "choice", "correct_option_indices": [1] },
    { "index": 1, "type": "choice", "correct_option_indices": [0, 2] },
    { "index": 2, "type": "fill", "hint_text": "quang hợp" },
    { "index": 3, "type": "match", "pairs": [{"target": "Thủ đô Pháp", "match": "Paris"}] }
  ]
}
Quy tắc:
1. "correct_option_indices": mảng chỉ số nguyên (bắt đầu từ 0) của phương án đúng.
2. "hint_text": từ hoặc cụm từ cần điền vào ô trống.
3. "pairs": danh sách cặp nối chính xác.
4. Chỉ trả về JSON thuần, KHÔNG kèm markdown hay giải thích thừa.`;

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
  const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const aiResult = JSON.parse(cleanJson);

  const results = Array.isArray(aiResult.results) ? aiResult.results : [];
  
  // Normalize questions array
  let questions = [];
  if (Array.isArray(data.questions)) questions = data.questions;
  else if (Array.isArray(data.question)) questions = data.question;
  else if (Array.isArray(data)) questions = data;
  else if (data && typeof data === "object") questions = [data];

  for (const item of results) {
    const idx = item.index;
    
    // FIX Bug 7: Validate strictly that idx is a non-negative integer within bounds
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0 || idx >= questions.length) {
      continue;
    }

    const q = questions[idx];
    if (!q || typeof q !== "object") continue;

    const qType = item.type || "choice";

    // 1. Trac nghiem (1 hoac nhieu dap an)
    let optArray = null;
    for (const k of ["options", "choices", "answers", "items", "subquestions"]) {
      if (Array.isArray(q[k])) {
        optArray = q[k];
        break;
      }
    }

    if (qType === "choice" && optArray) {
      const correctIndices = Array.isArray(item.correct_option_indices) ? item.correct_option_indices : [];
      for (const optIdx of correctIndices) {
        if (typeof optIdx === "number" && Number.isInteger(optIdx) && optIdx >= 0 && optIdx < optArray.length) {
          const opt = optArray[optIdx];
          
          if (typeof opt === "object" && opt !== null) {
            for (const tk of ["text", "title", "content", "label", "name", "value"]) {
              if (typeof opt[tk] === "string") {
                // FIX Bug 6: Strip any existing trailing period before adding secret mark " ."
                const cleanText = opt[tk].replace(/\s*\.?\s*$/, "");
                opt[tk] = `${cleanText} .`;
                break;
              }
            }
          } else if (typeof opt === "string") {
            const cleanText = opt.replace(/\s*\.?\s*$/, "");
            optArray[optIdx] = `${cleanText} .`;
          }
        }
      }
    }

    // 2. Dien tu vao o trong (Anti-duplicate)
    else if (qType === "fill") {
      const hint = (item.hint_text || "").trim();
      if (hint) {
        for (const key of ["title", "question_text", "questiontext", "text", "prompt", "stem", "content", "intro", "name"]) {
          if (typeof q[key] === "string") {
            if (!q[key].includes(" (Gợi ý: ")) {
              q[key] = `${q[key].trim()} (Gợi ý: ${hint})`;
            }
            break;
          }
        }
      }
    }

    // 3. Keo tha / Ghep cap (Exact matching)
    else if (qType === "match") {
      const pairs = Array.isArray(item.pairs) ? item.pairs : [];
      pairs.forEach((pair, pIdx) => {
        const num = pIdx + 1;
        const target = (pair.target || "").trim().toLowerCase();
        const matchItem = (pair.match || "").trim().toLowerCase();
        
        if (target && matchItem && Array.isArray(q.items || q.options)) {
          const arr = q.items || q.options;
          arr.forEach(it => {
            if (it && typeof it === "object") {
              for (const tk of ["text", "title", "content", "label"]) {
                if (typeof it[tk] === "string") {
                  const lower = it[tk].trim().toLowerCase();
                  if (lower === target || lower === matchItem || lower.includes(target) || lower.includes(matchItem)) {
                    if (!it[tk].startsWith(`[${num}]`)) {
                      it[tk] = `[${num}] ${it[tk]}`;
                    }
                    break;
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  return data;
}
