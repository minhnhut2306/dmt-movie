// src/utils/imageHelper.js - UNIFIED IMAGE HANDLING

/**
 * Tạo danh sách URL ảnh để thử lần lượt khi load fail
 * @param {string} rawUrl - URL gốc từ API
 * @param {string} fallbackText - Text hiển thị khi không có ảnh
 * @returns {string[]} - Mảng URLs để thử theo thứ tự
 */
export function buildImageCandidates(rawUrl, fallbackText = 'No Image') {
  const placeholder = `https://via.placeholder.com/400x600/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  
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
