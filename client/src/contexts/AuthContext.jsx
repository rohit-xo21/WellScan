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
      const response = await authAPI.getProfile()
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.log('Not authenticated:', error.message)
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
        }
        return { success: true }
      }
    } catch (error) {
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
