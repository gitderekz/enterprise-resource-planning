const db = require('../models');

const getRoles = async (req, res) => {
  try {
    const roles = await db.role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching roles', error: err.message });
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await db.role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching role', error: err.message });
  }
};

const createRole = async (req, res) => {
  const { name, description, permissions } = req.body;

  try {
    const role = await db.role.create({
      name,
      description,
      permissions
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: 'Error creating role', error: err.message });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;

  try {
    const role = await db.role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await db.role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting role', error: err.message });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};