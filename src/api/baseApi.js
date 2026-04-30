import axios from "axios";

const API_URL = "https://phimapi.com";
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error.config?.url);
    } else if (error.response) {
      console.error("API Error:", error.response.status, error.config?.url);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async (endpoint) => {
  const now = Date.now();
  const cached = requestCache.get(endpoint);

  if (cached) {
    // In-flight: trả về promise đang chạy để không gọi API lần 2
    if (cached.promise) return cached.promise;
    // Cached: trả về data nếu còn hạn
    if (now - cached.timestamp < CACHE_DURATION) return cached.data;
  }

  const promise = api
    .get(endpoint)
    .then(({ data }) => {
      requestCache.set(endpoint, { data, timestamp: Date.now(), promise: null });
      return data;
    })
    .catch((error) => {
      requestCache.delete(endpoint);
      throw error;
    });

  requestCache.set(endpoint, { promise, timestamp: now, data: null });
  return promise;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (!value.promise && now - value.timestamp > CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
}, 5 * 60 * 1000);
