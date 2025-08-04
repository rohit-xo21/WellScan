import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/patients/register', userData),
  login: (email, password) => api.post('/patients/login', { email, password }),
  logout: () => api.post('/patients/logout'),
  getProfile: () => api.get('/patients/profile'),
}

// Tests API calls
export const testsAPI = {
  getAll: (params = {}) => api.get('/tests', { params }),
}

// Bookings API calls
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getHistory: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
}

export default api
