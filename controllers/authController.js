// Auth Controller Tanpa JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vriz@vrizmods.local';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email atau password admin salah!'
      });
    }

    res.json({
      status: 'success',
      message: 'Login Admin berhasil!',
      data: {
        access_token: 'dummy-simple-token-2026',
        user: { email: ADMIN_EMAIL, role: 'admin' }
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { login };
