const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyAdmin = authMiddleware.verifyAdminToken || authMiddleware.verifyToken || authMiddleware;

// Route khusus Admin (Membutuhkan Token Admin)
router.get('/stats', requireAdminAuth, getDashboardStats);

module.exports = router;
