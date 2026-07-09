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
    <div className="min-h-screen bg-black text-ink-primary">
      <div className="container mx-auto px-4 py-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 tracking-tight">
                <Clock className="w-5 h-5 text-brand-hover" />
                Lịch Sử Xem
              </h1>
              <p className="text-ink-muted text-sm mt-0.5">{history.length} phim đã xem</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 text-sm text-brand-hover hover:text-brand border border-brand/30 hover:border-brand/60 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Confirm Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl p-6 mx-4 max-w-sm w-full shadow-cinema-lg animate-scale-in">
              <h3 className="text-lg font-semibold mb-2 text-ink-primary">Xóa toàn bộ lịch sử?</h3>
              <p className="text-ink-secondary text-sm mb-5">Hành động này không thể hoàn tác.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-subtle text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
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
            <div className="bg-white/5 border border-subtle rounded-full p-6 mb-4">
              <Clock className="w-14 h-14 text-ink-muted" strokeWidth={1.5} />
            </div>
            <p className="text-ink-secondary text-lg font-semibold">Chưa có lịch sử xem</p>
            <p className="text-ink-muted text-sm mt-1">Xem phim để lịch sử hiện ở đây</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
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
              className="group cursor-pointer transform transition-all duration-300 ease-out hover:scale-[1.04]"
              onClick={() => navigate(`/movie/${item.slug}`)}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-base-elevated shadow-cinema group-hover:shadow-cinema-lg transition-shadow duration-300">
                <img
                  src={getSafeImageUrl(item.poster, item.title)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 poster-scrim pointer-events-none" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-3 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.slug); }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-brand text-ink-secondary hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer"
                  title="Xóa khỏi lịch sử"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Type badge */}
                {item.type && (
                  <div className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-0.5 rounded-full text-ink-secondary border border-white/10">
                    {TYPE_LABEL[item.type] || item.type}
                  </div>
                )}

                {/* Episode badge */}
                {item.lastEpisodeName && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="bg-brand/90 text-white text-xs px-2 py-0.5 rounded-full truncate block text-center font-medium">
                      {item.lastEpisodeName}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-ink-primary text-xs font-medium mt-2 line-clamp-2 leading-tight">
                {item.title}
              </p>
              <p className="text-ink-muted text-xs mt-0.5">
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
