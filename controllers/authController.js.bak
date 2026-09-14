const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vrizmods_secret_key_2026';

// Endpoint Login Admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kredensial Admin VRIZMODS
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vriz@vrizmods.local';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email atau password admin salah!'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { role: 'admin', email: ADMIN_EMAIL },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Login Admin berhasil!',
      data: {
        access_token: token,
        user: { email: ADMIN_EMAIL, role: 'admin' }
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { login };
