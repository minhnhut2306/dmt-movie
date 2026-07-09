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
        className={`group cursor-pointer transform transition-all duration-300 ease-out hover:scale-[1.04] hover:z-10 flex-shrink-0
                   w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2 mb-4 ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-cinema group-hover:shadow-cinema-lg transition-shadow duration-300">
          {/* Loading skeleton shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 aspect-[2/3] z-10 overflow-hidden bg-base-elevated">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
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
          <div className="absolute inset-x-0 bottom-0 h-2/3 poster-scrim pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && !hasError && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white fill-white drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && !hasError && displayRating && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/70 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-gold-light text-xs sm:text-sm flex items-center gap-1 shadow-cinema border border-white/10">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          )}

          {/* Quality Badge */}
          {isLoaded && !hasError && displayQuality && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-cinema">
              {displayQuality}
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && !hasError && (
            <div
              className="absolute bottom-0 left-0 right-0 p-3 sm:p-4"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9)' }}
            >
              <h3 className="text-ink-primary font-bold text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 line-clamp-2 leading-tight">
                {displayTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-ink-secondary text-xs sm:text-sm">
                <span className="whitespace-nowrap">
                  {displayYear}
                </span>
                <span className="w-1 h-1 rounded-full bg-ink-muted" />
                <span className="truncate max-w-20 sm:max-w-24">
                  {displayGenre}
                </span>
                {displayType && (
                  <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-xs border border-subtle">
                    {displayType}
                  </span>
                )}
              </div>

              {displayEpisode && displayEpisode !== "Full" && (
                <div className="mt-1.5 sm:mt-2">
                  <span className="bg-emerald-600/90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs sm:text-sm text-white font-semibold">
                    {displayEpisode}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-base-elevated flex items-center justify-center border border-subtle">
              <div className="text-center text-ink-primary p-4">
                <div className="text-xs sm:text-sm mb-2 text-ink-secondary">Lỗi tải ảnh</div>
                <div className="text-xs sm:text-sm font-semibold line-clamp-2">{displayTitle}</div>
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
        className={`group cursor-pointer transform transition-all duration-300 ease-out hover:scale-[1.04] hover:z-10 w-full ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-cinema group-hover:shadow-cinema-lg transition-shadow duration-300">
          {/* Loading skeleton shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 aspect-[2/3] z-10 overflow-hidden bg-base-elevated">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
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
          <div className="absolute inset-x-0 bottom-0 h-2/3 poster-scrim pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && !hasError && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white fill-white drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && !hasError && displayRating && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/70 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-gold-light text-xs sm:text-sm flex items-center gap-1 shadow-cinema border border-white/10">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          )}

          {/* Quality Badge */}
          {isLoaded && !hasError && displayQuality && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-cinema">
              {displayQuality}
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && !hasError && (
            <div
              className="absolute bottom-0 left-0 right-0 p-3 sm:p-4"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9)' }}
            >
              <h3 className="text-ink-primary font-bold text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 line-clamp-2 leading-tight">
                {displayTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-ink-secondary text-xs sm:text-sm">
                <span className="whitespace-nowrap">
                  {displayYear}
                </span>
                <span className="w-1 h-1 rounded-full bg-ink-muted" />
                <span className="truncate max-w-20 sm:max-w-24">
                  {displayGenre}
                </span>
                {displayType && (
                  <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-xs border border-subtle">
                    {displayType}
                  </span>
                )}
              </div>

              {displayEpisode && displayEpisode !== "Full" && (
                <div className="mt-1.5 sm:mt-2">
                  <span className="bg-emerald-600/90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs sm:text-sm text-white font-semibold">
                    {displayEpisode}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-base-elevated flex items-center justify-center border border-subtle">
              <div className="text-center text-ink-primary p-4">
                <div className="text-xs sm:text-sm mb-2 text-ink-secondary">Lỗi tải ảnh</div>
                <div className="text-xs sm:text-sm font-semibold line-clamp-2">{displayTitle}</div>
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
        className={`group block focus:outline-none ${className}`}
        onClick={() => window.scrollTo(0, 0)}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-2xl bg-base-elevated shadow-cinema ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cinema-lg focus-visible:ring-2 focus-visible:ring-brand/60">
          <div className="relative w-full aspect-[2/3]">
            {/* Loading skeleton shimmer */}
            {!isLoaded && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-base-elevated">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
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
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } scale-[1.02] group-hover:scale-[1.06] ease-out`}
            />

            {/* Bottom shade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 poster-scrim" />

            {/* Rating Badge */}
            {isLoaded && !hasError && displayRating && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1.5 text-gold-light text-sm font-semibold shadow-cinema border border-white/10">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{displayRating}</span>
              </div>
            )}

            {/* Hover Play Button */}
            {isLoaded && !hasError && (
              <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-4 scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="h-7 w-7 md:h-9 md:w-9 text-white fill-white drop-shadow" />
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && isLoaded && (
              <div className="absolute inset-0 bg-base-elevated flex items-center justify-center">
                <div className="text-center text-ink-secondary p-4 text-xs">Lỗi tải ảnh</div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="relative p-4 bg-base-elevated/90 backdrop-blur-sm border-t border-subtle">
            <h3 className="mb-2 line-clamp-2 text-ink-primary text-base font-bold leading-snug">
              {displayTitle}
            </h3>

            <div className="mb-2 flex items-center justify-between text-xs text-ink-secondary">
              <span className="rounded-full bg-white/10 px-2 py-1 font-semibold border border-subtle">
                {displayYear}
              </span>
              <span className="rounded-full bg-brand/20 text-brand-hover px-2 py-1 font-semibold">
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
