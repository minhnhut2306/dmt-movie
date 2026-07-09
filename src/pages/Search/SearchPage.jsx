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
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-subtle text-ink-primary transition-all duration-200 cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-ink-primary tracking-tight">
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
          <div className="flex items-center justify-center h-64 bg-base-elevated rounded-2xl border border-subtle">
            <div className="text-ink-primary text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-ink-muted" strokeWidth={1.5} />
              <p className="text-xl mb-2 font-semibold">Tìm kiếm phim yêu thích</p>
              <p className="text-ink-secondary">Sử dụng ô tìm kiếm trên thanh navigation để bắt đầu</p>
              <p className="text-ink-secondary text-sm mt-2">
                Hoặc <button
                  onClick={handleBack}
                  className="text-brand-hover hover:text-brand underline cursor-pointer"
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