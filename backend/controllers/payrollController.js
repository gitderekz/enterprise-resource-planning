const db = require('../models');
const { Op } = require('sequelize');
const exceljs = require('exceljs');
const PDFDocument = require('pdfkit');

// Get payroll records with filters
const getPayrollRecords = async (req, res) => {
  try {
    const { employeeId, month, year, status } = req.query;
    
    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (month) where.month = month;
    if (year) where.year = year;
    if (status) where.status = status;
    
    const records = await db.payroll.findAll({
      where,
      include: [{ model: db.user, as: 'employee',
      include: [{
        model: db.role,
        as: 'role'
      }] }]
    });
    
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payroll records', error: err.message });
  }
};

// Add this new method to update status
const updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const payroll = await db.payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.status = status;
    await payroll.save();

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: 'Error updating payroll status', error: err.message });
  }
};

// Run payroll for employees
const runPayroll = async (req, res) => {
  try {
    const { period, status, employeeData } = req.body;
    
    // Validate period format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(period)) {
      return res.status(400).json({ message: 'Invalid period format. Use YYYY-MM' });
    }
    
    // Check if payroll already exists for this period
    const existingPayroll = await db.payroll.findAll({
      where: {
        period,
        userId: employeeData.map(e => e.userId)
      }
    });
    
    if (existingPayroll.length > 0) {
      return res.status(400).json({ 
        message: 'Payroll already exists for some employees in this period',
        existingRecords: existingPayroll
      });
    }
    
    // Create payroll records
    const payrollRecords = await Promise.all(
      employeeData.map(async (empData) => {
        return db.payroll.create({
          userId: empData.userId,
          employeeId: empData.userId,
          period,
          grossSalary: empData.grossSalary,
          deductions: empData.deductions,
          netSalary: empData.netSalary,
          status: status || 'pending',
          details: empData.details
        });
      })
    );
    
    // Update with user information
    const recordsWithUsers = await db.payroll.findAll({
      where: { id: payrollRecords.map(r => r.id) },
      include: [{ model: db.user, as: 'employee' }]
    });
    
    res.json(recordsWithUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error running payroll', error: err.message });
  }
};
// const runPayroll = async (req, res) => {
//   try {
//     const { employeeIds, month, year } = req.body;
    
//     // In a real app, you would calculate payroll for each employee
//     const payrollRecords = await Promise.all(employeeIds.map(async employeeId => {
//       const employee = await db.user.findByPk(employeeId);
//       const deductions = await db.deduction.findAll({ where: { employeeId } });
      
//       // Calculate payroll (simplified example)
//       const grossSalary = employee.baseSalary;
//       const totalDeductions = deductions.reduce((sum, d) => {
//         return sum + (d.isPercentage ? (grossSalary * d.amount / 100) : d.amount);
//       }, 0);
      
//       return db.payroll.create({
//         employeeId,
//         month: `${year}-${month}`,
//         grossSalary,
//         deductions: totalDeductions,
//         netSalary: grossSalary - totalDeductions,
//         status: 'pending'
//       });
//     }));
    
//     res.json(payrollRecords);
//   } catch (err) {
//     res.status(500).json({ message: 'Error running payroll', error: err.message });
//   }
// };

// Get payroll summary by period

const getPayrollSummary = async (req, res) => {
  try {
    const { period, usePeriodField } = req.query; // e.g., period=monthly&usePeriodField=true
    // const usePeriod = usePeriodField === 'true';
    // const field = usePeriod ? 'period' : 'createdAt';
    const usePeriod = period === 'monthly';
    const field = period  === 'monthly' ? 'period' : 'createdAt';

    let attributes, groupBy, orderBy;

    if (period === 'daily') {
      if (usePeriod) {
        return res.status(400).json({ message: 'Daily summary not supported with period field (must use createdAt).' });
      }

      attributes = [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross']
      ];
      groupBy = [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))];
      orderBy = [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']];
    }

    else if (period === 'monthly') {
      if (usePeriod) {
        // Assume period format is 'YYYY-MM' as string
        attributes = [
          ['period', 'month'],
          [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
          [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
          [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
        ];
        groupBy = ['period'];
        orderBy = [['period', 'ASC']];
      } else {
        const monthFormat = '%Y-%m';
        attributes = [
          [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat), 'month'],
          [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
          [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
          [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
        ];
        groupBy = [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat)];
        orderBy = [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), monthFormat), 'ASC']];
      }
    }

    else if (period === 'annual') {
      if (usePeriod) {
        // Extract year from 'YYYY-MM'
        attributes = [
          [db.sequelize.fn('SUBSTRING', db.sequelize.col('period'), 1, 4), 'year'],
          [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
          [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
          [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
        ];
        groupBy = [db.sequelize.fn('SUBSTRING', db.sequelize.col('period'), 1, 4)];
        orderBy = [[db.sequelize.fn('SUBSTRING', db.sequelize.col('period'), 1, 4), 'ASC']];
      } else {
        attributes = [
          [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
          [db.sequelize.fn('SUM', db.sequelize.col('grossSalary')), 'totalGross'],
          [db.sequelize.fn('SUM', db.sequelize.col('deductions')), 'totalDeductions'],
          [db.sequelize.fn('SUM', db.sequelize.col('netSalary')), 'totalNet']
        ];
        groupBy = [db.sequelize.fn('YEAR', db.sequelize.col('createdAt'))];
        orderBy = [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC']];
      }
    }

    else {
      return res.status(400).json({ message: 'Invalid period value. Use daily, monthly, or annual.' });
    }

    const summary = await db.payroll.findAll({
      attributes,
      group: groupBy,
      order: orderBy
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payroll summary', error: err.message });
  }
};

// Export payroll report in different formats
const exportPayrollReport = async (req, res) => {
  try {
    const { format, month, year } = req.query;
    const where = {};
    
    if (month && year) {
      where.period = `${year}-${month}`;
    }
    
    const records = await db.payroll.findAll({
      where,
      include: [{ model: db.user, as: 'employee',
      include: [{
        model: db.role,
        as: 'role'
      }] }]
    });
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=payroll_report.csv');
      
      // CSV header
      let csv = 'Employee,Position,Month,Gross Salary,Deductions,Net Salary,Status\n';
      
      // Add rows
      records.forEach(record => {
        csv += `"${record.employee.username}","${record.employee.position??record.employee.role.name}","${record.period}",` +
               `${record.grossSalary},${record.deductions},${record.netSalary},"${record.status}"\n`;
      });
      
      return res.send(csv);
    } else if (format === 'excel') {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Payroll Report');
      
      // Add headers
      worksheet.columns = [
        { header: 'Employee', key: 'employee' },
        { header: 'Position', key: 'position' },
        { header: 'Month', key: 'month' },
        { header: 'Gross Salary', key: 'grossSalary' },
        { header: 'Deductions', key: 'deductions' },
        { header: 'Net Salary', key: 'netSalary' },
        { header: 'Status', key: 'status' }
      ];
      
      // Add rows
      records.forEach(record => {
        worksheet.addRow({
          employee: record.employee.username,
          position: record.employee.position??record.employee.role.name,
          month: record.period,
          grossSalary: record.grossSalary,
          deductions: record.deductions,
          netSalary: record.netSalary,
          status: record.status
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=payroll_report.xlsx');
      
      return workbook.xlsx.write(res).then(() => res.end());
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=payroll_report.pdf');
      doc.pipe(res);
      
      doc.fontSize(16).text('Payroll Report', { align: 'center' });
      doc.moveDown();
      
      // Add table
      const startY = doc.y;
      const rowHeight = 20;
      const colWidth = 100;
      const headers = ['Employee', 'Position', 'Month', 'Gross', 'Deductions', 'Net', 'Status'];
      
      // Draw headers
      doc.font('Helvetica-Bold');
      headers.forEach((header, i) => {
        doc.text(header, i * colWidth, startY, { width: colWidth, align: 'left' });
      });
      doc.moveDown();
      
      // Draw rows
      doc.font('Helvetica');
      records.forEach(record => {
        const row = [
          record.employee.username,
          record.employee.position??record.employee.role.name,
          record.period,
          `${process.env.NEXT_PUBLIC_CURRENCY}${record.grossSalary}`,
          `${process.env.NEXT_PUBLIC_CURRENCY}${record.deductions}`,
          `${process.env.NEXT_PUBLIC_CURRENCY}${record.netSalary}`,
          record.status
        ];
        
        row.forEach((cell, i) => {
          doc.text(cell, i * colWidth, doc.y, { width: colWidth, align: 'left' });
        });
        doc.moveDown();
      });
      
      doc.end();
    } else {
      return res.status(400).json({ message: 'Invalid export format' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error exporting payroll report', error: err.message });
  }
};

module.exports = {
  getPayrollRecords,
  updatePayrollStatus,
  runPayroll,
  getPayrollSummary,
  exportPayrollReport
};