const db = require('../models');

// Get all onboardings
const getOnboardings = async (req, res) => {
  try {
    const onboardings = await db.onboarding.findAll({
      include: [
        { model: db.candidate, as: 'candidate' },
        { model: db.user, as: 'assignedUser' }
      ]
    });
    res.json(onboardings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching onboardings', error: err.message });
  }
};

// Get onboarding by ID
const getOnboardingById = async (req, res) => {
  try {
    const onboarding = await db.onboarding.findByPk(req.params.id, {
      include: [
        { model: db.candidate, as: 'candidate' },
        { model: db.user, as: 'assignedUser' },
        { model: db.onboardingtask, as: 'tasks' }
      ]
    });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding not found' });
    }
    res.json(onboarding);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching onboarding', error: err.message });
  }
};

// Create onboarding
const createOnboarding = async (req, res) => {
  try {
    const onboarding = await db.onboarding.create(req.body);
    res.status(201).json(onboarding);
  } catch (err) {
    res.status(500).json({ message: 'Error creating onboarding', error: err.message });
  }
};

// Update onboarding
const updateOnboarding = async (req, res) => {
  try {
    const onboarding = await db.onboarding.findByPk(req.params.id);
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding not found' });
    }
    await onboarding.update(req.body);
    res.json(onboarding);
  } catch (err) {
    res.status(500).json({ message: 'Error updating onboarding', error: err.message });
  }
};

// Delete onboarding
const deleteOnboarding = async (req, res) => {
  try {
    const onboarding = await db.onboarding.findByPk(req.params.id);
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding not found' });
    }
    await onboarding.destroy();
    res.json({ message: 'Onboarding deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting onboarding', error: err.message });
  }
};

// Get onboarding tasks
const getOnboardingTasks = async (req, res) => {
  try {
    const tasks = await db.onboardingtask.findAll({
      where: { onboardingId: req.params.id },
      include: [{ model: db.user, as: 'assignedUser' }]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

// Create onboarding task
const createOnboardingTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({ message: 'Assigned user is required' });
    }

    const task = await db.onboardingtask.create({
      ...req.body,
      onboardingId: req.params.id
    });
    
    // Fetch the created task with assigned user details
    const createdTask = await db.onboardingtask.findByPk(task.id, {
      include: [{ model: db.user, as: 'assignedUser' }, {model: db.onboarding, as: 'onboarding'}]
    });

    res.status(201).json(createdTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Update onboarding task
const updateOnboardingTask = async (req, res) => {
  try {
    const task = await db.onboardingtask.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate assignedTo if it's being updated
    if (req.body.assignedTo !== undefined && !req.body.assignedTo) {
      return res.status(400).json({ message: 'Assigned user is required' });
    }

    await task.update(req.body);
    
    // Fetch the updated task with assigned user details
    const updatedTask = await db.onboardingtask.findByPk(task.id, {
      include: [{ model: db.user, as: 'assignedUser' }]
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete onboarding task
const deleteOnboardingTask = async (req, res) => {
  try {
    const task = await db.onboardingtask.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

// Get onboarding statistics
const getOnboardingStats = async (req, res) => {
  try {
    const stats = {
      total: await db.onboarding.count(),
      pending: await db.onboarding.count({ where: { status: 'pending' } }),
      in_progress: await db.onboarding.count({ where: { status: 'in_progress' } }),
      completed: await db.onboarding.count({ where: { status: 'completed' } }),
      on_hold: await db.onboarding.count({ where: { status: 'on_hold' } }),
      byStage: await db.onboarding.findAll({
        attributes: [
          'currentStage',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
        ],
        group: ['currentStage'],
        raw: true
      })
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching onboarding stats', error: err.message });
  }
};

// Get upcoming onboardings
const getUpcomingOnboardings = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const onboardings = await db.onboarding.findAll({
      where: {
        startDate: {
          [db.Sequelize.Op.between]: [today, nextWeek]
        }
      },
      include: [
        { model: db.candidate, as: 'candidate' },
        { model: db.user, as: 'assignedUser' }
      ],
      order: [['startDate', 'ASC']],
      limit: 10
    });
    res.json(onboardings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching upcoming onboardings', error: err.message });
  }
};

module.exports = {
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
};