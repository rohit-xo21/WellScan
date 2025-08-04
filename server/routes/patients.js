const express = require('express');
const router = express.Router();
const { 
  registerPatient, 
  getPatientProfile, 
  loginPatient, 
  logoutPatient 
} = require('../controllers/patientController');
const { validatePatientRegistration, validatePatientLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', validatePatientRegistration, registerPatient);
router.post('/login', validatePatientLogin, loginPatient);

// Protected routes
router.get('/profile', auth, getPatientProfile);
router.post('/logout', auth, logoutPatient);

module.exports = router;
