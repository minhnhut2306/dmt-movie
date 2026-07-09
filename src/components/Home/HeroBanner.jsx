import React, { useState, useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Play, Star, Calendar, Clock, Loader2 } from 'lucide-react';
import { useFeaturedMovies } from '../../hooks/useMovies';
import { movieApi } from '../../api';
import { getSafeImageUrl, getBackdropUrl } from '../../utils/imageHelper.js';

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

  // ✅ USE REACT QUERY - Tự động cache, không duplicate
  const { data, isLoading, error: queryError } = useFeaturedMovies();

  // Transform data
  const baseFeaturedMovies = React.useMemo(() => {
    const items = data?.data?.items || data?.items;
    if (!items) return [];

    return items.slice(0, 5).map(movie => ({
      id: movie._id,
      title: movie.name,
      description: movie.origin_name,
      backgroundImage: getSafeImageUrl(movie.poster_url, movie.name),
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

  // Ảnh backdrop rộng (chất lượng cao hơn poster dọc) riêng cho Hero Banner
  const backdropQueries = useQueries({
    queries: baseFeaturedMovies.map((movie) => ({
      queryKey: ['movie-images', movie.slug],
      queryFn: () => movieApi.getMovieImages(movie.slug),
      enabled: !!movie.slug,
      staleTime: 60 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
    })),
  });

  const featuredMovies = React.useMemo(() => {
    return baseFeaturedMovies.map((movie, idx) => {
      const backdropUrl = getBackdropUrl(backdropQueries[idx]?.data);
      return backdropUrl ? { ...movie, backgroundImage: backdropUrl } : movie;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFeaturedMovies, backdropQueries]);

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
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-base-elevated flex items-center justify-center">
        <div className="text-ink-primary text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-ink-secondary">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-base-elevated flex items-center justify-center">
        <div className="text-ink-primary text-center">
          <p className="text-brand-hover mb-2 font-semibold">Lỗi tải dữ liệu</p>
          <p className="text-ink-muted text-sm">{queryError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand hover:bg-brand-hover px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  if (!featuredMovies || featuredMovies.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-base-elevated flex items-center justify-center">
        <div className="text-ink-secondary text-center">
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
      className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleLocalDragStart}
      onMouseMove={handleLocalDragMove}
      onMouseUp={handleLocalDragEnd}
      onMouseLeave={handleLocalDragEnd}
      onTouchStart={handleLocalDragStart}
      onTouchMove={handleLocalDragMove}
      onTouchEnd={handleLocalDragEnd}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="absolute inset-0">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id || index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 100%), url('${movie.backgroundImage}')`,
              transform: isDraggingLocal && dragDirection === 'horizontal' ? `translateX(${localDragOffset}px)` :
                (isDragging && activeSection === 'hero') ? `translateX(${dragOffset}px)` :
                  'translateX(0)'
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualChange(index)}
            className={`rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${index === currentIndex ? 'bg-brand w-6 h-2 sm:w-8 sm:h-2.5' : 'bg-white/40 hover:bg-white/60 w-2 h-2 sm:w-2.5 sm:h-2.5'
              }`}
          />
        ))}
      </div>

      {featuredMovies.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/15 rounded-full z-20 overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-100"
            style={{
              width: intervalRef.current ? `${((10000 - timeRemaining) / 10000) * 100}%` : '0%'
            }}
          />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-3 sm:px-4 h-full flex items-center">
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
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 transition-all duration-500 leading-tight tracking-tight text-white">
            {currentFeaturedMovie.title}
          </h1>

          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4 text-xs sm:text-sm text-white/80">
            {currentFeaturedMovie.rating && (
              <div className="flex items-center text-gold-light">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 fill-current" />
                <span className="font-semibold">{currentFeaturedMovie.rating}</span>
              </div>
            )}
            {currentFeaturedMovie.year && (
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                <span>{currentFeaturedMovie.year}</span>
              </div>
            )}
            {currentFeaturedMovie.duration && (
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                <span>{currentFeaturedMovie.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-4 sm:mb-5 text-xs flex-wrap gap-1.5 sm:gap-2">
            {currentFeaturedMovie.quality && (
              <span className="bg-brand px-2 py-1 rounded-full text-xs font-bold text-white">
                {currentFeaturedMovie.quality}
              </span>
            )}
            {currentFeaturedMovie.language && (
              <span className="bg-white/10 border border-subtle px-2 py-1 rounded-full text-xs font-semibold text-white">
                {currentFeaturedMovie.language}
              </span>
            )}
            {currentFeaturedMovie.type && (
              <span className="text-white/80 text-xs">
                {currentFeaturedMovie.type}
              </span>
            )}
            {currentFeaturedMovie.episode && (
              <span className="text-gold-light text-xs font-medium">
                {currentFeaturedMovie.episode}
              </span>
            )}
          </div>

          {currentFeaturedMovie.description && (
            <p className="text-xs sm:text-sm md:text-base mb-5 sm:mb-7 text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-3 transition-all duration-500 max-w-lg">
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
              className="bg-brand hover:bg-brand-hover text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-cinema active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Chi Tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;