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
        <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:slug" element={<MovieLayouts />} />
            <Route path="/category/:categoryType/:categorySlug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/filter" element={<FilterPage />} />
          </Routes>
        </Suspense>
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