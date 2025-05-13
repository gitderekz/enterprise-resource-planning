import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPayrollRecords = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/hr/payroll`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    throw error;
  }
};

export const runPayroll = async (payrollData) => {
  try {
    const response = await axios.post(`${API_URL}/hr/payroll`, payrollData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error running payroll:', error);
    throw error;
  }
};

export const getPayrollSummary = async (period = 'monthly') => {
  try {
    const response = await axios.get(`${API_URL}/hr/payroll/summary`, {
      params: { period },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    throw error;
  }
};

export const exportPayrollReport = async (format, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/hr/payroll/export`, {
      params: { ...params, format },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      responseType: format === 'pdf' ? 'blob' : 'json'
    });

    if (format === 'pdf') {
      // Handle PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_report_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    if (format === 'csv') {
      // Handle CSV
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    if (format === 'excel') {
      // Handle Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_report_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    return response.data;
  } catch (error) {
    console.error('Error exporting payroll report:', error);
    throw error;
  }
};