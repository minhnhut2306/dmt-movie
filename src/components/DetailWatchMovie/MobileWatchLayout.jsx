import React from 'react';
import { ArrowLeft, Star, Calendar, Eye, Globe, Film } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import EpisodeList from '../EpisodeList';

const MobileWatchLayout = ({
  movieData,
  setActiveLayout,
  currentEpisode,
  currentServer,
  setCurrentEpisode,
  setCurrentServer,
  isFullscreen,
  setIsFullscreen
}) => {
  const currentVideoUrl = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.link_m3u8;
  const currentEpisodeName = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Mobile Header */}
      <div className="px-3 py-3 border-b border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{movieData.name}</h1>
            <p className="text-sm text-gray-300 truncate">{movieData.origin_name}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 px-2">
          Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
        </p>
      </div>

      {/* Video Player - Full Width on Mobile */}
      <VideoPlayer 
        currentVideoUrl={currentVideoUrl}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />

      {/* Video Info - Only show when not fullscreen */}
      {!isFullscreen && currentVideoUrl && (
        <div className="px-3 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border-b border-gray-600/30">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Đang phát: {currentEpisodeName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{movieData.episodes?.[currentServer]?.server_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>{movieData.quality}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content - Hide when fullscreen */}
      {!isFullscreen && (
        <div className="px-3 py-4">
          {/* Episode List - Compact Mobile Version */}
          <EpisodeList
            episodes={movieData.episodes}
            currentServer={currentServer}
            currentEpisode={currentEpisode}
            setCurrentServer={setCurrentServer}
            setCurrentEpisode={setCurrentEpisode}
            isMobile={true}
          />

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-3 rounded-xl shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">Thông Tin</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span className="text-gray-400">Đánh giá:</span>
                  <span className="text-white font-medium">{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-400">Năm:</span>
                  <span className="text-white font-medium">{movieData.year}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-3 rounded-xl shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">Chi Tiết</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-purple-400" />
                  <span className="text-gray-400">Chất lượng:</span>
                  <span className="text-white font-medium">{movieData.quality}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">Số tập:</span>
                  <span className="text-white font-medium">{movieData.episode_current}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
            <h3 className="text-sm font-bold text-white mb-2">Nội Dung Phim</h3>
            <p className="text-gray-300 leading-relaxed text-xs">{movieData.content}</p>
          </div>

          {/* Categories - Compact */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
            <h3 className="text-sm font-bold text-white mb-2">Thể Loại</h3>
            <div className="flex flex-wrap gap-1">
              {movieData.category?.map((cat, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          {/* Cast - Compact Grid */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
            <h3 className="text-sm font-bold text-white mb-3">Diễn Viên</h3>
            <div className="grid grid-cols-2 gap-2">
              {movieData.actor?.slice(0, 6).map((actor, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-2 py-2 rounded-lg text-xs text-center"
                >
                  {actor}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileWatchLayout;