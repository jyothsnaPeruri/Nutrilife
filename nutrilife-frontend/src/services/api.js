import axios from 'axios';

// Backend base URL comes from .env (VITE_API_URL); falls back to the local Spring Boot port.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
export const WS_URL = `${API_URL}/ws`;

/**
 * fetch() wrapper: prefixes /api, adds the JWT, and kicks the user back to login on 401.
 * Returns the raw Response so callers keep their existing res.ok / res.json() handling.
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api${path}`, { ...options, headers });
  if (res.status === 401 && !path.startsWith('/auth/')) {
    localStorage.clear();
    window.location.assign('/login');
  }
  return res;
}

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
