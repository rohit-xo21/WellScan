const PDFDocument = require('pdfkit');
const { Booking } = require('../models');
const { getCurrentIST, formatIST } = require('../utils/timezone');

const generateReport = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Fetch booking details with populated test and patient info
    const booking = await Booking.findById(bookingId)
      .populate('testId', 'name description category price duration')
      .populate('patientId', 'name email phone dateOfBirth');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking belongs to the authenticated patient
    if (booking.patientId._id.toString() !== req.patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this report'
      });
    }

    // Check if report is available (after test duration or if completed)
    const currentTime = getCurrentIST();
    const appointmentTime = new Date(booking.appointmentDate);
    
    // Parse duration string to get minutes (e.g., "30 minutes" -> 30)
    const durationStr = booking.testId.duration || "30 minutes";
    const durationMatch = durationStr.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;
    
    const reportAvailableTime = new Date(appointmentTime.getTime() + (durationMinutes * 60 * 1000)); // duration after appointment
    const isReportAvailable = currentTime >= reportAvailableTime || booking.status === 'completed';

    if (!isReportAvailable) {
      return res.status(403).json({
        success: false,
        message: `Report will be available after ${reportAvailableTime.toLocaleString()}. Please wait until after your appointment.`
      });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Lab-Report-${bookingId}.pdf"`);
    
    // Pipe the PDF to response
    doc.pipe(res);

    // Add WellScan header
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('WellScan', 50, 50);
    
    doc.fontSize(12)
       .fillColor('#6b7280')
       .text('Digital Health Lab Reports', 50, 80);

    // Add a line separator
    doc.moveTo(50, 100)
       .lineTo(550, 100)
       .strokeColor('#e5e7eb')
       .stroke();

    // Patient Information
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Patient Information', 50, 130);

    doc.fontSize(12)
       .fillColor('#374151')
       .text(`Name: ${booking.patientId.name}`, 50, 160)
       .text(`Email: ${booking.patientId.email}`, 50, 180)
       .text(`Phone: ${booking.patientId.phone}`, 50, 200)
       .text(`Date of Birth: ${formatIST(booking.patientId.dateOfBirth)}`, 50, 220);

    // Test Information
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Test Information', 50, 260);

    doc.fontSize(12)
       .fillColor('#374151')
       .text(`Test Name: ${booking.testId.name}`, 50, 290)
       .text(`Category: ${booking.testId.category}`, 50, 310)
       .text(`Description: ${booking.testId.description}`, 50, 330)
       .text(`Price: ₹${booking.testId.price.toFixed(2)}`, 50, 350);

    // Booking Details
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Booking Details', 50, 390);

    doc.fontSize(12)
       .fillColor('#374151')
       .text(`Booking ID: ${booking._id}`, 50, 420)
       .text(`Appointment Date: ${formatIST(booking.appointmentDate)}`, 50, 440)
       .text(`Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`, 50, 460)
       .text(`Total Amount Paid: ₹${booking.totalAmount.toFixed(2)}`, 50, 480)
       .text(`Booking Date: ${formatIST(booking.createdAt)}`, 50, 500);

    // Lab Results Section (Dummy data)
    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Lab Results', 50, 540);

    // Add dummy test results based on test category
    let results = [];
    switch (booking.testId.category) {
      case 'Blood Test':
        results = [
          { parameter: 'Hemoglobin', value: '14.2 g/dL', range: '12.0-16.0 g/dL', status: 'Normal' },
          { parameter: 'White Blood Cells', value: '7,200/μL', range: '4,500-11,000/μL', status: 'Normal' },
          { parameter: 'Platelets', value: '285,000/μL', range: '150,000-450,000/μL', status: 'Normal' }
        ];
        break;
      case 'Radiology':
        results = [
          { parameter: 'Imaging Quality', value: 'Excellent', range: 'Good-Excellent', status: 'Normal' },
          { parameter: 'Findings', value: 'No abnormalities detected', range: 'N/A', status: 'Normal' }
        ];
        break;
      default:
        results = [
          { parameter: 'Overall Result', value: 'Normal', range: 'Normal', status: 'Normal' },
          { parameter: 'Recommendation', value: 'Continue regular monitoring', range: 'N/A', status: 'Normal' }
        ];
    }

    let yPosition = 570;
    results.forEach(result => {
      doc.fontSize(11)
         .fillColor('#374151')
         .text(`${result.parameter}: ${result.value}`, 50, yPosition)
         .text(`Reference Range: ${result.range}`, 300, yPosition)
         .fillColor(result.status === 'Normal' ? '#059669' : '#dc2626')
         .text(`Status: ${result.status}`, 450, yPosition);
      yPosition += 25;
    });

    // Footer
    doc.fontSize(10)
       .fillColor('#6b7280')
       .text('This is a computer-generated report. For questions, contact WellScan at support@wellscan.com', 50, yPosition + 40)
       .text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 50, yPosition + 60);

    // Mark report as generated in database
    await Booking.findByIdAndUpdate(bookingId, { reportGenerated: true });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

module.exports = {
  generateReport
};
