import axios from './axios';

export const register = (userData) => axios.post('/auth/register', userData);
export const login = (credentials) => axios.post('/auth/login', credentials);
export const getProfile = () => axios.get('/auth/me');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};
