import React, { useState, useEffect } from 'react';
import HeroBanner from '../../components/HeroBanner';
import MovieSection from '../../components/MovieSection';
import { useMovieData } from '../../hooks/useMovieData';
import { useSwipeHandler } from '../../hooks/useSwipeHandler';

const Home = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { featuredMovies, movies } = useMovieData();
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
  const handleSectionEnd = (movieList) => originalHandleSectionEnd(movieList, setCurrentSlideIndex);

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

  // Handle slide for button navigation
  const handleSlide = (sectionId, direction) => {
    const itemsPerSlide = getItemsPerSlide();
    const currentIndex = currentSlideIndex[sectionId] || 0;
    
    // Get movie list based on sectionId
    let movieList = movies;
    switch(sectionId) {
      case 'vietnam':
        movieList = movies.filter(movie => movie.country === "Việt Nam");
        break;
      case 'series':
        movieList = movies.filter(movie => movie.type === "Phim Bộ");
        break;
      case 'movies':
        movieList = movies.filter(movie => movie.type === "Phim Lẻ");
        break;
      case 'tvshows':
        movieList = movies.filter(movie => movie.type === "TV Shows");
        break;
      case 'action':
        movieList = movies.filter(movie => movie.genre === "Hành động");
        break;
      case 'animation':
        movieList = movies.filter(movie => movie.genre === "Hoạt hình");
        break;
      default:
        movieList = movies;
    }
    
    const maxIndex = Math.max(0, movieList.length - itemsPerSlide);

    setCurrentSlideIndex(prev => {
      let newIndex;
      if (direction === 'next') {
        newIndex = Math.min(currentIndex + itemsPerSlide, maxIndex);
      } else {
        newIndex = Math.max(currentIndex - itemsPerSlide, 0);
      }
      return { ...prev, [sectionId]: newIndex };
    });
  };

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
        <MovieSection
          title=" Phim Hot Nhất"
          sectionId="trending"
          movieList={movies}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" Phim Việt Nam"
          sectionId="vietnam"
          movieList={movies.filter(movie => movie.country === "Việt Nam")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" Phim Bộ"
          sectionId="series"
          movieList={movies.filter(movie => movie.type === "Phim Bộ")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" Phim Lẻ"
          sectionId="movies"
          movieList={movies.filter(movie => movie.type === "Phim Lẻ")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" TV Shows"
          sectionId="tvshows"
          movieList={movies.filter(movie => movie.type === "TV Shows")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" Phim Hành Động"
          sectionId="action"
          movieList={movies.filter(movie => movie.genre === "Hành động")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
        <MovieSection
          title=" Phim Hoạt Hình"
          sectionId="animation"
          movieList={movies.filter(movie => movie.genre === "Hoạt hình")}
          currentSlideIndex={currentSlideIndex}
          handleSlide={handleSlide}
          isDragging={isDragging}
          activeSection={activeSection}
          dragOffset={dragOffset}
          handleSectionStart={handleSectionStart}
          handleSectionMove={handleSectionMove}
          handleSectionEnd={handleSectionEnd}
          getItemsPerSlide={getItemsPerSlide}
        />
      </div>
    </div>
  );
};

export default Home;