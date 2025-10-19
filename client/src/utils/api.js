// Centralized API utility for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
    constructor(message, status, response) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }
}

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = true, customHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    if (includeAuth) {
        const token = getAuthToken();
        console.log('====================================');
        console.log(token, "this is token");
        console.log('====================================');
        if (token) {
            headers['Authorization'] = token;
        }
    }

    return headers;
};

// Handle API response
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    let data;
    try {
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            // Try to parse as JSON in case content-type is wrong
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }
        }
    } catch (parseError) {
        console.error('Error parsing response:', parseError);
        data = { error: 'Failed to parse server response' };
    }

    if (!response.ok) {
        const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(
            errorMessage,
            response.status,
            data
        );
    }

    return data;
};

// Generic request function
const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: createHeaders(options.includeAuth !== false, options.headers),
        ...options,
    };

    // Remove custom options that aren't fetch options
    delete config.includeAuth;

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        console.error(`API Request Error [${options.method || 'GET'} ${endpoint}]:`, error);

        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        throw new ApiError(
            'Network error. Please check your connection.',
            0,
            null
        );
    }
};

// HTTP method helpers
export const api = {
    get: (endpoint, options = {}) =>
        request(endpoint, { method: 'GET', ...options }),

    post: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        }),

    put: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        }),

    patch: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...options,
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, { method: 'DELETE', ...options }),
};

// Auth API helpers
export const authApi = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }, { includeAuth: false }),

    register: (userData) =>
        api.post('/auth/register', userData, { includeAuth: false }),

    getProfile: () => api.get('/auth/me'),

    updateProfile: (userData) => api.put('/auth/profile', userData),

    logout: () => api.post('/auth/logout'),
};

// Product API helpers
export const productApi = {
    getAllProducts: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/products${queryString ? `?${queryString}` : ''}`);
    },

    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/products${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => api.get(`/products/${id}`),

    getByCategory: (category) => api.get(`/products/category/${category}`),

    search: (query, filters = {}) => {
        const params = { q: query, ...filters };
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/products/search?${queryString}`);
    },

    getNewArrivals: () => api.get('/products/new-arrivals'),

    getDeals: () => api.get('/products/deals'),

    getSimilar: (id, limit = 10) =>
        api.get(`/products/${id}/similar?limit=${limit}`),
};

// Cart API helpers
export const cartApi = {
    getCart: () => api.get('/cart'),

    addToCart: (productId, quantity = 1) =>
        api.post('/cart', { productId, quantity }),

    updateCartItem: (productId, quantity) =>
        api.put(`/cart/${productId}`, { quantity }),

    removeFromCart: (productId) =>
        api.delete(`/cart/${productId}`),

    clearCart: () => api.delete('/cart/clear'),

    getCartSummary: () => api.get('/cart/summary'),
};

// User API helpers
export const userApi = {
    getFavorites: () => api.get('/user/favorites'),

    addToFavorites: (productId) =>
        api.post('/user/favorites', { productId }),

    removeFromFavorites: (productId) =>
        api.delete(`/user/favorites/${productId}`),

    getOrders: () => api.get('/user/orders'),

    createOrder: (orderData) => api.post('/user/orders', orderData),
};

// Vendor API helpers
export const vendorApi = {
    getProducts: () => api.get('/vendor/products'),

    createProduct: (productData) => api.post('/vendor/products', productData),

    updateProduct: (id, productData) => api.put(`/vendor/products/${id}`, productData),

    deleteProduct: (id) => api.delete(`/vendor/products/${id}`),

    getAnalytics: () => api.get('/vendor/analytics'),

    getOrders: () => api.get('/vendor/orders'),
};

// Admin API helpers
export const adminApi = {
    getUsers: () => api.get('/admin/users'),

    getUser: (id) => api.get(`/admin/users/${id}`),

    updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),

    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    getVendors: () => api.get('/admin/vendors'),

    getProducts: () => api.get('/admin/products'),

    moderateProduct: (id, action) => api.patch(`/admin/products/${id}`, { action }),

    getStats: () => api.get('/admin/stats'),
};

export { ApiError };
export default api;