import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TriangleAlert } from 'lucide-react';
import UnifiedMovieCard from '../UnifiedMovieCard';

const SkeletonRow = () => (
  <div className="flex gap-3 overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
        <div className="skeleton rounded-card aspect-[2/3]" />
        <div className="mt-2 h-4 skeleton rounded w-3/4" />
        <div className="mt-1.5 h-3 skeleton rounded w-1/2" />
      </div>
    ))}
  </div>
);

const GenericMoviesSection = ({
  // Section config
  title,
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

  const SectionHeading = () => (
    <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
      <h2 className="text-white text-lg sm:text-2xl font-display font-bold flex items-center gap-3">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-iris-400 to-ember-400 flex-shrink-0" />
        {title}
      </h2>
      <div className="flex items-center gap-2 sm:gap-3">
        {viewMoreLink && (
          <button
            onClick={handleViewMore}
            className="text-white/50 hover:text-iris-300 transition-colors text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mb-10 sm:mb-14">
        <SectionHeading />
        <SkeletonRow />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10 sm:mb-14">
        <SectionHeading />
        <div className="flex items-center justify-center h-56 glass-subtle rounded-card">
          <div className="text-center px-4">
            <TriangleAlert className="w-7 h-7 text-ember-400 mx-auto mb-2" />
            <p className="text-white/70 mb-1 text-sm font-medium">Không tải được {title.toLowerCase()}</p>
            <p className="text-white/35 text-xs mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-signature px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer"
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
      <div className="mb-10 sm:mb-14">
        <SectionHeading />
        <div className="flex items-center justify-center h-56 glass-subtle rounded-card">
          <p className="text-white/35 text-sm">Chưa có {title.toLowerCase()}</p>
        </div>
      </div>
    );
  }

  const itemsPerSlide = getItemsPerSlide();
  const maxIndex = Math.max(0, movies.length - itemsPerSlide);

  return (
    <div className="mb-10 sm:mb-14">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-white text-lg sm:text-2xl font-display font-bold flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-iris-400 to-ember-400 flex-shrink-0" />
          {title}
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          {viewMoreLink && (
            <button
              onClick={handleViewMore}
              className="text-white/50 hover:text-iris-300 transition-colors text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Xem thêm
            </button>
          )}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => handleSlide('prev')}
              disabled={currentSlideIndex === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full glass hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all duration-200 cursor-pointer focus-signature"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSlide('next')}
              disabled={currentSlideIndex >= maxIndex}
              className="w-9 h-9 flex items-center justify-center rounded-full glass hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all duration-200 cursor-pointer focus-signature"
            >
              <ChevronRight className="w-4 h-4" />
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
