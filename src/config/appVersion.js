// ============================================================
// CẤU HÌNH VERSION APP
// Khi có phiên bản mới, chỉ cần cập nhật file này:
//   - Đổi id thành tên version mới (vd: "v3", "v4")
//   - Cập nhật apkUrl thành link APK mới
//   - Đổi nội dung message nếu muốn
// ============================================================

export const LATEST_VERSION = {
  id: "v2",                          // ID version — đổi thành "v3" khi ra v3
  label: "V2",                       // Tên hiển thị
  apkUrl: "https://drive.google.com/file/d/xxx/view", // ← Thay link APK thật vào đây
  v2Url: "https://dmt-movie-v2.vercel.app",
  message: "Phiên bản V2 đã ra mắt với nhiều cải tiến mới! Kho phim V2 và V1 có thể khác nhau, bạn có thể dùng cả hai để tìm được bộ phim mình thích.",
};

// Key lưu vào localStorage
export const VERSION_STORAGE_KEY = "dmt-dismissed-version";
