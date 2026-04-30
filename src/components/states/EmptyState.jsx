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
      defaultTitle: 'Không tìm thấy kết quả',
      defaultMessage: 'Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả'
    },
    movies: {
      icon: Film,
      defaultTitle: 'Chưa có phim',
      defaultMessage: 'Danh sách phim đang được cập nhật'
    },
    generic: {
      icon: Inbox,
      defaultTitle: 'Không có dữ liệu',
      defaultMessage: 'Chưa có nội dung để hiển thị'
    }
  };

  const config = configs[variant] || configs.generic;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-gray-800/50 rounded-full p-6 mb-4">
        <Icon className="w-16 h-16 text-gray-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{displayTitle}</h3>
      <p className="text-gray-400 text-center max-w-md">{displayMessage}</p>
    </div>
  );
};

export default EmptyState;
