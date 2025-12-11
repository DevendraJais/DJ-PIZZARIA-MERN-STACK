import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?._id) return { items: [] };
    
    const cartKey = `cart_${user._id}`;
    const storedCart = localStorage.getItem(cartKey);
    if (!storedCart) return { items: [] };
    
    const items = JSON.parse(storedCart);
    // Ensure all items have valid price and quantity, support both qty and quantity
    const validItems = Array.isArray(items) ? items.map(item => ({
      ...item,
      id: item.id || item.productId,
      price: parseFloat(item.price) || 0,
      quantity: Math.max(1, parseInt(item.quantity || item.qty, 10) || 1),
      qty: Math.max(1, parseInt(item.quantity || item.qty, 10) || 1)
    })) : [];
    
    return { items: validItems };
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage and dispatch event
const saveCartToStorage = (items) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?._id) return;
    
    const cartKey = `cart_${user._id}`;
    localStorage.setItem(cartKey, JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1, ...rest } = action.payload;
      const existing = state.items.find(i => i.id === id);
      
      if (existing) {
        existing.quantity = Math.max(1, existing.quantity + (parseInt(quantity, 10) || 1));
        existing.qty = existing.quantity; // Sync both
      } else {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        state.items.push({ 
          ...rest, 
          id,
          quantity: qty,
          qty: qty, // Keep both for compatibility
          price: parseFloat(rest.price) || 0
        });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        item.quantity = qty;
        item.qty = qty; // Sync both
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => { 
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = state => state.cart.items || [];
export const selectCartTotal = state => state.cart.items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0), 0);

export default cartSlice.reducer;
