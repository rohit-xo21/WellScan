const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: [true, 'Test ID is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'completed', 'cancelled'],
      message: 'Status must be one of: scheduled, completed, cancelled'
    },
    default: 'scheduled'
  },
  reportGenerated: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  totalAmount: {
    type: Number,
    min: [0, 'Total amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Populate patient and test details
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patientId',
    select: 'name email phone'
  }).populate({
    path: 'testId',
    select: 'name description price category duration'
  });
  next();
});

// Index for efficient queries
bookingSchema.index({ patientId: 1, appointmentDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Prevent booking same test for same patient on same date
bookingSchema.index(
  { patientId: 1, testId: 1, appointmentDate: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: { $ne: 'cancelled' } }
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
