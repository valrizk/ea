const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const passThrough = (req, res, next) => next();

// Route Stats Admin Dashboard
router.get('/stats', passThrough, dashboardController.getDashboardStats || passThrough);

module.exports = router;
