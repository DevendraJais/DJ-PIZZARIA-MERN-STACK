import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend API call
      const response = await fetch('https://dj-pizzaria-mern-stack.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // notify other components (Navbar) in same-tab that user changed
        try { window.dispatchEvent(new Event('userUpdated')); } catch (e) {}
        if (data.voucher) {
          // Save voucher to localStorage and show popup
          localStorage.setItem('voucher', JSON.stringify(data.voucher));
          setVoucher(data.voucher);
          setIsLoading(false);
          // Popup stays visible until user closes it (user must click a button)
        } else {
          setIsLoading(false);
          setTimeout(() => navigate('/'), 200);
        }
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Is the backend running?');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="auth-container login-container">
      {/* Animated Background Elements */}
      <div className="auth-bg-decoration">
        <motion.div 
          className="decoration-circle decoration-1"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="decoration-circle decoration-2"
          animate={{ 
            x: [0, -40, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="decoration-circle decoration-3"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      {/* Left Side - Visual */}
      <motion.div 
        className="auth-visual"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="visual-content">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="pizza-illustration"
          >
            {/* <span className="pizza-emoji">🍕</span> */}
            <img className="pizza-emoji" width="70px" src="/logo/FullLogo_Transparent_NoBuffer__2_-removebg-preview.png"></img>
          </motion.div>
          <h2>Welcome Back!</h2>
          <p>Sign in to your DJ-Pizzaria account and enjoy exclusive offers and fast checkout.</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Fast Checkout</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span>Exclusive Deals</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <span>Order History</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span>Rewards Points</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        className="auth-form-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="auth-form" variants={itemVariants}>
          <motion.div className="form-header" variants={itemVariants}>
            <h1>Sign In</h1>
            <p>Access your account</p>
          </motion.div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            {/* Email Field */}
            <motion.div 
              className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                {/* <span className="input-icon">✉️</span> */}
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                {/* <span className="input-icon">🔐</span> */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div className="form-options" variants={itemVariants}>
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button 
              type="submit"
              className="submit-btn"
              variants={itemVariants}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <span className="loader"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="btn-arrow">→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div className="divider" variants={itemVariants}>
            <span>Or continue with</span>
          </motion.div>

          {/* Social Login */}
          <motion.div className="social-buttons" variants={itemVariants}>
            <button className="social-btn google-btn">
              {/* <span>🔵</span> Google */}Google 
            </button>
            <button className="social-btn facebook-btn">
              {/* <span>📘</span> Facebook */}Facebook
            </button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p className="auth-footer" variants={itemVariants}>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Floating Success Message */}
      <motion.div 
        className="floating-pizza"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🍽️
      </motion.div>

      {/* Voucher Popup */}
      {voucher && (
        <motion.div
          className="voucher-popup"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => { setVoucher(null); }}
        >
          <div className="voucher-card">
            <div className="voucher-header">🎁 Congratulations!</div>
            <div className="voucher-body">
              <h3>You've received a special voucher</h3>
              <p className="voucher-type">{voucher.type === 'BOGO' ? '₹100 off on first order' : voucher.type}</p>
              <div className="voucher-code">{voucher.code}</div>
              <small>Valid until: {new Date(voucher.expiresAt).toLocaleDateString()}</small>
            </div>
            <div className="voucher-actions">
              <button className="btn-apply" onClick={() => { 
                try { localStorage.setItem('voucher', JSON.stringify({ code: voucher.code })); } catch (e) {}
                setVoucher(null); 
                navigate('/'); 
              }}>Use Now</button>
              <button className="btn-close" onClick={() => setVoucher(null)}>Maybe Later</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
