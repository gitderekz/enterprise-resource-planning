import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment`;

export const recruitmentService = {
  // Stats
  getStats: async () => {
    return axios.get(`${API_BASE}/stats`).then(res => res.data);
  },

  // getJobRequisitions
  getJobRequisitions: async() => {
    return axios.get(`${API_BASE}/requisitions`).then(res => res.data);
  },
  
  updateOffer: async (id, updates) => {
    return axios.put(`${API_BASE}/offers/${id}`, updates).then(res => res.data);
  },
  
  generateOffer: async (interviewId, offerData) => {
    return axios.post(`${API_BASE}/interviews/${interviewId}/offer`, offerData)
      .then(res => res.data);
  },

  // Jobs
  getJobs: async () => {
    return axios.get(`${API_BASE}/requisitions`).then(res => res.data);
  },
  createJob: async (jobData) => {
    return axios.post(`${API_BASE}/requisitions`, jobData).then(res => res.data);
  },

  // Get open positions
  getOpenPositions: async () => {
    return axios.get(`${API_BASE}/requisitions?status=Open`).then(res => res.data);
  },

  // Candidates
  // getCandidates: async () => {
  //   return axios.get(`${API_BASE}/candidates`).then(res => res.data);
  // },
  // Get candidates with filters
  getCandidates: async (filters = {}) => {
    return axios.get(`${API_BASE}/candidates`, { params: filters }).then(res => res.data);
  },
  // getCandidates: async (search = '') => {
  //   const params = {};
  //   if (search) params.search = search;
  //   return axios.get(`${API_BASE}/candidates`, { params }).then(res => res.data);
  // },
  updateCandidate: async (id, updates) => {
    return axios.put(`${API_BASE}/candidates/${id}`, updates).then(res => res.data);
  },
  // Create candidate
  createCandidate: async (candidateData) => {
    const formData = new FormData();
    Object.entries(candidateData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return axios.post(`${API_BASE}/candidates`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data);
  },


  // Interviews
  getInterviews: async () => {
    return axios.get(`${API_BASE}/interviews`).then(res => res.data);
  },
  // scheduleInterview: async (data) => {
  //   return axios.post(`${API_BASE}/interviews`, data).then(res => res.data);
  // },
  scheduleInterview: async (interviewData) => {
    return axios.post(`${API_BASE}/interviews`, interviewData).then(res => res.data);
  },
  updateCandidate: async (id, updates) => {
    return axios.put(`${API_BASE}/candidates/${id}`, updates).then(res => res.data);
  },

  // Offers
  getOffers: async () => {
    return axios.get(`${API_BASE}/offers`).then(res => res.data);
  }
};