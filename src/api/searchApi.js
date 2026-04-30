import { api } from "./baseApi";

export const searchApi = {
  searchMovies: async (keyword, page = 1) => {
    const { data } = await api.get(
      `/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`
    );
    return data;
  },
};
