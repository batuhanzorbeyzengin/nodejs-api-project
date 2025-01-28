import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const getProducts = async ({ offset = 0, limit = 12, search = "" }) => {
  try {
    const response = await api.get(`/product`, {
      params: {
        offset,
        limit,
        search: search.trim()
      }
    });
    return {
      data: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred while loading products');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred while loading product details');
  }
};

export const checkProductEligibility = async (id, { countryCode, currency, price }) => {
  try {
    const response = await api.post(`/product/${id}/check`, {
      countryCode,
      currency,
      price,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred during eligibility check');
  }
};

export default api;