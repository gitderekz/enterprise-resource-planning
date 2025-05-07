// services/jobBoardService.js
const axios = require('axios');

const INDEED_API_KEY = process.env.INDEED_API_KEY;

const postToJobBoards = async (jobData) => {
  try {
    // Indeed API integration
    const indeedResponse = await axios.post('https://api.indeed.com/v2/jobs', {
      publisher: INDEED_API_KEY,
      ...jobData
    });
    
    return {
      indeed: indeedResponse.data
    };
  } catch (error) {
    console.error('Error posting to job boards:', error);
    throw error;
  }
};

module.exports = { postToJobBoards };