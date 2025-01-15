import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 版本说明相关API
export const getLatestVersion = () => api.get('/monitor/version/latest');
export const getVersionHistory = () => api.get('/monitor/version/history');

// 加载器相关API
export const getLatestLoader = () => api.get('/monitor/loader/latest');
export const getLoaderHistory = () => api.get('/monitor/loader/history');

export default api; 