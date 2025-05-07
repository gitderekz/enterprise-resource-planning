import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/interviews`;

export const interviewService = {
  // Get all interviews
  getInterviews: async (params = {}) => {
    try {
      const response = await axios.get(API_BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch interviews' };
    }
  },

  // Get single interview by ID
  getInterviewById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch interview' };
    }
  },

  // Create new interview
  createInterview: async (interviewData) => {
    try {
      const response = await axios.post(API_BASE, interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create interview' };
    }
  },

  // Update existing interview
  updateInterview: async (id, updateData) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update interview' };
    }
  },

  // Delete interview
  deleteInterview: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete interview' };
    }
  },

  // Schedule interview (specialized endpoint)
  scheduleInterview: async (interviewData) => {
    try {
      const response = await axios.post(`${API_BASE}/schedule`, interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to schedule interview' };
    }
  },

  // Get interviews by candidate ID
  getInterviewsByCandidate: async (candidateId) => {
    try {
      const response = await axios.get(`${API_BASE}/candidate/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch candidate interviews' };
    }
  }
};