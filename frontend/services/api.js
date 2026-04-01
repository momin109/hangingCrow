// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // backend url
// });

// export default api;

//================================

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get("/auth/me"),
};

export const userAPI = {
  getAll: (filters) => apiClient.get("/users", { params: filters }),
  getById: (id) => apiClient.get(`/users/${id}`),
  getDownline: (userId) => apiClient.get(`/users/${userId}/downline`),
  create: (userData) => apiClient.post("/users", userData),
  update: (id, userData) => apiClient.patch(`/users/${id}`, userData),
  updateBalance: (id, balance) =>
    apiClient.put(`/users/${id}/balance`, { balance }),
};

export const bettingAPI = {
  placeBet: (betData) => apiClient.post("/betting/place", betData),
  getBetHistory: (filters) =>
    apiClient.get("/betting/history", { params: filters }),
  getLiveBets: (filters) => apiClient.get("/betting/live", { params: filters }),
  getBetById: (id) => apiClient.get(`/betting/${id}`),
  settleBet: (id, result) =>
    apiClient.post(`/betting/${id}/settle`, { result }),
};

export const bankingAPI = {
  deposit: (userId, amount, password) =>
    apiClient.post("/payment/deposit", { userId, amount, password }),
  withdraw: (userId, amount, password) =>
    apiClient.post("/payment/withdraw", { userId, amount, password }),
  getBalance: () => apiClient.get("/payment/balance"),
};

export const riskAPI = {
  getTopPlayers: (limit = 10) =>
    apiClient.get("/risk/top-players", { params: { limit } }),
  getExposureAll: () => apiClient.get("/risk/exposure/all"),
  getExposureByMarket: (marketId) =>
    apiClient.get(`/risk/exposure/${marketId}`),
  getHighRiskUsers: () => apiClient.get("/risk/high-risk-users"),
  analyzeBet: (betId) => apiClient.get(`/risk/analyze/${betId}`),
};

export const resultAPI = {
  declare: (payload) => apiClient.post("/result/declare", payload),
  getQueueStats: (payload) => apiClient.post("/result/queue-stats", payload),
};

export default apiClient;
