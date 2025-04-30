import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generatePdf = async (data) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Set up fonts and styles
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const textColor = rgb(0, 0, 0);

  // Add content to the PDF
  let y = 350; // Starting Y position
  page.drawText('Task Report', {
    x: 50,
    y,
    size: fontSize + 4,
    font,
    color: textColor,
  });
  y -= 30;

  data.forEach((task) => {
    page.drawText(`Task: ${task.name}`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: textColor,
    });
    y -= 20;

    page.drawText(`Status: ${task.status}`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: textColor,
    });
    y -= 20;

    page.drawText(`Due Date: ${task.due_date}`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: textColor,
    });
    y -= 30;
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};