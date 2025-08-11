// hooks/useMovies.js
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api";

// ==================== HOOKS ====================

// Hook để lấy chi tiết phim
export const useMovieDetail = (slug) => {
  return useQuery({
    queryKey: ["movie-detail", slug],
    queryFn: () => movieApi.getMovieDetail(slug),
    //logging the data for debugging
    onSuccess: (data) => {
      console.log("Fetched movie detail:", data);
    },
    enabled: !!slug, // Chỉ gọi API khi có slug
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 1. Hook for latest movies
export const useMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", page],
    queryFn: () => movieApi.getLatestMovies(page),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 2. Hook for Vietnam movies
export const useVietnamMovies = (page) => {
  const actualPage = page !== undefined ? page : 4;

  return useQuery({
    queryKey: ["vietnam-movies", actualPage],
    queryFn: () => {
      console.log(`🇻🇳 Fetching Vietnam Movies - Page: ${actualPage}`);
      return movieApi.getVietnamMovies(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 3. Hook for Series movies (Phim Bộ)
export const useSeriesMovies = (page) => {
  const actualPage = page !== undefined ? page : 1;

  return useQuery({
    queryKey: ["series-movies", actualPage],
    queryFn: () => {
      console.log(`📺 Fetching Series Movies - Page: ${actualPage}`);
      return movieApi.getSeriesMovies(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 4. Hook for Single movies (Phim Lẻ)
export const useSingleMovies = (page) => {
  const actualPage = page !== undefined ? page : 1;

  return useQuery({
    queryKey: ["single-movies", actualPage],
    queryFn: () => {
      console.log(`🎬 Fetching Single Movies - Page: ${actualPage}`);
      return movieApi.getSingleMovies(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 5. Hook for TV Shows
export const useTVShows = (page) => {
  const actualPage = page !== undefined ? page : 1;

  return useQuery({
    queryKey: ["tv-shows", actualPage],
    queryFn: () => {
      console.log(`📻 Fetching TV Shows - Page: ${actualPage}`);
      return movieApi.getTVShows(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 6. Hook for Animation movies
export const useAnimationMovies = (page) => {
  const actualPage = page !== undefined ? page : 1;

  return useQuery({
    queryKey: ["animation-movies", actualPage],
    queryFn: () => {
      console.log(`🎨 Fetching Animation Movies - Page: ${actualPage}`);
      return movieApi.getAnimationMovies(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 7. Hook for Action movies
export const useActionMovies = (page) => {
  const actualPage = page !== undefined ? page : 1;
  return useQuery({
    queryKey: ["action-movies", actualPage],
    queryFn: () => {
      console.log(`💥 Fetching Action Movies - Page: ${actualPage}`);
      return movieApi.getActionMovies(actualPage);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// ==================== TRANSFORM FUNCTIONS ====================

// Transform function cho movie detail
export const transformMovieDetail = (data) => {
  if (!data || !data.movie) return null;
  
  const movie = data.movie;
  
  return {
    id: movie._id,
    name: movie.name,
    origin_name: movie.origin_name,
    content: movie.content,
    poster_url: movie.poster_url,
    thumb_url: movie.thumb_url,
    time: movie.time,
    episode_current: movie.episode_current,
    episode_total: movie.episode_total,
    quality: movie.quality,
    lang: movie.lang,
    year: movie.year,
    vote_average: movie.tmdb?.vote_average || 0,
    vote_count: movie.tmdb?.vote_count || 0,
    actor: movie.actor || [],
    director: movie.director || [],
    category: movie.category || [],
    country: movie.country || [],
    episodes: data.episodes || [],
    type: movie.type,
    slug: movie.slug,
    created: movie.created,
    modified: movie.modified,
  };
};

// 1. Transform function for latest movies
export const transformLatestMovies = (data) => {
  return (
    data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url,
      thumbnail: movie.thumb_url,
      rating: movie.tmdb?.vote_average?.toFixed(1),
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type:
        movie.type === "series"
          ? "Phim Bộ"
          : movie.type === "single"
          ? "Phim Lẻ"
          : movie.type === "tvshows"
          ? "TV Shows"
          : movie.type,
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      modifiedTime: movie.modified?.time,
    })) || []
  );
};

// 2. Transform function for Vietnam movies
export const transformVietnamMovies = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Việt Nam",
      type:
        movie.type === "series"
          ? "Phim Bộ"
          : movie.type === "single"
          ? "Phim Lẻ"
          : movie.type === "tvshows"
          ? "TV Shows"
          : movie.type,
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};

// 3. Transform function for Series movies
export const transformSeriesMovies = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: "Phim Bộ",
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};

// 4. Transform function for Single movies
export const transformSingleMovies = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: "Phim Lẻ",
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};

// 5. Transform function for TV Shows
export const transformTVShows = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: "TV Shows",
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};

// 6. Transform function for Animation movies
export const transformAnimationMovies = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Hoạt hình",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: "Phim Hoạt Hình",
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};

// 7. Transform function for Action movies
export const transformActionMovies = (data) => {
  return (
    data?.data?.items?.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating:
        movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : null,
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Hành động",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: "Phim Hành Động",
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    })) || []
  );
};