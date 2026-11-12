import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('access_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      console.log("slice",token);
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Store in local storage for persistence
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    // Naya Reducer: Sirf user update karne ke liye (Profile Update)
    setUser: (state, action) => {
      state.user = action.payload; // Naya user data jo backend se aaya
      localStorage.setItem('user', JSON.stringify(action.payload)); // LocalStorage sync
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout,setUser } = authSlice.actions;
export default authSlice.reducer;