import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext.js'
import { authAPI } from '../services/api'
import { storeAuthToken, clearAuthToken, getAuthToken } from '../utils/cookies'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // First check if we have a token before making API call
      const token = getAuthToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authAPI.getProfile()
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.log('Not authenticated:', error.message)
      // Clear invalid tokens
      if (error.response?.status === 401) {
        clearAuthToken()
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      if (response.data.success) {
        setUser(response.data.data.patient)
        // Store token in both localStorage and cookies for cross-domain compatibility
        if (response.data.data.token) {
          storeAuthToken(response.data.data.token)
          console.log('Token stored successfully:', response.data.data.token.substring(0, 20) + '...')
        }
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      if (response.data.success) {
        setUser(response.data.data.patient)
        // Store token in both localStorage and cookies for cross-domain compatibility
        if (response.data.data.token) {
          storeAuthToken(response.data.data.token)
        }
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || []
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      setUser(null)
      clearAuthToken() // Clear both localStorage and cookies
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
