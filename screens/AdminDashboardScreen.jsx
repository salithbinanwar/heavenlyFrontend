import axios from 'axios'
import { CheckCircle, Clock, Trash2 } from 'lucide-react' // Added Trash2 icon
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const AdminDashboardScreen = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [totalSales, setTotalSales] = useState(0) // New state for total sales
  let navigate = useNavigate()

  const adminInfo = localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null

  useEffect(() => {
    if (!adminInfo || !adminInfo.token) {
      navigate('/admin/login')
      setError('Admin not authenticated. Please log in.')
      return
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo.token}`,
      },
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders', config)
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setOrders(sortedOrders)

        // Calculate total sales from delivered orders
        const sales = sortedOrders.reduce((acc, order) => {
          if (order.isDelivered) {
            return (
              acc +
              order.orderItems.reduce(
                (itemAcc, item) => itemAcc + item.price * item.qty,
                0,
              )
            )
          }
          return acc
        }, 0)
        setTotalSales(sales.toFixed(2))
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch orders',
        )
      }
    }

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

    fetchOrders()
    fetchProducts()
  }, [adminInfo, navigate])

  const handleDeliverOrder = async (orderId) => {
    if (!adminInfo || !adminInfo.token) {
      setError('Admin not authenticated. Please log in.')
      return
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo.token}`,
      },
    }
    try {
      await axios.put(`/api/orders/${orderId}/deliver`, {}, config)
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                isDelivered: true,
                deliveredAt: new Date().toISOString(),
                isCancelled: false,
                cancelledAt: null,
              }
            : order,
        ),
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update order status',
      )
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!adminInfo || !adminInfo.token) {
      setError('Admin not authenticated. Please log in.')
      return
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo.token}`,
      },
    }
    try {
      const { data: updatedOrder } = await axios.put(
        `/api/orders/${orderId}/cancel`,
        {},
        config,
      )
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order)),
      )
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to cancel order',
      )
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }
    if (!adminInfo || !adminInfo.token) {
      setError('Admin not authenticated. Please log in.')
      return
    }
    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
    }
    try {
      await axios.delete(`/api/admin/products/${productId}`, config)
      setProducts(products.filter((product) => product._id !== productId))
      setError('Product deleted successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete product',
      )
    }
  }

  const calculateTotal = (orderItems) => {
    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    )
    return total.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Manage all incoming orders.</p>
      </header>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* REFACTORED ORDER LIST VIEW */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-2xl rounded-xl border border-gray-200 transform transition duration-500 hover:shadow-3xl max-w-7xl mx-auto mt-8">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          All Orders
        </h3>

        <div className="overflow-x-auto max-h-96 custom-scrollbar">
          {/* Header Grid (Visible on larger screens) */}
          <div className="hidden lg:grid grid-cols-7 gap-4 py-3 px-4 text-xs font-bold text-indigo-600 uppercase border-b-2 border-indigo-100 tracking-wider sticky top-0 bg-white z-10">
            <div className="col-span-1">ID</div>
            <div className="col-span-1">User</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Total</div>

            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Order Items List */}
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-1 lg:grid-cols-7 gap-3 lg:gap-4 py-4 px-2 sm:px-4 bg-white hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:shadow-md rounded-lg mb-2 lg:mb-0 border-b lg:border-none"
              >
                {/* 1. ID */}
                <div className="lg:col-span-1 text-sm font-semibold text-gray-900 truncate">
                  <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                    Order ID:
                  </span>
                  {order._id}
                </div>

                {/* 2. User */}
                <div className="lg:col-span-1 text-sm text-gray-600">
                  <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                    User:
                  </span>
                  {order.user?.name || 'N/A'}({order?.roomNumber || 'N/A'})
                </div>

                {/* 3. Date */}
                <div className="lg:col-span-1 text-sm text-gray-600">
                  <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                    Date Placed:
                  </span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>

                {/* 4. Total */}
                <div className="lg:col-span-1 text-sm font-bold text-gray-900">
                  <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                    Total:
                  </span>
                  ¥{calculateTotal(order.orderItems)}
                </div>

                {/* 5. Status */}
                <div className="lg:col-span-1 text-sm">
                  <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                    Status:
                  </span>
                  {order.isDelivered ? (
                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 transition duration-150 shadow-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Delivered
                    </span>
                  ) : order.isCancelled ? (
                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-800 transition duration-150 shadow-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800 transition duration-150 shadow-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  )}
                </div>

                {/* 6. Actions */}
                <div className="lg:col-span-2 text-sm font-medium pt-2 lg:pt-0 lg:text-right flex lg:block justify-end space-x-2">
                  {!order.isDelivered && !order.isCancelled && (
                    <>
                      <button
                        onClick={() => handleDeliverOrder(order._id)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-[1.03] transition duration-200 ease-in-out"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:scale-[1.03] transition duration-200 ease-in-out"
                      >
                        Reject Order
                      </button>
                    </>
                  )}
                  {(order.isDelivered || order.isCancelled) && (
                    <span className="text-gray-400 text-sm italic py-2">
                      No action needed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Total Sales Information */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-2xl rounded-xl border border-gray-200 transform transition duration-500 hover:shadow-3xl max-w-7xl mx-auto mt-8">
        <h3 className="text-3xl text-center font-extrabold text-gray-900 mb-6  pb-4">
          Total Sales
        </h3>
        <p className="text-5xl font-bold text-green-600 text-center">
          ¥{totalSales}
        </p>
      </div>

      {/* END REFACTORED ORDER LIST VIEW */}

      {/* Products Section */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-2xl rounded-xl border border-gray-200 transform transition duration-500 hover:shadow-3xl max-w-7xl mx-auto mt-8">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          All Products
        </h3>
        {
          <div className="overflow-x-auto">
            {/* Header Grid (Visible on larger screens) */}
            <div className="hidden lg:grid grid-cols-5 gap-4 py-3 px-4 text-xs font-bold text-indigo-600 uppercase border-b-2 border-indigo-100 tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-1">Name</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Product Items List */}
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4 py-4 px-2 sm:px-4 bg-white hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:shadow-md rounded-lg mb-2 lg:mb-0 border-b lg:border-none"
                >
                  {/* 1. ID */}
                  <div className="lg:col-span-1 text-sm font-semibold text-gray-900 truncate">
                    <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                      Product ID:
                    </span>
                    {product._id}
                  </div>

                  {/* 2. Name */}
                  <div className="lg:col-span-1 text-sm text-gray-600">
                    <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                      Name:
                    </span>
                    {product.name}
                  </div>

                  {/* 3. Category */}
                  <div className="lg:col-span-1 text-sm text-gray-600">
                    <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                      Category:
                    </span>
                    {product.category}
                  </div>

                  {/* 4. Price */}
                  <div className="lg:col-span-1 text-sm font-bold text-gray-900">
                    <span className="lg:hidden text-xs font-medium uppercase text-gray-500 block mb-1">
                      Price:
                    </span>
                    ¥{product.price.toFixed(2)}
                  </div>

                  {/* 5. Actions */}
                  <div className="lg:col-span-1 text-sm font-medium pt-2 lg:pt-0 lg:text-right flex lg:block justify-end">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:scale-[1.03] transition duration-200 ease-in-out"
                    >
                      <Trash2 className="w-4 h-4 inline-block mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>

      <div className="text-center m-6">
        <button
          onClick={() => navigate('/admin/add-product')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          Add New Product
        </button>
      </div>
    </div>
  )
}

export default AdminDashboardScreen
