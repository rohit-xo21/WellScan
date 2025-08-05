import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import TestCatalog from './pages/TestCatalog'
import BookingHistory from './pages/BookingHistory'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main style={{ paddingTop: '70px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/tests" 
                element={
                  <ProtectedRoute>
                    <TestCatalog />
                  </ProtectedRoute>
                } 
              />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </main>
        </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App