export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  if (['cart/addToCart', 'cart/removeFromCart', 'cart/updateQuantity', 'cart/clearCart'].includes(action.type)) {
    const state = store.getState();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (user?._id) {
      const cartKey = `cart_${user._id}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart.items));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: cartKey,
        newValue: JSON.stringify(state.cart.items)
      }));
    }
    
    window.dispatchEvent(new Event('cartUpdated'));
  }
  
  return result;
};
