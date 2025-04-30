import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // adjust to your actual path

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other slices here
  },
});

export type RootState = ReturnType<typeof store.getState>; // 👈 Export RootState
export type AppDispatch = typeof store.dispatch;

export default store;
