const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const requireAdminAuth = require('../middleware/authMiddleware');

// Route khusus Admin (Membutuhkan Token Admin)
router.get('/stats', requireAdminAuth, getDashboardStats);

module.exports = router;
