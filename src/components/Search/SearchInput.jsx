// components/SearchInput.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSearchState, useSmartNavigation } from '../../utils/searchUtils';

const SearchInput = ({ 
  placeholder = "Tìm kiếm phim...", 
  className = "",
  isLoading = false,
  autoFocus = false,
  showClearButton = true,
  variant = "navbar" // "navbar" hoặc "page"
}) => {
  const inputRef = useRef(null);
  const location = useLocation();
  const { searchInput, setSearchInput, clearSearch } = useSearchState();
  const { navigateBack, navigateToSearch, isOnSearchPage } = useSmartNavigation();
  const timeoutRef = useRef(null);

  // Sync với URL keyword (chỉ khi ở SearchPage)
  useEffect(() => {
    if (variant === "page") {
      const urlParams = new URLSearchParams(location.search);
      const urlKeyword = urlParams.get('q') || '';
      if (urlKeyword !== searchInput) {
        setSearchInput(urlKeyword);
      }
    }
  }, [location.search, variant, searchInput, setSearchInput]);

  // Auto focus nếu cần
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle input change với debounce tốt hơn
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto navigation when typing (for navbar variant)
    if (variant === "navbar") {
      if (value.trim()) {
        // Debounce navigation để tránh quá nhiều request
        timeoutRef.current = setTimeout(() => {
          if (value.trim()) {
            navigateToSearch(value.trim());
          }
        }, 500);
      } else {
        // Nếu input rỗng và đang ở SearchPage, quay lại trang trước
        if (isOnSearchPage) {
          navigateBack();
        }
      }
    }
  }, [setSearchInput, variant, navigateToSearch, isOnSearchPage, navigateBack]);

  // Handle clear - Enhanced with navigation logic
  const handleClear = useCallback(() => {
    // Clear timeout nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    clearSearch();
    
    // Nếu đang ở SearchPage và clear search
    if (isOnSearchPage) {
      // Navigate về trang trước
      navigateBack();
    } else {
      // Nếu không ở SearchPage, chỉ focus vào input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [clearSearch, isOnSearchPage, navigateBack]);

  // Handle key press với logic cải thiện
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
      return;
    }
    
    // Handle Enter key for manual search trigger
    if (e.key === 'Enter' && searchInput.trim()) {
      // Clear timeout để tránh double navigation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (variant === "navbar") {
        navigateToSearch(searchInput.trim());
      }
      return;
    }
    
    // Handle khi user xóa content bằng Backspace/Delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const currentValue = e.target.value;
      
      // Nếu sau khi xóa sẽ là empty string
      if (currentValue.length === 1) {
        // Clear timeout cũ
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set timeout ngắn để kiểm tra sau khi DOM update
        timeoutRef.current = setTimeout(() => {
          const newValue = inputRef.current?.value || '';
          if (!newValue.trim()) {
            // Input trống và đang ở SearchPage
            if (isOnSearchPage) {
              navigateBack();
            }
          }
        }, 50); // Timeout ngắn hơn để responsive hơn
      }
    }
  }, [handleClear, searchInput, variant, navigateToSearch, isOnSearchPage, navigateBack]);

  return (
    <div className={`relative ${className}`}>
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
        size={18} 
      />
      
      <input
        ref={inputRef}
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="bg-[#1f2a3a] text-white rounded-full pl-10 pr-12 py-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#2d3a4a] transition-all text-sm lg:text-base"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        </div>
      )}
      
      {/* Clear button */}
      {showClearButton && searchInput && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-600 rounded-full transition-colors group"
          title={isOnSearchPage ? "Quay lại trang trước" : "Xóa tìm kiếm"}
        >
          <X 
            size={16} 
            className="text-gray-400 group-hover:text-white transition-colors" 
          />
        </button>
      )}
    </div>
  );
};

export default SearchInput;