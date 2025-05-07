const express = require('express');
const { login, register, forgotPassword, verifyResetToken, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);
// router.post('/send-verification-email', sendVerificationEmail);
// router.post('/verify-reset-token', verifyResetToken);

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