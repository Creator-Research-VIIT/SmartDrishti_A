import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: unknown }>('/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) =>
    api.post<{ token: string; user: unknown }>('/auth/signup', { name, email, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Templates API
export const templatesApi = {
  getAll: () => api.get('/templates'),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: { name: string; connectionType: string; hardware: string; description: string }) =>
    api.post('/templates', data),
  update: (id: string, data: Partial<{ name: string; connectionType: string; hardware: string; description: string }>) =>
    api.put(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
};

// Devices API
export const devicesApi = {
  getByTemplate: (templateId: string) => api.get(`/devices?templateId=${templateId}`),
  getById: (id: string) => api.get(`/devices/${id}`),
  create: (data: { templateId: string; name: string; deviceType: string; description?: string; location?: string }) =>
    api.post('/devices', data),
  delete: (id: string) => api.delete(`/devices/${id}`),
  getData: (deviceId: string) => api.get(`/devices/${deviceId}/data`),
};

export default api;
