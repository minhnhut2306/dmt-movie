import React from 'react';
import { Tag, Loader2 } from 'lucide-react';

const MovieKeywords = ({ keywords, keywordsLoading = false }) => {
  if (keywordsLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
        <div className="flex items-center justify-center h-20">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-green-400" />
            <p className="text-gray-400 text-xs">Đang tải từ khóa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Từ khóa ({keywords.length})</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword.id}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-500/30 text-blue-200 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-105"
            title={keyword.name_vn !== keyword.name ? keyword.name_vn : ''}
          >
            #{keyword.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MovieKeywords;