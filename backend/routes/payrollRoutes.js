const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');
const deductionController = require('../controllers/deductionController');

// Payroll routes
router.get('/', auth, payrollController.getPayrollRecords);
router.post('/', auth, payrollController.runPayroll);
router.get('/summary', auth, payrollController.getPayrollSummary);
router.get('/export', auth, payrollController.exportPayrollReport);
router.put('/:id/status', auth, payrollController.updatePayrollStatus); // Add this new route

// Deduction routes
router.get('/deductions', auth, deductionController.getDeductions);
router.post('/deductions', auth, deductionController.addDeduction);
router.put('/deductions/:id', auth, deductionController.updateDeduction);
router.delete('/deductions/:id', auth, deductionController.deleteDeduction);

module.exports = router;