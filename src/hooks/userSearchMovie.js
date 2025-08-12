// hooks/useSearchMovie.js
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/index";

export const useSearchMovies = (keyword, page = 1, sortField = "created.time") => {
  return useQuery({
    queryKey: ["search-movies", keyword, page, sortField],
    queryFn: () => searchApi.searchMovies(keyword, page, sortField),
    enabled: !!keyword && keyword.trim().length > 0, // Chỉ gọi API khi có keyword
    staleTime: 2 * 60 * 1000, // 2 phút
    cacheTime: 5 * 60 * 1000, // 5 phút
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

// Hook gợi ý tìm kiếm (debounced)
export const useSearchSuggestions = (keyword) => {
  return useQuery({
    queryKey: ["search-suggestions", keyword],
    queryFn: () => searchApi.getSuggestions(keyword),
    enabled: !!keyword && keyword.trim().length >= 2, // Ít nhất 2 ký tự
    staleTime: 1 * 60 * 1000, // 1 phút
    cacheTime: 3 * 60 * 1000, // 3 phút
    retry: 1,
  });
};

// Transform function cho kết quả tìm kiếm
export const transformSearchResults = (data) => {
  return (
    data?.data?.items?.map((movie) => {
      // Helper function để xử lý poster URL
      const getPosterUrl = (posterUrl) => {
        if (!posterUrl) return "https://via.placeholder.com/300x450/374151/ffffff?text=No+Image";
        return posterUrl.startsWith("http") 
          ? posterUrl 
          : `https://phimimg.com/${posterUrl}`;
      };

      // Helper function để xử lý rating
      const getRating = (tmdb) => {
        if (!tmdb || !tmdb.vote_average || tmdb.vote_average <= 0) return null;
        return tmdb.vote_average.toFixed(1);
      };

      // Helper function để xử lý type
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