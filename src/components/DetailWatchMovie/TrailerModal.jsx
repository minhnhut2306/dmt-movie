import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieName }) => {
  const [loadError, setLoadError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Check if YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return { 
        type: 'youtube', 
        url: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
        directUrl: url
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
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/50 to-purple-900/50 border-b border-gray-700">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-red-500">▶</span>
            Trailer - {movieName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewTab}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
            >
              <X className="w-6 h-6 text-gray-300 group-hover:text-white" />
            </button>
          </div>
        </div>
        
        <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-white text-xl font-bold mb-3">
                Không thể phát trailer trong trình duyệt
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Video này không cho phép nhúng. Vui lòng mở trực tiếp trên YouTube.
              </p>
              <button
                onClick={handleOpenInNewTab}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
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
              onLoad={(e) => {
                // Kiểm tra nếu iframe bị chặn
                try {
                  if (!e.target.contentWindow) {
                    setIframeError(true);
                    setLoadError(true);
                  }
                } catch {
                  setIframeError(true);
                  setLoadError(true);
                }
              }}
            />
          )}
        </div>
        
        {!loadError && (
          <div className="p-3 bg-gray-800/50 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              Nếu trailer không hiển thị, 
              <button 
                onClick={handleOpenInNewTab}
                className="text-blue-400 hover:text-blue-300 ml-1 underline"
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