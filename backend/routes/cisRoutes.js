const express = require('express');
const router = express.Router();
const cisController = require('../controllers/cisController');
const auth = require('../middleware/auth');

// Scheme routes
router.get('/schemes', auth, cisController.getAllSchemes);
router.post('/schemes', auth, cisController.createScheme);
router.get('/schemes/:id', auth, cisController.getScheme);
router.put('/schemes/:id', auth, cisController.updateScheme);
router.delete('/schemes/:id', auth, cisController.deleteScheme);

// Investment routes
router.get('/investments', auth, cisController.getAllInvestments);
router.post('/investments', auth, cisController.createInvestment);
router.get('/investments/:id', auth, cisController.getInvestment);
router.put('/investments/:id', auth, cisController.updateInvestment);
router.delete('/investments/:id', auth, cisController.deleteInvestment);

// NAV routes
router.get('/nav/:schemeId', auth, cisController.getNAVHistory);
router.post('/nav', auth, cisController.createNAVRecord);

// Reports
router.get('/reports/summary', auth, cisController.getCISSummary);
router.get('/reports/performance', auth, cisController.getPerformanceReport);

module.exports = router;