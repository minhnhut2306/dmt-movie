import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileDetailLayout from '../../components/DetailWatchMovie/MobileDetailLayout';
import DesktopDetailLayout from '../../components/DetailWatchMovie/DesktopDetailLayout';
import MobileWatchLayout from '../../components/DetailWatchMovie/MobileWatchLayout';
import DesktopWatchLayout from '../../components/DetailWatchMovie/DesktopWatchLayout';
import MovieImagesGallery from '../../components/DetailWatchMovie/MovieImagesGallery';
import MovieCast from '../../components/DetailWatchMovie/MovieCast';
import MovieKeywords from '../../components/DetailWatchMovie/MovieKeywords';
import { formatServerName } from '../../utils/serverUtils';
import { saveWatchHistory, getWatchHistory } from '../../utils/watchHistory';
import { 
  useMovieDetail, 
  useMovieImages, 
  useMoviePeoples, 
  useMovieKeywords,
  transformMovieDetail,
  transformMovieImages,
  transformMoviePeoples,
  transformMovieKeywords
} from '../../hooks/useMovieDetailHooks';

const MoviePlay = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeLayout, setActiveLayout] = useState('detail');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentServer, setCurrentServer] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState({});

  // Chặn slug bị cấm
  const blockedKeywords = ['hay-de-cho-to-toa-sang', 'hay-để-cho-tô-tỏa-sáng'];
  const isBlockedSlug = blockedKeywords.some(keyword => 
    slug?.toLowerCase().includes(keyword.toLowerCase())
  );

  // Fetch data từ các API
  const { data: movieDetailData, isLoading: detailLoading, error: detailError } = useMovieDetail(slug);
  const { data: imagesData, isLoading: imagesLoading } = useMovieImages(slug);
  const { data: peoplesData, isLoading: peoplesLoading } = useMoviePeoples(slug);
  const { data: keywordsData, isLoading: keywordsLoading } = useMovieKeywords(slug);

  // Transform data
  const movieData = useMemo(() => {
    if (!movieDetailData) return null;
    const transformed = transformMovieDetail(movieDetailData);
    return {
      ...transformed,
      episodes: transformed.episodes?.map(server => ({
        ...server,
        server_name: formatServerName(server.server_name)
      }))
    };
  }, [movieDetailData]);

  const movieImages = useMemo(() => {
    if (!imagesData) return [];
    return transformMovieImages(imagesData);
  }, [imagesData]);

  const moviePeoples = useMemo(() => {
    if (!peoplesData) return [];
    return transformMoviePeoples(peoplesData);
  }, [peoplesData]);

  const movieKeywords = useMemo(() => {
    if (!keywordsData) return [];
    return transformMovieKeywords(keywordsData);
  }, [keywordsData]);

  // Load watched episodes
  useEffect(() => {
    if (slug) {
      const savedWatched = localStorage.getItem(`watched_${slug}`);
      if (savedWatched) {
        try {
          setWatchedEpisodes(JSON.parse(savedWatched));
        } catch (e) {
          console.error('Error loading watched episodes:', e);
        }
      }
    }
  }, [slug]);

  // Save watched episodes
  useEffect(() => {
    if (slug && Object.keys(watchedEpisodes).length > 0) {
      localStorage.setItem(`watched_${slug}`, JSON.stringify(watchedEpisodes));
    }
  }, [watchedEpisodes, slug]);

  // Mark episode as watched
  useEffect(() => {
    if (activeLayout === 'watch' && movieData) {
      const episodeKey = `${currentServer}_${currentEpisode}`;
      setWatchedEpisodes(prev => ({
        ...prev,
        [episodeKey]: true
      }));
    }
  }, [currentEpisode, currentServer, activeLayout, movieData]);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load watch history
  useEffect(() => {
    const history = getWatchHistory(slug);
    if (history) {
      setCurrentEpisode(history.lastEpisode);
      setCurrentServer(history.lastServer);
    } else {
      setCurrentEpisode(0);
      setCurrentServer(0);
    }
  }, [slug]);

  // Save watch history
  useEffect(() => {
    if (slug && movieData && activeLayout === 'watch') {
      saveWatchHistory(slug, currentEpisode, currentServer);
    }
  }, [slug, currentEpisode, currentServer, movieData, activeLayout]);

  // Blocked slug handler
  if (isBlockedSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-white text-2xl mb-2">Phim này đã bị phong sát</h2>
          <p className="text-gray-400 mb-4">Đừng kiếm chi mắc công gở rồi</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Quay lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin phim...</p>
          <p className="text-gray-400 text-sm mt-2">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError || !movieData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">Không tìm thấy phim</h2>
          <p className="text-gray-400 mb-2">Phim này có thể đã bị xóa hoặc không tồn tại.</p>
          <p className="text-gray-500 text-sm mb-4">Slug: {slug}</p>
          {detailError && (
            <p className="text-red-400 text-sm mb-4">
              Lỗi: {detailError.message || 'Không thể tải dữ liệu phim'}
            </p>
          )}
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Quay lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const commonProps = {
    movieData,
    navigate,
    setActiveLayout,
    currentEpisode,
    setCurrentEpisode,
    currentServer,
    setCurrentServer,
    isFullscreen,
    setIsFullscreen,
    watchedEpisodes,
    // Thêm các props mới
    movieImages,
    moviePeoples,
    movieKeywords,
    imagesLoading,
    peoplesLoading,
    keywordsLoading
  };

  return (
    <div>
      {activeLayout === 'detail' ? (
        isMobile ? (
          <MobileDetailLayout {...commonProps} />
        ) : (
          <DesktopDetailLayout {...commonProps} />
        )
      ) : (
        isMobile ? (
          <MobileWatchLayout {...commonProps} />
        ) : (
          <DesktopWatchLayout {...commonProps} />
        )
      )}
    </div>
  );
};

export default MoviePlay;