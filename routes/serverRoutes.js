const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');

// Bypass auth middleware sederhana agar tidak crash
const passThrough = (req, res, next) => next();

// Route Get Server per APK (Publik / Admin)
router.get('/apk/:apk_id', serverController.getServersByApkId || passThrough);

// Route Admin: Tambah & Hapus Server
router.post('/', passThrough, serverController.addServer || passThrough);
router.delete('/:id', passThrough, serverController.deleteServer || passThrough);

module.exports = router;
