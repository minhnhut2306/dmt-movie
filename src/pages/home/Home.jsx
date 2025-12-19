import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import HeroBanner from '../../components/Home/HeroBanner';
import GenericMoviesSection from '../../components/Home/GenericMoviesSection';
import { useSwipeHandler } from '../../hooks/useSwipeHandler';
import { MOVIE_SECTIONS } from '../../config/movieSections';

const Home = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(true);

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

  const notificationContent = {
    title: "Thông báo",
    message:
      "Đã có phiên bản DMT Movie V2 có thể có một số bộ phim mà V1 không có và ngược lại. Hãy thử trải nghiệm phiên bản mới nhé! ",
    linkText: "Nhấn vào đây để chuyển sang DMT Movie V2.",
    linkUrl: "https://dmt-movie-v2.vercel.app/",
    type: "info"
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Improved Notification Banner */}
      {showNotification && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse"></div>
          
          <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
              {/* Icon with animation */}
              <div className="flex-shrink-0 pt-0.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                  <div className="relative bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-1.5 flex items-center gap-2 flex-wrap">
                  {notificationContent.title}
                  <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                    MỚI
                  </span>
                </h4>
                
                <p className="text-white text-opacity-95 text-xs sm:text-sm lg:text-base leading-relaxed mb-2 sm:mb-3">
                  {notificationContent.message}
                </p>

                {/* CTA Button */}
                <a 
                  href={notificationContent.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-600 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-yellow-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm group"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  {notificationContent.linkText}
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 p-1 sm:p-1.5 lg:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 group"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
        </div>
      )}

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