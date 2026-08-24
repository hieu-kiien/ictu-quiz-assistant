# ⚡ ICTU Quiz Assistant - Cloudflare Edge AI Suite

Hệ thống trợ lý làm bài thi AI ngầm chạy trên **Cloudflare Pages & Workers Edge**, tích hợp **Google Gemini 3.7 / 2.0 Flash**.

---

## 🚀 HƯỚNG DẪN ĐẨY LÊN GITHUB & CLOUDFLARE PAGES (2 PHÚT)

### 1. Đẩy mã nguồn lên GitHub:
1. Tạo một repository mới trên GitHub (ví dụ đặt tên là: `ictu-quiz-assistant`).
2. Trong thư mục `cloudflare_quiz_assistant`, mở terminal và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "feat: init Cloudflare AI Quiz Assistant"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/ictu-quiz-assistant.git
   git push -u origin main
   ```

---

### 2. Triển khai 1-Click trên Cloudflare Pages (Miễn phí 100%):
1. Truy cập vào [dash.cloudflare.com](https://dash.cloudflare.com) và đăng nhập (hoặc tạo tài khoản miễn phí).
2. Vào menu bên trái chọn **Workers & Pages** ➜ Bấm **Create application**.
3. Chọn tab **Pages** ➜ Bấm **Connect to Git**.
4. Chọn repository `ictu-quiz-assistant` bạn vừa đẩy lên GitHub.
5. Ở phần cài đặt:
   - **Framework preset:** `None`
   - **Build output directory:** `public`
6. Bấm **Save and Deploy**.
7. Sau 30 giây, bạn sẽ nhận được đường link Web vĩnh viễn (ví dụ: `https://ictu-quiz-assistant.pages.dev`)!

---

## 🌟 CÁCH SỬ DỤNG TRÊN ĐIỆN THOẠI KHI ĐI THI

1. Mở link Cloudflare của bạn trên trình duyệt điện thoại để nhập **Gemini API Key** và bấm thử nghiệm.
2. Trên điện thoại, bạn chỉ cần chạy client proxy siêu nhẹ:
   ```bash
   CLOUDFLARE_URL="https://ictu-quiz-assistant.pages.dev" GEMINI_API_KEY="AIzaSy..." mitmproxy -s client_proxy.py -p 8080
   ```
3. Mở app **ICTU Students** và thi bình thường. Toàn bộ đề thi sẽ được máy chủ Cloudflare giải trong tích tắc và gắn sẵn dấu chấm `.` vào các đáp án đúng!
