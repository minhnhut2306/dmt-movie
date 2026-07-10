// src/utils/imageHelper.js - UNIFIED IMAGE HANDLING

/**
 * Tạo danh sách URL ảnh để thử lần lượt khi load fail
 * @param {string} rawUrl - URL gốc từ API
 * @param {string} _fallbackText - (không dùng) giữ để tương thích nơi gọi cũ
 * @param {object} [opts] - Tùy chọn kích thước/chất lượng ảnh
 * @param {number} [opts.width=500] - Chiều rộng resize (px). Dùng giá trị lớn hơn (780-1280)
 *   cho ảnh nền lớn (hero, backdrop) để tránh bị vỡ nét khi phóng to.
 * @param {number} [opts.quality=85] - Chất lượng nén (1-100). Trước đây q=72 gây mờ.
 * @returns {string[]} - Mảng URLs để thử theo thứ tự, kết thúc bằng /404.jpg
 */
// eslint-disable-next-line no-unused-vars
export function buildImageCandidates(rawUrl, _fallbackText = 'No Image', opts = {}) {
  const { width = 500, quality = 85 } = opts;

  // Ảnh mặc định khi load lỗi hoặc không có ảnh
  const placeholder = '/404.jpg';

  if (!rawUrl) return [placeholder];

  // Normalize URL
  const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://phimimg.com/${rawUrl}`;

  // Tạo proxy URLs — weserv/wsrv có CDN + cache + nén webp.
  // w = kích thước theo ngữ cảnh hiển thị (card nhỏ vs banner lớn), q = chất lượng nén (85 giữ ảnh nét).
  let weserv = '', wsrv = '';
  try {
    const u = new URL(fullUrl);
    const hostPath = `${u.hostname}${u.pathname}${u.search}`;
    const opts2 = `&w=${width}&output=webp&q=${quality}&af&il`;
    weserv = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`;
    wsrv = `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`;
  } catch {
    // Invalid URL, skip proxies
  }

  // Thứ tự: weserv (nhẹ, nhanh) -> wsrv -> ảnh gốc -> placeholder
  return Array.from(new Set([weserv, wsrv, fullUrl, placeholder].filter(Boolean)));
}

/**
 * Legacy function - giữ để backward compatibility
 * @param {string} url
 * @param {string} [fallbackText]
 * @param {object} [opts] - { width, quality } — xem buildImageCandidates
 */
export function getSafeImageUrl(url, fallbackText = "No Image", opts = {}) {
  const candidates = buildImageCandidates(url, fallbackText, opts);
  return candidates[0]; // Return first candidate
}
