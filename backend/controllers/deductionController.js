const db = require('../models');

// Get deductions with optional employee filter
const getDeductions = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    
    const deductions = await db.deduction.findAll({
      where,
      include: [{ model: db.user, as: 'employee' }]
    });
    
    res.json(deductions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deductions', error: err.message });
  }
};

// Add new deduction
const addDeduction = async (req, res) => {
  try {
    const { employeeId, type, amount, isPercentage, description } = req.body;
    
    const deduction = await db.deduction.create({
      userId:employeeId,
      employeeId,
      type,
      amount: parseFloat(amount),
      isPercentage,
      description
    });
    
    res.json(deduction);
  } catch (err) {
    res.status(500).json({ message: 'Error adding deduction', error: err.message });
  }
};

// Update deduction
const updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, isPercentage, description } = req.body;
    
    const deduction = await db.deduction.findByPk(id);
    if (!deduction) {
      return res.status(404).json({ message: 'Deduction not found' });
    }
    
    deduction.type = type;
    deduction.amount = parseFloat(amount);
    deduction.isPercentage = isPercentage;
    deduction.description = description;
    
    await deduction.save();
    res.json(deduction);
  } catch (err) {
    res.status(500).json({ message: 'Error updating deduction', error: err.message });
  }
};

// Delete deduction
const deleteDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deduction = await db.deduction.findByPk(id);
    if (!deduction) {
      return res.status(404).json({ message: 'Deduction not found' });
    }
    
    await deduction.destroy();
    res.json({ message: 'Deduction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting deduction', error: err.message });
  }
};

module.exports = {
  getDeductions,
  addDeduction,
  updateDeduction,
  deleteDeduction
};