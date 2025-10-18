import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchItems() {
  const response = await apiClient.get('/items');
  return response.data;
}

export async function fetchItemById(id) {
  const response = await apiClient.get(`/items/${id}`);
  return response.data;
}

export async function createItem(payload) {
  const response = await apiClient.post('/items', payload);
  return response.data;
}

export default apiClient;
