const db = require('../models');

const getDepartments = async (req, res) => {
  try {
    const departments = await db.department.findAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments', error: err.message });
  }
};

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await db.department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching department', error: err.message });
  }
};

const createDepartment = async (req, res) => {
  const { name, description, permissions } = req.body;

  try {
    const department = await db.department.create({
      name,
      description,
      permissions
    });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: 'Error creating department', error: err.message });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;

  try {
    const department = await db.department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name || department.name;
    department.description = description || department.description;
    department.permissions = permissions || department.permissions;

    await department.save();
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: 'Error updating department', error: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await db.department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department', error: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};