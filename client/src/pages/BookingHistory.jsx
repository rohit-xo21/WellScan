import { useState, useEffect } from 'react'
import { bookingsAPI } from '../services/api'
import { 
  Droplets, 
  TestTube, 
  Scan, 
  Brain, 
  Radio, 
  Heart, 
  Microscope,
  Activity,
  Calendar,
  Clock,
  FileText,
  Download,
  X,
  AlertCircle
} from 'lucide-react'

const BookingHistory = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Icon mapping for different test categories
  const getCategoryIcon = (category) => {
    const icons = {
      'Blood Test': Droplets,
      'Heart Health': Heart,
      'Hormone Test': TestTube,
      'Organ Health': Brain,
      'Blood Sugar': Activity,
      'Vitamin Test': Microscope,
      'General Health': Heart,
      'Urine Test': TestTube,
      'X-Ray': Scan,
      'CT Scan': Scan,
      'MRI': Brain,
      'Ultrasound': Radio,
      'ECG': Heart,
      'Other': Microscope
    }
    return icons[category] || Activity
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getHistory()
      if (response.data.success) {
        setBookings(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch booking history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      const response = await bookingsAPI.cancel(bookingId)
      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ))
        alert('Booking cancelled successfully')
      }
    } catch (err) {
      alert('Failed to cancel booking')
    }
  }

  const downloadReport = (bookingId) => {
    // Simulated report download
    const link = document.createElement('a')
    link.href = `http://localhost:5000/api/reports/${bookingId}`
    link.download = `report-${bookingId}.pdf`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded p-6 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-lg text-gray-600">
            View and manage your lab test appointments and download reports.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">You haven't booked any lab tests yet.</p>
              <a
                href="/tests"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
              >
                Browse Tests
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => {
                const IconComponent = getCategoryIcon(booking.testId.category)
                return (
                  <div key={booking._id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      {/* Test Icon */}
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {booking.testId.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {booking.testId.description}
                            </p>
                            <div className="text-xs text-gray-500">
                              {booking.testId.category}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)} flex-shrink-0`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div className="text-sm">
                              <span className="text-gray-500">Date: </span>
                              <span className="font-medium text-gray-900">{formatDate(booking.appointmentDate)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 text-gray-400 flex items-center justify-center text-xs font-bold">₹</span>
                            <div className="text-sm">
                              <span className="text-gray-500">Amount: </span>
                              <span className="font-bold text-blue-600">₹{booking.totalAmount}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div className="text-sm">
                              <span className="text-gray-500">ID: </span>
                              <span className="font-mono text-gray-900">#{booking._id.slice(-8)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="text-xs text-gray-500 mb-1">Notes</div>
                            <div className="text-sm text-gray-700">{booking.notes}</div>
                          </div>
                        )}

                        {/* Footer Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          {booking.testId.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.testId.duration}
                            </span>
                          )}
                          <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {booking.status === 'completed' && booking.reportGenerated && (
                            <button
                              onClick={() => downloadReport(booking._id)}
                              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download Report
                            </button>
                          )}
                          
                          {booking.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          )}

                          {booking.status === 'completed' && !booking.reportGenerated && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 px-4 py-2 bg-gray-100 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              Report processing...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingHistory
