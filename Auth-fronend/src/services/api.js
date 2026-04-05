import axios from 'axios';
import axiosRetry from 'axios-retry';
import { debounce } from 'lodash.debounce';

class TokenManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.refreshTokenKey = 'refresh_token';
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token, refreshToken = null) {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  async refreshToken() {
    // Placeholder for token refresh logic
    return null;
  }

  getCache(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      return cached ? JSON.parse(cached).data : null;
    } catch {
      return null;
    }
  }

  setCache(key, data, ttl = 300000) {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl
      }));
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  clearCache() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

const tokenManager = new TokenManager();

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-type': 'application/json',
  },
  timeout: 10000, 
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.response?.status === 429 || 
           error.response?.status >= 500; 
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    if (duration > 2000) { 
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await tokenManager.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      tokenManager.clearTokens();
      
      if (typeof window !== 'undefined') {
        const debouncedRedirect = debounce(() => {
          window.location.href = '/login';
        }, 100);
        debouncedRedirect();
      }
    }
    
    return Promise.reject(error);
  }
);

const apiService = {
  async getMe(forceRefresh = false) {
    try {
      const cacheKey = 'user_data';
      const cachedData = tokenManager.getCache(cacheKey);
      
      if (!forceRefresh && cachedData) {
        return cachedData;
      }
      
      const response = await api.get('/me');
      const userData = response.data;
      
      tokenManager.setCache(cacheKey, userData, 300000);
      
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      throw error;
    }
  },

  async get(url, config = {}, cacheOptions = {}) {
    try {
      const { enableCache = false, cacheTTL = 300000 } = cacheOptions;
      
      if (enableCache) {
        const cacheKey = `get_${url}`;
        const cachedData = tokenManager.getCache(cacheKey);
        
        if (cachedData) {
          return cachedData;
        }
      }
      
      const response = await api.get(url, config);
      const data = response.data;
      
      if (enableCache) {
        tokenManager.setCache(`get_${url}`, data, cacheTTL);
      }
      
      return data;
    } catch (error) {
      console.error(`GET ${url} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      
      this.clearRelatedCaches(url);
      
      return response.data;
    } catch (error) {
      console.error(`POST ${url} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      
      this.clearRelatedCaches(url);
      
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      
      this.clearRelatedCaches(url);
      
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  setToken(token, refreshToken = null) {
    tokenManager.setToken(token, refreshToken);
  },

  clearToken() {
    tokenManager.clearTokens();
  },

  getToken() {
    return tokenManager.getToken();
  },

  isAuthenticated() {
    return tokenManager.isAuthenticated();
  },

  clearRelatedCaches(url) {
    tokenManager.clearCache();
  },

  async batch(requests) {
    try {
      return await Promise.allSettled(
        requests.map(({ method, url, data, config }) => {
          return this[method.toLowerCase()](url, data || {}, config || {});
        })
      );
    } catch (error) {
      console.error('Batch request error:', error);
      throw error;
    }
  }
};

export { api, apiService, tokenManager };
export default apiService;