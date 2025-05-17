import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOnboardings = async () => {
  const response = await axios.get(`${API_URL}/hr/onboarding`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getOnboardingById = async (id) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const createOnboarding = async (onboardingData) => {
  const response = await axios.post(`${API_URL}/hr/onboarding`, onboardingData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const updateOnboarding = async (id, onboardingData) => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${id}`, onboardingData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const deleteOnboarding = async (id) => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getOnboardingTasks = async (onboardingId) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboardingId}/tasks`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const createOnboardingTask = async (onboardingId, taskData) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/${onboardingId}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const updateOnboardingTask = async (taskId, taskData) => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const deleteOnboardingTask = async (taskId) => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/hr/onboarding/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getOnboardingStats = async () => {
  const response = await axios.get(`${API_URL}/hr/onboarding/stats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getUpcomingOnboardings = async () => {
  const response = await axios.get(`${API_URL}/hr/onboarding/upcoming`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};