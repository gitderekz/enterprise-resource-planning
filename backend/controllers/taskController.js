const db = require('../models');
const Task = db.task; // use lowercase if model name is defined as 'user'
const NotificationService = require('../services/notificationService');
const { createTasks } = require('../services/taskService');

// Get all tasks
getTasks = async (req, res) => {
    // try {
    //     const tasks = await Task.findAll();
    //     res.json(tasks);
    // } catch (err) {
    //     res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    // }
    
  try {
    const tasks = await Task.findAll({
      where: { assigned_to: req.user.id }, // Only get tasks for logged in user
      order: [['due_date', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Create a new task
const createTask = async (req, res) => {
    const { name, description, assigned_to, due_date } = req.body;
    // let task;
    // try {
    //   // assigned_to.forEach(async employee_id => {
    //     task = await Task.create({
    //         name,
    //         description,
    //         assigned_to,//:employee_id,
    //         due_date,
    //     });
        
    //   // });
    //     res.status(201).json({ message: 'Task created successfully', task });
    // } catch (err) {
    //     res.status(500).json({ message: 'Error creating task', error: err.message });
    // }
    try {
      const tasks = await createTasks({ name, description, assigned_to, due_date });
      res.status(201).json({ message: 'Task(s) created successfully', tasks });
    } catch (err) {
      res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};
// const createTask = async (req, res) => {
//     try {
//       const task = await Task.create({
//         ...req.body,
//         createdBy: req.user.id
//       });
  
//       // Send notification to userIds
//       if (req.body.userIds && req.body.userIds.length > 0) {
//         await NotificationService.createNotification({
//           userIds: req.body.userIds,
//           type: 'task',
//           title: 'New Task Assigned',
//           message: `You have been assigned to "${req.body.name}"`,
//           link: `/tasks/${task.id}`,
//           metadata: {
//             senderId: req.user.id,
//             entityType: 'task',
//             entityId: task.id
//           }
//         });
//       }
  
//       res.status(201).json(task);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   };

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status || task.status;
        await task.save();
        res.json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };