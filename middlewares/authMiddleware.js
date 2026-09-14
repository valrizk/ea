// Middleware Tanpa JWT (Bypass Auth untuk Vercel Serverless)
const verifyAdminToken = (req, res, next) => {
  // Langsung teruskan request tanpa cek token
  next();
};

module.exports = { 
  verifyAdminToken, 
  verifyToken: verifyAdminToken, 
  authenticateToken: verifyAdminToken 
};
