import json
import urllib.request
import urllib.error
import os
import re

# URL Cloudflare Worker cua ban
CLOUDFLARE_URL = os.environ.get("CLOUDFLARE_URL", "https://ictu-quiz-assistant.qtu1053.workers.dev")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SELECTED_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.7-flash")

print(f"[*] ICTU Quiz Assistant Client Bridge khoi dong!")
print(f"[*] Cloudflare Endpoint: {CLOUDFLARE_URL}")
print(f"[*] Model muc tieu: {SELECTED_MODEL}")

def response(flow):
    url = flow.request.pretty_url
    
    # 1. Kiem tra xem co phai goi tin tu may chu LMS / ICTU khong
    if any(host in url for host in ["ictu.edu.vn", "ictu.vn", "lms", "moodle"]) and flow.response and flow.response.content:
        content_type = flow.response.headers.get("Content-Type", "")
        
        # A. Xu ly goi tin dang JSON
        if "application/json" in content_type:
            try:
                raw_json = json.loads(flow.response.text)
                json_str = str(raw_json)
                
                # Nhan dien goi tin chua cau hoi / de thi
                if any(k in json_str for k in ["question", "quiz", "attempt", "choice", "options", "answer", "cau_hoi", "dap_an"]):
                    print(f"\n[🎯] PHAT HIEN GOI TIN DE THI JSON: {url}")
                    
                    req_payload = {
                        "api_key": GEMINI_API_KEY,
                        "model": SELECTED_MODEL,
                        "payload": raw_json
                    }
                    
                    req = urllib.request.Request(
                        f"{CLOUDFLARE_URL}/api/solve",
                        data=json.dumps(req_payload).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST"
                    )
                    
                    try:
                        with urllib.request.urlopen(req, timeout=4.5) as res:
                            modified = json.loads(res.read().decode("utf-8"))
                            flow.response.text = json.dumps(modified, ensure_ascii=False)
                            print("[✨] CLOUDFLARE DA TIEM DAP AN AN THANH CONG VAO DE THI!")
                    except Exception as api_err:
                        print(f"[!] Loi goi Cloudflare Worker: {api_err}")
            except Exception as e:
                pass
                
        # B. Xu ly neu de thi nam trong trang HTML (WebView Moodle)
        elif "text/html" in content_type:
            try:
                html = flow.response.text
                if any(k in html for k in ["que multichoice", "que match", "formulation", "qtext", "answer"]):
                    print(f"\n[🎯] PHAT HIEN DE THI WEBVIEW (HTML): {url}")
                    # Co the xu ly parse HTML neu can
            except Exception as e:
                pass
