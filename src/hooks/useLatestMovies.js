// hooks/useLatestMovies.js
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api";
import { getSafeImageUrl } from "../utils/imageHelper";

const queryOptions = {
  staleTime: 5 * 60 * 1000, // 5 phút
  cacheTime: 10 * 60 * 1000, // 10 phút
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Hook lấy dữ liệu từ home API
export const useHomeMovies = () => {
  return useQuery({
    queryKey: ["home-movies"],
    queryFn: () => movieApi.getHomeData(),
    ...queryOptions,
  });
};

// Transform function cho phim từ home API
export const transformHomeMovies = (data) => {
  if (!data?.data?.items) return [];

  return data.data.items.map((movie) => {
    const getRating = (tmdb) => {
      if (!tmdb || !tmdb.vote_average || tmdb.vote_average <= 0) return null;
      return tmdb.vote_average.toFixed(1);
    };

    const getMovieType = (type) => {
      const typeMap = {
        'hoathinh': 'Hoạt Hình',
        'series': 'Phim Bộ',
        'single': 'Phim Lẻ',
        'tvshows': 'TV Shows'
      };
      return typeMap[type] || type?.charAt(0)?.toUpperCase() + type?.slice(1) || 'Chưa xác định';
    };

    return {
      id: movie._id,
      title: movie.name || 'Không có tên',
      originalTitle: movie.origin_name || movie.name,
      poster: getSafeImageUrl(movie.poster_url, movie.name),
      thumbnail: getSafeImageUrl(movie.thumb_url, movie.name),
      rating: getRating(movie.tmdb),
      year: movie.year || 'N/A',
      duration: movie.time || '',
      genre: movie.category?.[0]?.name || 'Chưa phân loại',
      country: movie.country?.[0]?.name || 'Chưa xác định',
      type: getMovieType(movie.type),
      quality: movie.quality || 'HD',
      language: movie.lang || 'Vietsub',
      episode: movie.episode_current || '',
      slug: movie.slug,
      isExclusive: movie.sub_docquyen || false,
      isInCinema: movie.chieurap || false,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    };
  });
};