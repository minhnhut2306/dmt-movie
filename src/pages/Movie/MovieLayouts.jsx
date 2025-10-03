import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMovieDetail, transformMovieDetail } from '../../hooks/useMovies';
import MobileDetailLayout from '../../components/DetailWatchMovie/MobileDetailLayout';
import DesktopDetailLayout from '../../components/DetailWatchMovie/DesktopDetailLayout';
import MobileWatchLayout from '../../components/DetailWatchMovie/MobileWatchLayout';
import DesktopWatchLayout from '../../components/DetailWatchMovie/DesktopWatchLayout';
import { formatServerName } from '../../utils/serverUtils';
import { saveWatchHistory, getWatchHistory } from '../../utils/watchHistory';

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
    const isBlockedSlug = blockedKeywords.some(keyword => slug?.toLowerCase().includes(keyword.toLowerCase()));

    useEffect(() => {
        console.log('Current slug from URL params:', slug);
    }, [slug]);

    const { data: movieDetailData, isLoading, error, isError } = useMovieDetail(slug);

    const movieData = useMemo(() => {
        if (!movieDetailData) return null;

        return {
            ...transformMovieDetail(movieDetailData),
            episodes: movieDetailData.episodes?.map(server => ({
                ...server,
                server_name: formatServerName(server.server_name)
            }))
        };
    }, [movieDetailData]);

    // Load watched episodes từ localStorage
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

    // Save watched episodes khi thay đổi
    useEffect(() => {
        if (slug && Object.keys(watchedEpisodes).length > 0) {
            localStorage.setItem(`watched_${slug}`, JSON.stringify(watchedEpisodes));
        }
    }, [watchedEpisodes, slug]);

    // Đánh dấu tập đã xem khi chuyển tập
    useEffect(() => {
        if (activeLayout === 'watch' && movieData) {
            const episodeKey = `${currentServer}_${currentEpisode}`;
            setWatchedEpisodes(prev => ({
                ...prev,
                [episodeKey]: true
            }));
        }
    }, [currentEpisode, currentServer, activeLayout, movieData]);

    useEffect(() => {
        if (movieDetailData) {
            console.log('Raw movie detail data:', movieDetailData);
            console.log('Transformed movie data:', movieData);
        }
        if (error) {
            console.error('Movie detail error:', error);
        }
    }, [movieDetailData, movieData, error]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
    
    useEffect(() => {
        if (slug && movieData && activeLayout === 'watch') {
            saveWatchHistory(slug, currentEpisode, currentServer);
        }
    }, [slug, currentEpisode, currentServer, movieData, activeLayout]);

    // Hiển thị lỗi nếu slug bị chặn
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

    if (isLoading) {
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

    if (isError || error || !movieData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-white text-2xl mb-2">Không tìm thấy phim</h2>
                    <p className="text-gray-400 mb-2">Phim này có thể đã bị xóa hoặc không tồn tại.</p>
                    <p className="text-gray-500 text-sm mb-4">Slug: {slug}</p>
                    {error && (
                        <p className="text-red-400 text-sm mb-4">
                            Lỗi: {error.message || 'Không thể tải dữ liệu phim'}
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
        watchedEpisodes
    };

    return (
        <div>
            {activeLayout === 'detail'
                ? (isMobile ? <MobileDetailLayout {...commonProps} /> : <DesktopDetailLayout {...commonProps} />)
                : (isMobile ? <MobileWatchLayout {...commonProps} /> : <DesktopWatchLayout {...commonProps} />)
            }
        </div>
    );
};

export default MoviePlay;