// components/SearchMovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Loader2 } from 'lucide-react';

const SearchMovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/movie/${movie.slug}`);
    window.scrollTo(0, 0);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(true);
    e.target.src = "https://via.placeholder.com/300x450/374151/ffffff?text=" + encodeURIComponent(movie.title);
  };

  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gray-800">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center aspect-[2/3]">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              <div className="text-gray-400 text-xs">Đang tải...</div>
            </div>
          </div>
        )}

        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

        {/* Play button overlay */}
        {imageLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
          </div>
        )}

        {/* Rating badge */}
        {imageLoaded && movie.rating && (
          <div className="absolute top-2 right-2 
                         bg-black/80 backdrop-blur-sm px-2 py-1 
                         rounded-lg text-yellow-400 text-xs 
                         flex items-center shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            <span className="font-medium">{movie.rating}</span>
          </div>
        )}

        {/* Quality badge */}
        {imageLoaded && movie.quality && (
          <div className="absolute top-2 left-2 
                         bg-red-600/90 backdrop-blur-sm px-2 py-1 
                         rounded text-white text-xs font-bold shadow-lg">
            {movie.quality}
          </div>
        )}

        {/* Title overlay */}
        {imageLoaded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gray-900/90 backdrop-blur-sm p-3">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 leading-tight">
                {movie.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                <span className="bg-blue-600/80 px-1.5 py-0.5 rounded">
                  {movie.year}
                </span>
                <span className="bg-green-600/80 px-1.5 py-0.5 rounded">
                  {movie.type}
                </span>
              </div>
              
              <div className="text-xs text-gray-400 truncate">
                {movie.genre}
              </div>
              
              {movie.episode && (
                <div className="text-xs text-orange-400 font-medium mt-1">
                  {movie.episode}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovieCard;