// hooks/useMoviesHooks.js
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api";


const queryOptions = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

const createMovieHook = (key, apiMethod) => (page) => {
  const actualPage = page !== undefined ? page : 1;
  
  return useQuery({
    queryKey: [key, actualPage],
    queryFn: () => {
      console.log(`Fetching ${key} - Page: ${actualPage}`);
      return apiMethod(actualPage);
    },
    ...queryOptions,
  });
};

export const useMovieDetail = (slug) => {
  return useQuery({
    queryKey: ["movie-detail", slug],
    queryFn: () => movieApi.getMovieDetail(slug),
    onSuccess: (data) => {
      console.log("Fetched movie detail:", data);
    },
    enabled: !!slug,
    ...queryOptions,
  });
};


export const useMovies = (page = 1) => {
  return useQuery({
    queryKey: ["movies", page],
    queryFn: () => movieApi.getLatestMovies(page),
    ...queryOptions,
  });
};


export const useVietnamMovies = createMovieHook("vietnam-movies", (page) => movieApi.getVietnamMovies(page !== undefined ? page : 4));
export const useChinaMovies = createMovieHook("china-movies", movieApi.getChinaMovies);
export const useJapanMovies = createMovieHook("japan-movies", movieApi.getJapanMovies);

export const useSeriesMovies = createMovieHook("series-movies", movieApi.getSeriesMovies);
export const useSingleMovies = createMovieHook("single-movies", movieApi.getSingleMovies);
export const useTVShows = createMovieHook("tv-shows", movieApi.getTVShows);

export const useAnimationMovies = createMovieHook("animation-movies", movieApi.getAnimationMovies);
export const useActionMovies = createMovieHook("action-movies", movieApi.getActionMovies);
export const useHorrorMovies = createMovieHook("horror-movies", movieApi.getHorrorMovies);
export const useAdventureMovies = createMovieHook("adventure-movies", movieApi.getAdventureMovies);
export const useHistoryMovies = createMovieHook("history-movies", movieApi.getHistoryMovies);

export const useDubbedMovies = createMovieHook("dubbed-movies", movieApi.getDubbedMovies);
export const useVoiceoverMovies = createMovieHook("voiceover-movies", movieApi.getVoiceoverMovies);
export const useVietsubMovies = createMovieHook("vietsub-movies", movieApi.getVietsubMovies);
