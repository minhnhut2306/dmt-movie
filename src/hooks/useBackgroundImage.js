import { useState, useEffect, useRef } from 'react';
import { buildImageCandidates } from '../utils/imageHelper';

/**
 * Preload ảnh nền (dùng cho CSS background-image) tuần tự qua từng candidate
 * (weserv → wsrv → ảnh gốc → /404.jpg) bằng JS Image(), thay vì nhét cả chuỗi
 * url() vào CSS — cách đó khiến lớp 404.jpg (load tức thì, file tĩnh nhỏ) hiện
 * ra ngay trong lúc ảnh thật còn đang tải mạng, nhìn như lỗi dù không phải.
 *
 * @returns {{ src: string|null, isLoaded: boolean }} src = null trong lúc đang tải
 *   (chưa xác định nguồn nào dùng được) — nơi gọi tự hiện skeleton lúc này.
 */
export const useBackgroundImage = (rawUrl, opts = {}) => {
  const { width, quality } = opts;
  const [src, setSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setSrc(null);
    setIsLoaded(false);

    const candidates = buildImageCandidates(rawUrl, '', { width, quality });
    let index = 0;

    const tryNext = () => {
      if (cancelledRef.current) return;
      if (index >= candidates.length) {
        setIsLoaded(true);
        return;
      }
      const url = candidates[index];
      const img = new Image();
      img.onload = () => {
        if (cancelledRef.current) return;
        setSrc(url);
        setIsLoaded(true);
      };
      img.onerror = () => {
        if (cancelledRef.current) return;
        index += 1;
        tryNext();
      };
      img.src = url;
    };

    tryNext();

    return () => {
      cancelledRef.current = true;
    };
  }, [rawUrl, width, quality]);

  return { src, isLoaded };
};