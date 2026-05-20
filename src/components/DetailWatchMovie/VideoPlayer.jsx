import React, { useEffect, useRef, useState } from 'react';
import { Play, Minimize, Maximize, AlertTriangle, RefreshCw } from 'lucide-react';
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
  isFullscreen,
  setIsFullscreen,
  autoPlay = true
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const adRangesRef = useRef([]);
  const skippedRef = useRef(new Set());
  const [isLandscape, setIsLandscape] = useState(false);
  const [streamError, setStreamError] = useState(null);

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

  useEffect(() => {
    if (!currentVideoUrl) return;

    const video = videoRef.current;
    adRangesRef.current = [];
    skippedRef.current = new Set();
    setStreamError(null);

    if (!Hls.isSupported()) {
      if (video?.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentVideoUrl;
      }
      return;
    }

    const proxyBase = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const proxyUrl = `${proxyBase}/api/m3u8-proxy?url=${encodeURIComponent(currentVideoUrl)}`;

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
      manifestLoadingMaxRetry: 2,  // Giảm retry để fail nhanh hơn
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 2,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 3,
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

    hlsRef.current = hls;
    hls.loadSource(proxyUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoPlay) {
        video.play().catch(() => {});
      }
    });

    hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
      adRangesRef.current = findAdRanges(data.details.fragments);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // Nếu là 404 hoặc đã retry hết → báo lỗi cho user
            if (data.response?.code === 404 || data.details === 'manifestLoadError') {
              setStreamError({
                type: 'not_found',
                message: 'Video chưa sẵn sàng',
                detail: 'File video chưa được upload lên máy chủ. Vui lòng thử lại sau ít phút hoặc chọn tập khác.',
              });
              hls.destroy();
            } else {
              setStreamError({
                type: 'network',
                message: 'Lỗi kết nối mạng',
                detail: 'Không thể kết nối tới máy chủ phát video. Kiểm tra mạng và thử lại.',
              });
              hls.startLoad();
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            setStreamError({
              type: 'unknown',
              message: 'Lỗi phát video',
              detail: 'Đã xảy ra lỗi không xác định. Thử tải lại trang hoặc chọn tập khác.',
            });
            hls.destroy();
            break;
        }
      }
    });

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
      hls.destroy();
      hlsRef.current = null;
    };
  }, [currentVideoUrl, autoPlay]);

  const handleRetry = () => {
    setStreamError(null);
    // Trigger re-mount bằng cách unmount/remount effect
    const video = videoRef.current;
    if (video) video.load();
    // Re-run effect
    if (currentVideoUrl) {
      const evt = new Event('retryload');
      video?.dispatchEvent(evt);
    }
    // Đơn giản nhất: reload page không mất state
    window.location.reload();
  };

  if (!currentVideoUrl) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-full">
        <div className="text-center text-white p-4">
          <Play className="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" />
          <p className="text-xl font-semibold">Không tìm thấy video</p>
          <p className="text-gray-400 mt-2">Vui lòng chọn tập khác</p>
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

        {/* Error overlay */}
        {streamError && (
          <div className="absolute inset-0 z-20 bg-gray-900/95 flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-md">
              <AlertTriangle className="w-14 h-14 mx-auto mb-4 text-yellow-400" />
              <p className="text-xl font-bold mb-2">{streamError.message}</p>
              <p className="text-gray-400 text-sm mb-6">{streamError.detail}</p>
              {streamError.type !== 'not_found' && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Thử lại
                </button>
              )}
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          autoPlay={autoPlay}
          playsInline
          crossOrigin="anonymous"
          preload="metadata"
        >
          Trình duyệt của bạn không hỗ trợ video này.
        </video>

        {/* Fullscreen button */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
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
