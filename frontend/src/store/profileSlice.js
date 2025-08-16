'use client';

import { createSlice } from '@reduxjs/toolkit';

const loadProfileFromStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const serializedProfile = localStorage.getItem('profile');
    return serializedProfile ? JSON.parse(serializedProfile) : null;
  } catch (e) {
    console.error("Failed to load profile", e);
    return null;
  }
};

const initialState = {
  user: loadProfileFromStorage(),
  status: 'idle',
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.user = {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        displayName: action.payload.displayName,
        userName: action.payload.userName,
        email: action.payload.email,
      };
      localStorage.setItem('profile', JSON.stringify(state.user));
    },
    clearProfile: (state) => {
      state.user = null;
      localStorage.removeItem('profile');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        };
        localStorage.setItem('profile', JSON.stringify(state.user));
      }
    }
  }
});

// Export the reducer as default
export default profileSlice.reducer;

// Named exports
export const { setProfile, clearProfile, updateProfile } = profileSlice.actions;
export const selectCurrentUser = (state) => state.profile.user;