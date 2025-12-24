import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar dari .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor (Opsional tapi bagus): Otomatis pasang token jika ada
// Ini akan mengurangi kode berulang di setiap file view/store
import { useAuthStore } from '../stores/auth';

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;