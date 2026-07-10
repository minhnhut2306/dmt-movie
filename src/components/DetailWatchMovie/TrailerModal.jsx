import React, { useState, useEffect } from 'react';
import { X, ExternalLink, TriangleAlert } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieName }) => {
  const [loadError, setLoadError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Bắt ID YouTube từ mọi định dạng: watch?v=, youtu.be/, /embed/, /shorts/, /v/
    const youtubeRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      const videoId = youtubeMatch[1];
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return {
        type: 'youtube',
        // Dùng youtube-nocookie + truyền origin để tránh bị "từ chối kết nối"
        url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`,
        directUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
    
    // Check if Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return { 
        type: 'vimeo', 
        url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        directUrl: url
      };
    }
    
    // Direct video link
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return { type: 'video', url: url, directUrl: url };
    }
    
    // Default: try as iframe
    return { type: 'iframe', url: url, directUrl: url };
  };

  const embedData = getEmbedUrl(trailerUrl);

  const handleOpenInNewTab = () => {
    window.open(embedData?.directUrl || trailerUrl, '_blank', 'noopener,noreferrer');
  };

  // Tự động mở YouTube nếu iframe bị lỗi
  useEffect(() => {
    if (iframeError && embedData?.type === 'youtube') {
      handleOpenInNewTab();
      onClose();
    }
  }, [iframeError]);

  if (!isOpen || !trailerUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-ink-950/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-5xl glass-strong rounded-t-sheet sm:rounded-xl2 overflow-hidden shadow-glass-lg animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3 sm:hidden" />
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-white font-display font-bold text-base sm:text-lg flex items-center gap-2 truncate">
            <span className="text-ember-400">▶</span>
            <span className="truncate">Trailer - {movieName}</span>
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleOpenInNewTab}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors duration-200 group cursor-pointer"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors duration-200 group cursor-pointer"
            >
              <X className="w-5 h-5 text-white/60 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <TriangleAlert className="w-12 h-12 text-ember-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-white text-xl font-display font-bold mb-3">
                Không thể phát trailer trong trình duyệt
              </h3>
              <p className="text-white/45 mb-6 max-w-md text-sm">
                Video này không cho phép nhúng. Vui lòng mở trực tiếp trên YouTube.
              </p>
              <button
                onClick={handleOpenInNewTab}
                className="btn-signature text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <ExternalLink className="w-5 h-5" />
                Xem trên YouTube
              </button>
            </div>
          ) : embedData?.type === 'video' ? (
            <video
              className="absolute inset-0 w-full h-full"
              controls
              autoPlay
              src={embedData.url}
            >
              Trình duyệt không hỗ trợ video.
            </video>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedData?.url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Trailer ${movieName}`}
              onError={() => {
                setLoadError(true);
                setIframeError(true);
              }}
            />
          )}
        </div>
        
        {!loadError && (
          <div className="p-3 border-t border-white/5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
            <p className="text-white/40 text-sm text-center">
              Nếu trailer không hiển thị,
              <button
                onClick={handleOpenInNewTab}
                className="text-iris-300 hover:text-iris-200 ml-1 underline cursor-pointer"
              >
                nhấn vào đây để xem trên YouTube
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;