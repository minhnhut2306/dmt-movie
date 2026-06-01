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
        className={`group cursor-pointer transform transition-transform duration-300 hover:scale-105 flex-shrink-0
                   w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2 mb-4 ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-xl shadow-2xl">
          {/* Loading skeleton — pulse nhẹ, cảm giác nhanh hơn spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse aspect-[2/3] z-10" />
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

          {/* Bottom shade (1 màu phẳng) */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/60 pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg" />
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && displayRating && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg text-yellow-400 text-sm sm:text-base flex items-center shadow-lg">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span className="font-medium">{displayRating}</span>
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-gray-800/40 backdrop-blur-sm border-t border-gray-400/30 p-3 sm:p-4">
                <h3 className="text-white font-bold text-base sm:text-lg mb-2 truncate leading-tight">
                  {displayTitle}
                </h3>
                <div className="flex items-center text-gray-200 text-sm sm:text-base space-x-3">
                  <span className="bg-gray-800/50 px-1 py-1 rounded whitespace-nowrap">{displayYear}</span>
                  <span className="bg-gray-800/50 px-1 py-1 rounded whitespace-nowrap truncate">{displayGenre}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 p-4">
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
        className={`group cursor-pointer transform transition-transform duration-300 hover:scale-105 w-full ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {/* Loading skeleton — pulse nhẹ, cảm giác nhanh hơn spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse aspect-[2/3] z-10" />
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

          {/* Bottom shade (1 màu phẳng) */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/60 pointer-events-none" />

          {/* Hover Play Button */}
          {isLoaded && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white drop-shadow-lg" />
            </div>
          )}

          {/* Rating Badge */}
          {isLoaded && displayRating && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-yellow-400 text-xs sm:text-sm lg:text-base flex items-center shadow-lg">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" />
              <span className="font-medium">{displayRating}</span>
            </div>
          )}

          {/* Quality Badge */}
          {isLoaded && displayQuality && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium shadow-lg">
              {displayQuality}
            </div>
          )}

          {/* Movie Info */}
          {isLoaded && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-black/80 p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2 leading-tight">
                  {displayTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-200 text-xs sm:text-sm">
                  <span className="bg-gray-800/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap">
                    {displayYear}
                  </span>
                  <span className="bg-gray-800/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded truncate max-w-20 sm:max-w-24">
                    {displayGenre}
                  </span>
                  {displayType && (
                    <span className="bg-blue-600/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                      {displayType}
                    </span>
                  )}
                </div>

                {displayEpisode && displayEpisode !== "Full" && (
                  <div className="mt-1 sm:mt-2">
                    <span className="bg-green-600/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm text-white font-medium">
                      {displayEpisode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && isLoaded && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 p-4">
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
        className={`group block focus:outline-none ${className}`}
        onClick={() => window.scrollTo(0, 0)}
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)] focus-visible:ring-2 focus-visible:ring-sky-400/60">
          <div className="relative w-full aspect-[3/3]">
            {/* Loading State */}
            {!isLoaded && (
              <div className="absolute inset-0">
                <div className="h-full w-full bg-slate-800 animate-pulse rounded-2xl" />
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

            {/* Bottom shade (1 màu phẳng) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-black/60" />

            {/* Rating Badge */}
            {isLoaded && displayRating && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur px-2.5 py-1.5 text-amber-300 text-sm font-medium shadow">
                <Star className="h-4 w-4" />
                <span>{displayRating}</span>
              </div>
            )}

            {/* Hover Play Button */}
            {isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-black/60 p-4 backdrop-blur">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="relative p-4 bg-slate-950/85 backdrop-blur-sm border-t border-white/5">
            <h3 className="mb-2 line-clamp-2 text-white text-base font-bold leading-snug">
              {displayTitle}
            </h3>

            <div className="mb-2 flex items-center justify-between text-xs text-slate-200">
              <span className="rounded-md bg-sky-600/90 px-2 py-1 font-semibold">
                {displayYear}
              </span>
              <span className="rounded-md bg-emerald-600/90 px-2 py-1 font-semibold">
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
