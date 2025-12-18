// src/utils/imageHelper.js

/**
 * Tạo URL ảnh an toàn với fallback và proxy
 * Ophim1 API thường trả về đường dẫn tương đối hoặc full URL
 */
export function getSafeImageUrl(url, fallbackText = "No Image") {
  // Fallback nếu thiếu URL
  if (!url) {
    return `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  }

  // Nếu là URL đầy đủ, giữ nguyên
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Sử dụng proxy để tránh CORS và SSL issues
    try {
      const u = new URL(url);
      const hostAndPath = `${u.hostname}${u.pathname}${u.search}`;
      return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}`;
    } catch {
      return url; // Nếu parse lỗi, trả về URL gốc
    }
  }

  // Nếu là đường dẫn tương đối, nối với CDN của Ophim
  // Ophim1 thường dùng img.ophim1.com hoặc tương tự
  const normalized = `https://img.ophim1.com${url.startsWith('/') ? '' : '/'}${url}`;
  
  // Sử dụng proxy cho ảnh từ Ophim CDN
  try {
    const u = new URL(normalized);
    const hostAndPath = `${u.hostname}${u.pathname}${u.search}`;
    return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}`;
  } catch {
    return `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  }
}

/**
 * Lấy URL poster với kích thước tối ưu
 */
export function getOptimizedPosterUrl(url, width = 300, height = 450) {
  const baseUrl = getSafeImageUrl(url);
  
  // Nếu đang dùng weserv proxy, thêm tham số resize
  if (baseUrl.includes('weserv.nl')) {
    return `${baseUrl}&w=${width}&h=${height}&fit=cover`;
  }
  
  return baseUrl;
}

/**
 * Lấy URL thumbnail với kích thước tối ưu
 */
export function getOptimizedThumbnailUrl(url, width = 780, height = 438) {
  const baseUrl = getSafeImageUrl(url);
  
  // Nếu đang dùng weserv proxy, thêm tham số resize
  if (baseUrl.includes('weserv.nl')) {
    return `${baseUrl}&w=${width}&h=${height}&fit=cover`;
  }
  
  return baseUrl;
}