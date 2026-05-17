import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../context/authStore';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
  if (!url) return '/api';
  // Remove trailing slash if exists and append /api
  return `${url.replace(/\/$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
