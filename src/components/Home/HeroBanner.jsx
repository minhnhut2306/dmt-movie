import React, { useState, useEffect, useRef } from 'react';
import { Play, Star, Calendar, Clock, Loader2 } from 'lucide-react';
import { movieApi } from '../../api/movieApi.js';
import { getSafeImageUrl } from '../../utils/imageHelper.js';

const HeroBanner = ({
  isDragging,
  activeSection,
  dragOffset,
  handleHeroStart,
  handleHeroMove,
  handleHeroEnd
}) => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Sử dụng API home mới
        const data = await movieApi.getHomeData();
        
        // Lấy items từ response
        const items = data?.data?.items || [];

        const transformedMovies = items.slice(0, 5).map(movie => ({
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
              movie.type === 'tvshows' ? 'TV Shows' : 
                movie.type === 'hoathinh' ? 'Hoạt Hình' : movie.type,
          quality: movie.quality,
          language: movie.lang,
          episode: movie.episode_current,
          slug: movie.slug
        }));

        setFeaturedMovies(transformedMovies);
        setCurrentIndex(0);

      } catch (err) {
        console.error('Error fetching featured movies:', err);
        setError(err.message);
        setFeaturedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isDragging && !isDraggingLocal && !loading && featuredMovies.length > 1) {
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
  }, [isDragging, isDraggingLocal, loading, featuredMovies.length]);

  const handleManualChange = (index) => {
    if (index >= 0 && index < featuredMovies.length) {
      setCurrentIndex(index);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        if (!isDragging && !isDraggingLocal && !loading && featuredMovies.length > 1) {
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

  const handleLocalDragStart = (e) => {
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setDragStartY(clientY);
    setDragCurrentY(clientY);
    setIsDraggingLocal(true);
    setDragDirection(null);

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

  if (loading) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-2">Lỗi tải dữ liệu</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!featuredMovies || featuredMovies.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
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
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${movie.backgroundImage}')`,
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
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-110 ${
              index === currentIndex ? 'bg-red-600' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {featuredMovies.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded z-20">
          <div
            className="h-full bg-red-600 rounded transition-all duration-100"
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
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 transition-all duration-500 leading-tight">
            {currentFeaturedMovie.title}
          </h1>

          <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-4 text-xs sm:text-sm">
            {currentFeaturedMovie.rating && (
              <div className="flex items-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                <span className="font-semibold">{currentFeaturedMovie.rating}</span>
              </div>
            )}
            {currentFeaturedMovie.year && (
              <div className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{currentFeaturedMovie.year}</span>
              </div>
            )}
            {currentFeaturedMovie.duration && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{currentFeaturedMovie.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-3 sm:mb-4 text-xs flex-wrap gap-1 sm:gap-2">
            {currentFeaturedMovie.quality && (
              <span className="bg-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-semibold">
                {currentFeaturedMovie.quality}
              </span>
            )}
            {currentFeaturedMovie.language && (
              <span className="bg-blue-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-semibold">
                {currentFeaturedMovie.language}
              </span>
            )}
            {currentFeaturedMovie.type && (
              <span className="text-gray-300 text-xs">
                {currentFeaturedMovie.type}
              </span>
            )}
            {currentFeaturedMovie.episode && (
              <span className="text-yellow-400 text-xs">
                {currentFeaturedMovie.episode}
              </span>
            )}
          </div>

          {currentFeaturedMovie.description && (
            <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 text-gray-200 leading-relaxed line-clamp-2 sm:line-clamp-3 transition-all duration-500">
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
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Chi Tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;