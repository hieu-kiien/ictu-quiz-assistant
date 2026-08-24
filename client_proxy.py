import json
import urllib.request
import urllib.error
import urllib.parse
import os
import re

# Cho phep Mitmproxy xu ly bat dong bo khong chan event loop
try:
    from mitmproxy.script import concurrent
except ImportError:
    def concurrent(fn):
        return fn

CLOUDFLARE_URL = os.environ.get("CLOUDFLARE_URL", "https://ictu-quiz-assistant.qtu1053.workers.dev").rstrip("/")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SELECTED_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

TARGET_HOST_SUFFIXES = (
    "ictu.edu.vn",
    "ictu.vn",
    "tnu.edu.vn",
    "tnu.vn",
    "lms.ictu.edu.vn",
    "elearning.ictu.edu.vn",
)

def is_target_url(flow_url: str, flow_host: str) -> bool:
    host_lower = flow_host.lower()
    if any(host_lower == d or host_lower.endswith("." + d) for d in TARGET_HOST_SUFFIXES):
        return True
    if any(k in host_lower for k in ["lms", "moodle", "elearning", "kttx"]):
        return True
    return False

@concurrent
def response(flow):
    try:
        url = flow.request.pretty_url
        host = flow.request.host
        
        if not flow.response or not flow.response.content:
            return
            
        content_type = flow.response.headers.get("Content-Type", "").lower()
        if "application/json" not in content_type:
            return
            
        if not is_target_url(url, host):
            return

        raw_json = json.loads(flow.response.text)
        
        is_quiz = False
        if isinstance(raw_json, dict):
            keys = set(raw_json.keys())
            if any(k in keys for k in ["questions", "question", "attempt", "quiz", "data"]):
                q_list = raw_json.get("questions") or raw_json.get("question") or raw_json.get("data") or []
                if isinstance(q_list, list) and len(q_list) > 0:
                    first_item = q_list[0]
                    if isinstance(first_item, dict) and any(k in first_item for k in ["options", "choices", "answers", "title", "text"]):
                        is_quiz = True
        elif isinstance(raw_json, list) and len(raw_json) > 0:
            first_item = raw_json[0]
            if isinstance(first_item, dict) and any(k in first_item for k in ["options", "choices", "answers", "title", "text"]):
                is_quiz = True

        if not is_quiz:
            return

        print(f"[🎯] BAT DUOC DE THI HOP LE: {url}")
        
        req_payload = {
            "api_key": GEMINI_API_KEY,
            "model": SELECTED_MODEL,
            "payload": raw_json
        }
        
        req = urllib.request.Request(
            f"{CLOUDFLARE_URL}/api/solve",
            data=json.dumps(req_payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10.0) as res:
                if res.status == 200:
                    modified = json.loads(res.read().decode("utf-8"))
                    if isinstance(modified, (dict, list)) and "error" not in modified:
                        flow.response.text = json.dumps(modified, ensure_ascii=False)
                        print("[✨] CLOUDFLARE DA TIEM DAP AN THANH CONG!")
                    else:
                        # FIX 1: Single quotes inside f-string for Python <= 3.11 compatibility
                        err_msg = modified.get("error") if isinstance(modified, dict) else "Unknown error"
                        print("[!] Worker tra ve loi: " + str(err_msg) + ", giu nguyen de goc.")
                else:
                    print("[!] Worker HTTP " + str(res.status) + ", giu nguyen de goc.")
        except Exception as api_err:
            print("[!] Khong the ket noi toi Worker (" + str(api_err) + "), giu nguyen de goc an toan.")
            
    except Exception as e:
        pass
