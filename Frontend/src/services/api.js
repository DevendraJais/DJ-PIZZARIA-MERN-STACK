import { apiRequest } from '../utils/apiRequest';

/**
 * Get authorization header with JWT token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * User Registration
 */
export const register = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    data: userData
  });
};

/**
 * User Login
 */
export const login = (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    data: { email, password }
  });
};

/**
 * Get Current User
 */
export const getCurrentUser = () => {
  return apiRequest('/auth/me', {
    method: 'GET'
  });
};

/**
 * Update User Profile
 */
export const updateProfile = (profileData) => {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    data: profileData
  });
};

/**
 * Change Password
 */
export const changePassword = (currentPassword, newPassword) => {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    data: { currentPassword, newPassword }
  });
};

/**
 * Verify Token
 */
export const verifyToken = () => {
  return apiRequest('/auth/verify', {
    method: 'GET'
  });
};

/**
 * Apply Voucher (validate for current user)
 */
export const applyVoucher = (code) => {
  return apiRequest('/vouchers/apply', {
    method: 'POST',
    data: { code }
  });
};

/**
 * Redeem Voucher (mark as used after payment)
 */
export const redeemVoucher = (code) => {
  return apiRequest('/vouchers/redeem', {
    method: 'POST',
    data: { code }
  });
};

/**
 * Create order (cart) - server will compute totals and handle voucher
 */
export const createOrder = ({ items, voucherCode, paymentMethod = 'test', idempotencyKey }) => {
  return apiRequest('/orders', {
    method: 'POST',
    data: { items, voucherCode, paymentMethod, idempotencyKey }
  });
};

/**
 * Get All Users (Admin)
 */
export const getAllUsers = () => {
  return apiRequest('/users', {
    method: 'GET'
  });
};

/**
 * Get User by ID
 */
export const getUserById = (userId) => {
  return apiRequest(`/users/${userId}`, {
    method: 'GET'
  });
};

/**
 * Logout (Client-side)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  verifyToken,
  getAllUsers,
  getUserById,
  logout,
  applyVoucher,
  redeemVoucher,
  createOrder,
  getAuthHeader
};
