const API_BASE_URL = 'http://localhost:5000/api';
const TIMEOUT = 10000; // 10 seconds

export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', data, headers = {}, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  // Get auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set default headers
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    signal: controller.signal,
    ...(method !== 'GET' && data && { body: JSON.stringify(data) }),
    ...rest,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  }
};
