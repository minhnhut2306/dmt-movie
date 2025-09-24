// src/utils/imageHelper.js
export function getSafeImageUrl(url, fallbackText = "No Image") {
  // fallback nếu thiếu URL
  if (!url) {
    return `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  }

  // Nếu API trả về path tương đối -> nối domain
  const normalized = url.startsWith("http") ? url : `https://phimimg.com/${url}`;

  // Dùng proxy công khai để né các lỗi SSL/hotlink lắt nhắt (FE-only, không cần server bạn)
  try {
    const u = new URL(normalized);
    const hostAndPath = `${u.hostname}${u.pathname}${u.search}`;
    // có thể thêm tham số resize nếu muốn: &w=300&h=450&fit=cover
    return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}`;
  } catch {
    return `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  }
}
