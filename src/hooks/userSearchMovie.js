// hooks/useSearchMovie.js
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/index";

export const useSearchMovies = (keyword, page = 1, sortField = "created.time") => {
  return useQuery({
    queryKey: ["search-movies", keyword, page, sortField],
    queryFn: () => searchApi.searchMovies(keyword, page, sortField),
    enabled: !!keyword && keyword.trim().length > 0,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

export const useSearchSuggestions = (keyword) => {
  return useQuery({
    queryKey: ["search-suggestions", keyword],
    queryFn: () => searchApi.getSuggestions(keyword),
    enabled: !!keyword && keyword.trim().length >= 2,
    staleTime: 1 * 60 * 1000,
    cacheTime: 3 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Transform search results với xử lý poster URL đúng
 */
export const transformSearchResults = (data) => {
  const items = data?.data?.items || [];
  
  console.log("🔍 Transform search results:", {
    totalItems: items.length,
    sampleItem: items[0]
  });

  return items.map((movie) => {
    // ✅ FIX: Xử lý poster_url đúng cách
    const getPosterUrl = (movie) => {
      // Thử các trường theo thứ tự ưu tiên
      const posterUrl = movie.poster_url || movie.thumb_url || movie.poster || movie.thumbnail;
      
      if (!posterUrl) {
        return null; // Trả về null để component tự xử lý
      }

      // Nếu là URL đầy đủ
      if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
        return posterUrl;
      }

      // Nếu là đường dẫn tương đối
      if (posterUrl.startsWith('/uploads/')) {
        return `https://img.ophim.live${posterUrl}`;
      }
      
      if (posterUrl.startsWith('uploads/')) {
        return `https://img.ophim.live/${posterUrl}`;
      }

      // Default: thêm prefix đầy đủ
      return `https://img.ophim.live/uploads/movies/${posterUrl}`;
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
      return typeMap[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Chưa xác định');
    };

    const posterUrl = getPosterUrl(movie);
    const thumbUrl = movie.thumb_url ? getPosterUrl({ poster_url: movie.thumb_url }) : posterUrl;

    return {
      id: movie._id,
      title: movie.name || 'Không có tên',
      originalTitle: movie.origin_name || movie.name,
      
      // ✅ Đảm bảo có poster và thumbnail
      poster: posterUrl,
      poster_url: posterUrl,
      thumbnail: thumbUrl,
      thumb_url: thumbUrl,
      
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
  });
};