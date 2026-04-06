import axios from 'axios';

// Bazowy URL FastAPI
const API_URL = 'http://localhost:8000';

// Instancja axios z konfiguracją
const api = axios.create({
  baseURL: API_URL,
});

// Funkcje do pobierania danych z API
export const fetchPrice = () => api.get('/price');
export const fetchNews = () => api.get('/news');
export const fetchPriceHistory = (period = '1d', interval = '1m') =>
  api.get(`/price_history?period=${period}&interval=${interval}`);

export default api;

