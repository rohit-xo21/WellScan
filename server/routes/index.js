const express = require('express');
const router = express.Router();

// Import route modules
const patientRoutes = require('./patients');
const testRoutes = require('./tests');
const bookingRoutes = require('./bookings');
const reportRoutes = require('./reports');

// Mount routes
router.use('/patients', patientRoutes);
router.use('/tests', testRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reports', reportRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'WellScan API',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      tests: '/api/tests',
      bookings: '/api/bookings',
      reports: '/api/reports'
    }
  });
});

module.exports = router;
