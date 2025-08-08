import React from 'react';
import { Play, Star, Calendar, Clock } from 'lucide-react';

const HeroBanner = ({ 
  featuredMovies, 
  currentHeroIndex, 
  setCurrentHeroIndex, 
  isDragging, 
  activeSection, 
  dragOffset,
  handleHeroStart,
  handleHeroMove,
  handleHeroEnd 
}) => {
  const currentFeaturedMovie = featuredMovies[currentHeroIndex];

  return (
    <div
      className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleHeroStart}
      onMouseMove={handleHeroMove}
      onMouseUp={handleHeroEnd}
      onMouseLeave={handleHeroEnd}
      onTouchStart={handleHeroStart}
      onTouchMove={handleHeroMove}
      onTouchEnd={handleHeroEnd}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${currentFeaturedMovie.backgroundImage}')`,
          transform: isDragging && activeSection === 'hero' ? `translateX(${dragOffset}px)` : 'translateX(0)'
        }}
      />

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentHeroIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentHeroIndex ? 'bg-red-600' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div
          className="max-w-2xl text-white transition-all duration-300"
          style={{
            transform: isDragging && activeSection === 'hero' ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0)',
            opacity: isDragging && activeSection === 'hero' ? Math.max(0.7, 1 - Math.abs(dragOffset) / 400) : 1
          }}
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 transition-all duration-500">
            {currentFeaturedMovie.title}
          </h1>
          <div className="flex items-center space-x-3 sm:space-x-6 mb-4 text-sm sm:text-base">
            <div className="flex items-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1 sm:mr-2" />
              <span className="font-semibold">{currentFeaturedMovie.rating}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span>{currentFeaturedMovie.year}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span>{currentFeaturedMovie.duration}</span>
            </div>
          </div>
          <p className="text-sm sm:text-lg mb-6 sm:mb-8 text-gray-200 leading-relaxed line-clamp-3 sm:line-clamp-none transition-all duration-500">
            {currentFeaturedMovie.description}
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-lg flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Xem Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;