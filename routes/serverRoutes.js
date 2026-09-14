const express = require('express');
const router = express.Router();
const {
  addServer,
  getServersByApkId,
  updateServer,
  deleteServer,
  toggleServerStatus
} = require('../controllers/serverController');
const requireAdminAuth = require('../middleware/authMiddleware');

// Semua route manajemen server memerlukan autentikasi Admin
router.post('/', requireAdminAuth, addServer);
router.get('/apk/:apkId', requireAdminAuth, getServersByApkId);
router.put('/:id', requireAdminAuth, updateServer);
router.delete('/:id', requireAdminAuth, deleteServer);
router.patch('/:id/status', requireAdminAuth, toggleServerStatus);

module.exports = router;
