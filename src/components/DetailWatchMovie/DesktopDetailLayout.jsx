import React from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play } from 'lucide-react';

const DesktopDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="relative mb-12">
          <div
            className="h-96 bg-cover bg-center rounded-2xl relative overflow-hidden"
            style={{ backgroundImage: `url(${movieData.thumb_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 z-10">
              <h1 className="text-4xl font-bold mb-2 text-white">{movieData.name}</h1>
              <p className="text-xl text-gray-200 mb-4">{movieData.origin_name}</p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span>{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{movieData.vote_count} đánh giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-8 mb-12">

          <div className="lg:col-span-1">
            <img
              src={movieData.poster_url}
              alt={movieData.name}
              className="w-full rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Xem Phim
            </button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Thông Tin Phim</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{movieData.content}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">Thời lượng:</span>
                    <span className="text-white font-medium">{movieData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">Tập phim:</span>
                    <span className="text-white font-medium">{movieData.episode_current}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400">Chất lượng:</span>
                    <span className="text-white font-medium">{movieData.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400">Ngôn ngữ:</span>
                    <span className="text-white font-medium">{movieData.lang}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white font-medium">{movieData.country?.[0]?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Thể Loại</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.category?.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Diễn Viên</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.actor?.map((actor, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500 transition-all duration-300 cursor-pointer"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDetailLayout;