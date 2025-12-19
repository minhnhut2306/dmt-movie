// hooks/useMovieDetailHooks.js
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api";

const queryOptions = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Hook lấy chi tiết phim
export const useMovieDetail = (slug) => {
  return useQuery({
    queryKey: ["movie-detail", slug],
    queryFn: () => movieApi.getMovieDetail(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};

// Hook lấy hình ảnh phim
export const useMovieImages = (slug) => {
  return useQuery({
    queryKey: ["movie-images", slug],
    queryFn: () => movieApi.getMovieImages(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};

// Hook lấy diễn viên
export const useMoviePeoples = (slug) => {
  return useQuery({
    queryKey: ["movie-peoples", slug],
    queryFn: () => movieApi.getMoviePeoples(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};

// Hook lấy từ khóa
export const useMovieKeywords = (slug) => {
  return useQuery({
    queryKey: ["movie-keywords", slug],
    queryFn: () => movieApi.getMovieKeywords(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};

// Transform movie detail
export const transformMovieDetail = (data) => {
  if (!data?.data?.item) return null;

  const movie = data.data.item;

  return {
    id: movie._id,
    name: movie.name,
    origin_name: movie.origin_name,
    content: movie.content,
    poster_url: movie.poster_url,
    thumb_url: movie.thumb_url,
    trailer_url: movie.trailer_url,
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
    episodes: data.data.item.episodes || [],
    type: movie.type,
    slug: movie.slug,
    created: movie.created,
    modified: movie.modified,
  };
};

// Transform images - GHÉp file_path với base URL từ image_sizes
export const transformMovieImages = (data) => {
  if (!data?.data?.images || !data?.data?.image_sizes) return [];
  
  const imageSizes = data.data.image_sizes;
  
  return data.data.images.map(img => {
    const baseUrls = imageSizes[img.type]; // backdrop hoặc poster
    
    // Tạo object chứa tất cả các kích thước URL
    const urls = {};
    
    if (img.type === 'backdrop') {
      urls.original = `${baseUrls.original}${img.file_path}`;
      urls.w1280 = `${baseUrls.w1280}${img.file_path}`;
      urls.w780 = `${baseUrls.w780}${img.file_path}`;
      urls.w300 = `${baseUrls.w300}${img.file_path}`;
    } else if (img.type === 'poster') {
      urls.original = `${baseUrls.original}${img.file_path}`;
      urls.w780 = `${baseUrls.w780}${img.file_path}`;
      urls.w500 = `${baseUrls.w500}${img.file_path}`;
      urls.w342 = `${baseUrls.w342}${img.file_path}`;
      urls.w185 = `${baseUrls.w185}${img.file_path}`;
      urls.w154 = `${baseUrls.w154}${img.file_path}`;
      urls.w92 = `${baseUrls.w92}${img.file_path}`;
    }
    
    return {
      type: img.type,
      width: img.width,
      height: img.height,
      aspect_ratio: img.aspect_ratio,
      file_path: img.file_path,
      urls: urls
    };
  });
};

// Transform peoples
export const transformMoviePeoples = (data) => {
  if (!data?.data?.peoples) return [];
  
  const profileSizes = data.data.profile_sizes;
  
  return data.data.peoples.map(person => ({
    id: person.tmdb_people_id,
    name: person.name,
    original_name: person.original_name,
    character: person.character,
    gender: person.gender_name,
    known_for: person.known_for_department,
    profile_path: person.profile_path,
    profile_urls: person.profile_path ? {
      w45: `${profileSizes.w45}${person.profile_path}`,
      w185: `${profileSizes.w185}${person.profile_path}`,
      h632: `${profileSizes.h632}${person.profile_path}`,
      original: `${profileSizes.original}${person.profile_path}`,
    } : null,
    also_known_as: person.also_known_as || []
  }));
};

// Transform keywords
export const transformMovieKeywords = (data) => {
  if (!data?.data?.keywords) return [];
  
  return data.data.keywords.map(keyword => ({
    id: keyword.tmdb_keyword_id,
    name: keyword.name,
    name_vn: keyword.name_vn
  }));
};