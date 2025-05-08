const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const db = require('../models');
const User = db.user; // use lowercase if model name is defined as 'user'
const Role = db.role; // use lowercase if model name is defined as 'user'


// Register a new user
const register = async (req, res) => {
    const { username, email, password, role_id=6 } = req.body;

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
// // Register route
// router.post('/register', async (req, res) => {
//     try {
//       const { name, email, password } = req.body;
      
//       // Check if user exists
//       const existingUser = await db.User.findOne({ where: { email } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       // Create user
//       const user = await db.User.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: 'user' // Default role
//       });
  
//       // Generate tokens
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       console.error('Registration error:', error);
//       res.status(500).json({ message: 'Registration failed' });
//     }
//   });

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
            expiresIn: '24h',
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

  
  // Forgot password route
  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      
      // Find user
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate reset token (expires in 1 hour)
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
      
      // In a real app, you would send an email here with the reset link
      // For now, we'll just return the token (in production, don't do this)
      res.json({ 
        message: 'Reset link sent to email',
        token: resetToken // Only for development!
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process request' });
    }
  };
  
  // Verify reset token
  const verifyResetToken = async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
  
      // Verify token
      jwt.verify(token, process.env.JWT_RESET_SECRET);
      
      res.json({ valid: true });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };
  
  // Reset password
  const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      
      // Find user
      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await user.update({ password: hashedPassword });
      
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(400).json({ message: 'Failed to reset password' });
    }
  };

module.exports = { register, login, forgotPassword, resetPassword, verifyResetToken };
