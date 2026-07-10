import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, ArrowLeft } from 'lucide-react';
import UnifiedMovieCard from '../../components/UnifiedMovieCard';
import Pagination from '../../components/Pagination';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { api } from '../../api/baseApi';
import { useDynamicGenres, useDynamicCountries, STATIC_SPECIAL_LISTS } from '../../utils/CategoryConfigDynamic';

const FilterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const lang = searchParams.get('lang') || '';
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';

  const { genres } = useDynamicGenres();
  const { countries } = useDynamicCountries();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['filter', type, category, country, year, lang, sortField, sortType, currentPage],
    queryFn: async () => {
      let endpoint = '';
      
      if (type) {
        endpoint = `/v1/api/danh-sach/${type}`;
      } else if (category) {
        endpoint = `/v1/api/the-loai/${category}`;
      } else if (country) {
        endpoint = `/v1/api/quoc-gia/${country}`;
      } else if (year) {
        endpoint = `/v1/api/nam/${year}`;
      } else {
        endpoint = '/v1/api/home';
      }

      const params = new URLSearchParams();
      params.append('page', currentPage);

      // Chỉ thêm sort params cho endpoint home
      if (endpoint.includes('/v1/api/home')) {
        if (sortField) params.append('sort_field', sortField);
        if (sortType) params.append('sort_type', sortType);
      }
      
      params.append('limit', '24');

      const response = await api.get(`${endpoint}?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const getFilterTitle = () => {
    const filters = [];
    if (type) {
      const found = STATIC_SPECIAL_LISTS.find(s => s.slug === type);
      filters.push(found?.name || type);
    }
    if (category) {
      const found = genres.find(g => g.slug === category);
      filters.push(found?.name || category);
    }
    if (country) {
      const found = countries.find(c => c.slug === country);
      filters.push(found?.name || country);
    }
    if (year) filters.push(`Năm ${year}`);
    if (lang) filters.push(lang);
    return filters.length > 0 ? filters.join(' • ') : 'Kết quả lọc';
  };

  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white/55 hover:text-iris-300 mb-4 transition-colors duration-200 cursor-pointer text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      Quay lại
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <BackButton />
          <LoadingState variant="grid" count={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <ErrorState
            message="Không thể tải kết quả lọc"
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination || {};

  if (movies.length === 0) {
    return (
      <div className="min-h-screen pt-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <BackButton />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl2 bg-gradient-to-br from-iris-400 to-iris-600 shadow-glow">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{getFilterTitle()}</h1>
          </div>
          <EmptyState
            variant="movies"
            message="Không tìm thấy phim nào phù hợp với bộ lọc của bạn"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <BackButton />
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl2 bg-gradient-to-br from-iris-400 to-iris-600 shadow-glow">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{getFilterTitle()}</h1>
            <p className="text-white/40 mt-1 text-sm">
              Tìm thấy {pagination.totalItems || movies.length} phim
            </p>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {movies.map(movie => (
            <UnifiedMovieCard 
              key={movie._id || movie.slug}
              movie={{
                slug: movie.slug,
                title: movie.name,
                poster: movie.poster_url || movie.thumb_url,
                year: movie.year,
                rating: movie.tmdb?.vote_average || 'N/A',
                type: movie.type,
                quality: movie.quality,
                episode: movie.episode_current,
              }}
              variant="grid"
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default FilterPage;
