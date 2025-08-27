// api/movieApi.js
import axios from "axios";

const API_URL = "https://phimapi.com";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const movieApi = {
  // Generic request method for category pages
  request: async (endpoint) => {
    try {
      const { data } = await api.get(endpoint);
      console.log(`API Request: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

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
    try {
      const { data } = await api.get(
        `/danh-sach/phim-moi-cap-nhat-v3?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching latest movies:", error);
      throw error;
    }
  },

  getVietnamMovies: async (page = 4) => {
    try {
      const { data } = await api.get(`/v1/api/quoc-gia/viet-nam?page=${page}`);
      return data;
    } catch (error) {
      console.error("Error fetching Vietnam movies:", error);
      throw error;
    }
  },

  getSeriesMovies: async (page = 1) => {
    try {
      const { data } = await api.get(`/v1/api/danh-sach/phim-bo?page=${page}`);
      return data;
    } catch (error) {
      console.error("Error fetching series movies:", error);
      throw error;
    }
  },

  getSingleMovies: async (page = 1) => {
    try {
      const { data } = await api.get(`/v1/api/danh-sach/phim-le?page=${page}`);
      return data;
    } catch (error) {
      console.error("Error fetching single movies:", error);
      throw error;
    }
  },

  getTVShows: async (page = 1) => {
    try {
      const { data } = await api.get(`/v1/api/danh-sach/tv-shows?page=${page}`);
      return data;
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      throw error;
    }
  },

  getAnimationMovies: async (page = 1) => {
    try {
      const { data } = await api.get(
        `/v1/api/danh-sach/hoat-hinh?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching animation movies:", error);
      throw error;
    }
  },

  getActionMovies: async (page = 1) => {
    try {
      const { data } = await api.get(
        `/v1/api/the-loai/hanh-dong?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching action movies:", error);
      throw error;
    }
  },
  getHorrorMovies: async (page = 1) => {
    try {
      const { data } = await api.get(
        `/v1/api/the-loai/kinh-di?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching horror movies:", error);
      throw error;
    }
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

  getMoviesByCategory: async (category, page = 1) => {
    try {
      const { data } = await api.get(`/danh-sach/${category}?page=${page}`);
      return data;
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      throw error;
    }
  },

  // Category-specific methods for better flexibility
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
};

export const searchApi = {
  searchMovies: async (keyword, page = 1) => {
    try {
      console.log(`🔍 Searching movies - Keyword: "${keyword}", Page: ${page}`);
      const { data } = await api.get(
        `/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`
      );
      console.log("Search results:", data);
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  getSuggestions: async (keyword) => {
    try {
      const { data } = await api.get(
        `/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=1`
      );
      return {
        ...data,
        data: {
          ...data.data,
        }
      };
    } catch (error) {
      console.error("Error getting suggestions:", error);
      throw error;
    }
  }
};