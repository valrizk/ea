const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'vrizmods_secret_key_2026';

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Token otentikasi tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 'fail', message: 'Token tidak valid atau kadaluarsa.' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyAdminToken, verifyToken: verifyAdminToken, authenticateToken: verifyAdminToken };
