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
const HistoryPage = lazy(() => import('./pages/HistoryPage/HistoryPage'));

// =============================================
// BẬT/TẮT CHẾ ĐỘ BẢO TRÌ TẠI ĐÂY
const MAINTENANCE_MODE = false;
const MAINTENANCE_END_TIME = '10:40'; // giờ kết thúc bảo trì
// =============================================

const MaintenancePage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="w-16 h-16 mb-6 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>
      </div>
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
              <Route path="/history" element={<HistoryPage />} />
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