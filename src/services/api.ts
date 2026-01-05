import axios from 'axios';
import { API_CONFIG } from '@/utils/constants';
import { toast } from 'sonner';

// IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Enhanced error logging and toast notifications
// Date: 2025-10-30
// Related to: Section 2.1.1 and 2.1.2 - Centralized error handling

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add API key
api.interceptors.request.use((config) => {
  if (API_CONFIG.apiKey) {
    config.headers['X-API-Key'] = API_CONFIG.apiKey;
  }
  return config;
});

// Response interceptor: enhanced error logging and user notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();
      
      // Enhanced error logging
      console.error(`[API Error] ${method} ${url} - Status: ${status}`, {
        message: error.message,
        response: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
        },
      });
      
      // Specific error handling
      if (status === 404) {
        console.warn(`Resource not found: ${url}`);
        // Don't show toast for screenshot 404 (expected behavior)
        if (!url?.includes('/api/screenshot/')) {
          toast.error('Ресурс не найден');
        }
      } else if (status === 403) {
        console.error(`Access denied: ${url}. Check API key or permissions.`);
        toast.error('Доступ запрещён. Проверьте API ключ.');
      } else if (status === 401) {
        console.error(`Unauthorized: ${url}`);
        toast.error('Требуется авторизация.');
      } else if (status === 500) {
        console.error(`Server error: ${url}. Contact administrator.`);
        toast.error('Ошибка сервера. Попробуйте позже.');
      } else if (error.code === 'ERR_NETWORK' || status === 0 || !status) {
        console.error(`Network error: ${url}. No connection to server.`);
        toast.error('Нет связи с сервером. Проверьте подключение.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
