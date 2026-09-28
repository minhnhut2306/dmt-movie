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
 * Tạo danh sách URL ảnh để thử lần lượt khi load fail
 * Hỗ trợ rawUrl là 1 string HOẶC một mảng [poster, thumbnail] để fallback chéo.
 * @param {string|string[]} rawUrl - URL hoặc mảng URL gốc từ API
 * @param {string} _fallbackText - (không dùng) giữ để tương thích nơi gọi cũ
 * @param {object} [opts] - Tùy chọn kích thước/chất lượng ảnh
 * @param {number} [opts.width=500] - Chiều rộng resize (px)
 * @param {number} [opts.quality=85] - Chất lượng nén (1-100)
 * @returns {string[]} - Mảng URLs để thử theo thứ tự, kết thúc bằng /404.jpg
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
    try {
      const u = new URL(fullUrl);
      const hostPath = `${u.hostname}${u.pathname}${u.search}`;
      const opts2 = `&w=${width}&output=webp&q=${quality}&af&il`;
      // Thêm proxy weserv và wsrv để cache + nén webp
      candidates.push(`https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`);
      candidates.push(`https://wsrv.nl/?url=${encodeURIComponent(hostPath)}${opts2}`);
    } catch {
      // Invalid URL, skip proxies
    }
    // Luôn có URL gốc để fallback nếu proxy lỗi hoặc bị chặn
    candidates.push(fullUrl);
  }

  candidates.push(placeholder);
  return Array.from(new Set(candidates));
}

/**
 * Legacy function - giữ để backward compatibility
 */
export function getSafeImageUrl(url, fallbackText = "No Image", opts = {}) {
  const candidates = buildImageCandidates(url, fallbackText, opts);
  return candidates[0];
}

/**
 * Chuỗi fallback dùng CHO CSS `background-image` (không phải thẻ <img>).
 */
export function buildBgFallbackChain(rawUrl, opts = {}) {
  const { width = 1280, quality = 88 } = opts;
  if (!rawUrl) return "url('/404.jpg')";

  const fullUrl = normalizeImageUrl(rawUrl);
  try {
    const u = new URL(fullUrl);
    const hostPath = `${u.hostname}${u.pathname}${u.search}`;
    const params = `&w=${width}&output=webp&q=${quality}&af&il`;
    const weserv = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}${params}`;
    return `url('${weserv}'), url('${fullUrl}'), url('/404.jpg')`;
  } catch {
    return `url('${fullUrl}'), url('/404.jpg')`;
  }
}