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

  // API Home cho featured movies
  getHomeData: async () => {
    try {
      const { data } = await api.get("/v1/api/home");
      console.log("Home data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching home data:", error);
      throw error;
    }
  },

  getFeaturedMovies: async () => {
    try {
      const { data } = await api.get("/v1/api/home");
      // Lấy items từ home API
      const items = data?.data?.items || [];
      return {
        status: "success",
        data: {
          items: items.slice(0, 5) || []
        }
      };
    } catch (error) {
      console.error("Error fetching featured movies:", error);
      throw error;
    }
  },

  getLatestMovies: async (page = 1) => {
    return apiRequest(`/v1/api/danh-sach/phim-moi?page=${page}`);
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
      
      console.log(`Fetching category: ${categoryType}/${categorySlug} from endpoint: ${endpoint}`);
      
      const { data } = await api.get(endpoint);
      console.log(`Category API Response:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching category ${categoryType}/${categorySlug}:`, error);
      throw error;
    }
  },

  // Danh sách phim
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

  getDubbedMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-thuyet-minh?page=${page}`),
  getVoiceoverMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-long-tieng?page=${page}`),
  getVietsubMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-vietsub?page=${page}`),
};