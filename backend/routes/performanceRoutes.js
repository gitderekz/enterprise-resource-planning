const express = require('express');
const {
  getPerformanceReviews,
  getPerformanceReviewById,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  getPerformanceMetrics,

  getPerformanceSettings,
  updatePerformanceSettings,
  getPerformanceCriteria,
  updatePerformanceCriteria
} = require('../controllers/performanceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/settings', auth, getPerformanceSettings);
router.put('/settings', auth, updatePerformanceSettings);
router.get('/criteria', auth, getPerformanceCriteria);
router.put('/criteria', auth, updatePerformanceCriteria);

router.get('/', auth, getPerformanceReviews);
router.get('/metrics', auth, getPerformanceMetrics);
router.get('/:id', auth, getPerformanceReviewById);
router.post('/', auth, createPerformanceReview);
router.put('/:id', auth, updatePerformanceReview);
router.delete('/:id', auth, deletePerformanceReview);

module.exports = router;