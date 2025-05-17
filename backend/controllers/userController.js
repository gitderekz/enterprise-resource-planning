const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.user; // use lowercase if model name is defined as 'user'
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const getStream = require('stream'); // To convert PDF stream to buffer
const streamToBuffer = require('stream-to-buffer');
const stream = require('stream');
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: db.role,
                as: 'role'
            }]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};
// Create a user
const createUser = async (req, res) => {
    const { username, email, password, role_id, status, permissions  } = req.body;
    console.log("permissions[0]",permissions[0]);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role_id,
            status,
            permissions:permissions[0]//JSON.stringify(permissions)
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};
// Get a single user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role_id } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role_id = role_id || user.role_id;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

// START EMPLOYEES
// // Get employees (users with baseSalary)
// const getEmployees = async (req, res) => {
//     try {
//         const employees = await User.findAll({
//             where: {
//                 baseSalary: {
//                     [db.Sequelize.Op.gt]: 0
//                 }
//             },
//             include: [{
//                 model: db.role,
//                 as: 'role'
//             }]
//         });
//         res.json(employees);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching employees', error: err.message });
//     }
// };
const getEmployees = async (req, res) => {
  try {
    const employees = await db.user.findAll({
      include: [{
        model: db.role,
        as: 'role'
      }]
    });

    // Format data for frontend
    const formattedEmployees = employees.map(employee => ({
      id: employee.id,
      username: employee.username,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      status: employee.status,
      gender: employee.gender,
      hireDate: employee.hireDate,
      role: employee.role //? employee.role.name : null
    }));

    res.json(formattedEmployees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
};

// Get employee statistics
// const getEmployeeStats = async (req, res) => {
//   try {
//     const stats = {
//       total: await User.count(),
//       active: await User.count({ where: { status: 'active' } }),
//       onLeave: await User.count({ where: { status: 'on_leave' } }),
//       withPermissions: await User.count({ 
//         where: { 
//           permissions: { 
//             [Sequelize.Op.ne]: null 
//           } 
//         } 
//       }),
//       byDepartment: await User.findAll({
//         attributes: [
//           'department',
//           [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
//         ],
//         group: ['department'],
//         raw: true
//       }),
//       byGender: await User.findAll({
//         attributes: [
//           'gender',
//           [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
//         ],
//         group: ['gender'],
//         raw: true
//       }),
//       byType: await User.findAll({
//         attributes: [
//           'employment_type',
//           [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
//         ],
//         group: ['employment_type'],
//         raw: true
//       })
//     };

//     res.json(stats);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching employee stats', error: err.message });
//   }
// };
const getEmployeeStats = async (req, res) => {
  try {
    const stats = {
      total: await db.user.count(),
      active: await db.user.count({ where: { status: 'active' } }),
      onLeave: await db.user.count({ where: { status: 'on_leave' } }),
      withPermissions: await db.user.count({ 
        where: { 
          permissions: { 
            [db.Sequelize.Op.not]: null 
          } 
        } 
      }),
      byDepartment: await db.user.findAll({
        attributes: [
          'department',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count'],
          [db.Sequelize.literal(`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`), 'active'],
          [db.Sequelize.literal(`SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END)`), 'onLeave'],
          [db.Sequelize.literal(`SUM(CASE WHEN permissions IS NOT NULL THEN 1 ELSE 0 END)`), 'withPermissions']
        ],
        group: ['department'],
        raw: true
      }),
      byGender: await db.user.findAll({
        attributes: [
          'gender',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'value']
        ],
        group: ['gender'],
        raw: true
      }),
      byType: await db.user.findAll({
        include: [{model: db.role, as: 'role', attributes: []}],
        attributes: [
          'role_id',
          [db.Sequelize.col('role.name'), 'name'],
          [db.Sequelize.fn('COUNT', db.Sequelize.col('user.id')), 'value']
        ],
        group: ['role_id'],
        raw: true
        // attributes: [
        //   'employment_type',
        //   [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'value']
        // ],
        // group: ['employment_type'],
        // raw: true
      })
    };

    // Format data for frontend
    stats.byDepartment = stats.byDepartment.map(dept => ({
      department: dept.department,
      active: dept.active,
      onLeave: dept.onLeave,
      withPermissions: dept.withPermissions
    }));

    stats.byGender = stats.byGender.map(gender => ({
      name: gender.gender === 'male' ? 'Male' : 'Female',
      value: gender.value
    }));

    stats.byType = stats.byType.map(type => ({
    //   name: type.employment_type === 'part' ? 'Part-time' : 
    //         type.employment_type === 'contract' ? 'Contract' : 'Full-time',
      name: type.name ,
      value: type.value
    }));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee stats', error: err.message });
  }
};

// Bulk update users
const bulkUpdateUsers = async (req, res) => {
  const { userIds, updates } = req.body;

  try {
    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No user IDs provided' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'No updates provided' });
    }

    // Build update object
    const updateData = {};
    if (updates.role) updateData.role_id = updates.role;
    if (updates.status) updateData.status = updates.status;
    if (updates.permissions) updateData.permissions = updates.permissions;

    // Handle salary updates
    if (updates.salary) {
      if (updates.percentage) {
        // Percentage-based update
        await User.increment('baseSalary', {
          by: Sequelize.literal(`baseSalary * ${updates.salary / 100}`),
          where: { id: userIds }
        });
      } else {
        // Fixed amount update
        await User.increment('baseSalary', {
          by: updates.salary,
          where: { id: userIds }
        });
      }
    }

    // Update other fields
    if (Object.keys(updateData).length > 0) {
      await User.update(updateData, {
        where: { id: userIds }
      });
    }

    res.json({ message: 'Users updated successfully', count: userIds.length });
  } catch (err) {
    res.status(500).json({ message: 'Error updating users', error: err.message });
  }
};

// Get recent reports
const getRecentReports = async (req, res) => {
  try {
    const reports = await db.report.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await db.report.findOne({
      where: { id, userId: req.user.id }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report', error: err.message });
  }
};

// // // Generate report
// // const generateReport = async (req, res) => {
// //   const { reportType, format, startDate, endDate } = req.body;

// //   try {
// //     let data;
// //     let filename;
    
// //     switch(reportType) {
// //       case 'employee_list':
// //         data = await User.findAll({
// //           include: [{ model: db.role, as: 'role' }],
// //           where: {
// //             createdAt: {
// //               [Sequelize.Op.between]: [startDate, endDate]
// //             }
// //           }
// //         });
// //         filename = `employee-list-${new Date().toISOString().split('T')[0]}`;
// //         break;
        
// //       case 'attendance':
// //         // Implement attendance report logic
// //         break;
        
// //       // Add other report types...
        
// //       default:
// //         return res.status(400).json({ message: 'Invalid report type' });
// //     }

// //     // Generate the report based on format
// //     switch(format) {
// //       case 'pdf':
// //         // Generate PDF
// //         break;
// //       case 'excel':
// //         // Generate Excel
// //         break;
// //       case 'csv':
// //         // Generate CSV
// //         break;
// //       default:
// //         return res.status(400).json({ message: 'Invalid format' });
// //     }

// //     // Return the generated report
// //     res.json({ message: 'Report generated successfully', filename });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error generating report', error: err.message });
// //   }
// // };
// const generateReport = async (req, res) => {
//   const { reportType, format, startDate, endDate } = req.body;

//   try {
//     let data;
//     let filename = `${reportType}_${startDate}_to_${endDate}.${format}`;
    
//     // Get report data based on type
//     switch(reportType) {
//       case 'employee_list':
//         data = await db.user.findAll({
//           include: [{ model: db.role, as: 'role' }],
//           where: {
//             createdAt: {
//               [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
//             }
//           }
//         });
//         break;
        
//       case 'attendance':
//         // Implement attendance report logic
//         break;
        
//       // Add other report types...
        
//       default:
//         return res.status(400).json({ message: 'Invalid report type' });
//     }

//     // Generate the report based on format
//     let reportContent;
//     switch(format) {
//       case 'pdf':
//         // Generate PDF (using a PDF library like pdfkit)
//         reportBuffer = await generatePDF(data);
//         break;
//       case 'excel':
//         // Generate Excel (using a library like exceljs)
//         reportBuffer = await generateExcel(data);
//         break;
//       case 'csv':
//         // Generate CSV
//         reportContent = generateCSV(data);
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid format' });
//     }
    
//     if (!reportContent) {
//       return res.status(500).json({ message: 'Failed to generate report content' });
//     }
//     // Save report to database
//     const report = await db.report.create({
//       name: `${reportType.replace('_', ' ')} Report`,
//       filename,
//       format,
//       size: reportContent.length,
//       userId: req.user.id
//     });

//     // Return the generated report
//     res.setHeader('Content-Type', `application/${format}`);
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
//     res.send(reportContent);
//   } catch (err) {
//     res.status(500).json({ message: 'Error generating report', error: err.message });
//   }
// };

// // Helper function to generate CSV
// const generateCSV = (data) => {
//   if (!data || data.length === 0) return '';
  
//   const headers = Object.keys(data[0].dataValues).join(',');
//   const rows = data.map(item => 
//     Object.values(item.dataValues)
//       .map(val => typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val)
//       .join(',')
//   );
  
//   return [headers, ...rows].join('\n');
// };

// async function generateExcel(data) {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Report');

//   if (!data || data.length === 0) return null;

//   worksheet.columns = Object.keys(data[0]).map(key => ({
//     header: key,
//     key,
//     width: 20
//   }));

//   data.forEach(row => worksheet.addRow(row));

//   return await workbook.xlsx.writeBuffer(); // returns a Buffer
// }


// async function generatePDF(data) {
//   if (!data || data.length === 0) return null;

//   const getStream = (await import('get-stream')).default;

//   const doc = new PDFDocument();
//   const passthrough = new stream.PassThrough();
//   doc.pipe(passthrough);

//   // Headers
//   const keys = Object.keys(data[0]);
//   doc.fontSize(12).text(keys.join(' | '), { underline: true });

//   // Rows
//   data.forEach(row => {
//     const values = keys.map(k => row[k]);
//     doc.text(values.join(' | '));
//   });

//   doc.end();

//   // ❌ Incorrect: getStream.buffer(...)
//   // ✅ Correct:
//   return await getStream(passthrough);
// }
// // async function generatePDF(data) {
// //   return new Promise((resolve, reject) => {
// //     const PDFDocument = require('pdfkit');
// //     const doc = new PDFDocument();
// //     const stream = require('stream');
// //     const passthrough = new stream.PassThrough();

// //     doc.pipe(passthrough);

// //     const keys = Object.keys(data[0]);
// //     doc.fontSize(12).text(keys.join(' | '), { underline: true });

// //     data.forEach(row => {
// //       const values = keys.map(k => row[k]);
// //       doc.text(values.join(' | '));
// //     });

// //     doc.end();

// //     streamToBuffer(passthrough, (err, buffer) => {
// //       if (err) return reject(err);
// //       resolve(buffer);
// //     });
// //   });
// // }

const generateReport = async (req, res) => {
  const { reportType, format, startDate, endDate } = req.body;

  try {
    let data;
    let filename = `${reportType}_${startDate}_to_${endDate}.${format}`;
    const reportName = `${reportType.replace('_', ' ')} Report (${startDate} to ${endDate})`;
    
    // Get report data
    data = await db.user.findAll({
      include: [{ model: db.role, as: 'role' }],
      where: {
        createdAt: {
          [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      raw: true
    });

    // Format data for reports
    const formattedData = data.map(user => ({
      ID: user.id,
      Username: user.username,
      Email: user.email,
      Role: user['role.name'],
      Status: user.status,
      Department: user.department,
      'Hire Date': new Date(user.hireDate).toLocaleDateString()
    }));

    // Create report record first
    const report = await db.report.create({
      name: reportName,
      filename,
      format,
      size: 0, // Will be updated after generation
      userId: req.user.id
    });

    // Generate report based on format
    switch(format) {
      case 'pdf':
        const pdfDoc = generatePDFReport(formattedData, reportName);
        
        // Collect PDF data to calculate size
        const pdfChunks = [];
        pdfDoc.on('data', chunk => pdfChunks.push(chunk));
        pdfDoc.on('end', async () => {
          const pdfBuffer = Buffer.concat(pdfChunks);
          // Update report with actual size
          await report.update({ size: pdfBuffer.length });
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        pdfDoc.pipe(res);
        pdfDoc.end();
        break;

      case 'excel':
        const excelBuffer = await generateExcelReport(formattedData, reportName);
        await report.update({ size: excelBuffer.length });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(excelBuffer);
        break;

      case 'csv':
        const csvData = generateCSV(formattedData);
        await report.update({ size: Buffer.byteLength(csvData) });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csvData);
        break;

      default:
        return res.status(400).json({ message: 'Invalid format' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
};

// Helper functions (add these to the same file)
const generatePDFReport = (data, title) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ margin: 30 });
  
  // Title
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  
  if (data.length === 0) {
    doc.text('No data available');
    return doc;
  }

  const headers = Object.keys(data[0]);
  const columnWidth = (doc.page.width - 60) / headers.length; // Equal width columns
  
  // Table headers
  doc.font('Helvetica-Bold');
  headers.forEach((header, i) => {
    doc.text(header, 30 + (i * columnWidth), doc.y, {
      width: columnWidth,
      align: 'left'
    });
  });
  doc.moveDown();
  
  // Horizontal line
  doc.moveTo(30, doc.y)
     .lineTo(doc.page.width - 30, doc.y)
     .stroke();
  doc.moveDown(0.5);
  
  // Table rows
  doc.font('Helvetica');
  data.forEach(row => {
    let startY = doc.y;
    let maxHeight = 0;
    
    headers.forEach((header, i) => {
      const textHeight = doc.heightOfString(String(row[header] || ''), {
        width: columnWidth
      });
      maxHeight = Math.max(maxHeight, textHeight);
      
      doc.text(String(row[header] || ''), 30 + (i * columnWidth), startY, {
        width: columnWidth,
        align: 'left'
      });
    });
    
    doc.y = startY + maxHeight + 10;
    
    // Horizontal line between rows
    doc.moveTo(30, doc.y - 5)
       .lineTo(doc.page.width - 30, doc.y - 5)
       .stroke();
  });
  
  return doc;
};

const generateExcelReport = async (data, title) => {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Style headers
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
    });

    // Add data rows
    data.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }

  return workbook.xlsx.writeBuffer();
};

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

// Add these to module.exports
module.exports = { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getEmployees,
  getEmployeeStats,
  bulkUpdateUsers,
  generateReport,
  getRecentReports,
  deleteReport
};