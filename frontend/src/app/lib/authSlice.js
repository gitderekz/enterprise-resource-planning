import { createSlice } from '@reduxjs/toolkit';
const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }

  return {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
// *********************************


// import { createSlice } from '@reduxjs/toolkit';

// // Initial state setup that will be updated on the client-side
// const initialState = {
//   isAuthenticated: false,
//   token: null,
//   user: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isAuthenticated = true;
//       state.token = action.payload.token;
//       state.user = action.payload.user || null;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.token = null;
//       state.user = null;
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
// // *************************************

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
//   token: localStorage.getItem('token') || null,
//   user: JSON.parse(localStorage.getItem('user')) || null, // Parse user from localStorage
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isAuthenticated = true;
//       state.token = action.payload.token;
//       state.user = action.payload.user || null; // Store user from payload
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem('token'); // Remove token from localStorage on logout
//       localStorage.removeItem('user'); // Remove user from localStorage on logout
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
