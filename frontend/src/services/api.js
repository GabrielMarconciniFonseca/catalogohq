import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    Accept: 'application/json',
  },
});

function parseError(error) {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.response?.data?.errors) {
    const [firstError] = Object.values(error.response.data.errors);
    return new Error(firstError);
  }
  if (error.message) {
    return new Error(error.message);
  }
  return new Error('Não foi possível completar a requisição.');
}

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export async function login(credentials) {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function registerUser(payload) {
  try {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function fetchItems() {
  try {
    const response = await apiClient.get('/items');
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function fetchItemById(id) {
  try {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function createItem(formData) {
  try {
    const response = await apiClient.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export default apiClient;
