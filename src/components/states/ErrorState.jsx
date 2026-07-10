// src/components/states/ErrorState.jsx - SHARED ERROR COMPONENT
import React from 'react';
import { TriangleAlert, RefreshCw } from 'lucide-react';

/**
 * Component hiển thị error state với retry button
 * @param {string} message - Error message
 * @param {function} onRetry - Callback khi click retry
 * @param {string} title - Error title (optional)
 */
const ErrorState = ({
  message = 'Đường truyền vừa trục trặc một chút. Không phải lỗi của bạn đâu.',
  onRetry,
  title = 'Ơ, có gì đó không ổn'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-ember-500/25 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-full glass-subtle border border-ember-500/20 flex items-center justify-center">
          <TriangleAlert className="w-9 h-9 text-ember-400" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-display font-semibold text-white mb-2 text-center">{title}</h3>
      <p className="text-white/45 text-center mb-6 max-w-md text-sm leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-[44px] flex items-center gap-2 px-6 py-3 btn-signature text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 focus-signature"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorState;
