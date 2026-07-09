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
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="bg-brand/10 border border-brand/20 rounded-full p-4 mb-5">
        <AlertCircle className="w-11 h-11 text-brand-hover" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold text-ink-primary mb-2 tracking-tight">{title}</h3>
      <p className="text-ink-secondary text-center mb-6 max-w-md leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorState;
