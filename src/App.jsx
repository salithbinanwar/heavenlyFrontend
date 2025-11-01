import { Route, Routes } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import AdminAddProductScreen from '../screens/AdminAddProductScreen.jsx'
import AdminDashboardScreen from '../screens/AdminDashboardScreen.jsx'
import AdminLoginScreen from '../screens/AdminLoginScreen.jsx'
import AdminProfileScreen from '../screens/AdminProfileScreen.jsx' // New import
import AdminRegisterScreen from '../screens/AdminRegisterScreen.jsx'
import HomeScreen from '../screens/HomeScreen.jsx'
import LoginScreen from '../screens/LoginScreen.jsx'
import ProfileScreen from '../screens/ProfileScreen.jsx'
import RegisterScreen from '../screens/RegisterScreen.jsx'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<HomeScreen />}
          />
          <Route
            path="/login"
            element={<LoginScreen />}
          />
          <Route
            path="/register"
            element={<RegisterScreen />}
          />
          <Route
            path="/profile"
            element={<ProfileScreen />}
          />
          <Route
            path="/admin/register"
            element={<AdminRegisterScreen />}
          />
          <Route
            path="/admin/login"
            element={<AdminLoginScreen />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboardScreen />}
          />
          <Route
            path="/admin/add-product"
            element={<AdminAddProductScreen />}
          />
          <Route
            path="/admin/profile"
            element={<AdminProfileScreen />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
