import axios from 'axios';

// const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/offers`;
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/interviews`;

export const offerService = {
  getOffers: async () => {
    try {
      const response = await axios.get(API_BASE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch offers' };
    }
  },
  createOffer: async (offerData) => {
    try {
      const response = await axios.post(API_BASE, offerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create offer' };
    }
  },
  updateOffer: async (id, updateData) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update offer' };
    }
  }
};