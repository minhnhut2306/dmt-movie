import React, { useEffect, useRef } from 'react';
import { Play, Minimize } from 'lucide-react';
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
  const adRangesRef = useRef([]);
  const skippedRef = useRef(new Set());

  useEffect(() => {
    if (!currentVideoUrl) return;

    const video = videoRef.current;
    adRangesRef.current = [];
    skippedRef.current = new Set();

    if (!Hls.isSupported()) {
      if (video?.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentVideoUrl;
      }
      return;
    }

    // Dùng proxy để lọc QC từ m3u8
    const proxyBase = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const proxyUrl = `${proxyBase}/api/m3u8-proxy?url=${encodeURIComponent(currentVideoUrl)}`;

    const hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    hls.loadSource(proxyUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
      adRangesRef.current = findAdRanges(data.details.fragments);
      console.log('Ad ranges:', adRangesRef.current);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
          case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
          default: hls.destroy(); break;
        }
      }
    });

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      for (const ad of adRangesRef.current) {
        if (currentTime >= ad.start - 0.5 && currentTime < ad.end && !skippedRef.current.has(ad.start)) {
          skippedRef.current.add(ad.start);
          video.currentTime = ad.end + 0.1;
          console.log(`Skipped ad: ${ad.start.toFixed(1)}s → ${ad.end.toFixed(1)}s`);
          break;
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      hls.destroy();
    };
  }, [currentVideoUrl]);

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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div className={`bg-black ${isFullscreen ? 'h-full' : 'aspect-video'} relative`}>
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          autoPlay={autoPlay}
          playsInline
          crossOrigin="anonymous"
        >
          Trình duyệt của bạn không hỗ trợ video này.
        </video>

        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-all duration-300"
            >
              <Minimize className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
