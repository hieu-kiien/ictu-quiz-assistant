import json
import urllib.request
import os

# Thay thế bằng URL Cloudflare Pages của bạn sau khi deploy (Ví dụ: https://ictu-assistant.pages.dev)
CLOUDFLARE_WORKER_URL = os.environ.get("CLOUDFLARE_URL", "https://your-project.pages.dev")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def response(flow):
    """Mitmproxy Hook: Chuyển toàn bộ gói tin đề thi lên Cloudflare Edge để AI giải ngầm"""
    url = flow.request.pretty_url
    if "lms.ictu.edu.vn" in url and flow.response and flow.response.content:
        content_type = flow.response.headers.get("Content-Type", "")
        if "application/json" in content_type:
            try:
                raw_json = json.loads(flow.response.text)
                if any(k in str(raw_json) for k in ["question", "quiz", "attempt", "choice", "options", "answer"]):
                    print(f"[*] Bat duoc de thi! Dang chuyen len Cloudflare: {CLOUDFLARE_WORKER_URL}...")
                    
                    req_payload = {
                        "api_key": GEMINI_API_KEY,
                        "model": "gemini-2.0-flash",
                        "payload": raw_json
                    }
                    
                    req = urllib.request.Request(
                        f"{CLOUDFLARE_WORKER_URL}/api/solve",
                        data=json.dumps(req_payload).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST"
                    )
                    
                    with urllib.request.urlopen(req, timeout=4.0) as res:
                        modified_data = json.loads(res.read().decode("utf-8"))
                        flow.response.text = json.dumps(modified_data, ensure_ascii=False)
                        print("[+] CLOUDFLARE DA GAN DAU DAP AN XONG! DE THI SAN SANG.")
            except Exception as e:
                print(f"[!] Proxy Client Error: {e}")
