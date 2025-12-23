import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (username, password) => apiClient.post('/auth/login', { username, password }),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
};

// User Management APIs
export const userAPI = {
    getAll: (filters) => apiClient.get('/users', { params: filters }),
    getById: (id) => apiClient.get(`/users/${id}`),
    getDownline: (userId) => apiClient.get(`/users/${userId}/downline`),
    search: (query) => apiClient.get('/users/search', { params: { q: query } }),
    create: (userData) => apiClient.post('/users', userData),
    update: (id, userData) => apiClient.patch(`/users/${id}`, userData),
    updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status }),
    getBalance: (id) => apiClient.get(`/users/${id}/balance`),
};

// Betting APIs
export const bettingAPI = {
    placeBet: (betData) => apiClient.post('/betting/place', betData),
    getBetHistory: (filters) => apiClient.get('/betting/history', { params: filters }),
    getLiveBets: (filters) => apiClient.get('/betting/live', { params: filters }),
    getBetById: (id) => apiClient.get(`/betting/${id}`),
    settleBet: (id, result) => apiClient.post(`/betting/${id}/settle`, { result }),
};

// Banking/Payment APIs
export const bankingAPI = {
    deposit: (userId, amount, password) => apiClient.post('/payment/deposit', { userId, amount, password }),
    withdraw: (userId, amount, password) => apiClient.post('/payment/withdraw', { userId, amount, password }),
    getTransactionHistory: (filters) => apiClient.get('/payment/history', { params: filters }),
    getUserBanking: (userId) => apiClient.get(`/payment/${userId}/banking`),
    getAllBanking: () => apiClient.get('/payment/banking'),
};

// Risk Management APIs
export const riskAPI = {
    getTopPlayers: (limit = 10) => apiClient.get('/betting/risk/top-players', { params: { limit } }),
    getFancyBets: () => apiClient.get('/betting/risk/fancy'),
    getSportsbookRisk: () => apiClient.get('/betting/risk/sportsbook'),
    getPremiumCricket: () => apiClient.get('/betting/risk/premium-cricket'),
    getExposure: (userId) => apiClient.get(`/betting/risk/exposure/${userId}`),
};

// Sport/Market Settings APIs
export const sportAPI = {
    getAllSports: () => apiClient.get('/betting/sports'),
    toggleSport: (sportId, status) => apiClient.patch(`/betting/sports/${sportId}`, { status }),
    getMarkets: (sportId) => apiClient.get(`/betting/sports/${sportId}/markets`),
};

// Admin Settings APIs
export const adminAPI = {
    changePassword: (oldPassword, newPassword) => apiClient.post('/auth/change-password', { oldPassword, newPassword }),
    searchUsers: (query) => apiClient.get('/users/search', { params: { q: query } }),
    getActiveMatches: () => apiClient.get('/betting/matches/active'),
    getInactiveMatches: () => apiClient.get('/betting/matches/inactive'),
    updateMatchStatus: (matchId, status) => apiClient.patch(`/betting/matches/${matchId}`, { status }),
    updateFancyStatus: (fancyId, status) => apiClient.patch(`/betting/fancy/${fancyId}`, { status }),
    getSuspendedResults: () => apiClient.get('/betting/results/suspended'),
    getInactiveUsers: () => apiClient.get('/users/inactive'),
    getBetLockedUsers: () => apiClient.get('/users/bet-locked'),
};

export default apiClient;
