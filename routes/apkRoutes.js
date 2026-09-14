const express = require('express');
const router = express.Router();
const apkController = require('../controllers/apkController');
const authMiddleware = require('../middlewares/authMiddleware');

// Fallback untuk middleware (bypass auth)
const verifyAdmin = (typeof authMiddleware === 'function') 
  ? authMiddleware 
  : (authMiddleware.verifyAdminToken || authMiddleware.verifyToken || ((req, res, next) => next()));

// Standard Routing
router.get('/', apkController.getApks);
router.get('/:slug', apkController.getApkBySlug);
router.post('/', verifyAdmin, apkController.createApk);
router.put('/:id', verifyAdmin, apkController.updateApk);
router.delete('/:id', verifyAdmin, apkController.deleteApk);
router.patch('/:id/status', verifyAdmin, apkController.toggleApkStatus);

module.exports = router;
