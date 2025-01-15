import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
});

// 响应拦截器
api.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    
    // 处理成功响应
    if (code === 200) {
      return data;
    }
    
    // 处理错误响应
    ElMessage.error(message || '请求失败');
    return Promise.reject(new Error(message || '请求失败'));
  },
  error => {
    // 处理网络错误
    const message = error.response?.data?.message || error.message || '网络错误';
    console.error('API请求错误:', error);
    ElMessage.error(message);
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