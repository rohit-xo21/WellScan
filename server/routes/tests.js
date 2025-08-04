const express = require('express');
const router = express.Router();
const { getAllTests, getTestById, getTestCategories } = require('../controllers/testController');
const auth = require('../middleware/auth');

// Public routes (tests can be viewed without authentication)
router.get('/', getAllTests);
router.get('/categories', getTestCategories);
router.get('/:id', getTestById);

module.exports = router;
