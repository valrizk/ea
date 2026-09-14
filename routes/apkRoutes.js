const express = require('express');
const router = express.Router();
const { 
  getApks, 
  getApkBySlug, 
  createApk, 
  updateApk, 
  deleteApk, 
  toggleApkStatus 
} = require('../controllers/apkController');

// Import middleware auth (Ambil fungsinya dari object)
const authMiddleware = require('../middlewares/authMiddleware');
const verifyAdmin = authMiddleware.verifyAdminToken || authMiddleware.verifyToken || authMiddleware;

// Public routes
router.get('/', getApks);
router.get('/:slug', getApkBySlug);

// Admin protected routes (Menggunakan verifyAdmin yang berupa FUNCTION)
router.post('/', verifyAdmin, createApk);
router.put('/:id', verifyAdmin, updateApk);
router.delete('/:id', verifyAdmin, deleteApk);
router.patch('/:id/status', verifyAdmin, toggleApkStatus);

module.exports = router;
