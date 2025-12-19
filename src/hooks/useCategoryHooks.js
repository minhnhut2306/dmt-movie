// src/hooks/useCategoryHooks.js
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

// Hook để lấy danh sách thể loại
export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: categoryApi.getGenres,
    staleTime: 30 * 60 * 1000, // 30 phút
    cacheTime: 60 * 60 * 1000, // 1 giờ
    retry: 2,
  });
};

// Hook để lấy danh sách quốc gia
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: categoryApi.getCountries,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: 2,
  });
};

// Hook để lấy danh sách năm
export const useYears = () => {
  return useQuery({
    queryKey: ["years"],
    queryFn: categoryApi.getYears,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: 2,
  });
};

// Transform functions
export const transformGenres = (data) => {
  if (!data?.data?.items) return [];
  return data.data.items.map(item => ({
    slug: item.slug,
    name: item.name,
    categoryType: 'the-loai',
    fullPath: `/category/the-loai/${item.slug}`,
    color: 'bg-gray-700'
  }));
};

export const transformCountries = (data) => {
  if (!data?.data?.items) return [];
  return data.data.items.map(item => ({
    slug: item.slug,
    name: item.name,
    categoryType: 'quoc-gia',
    fullPath: `/category/quoc-gia/${item.slug}`,
    color: 'bg-gray-700'
  }));
};

export const transformYears = (data) => {
  if (!data?.data?.items) return [];
  return data.data.items.map(item => ({
    slug: item.year.toString(),
    name: item.year.toString(),
    categoryType: 'nam',
    fullPath: `/category/nam/${item.year}`,
    color: 'bg-gray-700'
  }));
};