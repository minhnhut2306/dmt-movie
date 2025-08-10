import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock, Globe, Users, Film, Eye, ArrowLeft, Maximize, Minimize } from 'lucide-react';

const MoviePlayer = () => {
  const [activeLayout, setActiveLayout] = useState('detail');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentServer, setCurrentServer] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dữ liệu thực từ API bạn cung cấp
  const movieData = {
    name: "Ngôi Trường Xác Sống",
    origin_name: "All of Us Are Dead",
    content: "Một trường cấp ba trở thành điểm bùng phát virus thây ma. Các học sinh mắc kẹt phải nỗ lực thoát ra – hoặc biến thành một trong những người nhiễm bệnh hung tợn.",
    poster_url: "https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg",
    thumb_url: "https://phimimg.com/upload/vod/20250325-1/6985255433cba78af7f28fe63c5126c9.jpg",
    time: "65 phút/tập",
    episode_current: "Hoàn Tất (12/12)",
    episode_total: "12",
    quality: "FHD",
    lang: "Vietsub + Lồng Tiếng",
    year: 2022,
    vote_average: 8.287,
    vote_count: 4010,
    actor: ["Park Ji-hu", "Yoon Chan-young", "Cho Yi-hyun", "Lomon", "Yoo In-soo", "Lee You-mi", "Kim Byung-chul", "Lee Kyoo-hyung", "Jeon Bae-soo"],
    category: [
      { name: "Hành Động", slug: "hanh-dong" },
      { name: "Phiêu Lưu", slug: "phieu-luu" },
      { name: "Chính Kịch", slug: "chinh-kich" },
      { name: "Khoa Học", slug: "khoa-hoc" },
      { name: "Viễn Tưởng", slug: "vien-tuong" }
    ],
    country: [{ name: "Hàn Quốc", slug: "han-quoc" }],
    episodes: [
      {
        server_name: "#Hà Nội (Vietsub)",
        server_data: [
          {
            name: "Tập 01",
            slug: "tap-01",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 01",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/15U0OSx5/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/15U0OSx5/index.m3u8"
          },
          {
            name: "Tập 02",
            slug: "tap-02",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 02",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/L13mtaK3/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/L13mtaK3/index.m3u8"
          },
          {
            name: "Tập 03",
            slug: "tap-03",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 03",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/xqyp5Z1I/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/xqyp5Z1I/index.m3u8"
          },
          {
            name: "Tập 04",
            slug: "tap-04",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 04",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/urYLPIR6/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/urYLPIR6/index.m3u8"
          },
          {
            name: "Tập 05",
            slug: "tap-05",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 05",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/PzPUQ6vI/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/PzPUQ6vI/index.m3u8"
          },
          {
            name: "Tập 06",
            slug: "tap-06",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 06",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/BqradtcC/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/BqradtcC/index.m3u8"
          },
          {
            name: "Tập 07",
            slug: "tap-07",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 07",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/NOt6t0Kl/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/NOt6t0Kl/index.m3u8"
          },
          {
            name: "Tập 08",
            slug: "tap-08",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 08",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/7lkLmHTd/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/7lkLmHTd/index.m3u8"
          },
          {
            name: "Tập 09",
            slug: "tap-09",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 09",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/CX7skR5r/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/CX7skR5r/index.m3u8"
          },
          {
            name: "Tập 10",
            slug: "tap-10",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 10",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/BceIVv5Y/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/BceIVv5Y/index.m3u8"
          },
          {
            name: "Tập 11",
            slug: "tap-11",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 11",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/maF3oplG/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/maF3oplG/index.m3u8"
          },
          {
            name: "Tập 12",
            slug: "tap-12",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Vietsub - Tập 12",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/YbkatJrM/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/YbkatJrM/index.m3u8"
          }
        ]
      },
      {
        server_name: "#Hà Nội (Lồng Tiếng)",
        server_data: [
          {
            name: "Tập 01",
            slug: "tap-01",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 01",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/JpYZg7Jp/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/JpYZg7Jp/index.m3u8"
          },
          {
            name: "Tập 02",
            slug: "tap-02",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 02",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/1dVXUeaC/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/1dVXUeaC/index.m3u8"
          },
          {
            name: "Tập 03",
            slug: "tap-03",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 03",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/RI9PdPPK/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/RI9PdPPK/index.m3u8"
          },
          {
            name: "Tập 04",
            slug: "tap-04",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 04",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/8uxFiwTD/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/8uxFiwTD/index.m3u8"
          },
          {
            name: "Tập 05",
            slug: "tap-05",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 05",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/ZIgjYXZN/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/ZIgjYXZN/index.m3u8"
          },
          {
            name: "Tập 06",
            slug: "tap-06",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 06",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/KgGB3Yva/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/KgGB3Yva/index.m3u8"
          },
          {
            name: "Tập 07",
            slug: "tap-07",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 07",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/ZnlWLvub/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/ZnlWLvub/index.m3u8"
          },
          {
            name: "Tập 08",
            slug: "tap-08",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 08",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/3mBOdB1h/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/3mBOdB1h/index.m3u8"
          },
          {
            name: "Tập 09",
            slug: "tap-09",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 09",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/fBrzVXfH/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/fBrzVXfH/index.m3u8"
          },
          {
            name: "Tập 10",
            slug: "tap-10",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 10",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/faYd8qAt/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/faYd8qAt/index.m3u8"
          },
          {
            name: "Tập 11",
            slug: "tap-11",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 11",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/xLFFPtQq/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/xLFFPtQq/index.m3u8"
          },
          {
            name: "Tập 12",
            slug: "tap-12",
            filename: "Ngôi Trường Xác Sống - All of Us Are Dead - 2022 - 1080p - Lồng Tiếng - Tập 12",
            link_embed: "https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20250325/RgQ9zXvf/index.m3u8",
            link_m3u8: "https://s4.phim1280.tv/20250325/RgQ9zXvf/index.m3u8"
          }
        ]
      }
    ]
  };

  // Sample suggested movies
  const suggestedMovies = [
    { name: "Train to Busan", poster: "https://m.media-amazon.com/images/M/MV5BMTkwOTQ4OTg0OV5BMl5BanBnXkFtZTgwMzQyOTM0OTE@._V1_.jpg", year: 2016, rating: 8.5 },
    { name: "Kingdom", poster: "/api/placeholder/200/300", year: 2019, rating: 8.3 },
    { name: "Sweet Home", poster: "/api/placeholder/200/300", year: 2020, rating: 7.9 },
    { name: "Squid Game", poster: "/api/placeholder/200/300", year: 2021, rating: 8.7 },
    { name: "Hellbound", poster: "/api/placeholder/200/300", year: 2021, rating: 7.6 },
    { name: "Zombie Detective", poster: "/api/placeholder/200/300", year: 2020, rating: 7.4 }
  ];

  // Mobile Detail Layout Component
  const MobileDetailLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="px-3 py-4">
        {/* Hero Image */}
        <div className="relative mb-6">
          <div 
            className="h-64 sm:h-80 bg-cover bg-center rounded-xl relative overflow-hidden"
            style={{ backgroundImage: `url(${movieData.thumb_url})` }}
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
                  <span>{movieData.vote_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Poster and Quick Info */}
        <div className="flex gap-4 mb-6">
          <div className="w-28 sm:w-32 flex-shrink-0">
            <img 
              src={movieData.poster_url} 
              alt={movieData.name}
              className="w-full rounded-xl shadow-xl"
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
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h2 className="text-lg font-bold mb-3 text-white">Nội Dung Phim</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{movieData.content}</p>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h3 className="text-lg font-bold mb-3 text-white">Thể Loại</h3>
          <div className="flex flex-wrap gap-2">
            {movieData.category.map((cat, index) => (
              <span 
                key={index}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Cast */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-4">
          <h3 className="text-lg font-bold mb-3 text-white">Diễn Viên</h3>
          <div className="grid grid-cols-2 gap-2">
            {movieData.actor.slice(0, 6).map((actor, index) => (
              <span 
                key={index}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-3 py-2 rounded-lg text-xs text-center"
              >
                {actor}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Movies */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-white">Phim Gợi Ý</h2>
          <div className="grid grid-cols-3 gap-3">
            {suggestedMovies.slice(0, 6).map((movie, index) => (
              <div 
                key={index}
                className="group cursor-pointer transition-all duration-300"
              >
                <div className="aspect-[2/3] bg-gray-600 rounded-lg mb-2 overflow-hidden shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {movie.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <h4 className="text-white font-medium text-xs mb-1 leading-tight">{movie.name}</h4>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400">{movie.year}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    <span className="text-gray-400">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Detail Layout Component
  const DesktopDetailLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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
                  <span>{movieData.vote_count.toLocaleString()} đánh giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info Grid */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Poster */}
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

          {/* Details */}
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
                    <span className="text-white font-medium">{movieData.country[0].name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Thể Loại</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.category.map((cat, index) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Diễn Viên</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.actor.map((actor, index) => (
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

        {/* Suggested Movies */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Gợi Ý</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {suggestedMovies.map((movie, index) => (
              <div 
                key={index}
                className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-[2/3] bg-gray-600 rounded-xl mb-2 overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {movie.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <h4 className="text-white font-medium text-sm mb-1 group-hover:text-purple-300 transition-colors duration-300">{movie.name}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">{movie.year}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    <span className="text-gray-400">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Watch Layout Component
  const MobileWatchLayout = () => {
    const currentVideoUrl = movieData.episodes[currentServer]?.server_data[currentEpisode]?.link_m3u8;
    const currentEpisodeName = movieData.episodes[currentServer]?.server_data[currentEpisode]?.name;
    
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
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 px-2">
            Đang xem: {currentEpisodeName} - {movieData.episodes[currentServer]?.server_name}
          </p>
        </div>

        {/* Video Player - Full Width on Mobile */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          <div className={`bg-black ${isFullscreen ? 'h-full' : 'aspect-video'} relative`}>
            {currentVideoUrl ? (
              <iframe
                src={movieData.episodes[currentServer]?.server_data[currentEpisode]?.link_embed}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={currentEpisodeName}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-full">
                <div className="text-center text-white p-4">
                  <Play className="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" />
                  <p className="text-xl font-semibold">Không tìm thấy video</p>
                  <p className="text-gray-400 mt-2">Vui lòng chọn tập khác</p>
                </div>
              </div>
            )}
            
            {/* Fullscreen controls */}
            {isFullscreen && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-all duration-300"
                >
                  <Minimize className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
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
                  <span>{movieData.episodes[currentServer]?.server_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>{movieData.quality}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content - Hide when fullscreen */}
        {!isFullscreen && (
          <div className="px-3 py-4">
            {/* Episode List - Compact Mobile Version */}
            <div className="mb-6">
              {movieData.episodes.map((server, serverIndex) => (
                <div key={serverIndex} className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {server.server_name}
                    </h3>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/30 shadow-xl">
                    <div className="grid grid-cols-4 gap-2">
                      {server.server_data.map((episode, episodeIndex) => (
                        <button
                          key={episodeIndex}
                          onClick={() => {
                            setCurrentServer(serverIndex);
                            setCurrentEpisode(episodeIndex);
                          }}
                          className={`group relative overflow-hidden rounded-lg font-medium text-xs transition-all duration-300 transform ${
                            currentServer === serverIndex && currentEpisode === episodeIndex
                              ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-lg shadow-orange-500/30 scale-105 z-10'
                              : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-200 hover:from-gray-600 hover:to-gray-500 hover:scale-105'
                          } px-2 py-3 min-h-[44px] flex items-center justify-center`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 whitespace-nowrap text-center">
                            {episode.name}
                          </span>
                          
                          {/* Active episode indicator */}
                          {currentServer === serverIndex && currentEpisode === episodeIndex && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                {movieData.category.map((cat, index) => (
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
                {movieData.actor.slice(0, 6).map((actor, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-2 py-2 rounded-lg text-xs text-center"
                  >
                    {actor}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Movies - Mobile Grid */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-xl">
              <h2 className="text-sm font-bold mb-3 text-white">Phim Gợi Ý</h2>
              <div className="grid grid-cols-3 gap-2">
                {suggestedMovies.slice(0, 6).map((movie, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer transition-all duration-300"
                  >
                    <div className="aspect-[2/3] bg-gray-600 rounded-lg mb-1 overflow-hidden shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {movie.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </div>
                    </div>
                    <h4 className="text-white font-medium text-xs mb-1 leading-tight">{movie.name}</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400">{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-2 h-2 text-yellow-400" fill="currentColor" />
                        <span className="text-gray-400">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Desktop Watch Layout Component 
  const DesktopWatchLayout = () => {
    const currentVideoUrl = movieData.episodes[currentServer]?.server_data[currentEpisode]?.link_m3u8;
    const currentEpisodeName = movieData.episodes[currentServer]?.server_data[currentEpisode]?.name;
    
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
              Đang xem: {currentEpisodeName} - {movieData.episodes[currentServer]?.server_name}
            </p>
          </div>

          {/* Video Player */}
          <div className="mb-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                {currentVideoUrl ? (
                  <iframe
                    src={movieData.episodes[currentServer]?.server_data[currentEpisode]?.link_embed}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={currentEpisodeName}
                  />
                ) : (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" />
                      <p className="text-xl font-semibold">Không tìm thấy video</p>
                      <p className="text-gray-400 mt-2">Vui lòng chọn tập khác</p>
                    </div>
                  </div>
                )}
              </div>
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
                    <span>{movieData.episodes[currentServer]?.server_name}</span>
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
          <div className="mb-8">
            {movieData.episodes.map((server, serverIndex) => (
              <div key={serverIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    {server.server_name}
                  </h3>
                </div>
                
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-600/30 shadow-xl">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                    {server.server_data.map((episode, episodeIndex) => (
                      <button
                        key={episodeIndex}
                        onClick={() => {
                          setCurrentServer(serverIndex);
                          setCurrentEpisode(episodeIndex);
                        }}
                        className={`group relative overflow-hidden rounded-lg font-medium text-xs transition-all duration-300 transform ${
                          currentServer === serverIndex && currentEpisode === episodeIndex
                            ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-lg shadow-orange-500/30 scale-105 z-10'
                            : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-200 hover:from-gray-600 hover:to-gray-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20'
                        } px-3 py-3 min-h-[44px] flex items-center justify-center`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 whitespace-nowrap text-center">
                          {episode.name}
                        </span>
                        
                        {/* Active episode indicator */}
                        {currentServer === serverIndex && currentEpisode === episodeIndex && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                {movieData.category.slice(0, 4).map((cat, index) => (
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
              {movieData.actor.map((actor, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500 transition-all duration-300 cursor-pointer text-center"
                >
                  {actor}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Movies */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Phim Gợi Ý</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {suggestedMovies.map((movie, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-[2/3] bg-gray-600 rounded-xl mb-2 overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                      {movie.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1 group-hover:text-purple-300 transition-colors duration-300">{movie.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">{movie.year}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-gray-400">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Render Active Layout based on screen size */}
      {activeLayout === 'detail' 
        ? (isMobile ? <MobileDetailLayout /> : <DesktopDetailLayout />)
        : (isMobile ? <MobileWatchLayout /> : <DesktopWatchLayout />)
      }
    </div>
  );
};

export default MoviePlayer;