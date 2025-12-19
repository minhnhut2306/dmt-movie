// src/utils/imageHelper.js

/**
 * Tạo URL ảnh an toàn với fallback và proxy
 * Ophim1 API trả về đường dẫn tương đối hoặc full URL
 */
export function getSafeImageUrl(url, fallbackText = "No Image") {
  // Fallback nếu thiếu URL
  if (!url) {
    return `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  }

  // Nếu là URL đầy đủ
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Nếu đã là từ img.ophim hoặc CDN khác, giữ nguyên
    if (url.includes('img.ophim') || url.includes('phimimg.com')) {
      return url;
    }
    
    // Các URL khác thử dùng proxy
    try {
      const u = new URL(url);
      const hostAndPath = `${u.hostname}${u.pathname}${u.search}`;
      return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}`;
    } catch {
      return url;
    }
  }

  // Nếu là đường dẫn tương đối từ Ophim
  // Ophim1 API thường trả về: "uploads/movies/xxx.jpg"
  let fullUrl;
  
  if (url.startsWith('/uploads/')) {
    // Đường dẫn bắt đầu bằng /uploads/
    fullUrl = `https://img.ophim.live${url}`;
  } else if (url.startsWith('uploads/')) {
    // Đường dẫn không có / ở đầu
    fullUrl = `https://img.ophim.live/${url}`;
  } else {
    // Các trường hợp khác
    fullUrl = `https://img.ophim.live/uploads/movies/${url}`;
  }
  
  return fullUrl;
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