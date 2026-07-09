import { api, apiRequest } from "./baseApi";

export const movieApi = {
  getMovieDetail: async (slug) => {
    const { data } = await api.get(`/phim/${slug}`);
    return data;
  },

  getLatestMovies: (page = 2) => apiRequest(`/v1/api/home?page=${page}`),

  // Dùng apiRequest để dedup với getLatestMovies page=1
  getFeaturedMovies: async () => {
    const data = await apiRequest("/v1/api/home?page=1");
    return {
      ...data,
      data: { ...data.data, items: data.data?.items?.slice(0, 5) ?? [] },
    };
  },

  getCategoryMovies: async (categoryType, categorySlug, page = 1) => {
    let endpoint;
    switch (categoryType) {
      case "the-loai":
        endpoint = `/v1/api/the-loai/${categorySlug}?page=${page}`;
        break;
      case "quoc-gia":
        endpoint = `/v1/api/quoc-gia/${categorySlug}?page=${page}`;
        break;
      case "nam":
        endpoint = `/v1/api/nam/${categorySlug}?page=${page}`;
        break;
      case "danh-sach":
        // phim-moi-cap-nhat dùng endpoint home riêng
        endpoint =
          categorySlug === "phim-moi-cap-nhat"
            ? `/v1/api/home?page=${page}`
            : `/v1/api/danh-sach/${categorySlug}?page=${page}`;
        break;
      default:
        throw new Error(`Unsupported category type: ${categoryType}`);
    }
    const { data } = await api.get(endpoint);
    return data;
  },

  getVietnamMovies: (page = 1) =>
    apiRequest(`/v1/api/quoc-gia/viet-nam?page=${page}`),
  getChinaMovies: (page = 1) =>
    apiRequest(`/v1/api/quoc-gia/trung-quoc?page=${page}`),
  getJapanMovies: (page = 1) =>
    apiRequest(`/v1/api/quoc-gia/nhat-ban?page=${page}`),

  getSeriesMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-bo?page=${page}`),
  getSingleMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-le?page=${page}`),
  getTVShows: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/tv-shows?page=${page}`),

  getAnimationMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/hoat-hinh?page=${page}`),
  getActionMovies: (page = 1) =>
    apiRequest(`/v1/api/the-loai/hanh-dong?page=${page}`),
  getHorrorMovies: (page = 1) =>
    apiRequest(`/v1/api/the-loai/kinh-di?page=${page}`),
  getAdventureMovies: (page = 1) =>
    apiRequest(`/v1/api/the-loai/phieu-luu?page=${page}`),
  getHistoryMovies: (page = 1) =>
    apiRequest(`/v1/api/the-loai/co-trang?page=${page}`),

  getDubbedMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-thuyet-minh?page=${page}`),
  getVoiceoverMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-long-tieng?page=${page}`),
  getVietsubMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-vietsub?page=${page}`),
  getCinemaMovies: (page = 1) =>
    apiRequest(`/v1/api/danh-sach/phim-chieu-rap?page=${page}`),

  getAllGenres: async () => {
    const data = await apiRequest("/the-loai");
    if (Array.isArray(data)) return data;
    return data?.data?.items || [];
  },

  getAllCountries: async () => {
    const data = await apiRequest("/quoc-gia");
    if (Array.isArray(data)) return data;
    return data?.data?.items || [];
  },

  getMovieImages: (slug) => apiRequest(`/v1/api/phim/${slug}/images`),
};
