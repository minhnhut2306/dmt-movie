// components/SearchInput.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Ban } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSearchState, useSmartNavigation } from '../../utils/searchUtils';
import { isBlockedKeyword } from './BlockedSearchAlert';

const SearchInput = ({ 
  placeholder = "Tìm kiếm phim...", 
  className = "",
  isLoading = false,
  autoFocus = false,
  showClearButton = true,
  variant = "navbar" 
}) => {
  const inputRef = useRef(null);
  const location = useLocation();
  const { searchInput, setSearchInput, clearSearch } = useSearchState();
  const { navigateBack, navigateToSearch, isOnSearchPage } = useSmartNavigation();
  const timeoutRef = useRef(null);

  // Kiểm tra nếu input hiện tại bị chặn
  const isBlocked = isBlockedKeyword(searchInput);

  useEffect(() => {
    if (variant === "page") {
      const urlParams = new URLSearchParams(location.search);
      const urlKeyword = urlParams.get('q') || '';
      if (urlKeyword !== searchInput) {
        setSearchInput(urlKeyword);
      }
    }
  }, [location.search, variant, searchInput, setSearchInput]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Kiểm tra từ khóa bị chặn
    if (isBlockedKeyword(value)) {
      // Nếu bị chặn, vẫn navigate để hiển thị trang cảnh báo
      if (variant === "navbar" && value.trim()) {
        timeoutRef.current = setTimeout(() => {
          navigateToSearch(value.trim());
        }, 500);
      }
      return;
    }

    if (variant === "navbar") {
      if (value.trim()) {
        timeoutRef.current = setTimeout(() => {
          if (value.trim()) {
            navigateToSearch(value.trim());
          }
        }, 500);
      } else {
        if (isOnSearchPage) {
          navigateBack();
        }
      }
    }
  }, [setSearchInput, variant, navigateToSearch, isOnSearchPage, navigateBack]);

  const handleClear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    clearSearch();
    
    if (isOnSearchPage) {
      navigateBack();
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [clearSearch, isOnSearchPage, navigateBack]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
      return;
    }
    if (e.key === 'Enter' && searchInput.trim()) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (variant === "navbar") {
        // Cho phép navigate ngay cả khi bị chặn để hiển thị cảnh báo
        navigateToSearch(searchInput.trim());
      }
      return;
    }
    
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const currentValue = e.target.value;

      if (currentValue.length === 1) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          const newValue = inputRef.current?.value || '';
          if (!newValue.trim()) {
            if (isOnSearchPage) {
              navigateBack();
            }
          }
        }, 50); 
      }
    }
  }, [handleClear, searchInput, variant, navigateToSearch, isOnSearchPage, navigateBack]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <Search className="text-blue-400" size={20} />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className={`bg-gray-800 text-white rounded-xl pl-11 pr-12 py-3 w-full outline-none transition-all text-sm lg:text-base border ${
          isBlocked 
            ? 'border-red-500 ring-2 ring-red-500/50 focus:ring-red-600 focus:border-red-600' 
            : 'border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
        } shadow-lg`}
      />
      
      {isLoading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        </div>
      )}
      
      {isBlocked && !isLoading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <Ban className="w-4 h-4 text-red-500" />
        </div>
      )}
      
      {showClearButton && searchInput && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-red-600 bg-gray-700 rounded-lg transition-all group"
          title={isOnSearchPage ? "Quay lại trang trước" : "Xóa tìm kiếm"}
        >
          <X 
            size={18} 
            className="text-gray-300 group-hover:text-white transition-colors" 
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;