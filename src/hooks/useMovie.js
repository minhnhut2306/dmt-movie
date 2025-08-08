// hooks/useFavorites.js
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../api';

export const useMovies = (page = 0) => {
  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => movieApi.getLatestMovies(page),
  });
};