import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';

// Lazy load routes — giảm initial bundle
const Home = lazy(() => import('./pages/home/Home'));
const MovieLayouts = lazy(() => import('./pages/Movie/MovieLayouts'));
const SearchPage = lazy(() => import('./pages/Search/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const FilterPage = lazy(() => import('./pages/FilterPage/FilterPage'));

// =============================================
// BẬT/TẮT CHẾ ĐỘ BẢO TRÌ TẠI ĐÂY
const MAINTENANCE_MODE = false;
const MAINTENANCE_END_TIME = '10:40'; // giờ kết thúc bảo trì
// =============================================

const MaintenancePage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="text-7xl mb-6">🔧</div>
      <h1 className="text-3xl font-bold text-white mb-3">Đang Bảo Trì</h1>
      <p className="text-gray-300 text-lg mb-2">
        Website đang được nâng cấp và sửa lỗi.
      </p>
      <p className="text-gray-400 mb-6">
        Dự kiến hoàn thành lúc{' '}
        <span className="text-blue-400 font-semibold">{MAINTENANCE_END_TIME}</span>
        . Vui lòng quay lại sau.
      </p>
      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span>Hệ thống sẽ tự động hoạt động trở lại</span>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 phút
      gcTime: 30 * 60 * 1000, // 30 phút
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false, // Không refetch khi mount nếu có cache
      networkMode: 'online', // Chỉ fetch khi online
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {MAINTENANCE_MODE ? (
          <MaintenancePage />
        ) : (
          <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:slug" element={<MovieLayouts />} />
              <Route path="/category/:categoryType/:categorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/filter" element={<FilterPage />} />
            </Routes>
          </Suspense>
        )}
        <Footer/>
        <PWAUpdatePrompt />
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;