import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../context/authStore';

const getBaseURL = () => {
  const prodUrl = 'https://smart-leads-dashboard-1-7xn0.onrender.com';
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
  const baseUrl = envUrl || prodUrl;
  
  // Return URL ending with /api/
  return `${baseUrl.replace(/\/$/, '')}/api/`;
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
  
  // Ensure the URL does not start with a slash when using baseURL
  if (config.url?.startsWith('/')) {
    config.url = config.url.substring(1);
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
