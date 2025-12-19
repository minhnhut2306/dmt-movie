// src/utils/imageHelper.js

/**
 * Lấy URL ảnh an toàn với fallback
 * Priority: img.ophim.live -> ophim1.com -> phimimg.com -> backup CDN -> placeholder
 */
export function getSafeImageUrl(url, fallbackText = "No Image") {
  const placeholder = `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  
  if (!url || url === 'null' || url === null || url === undefined) {
    return placeholder;
  }

  // Nếu là URL đầy đủ
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Ưu tiên các CDN chính thức của Ophim
    if (url.includes('img.ophim') || url.includes('ophim.cc')) {
      return url;
    }
    
    // Phimimg.com CDN backup
    if (url.includes('phimimg.com')) {
      return url;
    }
    
    // Thử proxy cho các URL khác
    try {
      const u = new URL(url);
      const hostAndPath = `${u.hostname}${u.pathname}${u.search}`;
      return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}&default=${encodeURIComponent(placeholder)}`;
    } catch {
      return placeholder;
    }
  }

  // Nếu là đường dẫn tương đối từ Ophim
  let fullUrl;
  
  if (url.startsWith('/uploads/')) {
    fullUrl = `https://img.ophim.live${url}`;
  } else if (url.startsWith('uploads/')) {
    fullUrl = `https://img.ophim.live/${url}`;
  } else {
    fullUrl = `https://img.ophim.live/uploads/movies/${url}`;
  }
  
  return fullUrl;
}

/**
 * Lấy danh sách URL ảnh để thử lần lượt (dùng cho fallback tự động)
 * Trả về array các URL để thử theo thứ tự
 */
export function getImageUrlCandidates(url, fallbackText = "No Image") {
  const placeholder = `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  
  if (!url || url === 'null' || url === null) {
    return [placeholder];
  }

  const candidates = [];
  
  // Nếu là URL đầy đủ
  if (url.startsWith("http")) {
    candidates.push(url);
    
    // Thêm proxy backup
    try {
      const u = new URL(url);
      const hostPath = `${u.hostname}${u.pathname}${u.search}`;
      candidates.push(`https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}`);
      candidates.push(`https://wsrv.nl/?url=${encodeURIComponent(hostPath)}`);
    } catch {
      // Bỏ qua lỗi URL
    }
  } else {
    // Đường dẫn tương đối - thử nhiều domain
    const cdnDomains = [
      'https://img.ophim.live',
      'https://img.ophim1.com',
      'https://phimimg.com'
    ];
    
    const path = url.startsWith('/uploads/') ? url : 
                 url.startsWith('uploads/') ? `/${url}` :
                 `/uploads/movies/${url}`;
    
    cdnDomains.forEach(domain => {
      candidates.push(`${domain}${path}`);
    });
  }
  
  // Thêm placeholder cuối cùng
  candidates.push(placeholder);
  
  // Loại bỏ trùng lặp
  return Array.from(new Set(candidates));
}

/**
 * Lấy URL poster với kích thước tối ưu
 */
export function getOptimizedPosterUrl(url, width = 300, height = 450) {
  const baseUrl = getSafeImageUrl(url);
  
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
  
  if (baseUrl.includes('weserv.nl')) {
    return `${baseUrl}&w=${width}&h=${height}&fit=cover`;
  }
  
  return baseUrl;
}