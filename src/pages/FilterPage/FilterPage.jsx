import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Loader2 } from 'lucide-react';
import UnifiedMovieCard from '../../components/UnifiedMovieCard';
import Pagination from '../../components/Pagination';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { api } from '../../api/baseApi';

const FilterPage = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const lang = searchParams.get('lang') || '';
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';

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
        // Fix: Dùng endpoint v3 đúng
        endpoint = '/danh-sach/phim-moi-cap-nhat-v3';
      }

      const params = new URLSearchParams();
      params.append('page', currentPage);
      
      // Chỉ thêm sort params cho endpoint v3
      if (endpoint.includes('phim-moi-cap-nhat-v3')) {
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
    if (type) filters.push(type.replace('phim-', 'Phim ').replace('-', ' '));
    if (category) filters.push(category);
    if (country) filters.push(country);
    if (year) filters.push(`Năm ${year}`);
    if (lang) filters.push(lang);
    
    return filters.length > 0 ? `Kết quả lọc: ${filters.join(' • ')}` : 'Kết quả lọc';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8">
        <div className="container mx-auto px-4">
          <LoadingState variant="grid" count={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8">
        <div className="container mx-auto px-4">
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
      <div className="min-h-screen bg-gray-900 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">{getFilterTitle()}</h1>
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
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{getFilterTitle()}</h1>
            <p className="text-gray-400 mt-1">
              Tìm thấy {pagination.totalItems || movies.length} phim
            </p>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
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
