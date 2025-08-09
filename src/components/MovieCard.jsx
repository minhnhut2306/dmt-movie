import React from 'react';
import { Play, Star } from 'lucide-react';

const MovieCard = ({ movie }) => (
  <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-1 sm:px-2">
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover object-center"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x450/374151/ffffff?text=" + encodeURIComponent(movie.title);
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Play button overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
      </div>
      
      {/* Rating badge */}
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-yellow-400 text-xs sm:text-sm flex items-center shadow-lg">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {movie.rating}
      </div>
      
      {/* Title overlay with translucent border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gray-800/40 backdrop-blur-sm border-t border-gray-400/30 p-2 sm:p-3">
          <h3 className="text-white font-bold text-sm sm:text-base mb-1 truncate leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center text-gray-200 text-xs sm:text-sm space-x-2">
            <span className="bg-gray-800/50 px-1 rounded">{movie.year}</span>
            <span className="bg-gray-800/50 px-1 rounded">{movie.genre}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MovieCard;