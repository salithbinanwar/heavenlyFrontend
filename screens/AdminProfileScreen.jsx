import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminProfileScreen = () => {
  const [adminInfo, setAdminInfo] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedAdminInfo = localStorage.getItem('adminInfo')
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo))
    } else {
      setError('Admin not authenticated. Please log in.')
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      }
      await axios.post('/api/users/admin/logout', {}, config) // Assuming a POST route for logout
      localStorage.removeItem('adminInfo')
      setAdminInfo(null)
      navigate('/admin/login')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred during logout',
      )
    }
  }

  const goToDashboard = () => {
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Profile
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {adminInfo ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Admin ID:</span> {adminInfo._id}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Admin Name:</span>{' '}
              {adminInfo.name}
            </p>
            <div className="flex flex-col space-y-4 mt-6">
              <button
                onClick={goToDashboard}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go to Admin Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading admin profile...</p>
        )}
      </div>
    </div>
  )
}

export default AdminProfileScreen
