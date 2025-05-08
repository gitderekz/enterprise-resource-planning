const db = require('../models');
const Task = db.task;

const createTasks = async ({ name, description, assigned_to, due_date }) => {
  const createdTasks = [];

  for (const employee_id of assigned_to) {
    const task = await Task.create({
      name,
      description,
      assigned_to: employee_id,
      due_date,
    });
    createdTasks.push(task);
  }

  return createdTasks;
};

module.exports = { createTasks };
