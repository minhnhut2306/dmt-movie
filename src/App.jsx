import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import MovieLayouts from './pages/Movie/MovieLayouts';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Import component mới
import SearchPage from './pages/Search/SearchPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop /> {/* Thêm component này */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:slug" element={<MovieLayouts />} />
           <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer/>
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