const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateReport } = require('../controllers/reportController');

// @route   GET /api/reports/:bookingId
// @desc    Generate and download PDF report for a booking
// @access  Private
router.get('/:bookingId', auth, generateReport);

module.exports = router;
