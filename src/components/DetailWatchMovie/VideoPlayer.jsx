import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Minimize, Maximize } from 'lucide-react';
import Hls from 'hls.js';
import { saveWatchPosition, getWatchPosition } from '../../utils/watchHistory';

const isRoundDuration = (d) => Number.isInteger(d) || Math.abs(d - Math.round(d)) < 0.05;

const findAdRanges = (fragments) => {
  const adRanges = [];
  let accumulated = 0;
  let adStart = null;

  for (const frag of fragments) {
    const isAd = frag.relurl && (
      /\/v\d+\//.test(frag.relurl) ||
      frag.relurl.includes('convertv7/')
    );
    if (isAd && adStart === null) adStart = accumulated;
    else if (!isAd && adStart !== null) {
      adRanges.push({ start: adStart, end: accumulated });
      adStart = null;
    }
    accumulated += frag.duration;
  }
  if (adStart !== null) adRanges.push({ start: adStart, end: accumulated });

  if (adRanges.length === 0) {
    accumulated = 0;
    let roundStart = null;
    let roundCount = 0;

    for (const frag of fragments) {
      if (isRoundDuration(frag.duration)) {
        if (roundStart === null) roundStart = accumulated;
        roundCount++;
      } else {
        if (roundCount >= 6) {
          const duration = accumulated - roundStart;
          if (duration >= 15 && duration <= 120) {
            adRanges.push({ start: roundStart, end: accumulated });
          }
        }
        roundStart = null;
        roundCount = 0;
      }
      accumulated += frag.duration;
    }
    if (roundCount >= 6) {
      const duration = accumulated - roundStart;
      if (duration >= 15 && duration <= 120) {
        adRanges.push({ start: roundStart, end: accumulated });
      }
    }
  }

  return adRanges;
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({
  currentVideoUrl,
  currentEmbedUrl,
  isFullscreen,
  setIsFullscreen,
  autoPlay = true,
  slug,
  episodeIndex = 0,
  serverIndex = 0,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [useEmbed, setUseEmbed] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const retryCountRef = useRef(0);
  const [retryKey, setRetryKey] = useState(0);
  const [resumePrompt, setResumePrompt] = useState(null); // { time: number }
  const savePositionTimerRef = useRef(null);

  useEffect(() => {
    setVideoError(null);
    setUseEmbed(false);
    setEmbedFailed(false);
    retryCountRef.current = 0;
    setRetryKey(0);
  }, [currentVideoUrl]);

  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(isLandscapeMode);
      if (isLandscapeMode && window.innerWidth < 1024) {
        setIsFullscreen(true);
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleOrientationChange, 150);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsFullscreen]);

  const toggleNativeFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen]);

  useEffect(() => {
    if (!currentVideoUrl) return;
    if (videoError) return;
    if (useEmbed && !embedFailed) return;

    const video = videoRef.current;


    const proxyBase = import.meta.env.VITE_PROXY_URL || '';
    const proxyUrl = proxyBase
      ? `${proxyBase}?url=${encodeURIComponent(currentVideoUrl)}`
      : `/api/m3u8-proxy?url=${encodeURIComponent(currentVideoUrl)}`;
    console.log('[PROXY] VITE_PROXY_URL =', proxyBase || '(not set)');
    console.log('[PROXY] Using proxy URL =', proxyUrl.split('?')[0]);

    // iOS/Safari: native HLS, không dùng HLS.js — vẫn cần qua proxy để lọc QC
    if (!Hls.isSupported()) {
      if (video?.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = proxyUrl;
        if (autoPlay) video.play().catch(() => {});
      }
      return;
    }

    const isAdUrl = (url) => {
      if (!url) return false;
      return (
        url.includes('/adjump/') ||
        url.includes('convertv7/') ||
        url.includes('convertv8/') ||
        /\/v\d+\//.test(url) ||
        /segment_\d+\.ts/.test(url) ||
        url.includes('/ads/') ||
        url.includes('/ad/') ||
        /\/commercial\//.test(url)
      );
    };

    let hlsInstance = null;
    let directFallbackTriggered = false;

    const createHls = (sourceUrl) => {
      if (hlsInstance) hlsInstance.destroy();

      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: false,
        // [FIX] tăng buffer để giảm stall khi mạng không ổn
        backBufferLength: 60,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        maxBufferSize: 40 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeMaxRetry: 5,
        manifestLoadingTimeOut: 6000,
        manifestLoadingMaxRetry: 1,
        levelLoadingTimeOut: 8000,
        levelLoadingMaxRetry: 1,
        fragLoadingTimeOut: 15000,
        fragLoadingMaxRetry: 2,
        // Bắt đầu quality thấp → video start nhanh → ABR tự scale lên
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.85,
        abrBandWidthUpFactor: 0.6,
        capLevelToPlayerSize: true,
        startLevel: -1,
        maxLoadingDelay: 4,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        startFragPrefetch: true,
        testBandwidth: true,
      });

      hlsInstance = hls;
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(err => console.log('Autoplay prevented:', err));
        }
        // Kiểm tra vị trí xem trước đó
        if (slug) {
          const savedTime = getWatchPosition(slug, episodeIndex, serverIndex);
          if (savedTime && savedTime > 30) {
            setResumePrompt({ time: savedTime });
          }
        }
      });

      // Chặn QC ở tầng fragment — trước khi download
      hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
        const fragUrl = data.frag?.url || '';
        console.log('[FRAG]', fragUrl.substring(0, 80));
        if (isAdUrl(fragUrl)) {
          console.log('[AD BLOCKED]', fragUrl);
          try {
            hls.stopLoad();
            const level = hls.levels[hls.currentLevel];
            if (level?.details?.fragments) {
              const frags = level.details.fragments;
              const currentSn = data.frag.sn;
              const nextFrag = frags.find(f => f.sn > currentSn && !isAdUrl(f.url));
              if (nextFrag) {
                video.currentTime = nextFrag.start + 0.1;
              }
            }
            hls.startLoad();
          } catch (e) {
            // silent
          }
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (sourceUrl === proxyUrl && !directFallbackTriggered) {
            directFallbackTriggered = true;
            console.log('[PROXY] Proxy failed! Error:', data.type, data.details, '→ fallback to direct HLS');
            createHls(currentVideoUrl);
            return;
          }

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              retryCountRef.current += 1;
              if (retryCountRef.current <= 2) {
                setTimeout(() => hls.startLoad(), 1000 * retryCountRef.current);
              } else {
                if (currentEmbedUrl) {
                  hls.destroy();
                  setUseEmbed(true);
                } else {
                  setVideoError('network');
                  hls.destroy();
                }
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              if (currentEmbedUrl) {
                hls.destroy();
                setUseEmbed(true);
              } else {
                setVideoError('fatal');
                hls.destroy();
              }
              break;
          }
        }
      });

      return hls;
    };

    const hls = createHls(embedFailed ? currentVideoUrl : proxyUrl);

    let lastSavedTime = 0;
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      // Lưu vị trí mỗi 5 giây
      if (slug && currentTime > 10 && currentTime - lastSavedTime >= 5) {
        lastSavedTime = currentTime;
        saveWatchPosition(slug, episodeIndex, serverIndex, currentTime);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (hlsInstance) hlsInstance.destroy();
    };
  }, [currentVideoUrl, autoPlay, retryKey, videoError, embedFailed]);

  if (!currentVideoUrl) {
    return (
      <div className="bg-base-elevated flex items-center justify-center aspect-video">
        <div className="text-center text-ink-primary p-4">
          <Play className="w-16 h-16 mx-auto mb-4 text-brand" fill="currentColor" />
          <p className="text-xl font-semibold">Không tìm thấy video</p>
          <p className="text-ink-muted mt-2">Vui lòng chọn tập khác</p>
        </div>
      </div>
    );
  }

  if (useEmbed && currentEmbedUrl && !embedFailed) {
    return (
      <div
        ref={containerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} ${isLandscape && !isFullscreen ? 'h-screen' : ''}`}
      >
        <div className={`bg-black ${isFullscreen || isLandscape ? 'h-full' : 'aspect-video'} relative`}>
          <iframe
            src={currentEmbedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            frameBorder="0"
            onError={() => setEmbedFailed(true)}
          />
          <div className="absolute bottom-3 right-3 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setEmbedFailed(true)}
              className="bg-black/70 text-ink-muted hover:text-ink-primary text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors duration-200 cursor-pointer"
            >
              Video không phát? Thử cách khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videoError || (embedFailed && !currentEmbedUrl)) {
    return (
      <div className="bg-base-elevated flex items-center justify-center aspect-video">
        <div className="text-center text-ink-primary p-4">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-semibold mb-2">Không thể phát video</p>
          <p className="text-ink-muted mt-1 text-sm max-w-xs mx-auto">
            Link video đã hết hạn hoặc không còn khả dụng. Vui lòng thử lại sau hoặc chọn phim khác.
          </p>
          <button
            onClick={() => {
              retryCountRef.current = 0;
              setRetryKey(k => k + 1);
              setVideoError(null);
              setUseEmbed(false);
              setEmbedFailed(false);
            }}
            className="mt-4 bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} ${isLandscape && !isFullscreen ? 'h-screen' : ''}`}
    >
      <div className={`bg-black ${isFullscreen || isLandscape ? 'h-full' : 'aspect-video'} relative group`}>
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
        >
          Trình duyệt của bạn không hỗ trợ video này.
        </video>

        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden lg:block">
          <button
            onClick={toggleNativeFullscreen}
            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 backdrop-blur-sm cursor-pointer"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {resumePrompt && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90%]">
            <div className="glass-panel rounded-2xl px-4 py-3 shadow-cinema-lg flex items-center gap-3 animate-scale-in">
              <span className="text-ink-primary text-sm">
                Bạn đã xem đến <span className="text-gold-light font-semibold">{formatTime(resumePrompt.time)}</span>, tiếp tục?
              </span>
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = resumePrompt.time;
                  setResumePrompt(null);
                }}
                className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                Tiếp tục
              </button>
              <button
                onClick={() => setResumePrompt(null)}
                className="text-ink-muted hover:text-ink-primary text-xs px-2 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                Xem lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
