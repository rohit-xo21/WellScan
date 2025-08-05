const jwt = require('jsonwebtoken');
const { Patient } = require('../models');

const auth = async (req, res, next) => {
  try {
    let token;

    console.log('Auth middleware - Request:', {
      method: req.method,
      url: req.url,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'None',
        origin: req.headers.origin,
        referer: req.headers.referer
      },
      cookies: req.cookies ? Object.keys(req.cookies) : []
    });

    // Check multiple sources for token (comprehensive fallback)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 1. Authorization header (most reliable for cross-domain)
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    } else if (req.cookies && req.cookies.token) {
      // 2. Main token cookie
      token = req.cookies.token;
      console.log('Token found in main cookie');
    } else if (req.cookies && req.cookies.authToken) {
      // 3. Fallback authToken cookie
      token = req.cookies.authToken;
      console.log('Token found in fallback cookie');
    } else if (req.headers['x-auth-token']) {
      // 4. Custom header fallback
      token = req.headers['x-auth-token'];
      console.log('Token found in custom header');
    }

    if (!token) {
      console.log('No token found in any source');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get patient from token
    const patient = await Patient.findById(decoded.id).select('-password');
    
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Patient not found.'
      });
    }

    // Add patient to request object
    req.patient = patient;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = auth;
