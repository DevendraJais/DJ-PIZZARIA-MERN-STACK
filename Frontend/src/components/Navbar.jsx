import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, clearCart } from '../store/cartSlice';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const items = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user data
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);
  }, []);

  // Toggle body scroll when mobile menu is open/closed
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.mobile-menu-container');
      const button = document.querySelector('.mobile-menu-button');
      
      if (isMobileMenuOpen && menu && button && 
          !menu.contains(event.target) && 
          !button.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      // Close menu on scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    console.log('Toggling menu. Current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu and navigate
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <div className="nav-left">
          <NavLink to="/" className="brand" onClick={closeMobileMenu}>
            {/* DJ‑Pizzaria */}
            <img src='../public/logo/FullLogo_Transparent_NoBuffer.png'></img>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-right">
          <NavLink to="/menu" className={({isActive}) => isActive ? 'active' : ''}>
            Menu
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>
            About
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>
            Contact
          </NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? 'active' : ''}>
            Cart {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </NavLink>
          <div className="auth-nav-buttons">
            {user ? (
              <div className="user-menu">
                <span className="user-name">👤 {user.name || user.email}</span>
                <button 
                  className="auth-btn logout-btn"
                  onClick={() => {
                    const uid = user._id;
                    // Clear Redux cart and local storage cart for this user
                    try { dispatch(clearCart()); } catch (e) {}
                    localStorage.removeItem(`cart_${uid}`);
                    localStorage.removeItem('appliedVoucher');
                    // Clear auth-related storage
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('voucher');
                    setUser(null);
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="auth-btn login-btn">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="auth-btn register-btn">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button style={{backgroundColor:"#ff4d4f"}}
          className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Sticky bottom cart banner, visible only when there are actual items in cart */}
      {/* {items.length > 0 && (
        <NavLink
          to="/cart"
          className="cart-bottom-banner"
          onClick={closeMobileMenu}
        >
          <span className="cart-bottom-text">🛒 {count} item{count > 1 ? 's' : ''} in cart</span>
          <span className="cart-bottom-action">View cart</span>
        </NavLink>
      )} */}

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu">
          {/* Cart Button for Mobile */}
          <NavLink 
            to="/cart" 
            className="mobile-cart-button"
            onClick={closeMobileMenu}
          >
            <span>Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
          
          <NavLink 
            to="/menu" 
            className={({isActive}) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavigation}
            style={{ color: 'white' }}
          >
            🍕 Menu
          </NavLink>
          <NavLink 
            to="/about" 
            className={({isActive}) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavigation}
            style={{ color: 'white' }}
          >
            ℹ️ About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({isActive}) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavigation}
            style={{ color: 'white' }}
          >
            📞 Contact
          </NavLink>
          {/* Mobile Auth Buttons */}
          <div className="mobile-auth-buttons">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-name">👤 {user.name || user.email}</span>
                </div>
                <button 
                  className="mobile-auth-btn logout-btn"
                  onClick={() => {
                    const uid = user._id;
                    // Clear Redux cart and local storage cart for this user
                    try { dispatch(clearCart()); } catch (e) {}
                    localStorage.removeItem(`cart_${uid}`);
                    localStorage.removeItem('appliedVoucher');
                    // Clear auth-related storage
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('voucher');
                    setUser(null);
                    closeMobileMenu();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="mobile-auth-btn login-btn"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="mobile-auth-btn register-btn"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
