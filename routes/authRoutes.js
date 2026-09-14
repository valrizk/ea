const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
const requireAdminAuth = require('../middleware/authMiddleware');

// Endpoint POST /api/auth/login
router.post('/login', loginAdmin);

// Endpoint GET /api/auth/me (Untuk tes status login & verifikasi middleware)
router.get('/me', requireAdminAuth, (req, res) => {
  res.json({
    status: 'success',
    message: 'Token valid. Kamu terautentikasi sebagai Admin!',
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

module.exports = router;
