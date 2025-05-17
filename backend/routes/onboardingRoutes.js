const express = require('express');
const {
  getOnboardings,
  getOnboardingById,
  createOnboarding,
  updateOnboarding,
  deleteOnboarding,
  getOnboardingTasks,
  createOnboardingTask,
  updateOnboardingTask,
  deleteOnboardingTask,
  getOnboardingStats,
  getUpcomingOnboardings
} = require('../controllers/onboardingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Onboarding routes
router.get('/', auth, getOnboardings);
router.get('/upcoming', auth, getUpcomingOnboardings);
router.get('/stats', auth, getOnboardingStats);
router.get('/:id', auth, getOnboardingById);
router.post('/', auth, createOnboarding);
router.put('/:id', auth, updateOnboarding);
router.delete('/:id', auth, deleteOnboarding);

// Onboarding task routes
router.get('/:id/tasks', auth, getOnboardingTasks);
router.post('/:id/tasks', auth, createOnboardingTask);
router.put('/tasks/:taskId', auth, updateOnboardingTask);
router.delete('/tasks/:taskId', auth, deleteOnboardingTask);

module.exports = router;