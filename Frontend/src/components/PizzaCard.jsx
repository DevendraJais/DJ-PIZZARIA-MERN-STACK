import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { addToCart } from '../store/cartSlice';
import './PizzaCarousel.css';


export default function PizzaCard({ pizza }){
const dispatch = useDispatch();
const [selectedPizza, setSelectedPizza] = useState(null);
const [showLoginPopup, setShowLoginPopup] = useState(false);

const [size, setSize] = useState('M');
const [addedMsg, setAddedMsg] = useState('');
const sizePrice = size === 'S' ? pizza.price - 1 : size === 'L' ? pizza.price + 2 : pizza.price;

 // Function to close the modal
  const closeModal = () => setSelectedPizza(null);

// const add = () => {
//   // Get user ID for localStorage key
//   const user = localStorage.getItem('user');
//   let userId = null;
//   if (user) {
//     try {
//       userId = JSON.parse(user)._id;
//     } catch (e) {
//       console.error('Could not parse user:', e);
//     }
//   }

//   // Create cart item
//   const item = { productId: `${pizza.id}-${size}`, name: `${pizza.name} (${size})`, price: sizePrice, qty: 1 };
  
//   // Add to localStorage cart (per-user)
//   if (userId) {
//     const cartKey = `cart_${userId}`;
//     const stored = localStorage.getItem(cartKey);
//     let cartItems = stored ? JSON.parse(stored) : [];
    
//     // Check if item already in cart
//     const existing = cartItems.find(c => c.productId === item.productId);
//     if (existing) {
//       existing.qty += 1;
//     } else {
//       cartItems.push(item);
//     }
    
//     localStorage.setItem(cartKey, JSON.stringify(cartItems));
//     // notify other components (Navbar) that cart changed
//     try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
//   }
  
//   // Show toast message
//   setAddedMsg(`✓ ${pizza.name} (${size}) added to cart`);
//   setTimeout(() => setAddedMsg(''), 2500);
  
//   // Also dispatch to Redux (optional, for future use)
//   dispatch(addToCart({ id: `${pizza.id}-${size}`, name: `${pizza.name} (${size})`, price: sizePrice, image: pizza.image }));
// };

const add = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    setShowLoginPopup(true);
    return;
  }

  setAddedMsg(`✓ ${pizza.name} (${size}) added to cart`);
  setTimeout(() => setAddedMsg(""), 2500);

  dispatch(addToCart({
    id: `${pizza.id}-${size}`,
    name: `${pizza.name} (${size})`,
    price: sizePrice,
    image: pizza.image
  }));
};



return (
<motion.div className="pizza-card" initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.25 }}>
{/* <div className="card-top">
<img
  src={pizza.image}
  alt={pizza.name}
  loading="lazy"
  decoding="async"
  srcSet={`${pizza.image} 1x, ${pizza.image} 2x`}
  sizes="(max-width: 600px) 100vw, 240px"
/>
<div className="pizza-overlay"></div>
</div> */}
<div className="card-top" onClick={() => setSelectedPizza(pizza)} style={{ cursor: "pointer" }}>
  <img
    src={pizza.image}
    alt={pizza.name}
    loading="lazy"
    decoding="async"
    srcSet={`${pizza.image} 1x, ${pizza.image} 2x`}
    sizes="(max-width: 600px) 100vw, 240px"
  />
  <div className="pizza-overlay"></div>
</div>

<div>
<h3 style={{ margin:'8px 0 6px' }}>
  <span className={`diet-indicator ${pizza.veg ? 'veg' : 'nonveg'}`} aria-hidden="true"></span>
  {pizza.name}
</h3>
<p className="muted" style={{ margin:0, fontSize:'.95rem' }}>{pizza.description}</p>
<div className="size-picker" style={{ marginTop:8 }}>
<span className="muted">Size:</span>
<button type="button" className={`size-btn ${size==='S'?'active':''}`} onClick={()=>setSize('S')}>S</button>
<button type="button" className={`size-btn ${size==='M'?'active':''}`} onClick={()=>setSize('M')}>M</button>
<button type="button" className={`size-btn ${size==='L'?'active':''}`} onClick={()=>setSize('L')}>L</button>
</div>
</div>
<div className="pizza-bottom">
<div className="price-badge">₹{sizePrice.toFixed(2)}</div>
<button className="btn" onClick={add}>{addedMsg ? addedMsg : 'Add +'}</button>
</div>
{addedMsg && <div style={{ color:'#4caf50', fontSize:'.9rem', marginTop:'6px', fontWeight:'500', textAlign:'center' }}>{addedMsg}</div>}

{selectedPizza && (
  <div className="pizza-modal" onClick={closeModal}>
    <div className="pizza-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="pizza-modal-close" onClick={closeModal}>×</button>

      <div className="pizza-modal-left">
        <img src={selectedPizza.image} alt={selectedPizza.name} />
      </div>

      <div className="pizza-modal-right">
        <h2>{selectedPizza.name}</h2>
        <p className="modal-desc">{selectedPizza.description}</p>

        <div className="modal-size-selector">
          <span>Select Size:</span>
          <button className={size === 'S' ? "active" : ""} onClick={() => setSize('S')}>Small</button>
          <button className={size === 'M' ? "active" : ""} onClick={() => setSize('M')}>Medium</button>
          <button className={size === 'L' ? "active" : ""} onClick={() => setSize('L')}>Large</button>
        </div>

        <button className="modal-add-btn" onClick={add}>Add to Cart</button>
      </div>
    </div>
  </div>
)}

{showLoginPopup && (
  <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
    <div className="login-popup" onClick={(e) => e.stopPropagation()}>
      <h3>Login Required</h3>
      <p>Please log in to get the latest offers!</p>

      <button
        className="popup-login-btn"
        onClick={() => (window.location.href = "/login")}
      >
        Login
      </button>

      <button
        className="popup-cancel-btn"
        onClick={() => setShowLoginPopup(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}



</motion.div>
);
}
