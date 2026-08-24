import json
import urllib.request
import urllib.error
import urllib.parse
import os
import re

CLOUDFLARE_URL = os.environ.get("CLOUDFLARE_URL", "https://ictu-quiz-assistant.qtu1053.workers.dev").rstrip("/")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SELECTED_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

# Danh sach ten mien chinh xac can bat goi tin
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

def response(flow):
    try:
        url = flow.request.pretty_url
        host = flow.request.host
        
        if not flow.response or not flow.response.content:
            return
            
        content_type = flow.response.headers.get("Content-Type", "").lower()
        if "application/json" not in content_type:
            return
            
        # FIX Bug 4: Kiem tra domain chinh xac thay vi substring toan bo URL
        if not is_target_url(url, host):
            return

        raw_json = json.loads(flow.response.text)
        
        # FIX Bug 5: Signature bat de thi chinh xac (cau hoi va danh sach lua chon)
        is_quiz = False
        if isinstance(raw_json, dict):
            keys = set(raw_json.keys())
            if any(k in keys for k in ["questions", "question", "attempt", "quiz", "data"]):
                # Kiem tra co cau hoi ben trong
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
            headers={"Content-Type": "application/json", "User-Agent": "ICTU-Quiz-Client/2.0"},
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10.0) as res:
                # FIX Bug 2: Kiem tra HTTP 200 va khong co error payload truoc khi ghi de
                if res.status == 200:
                    modified = json.loads(res.read().decode("utf-8"))
                    if isinstance(modified, (dict, list)) and "error" not in modified:
                        flow.response.text = json.dumps(modified, ensure_ascii=False)
                        print("[✨] CLOUDFLARE DA TIEM DAP AN THANH CONG!")
                    else:
                        print(f"[!] Worker tra ve loi: {modified.get("error")}, giu nguyen de goc.")
                else:
                    print(f"[!] Worker HTTP {res.status}, giu nguyen de goc.")
        except Exception as api_err:
            print(f"[!] Khong the ket noi toi Worker ({api_err}), giu nguyen de goc an toan.")
            
    except Exception as e:
        # Neu co bat ky loi parse nao, khong can thiep vao flow response goc
        pass
