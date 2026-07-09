import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import UnifiedMovieCard from '../UnifiedMovieCard';

const GenericMoviesSection = ({ 
  // Section config
  title,
  emoji,
  sectionKey,
  useDataHook,
  transformFunction,
  isDragging,
  activeSection,
  dragOffset,
  handleSectionStart,
  handleSectionMove,
  handleSectionEnd,
  getItemsPerSlide,
  viewMoreLink
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { data: apiData, isLoading: loading, error: queryError } = useDataHook();
  const movies = transformFunction(apiData);
  const error = queryError?.message;
  
  const handleSlide = (direction) => {
    const itemsPerSlide = getItemsPerSlide();
    const maxIndex = Math.max(0, movies.length - itemsPerSlide);
    setCurrentSlideIndex(prev => {
      if (direction === 'next') {
        return Math.min(prev + itemsPerSlide, maxIndex);
      } else {
        return Math.max(prev - itemsPerSlide, 0);
      }
    });
  };
  
  const handleSectionEndLocal = () => {
    handleSectionEnd(movies, (updates) => {
      setCurrentSlideIndex(prev => updates[sectionKey] ?? prev);
    });
  };

  const handleViewMore = () => {
    if (viewMoreLink) {
      navigate(viewMoreLink);
    }
  };

  if (loading) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-ink-primary text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
          <div className="text-ink-primary text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
            <p className="text-ink-secondary">Đang tải {title.toLowerCase()}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-ink-primary text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
          <div className="text-ink-primary text-center">
            <p className="text-brand-hover mb-2 font-semibold">Lỗi tải dữ liệu</p>
            <p className="text-ink-muted text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-brand hover:bg-brand-hover px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-ink-primary text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
          <div className="text-ink-secondary text-center">
            <p>Không có {title.toLowerCase()}</p>
          </div>
        </div>
      </div>
    );
  }

  const itemsPerSlide = getItemsPerSlide();
  const maxIndex = Math.max(0, movies.length - itemsPerSlide);

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-ink-primary text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
          {emoji} {title}
        </h2>
        <div className="flex items-center space-x-3">
          {viewMoreLink && (
            <button
              onClick={handleViewMore}
              className="text-ink-primary bg-white/5 hover:bg-white/10 border border-subtle transition-all duration-200 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full cursor-pointer"
            >
              Xem thêm
            </button>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => handleSlide('prev')}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-ink-primary transition-all duration-200 cursor-pointer border border-subtle"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleSlide('next')}
              disabled={currentSlideIndex >= maxIndex}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-ink-primary transition-all duration-200 cursor-pointer border border-subtle"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handleSectionStart(e, sectionKey)}
        onMouseMove={handleSectionMove}
        onMouseUp={handleSectionEndLocal}
        onMouseLeave={handleSectionEndLocal}
        onTouchStart={(e) => handleSectionStart(e, sectionKey)}
        onTouchMove={handleSectionMove}
        onTouchEnd={handleSectionEndLocal}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlideIndex * (100 / itemsPerSlide)}%)${
              isDragging && activeSection === sectionKey ? ` translateX(${dragOffset}px)` : ''
            }`
          }}
        >
          {movies.map((movie) => (
            <UnifiedMovieCard key={movie.id} movie={movie} variant="carousel" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(GenericMoviesSection);