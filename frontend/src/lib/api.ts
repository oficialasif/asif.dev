import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/asif/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Auth
    auth: {
        login: (email: string, password: string) =>
            apiClient.post('/auth/login', { email, password }),
        logout: () => apiClient.post('/auth/logout'),
        getMe: () => apiClient.get('/auth/me'),
        refreshToken: (refreshToken: string) =>
            apiClient.post('/auth/refresh', { refreshToken }),
    },

    // Profile
    profile: {
        get: () => apiClient.get('/profile'),
        update: (data: FormData) =>
            apiClient.put('/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    },

    // Projects
    projects: {
        getAll: (params?: any) => apiClient.get('/projects', { params }),
        getById: (id: string) => apiClient.get(`/projects/${id}`),
        create: (data: FormData) =>
            apiClient.post('/projects', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        update: (id: string, data: FormData) =>
            apiClient.put(`/projects/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        delete: (id: string) => apiClient.delete(`/projects/${id}`),
    },

    // Gallery
    gallery: {
        getAll: (params?: any) => apiClient.get('/gallery', { params }),
        upload: (data: FormData) =>
            apiClient.post('/gallery', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        update: (id: string, data: any) => apiClient.put(`/gallery/${id}`, data),
        delete: (id: string) => apiClient.delete(`/gallery/${id}`),
    },

    // Music
    music: {
        getAll: () => apiClient.get('/music'),
        create: (data: any) => apiClient.post('/music', data),
        update: (id: string, data: any) => apiClient.put(`/music/${id}`, data),
        delete: (id: string) => apiClient.delete(`/music/${id}`),
    },

    // Interests
    interests: {
        getAll: () => apiClient.get('/interests'),
        create: (data: any) => apiClient.post('/interests', data),
        update: (id: string, data: any) => apiClient.put(`/interests/${id}`, data),
        delete: (id: string) => apiClient.delete(`/interests/${id}`),
    },

    // Theme
    theme: {
        get: () => apiClient.get('/theme'),
        update: (data: any) => {
            const isFormData = data instanceof FormData;
            return apiClient.put('/theme', data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
            });
        },
        reset: () => apiClient.post('/theme/reset'),
    },

    // Settings
    settings: {
        get: () => apiClient.get('/settings'),
        update: (data: any) => apiClient.put('/settings', data),
    },

    // Stats
    stats: {
        getOverview: () => apiClient.get('/stats/overview'),
        getAnalytics: () => apiClient.get('/stats/analytics'),
    },

    // Blog
    blog: {
        getAll: (params?: any) => apiClient.get('/blog', { params }),
        getById: (id: string) => apiClient.get(`/blog/${id}`),
        create: (data: any) => apiClient.post('/blog', data),
        update: (id: string, data: any) => apiClient.put(`/blog/${id}`, data),
        delete: (id: string) => apiClient.delete(`/blog/${id}`),
    },

    // Notices
    notices: {
        getAll: () => apiClient.get('/notices'),
        create: (data: any) => apiClient.post('/notices', data),
        delete: (id: string) => apiClient.delete(`/notices/${id}`),
    },

};

export default apiClient;
