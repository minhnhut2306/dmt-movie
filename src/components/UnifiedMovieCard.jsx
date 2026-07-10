import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { useMovieImage } from '../hooks/useMovieImage';
import { useQueryClient } from '@tanstack/react-query';
import { movieApi } from '../api';

// Computed once at module load — không chạy lại mỗi render
const isFacebookInApp = /FBAN|FBAV|FB_IAB|FB4A|FBAN\/Messenger|Instagram/i.test(
  navigator.userAgent || ''
);

/**
 * Unified Movie Card Component - Thay thế MovieCard, MovieCardDetail, SearchMovieCard
 *
 * @param {object} movie - Movie data object
 * @param {string} variant - 'carousel' | 'grid' | 'search'
 * @param {string} className - Additional CSS classes
 */
const UnifiedMovieCard = ({ movie, variant = 'grid', className = '' }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Prefetch movie detail khi hover — giảm thời gian chờ khi click
  const handleMouseEnter = () => {
    if (!movie?.slug) return;
    queryClient.prefetchQuery({
      queryKey: ['movie-detail', movie.slug],
      queryFn: () => movieApi.getMovieDetail(movie.slug),
      staleTime: 30 * 60 * 1000,
    });
  };

  // Extract movie data
  const displayTitle = movie?.title || movie?.name || 'Untitled';
  const displayRating = movie?.rating && movie?.rating !== 'N/A' ? movie.rating : null;
  const displayYear = movie?.year || 'N/A';
  const displayGenre = movie?.genre || 'Chưa phân loại';
  const displayType = movie?.type || 'Movie';
  const displayQuality = movie?.quality;
  const displayEpisode = movie?.episode;

  // Image loading with fallback chain
  const {
    currentSrc,
    isLoaded,
    hasError,
    handleLoad,
    handleError,
    setImgRef,
  } = useMovieImage(
    movie?.poster || movie?.poster_url || movie?.thumbnail,
    displayTitle
  );

  const loadingAttr = isFacebookInApp ? 'eager' : 'lazy';

  const handleClick = () => {
    navigate(`/movie/${movie.slug}`);
    window.scrollTo(0, 0);
  };

  // ============================================
  // VARIANT: CAROUSEL (Home page carousel)
  // ============================================
  if (variant === 'carousel') {
    return (
      <div
        className={`group cursor-pointer transform transition-transform duration-300 ease-out hover:-translate-y-1 active:scale-[0.97] flex-shrink-0
                   w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2 mb-4 ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-card shadow-glass ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-glow group-hover:ring-iris-400/30">
          {/* Loading skeleton shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 aspect-[2/3] z-10 skeleton" />
          )}

          {/* Image */}
          <img
            ref={setImgRef}
            src={currentSrc}
            alt={displayTitle}
            className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={loadingAttr}
            referrerPolicy="no-referrer"
            decoding="async"
          />

          {/* Bottom shade */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/90 to-transparent pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && (
            <div className="absolute inset-0 bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full glass-strong flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && displayRating && (
            <div className="absolute top-2.5 right-2.5 glass-strong px-2.5 py-1.5 rounded-lg text-ember-400 text-sm flex items-center gap-1 shadow-glass">
              <Star className="w-4 h-4 fill-ember-400" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="glass p-3 sm:p-4">
                <h3 className="text-white font-display font-semibold text-sm sm:text-base mb-1.5 truncate leading-tight">
                  {displayTitle}
                </h3>
                <div className="flex items-center text-white/60 text-xs sm:text-sm gap-2">
                  <span className="bg-white/5 px-1.5 py-0.5 rounded whitespace-nowrap">{displayYear}</span>
                  <span className="bg-white/5 px-1.5 py-0.5 rounded whitespace-nowrap truncate">{displayGenre}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-ink-800 flex items-center justify-center">
              <div className="text-center text-white/40 p-4">
                <div className="text-xs sm:text-sm mb-2">Lỗi tải ảnh</div>
                <div className="text-xs font-medium">{displayTitle}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT: GRID (Category/Detail pages)
  // ============================================
  if (variant === 'grid') {
    return (
      <div
        className={`group cursor-pointer transform transition-transform duration-300 ease-out hover:-translate-y-1 active:scale-[0.97] w-full ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-card shadow-glass ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-glow group-hover:ring-iris-400/30">
          {/* Loading skeleton shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 aspect-[2/3] z-10 skeleton" />
          )}

          {/* Image */}
          <img
            ref={setImgRef}
            src={currentSrc}
            alt={displayTitle}
            className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={loadingAttr}
            referrerPolicy="no-referrer"
            decoding="async"
          />

          {/* Bottom shade */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/90 to-transparent pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && (
            <div className="absolute inset-0 bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full glass-strong flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && displayRating && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 glass-strong px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-ember-400 text-xs sm:text-sm flex items-center gap-1 shadow-glass">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-ember-400" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          )}

          {/* Quality Badge */}
          {isLoaded && displayQuality && (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-gradient-to-br from-iris-400 to-iris-600 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-white text-[10px] sm:text-xs font-bold shadow-glow">
              {displayQuality}
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="glass p-2.5 sm:p-3.5">
                <h3 className="text-white font-display font-semibold text-xs sm:text-sm lg:text-base mb-1 sm:mb-1.5 line-clamp-2 leading-tight">
                  {displayTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-white/55 text-[10px] sm:text-xs">
                  <span className="bg-white/5 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {displayYear}
                  </span>
                  <span className="bg-white/5 px-1.5 py-0.5 rounded truncate max-w-20 sm:max-w-24">
                    {displayGenre}
                  </span>
                  {displayType && (
                    <span className="bg-iris-500/25 text-iris-200 px-1.5 py-0.5 rounded">
                      {displayType}
                    </span>
                  )}
                </div>

                {displayEpisode && displayEpisode !== "Full" && (
                  <div className="mt-1 sm:mt-1.5">
                    <span className="bg-ember-500/25 px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-ember-300 font-semibold">
                      {displayEpisode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-ink-800 flex items-center justify-center">
              <div className="text-center text-white/40 p-4">
                <div className="text-xs sm:text-sm mb-2">Lỗi tải ảnh</div>
                <div className="text-xs font-medium">{displayTitle}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT: SEARCH (Search results)
  // ============================================
  if (variant === 'search') {
    return (
      <Link
        to={`/movie/${movie.slug}`}
        className={`group block focus-signature rounded-card ${className}`}
        onClick={() => window.scrollTo(0, 0)}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-card bg-ink-800 shadow-glass ring-1 ring-white/5 transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] hover:shadow-glow hover:ring-iris-400/30">
          <div className="relative w-full aspect-[2/3]">
            {/* Loading skeleton shimmer */}
            {!isLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}

            {/* Image */}
            <img
              ref={setImgRef}
              src={currentSrc}
              alt={displayTitle}
              loading={loadingAttr}
              onLoad={handleLoad}
              onError={handleError}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-[1.05] ease-out`}
            />

            {/* Bottom shade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/90 to-transparent" />

            {/* Rating Badge */}
            {isLoaded && displayRating && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg glass-strong px-2.5 py-1.5 text-ember-400 text-sm font-semibold shadow-glass">
                <Star className="h-3.5 w-3.5 fill-ember-400" />
                <span>{displayRating}</span>
              </div>
            )}

            {/* Hover Play Button */}
            {isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="pointer-events-none opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                  <div className="rounded-full glass-strong p-3.5">
                    <Play className="h-6 w-6 md:h-7 md:w-7 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="relative p-3.5 border-t border-white/5">
            <h3 className="mb-2 line-clamp-2 text-white text-sm font-display font-semibold leading-snug">
              {displayTitle}
            </h3>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="rounded-md bg-iris-500/25 text-iris-200 px-2 py-1 font-semibold">
                {displayYear}
              </span>
              <span className="rounded-md bg-white/5 text-white/60 px-2 py-1 font-semibold">
                {displayType}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default fallback
  return null;
};

export default UnifiedMovieCard;
