// api/searchApi.js
import { api } from "./baseApi";

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