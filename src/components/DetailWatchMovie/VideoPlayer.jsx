import React, { useEffect, useRef, useState } from 'react';
import { Play, Minimize, Maximize } from 'lucide-react';
import Hls from 'hls.js';

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

const VideoPlayer = ({
  currentVideoUrl,
  currentEmbedUrl,
  isFullscreen,
  setIsFullscreen,
  autoPlay = true
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const adRangesRef = useRef([]);
  const skippedRef = useRef(new Set());
  const [isLandscape, setIsLandscape] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [useEmbed, setUseEmbed] = useState(false); // fallback sang iframe
  const retryCountRef = useRef(0);
  const [retryKey, setRetryKey] = useState(0);

  // Reset error + retryKey khi đổi video
  useEffect(() => {
    setVideoError(null);
    setUseEmbed(false);
    retryCountRef.current = 0;
    setRetryKey(0);
  }, [currentVideoUrl]);

  // Detect orientation change
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

  // Native fullscreen API
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

  // HLS player
  useEffect(() => {
    if (!currentVideoUrl || videoError) return;

    const video = videoRef.current;
    adRangesRef.current = [];
    skippedRef.current = new Set();

    // Safari native HLS
    if (!Hls.isSupported()) {
      if (video?.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentVideoUrl;
        if (autoPlay) video.play().catch(() => {});
      }
      return;
    }

    const proxyBase = import.meta.env.DEV
      ? 'http://localhost:8787'
      : (import.meta.env.VITE_PROXY_URL || '');
    const proxyUrl = proxyBase && !proxyBase.includes(window.location.hostname)
      ? `${proxyBase}?url=${encodeURIComponent(currentVideoUrl)}`
      : `/api/m3u8-proxy?url=${encodeURIComponent(currentVideoUrl)}`;

    // Hàm kiểm tra URL có phải QC không (dùng cho cả proxy lẫn direct)
    const isAdUrl = (url) => {
      if (!url) return false;
      return (
        /\/v\d+\//.test(url) ||
        url.includes('convertv7/') ||
        url.includes('convertv8/') ||
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
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 20 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeMaxRetry: 5,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 2,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 4,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
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

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (data.levels.length > 1) {
          hls.startLevel = 0;
          hls.nextLevel = -1;
        }
        if (autoPlay) {
          video.play().catch(err => console.log('Autoplay prevented:', err));
        }
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        adRangesRef.current = findAdRanges(data.details.fragments);
      });

      // Chặn QC ở tầng fragment — trước khi decode và phát
      // Hoạt động cả khi dùng proxy lẫn direct load
      hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
        const fragUrl = data.frag?.url || '';
        if (isAdUrl(fragUrl)) {
          // Hủy load fragment QC, skip sang fragment tiếp theo
          console.log('Ad fragment blocked:', fragUrl);
          try {
            hls.stopLoad();
            // Tìm fragment tiếp theo không phải QC
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
          // Proxy bị 502 → fallback direct
          if (sourceUrl === proxyUrl && !directFallbackTriggered) {
            directFallbackTriggered = true;
            console.log('Proxy blocked, falling back to direct...');
            createHls(currentVideoUrl);
            return;
          }

          // Direct cũng fail (CORS/block) → fallback embed iframe
          if (sourceUrl === currentVideoUrl && currentEmbedUrl) {
            console.log('Direct blocked, falling back to embed iframe...');
            hls.destroy();
            setUseEmbed(true);
            return;
          }

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              retryCountRef.current += 1;
              if (retryCountRef.current <= 2) {
                console.log(`Network error, retrying... (${retryCountRef.current}/2)`);
                setTimeout(() => hls.startLoad(), 1000 * retryCountRef.current);
              } else {
                // Hết retry → dùng embed nếu có
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

    const hls = createHls(proxyUrl);

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      for (const ad of adRangesRef.current) {
        if (currentTime >= ad.start - 0.5 && currentTime < ad.end && !skippedRef.current.has(ad.start)) {
          skippedRef.current.add(ad.start);
          video.currentTime = ad.end + 0.1;
          break;
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (hlsInstance) hlsInstance.destroy();
    };
  }, [currentVideoUrl, autoPlay, retryKey, videoError]);

  if (!currentVideoUrl) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center aspect-video">
        <div className="text-center text-white p-4">
          <Play className="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" />
          <p className="text-xl font-semibold">Không tìm thấy video</p>
          <p className="text-gray-400 mt-2">Vui lòng chọn tập khác</p>
        </div>
      </div>
    );
  }

  // Fallback embed iframe khi m3u8 bị block
  if (useEmbed && currentEmbedUrl) {
    return (
      <div
        ref={containerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} ${isLandscape && !isFullscreen ? 'h-screen' : ''}`}
      >
        <div className={`bg-black ${isFullscreen || isLandscape ? 'h-full' : 'aspect-video'} relative`}>
          <iframe
            src={currentEmbedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center aspect-video">
        <div className="text-center text-white p-4">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-semibold mb-2">
            {videoError === 'network' ? 'Không thể tải video' : 'Lỗi phát video'}
          </p>
          <p className="text-gray-400 mt-1 text-sm max-w-xs mx-auto">
            {videoError === 'network'
              ? 'Server video đang bận hoặc link đã hết hạn. Thử chọn server khác hoặc thử lại.'
              : 'Định dạng video không tương thích. Thử chọn server khác.'}
          </p>
          <button
            onClick={() => {
              retryCountRef.current = 0;
              setRetryKey(k => k + 1);
              setVideoError(null);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors"
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

        {/* Fullscreen button - chỉ hiện trên desktop */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
          <button
            onClick={toggleNativeFullscreen}
            className="bg-black/70 text-white p-2 rounded-lg hover:bg-black/90 transition-all backdrop-blur-sm"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
