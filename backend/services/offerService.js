const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateOfferLetter = async (offerData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create directory if it doesn't exist
      const dir = path.join(__dirname, '../uploads/offer-letters');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filename = `offer-${Date.now()}.pdf`;
      const filePath = path.join(dir, filename);
      const doc = new PDFDocument();

      // Pipe PDF to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Generate PDF content
      doc.fontSize(20).text('OFFER LETTER', { align: 'center' }).moveDown(2);
      doc.fontSize(14).text(`Dear ${offerData.candidateName},`).moveDown();
      doc.text(`We are pleased to offer you the position of ${offerData.position} at our company.`).moveDown();
      doc.text(`Salary: ${offerData.salary}`).moveDown();
      doc.text(`Start Date: ${offerData.startDate}`).moveDown(2);
      doc.text('Terms and Conditions:').moveDown();
      doc.text(offerData.terms).moveDown(2);
      doc.text('Please sign and return this letter to accept the offer.').moveDown(2);
      doc.text('Sincerely,').moveDown();
      doc.text('The Hiring Manager');

      doc.end();

      stream.on('finish', () => resolve({ filename, path: filePath }));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateOfferLetter };