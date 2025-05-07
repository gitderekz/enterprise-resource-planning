// backend/services/resumeParser.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

const parseResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const data = await fs.promises.readFile(filePath);
  
  if (ext === '.pdf') {
    const { text } = await pdf(data);
    return { text };
  } else if (ext === '.docx') {
    const { value } = await mammoth.extractRawText({ buffer: data });
    return { text: value };
  } else if (ext === '.doc') {
    // Handle .doc files if needed
  }
  
  return { text: '' };
};

module.exports = { parseResume };