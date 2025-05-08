const express = require('express');
// const { getUsers } = require('../controllers/userController');
// const auth = require('../middleware/auth');
const db = require('../models');
const User = db.user; // use lowercase if model name is defined as 'user'
const Role = db.role; // use lowercase if model name is defined as 'user'

const router = express.Router();

// router.get('/', auth, getUsers);
router.get('/', async (req, res) => {
    try {
        // const users = await User.findAll();
        // const roles = await Role.findAll();
        const users = await User.count();
        const roles = await Role.count();
        const [openPositions, candidates, interviews, hires] = await Promise.all([
            db.JobRequisition.count({ where: { status: 'Open' } }),
            db.Candidate.count(),
            db.Interview.count(),
            db.Candidate.count({ where: { status: 'Hired' } })
        ]);
        res.json({users, roles, openPositions, candidates, interviews, hires});
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

module.exports = router;