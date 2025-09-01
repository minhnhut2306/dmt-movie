
const normalizeUrl = (url) => {
  if (!url) return '';
  return url.startsWith("http") ? url : `https://phimimg.com/${url}`;
};

const createMovieTransform = (defaultGenre, defaultType) => (data) => {
  const items = data?.data?.items || data?.items || [];
  
  return items.map((movie) => ({
    id: movie._id,
    title: movie.name,
    originalTitle: movie.origin_name,
    poster: normalizeUrl(movie.poster_url),
    thumbnail: normalizeUrl(movie.thumb_url),
    rating: movie.tmdb?.vote_average > 0 ? movie.tmdb.vote_average.toFixed(1) : null,
    year: movie.year,
    duration: movie.time,
    genre: movie.category?.[0]?.name || defaultGenre,
    country: movie.country?.[0]?.name || "Chưa xác định",
    type: defaultType || (
      movie.type === "series" ? "Phim Bộ" :
      movie.type === "single" ? "Phim Lẻ" :
      movie.type === "tvshows" ? "TV Shows" :
      movie.type
    ),
    quality: movie.quality,
    language: movie.lang,
    episode: movie.episode_current,
    slug: movie.slug,
    isExclusive: movie.sub_docquyen,
    isInCinema: movie.chieurap,
    modifiedTime: movie.modified?.time,
    createdTime: movie.created?.time,
  }));
};

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

export const transformLatestMovies = (data) => {
  const items = data?.items || [];
  
  return items.map((movie) => ({
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
    type: movie.type === "series" ? "Phim Bộ" :
          movie.type === "single" ? "Phim Lẻ" :
          movie.type === "tvshows" ? "TV Shows" : movie.type,
    quality: movie.quality,
    language: movie.lang,
    episode: movie.episode_current,
    slug: movie.slug,
    isExclusive: movie.sub_docquyen,
    modifiedTime: movie.modified?.time,
  }));
};

export const transformVietnamMovies = createMovieTransform("Chưa phân loại", null);
export const transformChinaMovies = createMovieTransform("Chưa phân loại", null);
export const transformJapanMovies = createMovieTransform("Chưa phân loại", null);

export const transformSeriesMovies = createMovieTransform("Chưa phân loại", "Phim Bộ");
export const transformSingleMovies = createMovieTransform("Chưa phân loại", "Phim Lẻ");
export const transformTVShows = createMovieTransform("Chưa phân loại", "TV Shows");

export const transformAnimationMovies = createMovieTransform("Hoạt hình", "Phim Hoạt Hình");
export const transformActionMovies = createMovieTransform("Hành động", "Phim Hành Động");
export const transformHorrorMovies = createMovieTransform("Kinh dị", "Phim Kinh Dị");
export const transformHistoryMovies = createMovieTransform("Cổ trang", "Phim Cổ Trang");

export const transformDubbedMovies = createMovieTransform("Thuyết minh", "Phim Thuyết Minh");
export const transformVoiceoverMovies = createMovieTransform("Lồng tiếng", "Phim Lồng Tiếng");
export const transformVietsubMovies = createMovieTransform("Vietsub", "Phim Vietsub");