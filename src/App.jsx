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
  <div className="min-h-screen bg-black flex items-center justify-center px-4">
    <div className="text-center max-w-md mx-auto animate-fade-in">
      <div className="bg-brand/10 border border-brand/20 rounded-full p-6 w-fit mx-auto mb-6">
        <div className="text-6xl">🔧</div>
      </div>
      <h1 className="text-3xl font-bold text-ink-primary mb-3 tracking-tight">Đang Bảo Trì</h1>
      <p className="text-ink-secondary text-lg mb-2">
        Website đang được nâng cấp và sửa lỗi.
      </p>
      <p className="text-ink-muted mb-6">
        Dự kiến hoàn thành lúc{' '}
        <span className="text-brand-hover font-semibold">{MAINTENANCE_END_TIME}</span>
        . Vui lòng quay lại sau.
      </p>
      <div className="flex items-center justify-center gap-2 text-ink-muted text-sm">
        <div className="w-2 h-2 bg-gold-light rounded-full animate-pulse"></div>
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
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
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
            background: '#14141f',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgb(0,0,0,0.4)',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#E11D48',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;