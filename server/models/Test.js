const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
    maxlength: [100, 'Test name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Test price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    trim: true,
    enum: {
      values: ['Blood Test', 'Urine Test', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG', 'Other'],
      message: 'Category must be one of: Blood Test, Urine Test, X-Ray, CT Scan, MRI, Ultrasound, ECG, Other'
    },
    default: 'Other'
  },
  duration: {
    type: String,
    trim: true,
    default: '30 minutes'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: {
    type: String,
    trim: true,
    maxlength: [300, 'Requirements cannot be more than 300 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient searching
testSchema.index({ name: 1, category: 1 });
testSchema.index({ isActive: 1 });

module.exports = mongoose.model('Test', testSchema);
