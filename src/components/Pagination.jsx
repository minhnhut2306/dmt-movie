// src/components/Pagination.jsx - SHARED PAGINATION COMPONENT
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Component pagination có thể tái sử dụng
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @param {function} onPageChange - Callback khi đổi trang
 * @param {number} maxVisible - Số trang hiển thị tối đa (default: 5)
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisible = 5 
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Tính toán range pages hiển thị
  const getPageRange = () => {
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust nếu endPage chạm totalPages
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageRange();
  const showFirstPage = pages[0] > 1;
  const showLastPage = pages[pages.length - 1] < totalPages;

  const baseBtn =
    'flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-full border border-subtle bg-white/5 text-ink-secondary hover:bg-white/10 hover:text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 px-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={baseBtn}
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* First Page + Ellipsis */}
      {showFirstPage && (
        <>
          <button onClick={() => handlePageChange(1)} className={baseBtn}>
            1
          </button>
          {pages[0] > 2 && (
            <span className="text-ink-muted px-1">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 flex items-center justify-center text-sm font-semibold border rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
            currentPage === page
              ? 'text-white bg-brand border-brand shadow-glow'
              : 'text-ink-secondary bg-white/5 border-subtle hover:bg-white/10 hover:text-ink-primary'
          }`}
          aria-label={`Trang ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis + Last Page */}
      {showLastPage && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-ink-muted px-1">...</span>
          )}
          <button onClick={() => handlePageChange(totalPages)} className={baseBtn}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={baseBtn}
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="w-4 h-4 sm:ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
