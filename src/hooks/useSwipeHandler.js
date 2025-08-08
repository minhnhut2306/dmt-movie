import { useState } from 'react';

export const useSwipeHandler = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  };

  // Hero banner handlers
  const handleHeroStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveSection('hero');
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  const handleHeroMove = (e) => {
    if (!isDragging || activeSection !== 'hero') return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleHeroEnd = (featuredMovies, setCurrentHeroIndex) => {
    if (!isDragging || activeSection !== 'hero') return;

    const threshold = 100;
    const offset = currentX - startX;

    if (Math.abs(offset) > threshold) {
      if (offset > 0) {
        setCurrentHeroIndex((prevIndex) =>
          prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
        );
      } else {
        setCurrentHeroIndex((prevIndex) =>
          (prevIndex + 1) % featuredMovies.length
        );
      }
    }

    setIsDragging(false);
    setActiveSection(null);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  // Section handlers
  const handleSectionStart = (e, sectionId) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveSection(sectionId);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  const handleSectionMove = (e) => {
    if (!isDragging || activeSection === 'hero') return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleSectionEnd = (movieList, setCurrentSlideIndex) => {
    if (!isDragging || activeSection === 'hero') return;

    const threshold = 80;
    const offset = currentX - startX;
    const itemsPerSlide = getItemsPerSlide();
    const maxIndex = Math.max(0, movieList.length - itemsPerSlide);

    if (Math.abs(offset) > threshold) {
      setCurrentSlideIndex(prev => {
        const currentIndex = prev[activeSection] || 0;
        let newIndex;

        if (offset > 0) {
          newIndex = Math.max(currentIndex - itemsPerSlide, 0);
        } else {
          newIndex = Math.min(currentIndex + itemsPerSlide, maxIndex);
        }

        return { ...prev, [activeSection]: newIndex };
      });
    }

    setIsDragging(false);
    setActiveSection(null);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

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
    handleSectionEnd
  };
};