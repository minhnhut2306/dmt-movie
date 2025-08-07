/**
 * Trang chủ website xem phim - Home Page
 * Giao diện responsive với hero banner và danh mục phim
 * Tính năng: slider phim, rating, responsive design, swipe hero banner
 * Coded by nhutdev
 */

import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Dữ liệu phim hero banner (5 phim khác nhau)
  const featuredMovies = [
    {
      title: "Spider-Man: No Way Home",
      description: "Peter Parker bị lộ danh tính Spider-Man và không thể tách biệt cuộc sống bình thường với việc làm siêu anh hùng. Khi anh yêu cầu Doctor Strange giúp đỡ, mọi thứ trở nên nguy hiểm hơn bao giờ hết...",
      rating: 8.4,
      year: 2021,
      duration: "148 phút",
      backgroundImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=600&fit=crop"
    },
    {
      title: "Avatar: The Way of Water",
      description: "Jake Sully sống cùng gia đình mới trên hành tinh Pandora. Khi một mối đe dọa quen thuộc trở lại để hoàn thành những gì đã bắt đầu trước đây, Jake phải làm việc với Neytiri và quân đội của chủng tộc Na'vi để bảo vệ hành tinh của họ.",
      rating: 7.6,
      year: 2022,
      duration: "192 phút",
      backgroundImage: "https://ntvb.tmsimg.com/assets/p12460960_v_h8_an.jpg?w=1280&h=720"
    },
    {
      title: "Top Gun: Maverick",
      description: "Sau hơn 30 năm phục vụ như một phi công hàng đầu của Hải quân, Pete 'Maverick' Mitchell đang ở nơi anh thuộc về, vượt qua những ranh giới như một phi công thử nghiệm dũng cảm và né tránh sự thăng tiến trong cấp bậc...",
      rating: 8.3,
      year: 2022,
      duration: "131 phút",
      backgroundImage: "https://thumbnails.cbsig.net/CBS_Production_Entertainment_VMS/2022/10/26/2091444291941/TGMAV_SAlone_16_9_1920x1080_1781067_1920x1080.jpg"
    },
    {
      title: "Black Panther: Wakanda Forever",
      description: "Nữ hoàng Ramonda, Shuri, M'Baku, Okoye và Dora Milaje chiến đấu để bảo vệ quốc gia của họ khỏi các thế lực can thiệp sau cái chết của Vua T'Challa. Khi người Wakanda cố gắng nắm bắt chương tiếp theo của họ...",
      rating: 6.7,
      year: 2022,
      duration: "161 phút",
      backgroundImage: "https://www.movienewsnet.com/wp-content/uploads/2022/11/WakandaForever.png"
    },
    {
      title: "The Batman",
      description: "Khi một kẻ giết người nhắm mục tiêu vào những người có quyền lực ở Gotham City với những manh mối tinh vi, Batman phải đi sâu vào thế giới ngầm để theo dõi manh mối và mang công lý cho những kẻ lạm dụng quyền lực và tham nhũng...",
      rating: 7.8,
      year: 2022,
      duration: "176 phút",
      backgroundImage: "https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/dfa50804-e6f6-4fa2-a732-693dbc50527b/37082735-6715-11ef-96ad-02805d6a02df?host=wbd-images.prod-vod.h264.io&partner=beamcom"
    }
  ];

  // Auto slide hero banner mỗi 5 giây (tạm dừng khi đang kéo)
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) =>
        (prevIndex + 1) % featuredMovies.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length, isDragging]);

  // Xử lý touch/mouse events cho hero banner
  const handleStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100; // Khoảng cách tối thiểu để chuyển slide
    const offset = currentX - startX;
    
    if (Math.abs(offset) > threshold) {
      if (offset > 0) {
        // Kéo sang phải - về slide trước
        setCurrentHeroIndex((prevIndex) =>
          prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
        );
      } else {
        // Kéo sang trái - sang slide tiếp theo
        setCurrentHeroIndex((prevIndex) =>
          (prevIndex + 1) % featuredMovies.length
        );
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  const currentFeaturedMovie = featuredMovies[currentHeroIndex];

  const movies = [
    {
      title: "Top Gun: Maverick",
      poster: "https://play-lh.googleusercontent.com/UJHa0DJftoFAt7rj1M8w7OmVoPxcFoRJAAqV2hbbz8QI-p5xHTxbjidNKM7gE-jxKzDfCuCfIJ7VBxQIcQ=w240-h480-rw",
      rating: 8.3,
      year: 2022,
      genre: "Hành động"
    },
    {
      title: "Avatar: The Way of Water",
      poster: "https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Sci-Fi"
    },
    {
      title: "Black Panther",
      poster: "https://www.movienewsnet.com/wp-content/uploads/2022/11/WakandaForever.png",
      rating: 7.3,
      year: 2018,
      genre: "Hành động"
    },
    {
      title: "Dune",
      poster: "https://miro.medium.com/v2/resize:fit:1400/0*gmoNFDJEnzHEFzj5.jpg",
      rating: 8.0,
      year: 2021,
      genre: "Sci-Fi"
    },
    {
      title: "No Time to Die",
      poster: "https://m.media-amazon.com/images/M/MV5BZGZiOGZhZDQtZmRkNy00ZmUzLTliMGEtZGU0NjExOGMxZDVkXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg",
      rating: 7.4,
      year: 2021,
      genre: "Hành động"
    },
    {
      title: "The Batman",
      poster: "https://upload.wikimedia.org/wikipedia/vi/0/07/Batman_2022_CGV.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Hành động"
    },
    {
      title: "Doctor Strange 2",
      poster: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg/250px-Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg",
      rating: 6.9,
      year: 2022,
      genre: "Siêu anh hùng"
    },
    {
      title: "Thor: Love and Thunder",
      poster: "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/Thor_Love_and_Thunder_poster.jpeg/250px-Thor_Love_and_Thunder_poster.jpeg",
      rating: 6.2,
      year: 2022,
      genre: "Hành động"
    },
    {
      title: "Minions: The Rise of Gru",
      poster: "https://m.media-amazon.com/images/M/MV5BZTAzMTkyNmQtNTMzZS00MTM1LWI4YzEtMjVlYjU0ZWI5Y2IzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 6.5,
      year: 2022,
      genre: "Hoạt hình"
    },
    {
      title: "Nữ Hoàng Băng Giá 2",
      poster: "https://upload.wikimedia.org/wikipedia/vi/thumb/8/8c/Frozen2phim.jpg/250px-Frozen2phim.jpg",
      rating: 6.8,
      year: 2019,
      genre: "Hoạt hình"
    },
    {
      title: "Thanh Gươm Diệt Quỷ: Chuyến Tàu Vô Tận",
      poster: "https://static2.vieon.vn/vieplay-image/poster_v4/2022/07/05/gc3b0iah_660x946-thanhguomdietquy-chuyentauvotan-demo_360_534.jpg",
      rating: 8.2,
      year: 2020,
      genre: "Hoạt hình"
    },
    {
      title: "Công Chúa Và Chàng Ếch",
      poster: "https://image.tmdb.org/t/p/w500//yprv5PbnEksoVj2v6XEnDBg9joR.jpg",
      rating: 7.1,
      year: 2009,
      genre: "Hoạt hình"
    },
    {
      title: "Moana: Hành Trình Vượt Đại Dương",
      poster: "https://upload.wikimedia.org/wikipedia/vi/5/56/Moana_2016_%28Poster%29.jpg",
      rating: 7.6,
      year: 2016,
      genre: "Hoạt hình"
    },
    {
      title: "Công Chúa Tóc Xù",
      poster: "https://lumiere-a.akamaihd.net/v1/images/p_brave_20488_9e833e2b.jpeg",
      rating: 7.1,
      year: 2012,
      genre: "Hoạt hình"
    },
    {
      title: "Tên Cậu Là Gì?",
      poster: "https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_.jpg",
      rating: 8.4,
      year: 2016,
      genre: "Hoạt hình"
    }
  ];

  // Hàm xử lý slide
  const handleSlide = (sectionId, direction) => {
    const itemsPerSlide = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    const maxIndex = Math.max(0, movies.length - itemsPerSlide);

    setCurrentSlideIndex(prev => {
      const currentIndex = prev[sectionId] || 0;
      let newIndex;

      if (direction === 'next') {
        newIndex = Math.min(currentIndex + itemsPerSlide, maxIndex);
      } else {
        newIndex = Math.max(currentIndex - itemsPerSlide, 0);
      }

      return { ...prev, [sectionId]: newIndex };
    });
  };

  // Component Movie Card
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </div>
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-xs sm:text-sm flex items-center">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          {movie.rating}
        </div>
      </div>
      <div className="mt-2 sm:mt-3">
        <h3 className="text-white font-semibold text-sm sm:text-base mb-1 group-hover:text-red-400 transition-colors line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center text-gray-400 text-xs sm:text-sm space-x-2">
          <span>{movie.year}</span>
          <span>{movie.genre}</span>
        </div>
      </div>
    </div>
  );

  // Component Movie Section
  const MovieSection = ({ title, sectionId, movieList }) => {
    const currentIndex = currentSlideIndex[sectionId] || 0;
    const itemsPerSlide = typeof window !== 'undefined' ?
      (window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2) : 6;
    const maxIndex = Math.max(0, movieList.length - itemsPerSlide);

    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
            {title}
          </h2>
          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
              Xem thêm
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSlide(sectionId, 'prev')}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleSlide(sectionId, 'next')}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)` }}
          >
            {movieList.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <div 
        className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${currentFeaturedMovie.backgroundImage}')`,
            transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)'
          }}
        />

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentHeroIndex ? 'bg-red-600' : 'bg-white/50'
                }`}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div 
            className="max-w-2xl text-white transition-all duration-300"
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0)',
              opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) / 400) : 1
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

      {/* Movie Sections */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <MovieSection
          title=" Phim Hot Nhất"
          sectionId="trending"
          movieList={movies}
        />
        <MovieSection
          title=" Phim Mới Cập Nhật"
          sectionId="latest"
          movieList={movies.slice().reverse()}
        />
        <MovieSection
          title=" Phim Được Đánh Giá Cao"
          sectionId="topRated"
          movieList={movies.slice(2, 8)}
        />
        <MovieSection
          title=" Phim Hành Động"
          sectionId="action"
          movieList={movies.filter(movie => movie.genre === "Hành động")}
        />
        <MovieSection
          title=" Phim Sci-Fi"
          sectionId="scifi"
          movieList={movies.filter(movie => movie.genre === "Sci-Fi")}
        />
        <MovieSection
          title=" Phim Hoạt Hình"
          sectionId="animation"
          movieList={movies.filter(movie => movie.genre === "Hoạt hình")}
        />
      </div>
    </div>
  );
};

export default Home;