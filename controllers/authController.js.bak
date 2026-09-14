const supabase = require('../config/supabase');

// Controller untuk Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input sederhana
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email dan password wajib diisi.'
      });
    }

    // Melakukan autentikasi via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email atau password salah.'
      });
    }

    // Mengembalikan access token (JWT) dan data user jika sukses
    return res.status(200).json({
      status: 'success',
      message: 'Login Admin berhasil!',
      data: {
        access_token: data.session.access_token,
        token_type: data.session.token_type,
        expires_in: data.session.expires_in,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

module.exports = {
  loginAdmin
};
