const express = require('express');
const { getInventory, addInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getInventory);
router.post('/', auth, addInventory);
router.put('/:id', auth, updateInventory);
router.delete('/:id', auth, deleteInventory);

module.exports = router;