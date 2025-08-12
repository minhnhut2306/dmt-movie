import React, { useState, useEffect } from 'react';
import HeroBanner from '../../components/Home/HeroBanner';
import GenericMoviesSection from '../../components/Home/GenericMoviesSection';
import { useMovieData } from '../../hooks/useMovieData';
import { useSwipeHandler } from '../../hooks/useSwipeHandler';
import {
  useMovies,
  useVietnamMovies,
  useSeriesMovies,
  useSingleMovies,
  useTVShows,
  useAnimationMovies,
  useActionMovies,
  transformLatestMovies,
  transformVietnamMovies,
  transformSeriesMovies,
  transformSingleMovies,
  transformTVShows,
  transformAnimationMovies,
  transformActionMovies
} from '../../hooks/useMovies';

// Movie sections configuration
const MOVIE_SECTIONS = [
  {
    title: "Phim Mới Nhất",
    emoji: "🔥",
    sectionKey: "latest",
    badgeColor: "bg-red-600",
    useDataHook: () => useMovies(1),
    transformFunction: transformLatestMovies
  },
  {
    title: "Phim Việt Nam",
    emoji: "🇻🇳",
    sectionKey: "vietnam",
    badgeColor: "bg-red-600",
    useDataHook: () => useVietnamMovies(1),
    transformFunction: transformVietnamMovies
  },
  {
    title: "Phim Bộ",
    emoji: "📺",
    sectionKey: "series",
    badgeColor: "bg-blue-600",
    useDataHook: useSeriesMovies,
    transformFunction: transformSeriesMovies
  },
  {
    title: "Phim Lẻ",
    emoji: "🎬",
    sectionKey: "single",
    badgeColor: "bg-green-600",
    useDataHook: useSingleMovies,
    transformFunction: transformSingleMovies
  },
  {
    title: "TV Shows",
    emoji: "📻",
    sectionKey: "tvshows",
    badgeColor: "bg-purple-600",
    useDataHook: useTVShows,
    transformFunction: transformTVShows
  },
  {
    title: "Phim Hoạt Hình",
    emoji: "🎨",
    sectionKey: "animation",
    badgeColor: "bg-pink-600",
    useDataHook: useAnimationMovies,
    transformFunction: transformAnimationMovies
  },
  {
    title: "Phim Hành Động",
    emoji: "💥",
    sectionKey: "action",
    badgeColor: "bg-orange-600",
    useDataHook: useActionMovies,
    transformFunction: transformActionMovies
  }
];

const Home = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { featuredMovies } = useMovieData();
  const {
    isDragging,
    activeSection,
    dragOffset,
    getItemsPerSlide,
    handleHeroStart,
    handleHeroMove,
    handleHeroEnd: originalHandleHeroEnd,
    handleSectionStart,
    handleSectionMove,
    handleSectionEnd: originalHandleSectionEnd
  } = useSwipeHandler();

  // Wrap handlers to pass required parameters
  const handleHeroEnd = () => originalHandleHeroEnd(featuredMovies, setCurrentHeroIndex);
  const handleSectionEnd = (movieList, updateFn) => originalHandleSectionEnd(movieList, updateFn);

  // Auto slide hero banner
  useEffect(() => {
    if (isDragging) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) =>
        (prevIndex + 1) % featuredMovies.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length, isDragging]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <HeroBanner
        featuredMovies={featuredMovies}
        currentHeroIndex={currentHeroIndex}
        setCurrentHeroIndex={setCurrentHeroIndex}
        isDragging={isDragging}
        activeSection={activeSection}
        dragOffset={dragOffset}
        handleHeroStart={handleHeroStart}
        handleHeroMove={handleHeroMove}
        handleHeroEnd={handleHeroEnd}
      />

      {/* Movie Sections */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {MOVIE_SECTIONS.map((section) => (
          <GenericMoviesSection
            key={section.sectionKey}
            title={section.title}
            emoji={section.emoji}
            sectionKey={section.sectionKey}
            badgeColor={section.badgeColor}
            countText={section.countText}
            useDataHook={section.useDataHook}
            transformFunction={section.transformFunction}
            isDragging={isDragging}
            activeSection={activeSection}
            dragOffset={dragOffset}
            handleSectionStart={handleSectionStart}
            handleSectionMove={handleSectionMove}
            handleSectionEnd={handleSectionEnd}
            getItemsPerSlide={getItemsPerSlide}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;