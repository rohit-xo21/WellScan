// Cookie utility functions for handling authentication tokens

/**
 * Set a cookie with the given name and value
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days
 */
export const setCookie = (name, value, days = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  
  // Check if we're in production (HTTPS) or development (HTTP)
  const isProduction = window.location.protocol === 'https:'
  
  if (isProduction) {
    // Production: Use secure cookies with SameSite=None for cross-domain
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=None;Secure`
  } else {
    // Development: Use less strict cookies for localhost
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
  return cookie ? cookie.split('=')[1] : null
}

/**
 * Delete cookie by name
 * @param {string} name - Cookie name to delete
 */
export const deleteCookie = (name) => {
  const isProduction = window.location.protocol === 'https:'
  
  if (isProduction) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`
  } else {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`
  }
}

/**
 * Get authentication token from localStorage or cookies (multiple fallbacks)
 * @returns {string|null} Authentication token
 */
export const getAuthToken = () => {
  // First try localStorage
  let token = localStorage.getItem('token')
  
  // If no localStorage token, try multiple cookie names
  if (!token) {
    token = getCookie('token') || getCookie('authToken')
  }
  
  // Debug logging in development
  if (!token && import.meta.env.DEV) {
    console.log('Debug: No auth token found in localStorage or cookies')
    console.log('LocalStorage token:', localStorage.getItem('token'))
    console.log('Cookie token:', getCookie('token'))
    console.log('AuthToken cookie:', getCookie('authToken'))
    console.log('All cookies:', document.cookie)
  }
  
  return token
}

/**
 * Store authentication token in both localStorage and cookies
 * @param {string} token - JWT token to store
 */
export const storeAuthToken = (token) => {
  localStorage.setItem('token', token)
  setCookie('token', token, 30)
  setCookie('authToken', token, 30) // Fallback cookie
}

/**
 * Clear authentication token from both localStorage and cookies
 */
export const clearAuthToken = () => {
  localStorage.removeItem('token')
  deleteCookie('token')
  deleteCookie('authToken')
}
