import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const AdminRegisterScreen = () => {
  const [adminName, setAdminName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors

    if (adminPassword !== confirmAdminPassword) {
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
        '/api/users/admin/register',
        { adminName, adminPassword },
        config,
      )
      // Assuming the backend returns a success indicator and token
      if (data.isSuccess && data.token) {
        // Store admin info including the token in localStorage
        localStorage.setItem('adminInfo', JSON.stringify(data))
        navigate('/admin/dashboard') // Redirect to admin dashboard after successful registration
      } else {
        setError(
          data.message || 'Admin registration failed or token not received',
        )
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
      <div className="w-full max-w-sm p-8 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl">
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl shadow-lg">
            {/* User Plus Icon for Admin */}
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
          Admin Registration
        </h3>
        <p className="mt-1 text-center text-sm text-gray-500 mb-6">
          Register a new administrator account
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            {/* Name Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 pl-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
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

            {/* Password Input Field */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 pl-10 pr-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
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

            {/* Confirm Password Input Field */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 pl-10 pr-10 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
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
          <span className="relative z-10 px-4 text-sm text-gray-500 bg-white/70 backdrop-blur-sm">
            Or register as a user
          </span>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <Link
            to="/admin-login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Already have an admin account? Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminRegisterScreen
