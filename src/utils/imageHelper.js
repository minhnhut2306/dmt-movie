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

  // Tạo proxy URLs
  let weserv = '', wsrv = '';
  try {
    const u = new URL(fullUrl);
    const hostPath = `${u.hostname}${u.pathname}${u.search}`;
    weserv = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}`;
    wsrv = `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}`;
  } catch {
    // Invalid URL, skip proxies
  }

  // Thứ tự: direct -> weserv -> wsrv -> placeholder
  return Array.from(new Set([fullUrl, weserv, wsrv, placeholder])).filter(Boolean);
}

/**
 * Legacy function - giữ để backward compatibility
 * @deprecated Use buildImageCandidates instead
 */
export function getSafeImageUrl(url, fallbackText = "No Image") {
  const candidates = buildImageCandidates(url, fallbackText);
  return candidates[0]; // Return first candidate
}
