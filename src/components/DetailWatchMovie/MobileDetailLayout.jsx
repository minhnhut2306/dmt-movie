import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play, Youtube } from 'lucide-react';
import { getSafeImageUrl } from '../../utils/imageHelper';
import TrailerModal from './TrailerModal';
import { sanitizeHtmlContent } from '../../utils/htmlUtils';

const MobileDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="px-3 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="relative mb-6">
          <div
            className="h-64 sm:h-80 bg-cover bg-center rounded-xl relative overflow-hidden"
            style={{ backgroundImage: `url(${getSafeImageUrl(movieData.thumb_url, movieData.name)})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{movieData.name}</h1>
              <p className="text-lg text-gray-200 mb-3">{movieData.origin_name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-300 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span>{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{movieData.vote_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="w-28 sm:w-32 flex-shrink-0">
            <img
              src={getSafeImageUrl(movieData.poster_url, movieData.name)}
              alt={movieData.name}
              className="w-full rounded-xl shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Thời lượng:</span>
                <span className="text-white font-medium">{movieData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Số tập:</span>
                <span className="text-white font-medium">{movieData.episode_current}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Chất lượng:</span>
                <span className="text-white font-medium">{movieData.quality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400">Ngôn ngữ:</span>
                <span className="text-white font-medium">{movieData.lang}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Xem Phim
            </button>

            {movieData.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                Xem Trailer
              </button>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h2 className="text-lg font-bold mb-3 text-white">Nội Dung Phim</h2>
          <p className="text-gray-300 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(movieData.content) }}></p>
        </div>

        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h3 className="text-lg font-bold mb-3 text-white">Thể Loại</h3>
          <div className="flex flex-wrap gap-2">
            {movieData.category?.map((cat, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h3 className="text-lg font-bold mb-3 text-white">Diễn Viên</h3>
          <div className="grid grid-cols-2 gap-2">
            {movieData.actor?.slice(0, 6).map((actor, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-3 py-2 rounded-lg text-xs text-center"
              >
                {actor}
              </span>
            ))}
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movieData.trailer_url}
        movieName={movieData.name}
      />
    </div>
  );
};

export default MobileDetailLayout;