const db = require('../models');
const { Op } = require('sequelize');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role_id;
    
    // Get basic user stats
    const userStats = {
      userId,
      userName: req.user.name,
      userRole
    };
    
    // Get role-specific stats
    let roleStats = {};
    
    if (userRole === 5) { // Finance role
      const [income, expense, invoices] = await Promise.all([
        db.finance.sum('amount', { where: { type: 'income' } }),
        db.finance.sum('amount', { where: { type: 'expense' } }),
        db.finance.count({ where: { type: 'invoice', status: 'pending' } })
      ]);
      
      roleStats = {
        finance: {
          totalIncome: income || 0,
          totalExpense: expense || 0,
          openInvoices: invoices || 0,
          incomeTrend: 5.2, // These would come from comparison with previous period
          expenseTrend: -2.1,
          profitTrend: 8.3,
          cashFlow: (income || 0) - (expense || 0)
        }
      };
    } else if (userRole === 4) { // HR role
      const [employees, departments, openPositions, candidates, interviews, hires] = await Promise.all([
        // db.user.count(),
        db.user.findAll({}),
        // db.role.count(),
        // db.department.count(),
        db.department.findAll({}),
        db.jobrequisition.count({ where: { status: 'open' } }),
        db.candidate.count(),
        db.interview.count(),
        db.candidate.count({ where: { status: 'Hired' } })
      ]);
      
      roleStats = {
        hr: {
          totalEmployees: employees,
          totalDepartments: departments,
          openPositions: openPositions,
          candidates: candidates, 
          interviews: interviews, 
          hires: hires,
          recentHires: 3 // Would come from actual data
        }
      };
    }
    
    res.json({
      ...userStats,
      ...roleStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};