import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/reports`;

export const recruitmentReportService = {
  getReports: async () => {
    try {
      const response = await axios.get(API_BASE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reports' };
    }
  },
  generateReport: async (reportType, params = {}) => {
    try {
      const response = await axios.post(`${API_BASE}/generate`, {
        reportType,
        ...params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate report' };
    }
  }
};