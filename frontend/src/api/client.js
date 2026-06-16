import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchPrice = () => api.get('/price');
export const fetchNews = () => api.get('/news');
export const fetchPriceHistory = (period = '1d', interval = '1m') =>
  api.get(`/price_history?period=${period}&interval=${interval}`);
export const sendChatMessage = (text) => api.post('/chatbot', { text });

export default api;

