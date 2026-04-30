// hooks/useSearchMovie.js - OPTIMIZED
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/index";

export const useSearchMovies = (keyword, page = 1, sortField = "created.time") => {
  return useQuery({
    queryKey: ["search-movies", keyword, page, sortField],
    queryFn: () => searchApi.searchMovies(keyword, page, sortField),
    enabled: !!keyword && keyword.trim().length > 0,
    staleTime: 5 * 60 * 1000, // Tăng từ 2 phút lên 5 phút
    gcTime: 15 * 60 * 1000, // Tăng từ 5 phút lên 15 phút
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false, // Tắt refetch khi focus
  });
};

export const useSearchSuggestions = (keyword) => {
  return useQuery({
    queryKey: ["search-suggestions", keyword],
    queryFn: () => searchApi.getSuggestions(keyword),
    enabled: !!keyword && keyword.trim().length >= 2, 
    staleTime: 3 * 60 * 1000, // Tăng từ 1 phút lên 3 phút
    gcTime: 10 * 60 * 1000, // Tăng từ 3 phút lên 10 phút
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const transformSearchResults = (data) => {
  return (
    data?.data?.items?.map((movie) => {
      const getPosterUrl = (posterUrl) => {
        if (!posterUrl) return "https://via.placeholder.com/300x450/374151/ffffff?text=No+Image";
        return posterUrl.startsWith("http") 
          ? posterUrl 
          : `https://phimimg.com/${posterUrl}`;
      };

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
        poster: getPosterUrl(movie.poster_url),
        thumbnail: getPosterUrl(movie.thumb_url),
        rating: getRating(movie.tmdb),
        year: movie.year || 'N/A',
        duration: movie.time || '',
        genre: movie.category?.[0]?.name || 'Chưa phân loại',
        country: movie.country?.[0]?.name || 'Chưa xác định',
        type: getMovieType(movie.type),
        quality: movie.quality || 'SD',
        language: movie.lang || 'Vietsub',
        episode: movie.episode_current || '',
        slug: movie.slug,
        isExclusive: movie.sub_docquyen || false,
        isInCinema: movie.chieurap || false,
        modifiedTime: movie.modified?.time,
        createdTime: movie.created?.time,
      };
    }) || []
  );
};