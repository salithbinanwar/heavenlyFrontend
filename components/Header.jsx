import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [adminInfo, setAdminInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo))
    }

    const storedAdminInfo = localStorage.getItem('adminInfo')
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo))
    }
  }, []) // Empty dependency array to run once on mount

  // const handleUserLogout = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${userInfo.token}`,
  //       },
  //     }
  //     await axios.post('/api/users/logout', {}, config)
  //     localStorage.removeItem('userInfo')
  //     setUserInfo(null)
  //     navigate('/login')
  //   } catch (err) {
  //     console.error('User logout failed:', err)
  //     // Optionally display an error message to the user
  //   }
  // }

  // const handleAdminLogout = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${adminInfo.token}`,
  //       },
  //     }
  //     await axios.post('/api/admin/logout', {}, config)
  //     localStorage.removeItem('adminInfo')
  //     setAdminInfo(null)
  //     navigate('/admin/login')
  //   } catch (err) {
  //     console.error('Admin logout failed:', err)
  //     // Optionally display an error message to the admin
  //   }
  // }

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-white to-sky-400 p-4 text-sky-800 shadow-lg backdrop-blur-sm">
      <Link to="/">
        <h1 className="text-4xl">Heavenly</h1>
      </Link>
      <div className="flex items-center">
        {userInfo ? (
          <>
            <span className="mx-3 text-lg font-semibold">
              <Link to="/profile">
                {userInfo.name}({userInfo.roomNumber})
              </Link>
            </span>
            {/* <button
              onClick={handleUserLogout}
              className="mx-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button> */}
          </>
        ) : adminInfo ? (
          <>
            <span className="mx-3 text-lg font-bold uppercase">
              <Link to="/admin/profile">ADMIN</Link>
            </span>
            {/* <button
              onClick={handleAdminLogout}
              className="mx-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Admin Logout
            </button> */}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="mx-3"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="mx-3"
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
