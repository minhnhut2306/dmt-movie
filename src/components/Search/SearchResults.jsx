// components/SearchResults.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchMovies, transformSearchResults } from '../../hooks/userSearchMovie';
import { searchUtils } from '../../utils/searchUtils';
import UnifiedMovieCard from '../UnifiedMovieCard';
import BlockedSearchAlert, { isBlockedKeyword } from './BlockedSearchAlert';
import LoadingState from '../states/LoadingState';
import ErrorState from '../states/ErrorState';
import EmptyState from '../states/EmptyState';

const SearchResults = ({
  keyword,
  currentPage = 1,
  onPageChange
}) => {
  // Kiểm tra từ khóa bị chặn TRƯỚC KHI gọi API
  if (isBlockedKeyword(keyword)) {
    return <BlockedSearchAlert />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: apiData, isLoading, error } = useSearchMovies(keyword, currentPage);
  const movies = transformSearchResults(apiData);
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
      <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all duration-200 cursor-pointer focus-signature"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1.5 overflow-x-auto max-w-[220px] sm:max-w-none scrollbar-hide">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-2 text-white/35">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] h-10 px-3 rounded-lg whitespace-nowrap font-medium text-sm cursor-pointer transition-all duration-200 ${
                    currentPage === page
                      ? 'btn-signature text-white'
                      : 'glass text-white/60 hover:text-white hover:bg-white/10'
                  }`}
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
          className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all duration-200 cursor-pointer focus-signature"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingState variant="grid" count={12} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Tìm kiếm không thành công"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        variant="search"
        title="Không tìm thấy kết quả"
        message={`Không có kết quả nào cho "${keyword}". Thử tìm kiếm với từ khóa khác nhé.`}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-white/70">
          Kết quả cho: <span className="text-white font-semibold">"{keyword}"</span>
        </p>
        <p className="text-white/40 text-sm">
          {searchUtils.formatSearchStats(totalItems, currentPage, itemsPerPage)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-8 gap-3 sm:gap-4 mb-8">
        {movies.map((movie) => (
          <UnifiedMovieCard key={movie.id} movie={movie} variant="search" />
        ))}
      </div>
      {renderPagination()}
    </div>
  );
};

export default SearchResults;
