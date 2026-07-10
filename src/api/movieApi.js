import { api, apiRequest } from "./baseApi";

// Chọn ảnh TMDB tốt nhất theo type ('poster' | 'backdrop')
// Ưu tiên ảnh không có chữ (textless, iso_639_1 null) > ảnh tiếng Việt > ảnh đầu tiên
const pickBestTmdbImage = (images, type) => {
  const matches = images?.filter((img) => img.type === type) || [];
  if (matches.length === 0) return null;
  return (
    matches.find((img) => !img.iso_639_1) ||
    matches.find((img) => img.iso_639_1 === "vi") ||
    matches[0]
  );
};

export const movieApi = {
  getMovieDetail: async (slug) => {
    const { data } = await api.get(`/phim/${slug}`);
    return data;
  },

  // Ảnh chất lượng cao từ TMDB (poster/backdrop gốc, nét hơn nhiều so với ảnh mặc định)
  getMovieImages: async (slug) => {
    if (!slug) return null;
    try {
      const body = await apiRequest(`/v1/api/phim/${slug}/images`);
      const payload = body?.data;
      const images = payload?.images;
      const sizes = payload?.image_sizes;
      if (!images || !sizes) return null;

      const bestPoster = pickBestTmdbImage(images, "poster");
      const bestBackdrop = pickBestTmdbImage(images, "backdrop");

      const posterBase = sizes.poster?.w500 || sizes.poster?.original;
      const backdropBase = sizes.backdrop?.w1280 || sizes.backdrop?.original;

      return {
        poster: bestPoster && posterBase ? `${posterBase}${bestPoster.file_path}` : null,
        backdrop: bestBackdrop && backdropBase ? `${backdropBase}${bestBackdrop.file_path}` : null,
      };
    } catch {
      return null;
    }
  },

  // Diễn viên/đoàn làm phim TMDB theo slug — cùng pattern với getMovieImages ở trên.
  // Lưu ý: endpoint /credits chưa được xác nhận tồn tại trên phimapi.com (chỉ /images được xác nhận),
  // nên hàm này trả về null an toàn nếu endpoint 404/lỗi — UI sẽ tự fallback về danh sách diễn viên gốc.
  getMovieCredits: async (slug) => {
    if (!slug) return null;
    try {
      const body = await apiRequest(`/v1/api/phim/${slug}/credits`);
      const payload = body?.data;
      const people = payload?.people || payload?.cast || payload?.credits;
      if (!Array.isArray(people) || people.length === 0) return null;

      const fallbackBase = payload?.image_sizes?.profile?.w185 || "https://image.tmdb.org/t/p/w185";

      return people.map((p) => {
        const profileBase = p.profile_sizes?.w185 || fallbackBase;
        return {
          id: p.tmdb_people_id ?? p.id ?? p.name,
          name: p.name,
          character: p.character || "",
          department: p.known_for_department || p.department || "",
          gender: p.gender_name || "",
          profileUrl: p.profile_path ? `${profileBase}${p.profile_path}` : null,
        };
      });
    } catch {
      return null;
    }
  },

  getLatestMovies: (page = 2) =>
    apiRequest(`/v1/api/home?page=${page}`),

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
        // phim-moi-cap-nhat dùng endpoint home
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
    return Array.isArray(data?.data?.items) ? data.data.items : [];
  },

  getAllCountries: async () => {
    const data = await apiRequest("/quoc-gia");
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.data?.items) ? data.data.items : [];
  },
};
