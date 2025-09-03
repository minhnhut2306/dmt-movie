import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
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
    title: "Phiên bản mới",
    message: "Đã fix lỗi hiển thị trên TV, fix hiển thị phim mới nhất ",
    type: "info"
  };
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Notification Banner */}
      {showNotification && (
        <div className={`${getNotificationStyle(notificationContent.type)} border-b-2 text-white relative`}>
          <div className="container mx-auto px-2 xs:px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-2 xs:py-3 sm:py-4 lg:py-5">
            <div className="flex items-start justify-between space-x-2 xs:space-x-3 sm:space-x-4 lg:space-x-6">
              <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4 flex-1">
                <Info className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-1 xs:mb-2 break-words">
                    {notificationContent.title}
                  </h4>
                  <p className="text-xs xs:text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl opacity-90 leading-relaxed break-words">
                    {notificationContent.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 xs:p-1.5 sm:p-2 lg:p-3 xl:p-4 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200 flex-shrink-0"
                aria-label="Đóng thông báo"
              >
                <X className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
              </button>
            </div>
          </div>
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