const { Test } = require('../models');
const { validationResult } = require('express-validator');

// Get all active tests
const getAllTests = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get tests with pagination
    const tests = await Test.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Test.countDocuments(query);

    res.json({
      success: true,
      data: tests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    if (!test.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Test is no longer available'
      });
    }

    res.json({
      success: true,
      data: test
    });

  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching test',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get test categories
const getTestCategories = async (req, res) => {
  try {
    const categories = await Test.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  getTestCategories
};
