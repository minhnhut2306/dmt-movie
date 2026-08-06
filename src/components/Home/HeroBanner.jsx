import React, { useState, useEffect, useRef } from 'react';
import { Play, Star, Calendar, Clock, Loader2, TriangleAlert } from 'lucide-react';
import { useFeaturedMovies, useMovieImagesBatch } from '../../hooks/useMovies';
import { buildBgFallbackChain } from '../../utils/imageHelper';

const HeroBanner = ({
  isDragging,
  activeSection,
  dragOffset,
  handleHeroStart,
  handleHeroMove,
  handleHeroEnd
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);

  // USE REACT QUERY - Tự động cache, không duplicate
  const { data, isLoading, error: queryError } = useFeaturedMovies();

  // Transform data
  // /v1/api/home trả về items lồng trong data.data.items (khác endpoint v3 cũ trả items ở top-level)
  const featuredMovies = React.useMemo(() => {
    const items = data?.data?.items || data?.items || [];
    if (items.length === 0) return [];

    return items.slice(0, 5).map(movie => ({
      id: movie._id,
      title: movie.name,
      description: movie.origin_name,
      // Ảnh nền hero hiển thị full-bleed cỡ lớn — cần độ phân giải cao hơn card thường để không bị mờ/vỡ nét
      backgroundImage: buildBgFallbackChain(movie.poster_url, { width: 1280, quality: 88 }),
      rating: movie.tmdb?.vote_average?.toFixed(1),
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name,
      country: movie.country?.[0]?.name,
      type: movie.type === 'series' ? 'Phim Bộ' :
        movie.type === 'single' ? 'Phim Lẻ' :
          movie.type === 'tvshows' ? 'TV Shows' : movie.type,
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug
    }));
  }, [data]);

  // Ảnh TMDB chất lượng cao (nét hơn nhiều) cho từng phim trong hero, nếu có
  const featuredSlugs = React.useMemo(() => featuredMovies.map(m => m.slug), [featuredMovies]);
  const tmdbImageQueries = useMovieImagesBatch(featuredSlugs);

  const getBackgroundImage = (movie, index) => {
    const hiRes = tmdbImageQueries[index]?.data?.backdrop;
    const rawUrl = hiRes || (movie.poster_url || '');
    return buildBgFallbackChain(rawUrl, { width: 1280, quality: 88 });
  };

  // Auto-slide functionality
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only create interval when conditions are met
    if (!isDragging && !isDraggingLocal && !isLoading && featuredMovies.length > 1) {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % featuredMovies.length;
          return next;
        });

        startTimeRef.current = Date.now();
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDragging, isDraggingLocal, isLoading, featuredMovies.length]);

  // Handle manual navigation
  const handleManualChange = (index) => {
    if (index >= 0 && index < featuredMovies.length) {
      setCurrentIndex(index);

      // Reset timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        if (!isDragging && !isDraggingLocal && !isLoading && featuredMovies.length > 1) {
          startTimeRef.current = Date.now();

          intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => {
              const next = (prev + 1) % featuredMovies.length;
              return next;
            });

            startTimeRef.current = Date.now();
          }, 10000);
        }
      }
    }
  };

  // Local drag handlers
  const handleLocalDragStart = (e) => {
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setDragStartY(clientY);
    setDragCurrentY(clientY);
    setIsDraggingLocal(true);
    setDragDirection(null);

    // Call parent handler if exists
    if (handleHeroStart) {
      handleHeroStart(e);
    }
  };

  const handleLocalDragMove = (e) => {
    if (!isDraggingLocal) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    setDragCurrentX(clientX);
    setDragCurrentY(clientY);

    if (!dragDirection) {
      const deltaX = Math.abs(clientX - dragStartX);
      const deltaY = Math.abs(clientY - dragStartY);

      if (deltaX > 10 || deltaY > 10) {
        if (deltaX > deltaY) {
          setDragDirection('horizontal');
        } else {
          setDragDirection('vertical');
          return;
        }
      }
    }
    if (dragDirection === 'horizontal') {
      e.preventDefault();
      if (handleHeroMove) {
        handleHeroMove(e);
      }
    }
  };

  const handleLocalDragEnd = (e) => {
    if (!isDraggingLocal) return;
    if (dragDirection === 'horizontal') {
      const dragDistance = dragCurrentX - dragStartX;
      const threshold = 100;
      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          const prevIndex = currentIndex === 0 ? featuredMovies.length - 1 : currentIndex - 1;
          handleManualChange(prevIndex);
        } else {
          const nextIndex = (currentIndex + 1) % featuredMovies.length;
          handleManualChange(nextIndex);
        }
      }
    }

    setIsDraggingLocal(false);
    setDragStartX(0);
    setDragCurrentX(0);
    setDragStartY(0);
    setDragCurrentY(0);
    setDragDirection(null);

    if (handleHeroEnd) {
      handleHeroEnd(e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? featuredMovies.length - 1 : currentIndex - 1;
        handleManualChange(prevIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % featuredMovies.length;
        handleManualChange(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, featuredMovies.length]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-[420px] sm:h-[460px] md:h-[560px] lg:h-[640px] bg-ink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-iris-400" />
          <p className="text-white/50 text-sm">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="relative h-[420px] sm:h-[460px] md:h-[560px] lg:h-[640px] bg-ink-900 flex items-center justify-center">
        <div className="text-white text-center px-4">
          <TriangleAlert className="w-8 h-8 mx-auto mb-3 text-ember-400" />
          <p className="text-white mb-1 font-display font-semibold">Ơ, có gì đó không ổn</p>
          <p className="text-white/40 text-sm mb-4">{queryError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-signature px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  if (!featuredMovies || featuredMovies.length === 0) {
    return (
      <div className="relative h-[420px] sm:h-[460px] md:h-[560px] lg:h-[640px] bg-ink-900 flex items-center justify-center">
        <div className="text-white/40 text-center">
          <p>Không có phim nổi bật</p>
        </div>
      </div>
    );
  }

  const currentFeaturedMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const timeRemaining = intervalRef.current ? 10000 - ((Date.now() - startTimeRef.current) % 10000) : 0;
  const localDragOffset = isDraggingLocal ? dragCurrentX - dragStartX : 0;

  return (
    <div
      className="relative h-[420px] sm:h-[460px] md:h-[560px] lg:h-[640px] overflow-hidden cursor-grab active:cursor-grabbing select-none bg-ink-950"
      onMouseDown={handleLocalDragStart}
      onMouseMove={handleLocalDragMove}
      onMouseUp={handleLocalDragEnd}
      onMouseLeave={handleLocalDragEnd}
      onTouchStart={handleLocalDragStart}
      onTouchMove={handleLocalDragMove}
      onTouchEnd={handleLocalDragEnd}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Editorial split layout: image mask on the right/full, content column glass panel on the left */}
      <div className="absolute inset-0">
        {featuredMovies.map((movie, index) => (
          <div key={movie.id || index} className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <div
              className="absolute inset-0 bg-cover md:bg-[right_center] bg-[center_top]"
              style={{
                backgroundImage: getBackgroundImage(movie, index),
                transform: isDraggingLocal && dragDirection === 'horizontal' ? `translateX(${localDragOffset}px)` :
                  (isDragging && activeSection === 'hero') ? `translateX(${dragOffset}px)` :
                    'translateX(0)'
              }}
            />
            {/* Depth-layered scrim: strong left-to-right fade so text always reads, plus bottom fade into page */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/20 md:from-ink-950 md:via-ink-950/60 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/30" />
          </div>
        ))}
      </div>

      {/* Signature ambient glow blobs for cinematic depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-iris-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-ember-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Desktop: vertical index rail on the far right (replaces standard dot carousel) */}
      {featuredMovies.length > 1 && (
        <div className="hidden lg:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
          {featuredMovies.map((movie, index) => (
            <button
              key={movie.id || index}
              onClick={() => handleManualChange(index)}
              className={`group flex items-center gap-3 cursor-pointer focus-signature rounded-lg ${index === currentIndex ? '' : 'opacity-50 hover:opacity-80'} transition-opacity duration-300`}
            >
              <span className={`font-display text-xs font-bold transition-colors ${index === currentIndex ? 'text-iris-300' : 'text-white/40'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`h-0.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-10 bg-iris-400' : 'w-5 bg-white/25 group-hover:bg-white/50'}`} />
            </button>
          ))}
        </div>
      )}

      {/* Mobile/tablet: dot indicators, thumb-reachable near bottom */}
      {featuredMovies.length > 1 && (
        <div className="lg:hidden absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualChange(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'w-6 bg-iris-400' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      )}

      {/* Autoplay progress bar (signature gradient) */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 z-20">
          <div
            className="h-full bg-gradient-to-r from-iris-500 to-ember-400 transition-all duration-100"
            style={{
              width: intervalRef.current ? `${((10000 - timeRemaining) / 10000) * 100}%` : '0%'
            }}
          />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center">
        <div
          className="max-w-xl sm:max-w-2xl text-white transition-all duration-300"
          style={{
            transform: isDraggingLocal && dragDirection === 'horizontal' ? `translateX(${localDragOffset * 0.3}px)` :
              (isDragging && activeSection === 'hero') ? `translateX(${dragOffset * 0.3}px)` :
                'translateX(0)',
            opacity: isDraggingLocal && dragDirection === 'horizontal' ? Math.max(0.7, 1 - Math.abs(localDragOffset) / 400) :
              (isDragging && activeSection === 'hero') ? Math.max(0.7, 1 - Math.abs(dragOffset) / 400) :
                1
          }}
        >
          {currentFeaturedMovie.quality && (
            <span className="inline-block mb-3 glass px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-iris-200 uppercase">
              Đề xuất hôm nay
            </span>
          )}

          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-[1.1] tracking-tight">
            {currentFeaturedMovie.title}
          </h1>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm text-white/70">
            {currentFeaturedMovie.rating && (
              <div className="flex items-center gap-1 text-ember-400 font-semibold">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-ember-400" />
                <span>{currentFeaturedMovie.rating}</span>
              </div>
            )}
            {currentFeaturedMovie.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{currentFeaturedMovie.year}</span>
              </div>
            )}
            {currentFeaturedMovie.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{currentFeaturedMovie.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4 sm:mb-5 text-xs flex-wrap">
            {currentFeaturedMovie.quality && (
              <span className="bg-gradient-to-br from-iris-400 to-iris-600 px-2.5 py-1 rounded-md font-bold shadow-glow">
                {currentFeaturedMovie.quality}
              </span>
            )}
            {currentFeaturedMovie.language && (
              <span className="glass px-2.5 py-1 rounded-md font-semibold text-white/85">
                {currentFeaturedMovie.language}
              </span>
            )}
            {currentFeaturedMovie.type && (
              <span className="text-white/50">
                {currentFeaturedMovie.type}
              </span>
            )}
            {currentFeaturedMovie.episode && (
              <span className="text-ember-400 font-medium">
                {currentFeaturedMovie.episode}
              </span>
            )}
          </div>

          {currentFeaturedMovie.description && (
            <p className="text-xs sm:text-sm md:text-base mb-5 sm:mb-7 text-white/55 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-lg">
              {currentFeaturedMovie.description}
            </p>
          )}

          <div className="flex justify-start">
            <button
              onClick={() => {
                if (currentFeaturedMovie.slug) {
                  window.location.href = `/movie/${currentFeaturedMovie.slug}`;
                }
              }}
              className="min-h-[48px] btn-signature text-white px-6 sm:px-7 py-3 rounded-xl2 transition-all duration-200 text-sm font-semibold flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-signature"
            >
              <Play className="w-4 h-4 fill-white" />
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;