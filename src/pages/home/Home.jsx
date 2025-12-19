import React, { useState } from 'react';
import HeroBanner from '../../components/Home/HeroBanner';
import GenericMoviesSection from '../../components/Home/GenericMoviesSection';
import { useSwipeHandler } from '../../hooks/useSwipeHandler';
import { MOVIE_SECTIONS } from '../../config/movieSections';

const Home = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const {
    isDragging,
    activeSection,
    dragOffset,
    getItemsPerSlide,
    handleHeroStart,
    handleHeroMove,
    handleSectionStart,
    handleSectionMove,
    handleSectionEnd: originalHandleSectionEnd
  } = useSwipeHandler();

  const handleSectionEnd = (movieList, updateFn) => originalHandleSectionEnd(movieList, updateFn);

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroBanner
        currentHeroIndex={currentHeroIndex}
        setCurrentHeroIndex={setCurrentHeroIndex}
        isDragging={isDragging}
        activeSection={activeSection}
        dragOffset={dragOffset}
        handleHeroStart={handleHeroStart}
        handleHeroMove={handleHeroMove}
      />

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
            viewMoreLink={section.viewMoreLink}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;