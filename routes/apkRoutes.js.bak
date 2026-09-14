const express = require('express');
const router = express.Router();
const {
  getAllApks,
  getApkBySlug,
  createApk,
  updateApk,
  deleteApk,
  toggleApkStatus
} = require('../controllers/apkController');
const requireAdminAuth = require('../middleware/authMiddleware');

// Route Publik
router.get('/', getAllApks);
router.get('/:slug', getApkBySlug);

// Route Admin
router.post('/', requireAdminAuth, createApk);
router.put('/:id', requireAdminAuth, updateApk);
router.delete('/:id', requireAdminAuth, deleteApk);
router.patch('/:id/status', requireAdminAuth, toggleApkStatus);

module.exports = router;
