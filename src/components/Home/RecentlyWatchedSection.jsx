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
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          Xem Gần Đây
        </h2>
        <Link
          to="/history"
          className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 transition-colors border border-orange-500/40 hover:border-orange-400/70 px-3 py-1 rounded-full"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {history.map(item => (
          <div
            key={item.slug}
            className="group flex-shrink-0 w-32 sm:w-36 cursor-pointer"
            onClick={() => navigate(`/movie/${item.slug}`)}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
              <img
                src={getSafeImageUrl(item.poster, item.title)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Overlay khi hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="rounded-full bg-orange-500/90 p-2.5">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Nút xóa */}
              <button
                onClick={(e) => handleRemove(e, item.slug)}
                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-gray-300 hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                title="Xóa khỏi lịch sử"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Episode badge */}
              {item.lastEpisodeName && (
                <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded truncate max-w-[80%]">
                  {item.lastEpisodeName}
                </div>
              )}
            </div>

            <p className="text-white text-xs font-medium mt-1.5 line-clamp-2 leading-tight">
              {item.title}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              {timeAgo(item.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyWatchedSection;
