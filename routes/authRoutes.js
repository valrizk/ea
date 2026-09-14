const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Pastikan 'login' adalah fungsi callback yang valid
router.post('/login', login);

module.exports = router;
