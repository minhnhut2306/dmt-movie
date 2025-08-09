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
};