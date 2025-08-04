const { Test } = require('../models');

const sampleTests = [
  {
    name: 'Complete Blood Count (CBC)',
    description: 'A comprehensive blood test that evaluates your overall health and detects various disorders.',
    price: 850,
    category: 'Blood Test',
    duration: '15 minutes',
    requirements: 'No special preparation required'
  },
  {
    name: 'Lipid Profile',
    description: 'Measures cholesterol levels and assesses cardiovascular disease risk.',
    price: 1200,
    category: 'Blood Test',
    duration: '15 minutes',
    requirements: '12-hour fasting required'
  },
  {
    name: 'Thyroid Function Test',
    description: 'Evaluates thyroid gland function including TSH, T3, and T4 levels.',
    price: 1500,
    category: 'Blood Test',
    duration: '15 minutes',
    requirements: 'No special preparation required'
  },
  {
    name: 'Chest X-Ray',
    description: 'Imaging test to examine the chest, lungs, heart, and chest wall.',
    price: 800,
    category: 'X-Ray',
    duration: '10 minutes',
    requirements: 'Remove jewelry and metal objects'
  },
  {
    name: 'Urine Routine Examination',
    description: 'Basic urine test to detect various conditions and infections.',
    price: 300,
    category: 'Urine Test',
    duration: '5 minutes',
    requirements: 'Clean catch midstream urine sample'
  },
  {
    name: 'ECG (Electrocardiogram)',
    description: 'Records electrical activity of the heart to detect heart problems.',
    price: 500,
    category: 'ECG',
    duration: '15 minutes',
    requirements: 'Wear loose, comfortable clothing'
  },
  {
    name: 'Abdominal Ultrasound',
    description: 'Imaging test to examine organs in the abdomen.',
    price: 2000,
    category: 'Ultrasound',
    duration: '30 minutes',
    requirements: '6-hour fasting required'
  },
  {
    name: 'Blood Sugar Fasting',
    description: 'Measures blood glucose levels after fasting to screen for diabetes.',
    price: 200,
    category: 'Blood Test',
    duration: '5 minutes',
    requirements: '8-12 hour fasting required'
  }
];

const seedTests = async () => {
  try {
    // Check if tests already exist
    const existingTests = await Test.countDocuments();
    
    if (existingTests === 0) {
      await Test.insertMany(sampleTests);
      console.log('Sample tests created successfully');
    } else {
      console.log('Tests already exist in database');
    }
  } catch (error) {
    console.error('Error seeding tests:', error);
  }
};

module.exports = { seedTests };
