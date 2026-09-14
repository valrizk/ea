const supabase = require('../config/supabase');

const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token menggunakan Supabase Client
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token tidak valid atau sudah kadaluwarsa.'
      });
    }

    // Simpan data user di object request agar bisa digunakan di controller selanjutnya
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

module.exports = requireAdminAuth;
