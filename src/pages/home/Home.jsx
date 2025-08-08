/**
 * Trang chủ website xem phim - Home Page
 * Giao diện responsive với hero banner và danh mục phim
 * Tính năng: slider phim, rating, responsive design, swipe hero banner và movie sections
 * Coded by nhutdev
 */

import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock } from 'lucide-react';

const Home = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

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
  const handleHeroStart = (e) => {
    setIsDragging(true);
    setActiveSection('hero');
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleHeroMove = (e) => {
    if (!isDragging || activeSection !== 'hero') return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleHeroEnd = () => {
    if (!isDragging || activeSection !== 'hero') return;

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
    setActiveSection(null);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  // Xử lý swipe cho movie sections
  const handleSectionStart = (e, sectionId) => {
    setIsDragging(true);
    setActiveSection(sectionId);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleSectionMove = (e) => {
    if (!isDragging || activeSection === 'hero') return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleSectionEnd = (movieList) => {
    if (!isDragging || activeSection === 'hero') return;

    const threshold = 80; // Khoảng cách tối thiểu để chuyển slide
    const offset = currentX - startX;
    const itemsPerSlide = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    const maxIndex = Math.max(0, movieList.length - itemsPerSlide);

    if (Math.abs(offset) > threshold) {
      setCurrentSlideIndex(prev => {
        const currentIndex = prev[activeSection] || 0;
        let newIndex;

        if (offset > 0) {
          // Kéo sang phải - về slide trước
          newIndex = Math.max(currentIndex - itemsPerSlide, 0);
        } else {
          // Kéo sang trái - sang slide tiếp theo
          newIndex = Math.min(currentIndex + itemsPerSlide, maxIndex);
        }

        return { ...prev, [activeSection]: newIndex };
      });
    }

    setIsDragging(false);
    setActiveSection(null);
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
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Avatar: The Way of Water",
      poster: "https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Sci-Fi",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Black Panther",
      poster: "https://www.movienewsnet.com/wp-content/uploads/2022/11/WakandaForever.png",
      rating: 7.3,
      year: 2018,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Dune",
      poster: "https://miro.medium.com/v2/resize:fit:1400/0*gmoNFDJEnzHEFzj5.jpg",
      rating: 8.0,
      year: 2021,
      genre: "Sci-Fi",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "No Time to Die",
      poster: "https://m.media-amazon.com/images/M/MV5BZGZiOGZhZDQtZmRkNy00ZmUzLTliMGEtZGU0NjExOGMxZDVkXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg",
      rating: 7.4,
      year: 2021,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "The Batman",
      poster: "https://upload.wikimedia.org/wikipedia/vi/0/07/Batman_2022_CGV.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Game of Thrones",
      poster: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg",
      rating: 9.2,
      year: 2011,
      genre: "Fantasy",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "Stranger Things",
      poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwPKlpSF1q_Gw4Txv9sjUoJFAYRsNgMqZGdw&s",
      rating: 8.7,
      year: 2016,
      genre: "Sci-Fi",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "Breaking Bad",
      poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
      rating: 9.5,
      year: 2008,
      genre: "Drama",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "The Witcher",
      poster: "https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 8.2,
      year: 2019,
      genre: "Fantasy",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "One Piece",
      poster: "https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX1000_.jpg",
      rating: 8.9,
      year: 1999,
      genre: "Anime",
      type: "Phim Bộ",
      country: "Nước ngoài"
    },
    {
      title: "Attack on Titan",
      poster: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 9.0,
      year: 2013,
      genre: "Anime",
      type: "Phim Bộ",
      country: "Nước ngoài"
    },
    {
      title: "Naruto",
      poster: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 8.4,
      year: 2002,
      genre: "Anime",
      type: "Phim Bộ",
      country: "Nước ngoài"
    },
    {
      title: "Dragon Ball Z",
      poster: "https://m.media-amazon.com/images/S/pv-target-images/334f00b53cf3ef848ea7048b25711bc98e8236ce1685a096990c80d0965835ea.png",
      rating: 8.7,
      year: 1989,
      genre: "Anime",
      type: "Phim Bộ",
      country: "Nước ngoài"
    },
    {
      title: "Minions: The Rise of Gru",
      poster: "https://m.media-amazon.com/images/M/MV5BZTAzMTkyNmQtNTMzZS00MTM1LWI4YzEtMjVlYjU0ZWI5Y2IzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 6.5,
      year: 2022,
      genre: "Hoạt hình",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Nữ Hoàng Băng Giá 2",
      poster: "https://upload.wikimedia.org/wikipedia/vi/thumb/8/8c/Frozen2phim.jpg/250px-Frozen2phim.jpg",
      rating: 6.8,
      year: 2019,
      genre: "Hoạt hình",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Bố Già",
      poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/b/o/bogia_mainposter_digital_lite_1_.jpg",
      rating: 7.2,
      year: 2021,
      genre: "Hài hước",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Hai Phượng",
      poster: "https://homepage.momocdn.net/cinema/momo-cdn-api-220615130952-637908953921767257.jpg",
      rating: 6.8,
      year: 2019,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Cô Ba Sài Gòn",
      poster: "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201803/original/images5328695_2.jpg",
      rating: 7.5,
      year: 2017,
      genre: "Tình cảm",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Thiên Linh Cái",
      poster: "https://imgcdn.tapchicongthuong.vn/thumb/w_1000/tcct-media/19/9/18/phim-thien-linh-cai2.jpg",
      rating: 6.9,
      year: 2021,
      genre: "Kinh dị",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Lật Mặt: 48H",
      poster: "https://upload.wikimedia.org/wikipedia/vi/6/62/L%E1%BA%ADt_m%E1%BA%B7t_48h_poster.jpg",
      rating: 7.1,
      year: 2021,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Người Bất Tử",
      poster: "https://metiz.vn/media/poster_film/nbt_1538646325929.JPG",
      rating: 6.7,
      year: 2018,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Về Nhà Đi Con",
      poster: "https://danviet.ex-cdn.com/files/f1/upload/2-2019/images/2019-06-04/Ve-nha-di-con-duoc-tang-so-tap-va-thoi-gian-dong-may-du-kien-dai-hon-56485547_2574630002822221_2523342287681880064_n-1559624631-width960height960.jpg",
      rating: 8.8,
      year: 2019,
      genre: "Gia đình",
      type: "Phim Bộ",
      country: "Việt Nam"
    },
    {
      title: "Hướng Dương Ngược Nắng",
      poster: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/3/27/893367/Huong-Duong-Nguoc-Na-01.jpg",
      rating: 7.9,
      year: 2022,
      genre: "Tình cảm",
      type: "Phim Bộ",
      country: "Việt Nam"
    },
    {
      title: "11 Tháng 5 Ngày",
      poster: "https://cdn-images.vtv.vn/2021/7/27/21921650915034644233299677903239995620907537n-16273793553311945444485.jpg",
      rating: 8.2,
      year: 2018,
      genre: "Tình cảm",
      type: "Phim Bộ",
      country: "Việt Nam"
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

  // Component Movie Section với swipe
  const MovieSection = ({ title, sectionId, movieList }) => {
    const currentIndex = currentSlideIndex[sectionId] || 0;
    const itemsPerSlide = typeof window !== 'undefined' ?
      (window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2) : 6;

    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center">
            {title}
          </h2>
          <button className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
            Xem thêm
          </button>
        </div>

        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => handleSectionStart(e, sectionId)}
          onMouseMove={handleSectionMove}
          onMouseUp={() => handleSectionEnd(movieList)}
          onMouseLeave={() => handleSectionEnd(movieList)}
          onTouchStart={(e) => handleSectionStart(e, sectionId)}
          onTouchMove={handleSectionMove}
          onTouchEnd={() => handleSectionEnd(movieList)}
          style={{ touchAction: 'none' }}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)${isDragging && activeSection === sectionId ? ` translateX(${dragOffset}px)` : ''
                })`
            }}
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
        onMouseDown={handleHeroStart}
        onMouseMove={handleHeroMove}
        onMouseUp={handleHeroEnd}
        onMouseLeave={handleHeroEnd}
        onTouchStart={handleHeroStart}
        onTouchMove={handleHeroMove}
        onTouchEnd={handleHeroEnd}
        style={{ touchAction: 'none' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${currentFeaturedMovie.backgroundImage}')`,
            transform: isDragging && activeSection === 'hero' ? `translateX(${dragOffset}px)` : 'translateX(0)'
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
              transform: isDragging && activeSection === 'hero' ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0)',
              opacity: isDragging && activeSection === 'hero' ? Math.max(0.7, 1 - Math.abs(dragOffset) / 400) : 1
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
          title=" Phim Việt Nam"
          sectionId="vietnam"
          movieList={movies.filter(movie => movie.country === "Việt Nam")}
        />
        <MovieSection
          title=" Phim Bộ"
          sectionId="series"
          movieList={movies.filter(movie => movie.type === "Phim Bộ")}
        />
        <MovieSection
          title=" Phim Lẻ"
          sectionId="movies"
          movieList={movies.filter(movie => movie.type === "Phim Lẻ")}
        />
        <MovieSection
          title=" TV Shows"
          sectionId="tvshows"
          movieList={movies.filter(movie => movie.type === "TV Shows")}
        />
        <MovieSection
          title=" Phim Hành Động"
          sectionId="action"
          movieList={movies.filter(movie => movie.genre === "Hành động")}
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