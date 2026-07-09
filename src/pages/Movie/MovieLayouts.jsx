import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMovieDetail } from '../../hooks/useMovies';
import { transformMovieDetail } from '../../utils/transformFunctions';
import { formatServerName } from '../../utils/serverUtils';
import { saveWatchHistory, getWatchHistory } from '../../utils/watchHistory';

// Lazy load các layout để giảm bundle size ban đầu
const MobileDetailLayout = lazy(() => import('../../components/DetailWatchMovie/MobileDetailLayout'));
const DesktopDetailLayout = lazy(() => import('../../components/DetailWatchMovie/DesktopDetailLayout'));
const MobileWatchLayout = lazy(() => import('../../components/DetailWatchMovie/MobileWatchLayout'));
const DesktopWatchLayout = lazy(() => import('../../components/DetailWatchMovie/DesktopWatchLayout'));

const LayoutFallback = () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
            <div className="relative h-12 w-12 mx-auto mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin"></div>
            </div>
            <p className="text-ink-secondary text-sm">Đang tải...</p>
        </div>
    </div>
);

const MoviePlay = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeLayout, setActiveLayout] = useState('detail');
    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [currentServer, setCurrentServer] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [watchedEpisodes, setWatchedEpisodes] = useState({});
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

    // Warm-up proxy cho tập đầu tiên khi data đã load xong (trước khi user bấm xem)
    useEffect(() => {
        if (!movieData?.episodes?.length) return;
        const firstEpisodeUrl = movieData.episodes[0]?.server_data?.[0]?.link_m3u8;
        if (!firstEpisodeUrl) return;
        const proxyBase = import.meta.env.DEV
            ? 'http://localhost:8787'
            : (import.meta.env.VITE_PROXY_URL || '');
        const warmupUrl = proxyBase && !proxyBase.includes(window.location.hostname)
            ? `${proxyBase}?url=${encodeURIComponent(firstEpisodeUrl)}`
            : `/api/m3u8-proxy?url=${encodeURIComponent(firstEpisodeUrl)}`;
        fetch(warmupUrl).catch(() => {});
    }, [movieData]);

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
            const episodeName = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.name;
            saveWatchHistory(slug, currentEpisode, currentServer, {
                title: movieData.name,
                poster: movieData.poster_url || movieData.thumb_url,
                episodeName,
                type: movieData.type,
            });
        }
    }, [slug, currentEpisode, currentServer, movieData, activeLayout]);

    // Hiển thị lỗi nếu slug bị chặn
    if (isBlockedSlug) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
                    <div className="bg-brand/10 border border-brand/20 rounded-full p-5 w-fit mx-auto mb-5">
                        <div className="text-5xl">🚫</div>
                    </div>
                    <h2 className="text-ink-primary text-2xl font-bold mb-2 tracking-tight">Phim này đã bị phong sát</h2>
                    <p className="text-ink-secondary mb-6">Đừng kiếm chi mắc công gở rồi</p>
                    <div className="space-y-2.5">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 cursor-pointer shadow-cinema active:scale-95"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white/10 hover:bg-white/15 border border-subtle text-ink-primary px-6 py-2.5 rounded-full font-semibold transition-all duration-200 cursor-pointer active:scale-95"
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative h-16 w-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin"></div>
                    </div>
                    <p className="text-ink-primary text-lg font-medium">Đang tải thông tin phim...</p>
                    <p className="text-ink-muted text-sm mt-2">Slug: {slug}</p>
                </div>
            </div>
        );
    }

    if (isError || error || !movieData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
                    <div className="bg-brand/10 border border-brand/20 rounded-full p-5 w-fit mx-auto mb-5">
                        <div className="text-5xl">⚠️</div>
                    </div>
                    <h2 className="text-ink-primary text-2xl font-bold mb-2 tracking-tight">Không tìm thấy phim</h2>
                    <p className="text-ink-secondary mb-2">Phim này có thể đã bị xóa hoặc không tồn tại.</p>
                    <p className="text-ink-muted text-sm mb-4">Slug: {slug}</p>
                    {error && (
                        <p className="text-brand-hover text-sm mb-4">
                            Lỗi: {error.message || 'Không thể tải dữ liệu phim'}
                        </p>
                    )}
                    <div className="space-y-2.5">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 cursor-pointer shadow-cinema active:scale-95"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white/10 hover:bg-white/15 border border-subtle text-ink-primary px-6 py-2.5 rounded-full font-semibold transition-all duration-200 cursor-pointer active:scale-95"
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
            <Suspense fallback={<LayoutFallback />}>
                {activeLayout === 'detail'
                    ? (isMobile ? <MobileDetailLayout {...commonProps} /> : <DesktopDetailLayout {...commonProps} />)
                    : (isMobile ? <MobileWatchLayout {...commonProps} /> : <DesktopWatchLayout {...commonProps} />)
                }
            </Suspense>
        </div>
    );
};

export default MoviePlay;