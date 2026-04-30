import { useState, useMemo, useEffect } from 'react';
import { buildImageCandidates } from '../utils/imageHelper';

export const useMovieImage = (rawUrl, fallbackText = 'No Image') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const candidates = useMemo(
    () => buildImageCandidates(rawUrl, fallbackText),
    [rawUrl, fallbackText]
  );

  // Reset khi URL thay đổi (e.g. navigate sang phim khác)
  useEffect(() => {
    setSrcIndex(0);
    setIsLoaded(false);
    setHasError(false);
  }, [rawUrl]);

  const currentSrc = candidates[srcIndex];

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

  return { currentSrc, isLoaded, hasError, handleLoad, handleError };
};
