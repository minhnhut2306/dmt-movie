import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieSection = ({ 
  title, 
  sectionId, 
  movieList,
  currentSlideIndex,
  handleSlide,
  isDragging,
  activeSection,
  dragOffset,
  handleSectionStart,
  handleSectionMove,
  handleSectionEnd,
  getItemsPerSlide
}) => {
  const currentIndex = currentSlideIndex[sectionId] || 0;
  const itemsPerSlide = getItemsPerSlide();
  const maxIndex = Math.max(0, movieList.length - itemsPerSlide);
  
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
          {title}
        </h2>
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
            Xem thêm
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSlide(sectionId, 'prev')}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleSlide(sectionId, 'next')}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handleSectionStart(e, sectionId)}
        onMouseMove={handleSectionMove}
        onMouseUp={() => handleSectionEnd(movieList)}
        onMouseLeave={() => handleSectionEnd(movieList)}
        onTouchStart={(e) => handleSectionStart(e, sectionId)}
        onTouchMove={handleSectionMove}
        onTouchEnd={() => handleSectionEnd(movieList)}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)${
              isDragging && activeSection === sectionId ? ` translateX(${dragOffset}px)` : ''
            }`
          }}
        >
          {movieList.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSection;