import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null, // Parse user from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user || null; // Store user from payload
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token'); // Remove token from localStorage on logout
      localStorage.removeItem('user'); // Remove user from localStorage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
