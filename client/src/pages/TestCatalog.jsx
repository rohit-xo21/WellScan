/**
 * Test Catalog Component
 * 
 * Displays available lab tests with filtering, booking functionality, and responsive design.
 * Features include:
 * - Test filtering by category
 * - Real-time booking with appointment scheduling
 * - Smart form validation and error handling
 * - Mobile-responsive design with professional UI
 * 
 * @component
 * @example
 * return (
 *   <TestCatalog />
 * )
 */

import { useState, useEffect } from 'react'
import { testsAPI, bookingsAPI } from '../services/api'
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
  Search,
  Calendar,
  Clock,
  FileText
} from 'lucide-react'

const TestCatalog = () => {
  // State management for test catalog functionality
  const [tests, setTests] = useState([]) // All available tests
  const [loading, setLoading] = useState(true) // Loading state for initial data fetch
  const [error, setError] = useState('') // Error state for API failures
  const [selectedCategory, setSelectedCategory] = useState('All') // Active filter category
  const [bookingTest, setBookingTest] = useState(null) // Currently selected test for booking
  const [appointmentDate, setAppointmentDate] = useState('') // Selected appointment date/time
  const [notes, setNotes] = useState('') // Optional booking notes
  const [bookingLoading, setBookingLoading] = useState(false) // Loading state for booking submission
  const [categories, setCategories] = useState(['All']) // Available test categories
  const toast = useToast() // Toast notification hook

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await testsAPI.getAll()
      if (response.data.success) {
        setTests(response.data.data)
        // Create dynamic categories from actual data
        const uniqueCategories = [...new Set(response.data.data.map(test => test.category))]
        setCategories(['All', ...uniqueCategories.sort()])
        console.log('Available categories in data:', uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
      setError('Failed to fetch tests')
    } finally {
      setLoading(false)
    }
  }

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

  const filteredTests = tests.filter(test => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory
    return matchesCategory
  })

  const handleBookTest = (test) => {
    setBookingTest(test)
    setAppointmentDate('')
    setNotes('')
  }

  const submitBooking = async () => {
    if (!appointmentDate) {
      toast.warning('Please select an appointment date')
      return
    }

    setBookingLoading(true)
    try {
      const response = await bookingsAPI.create({
        testId: bookingTest._id,
        appointmentDate,
        notes
      })

      if (response.data.success) {
        toast.success('Booking confirmed successfully!')
        setBookingTest(null)
        setAppointmentDate('')
        setNotes('')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to book test. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available tests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded p-6 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchTests}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Lab Tests</h1>
          <p className="text-lg text-gray-600">
            Choose from our comprehensive range of lab tests with accurate results
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map(test => {
              const IconComponent = getCategoryIcon(test.category)
              return (
                <div key={test._id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">{test.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{test.description}</p>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                          {test.category}
                        </span>
                        {test.duration && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{test.duration}</span>
                          </div>
                        )}
                      </div>

                      {test.requirements && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                          <FileText className="w-3 h-3" />
                          <span>Fasting: {test.requirements}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">₹{Math.round(test.price * 1.3)}</span>
                          <span className="text-lg font-bold text-blue-600">₹{test.price}</span>
                        </div>
                        <button
                          onClick={() => handleBookTest(test)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No tests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Book Test</h3>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const IconComponent = getCategoryIcon(bookingTest.category)
                    return <IconComponent className="w-5 h-5 text-blue-600" />
                  })()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{bookingTest.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{bookingTest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{bookingTest.category}</span>
                    <span className="text-lg font-bold text-blue-600">₹{bookingTest.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setBookingTest(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitBooking}
                disabled={bookingLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestCatalog
