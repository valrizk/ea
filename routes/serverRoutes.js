const express = require('express');
const router = express.Router();
const {
  addServer,
  getServersByApkId,
  updateServer,
  deleteServer,
  toggleServerStatus
} = require('../controllers/serverController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyAdmin = authMiddleware.verifyAdminToken || authMiddleware.verifyToken || authMiddleware;


// Semua route manajemen server memerlukan autentikasi Admin
router.post('/', requireAdminAuth, addServer);
router.get('/apk/:apkId', requireAdminAuth, getServersByApkId);
router.put('/:id', requireAdminAuth, updateServer);
router.delete('/:id', requireAdminAuth, deleteServer);
router.patch('/:id/status', requireAdminAuth, toggleServerStatus);

module.exports = router;
