const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  verifyEmail
} = require('../controllers/authController');

const router = express.Router();

// Import auth middleware
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;