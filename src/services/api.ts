import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.defaults.headers.common = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token || ''}`,
    };
  }

  return config;
});

export default api;
