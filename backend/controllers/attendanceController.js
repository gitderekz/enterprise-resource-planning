const db = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

// Check in user
const checkIn = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { notes, ip_address, device_info } = req.body;

    // Check if user already checked in today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingCheckIn = await db.attendance.findOne({
      where: {
        user_id,
        check_in: {
          [Op.between]: [todayStart, todayEnd]
        }
      }
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    // Determine attendance status (late/on_time)
    const now = new Date();
    const expectedCheckIn = new Date();
    expectedCheckIn.setHours(9, 0, 0, 0); // Assuming 9 AM is standard check-in time

    let attendance_status = 'on_time';
    let time_difference = 0;

    if (now > expectedCheckIn) {
      attendance_status = 'late';
      time_difference = Math.round((now - expectedCheckIn) / (1000 * 60)); // minutes late
    } else if (now < expectedCheckIn) {
      attendance_status = 'early';
      time_difference = Math.round((expectedCheckIn - now) / (1000 * 60)); // minutes early
    }

    const attendance = await db.attendance.create({
      user_id,
      check_in: now,
      status: 'present',
      attendance_status,
      time_difference,
      notes,
      ip_address,
      device_info
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Error checking in', error: err.message });
  }
};

// Check out user
const checkOut = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { notes } = req.body;

    // Find today's check-in
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await db.attendance.findOne({
      where: {
        user_id,
        check_in: {
          [Op.between]: [todayStart, todayEnd]
        },
        check_out: null
      }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    const now = new Date();
    const expectedCheckOut = new Date(attendance.check_in);
    expectedCheckOut.setHours(17, 0, 0, 0); // Assuming 5 PM is standard check-out time

    // Calculate work hours
    const workHours = (now - attendance.check_in) / (1000 * 60 * 60); // in hours

    // Update overtime status if applicable
    if (now > expectedCheckOut) {
      attendance.attendance_status = 'overtime';
      attendance.time_difference = Math.round((now - expectedCheckOut) / (1000 * 60)); // minutes overtime
    }

    attendance.check_out = now;
    attendance.work_hours = workHours;
    attendance.notes = notes || attendance.notes;
    await attendance.save();

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Error checking out', error: err.message });
  }
};

// Get attendance stats for a user
const getUserAttendanceStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;    

    const where = {};
    
    if (id) {
      where.user_id = id;
    }

    if (startDate && endDate) {
      where.check_in = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const attendances = await db.attendance.findAll({
      where,
      include: id ? [] : [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username']
      }],
      order: [['check_in', 'DESC']]
    });

    // Calculate stats
    const stats = calculateStats(attendances, id);

    res.json({ attendances, stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance stats', error: err.message });
  }
};

// Helper function for stats calculation
const calculateStats = (attendances, isSingleUser) => {
  if (isSingleUser) {
    return {
      total_days: attendances.length,
      present_days: attendances.filter(a => a.status === 'present').length,
      absent_days: attendances.filter(a => a.status === 'absent').length,
      late_days: attendances.filter(a => a.attendance_status === 'late').length,
      early_days: attendances.filter(a => a.attendance_status === 'early').length,
      overtime_days: attendances.filter(a => a.attendance_status === 'overtime').length,
      average_work_hours: attendances.reduce((sum, a) => sum + (a.work_hours || 0), 0) / attendances.length || 0,
      average_late_minutes: attendances.filter(a => a.attendance_status === 'late')
        .reduce((sum, a) => sum + (a.time_difference || 0), 0) / 
        (attendances.filter(a => a.attendance_status === 'late').length || 1)
    };
  }

  // Group stats by user for multiple users
  const userStats = {};
  attendances.forEach(att => {
    const userId = att.user?.id || att.user_id;
    if (!userStats[userId]) {
      userStats[userId] = {
        username: att.user?.username || 'Unknown',
        total_days: 0,
        present_days: 0,
        absent_days: 0,
        late_days: 0,
        early_days: 0,
        overtime_days: 0,
        total_work_hours: 0
      };
    }

    userStats[userId].total_days++;
    if (att.status === 'present') userStats[userId].present_days++;
    if (att.status === 'absent') userStats[userId].absent_days++;
    if (att.attendance_status === 'late') userStats[userId].late_days++;
    if (att.attendance_status === 'early') userStats[userId].early_days++;
    if (att.attendance_status === 'overtime') userStats[userId].overtime_days++;
    userStats[userId].total_work_hours += att.work_hours || 0;
  });

  // Convert to array and calculate averages
  return Object.values(userStats).map(stats => ({
    ...stats,
    average_work_hours: stats.total_work_hours / stats.total_days || 0
  }));
};
// const getUserAttendanceStats = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { startDate, endDate } = req.query;

//     const where = { user_id: id };
    
//     if (startDate && endDate) {
//       where.check_in = {
//         [Op.between]: [new Date(startDate), new Date(endDate)]
//       };
//     }

//     const attendances = await db.attendance.findAll({
//       where,
//       order: [['check_in', 'DESC']]
//     });

//     // Calculate stats
//     const stats = {
//       total_days: attendances.length,
//       present_days: attendances.filter(a => a.status === 'present').length,
//       absent_days: attendances.filter(a => a.status === 'absent').length,
//       late_days: attendances.filter(a => a.attendance_status === 'late').length,
//       early_days: attendances.filter(a => a.attendance_status === 'early').length,
//       overtime_days: attendances.filter(a => a.attendance_status === 'overtime').length,
//       average_work_hours: attendances.reduce((sum, a) => sum + (a.work_hours || 0), 0) / attendances.length || 0,
//       average_late_minutes: attendances.filter(a => a.attendance_status === 'late')
//         .reduce((sum, a) => sum + (a.time_difference || 0), 0) / 
//         attendances.filter(a => a.attendance_status === 'late').length || 0
//     };

//     res.json({ attendances, stats });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching attendance stats', error: err.message });
//   }
// };

// Get all attendance data (for admin)
const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, userId, department } = req.query;

    const where = {};
    
    if (startDate && endDate) {
      where.check_in = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (userId) {
      where.user_id = userId;
    }

    const include = [{
      model: db.user,
      as: 'user',
      attributes: ['id', 'username', 'email', 'department'],
      required: true
    }];

    if (department) {
      include[0].where = { department };
    }

    const attendances = await db.attendance.findAll({
      where,
      include,
      order: [['check_in', 'DESC']]
    });

    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance data', error: err.message });
  }
};

// Generate attendance report
const generateAttendanceReport = async (req, res) => {
  try {
    const { format, type='records', startDate, endDate, userId, department } = req.query;
    const filename = `attendance_report_${startDate}_to_${endDate}.${format}`.replace(/[:/]/g, '-');

    // Determine which data to fetch based on report type
    let formattedData
    if (type === 'summary') {
        // Get summary stats for all employees
        const stats = await db.attendance.findAll({
            attributes: [
            'user_id',
            [db.sequelize.fn('COUNT', db.sequelize.col('attendance.id')), 'total_days'],
            [db.sequelize.literal("SUM(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END)"), 'present_days'],
            [db.sequelize.literal("SUM(CASE WHEN attendance.status = 'absent' THEN 1 ELSE 0 END)"), 'absent_days'],
            [db.sequelize.literal("SUM(CASE WHEN attendance.attendance_status = 'late' THEN 1 ELSE 0 END)"), 'late_days'],
            [db.sequelize.fn('AVG', db.sequelize.col('attendance.work_hours')), 'avg_work_hours']
            ],
            include: [{
            model: db.user,
            as: 'user',
            attributes: ['id', 'username', 'department']
            }],
            where: {
            check_in: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
            },
            group: ['user_id'],
            raw: true
        });
console.log("STATS: ", stats);

        formattedData = stats.map(stat => ({
            'Employee ID': stat['user.id'],
            'Employee Name': stat['user.username'],
            'Department': stat['user.department'],
            'Total Days': stat.total_days,
            'Present Days': stat.present_days,
            'Absent Days': stat.absent_days,
            'Late Days': stat.late_days,
            'Average Work Hours': stat.avg_work_hours ? parseFloat(stat.avg_work_hours).toFixed(2) : '0.00'
        }));
    } else {
    // Get attendance data
    const where = {
      check_in: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };

    if (userId) where.user_id = userId;

    const include = [{
      model: db.user,
      as: 'user',
      attributes: ['id', 'username', 'email', 'department'],
      required: true
    }];

    if (department) {
      include[0].where = { department };
    }

    const attendances = await db.attendance.findAll({
      where,
      include,
      order: [['check_in', 'DESC']],
      raw: true
    });

    // Format data for reports
    formattedData = attendances.map(att => ({
      'Employee ID': att['user.id'],
      'Employee Name': att['user.username'],
      'Department': att['user.department'],
    //   'Check In': att.check_in ? format(new Date(att.check_in), 'yyyy-MM-dd HH:mm') : 'N/A',
    //   'Check Out': att.check_out ? format(new Date(att.check_out), 'yyyy-MM-dd HH:mm') : 'Not checked out',
      'Check In': att.check_in ? new Date(att.check_in).toLocaleString() : 'N/A',
      'Check Out': att.check_out ? new Date(att.check_out).toLocaleString() : 'Not checked out',
      'Status': att.status,
      'Attendance Status': att.attendance_status || 'N/A',
      'Time Difference (mins)': att.time_difference || 'N/A',
      'Work Hours': att.work_hours ? att.work_hours.toFixed(2) : 'N/A',
      'Notes': att.notes || 'N/A'
    }));
    }
    // Generate report based on format
    switch(format) {
      case 'pdf':
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // const pdfDoc = generatePDFReport(formattedData, `Attendance Report (${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')})`);
        const pdfDoc = generatePDFReport(formattedData, `Attendance Report (${(new Date(startDate)).toLocaleDateString()} to ${(new Date(endDate)).toLocaleDateString()})`);
        pdfDoc.pipe(res);
        pdfDoc.end();
        break;

      case 'excel':
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // const excelBuffer = await generateExcelReport(formattedData, `Attendance ${format(new Date(startDate), 'MMM dd')} to ${format(new Date(endDate), 'MMM dd')}`);
        const excelBuffer = await generateExcelReport(formattedData, `Attendance Report`);
        res.send(excelBuffer);
        break;

      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const csvData = generateCSV(formattedData);
        res.send(csvData);
        break;

      default:
        return res.status(400).json({ message: 'Invalid format' });
    }
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
};
const generatePDFReport = (data, title) => {
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    font: 'Helvetica',
    info: {
      Title: 'Attendance Report',
      Author: 'ERP System'
    }
  });

  // Add header
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1);

  if (!data || data.length === 0) {
    doc.fontSize(12).text('No attendance data available', { align: 'center' });
    return doc;
  }

  // Table setup
  const headers = Object.keys(data[0]);
  const columnWidth = (doc.page.width - 100) / headers.length;
  const rowHeight = 30;
  const cellPadding = 5;
  let y = 150;

  // Draw table headers
  doc.font('Helvetica-Bold');
  let x = 50;
  headers.forEach(header => {
    doc.text(header, x + cellPadding, y + cellPadding, {
      width: columnWidth - (cellPadding * 2),
      align: 'left'
    });
    x += columnWidth;
  });
  y += rowHeight;

  // Draw table rows
  doc.font('Helvetica');
  data.forEach(row => {
    x = 50;
    let maxHeight = 0;
    
    // Calculate row height
    headers.forEach(header => {
      const textHeight = doc.heightOfString(String(row[header] || ''), {
        width: columnWidth - (cellPadding * 2)
      });
      maxHeight = Math.max(maxHeight, textHeight);
    });

    // Draw cells
    headers.forEach(header => {
      doc.text(String(row[header] || ''), x + cellPadding, y + cellPadding, {
        width: columnWidth - (cellPadding * 2),
        align: 'left'
      });
      x += columnWidth;
    });

    y += maxHeight + (cellPadding * 2);

    // Add new page if needed
    if (y > doc.page.height - 50) {
      doc.addPage();
      y = 50;
    }
  });

  return doc;
};
// const generateAttendanceReport = async (req, res) => {
//   try {
//     const { format, startDate, endDate, userId, department } = req.query;
//     const filename = `attendance_report_${startDate}_to_${endDate}.${format}`;

//     // Get attendance data
//     const where = {
//       check_in: {
//         [Op.between]: [new Date(startDate), new Date(endDate)]
//       }
//     };

//     if (userId) where.user_id = userId;

//     const include = [{
//       model: db.user,
//       as: 'user',
//       attributes: ['id', 'username', 'email', 'department'],
//       required: true
//     }];

//     if (department) {
//       include[0].where = { department };
//     }

//     const attendances = await db.attendance.findAll({
//       where,
//       include,
//       order: [['check_in', 'DESC']],
//       raw: true
//     });

//     // Format data for report
//     const formattedData = attendances.map(att => ({
//       'Employee ID': att['user.id'],
//       'Employee Name': att['user.username'],
//       Department: att['user.department'],
//     //   'Check In': new Date(att.check_in).toLocaleString(),
//       'Check In': att.check_in ? format(new Date(att.check_in), 'yyyy-MM-dd HH:mm') : 'N/A',
//     //   'Check Out': att.check_out ? new Date(att.check_out).toLocaleString() : 'Not checked out',
//       'Check Out': att.check_out ? format(new Date(att.check_out), 'yyyy-MM-dd HH:mm') : 'Not checked out',
//       Status: att.status,
//       'Attendance Status': att.attendance_status,
//       'Time Difference (mins)': att.time_difference,
//       'Work Hours': att.work_hours ? att.work_hours.toFixed(2) : 'N/A',
//       Notes: att.notes
//     }));

//     // Generate report based on format
//     switch(format) {
//       case 'pdf':
//         const pdfDoc = generatePDFReport(formattedData, `Attendance Report (${startDate} to ${endDate})`);
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
//         pdfDoc.pipe(res);
//         pdfDoc.end();
//         break;

//       case 'excel':
//         const excelBuffer = await generateExcelReport(formattedData, `Attendance Report (${startDate} to ${endDate})`);
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
//         res.send(excelBuffer);
//         break;

//       case 'csv':
//         const csvData = generateCSV(formattedData);
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
//         res.send(csvData);
//         break;

//       default:
//         return res.status(400).json({ message: 'Invalid format' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Error generating report', error: err.message });
//   }
// };

// Helper functions for report generation
// const generatePDFReport = (data, title) => {
//   const doc = new PDFDocument({ margin: 30, size: 'A4', font: 'Helvetica', info: {
//       Title: 'Attendance Report',
//       Author: 'ERP System'
//     } });
  
//   // Title with proper formatting
//   doc.fontSize(16).text(title || 'Attendance Report', { 
//     align: 'center',
//     underline: true,
//     lineGap: 10
//   });
//   doc.moveDown();

//   if (!data || data.length === 0) {
//     doc.fontSize(12).text('No attendance data available', { align: 'center' });
//     return doc;
//   }

//   // Set up table parameters
//   const tableTop = 100;
//   const rowHeight = 30;
//   const margin = 30;
//   const pageWidth = doc.page.width - margin * 2;
//   const columnCount = Object.keys(data[0]).length;
//   const columnWidth = pageWidth / columnCount;

//   // Table headers
//   doc.font('Helvetica-Bold');
//   const headers = Object.keys(data[0]);
//   let x = margin;
//   let y = tableTop;

//   headers.forEach(header => {
//     doc.text(header, x, y, { width: columnWidth, align: 'left' });
//     x += columnWidth;
//   });
//   y += rowHeight;

//   // Table rows
//   doc.font('Helvetica');
//   data.forEach(row => {
//     x = margin;
//     let maxHeight = 0;
    
//     // First pass to calculate row height
//     Object.values(row).forEach(value => {
//       const textHeight = doc.heightOfString(String(value || ''), {
//         width: columnWidth
//       });
//       maxHeight = Math.max(maxHeight, textHeight);
//     });

//     // Second pass to draw cells
//     Object.values(row).forEach(value => {
//       doc.text(String(value || ''), x, y, {
//         width: columnWidth,
//         align: 'left',
//         height: maxHeight
//       });
//       x += columnWidth;
//     });

//     y += maxHeight + 10;

//     // Add new page if needed
//     if (y > doc.page.height - margin) {
//       doc.addPage();
//       y = margin;
//     }
//   });

//   return doc;
// };
// const generatePDFReport = (data, title) => {
//   const doc = new PDFDocument({ margin: 30 });
  
//   // Title
//   doc.fontSize(18).text(title, { align: 'center' });
//   doc.moveDown();
  
//   if (data.length === 0) {
//     doc.text('No attendance data available');
//     return doc;
//   }

//   const headers = Object.keys(data[0]);
//   const columnWidth = (doc.page.width - 60) / headers.length;
  
//   // Table headers
//   doc.font('Helvetica-Bold');
//   headers.forEach((header, i) => {
//     doc.text(header, 30 + (i * columnWidth), doc.y, {
//       width: columnWidth,
//       align: 'left'
//     });
//   });
//   doc.moveDown();
  
//   // Horizontal line
//   doc.moveTo(30, doc.y)
//      .lineTo(doc.page.width - 30, doc.y)
//      .stroke();
//   doc.moveDown(0.5);
  
//   // Table rows
//   doc.font('Helvetica');
//   data.forEach(row => {
//     let startY = doc.y;
//     let maxHeight = 0;
    
//     headers.forEach((header, i) => {
//       const textHeight = doc.heightOfString(String(row[header] || ''), {
//         width: columnWidth
//       });
//       maxHeight = Math.max(maxHeight, textHeight);
      
//       doc.text(String(row[header] || ''), 30 + (i * columnWidth), startY, {
//         width: columnWidth,
//         align: 'left'
//       });
//     });
    
//     doc.y = startY + maxHeight + 10;
    
//     // Horizontal line between rows
//     doc.moveTo(30, doc.y - 5)
//        .lineTo(doc.page.width - 30, doc.y - 5)
//        .stroke();
//   });
  
//   return doc;
// };
const generateExcelReport = async (data, title) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');

  if (!data || data.length === 0) {
    worksheet.addRow(['No attendance data available']);
    return workbook.xlsx.writeBuffer();
  }

  // Add headers
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // Style headers
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6A3CBC' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Add data
  data.forEach(row => {
    worksheet.addRow(Object.values(row));
  });

  // Add auto-filters
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length }
  };

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.text.length;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = Math.min(Math.max(maxLength + 2, 10), 30);
  });

  // Freeze header row
    worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ];

  return workbook.xlsx.writeBuffer();
};
// const generateExcelReport = async (data, title) => {
//   const workbook = new ExcelJS.Workbook();
//   // Clean the title by removing invalid characters
//   const cleanTitle = title.replace(/[*?:\\/[\]']/g, '').substring(0, 31); // Excel has 31 char limit
//   const worksheet = workbook.addWorksheet(cleanTitle || 'Attendance Report');

//   if (!data || data.length === 0) {
//     worksheet.addRow(['No attendance data available for the selected period']);
//     return workbook.xlsx.writeBuffer();
//   }

//   // Add headers
//   if (data.length > 0) {
//     const headers = Object.keys(data[0]);
//     worksheet.addRow(headers);

//     // Style headers
//     worksheet.getRow(1).eachCell(cell => {
//       cell.font = { bold: true };
//     });

//     // Add data rows
//     data.forEach(row => {
//       worksheet.addRow(Object.values(row));
//     });

//     // Auto-fit columns
//     worksheet.columns.forEach(column => {
//       let maxLength = 0;
//       column.eachCell({ includeEmpty: true }, cell => {
//         const columnLength = cell.value ? cell.value.toString().length : 10;
//         if (columnLength > maxLength) {
//           maxLength = columnLength;
//         }
//       });
//       column.width = maxLength < 10 ? 10 : maxLength;
//     });
//   }

//   return workbook.xlsx.writeBuffer();
// };

const generateCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(val => typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val)
      .join(',')
  );
  
  return [headers, ...rows].join('\n');
};

const sendReminder = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // In a real app, you would:
    // 1. Get user details
    // 2. Send email/notification
    // 3. Log the reminder
    
    res.json({ message: 'Reminder sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reminder', error: err.message });
  }
};

// Deduct salary for excessive absences
const deductSalaryForAbsences = async (req, res) => {
  try {
    const { userId, deductionPercentage } = req.body;
    
    // Validate input
    if (!userId || !deductionPercentage) {
      return res.status(400).json({ message: 'User ID and deduction percentage are required' });
    }

    if (deductionPercentage <= 0 || deductionPercentage > 100) {
      return res.status(400).json({ message: 'Deduction percentage must be between 1 and 100' });
    }

    // Get user
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has base salary
    if (!user.baseSalary || user.baseSalary <= 0) {
      return res.status(400).json({ message: 'User does not have a valid base salary' });
    }

    // Calculate new salary after deduction
    const deductionAmount = (user.baseSalary * deductionPercentage) / 100;
    const newSalary = user.baseSalary - deductionAmount;

    // Update user's salary
    await user.update({ baseSalary: newSalary });

    res.json({ 
      message: `Salary deducted successfully by ${deductionPercentage}%`,
      originalSalary: user.baseSalary + deductionAmount,
      deductionAmount,
      newSalary
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deducting salary', error: err.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getUserAttendanceStats,
  getAllAttendance,
  generateAttendanceReport,
  sendReminder,
  deductSalaryForAbsences
};