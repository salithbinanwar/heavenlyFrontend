import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate

const HomeScreen = () => {
  const [products, setProducts] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState('') // Add error state
  const [orderMessage, setOrderMessage] = useState('') // Add order message state
  const [cartItems, setCartItems] = useState([]) // New state for cart items
  const [showNotification, setShowNotification] = useState(false) // New state for notification
  const [notificationMessage, setNotificationMessage] = useState('') // New state for notification message
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false) // New state for loading
  const navigate = useNavigate() // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products')
        setProducts(data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch products',
        )
      }
    }
    fetchProducts()

    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo))
    }
  }, [])

  const addToCart = (product) => {
    if (!userInfo || !userInfo.token) {
      setError('Please log in to add products to cart.')
      navigate('/login')
      return
    }

    setCartItems((prevCartItems) => {
      const existItem = prevCartItems.find(
        (item) => item.product === product._id,
      )

      if (existItem) {
        return prevCartItems.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item,
        )
      } else {
        return [
          ...prevCartItems,
          {
            name: product.name,
            qty: 1,
            image: product.image,
            price: product.price,
            category: product.category,
            product: product._id,
          },
        ]
      }
    })
    setOrderMessage(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId) => {
    setCartItems((prevCartItems) => {
      const existItem = prevCartItems.find((item) => item.product === productId)

      if (existItem && existItem.qty > 1) {
        return prevCartItems.map((item) =>
          item.product === productId ? { ...item, qty: item.qty - 1 } : item,
        )
      } else {
        return prevCartItems.filter((item) => item.product !== productId)
      }
    })
  }

  const placeOrder = async () => {
    setOrderMessage('')
    setError('')

    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setPlaceOrderLoading(true) // Set loading to true
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          roomNumber: userInfo.roomNumber,
          agreedToPayOnDelivery: false,
        },
        config,
      )
      if (data) {
        setNotificationMessage('Order placed successfully!')
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
          setNotificationMessage('')
        }, 3000)
        setCartItems([]) // Clear cart after placing order
        navigate('/profile') // Redirect to profile after order
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to place order',
      )
    } finally {
      setPlaceOrderLoading(false) // Set loading to false
    }
  }

  return (
    <div className="container mx-auto p-4">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {notificationMessage}
        </div>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {orderMessage && (
        <p className="text-green-500 text-center mb-4">{orderMessage}</p>
      )}

      {userInfo ? (
        <h1 className="text-sm font-bold m-6 text-center animate-bounce">
          welcome to Heavenly !!{' '}
        </h1>
      ) : (
        <h1 className="text-sm font-bold m-6 text-center animate-bounce text-red-500">
          Please log in to add products to your cart.
        </h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cartItems.find(
            (item) => item.product === product._id,
          )
          const quantity = cartItem ? cartItem.qty : 0
          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl  shadow-2xl overflow-hidden py-10"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-auto h-56 object-contain mx-auto block"
              />
              <div className="p-4">
                <h3 className="text-3xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 font-bold text-4xl ">
                    ¥{product.price}
                  </p>
                  <div className="flex items-center space-x-2">
                    {quantity > 0 && (
                      <>
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold">
                          {quantity}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      disabled={!userInfo}
                    >
                      {quantity > 0 ? '+' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <p className="text-lg font-semibold">
            Total items in cart:{' '}
            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
          </p>
          <button
            onClick={placeOrder}
            disabled={cartItems.length === 0 || placeOrderLoading}
            className="bg-white text-green-600 py-2 px-4 rounded-md font-semibold hover:bg-gray-100"
          >
            {placeOrderLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-green-600 mx-auto"
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
              'Place Order'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
