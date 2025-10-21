// Simple fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// API utilities
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: 'DELETE' }),
};

// Auth API
export const authApi = {
  signIn: async (credentials: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: any }>('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },
  
  signUp: async (userData: { email: string; password: string; fullName: string }) => {
    const response = await api.post<{ token: string; user: any }>('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },
  
  signOut: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },
  
  resetPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  verifyEmail: async (token: string) => {
    return api.post('/auth/verify-email', { token });
  },
};

// Content API
export const contentApi = {
  getClips: async (filters?: any) => {
    const params = new URLSearchParams(filters);
    return api.get(`/clips?${params}`);
  },
  
  getClip: async (id: string) => {
    return api.get(`/clips/${id}`);
  },
  
  createClip: async (clipData: any) => {
    return api.post('/clips', clipData);
  },
  
  updateClip: async (id: string, updates: any) => {
    return api.put(`/clips/${id}`, updates);
  },
  
  deleteClip: async (id: string) => {
    return api.delete(`/clips/${id}`);
  },
  
  searchClips: async (query: string, filters?: any) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return api.get(`/clips/search?${params}`);
  },
};

// Course API
export const courseApi = {
  getCourses: async () => {
    return api.get('/courses');
  },
  
  getCourse: async (id: string) => {
    return api.get(`/courses/${id}`);
  },
  
  createCourse: async (courseData: any) => {
    return api.post('/courses', courseData);
  },
  
  updateCourse: async (id: string, updates: any) => {
    return api.put(`/courses/${id}`, updates);
  },
  
  deleteCourse: async (id: string) => {
    return api.delete(`/courses/${id}`);
  },
};