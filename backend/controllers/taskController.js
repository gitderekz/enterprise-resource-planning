const Task = require('../models/Task');

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { name, description, assigned_to, due_date } = req.body;

    try {
        const task = await Task.create({
            name,
            description,
            assigned_to,
            due_date,
        });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};

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