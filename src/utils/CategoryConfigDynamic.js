// utils/CategoryConfigDynamic.js - DYNAMIC VERSION (từ API)
import { useAllGenres, useAllCountries } from "../hooks/useMovies";

// ============================================
// STATIC CONFIG - Không thay đổi
// ============================================
export const CATEGORY_TYPES = {
  "the-loai": {
    title: "Thể Loại",
    apiEndpoint: (slug, page) => `/v1/api/the-loai/${slug}?page=${page}`,
  },
  "quoc-gia": {
    title: "Quốc Gia",
    apiEndpoint: (slug, page) => `/v1/api/quoc-gia/${slug}?page=${page}`,
  },
  nam: {
    title: "Năm Phát Hành",
    apiEndpoint: (slug, page) => `/v1/api/nam/${slug}?page=${page}`,
  },
  "danh-sach": {
    title: "Danh Sách",
    apiEndpoint: (slug, page) => {
      if (slug === "phim-moi-cap-nhat") {
        return `/v1/api/home?page=${page}`;
      }
      return `/v1/api/danh-sach/${slug}?page=${page}`;
    },
  },
};

// ============================================
// STATIC LISTS - Không cần API
// ============================================
// Tự động generate năm từ 1980 đến năm hiện tại
const currentYear = new Date().getFullYear();
const startYear = 1980;
const yearCount = currentYear - startYear + 1;

export const STATIC_YEARS = Array.from({ length: yearCount }, (_, i) => {
  const year = currentYear - i; // Bắt đầu từ năm hiện tại, giảm dần
  return {
    slug: year.toString(),
    name: year.toString(),
    categoryType: "nam",
    fullPath: `/category/nam/${year}`,
  };
});

export const STATIC_SPECIAL_LISTS = [
  { slug: "phim-moi-cap-nhat", name: "Phim Mới Cập Nhật" },
  { slug: "phim-bo", name: "Phim Bộ" },
  { slug: "phim-le", name: "Phim Lẻ" },
  { slug: "tv-shows", name: "TV Shows" },
  { slug: "hoat-hinh", name: "Hoạt Hình" },
  { slug: "phim-chieu-rap", name: "Phim Chiếu Rạp" },
  { slug: "phim-vietsub", name: "Phim Vietsub" },
  { slug: "phim-thuyet-minh", name: "Phim Thuyết Minh" },
  { slug: "phim-long-tieng", name: "Phim Lồng Tiếng" },
].map(item => ({
  ...item,
  categoryType: "danh-sach",
  fullPath: `/category/danh-sach/${item.slug}`,
}));

// ============================================
// TRANSFORM API RESPONSE
// ============================================
const transformCategoryData = (data, categoryType) => {
  // API trả về array trực tiếp, không có data.data.items
  if (!data || !Array.isArray(data)) {
    console.warn('Invalid category data:', data);
    return [];
  }
  
  return data.map(item => ({
    slug: item.slug,
    name: item.name,
    categoryType,
    fullPath: `/category/${categoryType}/${item.slug}`,
  }));
};

// ============================================
// REACT HOOKS - Fetch từ API (NO FALLBACK)
// ============================================
export const useDynamicGenres = () => {
  const { data, isLoading, error } = useAllGenres();
  
  // Không dùng fallback - chỉ dùng data từ API
  const genres = data ? transformCategoryData(data, "the-loai") : [];
  
  return { 
    genres, 
    isLoading,
    error
  };
};

export const useDynamicCountries = () => {
  const { data, isLoading, error } = useAllCountries();
  
  // Không dùng fallback - chỉ dùng data từ API
  const countries = data ? transformCategoryData(data, "quoc-gia") : [];
  
  return { 
    countries,
    isLoading,
    error
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getCategoryInfo = (categoryType, categorySlug, categories = []) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return null;

  // Tìm trong danh sách dynamic
  const categoryInfo = categories.find(cat => cat.slug === categorySlug);
  
  if (!categoryInfo) return null;

  return {
    name: categoryInfo.name,
    slug: categoryInfo.slug,
    type: categoryConfig.title,
    apiEndpoint: categoryConfig.apiEndpoint(categorySlug, 1),
  };
};

// ============================================
// EXPORTS - Backward compatibility
// ============================================
export const ALL_YEARS = STATIC_YEARS;
export const ALL_SPECIAL_LISTS = STATIC_SPECIAL_LISTS;

// Note: ALL_GENRES và ALL_COUNTRIES giờ phải dùng hooks:
// - useDynamicGenres() 
// - useDynamicCountries()
