import json
import urllib.request
import urllib.error
import os
import re

CLOUDFLARE_URL = os.environ.get("CLOUDFLARE_URL", "https://ictu-quiz-assistant.qtu1053.workers.dev").rstrip("/")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SELECTED_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

# Danh sach cac tu khoa ten mien he thong dao tao & may chu thi
TARGET_DOMAINS = [
    "ictu.edu.vn", "ictu.vn", "tnu.edu.vn", "tnu.vn",
    "lms", "moodle", "elearning", "exam", "kttx", "test", "dttx"
]

print("====================================================")
print("   🎓 ICTU QUIZ ASSISTANT - CLIENT PROXY BRIDGE    ")
print("====================================================")
print(f"[*] Cloudflare Edge Endpoint: {CLOUDFLARE_URL}")
print(f"[*] Target Model: {SELECTED_MODEL}")
print(f"[*] Sniffing domains: {TARGET_DOMAINS}")
print("====================================================")

def response(flow):
    url = flow.request.pretty_url.lower()
    
    # 1. Kiem tra xem co phai may chu thi / LMS khong
    is_target_host = any(d in url for d in TARGET_DOMAINS)
    
    if flow.response and flow.response.content:
        content_type = flow.response.headers.get("Content-Type", "").lower()
        
        # A. Xu ly goi tin JSON
        if "application/json" in content_type:
            try:
                raw_json = json.loads(flow.response.text)
                json_str = str(raw_json).lower()
                
                # Nhan dien de thi (cho du host la IP hoac domain khac)
                is_quiz_payload = any(k in json_str for k in [
                    "question", "quiz", "attempt", "choice", "options", "cau_hoi", "dap_an"
                ])
                
                if is_target_host or is_quiz_payload:
                    print(f"\n[🎯] BAT DUOC GOI TIN DE THI: {url}")
                    
                    req_payload = {
                        "api_key": GEMINI_API_KEY,
                        "model": SELECTED_MODEL,
                        "payload": raw_json
                    }
                    
                    req = urllib.request.Request(
                        f"{CLOUDFLARE_URL}/api/solve",
                        data=json.dumps(req_payload).encode("utf-8"),
                        headers={"Content-Type": "application/json", "User-Agent": "ICTU-Quiz-Client/1.0"},
                        method="POST"
                    )
                    
                    try:
                        with urllib.request.urlopen(req, timeout=10.0) as res:
                            modified = json.loads(res.read().decode("utf-8"))
                            flow.response.text = json.dumps(modified, ensure_ascii=False)
                            print("[✨] CLOUDFLARE DA TIEM DAP AN AN VAO DE THI THANH CONG!")
                    except Exception as api_err:
                        print(f"[!] Cloudflare Worker Error: {api_err}")
            except Exception as e:
                pass

        # B. Xu ly neu de thi nam trong trang WebView HTML (Moodle Form)
        elif "text/html" in content_type and is_target_host:
            try:
                html = flow.response.text
                if any(k in html for k in ["que multichoice", "que match", "formulation", "qtext"]):
                    print(f"\n[🎯] PHAT HIEN DE THI WEBVIEW MOODLE: {url}")
            except Exception as e:
                pass
