import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStores = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/stores`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createStore = async (storeData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/stores`, storeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteStore = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/stores/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createRating = async (ratingData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/ratings`, ratingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};