// backend/routes/menuRoutes.js
const express = require('express');
const db = require('../models');
const Menu = db.menu;
const auth = require('../middleware/auth');

const router = express.Router();

// Fetch menu items for the logged-in user
// router.get('/', auth, async (req, res) => {
router.get('/', async (req, res) => {
  try {
    // const menuItems = await Menu.findAll({ where: { role_id: req.user.role_id } });
    const menuItems = await Menu.findAll({});
    
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items', error: err.message });
  }
});

module.exports = router;