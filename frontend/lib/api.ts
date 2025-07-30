// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
    SOCIAL_AUTH: `${API_BASE_URL}/api/social-auth`,
  },
  
  // Donations
  DONATIONS: {
    CREATE: `${API_BASE_URL}/api/donations`,
    LIST: `${API_BASE_URL}/api/donations`,
    MY_DONATIONS: `${API_BASE_URL}/api/donations/my-donations`,
    CLAIM: (id: string) => `${API_BASE_URL}/api/donations/${id}/claim`,
    COMPLETE: (id: string) => `${API_BASE_URL}/api/donations/${id}/complete`,
    MY_PICKUPS: `${API_BASE_URL}/api/donations/my-pickups`,
  },
  
  // Requests
  REQUESTS: {
    CREATE: `${API_BASE_URL}/api/requests`,
    LIST: `${API_BASE_URL}/api/requests`,
    MY_REQUESTS: `${API_BASE_URL}/api/requests/my-requests`,
    FULFILL: (id: string) => `${API_BASE_URL}/api/requests/${id}/fulfill`,
    DELETE: (id: string) => `${API_BASE_URL}/api/requests/${id}`,
  },
  
  // Volunteers
  VOLUNTEERS: {
    LIST: `${API_BASE_URL}/api/volunteers`,
    STATS: `${API_BASE_URL}/api/volunteers/stats`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/volunteers/${id}`,
    UPDATE_AVAILABILITY: (id: string) => `${API_BASE_URL}/api/volunteers/${id}/availability`,
  },
  
  // Health Check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// API Helper Functions
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
}; 