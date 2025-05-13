import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEmployeeStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    throw error;
  }
};

export const getEmployees = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/users/employees`, {
      params: filters,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const bulkUpdateEmployees = async (userIds, updates) => {
  try {
    const response = await axios.put(`${API_URL}/users/bulk-update`, { userIds, updates }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating employees:', error);
    throw error;
  }
};

export const generateReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/users/reports`, reportData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob' // For file downloads
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};