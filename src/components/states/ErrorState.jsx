// src/components/states/ErrorState.jsx - SHARED ERROR COMPONENT
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Component hiển thị error state với retry button
 * @param {string} message - Error message
 * @param {function} onRetry - Callback khi click retry
 * @param {string} title - Error title (optional)
 */
const ErrorState = ({ 
  message = 'Đã xảy ra lỗi khi tải dữ liệu', 
  onRetry,
  title = 'Lỗi'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-red-500/10 rounded-full p-4 mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorState;
