import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Loader2 } from 'lucide-react';
import { getSafeImageUrl } from '../utils/imageHelper';

const MovieCardDetail = ({ movie }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/movie/${movie.slug}`);
    window.scrollTo(0, 0);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(true);
    e.target.src = `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`;
  };

  const displayTitle = movie.title || movie.name || 'Untitled';
  const displayRating = movie.rating && movie.rating !== 'N/A' ? movie.rating : null;
  const displayYear = movie.year || 'N/A';
  const displayGenre = movie.genre || 'Chưa phân loại';

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 w-full"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center aspect-[2/3] z-10">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
              <div className="text-gray-400 text-xs sm:text-sm">Đang tải...</div>
            </div>
          </div>
        )}

        <img
          src={getSafeImageUrl(movie.poster || movie.poster_url, displayTitle)}
          alt={displayTitle}
          className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

        {imageLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white drop-shadow-lg" />
          </div>
        )}


        {imageLoaded && displayRating && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 
                         bg-black/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 
                         rounded-lg text-yellow-400 text-xs sm:text-sm lg:text-base 
                         flex items-center shadow-lg">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" />
            <span className="font-medium">{displayRating}</span>
          </div>
        )}


        {imageLoaded && movie.quality && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3
                         bg-red-600 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2
                         rounded-lg text-white text-xs sm:text-sm font-medium shadow-lg">
            {movie.quality}
          </div>
        )}


        {imageLoaded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4">
              <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2 leading-tight">
                {displayTitle}
              </h3>


              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-200 text-xs sm:text-sm">
                <span className="bg-gray-800/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap">
                  {displayYear}
                </span>
                <span className="bg-gray-800/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded truncate max-w-20 sm:max-w-24">
                  {displayGenre}
                </span>
                {movie.type && (
                  <span className="bg-blue-600/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                    {movie.type}
                  </span>
                )}
              </div>


              {movie.episode && movie.episode !== "Full" && (
                <div className="mt-1 sm:mt-2">
                  <span className="bg-green-600/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm text-white font-medium">
                    {movie.episode}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}


        {imageError && imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400 p-4">
              <div className="text-xs sm:text-sm mb-2">Lỗi tải ảnh</div>
              <div className="text-xs font-medium">{displayTitle}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCardDetail;