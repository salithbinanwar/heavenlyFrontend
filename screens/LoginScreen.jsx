import axios from 'axios' // Import axios
import { useState } from 'react'
import { PiTrafficSignThin } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate

const LoginScreen = () => {
  const [roomNumber, setRoomNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // Add error state

  const navigate = useNavigate() // Initialize useNavigate

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/users/auth', // API endpoint for user authentication
        { roomNumber, password },
        config,
      )
      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data)) // Store user info
        navigate('/profile') // Redirect to user profile
      } else {
        setError('User login failed.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred during login',
      )
    }
  }

  // A reusable icon wrapper component for the input fields
  const IconedInput = ({ children }) => (
    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
      {children}
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[url('../src/images/sky.jpg')] bg-center bg-cover">
      {/* Main Card Container */}
      <div className="w-full max-w-sm p-8 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl">
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl shadow-lg">
            <PiTrafficSignThin className="text-3xl" />
          </div>
        </div>
        {/* Title and Subtitle */}
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Sign in with your room number
        </h3>
        <p className="mt-1 text-center text-sm text-gray-500 mb-6">
          Make a new doc to bring your words, data, and teams together. For free
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{' '}
        {/* Display error message */}
        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            {/* Room Number Input Field (Updated Design) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Room Number"
                className="w-full px-4 py-3 pl-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
              <IconedInput>
                {/* Home/Room Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </IconedInput>
            </div>

            {/* Password Input Field (Updated Design) */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 pl-10 pr-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <IconedInput>
                {/* Lock Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7h6a2 2 0 012 2v2H7V9a2 2 0 012-2z"
                  />
                </svg>
              </IconedInput>
              {/* Hide/Show Password Icon (Placeholder on right) */}
            </div>

            {/* Forgot Password Link and Submit Button */}
            <div className="flex items-center justify-between mt-6">
              {/* The original code had a 'Link' component here for registration,
                            but the image shows a 'Forgot password?' link, which I've added below. */}

              {/* Get Started Button (Submit) - styled like the image */}
              <button
                type="submit"
                className="px-6 py-2 font-semibold text-white transition duration-200 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-800/50"
              >
                Get Started
              </button>
            </div>
          </div>
        </form>
        {/* Separator */}
        <div className="relative flex items-center justify-center py-5">
          <div className="absolute top-1/2 w-full h-px bg-gray-200"></div>
          <span className="relative z-10 px-4 text-sm text-gray-500 bg-white/70 backdrop-blur-sm">
            welcome back !
          </span>
        </div>
        {/* Social Sign-in Buttons */}
        {/* Registration Link (Moved to bottom and restyled) */}
        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
