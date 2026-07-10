// src/components/states/EmptyState.jsx - SHARED EMPTY STATE COMPONENT
import React from 'react';
import { Search, Film, Inbox } from 'lucide-react';

/**
 * Component hiển thị empty state
 * @param {string} variant - 'search' | 'movies' | 'generic'
 * @param {string} message - Custom message
 * @param {string} title - Title text
 */
const EmptyState = ({
  variant = 'generic',
  message,
  title
}) => {
  const configs = {
    search: {
      icon: Search,
      defaultTitle: 'Không tìm thấy gì cả',
      defaultMessage: 'Cuốn phim bạn tìm đang trốn ở đâu đó. Thử từ khóa khác hoặc kiểm tra lại chính tả xem sao.'
    },
    movies: {
      icon: Film,
      defaultTitle: 'Kệ phim này còn trống',
      defaultMessage: 'Đội ngũ đang lên phim mới cho mục này. Quay lại sau nhé, hứa sẽ đáng chờ.'
    },
    generic: {
      icon: Inbox,
      defaultTitle: 'Chưa có gì ở đây',
      defaultMessage: 'Nội dung đang được cập nhật. Ghé lại sau một chút nhé.'
    }
  };

  const config = configs[variant] || configs.generic;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-iris-500/20 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-full glass-subtle flex items-center justify-center animate-float">
          <Icon className="w-9 h-9 text-iris-300" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-display font-semibold text-white mb-2 text-center">{displayTitle}</h3>
      <p className="text-white/45 text-center max-w-md text-sm leading-relaxed">{displayMessage}</p>
    </div>
  );
};

export default EmptyState;
