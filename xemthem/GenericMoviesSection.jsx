// components/GenericMoviesSection.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import MovieCard from '../MovieCard';

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
  getItemsPerSlide
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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

  if (loading) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <div className="text-white text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Đang tải {title.toLowerCase()}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
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
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
            {emoji} {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <div className="text-white text-center">
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
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
          {emoji} {title}
        
        </h2>
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
            Xem thêm
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSlide('prev')}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleSlide('next')}
              disabled={currentSlideIndex >= maxIndex}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
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
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericMoviesSection;