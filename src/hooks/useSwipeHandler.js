import { useState, useRef, useCallback } from 'react';

/**
 * useSwipeHandler — xử lý kéo/vuốt cho Hero banner và các section carousel.
 *
 * PERF FIX: Trạng thái drag (startX, currentX, dragOffset, ...) được lưu bằng
 * useRef thay vì useState → không trigger re-render toàn trang mỗi pixel di chuyển.
 * Chỉ 2 state thật sự cần re-render UI: isDragging và activeSection.
 */
export const useSwipeHandler = () => {
  // Chỉ 2 state này cần re-render để CSS transition hoạt động
  const [isDragging, setIsDragging] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // Drag data — dùng ref để tránh re-render liên tục khi move
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    dragOffset: 0,
    isHorizontalSwipe: false,
  });

  // dragOffset cần expose ra ngoài cho style CSS — dùng ref + forceUpdate tối thiểu
  const [dragOffset, setDragOffset] = useState(0);

  const getItemsPerSlide = useCallback(() => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth >= 1024 ? 6
      : window.innerWidth >= 768 ? 4
      : window.innerWidth >= 640 ? 3
      : 2;
  }, []);

  // ─── Hero ───────────────────────────────────────────────
  const handleHeroStart = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, currentX: clientX, dragOffset: 0, isHorizontalSwipe: false };
    setIsDragging(true);
    setActiveSection('hero');
    setDragOffset(0);
  }, []);

  const handleHeroMove = useCallback((e) => {
    const d = dragRef.current;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - d.startX;
    const deltaY = clientY - d.startY;

    if (!d.isHorizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      d.isHorizontalSwipe = true;
    }

    if (d.isHorizontalSwipe) {
      e.preventDefault();
      d.currentX = clientX;
      d.dragOffset = deltaX;
      setDragOffset(deltaX); // chỉ update state khi confirmed horizontal
    }
  }, []);

  const handleHeroEnd = useCallback((featuredMovies, setCurrentHeroIndex) => {
    const d = dragRef.current;

    if (d.isHorizontalSwipe) {
      const threshold = 100;
      if (Math.abs(d.dragOffset) > threshold) {
        if (d.dragOffset > 0) {
          setCurrentHeroIndex(prev => prev === 0 ? featuredMovies.length - 1 : prev - 1);
        } else {
          setCurrentHeroIndex(prev => (prev + 1) % featuredMovies.length);
        }
      }
    }

    dragRef.current = { startX: 0, startY: 0, currentX: 0, dragOffset: 0, isHorizontalSwipe: false };
    setIsDragging(false);
    setActiveSection(null);
    setDragOffset(0);
  }, []);

  // ─── Section carousel ───────────────────────────────────
  const handleSectionStart = useCallback((e, sectionId) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, currentX: clientX, dragOffset: 0, isHorizontalSwipe: false };
    setIsDragging(true);
    setActiveSection(sectionId);
    setDragOffset(0);
  }, []);

  const handleSectionMove = useCallback((e) => {
    const d = dragRef.current;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - d.startX;
    const deltaY = clientY - d.startY;

    if (!d.isHorizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      d.isHorizontalSwipe = true;
    }

    if (d.isHorizontalSwipe) {
      e.preventDefault();
      d.currentX = clientX;
      d.dragOffset = deltaX;
      setDragOffset(deltaX);
    }
  }, []);

  const handleSectionEnd = useCallback((movieList, setCurrentSlideIndex) => {
    const d = dragRef.current;
    const currentActiveSection = activeSection;

    if (d.isHorizontalSwipe && currentActiveSection !== 'hero') {
      const threshold = 80;
      const itemsPerSlide = getItemsPerSlide();
      const maxIndex = Math.max(0, movieList.length - itemsPerSlide);

      if (Math.abs(d.dragOffset) > threshold) {
        setCurrentSlideIndex(prev => {
          const currentIndex = prev[currentActiveSection] || 0;
          let newIndex;
          if (d.dragOffset > 0) {
            newIndex = Math.max(currentIndex - itemsPerSlide, 0);
          } else {
            newIndex = Math.min(currentIndex + itemsPerSlide, maxIndex);
          }
          return { ...prev, [currentActiveSection]: newIndex };
        });
      }
    }

    dragRef.current = { startX: 0, startY: 0, currentX: 0, dragOffset: 0, isHorizontalSwipe: false };
    setIsDragging(false);
    setActiveSection(null);
    setDragOffset(0);
  }, [activeSection, getItemsPerSlide]);

  return {
    isDragging,
    activeSection,
    dragOffset,
    getItemsPerSlide,
    handleHeroStart,
    handleHeroMove,
    handleHeroEnd,
    handleSectionStart,
    handleSectionMove,
    handleSectionEnd,
  };
};