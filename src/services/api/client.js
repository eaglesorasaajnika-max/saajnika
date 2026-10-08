/**
 * Saajnika Centralized HTTP API Client
 * Configured for Django REST Framework with SimpleJWT and X-Cart-Session headers.
 */

import { storage } from '../../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  // Attach JWT Access Token if available
  const tokens = storage.get('saajnika_tokens', null);
  if (tokens?.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }

  // Attach Guest Cart Session Key
  const guestCartSession = storage.get('saajnika_cart_session', null);
  if (guestCartSession) {
    headers['X-Cart-Session'] = guestCartSession;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized token expiry
    if (response.status === 401 && tokens?.refresh && !options._isRetry) {
      const refreshed = await tryRefreshToken(tokens.refresh);
      if (refreshed) {
        return request(endpoint, { ...options, _isRetry: true });
      } else {
        // Token expired & refresh failed; clear session
        storage.remove('saajnika_tokens');
        storage.remove('saajnika_user');
      }
    }

    // Parse Response
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Network connection failed', 0, null);
  }
}

async function tryRefreshToken(refreshToken) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (res.ok) {
      const data = await res.json();
      const existing = storage.get('saajnika_tokens', {});
      storage.set('saajnika_tokens', { ...existing, access: data.access });
      return true;
    }
  } catch (e) {
    console.warn('Failed to refresh JWT token:', e);
  }
  return false;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: (endpoint, body, options) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};
