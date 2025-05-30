const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

exports.generatePDF = async (data, columns) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add title and date
    doc.fontSize(18).text('Financial Records Report', { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, { align: 'right' });
    doc.moveDown(2);

    // Set table parameters
    const tableTop = 150;
    const rowHeight = 30;
    const colWidth = doc.page.width - 100;
    const cellPadding = 5;
    const columnCount = columns.length;
    const columnWidth = colWidth / columnCount;

    // Draw table headers
    doc.font('Helvetica-Bold');
    let x = 50;
    
    columns.forEach(column => {
      doc.text(column.header, x, tableTop, { width: columnWidth, align: 'left' });
      x += columnWidth;
    });

    // Draw horizontal line
    doc.moveTo(50, tableTop + rowHeight)
       .lineTo(50 + colWidth, tableTop + rowHeight)
       .stroke();

    // Draw table rows
    doc.font('Helvetica');
    let y = tableTop + rowHeight;
    
    data.forEach((row, i) => {
      x = 50;
      
      columns.forEach(column => {
        doc.text(String(row[column.key] || ''), x + cellPadding, y + cellPadding, {
          width: columnWidth - cellPadding * 2,
          align: 'left'
        });
        x += columnWidth;
      });

      // Draw horizontal line
      doc.moveTo(50, y + rowHeight)
         .lineTo(50 + colWidth, y + rowHeight)
         .stroke();
      
      y += rowHeight;
      
      // Add new page if needed
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  });
};

exports.generateExcel = async (data, columns) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Records');

  // Add header row
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: 20
  }));

  // Add data rows
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Style header row
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Style data rows
  for (let i = 2; i <= worksheet.rowCount; i++) {
    worksheet.getRow(i).eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // Generate buffer
  return workbook.xlsx.writeBuffer();
};

exports.generateCSV = (data, columns) => {
  let csv = columns.map(col => `"${col.header.replace(/"/g, '""')}"`).join(',') + '\r\n';
  
  data.forEach(row => {
    csv += columns.map(col => {
      let value = row[col.key];
      if (value === undefined || value === null) value = '';
      // Escape quotes and always wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',') + '\r\n';
  });

  return csv;
};



// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const { format } = require('date-fns');

// exports.generatePDF = async (data, columns) => {
//   return new Promise((resolve) => {
//     const doc = new PDFDocument();
//     const buffers = [];
    
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => {
//       const pdfData = Buffer.concat(buffers);
//       resolve(pdfData);
//     });

//     // Add title
//     doc.fontSize(18).text('Financial Records Report', { align: 'center' });
//     doc.moveDown();
    
//     // Add date
//     doc.fontSize(10).text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, { align: 'right' });
//     doc.moveDown();

//     // Add table
//     const table = {
//       headers: columns.map(col => col.header),
//       rows: data.map(item => columns.map(col => item[col.key]))
//     };

//     // Draw table
//     doc.font('Helvetica-Bold');
//     doc.fontSize(10);
    
//     // Table headers
//     table.headers.forEach((header, i) => {
//       doc.text(header, 50 + (i * 120), 100, { width: 120 });
//     });
    
//     // Table rows
//     doc.font('Helvetica');
//     table.rows.forEach((row, rowIndex) => {
//       row.forEach((cell, cellIndex) => {
//         doc.text(cell.toString(), 50 + (cellIndex * 120), 120 + (rowIndex * 20), { width: 120 });
//       });
//     });

//     doc.end();
//   });
// };

// exports.generateExcel = async (data, columns) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Financial Records');

//   // Add header row
//   worksheet.addRow(columns.map(col => col.header));

//   // Add data rows
//   data.forEach(item => {
//     worksheet.addRow(columns.map(col => item[col.key]));
//   });

//   // Style header row
//   worksheet.getRow(1).eachCell(cell => {
//     cell.font = { bold: true };
//   });

//   // Generate buffer
//   return workbook.xlsx.writeBuffer();
// };

// exports.generateCSV = (data, columns) => {
//   let csv = columns.map(col => col.header).join(',') + '\n';
  
//   data.forEach(item => {
//     csv += columns.map(col => {
//       let value = item[col.key];
//       // Escape quotes and wrap in quotes if contains comma
//       if (typeof value === 'string' && value.includes(',')) {
//         value = `"${value.replace(/"/g, '""')}"`;
//       }
//       return value;
//     }).join(',') + '\n';
//   });

//   return csv;
// };