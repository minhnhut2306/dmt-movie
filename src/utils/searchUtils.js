// utils/searchUtils.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

// Hook để debounce input với cleanup tốt hơn
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout mới
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup khi unmount hoặc value thay đổi
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook quản lý navigation thông minh
export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousLocationRef = useRef(location.pathname);
  const navigationTimeoutRef = useRef(null);

  // Lưu trang trước đó
  useEffect(() => {
    if (location.pathname !== '/search') {
      previousLocationRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Điều hướng thông minh với debounce
  const navigateBack = useCallback(() => {
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    const previousLocation = previousLocationRef.current;
    
    // Nếu có trang trước đó và không phải search page
    if (previousLocation && previousLocation !== '/search' && previousLocation !== location.pathname) {
      navigate(previousLocation);
    } else {
      // Fallback về trang chủ
      navigate('/');
    }
  }, [navigate, location.pathname]);

  const navigateToSearch = useCallback((keyword, options = {}) => {
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    if (!keyword || !keyword.trim()) {
      // Nếu keyword rỗng, navigate về trang trước hoặc home
      navigateBack();
      return;
    }

    // Debounce navigation để tránh navigate quá nhiều
    navigationTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('q', keyword.trim());
      
      if (options.page && options.page > 1) {
        params.set('page', options.page.toString());
      }
      
      navigate(`/search?${params.toString()}`);
    }, 100); // Short timeout để responsive nhưng tránh spam
  }, [navigate, navigateBack]);

  // Function to navigate to home and clear search
  const navigateToHome = useCallback(() => {
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    navigate('/');
  }, [navigate]);

  return {
    navigateBack,
    navigateToSearch,
    navigateToHome,
    previousPath: previousLocationRef.current,
    currentPath: location.pathname,
    isOnSearchPage: location.pathname === '/search'
  };
};

// Hook đồng bộ với URL search params
export const useSearchSync = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const urlKeyword = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page')) || 1;
  
  return {
    urlKeyword,
    urlPage,
    isOnSearchPage: location.pathname === '/search'
  };
};

// Hook quản lý search state với sync tốt hơn
export const useSearchState = () => {
  const [searchInput, setSearchInputState] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 500);
  const syncTimeoutRef = useRef(null);
  
  // Wrapper cho setSearchInput để đồng bộ tốt hơn
  const setSearchInput = useCallback((value) => {
    // Clear timeout cũ
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Update state immediately cho responsive UI
    setSearchInputState(value);

    // Set timeout ngắn để đảm bảo đồng bộ
    syncTimeoutRef.current = setTimeout(() => {
      // Đảm bảo value được sync đúng
      // eslint-disable-next-line no-unused-vars
      setSearchInputState(prev => {
        // Nếu value đã thay đổi trong lúc đợi, use value mới nhất
        return value;
      });
    }, 10);
  }, []);

  const clearSearch = useCallback(() => {
    // Clear timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    setSearchInputState('');
    setIsSearching(false);
  }, []);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchInput,
    setSearchInput,
    debouncedSearch,
    isSearching,
    setIsSearching,
    clearSearch
  };
};

// Utility functions
export const searchUtils = {
  // Highlight từ khóa trong text
  highlightKeyword: (text, keyword) => {
    if (!keyword) return text;
    
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
  },

  // Format kết quả tìm kiếm
  formatSearchStats: (totalItems, currentPage, itemsPerPage) => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `Hiển thị ${start}-${end} trong tổng số ${totalItems} kết quả`;
  },

  // Validate search keyword
  validateKeyword: (keyword) => {
    if (!keyword || keyword.trim().length === 0) {
      return { isValid: false, error: 'Vui lòng nhập từ khóa tìm kiếm' };
    }
    
    if (keyword.trim().length < 2) {
      return { isValid: false, error: 'Từ khóa phải có ít nhất 2 ký tự' };
    }
    
    return { isValid: true, error: null };
  },

  // Debounce function utility
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};