import axios from 'axios';

// Create a central Axios instance
const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://observability-demo.onrender.com' // Production URL
        : 'http://localhost:5000', // Local development URL
});

export default api; 