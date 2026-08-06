import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, SearchX } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-iris-400 animate-spin" />
            </div>
            <p className="text-white/50 text-sm">Đang tải...</p>
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

        // Mỗi server gốc từ API có 2 nguồn phát/tập (link_m3u8 + link_embed).
        // Tách thành 2 "server" riêng để user chọn thẳng, thay vì chỉ tự động fallback khi lỗi.
        const expandedEpisodes = [];
        movieDetailData.episodes?.forEach((server) => {
            const baseName = formatServerName(server.server_name);
            const hasEmbed = server.server_data?.some((ep) => !!ep.link_embed);

            expandedEpisodes.push({
                ...server,
                server_name: hasEmbed ? `${baseName} - Server 1` : baseName,
                forceEmbed: false,
            });

            if (hasEmbed) {
                expandedEpisodes.push({
                    ...server,
                    server_name: `${baseName} - Server 2`,
                    forceEmbed: true,
                });
            }
        });

        return {
            ...transformMovieDetail(movieDetailData),
            episodes: expandedEpisodes,
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
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto animate-fade-in">
                    <div className="relative mb-5 inline-block">
                        <div className="absolute inset-0 bg-ember-500/25 blur-2xl rounded-full" />
                        <div className="relative w-20 h-20 rounded-full glass-subtle border border-ember-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-9 h-9 text-ember-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className="text-white text-xl font-display font-bold mb-2">Phim này đã bị phong sát</h2>
                    <p className="text-white/45 mb-6 text-sm">Đừng kiếm chi mắc công gở rồi</p>
                    <div className="space-y-2.5">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full min-h-[46px] btn-signature text-white px-6 py-2.5 rounded-xl2 font-semibold transition-all duration-200 cursor-pointer"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full min-h-[46px] glass text-white/80 px-6 py-2.5 rounded-xl2 font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer"
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-iris-400 animate-spin" />
                    </div>
                    <p className="text-white text-base font-medium">Đang tải thông tin phim...</p>
                </div>
            </div>
        );
    }

    if (isError || error || !movieData) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto animate-fade-in">
                    <div className="relative mb-5 inline-block">
                        <div className="absolute inset-0 bg-ember-500/25 blur-2xl rounded-full" />
                        <div className="relative w-20 h-20 rounded-full glass-subtle border border-ember-500/20 flex items-center justify-center">
                            <SearchX className="w-9 h-9 text-ember-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className="text-white text-xl font-display font-bold mb-2">Không tìm thấy phim</h2>
                    <p className="text-white/45 mb-4 text-sm">Phim này có thể đã bị xóa hoặc không tồn tại.</p>
                    {error && (
                        <p className="text-ember-400/80 text-xs mb-4">
                            Lỗi: {error.message || 'Không thể tải dữ liệu phim'}
                        </p>
                    )}
                    <div className="space-y-2.5">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full min-h-[46px] btn-signature text-white px-6 py-2.5 rounded-xl2 font-semibold transition-all duration-200 cursor-pointer"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full min-h-[46px] glass text-white/80 px-6 py-2.5 rounded-xl2 font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer"
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