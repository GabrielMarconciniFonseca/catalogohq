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

function buildQuery(params) {
  const searchParams = new URLSearchParams();
  if (params.term) {
    searchParams.set('term', params.term);
  }
  if (params.publisher && params.publisher !== 'todos') {
    searchParams.set('publisher', params.publisher);
  }
  if (params.series && params.series !== 'todas') {
    searchParams.set('series', params.series);
  }
  if (params.status && params.status !== 'todos') {
    searchParams.set('status', params.status);
  }
  if (Array.isArray(params.tags) && params.tags.length) {
    params.tags.forEach((tag) => {
      if (tag.trim()) {
        searchParams.append('tags', tag.trim());
      }
    });
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function fetchItems(filters = {}) {
  try {
    const query = buildQuery(filters);
    const response = await apiClient.get(`/items${query}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function fetchWishlist() {
  try {
    const response = await apiClient.get('/items/wishlist');
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

export async function updateItemStatus(id, status) {
  try {
    const response = await apiClient.patch(`/items/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function importItemsCsv(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/items/import', formData, {
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
