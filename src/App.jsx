import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import MovieLayouts from './pages/Movie/MovieLayouts';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SearchPage from './pages/Search/SearchPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import FilterPage from './pages/FilterPage/FilterPage';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:slug" element={<MovieLayouts />} />
          <Route path="/category/:categoryType/:categorySlug" element={<CategoryPage/>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/filter" element={<FilterPage />} />
        </Routes>
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