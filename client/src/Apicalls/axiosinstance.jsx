import axios from 'axios';

export const axiosInstance = axios.create();

// Use an interceptor so the token is read fresh on every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
