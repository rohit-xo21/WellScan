import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { testsAPI } from '../services/api'
import scientistImage from '../assets/hero-image-mobile.png'
import modernLabImage from '../assets/hero-image-desktop.jpg'
import footerImage from '../assets/footer-image.png'
import { 
  Droplets, 
  TestTube, 
  Scan, 
  Brain, 
  Radio, 
  Heart, 
  Microscope,
  Activity,
  Phone,
  Mail,
  Clock
} from 'lucide-react'

const Home = () => {
  const [featuredTests, setFeaturedTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log('Fetching tests from API...')
        const response = await testsAPI.getAll({ limit: 8 })
        console.log('API Response:', response)
        
        // Handle both direct array and nested data structure
        const testsData = Array.isArray(response.data) ? response.data : response.data?.data || []
        console.log('Tests data:', testsData)
        
        setFeaturedTests(testsData)
      } catch (error) {
        console.error('Error fetching tests:', error)
        // Fallback to empty array if API fails
        setFeaturedTests([])
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  // Icon mapping for different test categories
  const getCategoryIcon = (category) => {
    const icons = {
      'Blood Test': Droplets,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px]">
                <img 
                  src={modernLabImage} 
                  alt="Modern Laboratory Setup" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 flex items-center p-12">
                  <div className="text-white max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                      Book Lab Tests<br />
                      Online
                    </h1>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                      Browse our lab test catalog, book your tests online, and get your reports digitally.
                      Convenient and secure healthcare at your fingertips.
                    </p>
                    <Link 
                      to="/tests"
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
                    >
                      Browse Tests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px]">
                <img 
                  src={scientistImage} 
                  alt="Scientist Using Microscope" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                      Book Lab Tests<br />
                      Online
                    </h1>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                      Browse our lab test catalog, book your tests online, and get your reports digitally.
                    </p>
                    <Link 
                      to="/tests"
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
                    >
                      Browse Tests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Lab Tests Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Lab Tests</h2>
            <p className="text-gray-600 text-lg">Browse our comprehensive lab test catalog.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading tests...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {Array.isArray(featuredTests) && featuredTests.slice(0, 8).map((test) => {
                  const IconComponent = getCategoryIcon(test.category)
                  return (
                    <div key={test._id || test.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{test.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{test.category}</p>
                        <div className="flex items-center justify-center mb-2">
                          <div className={`w-1.5 h-1.5 ${test.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-1.5`}></div>
                          <span className="text-xs text-gray-600">{test.isActive ? 'Available' : 'Unavailable'}</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-600">₹{test.price}</p>
                      </div>
                    </div>
                  )
                })}
                
                {/* Show message if no tests available */}
                {!Array.isArray(featuredTests) || featuredTests.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No tests available at the moment. Please try again later.
                  </div>
                ) : null}
              </div>

              <div className="text-center">
                <Link 
                  to="/tests"
                  className="inline-block bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-200 transition-colors duration-300"
                >
                  View All Tests
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img 
              src={footerImage} 
              alt="Expert Lab Analysis Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Content */}
            <div className="relative grid lg:grid-cols-2 gap-12 items-center p-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                  Simple 3-Step<br />
                  Process
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <span>Browse and select lab tests</span>
                  </div>
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <span>Book appointment online</span>
                  </div>
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span>Download digital reports</span>
                  </div>
                </div>
                <Link 
                  to="/register"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold">WellScan</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted digital health partner for convenient lab testing. 
                Book tests online, get accurate results, and manage your health records 
                all in one secure platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">SERVICES</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/tests" className="hover:text-white transition-colors">Lab Tests</Link></li>
                  <li><Link to="/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
                  <li><Link to="/reports" className="hover:text-white transition-colors">Test Reports</Link></li>
                  <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">CONTACT INFO</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+1-800-WELLSCAN</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>support@wellscan.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Mon-Sat 8AM-8PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400">
            <p>© 2024 WellScan. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
