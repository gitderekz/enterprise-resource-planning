const express = require('express');
const { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} = require('../controllers/departmentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getDepartments);
router.get('/:id', auth, getDepartmentById);
router.post('/', auth, createDepartment);
router.put('/:id', auth, updateDepartment);
router.delete('/:id', auth, deleteDepartment);

module.exports = router;