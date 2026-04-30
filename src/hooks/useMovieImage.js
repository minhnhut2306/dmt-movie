// src/hooks/useMovieImage.js - SHARED IMAGE LOADING HOOK
import { useState } from 'react';
import { buildImageCandidates } from '../utils/imageHelper';

/**
 * Hook quản lý state loading ảnh với fallback chain
 * @param {string} rawUrl - URL ảnh gốc
 * @param {string} fallbackText - Text hiển thị khi không có ảnh
 * @returns {object} - { currentSrc, isLoaded, hasError, handleLoad, handleError }
 */
export const useMovieImage = (rawUrl, fallbackText = 'No Image') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const candidates = buildImageCandidates(rawUrl, fallbackText);
  const currentSrc = candidates[srcIndex];

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    // Thử URL tiếp theo trong chain
    if (srcIndex < candidates.length - 1) {
      setSrcIndex(prev => prev + 1);
      setIsLoaded(false);
    } else {
      // Hết URLs để thử
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return {
    currentSrc,
    isLoaded,
    hasError,
    handleLoad,
    handleError,
  };
};
