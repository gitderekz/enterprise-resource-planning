import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const generateReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/users/reports`, reportData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate report');
  }
};

export const getRecentReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/reports/recent`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch recent reports');
  }
};

export const deleteReport = async (reportId) => {
  try {
    await axios.delete(`${API_URL}/users/reports/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    throw new Error('Failed to delete report');
  }
};