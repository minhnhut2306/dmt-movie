// pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useSmartNavigation } from '../../utils/searchUtils';
import SearchResults from '../../components/Search/SearchResults';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { navigateBack } = useSmartNavigation();

  const urlKeyword = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page')) || 1;


  const [keyword, setKeyword] = useState(urlKeyword);
  const [currentPage, setCurrentPage] = useState(urlPage);

  useEffect(() => {
    setKeyword(urlKeyword);
    setCurrentPage(urlPage);
  }, [urlKeyword, urlPage]);

  useEffect(() => {
    if (keyword.trim()) {
      const params = new URLSearchParams();
      params.set('q', keyword.trim());
      params.set('page', currentPage.toString());
      setSearchParams(params);
    }
  }, [keyword, currentPage, setSearchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleBack = () => {
    navigateBack();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="flex items-center mb-6 gap-4">
          <button
            onClick={handleBack}
            className="w-11 h-11 flex items-center justify-center rounded-full glass hover:bg-iris-500/20 text-white transition-all duration-200 cursor-pointer focus-signature flex-shrink-0"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
            Tìm kiếm phim
          </h1>
        </div>
        {keyword.trim() ? (
          <SearchResults
            keyword={keyword}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="flex items-center justify-center h-64 glass-subtle rounded-xl2 animate-fade-in">
            <div className="text-center px-4">
              <div className="relative mb-4 inline-block">
                <div className="absolute inset-0 bg-iris-500/20 blur-2xl rounded-full" />
                <div className="relative w-16 h-16 rounded-full glass-subtle flex items-center justify-center animate-float">
                  <Search className="w-7 h-7 text-iris-300" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-xl font-display font-semibold text-white mb-2">Tìm kiếm phim yêu thích</p>
              <p className="text-white/45 text-sm">Sử dụng ô tìm kiếm trên thanh navigation để bắt đầu</p>
              <p className="text-white/45 text-sm mt-2">
                Hoặc <button
                  onClick={handleBack}
                  className="text-iris-300 hover:text-iris-200 underline cursor-pointer"
                >
                  quay lại trang trước
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
