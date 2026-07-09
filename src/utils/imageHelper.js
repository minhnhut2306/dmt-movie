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

/**
 * Lấy URL ảnh backdrop (nền rộng) chất lượng cao từ response của
 * GET /v1/api/phim/{slug}/images — dùng cho Hero Banner thay vì poster dọc.
 * @param {object} imagesResponse - Response trả về từ movieApi.getMovieImages
 * @returns {string|null}
 */
export function getBackdropUrl(imagesResponse) {
  const payload = imagesResponse?.data;
  const backdropBase = payload?.image_sizes?.backdrop?.w1280;
  const backdrop = payload?.images?.find((img) => img.type === "backdrop");
  if (!backdropBase || !backdrop?.file_path) return null;
  return `${backdropBase}${backdrop.file_path}`;
}

/**
 * Lấy URL poster dọc (tỉ lệ 2:3) chất lượng cao từ cùng response trên,
 * dùng cho ảnh poster ở trang chi tiết phim.
 * @param {object} imagesResponse - Response trả về từ movieApi.getMovieImages
 * @returns {string|null}
 */
export function getPosterUrl(imagesResponse) {
  const payload = imagesResponse?.data;
  const posterBase = payload?.image_sizes?.poster?.w500;
  const posters = payload?.images?.filter((img) => img.type === "poster") || [];
  // Ưu tiên ảnh đúng tỉ lệ 2:3 (0.667) để khớp khung poster đang dùng trong UI
  const poster =
    posters.find((img) => Math.abs(img.aspect_ratio - 0.667) < 0.02) || posters[0];
  if (!posterBase || !poster?.file_path) return null;
  return `${posterBase}${poster.file_path}`;
}
