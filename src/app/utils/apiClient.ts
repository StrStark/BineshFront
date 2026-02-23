// API Client with automatic token refresh

import { authApi } from './auth';

const API_BASE_URL = 'https://panel.bineshafzar.ir/api';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Enhanced fetch with automatic token refresh on 401 errors
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Add authorization header if token exists
  const accessToken = authApi.getAccessToken();
  
  const headers: HeadersInit = {
    'accept': 'application/json;odata.metadata=minimal;odata.streaming=true',
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Check both HTTP status and response body for 401
  let needsRefresh = false;
  
  if (response.status === 401) {
    needsRefresh = true;
  } else if (response.ok) {
    // Clone response to check body without consuming it
    try {
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      if (data.code === 401) {
        needsRefresh = true;
      }
    } catch (e) {
      // If parsing fails, continue with original response
    }
  }

  // If 401 (unauthorized), try to refresh the token
  if (needsRefresh) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        console.log('🔄 Token expired, refreshing...');
        // Attempt to refresh the token
        await authApi.refreshAccessToken();
        const newAccessToken = authApi.getAccessToken();

        if (newAccessToken) {
          console.log('✅ Token refreshed successfully');
          // Notify all subscribers
          onTokenRefreshed(newAccessToken);
        }

        isRefreshing = false;

        // Retry the original request with new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        isRefreshing = false;
        
        // If refresh fails, logout and let AuthContext handle redirect
        authApi.logout();
        
        throw new Error('Authentication failed - session expired');
      }
    } else {
      // If already refreshing, wait for the new token
      console.log('⏳ Waiting for token refresh...');
      const newAccessToken = await new Promise<string>((resolve) => {
        subscribeTokenRefresh((token) => {
          resolve(token);
        });
      });

      // Retry the original request with new token
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

/**
 * Wrapper for GET requests
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Wrapper for POST requests
 */
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  const response = await apiFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Wrapper for PUT requests
 */
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  const response = await apiFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Wrapper for DELETE requests
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}