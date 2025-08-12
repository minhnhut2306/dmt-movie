// pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useSmartNavigation } from '../../utils/searchUtils';
import SearchResults from '../../components/SearchResults';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { navigateBack } = useSmartNavigation();
  
  // Get URL params - removed sort
  const urlKeyword = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page')) || 1;
  
  // Local state - sync với URL, removed sortField
  const [keyword, setKeyword] = useState(urlKeyword);
  const [currentPage, setCurrentPage] = useState(urlPage);

  // Sync local state với URL params khi URL thay đổi
  useEffect(() => {
    setKeyword(urlKeyword);
    setCurrentPage(urlPage);
  }, [urlKeyword, urlPage]);

  // Update URL khi params thay đổi - removed sortField
  useEffect(() => {
    if (keyword.trim()) {
      const params = new URLSearchParams();
      params.set('q', keyword.trim());
      params.set('page', currentPage.toString());
      setSearchParams(params);
    }
  }, [keyword, currentPage, setSearchParams]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back button
  const handleBack = () => {
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Tìm kiếm phim
          </h1>
        </div>

        {/* Search Results or Empty State */}
        {keyword.trim() ? (
          <SearchResults
            keyword={keyword}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          // Empty state - khi chưa có keyword
          <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
            <div className="text-white text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl mb-2">Tìm kiếm phim yêu thích</p>
              <p className="text-gray-400">Sử dụng ô tìm kiếm trên thanh navigation để bắt đầu</p>
              <p className="text-gray-400 text-sm mt-2">
                Hoặc <button 
                  onClick={handleBack} 
                  className="text-blue-400 hover:text-blue-300 underline"
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