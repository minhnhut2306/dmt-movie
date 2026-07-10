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

  const pageBtnBase = "min-w-[40px] h-10 px-3 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8 px-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* First Page + Ellipsis */}
      {showFirstPage && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20`}
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="text-white/30 px-1">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${pageBtnBase} ${
            currentPage === page
              ? 'btn-signature text-white'
              : 'glass text-white/60 hover:text-white hover:bg-iris-500/20'
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
            <span className="text-white/30 px-1">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="w-4 h-4 sm:ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
