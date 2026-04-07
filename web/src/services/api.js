import axios from 'axios';

const api = axios.create({
  // ✅ Se estiver na Vercel, ele usa a URL do Render. 
  // 🏠 Se estiver no seu VS Code, ele usa o localhost.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
});

// Injeta o token JWT em TODA requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar (401), desloga automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;