// services/resumeParserService.js
const ResumeParser = require('resume-parser');

const parseResume = async (filePath) => {
  try {
    const data = await ResumeParser.parseResume(filePath);
    return {
      skills: data.skills,
      experience: data.experience,
      education: data.education,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

module.exports = { parseResume };