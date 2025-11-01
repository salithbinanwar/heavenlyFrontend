import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const AdminAddProductScreen = () => {
  const [productName, setProductName] = useState('')
  const [productImage, setProductImage] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [addProductMessage, setAddProductMessage] = useState('')
  const [error, setError] = useState('') // Added error state for this screen
  const navigate = useNavigate()

  const adminInfo = localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setAddProductMessage('')
    setError('') // Clear previous errors
    if (!adminInfo || !adminInfo.token) {
      setError('Admin not authenticated. Please log in.')
      navigate('/admin/login') // Redirect to login if not authenticated
      return
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo.token}`,
      },
    }
    try {
      const { data } = await axios.post(
        '/api/admin/products',
        {
          name: productName,
          image: productImage,
          price: productPrice,
          category: productCategory,
        },
        config,
      )
      if (data.isSuccess) {
        setAddProductMessage('Product added successfully!')
        setProductName('')
        setProductImage('')
        setProductPrice('')
        setProductCategory('')
        // Optionally navigate back to dashboard or product list after adding
        // navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Failed to add product.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred while adding product.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-500">Fill out the form to add a new product.</p>
      </header>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {addProductMessage && (
        <p className="text-green-500 text-center mb-4">{addProductMessage}</p>
      )}

      <div className="mb-8 p-4 sm:p-6 lg:p-8 bg-white shadow-2xl rounded-xl border border-gray-200 transform transition duration-500 hover:shadow-3xl max-w-7xl mx-auto">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Product Details
        </h3>
        <form
          onSubmit={handleAddProduct}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="productImage"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="text"
              id="productImage"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="productPrice"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="productCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="productCategory"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </form>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-3 my-3 rounded-2xl text-white  bg-blue-400 flex justify-center items-center"
        >
          dashboard
        </button>
      </div>
    </div>
  )
}

export default AdminAddProductScreen
