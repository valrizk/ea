require('dotenv').config();

const express = require('express');
const path = require('path');
const supabase = require('./config/supabase');
const authRoutes = require('./routes/authRoutes');
const apkRoutes = require('./routes/apkRoutes');
const serverRoutes = require('./routes/serverRoutes');
const trafficRoutes = require('./routes/trafficRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Logger Middleware untuk Terminal Termux
app.use((req, res, next) => {
  console.log(`[TERMINAL LOG] ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// Serving File Statis
app.use('/media', express.static(path.join(__dirname, 'media')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes Utama
app.use('/api/auth', authRoutes);
app.use('/api/apks', apkRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback Route SPA Publik
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ status: 'fail', message: 'Endpoint API tidak ditemukan.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware Handler Error URI
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    return res.status(400).json({
      status: 'fail',
      message: 'URL tidak valid atau mengandung karakter terlarang.'
    });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Server VRIZMODS aktif di http://localhost:${PORT}`);
  console.log(`=================================================`);
});
