const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getPatientBookings, 
  getBookingById, 
  cancelBooking 
} = require('../controllers/bookingController');
const { validateBookingCreation } = require('../middleware/validation');
const auth = require('../middleware/auth');

// All booking routes require authentication
router.use(auth);

// Booking routes
router.post('/', validateBookingCreation, createBooking);
router.get('/', getPatientBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
