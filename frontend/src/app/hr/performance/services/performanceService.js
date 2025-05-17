import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPerformanceReviews = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/hr/performance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching performance reviews:', error);
    throw error;
  }
};

export const getPerformanceMetrics = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/hr/performance/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};

export const createPerformanceReview = async (reviewData, token) => {
  try {
    const response = await axios.post(`${API_URL}/hr/performance`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating performance review:', error);
    throw error;
  }
};

export const updatePerformanceReview = async (id, reviewData, token) => {
  try {
    const response = await axios.put(`${API_URL}/hr/performance/${id}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating performance review:', error);
    throw error;
  }
};

export const deletePerformanceReview = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/hr/performance/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting performance review:', error);
    throw error;
  }
};