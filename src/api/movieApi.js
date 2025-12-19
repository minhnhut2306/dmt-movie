import { api, apiRequest } from "./baseApi";

export const movieApi = {
  // API chi tiết phim
  getMovieDetail: async (slug) => {
    try {
      const { data } = await api.get(`/v1/api/phim/${slug}`);
      console.log("Movie detail data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie detail:", error);
      throw error;
    }
  },

  // API hình ảnh phim (MỚI)
  getMovieImages: async (slug) => {
    try {
      const { data } = await api.get(`/v1/api/phim/${slug}/images`);
      console.log("Movie images data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie images:", error);
      throw error;
    }
  },

  // API diễn viên (MỚI)
  getMoviePeoples: async (slug) => {
    try {
      const { data } = await api.get(`/v1/api/phim/${slug}/peoples`);
      console.log("Movie peoples data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie peoples:", error);
      throw error;
    }
  },

  // API từ khóa (MỚI)
  getMovieKeywords: async (slug) => {
    try {
      const { data } = await api.get(`/v1/api/phim/${slug}/keywords`);
      console.log("Movie keywords data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie keywords:", error);
      throw error;
    }
  },

  // API Home
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

  getCountries: async () => {
    return apiRequest('/v1/api/quoc-gia');
  },

  getMoviesByCountry: async (countrySlug, page = 1) => {
    return apiRequest(`/v1/api/quoc-gia/${countrySlug}?page=${page}`);
  },

  getYears: async () => {
    return apiRequest('/v1/api/nam-phat-hanh');
  },

  getMoviesByYear: async (year, page = 1) => {
    return apiRequest(`/v1/api/nam-phat-hanh/${year}?page=${page}`);
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
          endpoint = `/v1/api/nam-phat-hanh/${categorySlug}?page=${page}`;
          break;
        case 'danh-sach':
          endpoint = `/v1/api/danh-sach/${categorySlug}?page=${page}`;
          break;
        default:
          throw new Error(`Unsupported category type: ${categoryType}`);
      }
      
      const { data } = await api.get(endpoint);
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

  getDubbedMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-thuyet-minh?page=${page}`),
  getVoiceoverMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-long-tieng?page=${page}`),
  getVietsubMovies: (page = 1) => apiRequest(`/v1/api/danh-sach/phim-vietsub?page=${page}`),
};