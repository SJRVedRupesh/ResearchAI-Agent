import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeCompany = async (companyName) => {
  try {
    const response = await apiClient.post('/research', { company: companyName });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to analyze company');
    }
  } catch (error) {
    console.error('API Error details:', error);
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    throw new Error(message);
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health Check Failed:', error);
    return { success: false, message: error.message };
  }
};
