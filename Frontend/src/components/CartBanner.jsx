import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectCartItems } from '../store/cartSlice';

export default function CartBanner() {
  const items = useSelector(selectCartItems);
  
  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
  
  // Don't render if cart is empty
  if (itemCount === 0) {
    return null;
  }

  return (
    <NavLink
      to="/cart"
      className="cart-bottom-banner"
    >
      <span className="cart-bottom-text">🛒 {itemCount} item{itemCount !== 1 ? 's' : ''} in cart</span>
      <span className="cart-bottom-action">View cart</span>
    </NavLink>
  );
}