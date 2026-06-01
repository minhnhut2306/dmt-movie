// src/utils/imageHelper.js - UNIFIED IMAGE HANDLING

/**
 * Tạo danh sách URL ảnh để thử lần lượt khi load fail
 * @param {string} rawUrl - URL gốc từ API
 * @param {string} _fallbackText - (không dùng) giữ để tương thích nơi gọi cũ
 * @returns {string[]} - Mảng URLs để thử theo thứ tự, kết thúc bằng /404.jpg
 */
// eslint-disable-next-line no-unused-vars
export function buildImageCandidates(rawUrl, _fallbackText = 'No Image') {
  // Ảnh mặc định khi load lỗi hoặc không có ảnh
  const placeholder = '/404.jpg';

  if (!rawUrl) return [placeholder];

  // Normalize URL
  const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://phimimg.com/${rawUrl}`;

  // Tạo proxy URLs — weserv/wsrv có CDN + cache + nén webp, tải nhẹ & nhanh hơn ảnh gốc.
  // Tham số: w=400 (resize đúng kích thước card), output=webp, q=72 (nhẹ), af (auto-format).
  let weserv = '', wsrv = '';
  try {
    const u = new URL(fullUrl);
    const hostPath = `${u.hostname}${u.pathname}${u.search}`;
    const opts = '&w=400&output=webp&q=72&af&il';
    weserv = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}${opts}`;
    wsrv = `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}${opts}`;
  } catch {
    // Invalid URL, skip proxies
  }

  // Thứ tự: weserv (nhẹ, nhanh) -> wsrv -> ảnh gốc -> placeholder
  return Array.from(new Set([weserv, wsrv, fullUrl, placeholder].filter(Boolean)));
}

/**
 * Legacy function - giữ để backward compatibility
 * @deprecated Use buildImageCandidates instead
 */
export function getSafeImageUrl(url, fallbackText = "No Image") {
  const candidates = buildImageCandidates(url, fallbackText);
  return candidates[0]; // Return first candidate
}
