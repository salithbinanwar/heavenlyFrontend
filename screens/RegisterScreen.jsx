import axios from 'axios'
import { House } from 'lucide-react'
import { useState } from 'react'
import { CiHeart } from 'react-icons/ci'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate and Link from react-router-dom

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('') // Add error state

  const navigate = useNavigate() // Initialize useNavigate

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/users', // API endpoint for user registration
        { name, roomNumber, password },
        config,
      )
      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data)) // Store user info
        navigate('/profile') // Redirect to user profile
      } else {
        setError('User registration failed.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred during registration',
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
      <div
        className="w-full max-w-sm p-8 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl"
        style={{
          // Subtle shadow and large rounded corners from the image
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl shadow-lg">
            {/* User Plus Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        {/* Title and Subtitle */}
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Create a new account
        </h3>
        <p className="mt-1 text-center text-sm text-gray-500 mb-6">
          Join us to bring your words, data, and teams together. For free
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{' '}
        {/* Display error message */}
        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            {/* Name Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 pl-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <IconedInput>
                {/* User Icon */}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </IconedInput>
            </div>

            {/* Room Number Input Field */}
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
                {/* House Icon */}
                <House />
              </IconedInput>
            </div>

            {/* Password Input Field */}
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
            </div>

            {/* Confirm Password Input Field */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 pl-10 pr-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>

            {/* Register Button */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="px-6 py-2 font-semibold text-white transition duration-200 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-800/50"
              >
                Register
              </button>
            </div>
          </div>
        </form>
        {/* Separator */}
        <div className="relative flex items-center justify-center py-5">
          <div className="absolute top-1/2 w-full h-px bg-gray-200"></div>
          <span className="relative z-10 px-4 text-sm text-gray-500 bg-white/70 backdrop-blur-sm flex items-center">
            thanks for using this website <CiHeart />
          </span>
        </div>
        {/* Social Sign-in Buttons */}
        {/* Login Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen
