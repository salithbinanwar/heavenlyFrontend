import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminLoginScreen = () => {
  const [adminName, setAdminName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

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
        '/api/admin/login', // Corrected API endpoint
        { adminName, adminPassword },
        config,
      )
      if (data) {
        localStorage.setItem('adminInfo', JSON.stringify(data))
        navigate('/admin/profile') // Redirect to admin profile
      } else {
        setError('Admin login failed.')
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
      <div
        className="w-full max-w-sm p-8 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl shadow-lg">
            {/* Shield Check Icon for Admin */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.003 12.003 0 002.92 12c0 3.072 1.887 5.746 4.66 7.37a14.745 14.745 0 004.479 1.287 14.745 14.745 0 004.479-1.287c2.773-1.624 4.66-4.298 4.66-7.37a12.003 12.003 0 00-1.082-4.056z"
              />
            </svg>
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Admin Login
        </h3>
        <p className="mt-1 text-center text-sm text-gray-500 mb-6">
          Access the administration panel
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            {/* Admin Name Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Admin Name"
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

            {/* Login Button */}
            <div className="flex items-center justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 font-semibold text-white transition duration-200 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-800/50"
              >
                Login
              </button>
            </div>
          </div>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center py-5">
          <div className="absolute top-1/2 w-full h-px bg-gray-200"></div>
          <span className="relative z-10 px-4 text-sm text-gray-500 bg-white/70 backdrop-blur-sm">
            Or login as a user
          </span>
        </div>

        {/* Registration Link (Moved to bottom and restyled) */}
        <div className="text-center mt-6">
          <Link
            to="/admin/register"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Don't have an admin account? Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginScreen
