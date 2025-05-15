const express = require('express');
const {
  checkIn,
  checkOut,
  getUserAttendanceStats,
  getAllAttendance,
  generateAttendanceReport,
  sendReminder,
  deductSalaryForAbsences
} = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Employee routes
router.post('/check-in', auth, checkIn);
router.post('/check-out', auth, checkOut);
router.get('/stats/:id?', auth, getUserAttendanceStats);

// Admin routes
router.get('/', auth, getAllAttendance);
router.get('/report', auth, generateAttendanceReport);
router.post('/send-reminder', auth, sendReminder);
router.post('/deduct-salary', auth, deductSalaryForAbsences);

module.exports = router;