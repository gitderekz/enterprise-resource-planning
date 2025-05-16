const db = require('../models');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

// Helper function to format timetable data
const formatTimetableData = (shifts) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => ({
    day,
    shifts: shifts.filter(shift => shift.day === day)
  }));
};

// Get timetable data
const getTimetableData = async (req, res) => {
  try {
    const shifts = await db.shift.findAll({
      include: [
        {
          model: db.user,
          as: 'employees',
          attributes: ['id', 'username', 'email']
        },
        {
          model: db.department,
          as: "department",
          attributes: ['name']
        }
      ],
      order: [['day', 'ASC'], ['startTime', 'ASC']]
    });

    const timeOffRequests = await db.timeOffRequest.findAll({
      where: {
        status: {
          [Op.in]: ['pending', 'approved']
        }
      },
      include: {
        model: db.user,
        as: 'user',
        attributes: ['username', 'email']
      }
    });

    res.json({
      timetable: formatTimetableData(shifts),
      timeOffRequests
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching timetable data', error: err.message });
  }
};

// Create a new shift
const createShift = async (req, res) => {
  try {
    const { day, startTime, endTime, departmentId, employeeIds } = req.body;

    // 1. Create the shift
    const shift = await db.shift.create({
      day,
      startTime,
      endTime,
      departmentId
    });

    // 2. Associate employees (if any)
    if (employeeIds && employeeIds.length > 0) {
      await shift.setEmployees(employeeIds);
    }

    // 3. Reload the shift to include associated employees
    const shiftWithEmployees = await db.shift.findByPk(shift.id, {
      include: [
        {
          model: db.user,
          as: 'employees',
          attributes: ['id', 'username', 'email'] // Choose what to include
        }
      ]
    });

    // 4. Send it back
    res.status(201).json(shiftWithEmployees);
  } catch (err) {
    res.status(500).json({ message: 'Error creating shift', error: err.message });
  }
};


// Update a shift
const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime, departmentId, employeeIds } = req.body;

    const shift = await db.shift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shift.update({ day, startTime, endTime, departmentId });

    if (employeeIds) {
      await shift.setEmployees(employeeIds);
    }

    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: 'Error updating shift', error: err.message });
  }
};

const createShiftSwap = async (req, res) => {
  try {
    const { fromShiftId, toShiftId, reason, requestedToId } = req.body;
    const requesterId = req.user.id;

    // Validate shifts exist
    const [fromShift, toShift] = await Promise.all([
      db.shift.findByPk(fromShiftId),
      db.shift.findByPk(toShiftId)
    ]);

    if (!fromShift || !toShift) {
      return res.status(404).json({ message: 'One or both shifts not found' });
    }

    // Create swap request
    const swapRequest = await db.shiftSwap.create({
      fromShiftId,
      toShiftId,
      reason,
      requesterId,
      requestedToId,
      status: 'pending'
    });

    // Create notification for the requested employee
    await notificationServiceInstance.createNotification({
      userIds: [requestedToId],
      type: 'task',
      title: 'Shift Swap Request',
      message: `You have a new shift swap request from ${req.user.username}`,
      metadata: {
        source: 'shift-swap',
        swapRequestId: swapRequest.id,
        requesterId
      }
    });

    res.status(201).json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error creating shift swap', error: err.message });
  }
};

// Delete a shift
const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await db.shift.findByPk(id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shift.destroy();
    res.json({ message: 'Shift deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting shift', error: err.message });
  }
};

// Get shift coverage
const getShiftCoverage = async (req, res) => {
  try {
    const shifts = await db.shift.findAll({
      attributes: [
        'day',
        [db.sequelize.fn('COUNT', db.sequelize.col('employees.id')), 'employeeCount'],
        [db.sequelize.literal(`CONCAT(startTime, ' - ', endTime)`), 'timeRange']
      ],
      include: [{
        model: db.user,
        as: 'employees',
        attributes: []
      }],
      group: ['day', 'startTime', 'endTime'],
      raw: true
    });

    // Calculate coverage status
    const coverage = shifts.map(shift => {
      const needed = shift.day === 'Saturday' || shift.day === 'Sunday' ? 5 : 6;
      let status;
      if (shift.employeeCount >= needed) status = 'Fully Staffed';
      else if (shift.employeeCount >= needed * 0.7) status = 'Understaffed';
      else status = 'Not Staffed';

      return {
        ...shift,
        needed,
        status
      };
    });

    res.json(coverage);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shift coverage', error: err.message });
  }
};

// Create time off request
const createTimeOffRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    const request = await db.timeOffRequest.create({
      startDate,
      endDate,
      reason,
      userId,
      status: 'pending'
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error creating time off request', error: err.message });
  }
};

// Approve time off request
const approveTimeOffRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const request = await db.timeOffRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const status = approved ? 'approved' : 'rejected';
    await request.update({ status });

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

// Export timetable
const exportTimetable = (format) => async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const shifts = await db.shift.findAll({
      include: [
        {
          model: db.user,
          as: 'employees',
          attributes: ['username']
        },
        {
          model: db.department,
          as: "department",
          attributes: ['name']
        }
      ],
      order: [['day', 'ASC'], ['startTime', 'ASC']]
    });


    // Group data by day
    const grouped = {};
    const data = shifts.map(shift => ({
      day: shift.day,
      time: `${shift.startTime} - ${shift.endTime}`,
      department: shift.department.name,
      employees: shift.employees.map(e => e.username).join(', '),
      employeeCount: shift.employees.length
    }));

    // Add week information
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    switch (format) {
      case 'pdf':
        const { default: PDFDocument } = await import('pdfkit');
        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=timetable_${weekStart.toISOString().split('T')[0]}.pdf`);

        doc.pipe(res);

        // Title
        doc.fontSize(20).text('Weekly Timetable Report', { align: 'center' });
        doc.fontSize(12).text(`Week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`, { align: 'center' });
        doc.moveDown();

        // Table headers
        const headers = ['Day', 'Time', 'Department', 'Employees', 'Count'];
        const columnPositions = [50, 150, 250, 350, 450]; // Same as 50 + (i * 100)
        let y = doc.y;

        doc.font('Helvetica-Bold');
        headers.forEach((header, i) => {
          doc.text(header, columnPositions[i], y, { width: 100 });
        });
        y += 20;

        doc.font('Helvetica');

        // Group data by day
        data.forEach(item => {
          if (!grouped[item.day]) grouped[item.day] = [];
          grouped[item.day].push(item);
        });

        for (const day of Object.keys(grouped)) {
          const group = grouped[day];
          const groupStartY = y;
          let rowHeights = [];

          // Measure row heights
          group.forEach(row => {
            const employeeHeight = doc.heightOfString(row.employees, { width: 100 });
            const rowHeight = Math.max(employeeHeight, 15);
            rowHeights.push(rowHeight);
          });

          // Draw each row
          group.forEach((row, i) => {
            const rowY = y;
            const { time, department, employees, employeeCount } = row;
            const values = [time, department, employees, employeeCount.toString()];

            values.forEach((text, colIndex) => {
              doc.text(text, columnPositions[colIndex + 1], rowY, { width: 100 });
            });

            y += rowHeights[i] + 10;
          });

          // Center the day label
          const totalGroupHeight = rowHeights.reduce((sum, h) => sum + h + 10, 0);
          const centerY = groupStartY + totalGroupHeight / 2 - doc.heightOfString(day) / 2;

          doc.font('Helvetica-Bold');
          doc.text(day, columnPositions[0], centerY, { width: 100 });
          doc.font('Helvetica');
        }

        doc.end();
        break;

      // case 'pdf':
      //   const { default: PDFDocument } = await import('pdfkit');
      //   const doc = new PDFDocument();
        
      //   // Set response headers
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', `attachment; filename=timetable_${weekStart.toISOString().split('T')[0]}.pdf`);
        
      //   // Pipe PDF to response
      //   doc.pipe(res);
        
      //   // Add title
      //   doc.fontSize(20).text('Weekly Timetable Report', { align: 'center' });
      //   doc.fontSize(12).text(`Week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`, { align: 'center' });
      //   doc.moveDown();
        
      //   // Add table
      //   const table = {
      //     headers: ['Day', 'Time', 'Department', 'Employees', 'Count'],
      //     rows: data.map(item => [
      //       item.day,
      //       item.time,
      //       item.department,
      //       item.employees,
      //       item.employeeCount.toString()
      //     ])
      //   };
        
      //   // Draw table
      //   doc.font('Helvetica-Bold');
      //   let y = doc.y;
      //   table.headers.forEach((header, i) => {
      //     doc.text(header, 50 + (i * 100), y);
      //   });
      //   y += 20;
        
      //   doc.font('Helvetica');
      //   let previousDay = null;
      //   table.rows.forEach(row => {
      //     let startY = y;
      //     let maxHeight = 0;
      //     const [day, time, department, employees, count] = row;
      //     const isSameDay = day === previousDay;

      //     // Only show day if it’s different from previous
      //     const displayDay = isSameDay ? '' : day;
      //     previousDay = day;
          
      //     const rowValues = [displayDay, time, department, employees, count];

      //     // row.forEach((cell, i) => {
      //     rowValues.forEach((cell, i) => {
      //       const textHeight = doc.heightOfString(cell, { width: 100 });
      //       maxHeight = Math.max(maxHeight, textHeight);
      //       doc.text(cell, 50 + (i * 100), startY, { width: 100 });
      //     });
          
      //     y = startY + maxHeight + 10;
      //   });
        
      //   doc.end();
      //   break;

      case 'excel':
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Timetable');

        // Week title rows
        worksheet.addRow(['Weekly Timetable Report']);
        worksheet.addRow([`Week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`]);
        worksheet.addRow([]);

        // Header row
        worksheet.columns = [
          { header: 'Day', key: 'day', width: 15 },
          { header: 'Time', key: 'time', width: 20 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Employees', key: 'employees', width: 30 },
          { header: 'Employee Count', key: 'employeeCount', width: 18 }
        ];

        let currentRow = worksheet.lastRow.number + 1; // Start row after header

        // Group data by day
        data.forEach(item => {
          if (!grouped[item.day]) grouped[item.day] = [];
          grouped[item.day].push(item);
        });

        for (const day of Object.keys(grouped)) {
          const group = grouped[day];
          const startRow = currentRow;

          group.forEach(item => {
            worksheet.addRow({
              day: item.day, // we'll overwrite this below to avoid repeating
              time: item.time,
              department: item.department,
              employees: item.employees,
              employeeCount: item.employeeCount
            });
            currentRow++;
          });

          const endRow = currentRow - 1;

          // Merge day column cells for this group
          if (startRow !== endRow) {
            worksheet.mergeCells(`A${startRow}:A${endRow}`);
          }

          // Set day value and alignment
          const cell = worksheet.getCell(`A${startRow}`);
          cell.value = day;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        // Style header
        [1, 2].forEach(rowNumber => {
          worksheet.getRow(rowNumber).font = { bold: true };
        });


        // Set response headers and return file
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=timetable_${weekStart.toISOString().split('T')[0]}.xlsx`
        );

        await workbook.xlsx.write(res);
        break;

      // case 'excel':
      //   const ExcelJS = require('exceljs');
      //   const workbook = new ExcelJS.Workbook();
      //   const worksheet = workbook.addWorksheet('Timetable');
        
      //   // Add week info
      //   worksheet.addRow(['Weekly Timetable Report']);
      //   worksheet.addRow([`Week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`]);
      //   worksheet.addRow([]);
        
      //   // Add headers
      //   worksheet.columns = [
      //     { header: 'Day', key: 'day', width: 15 },
      //     { header: 'Time', key: 'time', width: 20 },
      //     { header: 'Department', key: 'department', width: 20 },
      //     { header: 'Employees', key: 'employees', width: 30 },
      //     { header: 'Employee Count', key: 'employeeCount', width: 15 }
      //   ];
        
      //   worksheet.addRows(data);
        
      //   // Set response headers
      //   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      //   res.setHeader('Content-Disposition', `attachment; filename=timetable_${weekStart.toISOString().split('T')[0]}.xlsx`);
        
      //   await workbook.xlsx.write(res);
      //   break;

      case 'csv':
        let csv = 'Day,Time,Department,Employees,Employee Count\n';
        data.forEach(item => {
          csv += `"${item.day}","${item.time}","${item.department}","${item.employees}","${item.employeeCount}"\n`;
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=timetable_${weekStart.toISOString().split('T')[0]}.csv`);
        res.send(csv);
        break;

      default:
        res.status(400).json({ message: 'Invalid export format' });
    }
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Error exporting timetable', error: err.message });
  }
};
// const exportTimetable = (format) => async (req, res) => {
//   try {
//     const shifts = await db.shift.findAll({
//       include: [
//         {
//           model: db.user,
//           as: 'employees',
//           attributes: ['username']
//         },
//         {
//           model: db.department,
//           as: "department",
//           attributes: ['name']
//         }
//       ],
//       order: [['day', 'ASC'], ['startTime', 'ASC']]
//     });

//     const data = shifts.map(shift => ({
//       day: shift.day,
//       time: `${shift.startTime} - ${shift.endTime}`,
//       department: shift.department.name,
//       employees: shift.employees.map(e => e.username).join(', '),
//       employeeCount: shift.employees.length
//     }));

//     switch (format) {
//       case 'pdf':
//         const pdfDoc = new PDFDocument();
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=timetable.pdf');
//         pdfDoc.pipe(res);

//         pdfDoc.fontSize(16).text('Timetable Report', { align: 'center' });
//         pdfDoc.moveDown();

//         const table = {
//           headers: ['Day', 'Time', 'Department', 'Employees', 'Count'],
//           rows: data.map(item => [
//             item.day,
//             item.time,
//             item.department,
//             item.employees,
//             item.employeeCount.toString()
//           ])
//         };

//         // Draw table
//         pdfDoc.font('Helvetica-Bold');
//         let y = pdfDoc.y;
//         table.headers.forEach((header, i) => {
//           pdfDoc.text(header, 50 + (i * 100), y);
//         });
//         y += 20;

//         pdfDoc.font('Helvetica');
//         table.rows.forEach(row => {
//           row.forEach((cell, i) => {
//             pdfDoc.text(cell, 50 + (i * 100), y);
//           });
//           y += 20;
//         });

//         pdfDoc.end();
//         break;

//       case 'excel':
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Timetable');

//         worksheet.columns = [
//           { header: 'Day', key: 'day', width: 15 },
//           { header: 'Time', key: 'time', width: 20 },
//           { header: 'Department', key: 'department', width: 20 },
//           { header: 'Employees', key: 'employees', width: 30 },
//           { header: 'Employee Count', key: 'employeeCount', width: 15 }
//         ];

//         worksheet.addRows(data);

//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', 'attachment; filename=timetable.xlsx');
//         await workbook.xlsx.write(res);
//         break;

//       case 'csv':
//         let csv = 'Day,Time,Department,Employees,Employee Count\n';
//         data.forEach(item => {
//           csv += `"${item.day}","${item.time}","${item.department}","${item.employees}","${item.employeeCount}"\n`;
//         });

//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename=timetable.csv');
//         res.send(csv);
//         break;

//       default:
//         res.status(400).json({ message: 'Invalid export format' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Error exporting timetable', error: err.message });
//   }
// };

module.exports = {
  getTimetableData,
  createShift,
  updateShift,
  deleteShift,
  getShiftCoverage,
  createTimeOffRequest,
  approveTimeOffRequest,
  createShiftSwap,
  exportTimetable
};