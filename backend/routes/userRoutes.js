const express = require('express');
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getEmployees,
  getEmployeeStats,
  bulkUpdateUsers,
  generateReport,
  getRecentReports,
  deleteReport
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/employees', auth, getEmployees);
router.get('/stats', auth, getEmployeeStats);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);
router.put('/bulk-update', auth, bulkUpdateUsers);
router.delete('/:id', auth, deleteUser);
router.post('/reports', auth, generateReport);
router.get('/reports/recent', auth, getRecentReports);

module.exports = router;