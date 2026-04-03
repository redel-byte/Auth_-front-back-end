export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    ME: '/me',
  },
};

export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
