const express = require('express');
const { login, register } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

// New endpoints for token verification
router.get('/verify', auth, (req, res) => {
    res.json({ valid: true, user: req.user });
});

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    // Implement your refresh token logic here
    // Return new access token if refresh token is valid
});
  
module.exports = router;