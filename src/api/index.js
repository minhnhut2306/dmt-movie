// api/movieApi.js
import axios from 'axios';

const API_URL = 'https://phimapi.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const movieApi = {
  getLatestMovies: async (page = 0) => {
    try {
      const { data } = await api.get(`/danh-sach/phim-moi-cap-nhat-v3?page=${page}`);
      return data;
    } catch (error) {
      console.error('Error fetching latest movies:', error);
      throw error;
    }
  },

  // Additional methods you might need
  getFeaturedMovies: async () => {
    try {
      const { data } = await api.get('/danh-sach/phim-moi-cap-nhat-v3?page=0');
      return {
        ...data,
        data: {
          ...data.data,
          items: data.data?.items?.slice(0, 5) || []
        }
      };
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw error;
    }
  },

  getMoviesByCategory: async (category, page = 0) => {
    try {
      const { data } = await api.get(`/danh-sach/${category}?page=${page}`);
      return data;
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      throw error;
    }
  },
};