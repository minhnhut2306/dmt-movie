// pages/Category/CategoryPage.jsx
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import MovieCardDetail from '../../components/MovieCardDetail';
import { getCategoryInfo } from '../../utils/CategoryConfig';
import { movieApi } from '../../api/movieApi.js';

const CategoryPage = () => {
  const { categoryType, categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const categoryInfo = getCategoryInfo(categoryType, categorySlug);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['category', categoryType, categorySlug, currentPage],
    queryFn: () => {
      console.log(`Fetching ${categoryType}/${categorySlug} - Page: ${currentPage}`);
      
      let endpoint;
      switch (categoryType) {
        case 'the-loai':
          endpoint = `/v1/api/the-loai/${categorySlug}?page=${currentPage}`;
          break;
        case 'quoc-gia':
          endpoint = `/v1/api/quoc-gia/${categorySlug}?page=${currentPage}`;
          break;
        case 'nam':
          endpoint = `/v1/api/nam/${categorySlug}?page=${currentPage}`;
          break;
        case 'danh-sach':
          if (categorySlug === 'phim-moi-cap-nhat') {
            endpoint = `/danh-sach/phim-moi-cap-nhat-v3?page=${currentPage}`;
          } else {
            endpoint = `/v1/api/danh-sach/${categorySlug}?page=${currentPage}`;
          }
          break;
        default:
          throw new Error(`Unsupported category type: ${categoryType}`);
      }
      
      return movieApi.request(endpoint);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!categoryInfo
  });
  const transformMovieData = (rawData) => {
    if (!rawData) return [];
    
    const items = rawData.items || rawData.data?.items || [];
    
    return items.map((movie) => ({
      id: movie._id,
      title: movie.name,
      originalTitle: movie.origin_name,
      poster: movie.poster_url?.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`,
      thumbnail: movie.thumb_url?.startsWith("http")
        ? movie.thumb_url
        : `https://phimimg.com/${movie.thumb_url}`,
      rating: movie.tmdb?.vote_average > 0 
        ? movie.tmdb.vote_average.toFixed(1) 
        : "N/A",
      year: movie.year,
      duration: movie.time,
      genre: movie.category?.[0]?.name || "Chưa phân loại",
      country: movie.country?.[0]?.name || "Chưa xác định",
      type: movie.type === "series" 
        ? "Phim Bộ" 
        : movie.type === "single" 
        ? "Phim Lẻ" 
        : movie.type === "tvshows" 
        ? "TV Shows" 
        : movie.type,
      quality: movie.quality,
      language: movie.lang,
      episode: movie.episode_current,
      slug: movie.slug,
      isExclusive: movie.sub_docquyen,
      isInCinema: movie.chieurap,
      modifiedTime: movie.modified?.time,
      createdTime: movie.created?.time,
    }));
  };

  const movies = transformMovieData(data);
  

  const paginationInfo = data?.data?.params?.pagination || 
                         data?.pagination || 
                         data?.data?.params || 
                         {};
                         
  const totalPages = paginationInfo?.totalPages || 
                    Math.ceil((paginationInfo?.totalItems || movies.length) / 24) ||
                    1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 px-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-500 px-1">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
              currentPage === page
                ? 'text-white bg-red-600 border-red-600'
                : 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500 px-1">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h1>
          <p className="text-gray-400">Danh mục bạn tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">Đang tải {categoryInfo.name.toLowerCase()}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
              <p className="text-red-400 mb-2 text-lg">Lỗi tải dữ liệu</p>
              <p className="text-gray-400 text-sm mb-4">{error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${categoryInfo.color}`}
            >
              {categoryInfo.type}
            </span>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
              {categoryInfo.name}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-400 text-sm sm:text-base">
              Trang {currentPage} / {totalPages} - Tổng cộng {movies.length} phim
            </p>
          </div>
        </div>
        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {movies.map((movie) => (
                <MovieCardDetail key={movie.id} movie={movie} />
              ))}
            </div>
          
            {renderPagination()}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
              <p className="text-lg">Không có phim nào trong danh mục này.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;