const { body } = require('express-validator');

// Patient registration validation
const validatePatientRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid date of birth')
    .custom(value => {
      if (value >= new Date()) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Booking creation validation
const validateBookingCreation = [
  body('testId')
    .isMongoId()
    .withMessage('Please provide a valid test ID'),

  body('appointmentDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid appointment date')
    .custom(value => {
      const appointmentDate = new Date(value);
      const now = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance

      if (appointmentDate <= now) {
        throw new Error('Appointment date must be in the future');
      }
      
      if (appointmentDate > maxDate) {
        throw new Error('Appointment date cannot be more than 3 months in advance');
      }
      
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters')
];

// Patient login validation
const validatePatientLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  validatePatientRegistration,
  validateBookingCreation,
  validatePatientLogin
};
