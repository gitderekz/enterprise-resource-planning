import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEmployeeDeductions = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/hr/payroll/deductions`, {
      params: { userId },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee deductions:', error);
    throw error;
  }
};

export const addDeduction = async (deductionData) => {
  try {
    const response = await axios.post(`${API_URL}/hr/payroll/deductions`, deductionData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding deduction:', error);
    throw error;
  }
};

export const updateDeduction = async (deductionId, deductionData) => {
  try {
    const response = await axios.put(`${API_URL}/hr/payroll/deductions/${deductionId}`, deductionData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating deduction:', error);
    throw error;
  }
};

export const deleteDeduction = async (deductionId) => {
  try {
    const response = await axios.delete(`${API_URL}/hr/payroll/deductions/${deductionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting deduction:', error);
    throw error;
  }
};