import React, { useEffect, useRef } from 'react';
import { Play, Minimize } from 'lucide-react';
import Hls from 'hls.js';

const VideoPlayer = ({ 
  currentVideoUrl, 
  isFullscreen, 
  setIsFullscreen,
  autoPlay = true 
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!currentVideoUrl) return;

    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      
      hls.loadSource(currentVideoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentVideoUrl;
    }
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