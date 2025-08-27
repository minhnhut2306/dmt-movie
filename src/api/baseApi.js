// api/baseApi.js
import axios from "axios";

const API_URL = "https://phimapi.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const apiRequest = async (endpoint) => {
  try {
    const { data } = await api.get(endpoint);
    console.log(`API Request: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};