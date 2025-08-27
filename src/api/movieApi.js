// api/movieApi.js
import { api, apiRequest } from "./baseApi";

export const movieApi = {
  getMovieDetail: async (slug) => {
    try {
      const { data } = await api.get(`/phim/${slug}`);
      console.log("Movie detail data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie detail:", error);
      throw error;
    }
  },

  getLatestMovies: async (page = 2) => {
    return apiRequest(`/danh-sach/phim-moi-cap-nhat-v3?page=${page}`);
  },

  getFeaturedMovies: async () => {
    try {
      const { data } = await api.get("/danh-sach/phim-moi-cap-nhat-v3?page=1");
      return {
        ...data,
        data: {
          ...data.data,
          items: data.data?.items?.slice(0, 5) || [],
        },
      };
    } catch (error) {
      console.error("Error fetching featured movies:", error);
      throw error;
    }
  },

  getCategoryMovies: async (categoryType, categorySlug, page = 1) => {
    try {
      let endpoint;
      
      switch (categoryType) {
        case 'the-loai':
          endpoint = `/v1/api/the-loai/${categorySlug}?page=${page}`;
          break;
        case 'quoc-gia':
          endpoint = `/v1/api/quoc-gia/${categorySlug}?page=${page}`;
          break;
        case 'nam':
          endpoint = `/v1/api/nam/${categorySlug}?page=${page}`;
          break;
        case 'danh-sach':
          endpoint = `/v1/api/danh-sach/${categorySlug}?page=${page}`;
          break;
        default:
          throw new Error(`Unsupported category type: ${categoryType}`);
      }
      
      const { data } = await api.get(endpoint);
      console.log(`Category API: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching category ${categoryType}/${categorySlug}:`, error);
      throw error;
    }
  },

  getVietnamMovies: (page = 1) => apiRequest(`/v1/api/quoc-gia/viet-nam?page=${page}`),
  getChinaMovies: (page = 1) => apiRequest(`/v1/api/quoc-gia/trung-quoc?page=${page}`),
  getJapanMovies: (page = 1) => apiRequest(`/v1/api/quoc-gia/nhat-ban?page=${page}`),
  
  getSeriesMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-bo?page=${page}`),
  getSingleMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-le?page=${page}`),
  getTVShows: (page = 1) => apiRequest(`/v1/api/danh-sach/tv-shows?page=${page}`),
  
  getAnimationMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/hoat-hinh?page=${page}`),
  getActionMovies: (page = 1) => apiRequest(`/v1/api/the-loai/hanh-dong?page=${page}`),
  getHorrorMovies: (page = 1) => apiRequest(`/v1/api/the-loai/kinh-di?page=${page}`),
  getAdventureMovies: (page = 1) => apiRequest(`/v1/api/the-loai/phieu-luu?page=${page}`),
  getHistoryMovies: (page = 1) => apiRequest(`/v1/api/the-loai/co-trang?page=${page}`),
};