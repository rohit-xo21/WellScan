/**
 * WellScan API Server
 * 
 * Main entry point for the Patient Lab Test Portal backend
 * Handles authentication, bookings, tests, and patient management
 * 
 * @author WellScan Team
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const { seedTests } = require('./utils/seedData');

// Load environment variables from .env file
dotenv.config();

// Establish MongoDB connection and seed initial test data
connectDB().then(() => {
  console.log('Database connected successfully');
  // Seed initial lab tests data after database connection
  seedTests();
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for cross-origin requests
const allowedOrigins = [
  'http://localhost:5173',               // Local development
  'https://well-scan.vercel.app',        // Production frontend
  'https://wellscan-*.vercel.app',       // All Vercel deployments
  process.env.CLIENT_URL                 // Environment specific URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard patterns
        const pattern = allowedOrigin.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Allow cookies for JWT authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware setup
app.use(cookieParser()); // Parse cookies for JWT tokens
app.use(express.json({ limit: '10mb' })); // Parse JSON requests with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests

// Serve static files for uploaded content (reports, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * Root endpoint - API information
 * @route GET /
 * @returns {Object} API status and version info
 */
app.get('/', (req, res) => {
  res.json({
    message: 'WellScan API Server',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

/**
 * Health check endpoint for monitoring
 * @route GET /health
 * @returns {Object} Server and database health status
 */
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'Not connected'
    }
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    collections: Object.keys(mongoose.connection.collections)
  });
});

// Import API routes
const apiRoutes = require('./routes');

// Mount API routes
app.use('/api', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
});
