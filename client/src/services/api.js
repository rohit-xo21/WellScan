import axios from 'axios'
import { getAuthToken } from '../utils/cookies'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available (check both localStorage and cookies)
api.interceptors.request.use((config) => {
  const token = getAuthToken() // This checks both localStorage and cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Import clearAuthToken dynamically to avoid circular imports
      import('../utils/cookies').then(({ clearAuthToken }) => {
        clearAuthToken()
        window.location.href = '/login'
      })
    }
    return Promise.reject(error)
  }
)

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

// Reports API calls
export const reportsAPI = {
  download: (bookingId) => api.get(`/reports/${bookingId}`, { responseType: 'blob' }),
}

export default api
