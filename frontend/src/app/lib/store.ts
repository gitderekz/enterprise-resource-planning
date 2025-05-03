import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // ✅ adjust path if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other slices here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
