// api/baseApi.js - OPTIMIZED
import axios from "axios";

const API_URL = "https://phimapi.com";

// Request cache để tránh duplicate calls
const requestCache = new Map();
const CACHE_DURATION = 5000; // 5 giây

export const api = axios.create({
  baseURL: API_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 15000, // Tăng từ 10s lên 15s
});

// Response interceptor với better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout:", error.config?.url);
    } else if (error.response) {
      console.error("API Error:", error.response.status, error.config?.url);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Request deduplication - tránh gọi cùng endpoint nhiều lần
export const apiRequest = async (endpoint) => {
  const cacheKey = endpoint;
  const now = Date.now();
  
  // Check cache
  const cached = requestCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`✅ Cache hit: ${endpoint}`);
    return cached.data;
  }
  
  // Check if request is in-flight
  if (cached && cached.promise) {
    console.log(`⏳ Deduplicating: ${endpoint}`);
    return cached.promise;
  }

  try {
    // Create promise and cache it
    const promise = api.get(endpoint).then(({ data }) => {
      console.log(`📡 API Request: ${endpoint}`);
      requestCache.set(cacheKey, { data, timestamp: now, promise: null });
      return data;
    });
    
    requestCache.set(cacheKey, { promise, timestamp: now });
    return await promise;
  } catch (error) {
    requestCache.delete(cacheKey); // Clear cache on error
    throw error;
  }
};