// pages/Category/CategoryPage.jsx
import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, LayoutGrid, ArrowLeft } from 'lucide-react';
import UnifiedMovieCard from '../../components/UnifiedMovieCard';
import {
  CATEGORY_TYPES,
  STATIC_SPECIAL_LISTS,
  useDynamicGenres,
  useDynamicCountries,
} from '../../utils/CategoryConfigDynamic';
import { movieApi } from '../../api'; // Import từ api/index.js
import { getSafeImageUrl } from '../../utils/imageHelper';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';

const CategoryPage = () => {
  const { categoryType, categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Danh sách thể loại/quốc gia động để tra tên hiển thị đúng trên đầu trang
  const { genres: displayGenres } = useDynamicGenres();
  const { countries: displayCountries } = useDynamicCountries();

  const getCategoryDisplayName = () => {
    if (categoryType === 'danh-sach') {
      return STATIC_SPECIAL_LISTS.find(item => item.slug === categorySlug)?.name || categorySlug;
    }
    if (categoryType === 'the-loai') {
      return displayGenres.find(g => g.slug === categorySlug)?.name || categorySlug;
    }
    if (categoryType === 'quoc-gia') {
      return displayCountries.find(c => c.slug === categorySlug)?.name || categorySlug;
    }
    if (categoryType === 'nam') {
      return `Năm ${categorySlug}`;
    }
    return categorySlug;
  };

  // Đơn giản hóa - chỉ cần check categoryType có tồn tại
  const categoryConfig = CATEGORY_TYPES[categoryType];
  const categoryInfo = categoryConfig ? {
    type: categoryConfig.title,
    slug: categorySlug,
    name: getCategoryDisplayName(),
  } : null;

  const { data, isLoading, error } = useQuery({
    queryKey: ['category', categoryType, categorySlug, currentPage],
    queryFn: async () => {
      console.log(`Fetching ${categoryType}/${categorySlug} - Page: ${currentPage}`);

      try {
        // Xử lý đặc biệt cho phim-moi-cap-nhat
        if (categorySlug === 'phim-moi-cap-nhat') {
          const response = await movieApi.getCategoryMovies(categoryType, categorySlug, currentPage);
          console.log('Phim mới cập nhật response:', response);
          return response;
        }

        // Sử dụng method đã được refactor cho các category khác
        return movieApi.getCategoryMovies(categoryType, categorySlug, currentPage);
      } catch (error) {
        console.error('Error fetching category data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Không retry cho lỗi 404 hoặc 400
      if (error?.status === 404 || error?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!categoryInfo
  });

  const transformMovieData = (rawData) => {
    if (!rawData) return [];

    console.log('Raw data structure:', rawData);

    // Xử lý nhiều cấu trúc dữ liệu khác nhau
    let items = [];

    if (rawData.items) {
      items = rawData.items;
    } else if (rawData.data?.items) {
      items = rawData.data.items;
    } else if (rawData.data && Array.isArray(rawData.data)) {
      items = rawData.data;
    } else if (Array.isArray(rawData)) {
      items = rawData;
    } else {
      console.warn('Unknown data structure:', rawData);
      return [];
    }

    return items.map((movie) => {
      // Xử lý poster URL
      const posterUrl = getSafeImageUrl(movie.poster_url || movie.poster || movie.thumb_url || movie.thumbnail, movie.name || movie.title);
      const thumbnailUrl = getSafeImageUrl(movie.thumb_url || movie.thumbnail || movie.poster_url || movie.poster, movie.name || movie.title);

      return {
        id: movie._id || movie.id,
        title: movie.name || movie.title,
        originalTitle: movie.origin_name || movie.original_title || movie.originalTitle,
        poster: posterUrl,
        thumbnail: thumbnailUrl,
        rating: movie.tmdb?.vote_average > 0
          ? movie.tmdb.vote_average.toFixed(1)
          : movie.rating || movie.vote_average || "N/A",
        year: movie.year,
        duration: movie.time || movie.duration,
        genre: movie.category?.[0]?.name || movie.genres?.[0] || "Chưa phân loại",
        country: movie.country?.[0]?.name || movie.countries?.[0] || "Chưa xác định",
        type: movie.type === "series"
          ? "Phim Bộ"
          : movie.type === "single"
            ? "Phim Lẻ"
            : movie.type === "tvshows"
              ? "TV Shows"
              : movie.type || "Chưa xác định",
        quality: movie.quality,
        language: movie.lang || movie.language,
        episode: movie.episode_current || movie.current_episode,
        slug: movie.slug,
        isExclusive: movie.sub_docquyen || movie.exclusive,
        isInCinema: movie.chieurap || movie.cinema,
        modifiedTime: movie.modified?.time || movie.updated_at,
        createdTime: movie.created?.time || movie.created_at,
      };
    });
  };

  const movies = transformMovieData(data);

  // Xử lý pagination với nhiều cấu trúc khác nhau
  const getPaginationInfo = (rawData) => {
    if (!rawData) return {};

    // Thử các cấu trúc pagination khác nhau
    return rawData.data?.params?.pagination ||
      rawData.pagination ||
      rawData.data?.params ||
      rawData.params ||
      {};
  };

  const paginationInfo = getPaginationInfo(data);

  const totalPages = paginationInfo?.totalPages ||
    paginationInfo?.total_page ||
    Math.ceil((paginationInfo?.totalItems || paginationInfo?.total || movies.length) / 24) ||
    1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const pageBtnBase = "min-w-[40px] h-10 px-3 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer";

    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8 px-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-white/30 px-1">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${pageBtnBase} ${currentPage === page
                ? 'btn-signature text-white'
                : 'glass text-white/60 hover:text-white hover:bg-iris-500/20'
              }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-white/30 px-1">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${pageBtnBase} glass text-white/60 hover:text-white hover:bg-iris-500/20 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </button>
      </div>
    );
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <EmptyState
          variant="generic"
          title="Không tìm thấy danh mục"
          message="Danh mục bạn tìm kiếm không tồn tại."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <LoadingState variant="grid" count={18} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ErrorState
            message={error.message || 'Không thể tải dữ liệu danh mục'}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Category Info:', categoryInfo);
  console.log('Movies Count:', movies.length);
  console.log('Pagination Info:', paginationInfo);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/55 hover:text-iris-300 mb-4 transition-colors duration-200 cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-iris-200 bg-iris-500/20 border border-iris-400/20 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              {categoryInfo.type}
            </span>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-display font-bold">
              {categoryInfo.name}
            </h1>
          </div>

          <p className="text-white/40 text-sm">
            Trang {currentPage} / {totalPages} · {movies.length} phim
          </p>
        </div>

        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {movies.map((movie, index) => (
                <UnifiedMovieCard
                  key={movie.id || `${movie.slug}-${index}`}
                  movie={movie}
                  variant="grid"
                />
              ))}
            </div>

            {renderPagination()}
          </>
        ) : (
          <EmptyState variant="movies" message="Không có phim nào trong danh mục này." />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;