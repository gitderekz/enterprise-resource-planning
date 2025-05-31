const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middleware/auth');

// Finance routes
// Categories and metadata
router.get('/categories', auth, financeController.getCategories);
router.get('/accounts', auth, financeController.getAccounts);


// router.get('/comparison', auth, financeController.getComparisonData);
router.get('/comparison', auth, financeController.getFinancialComparison);

// Reports
router.get('/reports/summary', auth, financeController.getFinancialSummary);
router.get('/reports/income-statement', auth, financeController.getIncomeStatement);
router.get('/reports/balance-sheet', auth, financeController.getBalanceSheet);
router.get('/reports/cash-flow', auth, financeController.getCashFlowReport);
router.get('/reports/income-expense', auth, financeController.getIncomeExpenseReport);
router.get('/reports/budget-vs-actual', auth, financeController.getBudgetVsActual);

// Export endpoints
router.get('/export/csv', auth, financeController.exportToCSV);
router.get('/export/excel', auth, financeController.exportToExcel);
router.get('/export/pdf', auth, financeController.exportToPDF);

// Basic CRUD operations
router.get('/', auth, financeController.getAllFinanceRecords);
router.post('/', auth, financeController.createFinanceRecord);
router.get('/:id', auth, financeController.getFinanceRecord);
router.put('/:id', auth, financeController.updateFinanceRecord);
router.delete('/:id', auth, financeController.deleteFinanceRecord);

module.exports = router;