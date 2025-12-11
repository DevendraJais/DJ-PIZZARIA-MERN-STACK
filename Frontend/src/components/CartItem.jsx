import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    dispatch(updateQuantity({ 
      id: item.id, 
      quantity: newQuantity 
    }));
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromCart(item.id));
  };

  if (!item) return null;

  return (
    <div className="cart-item">
      <img 
        src={item.image} 
        alt={item.name} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-food.jpg';
        }} 
      />
      <div className="cart-info">
        <h4>{item.name}</h4>
        <p>${(parseFloat(item.price) || 0).toFixed(2)}</p>
      </div>
      <div className="cart-controls">
        <input 
          type="number" 
          min="1" 
          value={item.quantity || 1} 
          onChange={handleQuantityChange}
        />
        <button 
          onClick={handleRemove}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </div>
  );
}