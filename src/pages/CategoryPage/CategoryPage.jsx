// pages/Category/CategoryPage.jsx
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import UnifiedMovieCard from '../../components/UnifiedMovieCard';
import { CATEGORY_TYPES, STATIC_SPECIAL_LISTS, useDynamicGenres, useDynamicCountries } from '../../utils/CategoryConfigDynamic';
import { movieApi } from '../../api'; // Import từ api/index.js
import { getSafeImageUrl } from '../../utils/imageHelper';

const CATEGORY_BADGE_COLORS = {
  'the-loai': 'bg-purple-600',
  'quoc-gia': 'bg-emerald-600',
  'nam': 'bg-brand',
  'danh-sach': 'bg-sky-600',
};

const formatSlugToName = (slug) =>
  slug
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || '';

const CategoryPage = () => {
  const { categoryType, categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { genres } = useDynamicGenres();
  const { countries } = useDynamicCountries();

  // ✅ Đơn giản hóa - chỉ cần check categoryType có tồn tại
  const categoryConfig = CATEGORY_TYPES[categoryType];
  const categoryDisplayName = (() => {
    if (categoryType === 'the-loai') {
      return genres.find((g) => g.slug === categorySlug)?.name || formatSlugToName(categorySlug);
    }
    if (categoryType === 'quoc-gia') {
      return countries.find((c) => c.slug === categorySlug)?.name || formatSlugToName(categorySlug);
    }
    if (categoryType === 'danh-sach') {
      return STATIC_SPECIAL_LISTS.find((s) => s.slug === categorySlug)?.name || formatSlugToName(categorySlug);
    }
    if (categoryType === 'nam') {
      return `Năm ${categorySlug}`;
    }
    return formatSlugToName(categorySlug);
  })();
  const categoryInfo = categoryConfig ? {
    type: categoryConfig.title,
    slug: categorySlug,
    name: categoryDisplayName,
    color: CATEGORY_BADGE_COLORS[categoryType] || 'bg-brand',
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
          className="flex items-center px-3 py-2 text-sm font-semibold text-ink-secondary bg-white/5 border border-subtle rounded-full hover:bg-white/10 hover:text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-semibold text-ink-secondary bg-white/5 border border-subtle rounded-full hover:bg-white/10 hover:text-ink-primary transition-all duration-200 cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-ink-muted px-1">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 flex items-center justify-center text-sm font-semibold border rounded-full transition-all duration-200 cursor-pointer ${currentPage === page
                ? 'text-white bg-brand border-brand shadow-glow'
                : 'text-ink-secondary bg-white/5 border-subtle hover:bg-white/10 hover:text-ink-primary'
              }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-ink-muted px-1">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-semibold text-ink-secondary bg-white/5 border border-subtle rounded-full hover:bg-white/10 hover:text-ink-primary transition-all duration-200 cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-semibold text-ink-secondary bg-white/5 border border-subtle rounded-full hover:bg-white/10 hover:text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </button>
      </div>
    );
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center text-ink-primary">
          <h1 className="text-2xl font-bold mb-4 tracking-tight">Không tìm thấy danh mục</h1>
          <p className="text-ink-secondary">Danh mục bạn tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-ink-primary text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
              <p className="text-lg text-ink-secondary">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-ink-primary text-center">
              <p className="text-brand-hover mb-2 text-lg font-semibold">Lỗi tải dữ liệu</p>
              <p className="text-ink-muted text-sm mb-4">
                {error.message || 'Không thể tải dữ liệu danh mục'}
              </p>
              <p className="text-ink-muted text-xs mb-4">
                Category: {categoryType}/{categorySlug}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-brand hover:bg-brand-hover px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Category Info:', categoryInfo);
  console.log('Movies Count:', movies.length);
  console.log('Pagination Info:', paginationInfo);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${categoryInfo.color}`}
            >
              {categoryInfo.type}
            </span>
            <h1 className="text-ink-primary text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {categoryInfo.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-ink-secondary text-sm sm:text-base">
              Trang {currentPage} / {totalPages} - Tổng cộng {movies.length} phim
            </p>
          </div>
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
          <div className="flex items-center justify-center h-64">
            <div className="text-ink-secondary text-center">
              <p className="text-lg">Không có phim nào trong danh mục này.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;