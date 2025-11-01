import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const ADMIN_URL = '/api/users/admin'

const initialState = {
  adminInfo: localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null,
}

export const registerAdmin = createAsyncThunk(
  'adminAuth/registerAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        `${ADMIN_URL}/register`,
        adminData,
        config,
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  },
)

export const loginAdmin = createAsyncThunk(
  'adminAuth/loginAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(`${ADMIN_URL}/login`, adminData, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  },
)

export const logoutAdmin = createAsyncThunk(
  'adminAuth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${ADMIN_URL}/logout`)
      return
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  },
)

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.adminInfo = action.payload
      localStorage.setItem('adminInfo', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.adminInfo = null
      localStorage.removeItem('adminInfo')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.adminInfo = action.payload
        localStorage.setItem('adminInfo', JSON.stringify(action.payload))
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.adminInfo = action.payload
        localStorage.setItem('adminInfo', JSON.stringify(action.payload))
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.adminInfo = null
        localStorage.removeItem('adminInfo')
      })
  },
})

export const { setAdminInfo, logout } = adminAuthSlice.actions

export default adminAuthSlice.reducer
