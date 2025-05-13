const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser, getEmployees } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/employees', auth, getEmployees);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;