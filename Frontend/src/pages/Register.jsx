import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^a-zA-Z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Backend API call
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        try { window.dispatchEvent(new Event('userUpdated')); } catch (e) {}
        if (data.voucher) {
          localStorage.setItem('voucher', JSON.stringify(data.voucher));
          setVoucher(data.voucher);
          setIsLoading(false);
          // Popup stays visible until user closes it (user must click a button)
        } else {
          setIsLoading(false);
          navigate('/');
        }
      } else {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Connection error. Is the backend running?');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#ef4444';
    if (passwordStrength < 50) return '#f97316';
    if (passwordStrength < 75) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="auth-container register-container">
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
            {/* <span className="pizza-emoji">🎉</span> */}
            {/* <img width="140px" src='../public/logo/Untitled_design__3_-removebg-preview.png'></img> */}
            <img className="pizza-emoji" width="70px" src="/logo/FullLogo_Transparent_NoBuffer__2_-removebg-preview.png"></img>

          </motion.div>
          <h2>Join DJ-Pizzaria!</h2>
          <p>Create your account today and start enjoying fresh, hot pizza with exclusive member benefits.</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span>Welcome Bonus</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Quick Orders</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>Loyalty Program</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <span>Special Offers</span>
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
            <h1>Create Account</h1>
            <p>Join our pizza community</p>
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
            {/* Name Field */}
            <motion.div 
              className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  placeholder="John Doe"
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div 
              className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div 
              className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                  placeholder="9876543210"
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
                <span className="input-icon">🔐</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <motion.div 
                      className="strength-fill"
                      style={{ 
                        backgroundColor: getPasswordStrengthColor(),
                        width: `${passwordStrength}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                    {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div 
              className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}
              variants={itemVariants}
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">✓</span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div className="form-options" variants={itemVariants}>
              <label className="checkbox">
                <input type="checkbox" required />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="btn-arrow">→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.p className="auth-footer" variants={itemVariants}>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Floating Element */}
      <motion.div 
        className="floating-pizza"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🍕
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
              <p className="voucher-type">{voucher.type === 'BOGO' ? 'Buy One Get One Free' : voucher.type}</p>
              <div className="voucher-code">{voucher.code}</div>
              <small>Valid until: {new Date(voucher.expiresAt).toLocaleDateString()}</small>
            </div>
            <div className="voucher-actions">
              <button className="btn-apply" onClick={() => { setVoucher(null); navigate('/cart'); }}>Use Now</button>
              <button className="btn-close" onClick={() => setVoucher(null)}>Maybe Later</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
