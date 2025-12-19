// components/SearchResults.jsx
import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import { useSearchMovies, transformSearchResults } from '../../hooks/userSearchMovie';
import { searchUtils } from '../../utils/searchUtils';
import SearchMovieCard from './SearchMovieCard';
import BlockedSearchAlert, { isBlockedKeyword } from './BlockedSearchAlert';

const SearchResults = ({ 
  keyword, 
  currentPage = 1, 
  onPageChange
}) => {
  // Kiểm tra từ khóa bị chặn
  if (isBlockedKeyword(keyword)) {
    return <BlockedSearchAlert />;
  }

  const { data: apiData, isLoading, error } = useSearchMovies(keyword, currentPage);
  
  // Debug: Log raw API data
  useEffect(() => {
    if (apiData) {
      console.log("🔍 Raw API Search Data:", apiData);
      console.log("📊 API Data Structure:", {
        hasData: !!apiData.data,
        hasItems: !!apiData.data?.items,
        itemsCount: apiData.data?.items?.length,
        firstItem: apiData.data?.items?.[0]
      });
    }
  }, [apiData]);

  const movies = transformSearchResults(apiData);
  
  // Debug: Log transformed movies
  useEffect(() => {
    if (movies && movies.length > 0) {
      console.log("✨ Transformed Movies:", {
        count: movies.length,
        firstMovie: movies[0],
        posterUrls: movies.slice(0, 3).map(m => ({
          title: m.title,
          poster: m.poster,
          poster_url: m.poster_url
        }))
      });
    }
  }, [movies]);

  const pagination = apiData?.data?.params?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const itemsPerPage = pagination?.totalItemsPerPage || 24;

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex space-x-1 overflow-x-auto max-w-xs md:max-w-none">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded whitespace-nowrap ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("❌ Search Error:", error);
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-white text-center">
          <p className="text-red-400 mb-2">Lỗi tìm kiếm</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    console.log("⚠️ No movies found for keyword:", keyword);
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-white text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl mb-2">Không tìm thấy kết quả</p>
          <p className="text-gray-400">
            Không có kết quả nào cho "<span className="text-white">{keyword}</span>"
          </p>
          <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      </div>
    );
  }

  console.log(`✅ Rendering ${movies.length} movies`);

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-300">
          Kết quả cho: <span className="text-white font-semibold">"{keyword}"</span>
        </p>
        <p className="text-gray-400 text-sm">
          {searchUtils.formatSearchStats(totalItems, currentPage, itemsPerPage)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mb-8">
        {movies.map((movie, index) => {
          console.log(`🎬 Rendering movie ${index + 1}:`, {
            id: movie.id,
            title: movie.title,
            poster: movie.poster
          });
          return <SearchMovieCard key={movie.id || index} movie={movie} />;
        })}
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default SearchResults;