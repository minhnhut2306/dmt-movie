// src/utils/imageHelper.js - UNIFIED IMAGE HANDLING

/**
 * Chuẩn hóa URL ảnh từ API:
 * - Hỗ trợ protocol relative //
 * - Xử lý nguồn ảnh đặc thù như danviet.vn (chuyển sang CDN https://i.ex-cdn.com/danviet.vn/... vì danviet.vn chặn hotlink bằng HTML)
 * - Tự động gắn domain https://phimimg.com/ cho đường dẫn tương đối (uploads/..., upload/...)
 * - Giữ nguyên URL hợp lệ từ bên thứ ba (TMDB, CDN khác)
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Đã có protocol http/https
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Nếu là danviet.vn direct (không qua CDN i.ex-cdn.com) thì chuyển sang i.ex-cdn.com
    if (trimmed.startsWith('https://danviet.vn/') || trimmed.startsWith('http://danviet.vn/')) {
      return trimmed.replace(/^https?:\/\/danviet\.vn\//, 'https://i.ex-cdn.com/danviet.vn/');
    }
    return trimmed;
  }

  // Protocol relative
  if (trimmed.startsWith('//')) {
    return normalizeImageUrl(`https:${trimmed}`);
  }

  // Nguồn danviet.vn không có protocol (vd trong phim Phù Sa từ api)
  if (trimmed.startsWith('danviet.vn/')) {
    return `https://i.ex-cdn.com/${trimmed}`;
  }
  if (trimmed.includes('danviet.vn/')) {
    const idx = trimmed.indexOf('danviet.vn/');
    return `https://i.ex-cdn.com/${trimmed.slice(idx)}`;
  }

  // Trường hợp có domain khác (vd domain.com/path)
  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\//.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Đường dẫn tương đối trên CDN phimimg.com
  return `https://phimimg.com/${trimmed.replace(/^\/+/, '')}`;
}

/**
 * Tạo danh sách URL ảnh để thử lần lượt khi load fail.
 * Hỗ trợ rawUrl là 1 string HOẶC một mảng [poster, thumbnail] để fallback chéo.
 *
 * LƯU Ý QUAN TRỌNG:
 * - Luôn đặt URL trực tiếp lên ĐẦU TIÊN để tải ngay lập tức, không qua trung gian.
 * - weserv.nl và wsrv.nl hiện CHẶN chính sách ("Domain or TLD blocked by policy")
 *   đối với phimimg.com và ex-cdn.com, nên TUYỆT ĐỐI không proxy các domain này qua weserv.
 */
// eslint-disable-next-line no-unused-vars
export function buildImageCandidates(rawUrl, _fallbackText = 'No Image', opts = {}) {
  const { width = 500, quality = 85 } = opts;
  const placeholder = '/404.jpg';

  const rawList = Array.isArray(rawUrl) ? rawUrl : [rawUrl];
  const normalizedUrls = rawList
    .map(url => normalizeImageUrl(url))
    .filter(url => Boolean(url) && url !== placeholder);

  if (normalizedUrls.length === 0) return [placeholder];

  const candidates = [];

  for (const fullUrl of normalizedUrls) {
    // 1. Luôn ưu tiên tải trực tiếp từ CDN gốc
    candidates.push(fullUrl);

    // 2. Chỉ gửi qua proxy weserv/wsrv nếu domain không nằm trong danh sách bị chặn bởi weserv
    const isBlockedByWeserv =
      fullUrl.includes('phimimg.com') ||
      fullUrl.includes('ex-cdn.com') ||
      fullUrl.includes('danviet.vn');

    if (!isBlockedByWeserv) {
      try {
        const u = new URL(fullUrl);
        const hostPath = `${u.hostname}${u.pathname}${u.search}`;
        const opts2 = `&w=${width}&output=webp&q=${quality}&af&il`;
        candidates.push(`https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`);
        candidates.push(`https://wsrv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`);
      } catch {
        // Invalid URL, skip proxies
      }
    }
  }

  candidates.push(placeholder);
  return Array.from(new Set(candidates));
}

/**
 * Lấy URL ảnh an toàn và nhanh nhất:
 * Luôn chuẩn hóa URL về link CDN trực tiếp, không qua proxy bị lỗi.
 */
// eslint-disable-next-line no-unused-vars
export function getSafeImageUrl(url, fallbackText = "No Image", opts = {}) {
  if (!url) return '/404.jpg';
  const normalized = normalizeImageUrl(url);
  return normalized || '/404.jpg';
}

/**
 * Chuỗi fallback dùng CHO CSS `background-image` (không phải thẻ <img>).
 */
// eslint-disable-next-line no-unused-vars
export function buildBgFallbackChain(rawUrl, opts = {}) {
  if (!rawUrl) return "url('/404.jpg')";
  const fullUrl = normalizeImageUrl(rawUrl);
  return `url('${fullUrl}'), url('/404.jpg')`;
}