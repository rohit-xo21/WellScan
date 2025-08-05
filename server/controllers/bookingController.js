/**
 * Booking Controller
 * 
 * Handles all booking-related operations including:
 * - Creating new lab test bookings with overlap validation
 * - Retrieving patient booking history
 * - Managing booking status updates
 * 
 * @module controllers/bookingController
 */

const { Booking, Test } = require('../models');
const { validationResult } = require('express-validator');

/**
 * Create a new lab test booking
 * 
 * Validates appointment time against existing bookings to prevent overlaps
 * Uses test duration to calculate potential time conflicts
 * 
 * @route POST /api/bookings
 * @access Private (requires JWT authentication)
 * @param {Object} req.body - { testId, appointmentDate, notes }
 * @returns {Object} Created booking with populated test details
 */
const createBooking = async (req, res) => {
  try {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { testId, appointmentDate, notes } = req.body;
    const patientId = req.patient.id; // From JWT authentication middleware

    // Verify test exists and is available for booking
    const test = await Test.findById(testId);
    if (!test || !test.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Test not found or not available'
      });
    }

    // Check for duplicate booking (same patient + same test + same date)
    const existingBooking = await Booking.findOne({
      patientId,
      testId,
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this test on the selected date'
      });
    }

    // Check for overlapping appointments with other tests using duration
    const appointmentTime = new Date(appointmentDate);
    
    // Parse current test duration to get minutes
    const currentTestDurationStr = test.duration || "30 minutes";
    const currentTestDurationMatch = currentTestDurationStr.match(/(\d+)/);
    const currentTestDurationMinutes = currentTestDurationMatch ? parseInt(currentTestDurationMatch[1]) : 30;
    
    // Calculate end time for current appointment
    const currentTestEndTime = new Date(appointmentTime.getTime() + (currentTestDurationMinutes * 60 * 1000));
    
    // Find all existing appointments for this patient on the same day
    const existingAppointments = await Booking.find({
      patientId,
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      status: { $ne: 'cancelled' }
    }).populate('testId', 'duration name');

    // Check for time conflicts with existing appointments
    for (const existingAppt of existingAppointments) {
      const existingStartTime = new Date(existingAppt.appointmentDate);
      
      // Parse existing test duration
      const existingTestDurationStr = existingAppt.testId.duration || "30 minutes";
      const existingTestDurationMatch = existingTestDurationStr.match(/(\d+)/);
      const existingTestDurationMinutes = existingTestDurationMatch ? parseInt(existingTestDurationMatch[1]) : 30;
      
      // Calculate end time for existing appointment
      const existingEndTime = new Date(existingStartTime.getTime() + (existingTestDurationMinutes * 60 * 1000));
      
      // Check if appointments overlap
      const hasOverlap = (appointmentTime < existingEndTime) && (currentTestEndTime > existingStartTime);
      
      if (hasOverlap) {
        return res.status(400).json({
          success: false,
          message: `This appointment conflicts with your existing ${existingAppt.testId.name} appointment at ${existingStartTime.toLocaleTimeString()}. Please choose a different time.`
        });
      }
    }

    // Create booking
    const booking = await Booking.create({
      patientId,
      testId,
      appointmentDate,
      notes,
      totalAmount: test.price
    });

    // Populate the booking data
    await booking.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'testId', select: 'name description price category duration' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get patient bookings
const getPatientBookings = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { patientId };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate([
        { path: 'testId', select: 'name description price category duration' },
        { path: 'patientId', select: 'name email phone' }
      ])
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add report availability logic
    const bookingsWithReportStatus = bookings.map(booking => {
      const bookingObj = booking.toObject();
      const currentTime = new Date();
      const appointmentTime = new Date(booking.appointmentDate);
      
      // Parse duration string to get minutes (e.g., "30 minutes" -> 30)
      const durationStr = booking.testId.duration || "30 minutes";
      const durationMatch = durationStr.match(/(\d+)/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;
      
      // Report becomes available after test duration or if status is completed
      const reportAvailableTime = new Date(appointmentTime.getTime() + (durationMinutes * 60 * 1000)); // duration after appointment
      const isReportAvailable = currentTime >= reportAvailableTime || booking.status === 'completed';
      
      return {
        ...bookingObj,
        reportAvailable: isReportAvailable,
        reportAvailableTime: reportAvailableTime
      };
    });

    // Get total count
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookingsWithReportStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      patientId: req.patient.id
    }).populate([
      { path: 'testId', select: 'name description price category duration' },
      { path: 'patientId', select: 'name email phone' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Add report availability logic
    const currentTime = new Date();
    const appointmentTime = new Date(booking.appointmentDate);
    
    // Parse duration string to get minutes (e.g., "30 minutes" -> 30)
    const durationStr = booking.testId.duration || "30 minutes";
    const durationMatch = durationStr.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;
    
    const reportAvailableTime = new Date(appointmentTime.getTime() + (durationMinutes * 60 * 1000)); // duration after appointment
    const isReportAvailable = currentTime >= reportAvailableTime || booking.status === 'completed';

    const bookingWithReportStatus = {
      ...booking.toObject(),
      reportAvailable: isReportAvailable,
      reportAvailableTime: reportAvailableTime
    };

    res.json({
      success: true,
      data: bookingWithReportStatus
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      patientId: req.patient.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createBooking,
  getPatientBookings,
  getBookingById,
  cancelBooking
};
