import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { buildImageCandidates } from '../utils/imageHelper';

export const useMovieImage = (rawUrl, fallbackText = 'No Image', opts = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const imgRef = useRef(null);
  const { width, quality } = opts;

  const candidates = useMemo(
    () => buildImageCandidates(rawUrl, fallbackText, { width, quality }),
    [rawUrl, fallbackText, width, quality]
  );

  // Reset khi URL thay đổi (e.g. navigate sang phim khác)
  useEffect(() => {
    setSrcIndex(0);
    setIsLoaded(false);
    setHasError(false);
  }, [rawUrl]);

  const currentSrc = candidates[srcIndex];

  // Nếu ảnh đã có sẵn trong cache trình duyệt, onLoad có thể không fire lại
  // → check img.complete ngay khi gắn ref để bỏ qua spinner.
  const setImgRef = useCallback((node) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (srcIndex < candidates.length - 1) {
      setSrcIndex((prev) => prev + 1);
      setIsLoaded(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return { currentSrc, isLoaded, hasError, handleLoad, handleError, setImgRef };
};
