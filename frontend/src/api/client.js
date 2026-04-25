import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchPrice = () => api.get('/price');
export const fetchNews = () => api.get('/news');
export const fetchPriceHistory = (period = '1d', interval = '1m') =>
  api.get(`/price_history?period=${period}&interval=${interval}`);

export default api;

