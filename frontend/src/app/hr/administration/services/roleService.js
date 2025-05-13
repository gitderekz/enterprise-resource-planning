import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${id}`, roleData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};