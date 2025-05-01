const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const db = require('../models');
const User = db.user; // use lowercase if model name is defined as 'user'
const Role = db.role; // use lowercase if model name is defined as 'user'


// Register a new user
const register = async (req, res) => {
    const { username, email, password, role_id } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role_id,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
          });        

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT Secret is missing' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            token,
            user: {
              id: user.id,
              email: user.email,
              role_id: user.role_id,
              role: user.role ? user.role.name : null,
              username: user.username
            }
          });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

module.exports = { register, login };
