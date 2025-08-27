import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Loader2 } from 'lucide-react';

const MovieCard = ({ movie }) => {
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
    e.target.src = "https://via.placeholder.com/400x600/374151/ffffff?text=" + encodeURIComponent(movie.title);
  };

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 
                 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 
                 px-2 mb-4"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center aspect-[2/3]">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <div className="text-gray-400 text-sm">Đang tải...</div>
            </div>
          </div>
        )}

        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        {imageLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg" />
          </div>
        )}

        {imageLoaded && (
          <div className="absolute top-3 right-3 
                         bg-black/80 backdrop-blur-sm px-3 py-2 
                         rounded-lg text-yellow-400 text-sm sm:text-base 
                         flex items-center shadow-lg">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
            <span className="font-medium">{movie.rating}</span>
          </div>
        )}
        {imageLoaded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gray-800/40 backdrop-blur-sm border-t border-gray-400/30 p-3 sm:p-4">
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 truncate leading-tight">
                {movie.title}
              </h3>
              <div className="flex items-center text-gray-200 text-sm sm:text-base space-x-3">
                <span className="bg-gray-800/50 px-1 py-1 rounded whitespace-nowrap">
                  {movie.year}
                </span>
                <span className="bg-gray-800/50 px-1 py-1 rounded whitespace-nowrap truncate">
                  {movie.genre}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;