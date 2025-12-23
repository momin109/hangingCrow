import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't expose server error details to UI
        if (error.response) {
            // Server responded with error status
            return Promise.reject({
                message: 'Something went wrong, please try again',
                status: error.response.status,
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'Network error, please check your connection',
            });
        } else {
            return Promise.reject({
                message: 'An unexpected error occurred',
            });
        }
    }
);

export default api;
