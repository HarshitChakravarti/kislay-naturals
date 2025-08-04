import axios from './axios';

export const getProducts = (params = {}) => {
  return axios.get('/products', { params });
};

export const getProductById = (id) => {
  return axios.get(`/products/${id}`);
};

export const createProduct = (productData) => {
  return axios.post('/products', productData);
};

export const updateProduct = (id, productData) => {
  return axios.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return axios.delete(`/products/${id}`);
};
