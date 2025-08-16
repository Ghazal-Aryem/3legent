'use client';
import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  if (typeof window === 'undefined') {
    return { items: [] };
  }
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : { items: [] };
  } catch (e) {
    console.error('Failed to load cart', e);
    return { items: [] };
  }
};

const saveCartToStorage = (cartState) => {
  try {
    const serializedCart = JSON.stringify(cartState);
    localStorage.setItem('cart', serializedCart);
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.color === action.payload.color
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, color, quantity } = action.payload;
      const item = state.items.find(item => item.id === id && item.color === color);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const { id, color } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.color === color));
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;