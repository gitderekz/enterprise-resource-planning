const express = require('express');
const { 
  getTimetableData,
  createShift,
  updateShift,
  deleteShift,
  getShiftCoverage,
  createTimeOffRequest,
  approveTimeOffRequest,
  createShiftSwap,
  exportTimetable
} = require('../controllers/timetableController');
const auth = require('../middleware/auth');

const router = express.Router();

// Timetable routes
router.get('/', auth, getTimetableData);
router.post('/shifts', auth, createShift);
router.put('/shifts/:id', auth, updateShift);
router.delete('/shifts/:id', auth, deleteShift);
router.post('/shift-swap', auth, createShiftSwap);
// Shift coverage
router.get('/coverage', auth, getShiftCoverage);

// Time off requests
router.post('/time-off', auth, createTimeOffRequest);
router.put('/time-off/:id/approve', auth, approveTimeOffRequest);

// Export routes
router.get('/export/pdf', auth, exportTimetable('pdf'));
router.get('/export/excel', auth, exportTimetable('excel'));
router.get('/export/csv', auth, exportTimetable('csv'));

module.exports = router;