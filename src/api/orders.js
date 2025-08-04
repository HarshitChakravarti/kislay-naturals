import axios from './axios';

export const createOrder = (orderData) => {
  return axios.post('/orders', orderData);
};

export const getMyOrders = () => {
  return axios.get('/orders/me');
};

export const getOrderById = (id) => {
  return axios.get(`/orders/${id}`);
};

export const getAllOrders = (params = {}) => {
  return axios.get('/orders', { params });
};

export const updateOrderStatus = (id, status) => {
  return axios.put(`/orders/${id}`, { status });
};
