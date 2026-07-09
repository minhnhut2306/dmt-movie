// components/SearchResults.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import { useSearchMovies, transformSearchResults } from '../../hooks/userSearchMovie';
import { searchUtils } from '../../utils/searchUtils';
import UnifiedMovieCard from '../UnifiedMovieCard';
import BlockedSearchAlert, { isBlockedKeyword } from './BlockedSearchAlert';

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
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-subtle disabled:opacity-40 disabled:cursor-not-allowed text-ink-primary transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex space-x-1 overflow-x-auto max-w-xs md:max-w-none">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-ink-muted">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-full whitespace-nowrap font-semibold transition-all duration-200 cursor-pointer ${
                    currentPage === page
                      ? 'bg-brand text-white shadow-glow'
                      : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10 hover:text-ink-primary'
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
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-subtle disabled:opacity-40 disabled:cursor-not-allowed text-ink-primary transition-all duration-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ink-primary text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-ink-secondary">Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
        <div className="text-ink-primary text-center">
          <p className="text-brand-hover mb-2 font-semibold">Lỗi tìm kiếm</p>
          <p className="text-ink-muted text-sm">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand hover:bg-brand-hover px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
        <div className="text-ink-primary text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-ink-muted" strokeWidth={1.5} />
          <p className="text-xl mb-2 font-semibold">Không tìm thấy kết quả</p>
          <p className="text-ink-secondary">
            Không có kết quả nào cho "<span className="text-ink-primary">{keyword}</span>"
          </p>
          <p className="text-ink-muted text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-ink-secondary">
          Kết quả cho: <span className="text-ink-primary font-semibold">"{keyword}"</span>
        </p>
        <p className="text-ink-muted text-sm">
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