import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Clock, Trash2 } from 'lucide-react';
import { getAllWatchHistory, removeFromWatchHistory } from '../../utils/watchHistory';
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

const RecentlyWatchedSection = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getAllWatchHistory().slice(0, 10));
  }, []);

  const handleRemove = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchHistory(slug);
    setHistory(prev => prev.filter(item => item.slug !== slug));
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-10 sm:mb-14">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-white text-lg sm:text-2xl font-display font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-iris-300" />
          Xem Gần Đây
        </h2>
        <Link
          to="/history"
          className="text-xs sm:text-sm text-iris-300 hover:text-iris-200 transition-colors glass px-3 py-1.5 rounded-full cursor-pointer"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {history.map(item => (
          <div
            key={item.slug}
            className="group flex-shrink-0 w-28 sm:w-36 cursor-pointer active:scale-[0.96] transition-transform duration-200"
            onClick={() => navigate(`/movie/${item.slug}`)}
          >
            <div className="relative overflow-hidden rounded-card aspect-[2/3] bg-ink-800 ring-1 ring-white/5 shadow-glass">
              <img
                src={getSafeImageUrl(item.poster, item.title)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/404.jpg'; }}
              />

              {/* Overlay khi hover */}
              <div className="absolute inset-0 bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="rounded-full glass-strong p-2.5">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Nút xóa */}
              <button
                onClick={(e) => handleRemove(e, item.slug)}
                className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center glass-strong text-white/60 hover:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Xóa khỏi lịch sử"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Episode badge */}
              {item.lastEpisodeName && (
                <div className="absolute bottom-1.5 left-1.5 glass-strong text-white text-[10px] px-1.5 py-0.5 rounded-md truncate max-w-[80%]">
                  {item.lastEpisodeName}
                </div>
              )}
            </div>

            <p className="text-white text-xs font-medium mt-1.5 line-clamp-2 leading-tight">
              {item.title}
            </p>
            <p className="text-white/35 text-xs mt-0.5">
              {timeAgo(item.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyWatchedSection;
