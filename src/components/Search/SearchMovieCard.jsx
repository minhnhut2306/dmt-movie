import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Star, Loader2, AlertCircle } from "lucide-react";

/**
 * Tạo danh sách URL ảnh để thử lần lượt
 */
const buildImageCandidates = (rawUrl, fallbackText = "No Image") => {
  const placeholder = `https://via.placeholder.com/300x450/374151/ffffff?text=${encodeURIComponent(fallbackText)}`;
  
  console.log("🖼️ Building image candidates for:", rawUrl);
  
  if (!rawUrl || rawUrl === 'null' || rawUrl === null || rawUrl === undefined) {
    console.log("❌ No URL provided, using placeholder");
    return [placeholder];
  }

  const candidates = [];

  // Nếu là URL đầy đủ
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    candidates.push(rawUrl);
    console.log("✅ Added full URL:", rawUrl);
    
    // Thêm proxy CDN
    try {
      const u = new URL(rawUrl);
      const hostPath = `${u.hostname}${u.pathname}${u.search}`;
      const weserv = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}`;
      const wsrv = `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}`;
      
      candidates.push(weserv);
      candidates.push(wsrv);
      console.log("✅ Added proxies:", { weserv, wsrv });
    } catch (e) {
      console.log("⚠️ Failed to parse URL:", e.message);
    }
  } else {
    // Đường dẫn tương đối
    const cdnDomains = [
      'https://img.ophim.live',
      'https://img.ophim1.com',
      'https://phimimg.com'
    ];
    
    let path = rawUrl;
    if (!rawUrl.startsWith('/')) {
      if (rawUrl.startsWith('uploads/')) {
        path = `/${rawUrl}`;
      } else {
        path = `/uploads/movies/${rawUrl}`;
      }
    }
    
    console.log("🔗 Building relative URLs with path:", path);
    
    cdnDomains.forEach(domain => {
      const fullUrl = `${domain}${path}`;
      candidates.push(fullUrl);
      console.log("✅ Added CDN URL:", fullUrl);
    });
  }
  
  // Thêm placeholder cuối cùng
  candidates.push(placeholder);
  
  // Loại bỏ trùng lặp
  const unique = Array.from(new Set(candidates));
  console.log("📦 Final candidates:", unique);
  
  return unique;
};

const SearchMovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const displayTitle = movie?.title || movie?.name || 'Untitled';
  const displayRating = movie?.rating && movie?.rating !== 'N/A' ? movie.rating : null;
  const displayYear = movie?.year || 'N/A';
  const displayType = movie?.type || 'Movie';

  // Debug: Log movie data
  useEffect(() => {
    console.log("🎬 SearchMovieCard received movie:", {
      id: movie?.id,
      title: displayTitle,
      poster: movie?.poster,
      poster_url: movie?.poster_url,
      thumbnail: movie?.thumbnail,
      thumb_url: movie?.thumb_url
    });
  }, [movie]);

  // Ưu tiên poster_url
  const posterUrl = movie?.poster || movie?.poster_url || movie?.thumbnail || movie?.thumb_url;
  const imgCandidates = buildImageCandidates(posterUrl, displayTitle);
  const [srcIdx, setSrcIdx] = useState(0);

  const handleImgLoad = () => {
    console.log("✅ Image loaded successfully:", imgCandidates[srcIdx]);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImgError = (e) => {
    const currentUrl = imgCandidates[srcIdx];
    console.log(`❌ Image load failed (attempt ${srcIdx + 1}/${imgCandidates.length}):`, currentUrl);
    
    const next = Math.min(srcIdx + 1, imgCandidates.length - 1);
    setLoadAttempts(prev => prev + 1);
    
    if (next < imgCandidates.length - 1) {
      console.log("🔄 Trying next URL:", imgCandidates[next]);
      setSrcIdx(next);
    } else {
      console.log("💔 All image URLs failed, showing placeholder");
      setImageError(true);
      setImageLoaded(true);
    }
    
    e.currentTarget.onerror = null;
    e.currentTarget.src = imgCandidates[next];
  };

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group block focus:outline-none"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800">
        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center aspect-[2/3] z-10">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
              <div className="text-gray-400 text-xs sm:text-sm">Đang tải...</div>
              {loadAttempts > 0 && (
                <div className="text-gray-500 text-xs">Thử lần {loadAttempts + 1}</div>
              )}
            </div>
          </div>
        )}

        {/* Image */}
        <img
          key={`${movie.id}-${srcIdx}`}
          src={imgCandidates[srcIdx]}
          alt={displayTitle}
          className={`w-full aspect-[2/3] object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImgLoad}
          onError={handleImgError}
          loading="lazy"
          referrerPolicy="no-referrer"
          decoding="async"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

        {/* Play Icon on Hover */}
        {imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
          </div>
        )}

        {/* Rating Badge */}
        {imageLoaded && displayRating && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 
                         bg-black/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 
                         rounded-lg text-yellow-400 text-xs sm:text-sm 
                         flex items-center shadow-lg">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" />
            <span className="font-medium">{displayRating}</span>
          </div>
        )}

        {/* Quality Badge */}
        {imageLoaded && movie?.quality && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3
                         bg-red-600 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2
                         rounded-lg text-white text-xs sm:text-sm font-medium shadow-lg">
            {movie.quality}
          </div>
        )}

        {/* Movie Info */}
        {imageLoaded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4">
              <h3 className="text-white font-bold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 leading-tight">
                {displayTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-200 text-xs sm:text-sm">
                <span className="bg-gray-800/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap">
                  {displayYear}
                </span>
                <span className="bg-blue-600/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                  {displayType}
                </span>
                {movie?.episode && movie.episode !== "Full" && (
                  <span className="bg-green-600/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs text-white font-medium">
                    {movie.episode}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error State with Debug Info */}
        {imageError && imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center p-4">
            <AlertCircle className="w-12 h-12 text-red-400 mb-2" />
            <div className="text-center text-gray-400">
              <div className="text-xs sm:text-sm mb-2 font-semibold">Lỗi tải ảnh</div>
              <div className="text-xs font-medium mb-2">{displayTitle}</div>
              <div className="text-xs text-gray-500">
                Đã thử {imgCandidates.length} nguồn
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchMovieCard;