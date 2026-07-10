// hooks/useMovies.js - OPTIMIZED VERSION
import { useQuery, useQueries } from "@tanstack/react-query";
import { movieApi } from "../api";

// Shared query options với cache tối ưu
const DEFAULT_QUERY_OPTIONS = {
  staleTime: 15 * 60 * 1000, // 15 phút
  gcTime: 60 * 60 * 1000, // 60 phút
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: false,
  networkMode: 'online',
};

// ============================================
// UNIFIED HOOK - Thay thế 15 hooks cũ
// ============================================
export const useMovieCategory = (category, page = 1, options = {}) => {
  return useQuery({
    queryKey: ["movies", category, page],
    queryFn: () => {
      const apiMethod = movieApi[category];
      if (!apiMethod) {
        throw new Error(`Invalid category: ${category}`);
      }
      return apiMethod(page);
    },
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

// ============================================
// MOVIE DETAIL HOOK
// ============================================
export const useMovieDetail = (slug) => {
  return useQuery({
    queryKey: ["movie-detail", slug],
    queryFn: () => movieApi.getMovieDetail(slug),
    enabled: !!slug,
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 30 * 60 * 1000, // 30 phút cho detail
  });
};

// ============================================
// MOVIE IMAGES HOOK - Ảnh chất lượng cao từ TMDB (poster/backdrop nét hơn)
// ============================================
export const useMovieImages = (slug) => {
  return useQuery({
    queryKey: ["movie-images", slug],
    queryFn: () => movieApi.getMovieImages(slug),
    enabled: !!slug,
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ - ảnh TMDB gần như không đổi
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ============================================
// MOVIE CREDITS HOOK - Diễn viên/đoàn làm phim TMDB theo slug
// ============================================
export const useMovieCredits = (slug) => {
  return useQuery({
    queryKey: ["movie-credits", slug],
    queryFn: () => movieApi.getMovieCredits(slug),
    enabled: !!slug,
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ - thông tin diễn viên gần như không đổi
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Fetch ảnh TMDB chất lượng cao cho nhiều phim cùng lúc (vd: hero banner)
export const useMovieImagesBatch = (slugs = []) => {
  return useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["movie-images", slug],
      queryFn: () => movieApi.getMovieImages(slug),
      enabled: !!slug,
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });
};

// ============================================
// CONVENIENCE HOOKS - Wrapper cho dễ dùng
// ============================================
export const useLatestMovies = (page = 1) => 
  useMovieCategory("getLatestMovies", page);

export const useFeaturedMovies = () => 
  useQuery({
    queryKey: ["movies", "featured"],
    queryFn: () => movieApi.getFeaturedMovies(),
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 30 * 60 * 1000, // Featured movies cache lâu hơn
  });

export const useVietnamMovies = (page = 1) => 
  useMovieCategory("getVietnamMovies", page);

export const useChinaMovies = (page = 1) => 
  useMovieCategory("getChinaMovies", page);

export const useJapanMovies = (page = 1) => 
  useMovieCategory("getJapanMovies", page);

export const useSeriesMovies = (page = 1) => 
  useMovieCategory("getSeriesMovies", page);

export const useSingleMovies = (page = 1) => 
  useMovieCategory("getSingleMovies", page);

export const useTVShows = (page = 1) => 
  useMovieCategory("getTVShows", page);

export const useAnimationMovies = (page = 1) => 
  useMovieCategory("getAnimationMovies", page);

export const useActionMovies = (page = 1) => 
  useMovieCategory("getActionMovies", page);

export const useHorrorMovies = (page = 1) => 
  useMovieCategory("getHorrorMovies", page);

export const useAdventureMovies = (page = 1) => 
  useMovieCategory("getAdventureMovies", page);

export const useHistoryMovies = (page = 1) => 
  useMovieCategory("getHistoryMovies", page);

export const useDubbedMovies = (page = 1) => 
  useMovieCategory("getDubbedMovies", page);

export const useVoiceoverMovies = (page = 1) => 
  useMovieCategory("getVoiceoverMovies", page);

export const useVietsubMovies = (page = 1) => 
  useMovieCategory("getVietsubMovies", page);

export const useCinemaMovies = (page = 1) => 
  useMovieCategory("getCinemaMovies", page);

// ============================================
// CATEGORY HOOK - Cho CategoryPage
// ============================================
export const useCategoryMovies = (categoryType, categorySlug, page = 1) => {
  return useQuery({
    queryKey: ["category", categoryType, categorySlug, page],
    queryFn: () => movieApi.getCategoryMovies(categoryType, categorySlug, page),
    enabled: !!categoryType && !!categorySlug,
    ...DEFAULT_QUERY_OPTIONS,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status === 404 || status === 400) return false;
      return failureCount < 2;
    },
  });
};

// ============================================
// CATEGORY LIST HOOKS - Lấy danh sách categories từ API
// ============================================
export const useAllGenres = () => {
  return useQuery({
    queryKey: ["categories", "genres"],
    queryFn: () => movieApi.getAllGenres(),
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ - categories ít thay đổi
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });
};

export const useAllCountries = () => {
  return useQuery({
    queryKey: ["categories", "countries"],
    queryFn: () => movieApi.getAllCountries(),
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });
};
