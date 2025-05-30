// const db = require('../models');
// const { Op } = require('sequelize');
// const { generatePDF, generateExcel, generateCSV } = require('../utils/exportUtils');

// exports.getAllFinanceRecords = async (req, res) => {
//   try {
//     const { type, startDate, endDate, category, status } = req.query;
    
//     const where = {};
//     if (type) where.type = type;
//     if (category) where.category = category;
//     if (status) where.status = status;
    
//     if (startDate && endDate) {
//       where.date = {
//         [Op.between]: [new Date(startDate), new Date(endDate)]
//       };
//     }

//     const records = await db.Finance.findAll({
//       where,
//       include: [
//         { model: db.User, attributes: ['id', 'name', 'email'] },
//         { model: db.Department, attributes: ['id', 'name'] }
//       ],
//       order: [['date', 'DESC']]
//     });

//     res.json(records);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getFinancialSummary = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     const where = {};
//     if (startDate && endDate) {
//       where.date = {
//         [Op.between]: [new Date(startDate), new Date(endDate)]
//       };
//     }

//     const income = await db.Finance.sum('amount', {
//       where: { ...where, type: 'income' }
//     });

//     const expense = await db.Finance.sum('amount', {
//       where: { ...where, type: 'expense' }
//     });

//     res.json({
//       totalIncome: income || 0,
//       totalExpense: expense || 0,
//       netProfit: (income || 0) - (expense || 0)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Other controller methods would follow similar patterns
// // Implement create, update, delete, export functions similarly

// exports.getIncomeStatement = async (req, res) => {
//   try {
//     const { range } = req.query;
//     const where = {};
    
//     // Apply date range filtering based on 'range' parameter
//     // This is simplified - you'd want to implement proper date filtering
//     if (range === 'monthly') {
//       const startDate = new Date();
//       startDate.setMonth(startDate.getMonth() - 1);
//       where.date = { [Op.gte]: startDate };
//     } // implement other ranges
    
//     const income = await db.finance.findAll({
//       where: { ...where, type: 'income' },
//       attributes: ['category', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
//       group: ['category']
//     });
    
//     const expense = await db.finance.findAll({
//       where: { ...where, type: 'expense' },
//       attributes: ['category', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
//       group: ['category']
//     });
    
//     const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.total), 0);
//     const totalExpense = expense.reduce((sum, item) => sum + parseFloat(item.total), 0);
    
//     res.json({
//       totalIncome,
//       totalExpense,
//       netProfit: totalIncome - totalExpense,
//       categories: [
//         ...income.map(item => ({ name: item.category, amount: parseFloat(item.total), type: 'income' })),
//         ...expense.map(item => ({ name: item.category, amount: parseFloat(item.total), type: 'expense' }))
//       ]
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };











const db = require('../models');
const { Op, Sequelize } = require('sequelize');
const { generatePDF, generateExcel, generateCSV } = require('../utils/exportUtils');
const moment = require('moment');

// Helper function for date range filtering
const getDateRange = (range) => {
  const now = new Date();
  switch (range) {
    case 'daily':
      return { start: moment(now).startOf('day').toDate(), end: moment(now).endOf('day').toDate() };
    case 'weekly':
      return { start: moment(now).startOf('week').toDate(), end: moment(now).endOf('week').toDate() };
    case 'monthly':
      return { start: moment(now).startOf('month').toDate(), end: moment(now).endOf('month').toDate() };
    case 'quarterly':
      return { start: moment(now).startOf('quarter').toDate(), end: moment(now).endOf('quarter').toDate() };
    case 'yearly':
      return { start: moment(now).startOf('year').toDate(), end: moment(now).endOf('year').toDate() };
    default:
      return { start: moment(now).subtract(1, 'month').toDate(), end: now };
  }
};

// Basic CRUD Operations
exports.getAllFinanceRecords = async (req, res) => {
  try {
    const { type, startDate, endDate, category, status } = req.query;
    
    const where = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const records = await db.finance.findAll({
      where,
      include: [
        { model: db.user, attributes: ['id', 'username', 'email'] },
        { model: db.department, attributes: ['id', 'name'] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFinanceRecord = async (req, res) => {
  try {
    const record = await db.finance.findByPk(req.params.id, {
      include: [
        { model: db.user, attributes: ['id', 'username', 'email'] },
        { model: db.department, attributes: ['id', 'name'] }
      ]
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFinanceRecord = async (req, res) => {
  try {
    const { type, amount, date, description, category, status, reference } = req.body;
    
    const record = await db.finance.create({
      type,
      amount,
      date,
      description,
      category,
      status,
      reference,
      userId: req.user.id
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFinanceRecord = async (req, res) => {
  try {
    const record = await db.finance.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    const { type, amount, date, description, category, status, reference } = req.body;
    
    await record.update({
      type,
      amount,
      date,
      description,
      category,
      status,
      reference
    });
    
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFinanceRecord = async (req, res) => {
  try {
    const record = await db.finance.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    await record.destroy();
    res.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report Generation
exports.getFinancialSummary = async (req, res) => {
  try {
    const { range } = req.query;
    const { start, end } = getDateRange(range);
    
    const where = { date: { [Op.between]: [start, end] } };
    
    const income = await db.finance.sum('amount', {
      where: { ...where, type: 'income' }
    });

    const expense = await db.finance.sum('amount', {
      where: { ...where, type: 'expense' }
    });

    res.json({
      totalIncome: income || 0,
      totalExpense: expense || 0,
      netProfit: (income || 0) - (expense || 0),
      startDate: start,
      endDate: end
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomeStatement = async (req, res) => {
  try {
    const { range } = req.query;
    const { start, end } = getDateRange(range);
    const where = { date: { [Op.between]: [start, end] } };
    
    const incomeByCategory = await db.finance.findAll({
      where: { ...where, type: 'income' },
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total']
      ],
      group: ['category']
    });
    
    const expenseByCategory = await db.finance.findAll({
      where: { ...where, type: 'expense' },
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total']
      ],
      group: ['category']
    });
    
    const totalIncome = incomeByCategory.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const totalExpense = expenseByCategory.reduce((sum, item) => sum + parseFloat(item.total), 0);
    
    res.json({
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      incomeCategories: incomeByCategory.map(item => ({
        category: item.category,
        amount: parseFloat(item.total),
        percentage: (parseFloat(item.total) / totalIncome * 100).toFixed(2)
      })),
      expenseCategories: expenseByCategory.map(item => ({
        category: item.category,
        amount: parseFloat(item.total),
        percentage: (parseFloat(item.total) / totalExpense * 100).toFixed(2)
      })),
      period: { start, end }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBalanceSheet = async (req, res) => {
  try {
    const { date } = req.query;
    const asOfDate = date ? new Date(date) : new Date();
    
    // In a real implementation, you'd have separate models for assets and liabilities
    // This is a simplified version
    const assets = await db.finance.findAll({
      where: { 
        type: 'asset',
        date: { [Op.lte]: asOfDate }
      },
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'value']
      ],
      group: ['category']
    });
    
    const liabilities = await db.finance.findAll({
      where: { 
        type: 'liability',
        date: { [Op.lte]: asOfDate }
      },
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'value']
      ],
      group: ['category']
    });
    
    const totalAssets = assets.reduce((sum, item) => sum + parseFloat(item.value), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + parseFloat(item.value), 0);
    const equity = totalAssets - totalLiabilities;
    
    res.json({
      asOfDate,
      assets: {
        items: assets.map(item => ({
          category: item.category,
          value: parseFloat(item.value)
        })),
        total: totalAssets
      },
      liabilities: {
        items: liabilities.map(item => ({
          category: item.category,
          value: parseFloat(item.value)
        })),
        total: totalLiabilities
      },
      equity,
      balance: totalAssets === (totalLiabilities + equity) // Should always be true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getCashFlowReport = async (req, res) => {
//   try {
//     const { range } = req.query;
//     const { start, end } = getDateRange(range);
    
//     // Group by period (day, week, month)
//     const groupBy = range === 'daily' ? 'day' : 
//                    range === 'weekly' ? 'week' : 'month';
    
//     const cashFlow = await db.finance.findAll({
//       where: { date: { [Op.between]: [start, end] } },
//       attributes: [
//         [Sequelize.fn('DATE_TRUNC', groupBy, Sequelize.col('date')), 'period'],
//         'type',
//         [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount']
//       ],
//       group: ['period', 'type'],
//       order: [['period', 'ASC']]
//     });
    
//     // Process into a more usable format
//     const periods = {};
//     cashFlow.forEach(item => {
//       const periodKey = moment(item.period).format('YYYY-MM-DD');
//       if (!periods[periodKey]) {
//         periods[periodKey] = {
//           date: item.period,
//           inflow: 0,
//           outflow: 0
//         };
//       }
      
//       if (item.type === 'income') {
//         periods[periodKey].inflow += parseFloat(item.amount);
//       } else {
//         periods[periodKey].outflow += parseFloat(item.amount);
//       }
//     });
    
//     // Calculate running balance
//     let balance = 0;
//     const result = Object.values(periods).map(period => {
//       balance += period.inflow - period.outflow;
//       return {
//         ...period,
//         balance
//       };
//     });
    
//     res.json({
//       cashFlow: result,
//       period: { start, end },
//       openingBalance: 0, // In a real system, you'd fetch this from previous period
//       closingBalance: balance
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getCashFlowReport = async (req, res) => {
  try {
    const { range } = req.query;
    const { start, end } = getDateRange(range);
    
    // MySQL compatible date grouping (since DATE_TRUNC is PostgreSQL specific)
    let groupBy;
    switch (range) {
      case 'daily':
        groupBy = ['date'];
        break;
      case 'weekly':
        groupBy = [Sequelize.fn('YEARWEEK', Sequelize.col('date'), 1)];
        break;
      case 'monthly':
        groupBy = [
          Sequelize.fn('YEAR', Sequelize.col('date')),
          Sequelize.fn('MONTH', Sequelize.col('date'))
        ];
        break;
      default:
        groupBy = ['date'];
    }
    
    const cashFlow = await db.finance.findAll({
      where: { date: { [Op.between]: [start, end] } },
      attributes: [
        ...groupBy,
        'type',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount']
      ],
      group: [...groupBy, 'type'],
      order: [groupBy[0]]
    });
    
    // Process results
    const periods = {};
    cashFlow.forEach(item => {
      let periodKey;
      if (range === 'weekly') {
        const year = item.dataValues['YEARWEEK(date, 1)'].toString().substring(0, 4);
        const week = item.dataValues['YEARWEEK(date, 1)'].toString().substring(4);
        periodKey = `${year}-W${week.padStart(2, '0')}`;
      } else if (range === 'monthly') {
        const year = item.dataValues['YEAR(date)'];
        const month = item.dataValues['MONTH(date)'].toString().padStart(2, '0');
        periodKey = `${year}-${month}`;
      } else {
        periodKey = moment(item.date).format('YYYY-MM-DD');
      }
      
      if (!periods[periodKey]) {
        periods[periodKey] = {
          period: periodKey,
          inflow: 0,
          outflow: 0
        };
      }
      
      if (item.type === 'income') {
        periods[periodKey].inflow += parseFloat(item.amount);
      } else {
        periods[periodKey].outflow += parseFloat(item.amount);
      }
    });
    
    // Calculate running balance
    let balance = 0;
    const result = Object.values(periods).map(period => {
      balance += period.inflow - period.outflow;
      return {
        ...period,
        balance
      };
    });
    
    res.json({
      cashFlow: result,
      period: { start, end },
      openingBalance: 0, // Would come from previous period in real system
      closingBalance: balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomeExpenseReport = async (req, res) => {
  try {
    const { range } = req.query;
    const { start, end } = getDateRange(range);
    
    const income = await db.finance.sum('amount', {
      where: { 
        type: 'income',
        date: { [Op.between]: [start, end] }
      }
    });
    
    const expense = await db.finance.sum('amount', {
      where: { 
        type: 'expense',
        date: { [Op.between]: [start, end] }
      }
    });
    
    const net = (income || 0) - (expense || 0);
    
    res.json({
      income: income || 0,
      expense: expense || 0,
      net,
      period: { start, end },
      percentage: income ? (expense / income * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudgetVsActual = async (req, res) => {
  try {
    const { range } = req.query;
    const { start, end } = getDateRange(range);
    
    // In a real system, you'd have a Budget model
    // This is a simplified version using the same Finance model
    const actuals = await db.finance.findAll({
      where: { date: { [Op.between]: [start, end] } },
      attributes: [
        'category',
        'type',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'actual']
      ],
      group: ['category', 'type']
    });
    
    // Mock budget data - in real system, this would come from Budget model
    const budgets = [
      { category: 'Sales', type: 'income', budget: 100000 },
      { category: 'Services', type: 'income', budget: 50000 },
      { category: 'Salaries', type: 'expense', budget: 60000 },
      { category: 'Office Supplies', type: 'expense', budget: 10000 }
    ];
    
    // Combine actuals with budgets
    const result = budgets.map(budgetItem => {
      const actualItem = actuals.find(a => 
        a.category === budgetItem.category && a.type === budgetItem.type
      );
      
      return {
        ...budgetItem,
        actual: actualItem ? parseFloat(actualItem.actual) : 0,
        variance: actualItem ? 
          (parseFloat(actualItem.actual) - budgetItem.budget) : 
          -budgetItem.budget,
        variancePercentage: actualItem ? 
          ((parseFloat(actualItem.actual) - budgetItem.budget) / budgetItem.budget * 100).toFixed(2) :
          -100
      };
    });
    
    res.json({
      budgetVsActual: result,
      period: { start, end },
      totalBudget: budgets.reduce((sum, item) => sum + item.budget, 0),
      totalActual: actuals.reduce((sum, item) => sum + parseFloat(item.actual), 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Functions
exports.exportToCSV = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    
    const records = await db.finance.findAll({
      where,
      include: [
        { model: db.user, attributes: ['username'] },
        { model: db.department, attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Type', key: 'type' },
      { header: 'Category', key: 'category' },
      { header: 'Amount', key: 'amount' },
      { header: 'Status', key: 'status' },
      { header: 'Description', key: 'description' },
      { header: 'User', key: 'user' },
      { header: 'Department', key: 'department' }
    ];
    
    const csvData = records.map(record => ({
      date: moment(record.date).format('YYYY-MM-DD'),
      type: record.type,
      category: record.category,
      amount: record.amount,
      status: record.status,
      description: record.description,
      user: record.user ? record.user.username : '',
      department: record.Department ? record.Department.name : ''
    }));
    
    const csv = await generateCSV(csvData, columns);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=finance_records.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    
    const records = await db.finance.findAll({
      where,
      include: [
        { model: db.user, attributes: ['username'] },
        { model: db.department, attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Type', key: 'type' },
      { header: 'Category', key: 'category' },
      { header: 'Amount', key: 'amount' },
      { header: 'Status', key: 'status' },
      { header: 'Description', key: 'description' },
      { header: 'User', key: 'user' },
      { header: 'Department', key: 'department' }
    ];
    
    const excelData = records.map(record => ({
      date: moment(record.date).format('YYYY-MM-DD'),
      type: record.type,
      category: record.category,
      amount: record.amount,
      status: record.status,
      description: record.description,
      user: record.user ? record.user.username : '',
      department: record.Department ? record.Department.name : ''
    }));
    
    const excelBuffer = await generateExcel(excelData, columns);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=finance_records.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportToPDF = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    
    const records = await db.finance.findAll({
      where,
      include: [
        { model: db.user, attributes: ['username'] },
        { model: db.department, attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Type', key: 'type' },
      { header: 'Category', key: 'category' },
      { header: 'Amount', key: 'amount' },
      { header: 'Status', key: 'status' }
    ];
    
    const pdfData = records.map(record => ({
      date: moment(record.date).format('YYYY-MM-DD'),
      type: record.type,
      category: record.category,
      amount: record.amount,
      status: record.status
    }));
    
    const pdf = await generatePDF(pdfData, columns);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=finance_records.pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Metadata endpoints
exports.getCategories = async (req, res) => {
  try {
    const categories = await db.finance.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
      ],
      order: [['category', 'ASC']]
    });
    
    res.json(categories.map(item => item.category));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    // In a real system, you'd have an Account model
    // This is a simplified version
    const accounts = [
      { id: 1, name: 'Operating Account', type: 'bank', balance: 125000 },
      { id: 2, name: 'Payroll Account', type: 'bank', balance: 87500 },
      { id: 3, name: 'Tax Account', type: 'bank', balance: 42000 }
    ];
    
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};