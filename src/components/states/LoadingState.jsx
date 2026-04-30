// src/components/states/LoadingState.jsx - SHARED LOADING COMPONENT
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Component hiển thị loading state với skeleton hoặc spinner
 * @param {string} variant - 'skeleton' | 'spinner' | 'grid'
 * @param {number} count - Số lượng skeleton items (cho variant grid)
 * @param {string} message - Message hiển thị (optional)
 */
const LoadingState = ({ variant = 'spinner', count = 8, message = 'Đang tải...' }) => {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-800 rounded-2xl aspect-[2/3]" />
            <div className="mt-2 h-4 bg-gray-800 rounded w-3/4" />
            <div className="mt-1 h-3 bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // variant === 'skeleton'
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="bg-gray-800 rounded-lg h-32 w-24" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
            <div className="h-3 bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
