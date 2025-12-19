// src/utils/CategoryConfig.js

/**
 * KHÔNG CÓ GÌ CỐ ĐỊNH - TẤT CẢ TỪ API
 * File này chỉ để config endpoint và helper functions
 */
export const CATEGORY_TYPES = {
  "the-loai": {
    title: "Thể Loại",
    apiEndpoint: (slug, page) => `/v1/api/the-loai/${slug}?page=${page}`,
  },
  "quoc-gia": {
    title: "Quốc Gia",
    apiEndpoint: (slug, page) => `/v1/api/quoc-gia/${slug}?page=${page}`,
  },
  "nam": {
    title: "Năm Phát Hành",
    apiEndpoint: (slug, page) => `/v1/api/nam/${slug}?page=${page}`,
  },
  "danh-sach": {
    title: "Danh Sách",
    apiEndpoint: (slug, page) => {
      if (slug === "phim-moi-cap-nhat") {
        return `/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
      }
      return `/v1/api/danh-sach/${slug}?page=${page}`;
    },
  },
};

/**
 * Lấy thông tin category cơ bản từ slug
 * Tên thật sẽ được lấy từ API
 */
export const getCategoryInfo = (categoryType, categorySlug) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return null;

  // Tạo tên tạm từ slug (sẽ được override bởi API data)
  const tempName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    name: tempName,
    type: categoryConfig.title,
    color: "bg-gray-700",
    apiEndpoint: categoryConfig.apiEndpoint(categorySlug, 1),
  };
};