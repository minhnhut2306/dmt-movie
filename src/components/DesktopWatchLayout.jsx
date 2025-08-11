import React from 'react';
import { Star, Calendar, Clock, Globe, Users, Film, Eye } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import EpisodeList from './EpisodeList';

const DesktopWatchLayout = ({
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
      <div className="container mx-auto px-4 py-6">
        {/* Movie Title */}
        <div className="mb-6">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-blue-400 hover:text-blue-300 mb-2 transition-colors duration-300"
          >
            ← Quay lại chi tiết
          </button>
          <h1 className="text-3xl font-bold text-white">{movieData.name}</h1>
          <p className="text-gray-300">{movieData.origin_name}</p>
          <p className="text-sm text-gray-400 mt-1">
            Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-6">
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
            <VideoPlayer 
              currentVideoUrl={currentVideoUrl}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          </div>

          {/* Video Info */}
          {currentVideoUrl && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600/30">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Đang phát: {currentEpisodeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>{movieData.episodes?.[currentServer]?.server_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>{movieData.quality}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Episode List */}
        <EpisodeList
          episodes={movieData.episodes}
          currentServer={currentServer}
          currentEpisode={currentEpisode}
          setCurrentServer={setCurrentServer}
          setCurrentEpisode={setCurrentEpisode}
          isMobile={false}
        />

        {/* Movie Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Thông Tin Phim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-gray-400">Đánh giá:</span>
                <span className="text-white font-medium">{movieData.vote_average}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Năm:</span>
                <span className="text-white font-medium">{movieData.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Thời lượng:</span>
                <span className="text-white font-medium">{movieData.time}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Chi Tiết</h3>
            <div className="space-y-3 text-sm">
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
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Số tập:</span>
                <span className="text-white font-medium">{movieData.episode_current}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Thể Loại</h3>
            <div className="flex flex-wrap gap-2">
              {movieData.category?.slice(0, 4).map((cat, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Nội Dung Phim</h3>
          <p className="text-gray-300 leading-relaxed">{movieData.content}</p>
        </div>

        {/* Cast */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Diễn Viên</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {movieData.actor?.map((actor, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500 transition-all duration-300 cursor-pointer text-center"
              >
                {actor}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopWatchLayout;