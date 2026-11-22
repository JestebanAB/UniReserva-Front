import axios from 'axios';
import { clearStoredAuthState } from '../services/roleService';

const getRequestPath = (url) => {
  const path = url?.split('?')[0].replace(/\/+$/, '').toLowerCase() || '';
  return path.startsWith('/') ? path : `/${path}`;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // La BD de Neon puede tardar en "despertar", así que damos margen
  timeout: 15000,
  withCredentials: true,
  withXSRFToken: true,
});

export const resolveResourceImageUrl = (imageUrl) => {
  if (!imageUrl?.startsWith('/api/')) return imageUrl;
  return api.getUri({ url: imageUrl });
};

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    clearStoredAuthState();
    const requestPath = getRequestPath(error.config?.url);
    const isSessionCheck = requestPath.endsWith('/auth/me');
    const isPublicAuthRequest = ['/auth/login', '/auth/register', '/auth/csrf'].some((path) =>
      requestPath.endsWith(path),
    );

    if (!isSessionCheck && !isPublicAuthRequest) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }
  return Promise.reject(error);
});

export default api;
