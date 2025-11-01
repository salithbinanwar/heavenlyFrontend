import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [agreedToPayOnDeliveryStatus, setAgreedToPayOnDeliveryStatus] =
    useState({}) // New state for checkboxes
  const [showNotification, setShowNotification] = useState(false) // New state for notification
  const [notificationMessage, setNotificationMessage] = useState('') // New state for notification message
  const [confirmLoading, setConfirmLoading] = useState(false) // New state for loading

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUserInfo = localStorage.getItem('userInfo')
      if (!storedUserInfo) {
        navigate('/login') // Redirect to login if no user info
        return
      }

      const parsedUserInfo = JSON.parse(storedUserInfo)
      setUserInfo(parsedUserInfo)

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${parsedUserInfo.token}`,
          },
        }
        // Fetch user orders
        const { data: ordersData } = await axios.get(
          '/api/orders/myorders',
          config,
        )
        // Sort orders by createdAt in descending order (latest first)
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setUserOrders(sortedOrders)
        // Initialize checkbox status for each order
        const initialCheckboxStatus = {}
        sortedOrders.forEach((order) => {
          initialCheckboxStatus[order._id] =
            order.agreedToPayOnDelivery || false
        })
        setAgreedToPayOnDeliveryStatus(initialCheckboxStatus)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch user data or orders',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  const handleLogout = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      await axios.post('/api/users/logout', {}, config) // API call to logout
      localStorage.removeItem('userInfo') // Clear user info from local storage
      setUserInfo(null) // Clear user info from state
      navigate('/login') // Redirect to login page
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred during logout',
      )
    }
  }

  const handleCheckboxChange = (orderId) => {
    setAgreedToPayOnDeliveryStatus((prevStatus) => ({
      ...prevStatus,
      [orderId]: !prevStatus[orderId],
    }))
  }

  const handleConfirmOrder = async (orderId) => {
    setError('')
    setConfirmLoading(true) // Set loading to true
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data: updatedOrder } = await axios.put(
        `/api/orders/${orderId}/confirm`,
        {},
        config,
      )
      setUserOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order,
        ),
      )
      setNotificationMessage('Order confirmed successfully! Wait for delivery.')
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
        setNotificationMessage('')
      }, 3000)
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to confirm order',
      )
    } finally {
      setConfirmLoading(false) // Set loading to false
    }
  }

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {notificationMessage}
        </div>
      )}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        User Profile
      </h2>
      {userInfo && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h3>
          <p className="text-gray-600">
            <strong>ID:</strong>
            {userInfo._id}
          </p>
          <p className="text-gray-600">
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p className="text-gray-600">
            <strong>Room</strong> {userInfo.roomNumber}
          </p>
          {/* Add other user info if available */}
          <button
            onClick={handleLogout}
            className=" mt-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Orders</h3>
        {userOrders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-lg shadow-md p-4 flex flex-col"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-gray-600">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    ¥
                    {order.orderItems
                      .reduce((acc, item) => acc + item.price * item.qty, 0)
                      .toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Products:
                  </p>
                  <div className="max-h-40 overflow-y-auto pr-2">
                    {' '}
                    {/* Added scrollbar */}
                    {order.orderItems.map((item) => (
                      <div
                        key={item.product}
                        className="flex items-center mb-2 bg-white p-2 rounded-md shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.qty} | Price: ¥{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Status:{' '}
                    {order.isDelivered ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered on{' '}
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </span>
                    ) : order.isCancelled ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Cancelled
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Pending
                      </span>
                    )}
                  </p>
                  <div className="flex items-center">
                    <p className="text-sm font-semibold text-gray-700 mr-2">
                      Cash on Delivery:
                    </p>
                    {!order.isDelivered &&
                      !order.isCancelled &&
                      !order.agreedToPayOnDelivery && (
                        <input
                          type="checkbox"
                          checked={
                            agreedToPayOnDeliveryStatus[order._id] || false
                          }
                          onChange={() => handleCheckboxChange(order._id)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      )}
                    {(order.isDelivered ||
                      order.isCancelled ||
                      order.agreedToPayOnDelivery) && (
                      <span className="text-sm text-gray-600">
                        {order.agreedToPayOnDelivery ? 'Yes' : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  {!order.isDelivered &&
                    !order.isCancelled &&
                    !order.agreedToPayOnDelivery && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={
                          !agreedToPayOnDeliveryStatus[order._id] ||
                          confirmLoading
                        }
                        className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                          agreedToPayOnDeliveryStatus[order._id]
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {confirmLoading ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          'Confirm Order'
                        )}
                      </button>
                    )}
                  {!order.isDelivered &&
                    !order.isCancelled &&
                    order.agreedToPayOnDelivery && (
                      <span className="text-blue-600 text-sm font-semibold block text-center">
                        Wait for the delivery
                      </span>
                    )}
                  {(order.isDelivered || order.isCancelled) && (
                    <span className="text-gray-400 text-sm italic block text-center">
                      No action needed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileScreen
