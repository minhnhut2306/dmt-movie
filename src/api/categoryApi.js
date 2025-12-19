// src/api/categoryApi.js
import { api } from "./baseApi";

export const categoryApi = {
  // Lấy danh sách thể loại
  getGenres: async () => {
    try {
      const { data } = await api.get("/v1/api/the-loai");
      console.log("Genres data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  },

  // Lấy danh sách quốc gia
  getCountries: async () => {
    try {
      const { data } = await api.get("/v1/api/quoc-gia");
      console.log("Countries data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  // Lấy danh sách năm phát hành
  getYears: async () => {
    try {
      const { data } = await api.get("/v1/api/nam-phat-hanh");
      console.log("Years data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching years:", error);
      throw error;
    }
  }
};