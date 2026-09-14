const express = require('express');
const router = express.Router();
const { recordView, processDownload } = require('../controllers/trafficController');

// Route Publik (Bisa diakses tanpa token admin)
router.post('/view/:apkId', recordView);
router.get('/download/:apkId', processDownload);

module.exports = router;
