import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Clock, ChevronLeft } from 'lucide-react';
import { getAllWatchHistory, removeFromWatchHistory, clearWatchHistory } from '../../utils/watchHistory';
import { getSafeImageUrl } from '../../utils/imageHelper';

const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Vừa xem';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return `${Math.floor(days / 30)} tháng trước`;
};

const TYPE_LABEL = {
  series: 'Phim Bộ',
  single: 'Phim Lẻ',
  tvshows: 'TV Shows',
  hoathinh: 'Hoạt Hình',
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getAllWatchHistory());
  }, []);

  const handleRemove = (slug) => {
    removeFromWatchHistory(slug);
    setHistory(prev => prev.filter(item => item.slug !== slug));
  };

  const handleClearAll = () => {
    clearWatchHistory();
    setHistory([]);
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center glass hover:bg-iris-500/20 rounded-lg transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-display font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-iris-300" />
                Lịch Sử Xem
              </h1>
              <p className="text-white/40 text-xs sm:text-sm mt-0.5">{history.length} phim đã xem</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-red-400 hover:text-red-300 glass hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa tất cả</span>
            </button>
          )}
        </div>

        {/* Confirm Dialog — bottom sheet on mobile, centered glass modal on desktop */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-strong rounded-t-sheet sm:rounded-xl2 p-6 w-full sm:mx-4 sm:max-w-sm shadow-glass-lg animate-slide-up sm:animate-scale-in">
              <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />
              <h3 className="text-lg font-display font-semibold mb-2 text-white">Xóa toàn bộ lịch sử?</h3>
              <p className="text-white/45 text-sm mb-5">Hành động này không thể hoàn tác.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 min-h-[46px] py-2 rounded-xl2 glass hover:bg-white/10 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 min-h-[46px] py-2 rounded-xl2 bg-red-600 hover:bg-red-500 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  Xóa hết
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-iris-500/20 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 rounded-full glass-subtle flex items-center justify-center animate-float">
                <Clock className="w-9 h-9 text-iris-300" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-white text-lg font-display font-semibold">Chưa có lịch sử xem</p>
            <p className="text-white/40 text-sm mt-1">Xem phim để lịch sử hiện ở đây</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 min-h-[46px] btn-signature text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Khám phá phim
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {history.map(item => (
            <div
              key={item.slug}
              className="group cursor-pointer active:scale-[0.97] transition-transform duration-200"
              onClick={() => navigate(`/movie/${item.slug}`)}
            >
              <div className="relative overflow-hidden rounded-card aspect-[2/3] bg-ink-800 ring-1 ring-white/5 shadow-glass">
                <img
                  src={getSafeImageUrl(item.poster, item.title)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent pointer-events-none" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="rounded-full glass-strong p-3 scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.slug); }}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center glass-strong text-white/60 hover:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                  title="Xóa khỏi lịch sử"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Type badge */}
                {item.type && (
                  <div className="absolute top-2 left-2 glass-strong text-[10px] px-2 py-0.5 rounded-md text-white/70">
                    {TYPE_LABEL[item.type] || item.type}
                  </div>
                )}

                {/* Episode badge */}
                {item.lastEpisodeName && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="bg-iris-500/80 text-white text-xs px-2 py-0.5 rounded-md truncate block text-center font-medium">
                      {item.lastEpisodeName}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-white text-xs font-medium mt-2 line-clamp-2 leading-tight">
                {item.title}
              </p>
              <p className="text-white/35 text-xs mt-0.5">
                {timeAgo(item.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
