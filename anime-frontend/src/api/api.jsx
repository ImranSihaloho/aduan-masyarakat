import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5130/api',
  headers: {
    'Content-Type': 'application/json',
  }
});


export const registerUser = (userData) => api.post('/Auth/register', userData);
export const loginUser = (userData) => api.post('/Auth/login', userData);
export const getAnimeList = () => api.get('/Anime');
export const getAnimeDetail = (id) => api.get(`/Anime/${id}`);

export default api;