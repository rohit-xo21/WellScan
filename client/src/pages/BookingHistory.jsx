import { useState, useEffect } from 'react'
import { bookingsAPI, reportsAPI } from '../services/api'
import { useToast } from '../contexts/useToast'
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
  const [downloadingReports, setDownloadingReports] = useState(new Set())
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const toast = useToast()

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
      setError('')
      const response = await bookingsAPI.getHistory()
      if (response.data.success) {
        setBookings(response.data.data)
      }
    } catch (error) {
      console.error('Fetch bookings error:', error)
      setError('Failed to fetch booking history. Please try again.')
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
    // Set the booking that's being considered for cancellation
    setCancellingBooking(bookingId)
  }

  const confirmCancelBooking = async () => {
    if (!cancellingBooking) return

    try {
      const response = await bookingsAPI.cancel(cancellingBooking)
      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === cancellingBooking 
            ? { ...booking, status: 'cancelled' }
            : booking
        ))
        toast.success('Booking cancelled successfully')
      }
    } catch (error) {
      console.error('Cancel booking error:', error)
      toast.error('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingBooking(null)
    }
  }

  const cancelCancelBooking = () => {
    setCancellingBooking(null)
  }

  const downloadReport = async (bookingId) => {
    if (downloadingReports.has(bookingId)) {
      return // Already downloading
    }

    try {
      setDownloadingReports(prev => new Set([...prev, bookingId]))
      const response = await reportsAPI.download(bookingId)
      
      // Create blob and download file
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Lab-Report-${bookingId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Update booking to show report as generated (optional)
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, reportGenerated: true }
          : booking
      ))

      toast.success('Report downloaded successfully')

    } catch (error) {
      console.error('Download error:', error)
      if (error.response?.status === 403) {
        toast.error('Report not available yet. Please wait until after your appointment.')
      } else {
        toast.error('Failed to download report. Please try again.')
      }
    } finally {
      setDownloadingReports(prev => {
        const newSet = new Set([...prev])
        newSet.delete(bookingId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load bookings</h3>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button 
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
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
                          {/* Report Download - Available 2 hours after appointment or when completed */}
                          {booking.reportAvailable && (
                            <button
                              onClick={() => downloadReport(booking._id)}
                              disabled={downloadingReports.has(booking._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                downloadingReports.has(booking._id)
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {downloadingReports.has(booking._id) ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  Download Report
                                </>
                              )}
                            </button>
                          )}

                          {/* Report Not Available Yet */}
                          {!booking.reportAvailable && booking.status === 'scheduled' && new Date(booking.appointmentDate) <= new Date() && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                              <Clock className="w-4 h-4" />
                              Report available {new Date(booking.reportAvailableTime).toLocaleString()}
                            </div>
                          )}
                          
                          {/* Cancel Button for Future Appointments */}
                          {booking.status === 'scheduled' && new Date(booking.appointmentDate) > new Date() && (
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

      {/* Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelCancelBooking}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingHistory
