const supabase = require('../config/supabase');

// 1. Tambah Server Download Baru untuk APK tertentu (Admin Only)
const addServer = async (req, res) => {
  try {
    const { apk_id, server_name, download_url } = req.body;

    if (!apk_id || !server_name || !download_url) {
      return res.status(400).json({
        status: 'fail',
        message: 'apk_id, server_name, dan download_url wajib diisi.'
      });
    }

    const { data, error } = await supabase
      .from('download_servers')
      .insert([{ apk_id, server_name, download_url }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.status(201).json({
      status: 'success',
      message: 'Server download berhasil ditambahkan!',
      data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Ambil Semua Server Download milik 1 APK (Admin Only)
const getServersByApkId = async (req, res) => {
  try {
    const { apkId } = req.params;

    const { data, error } = await supabase
      .from('download_servers')
      .select('*')
      .eq('apk_id', apkId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({ status: 'success', results: data.length, data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. Update Data Server Download (Admin Only)
const updateServer = async (req, res) => {
  try {
    const { id } = req.params;
    const { server_name, download_url, is_active } = req.body;

    const { data, error } = await supabase
      .from('download_servers')
      .update({ server_name, download_url, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({
      status: 'success',
      message: 'Server download berhasil diperbarui!',
      data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. Hapus Server Download (Admin Only)
const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('download_servers')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({ status: 'success', message: 'Server download berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. Toggle Aktif/Nonaktifkan Server Download (Admin Only)
const toggleServerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        status: 'fail',
        message: 'is_active harus berupa boolean (true/false).'
      });
    }

    const { data, error } = await supabase
      .from('download_servers')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({
      status: 'success',
      message: `Server download berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}.`,
      data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  addServer,
  getServersByApkId,
  updateServer,
  deleteServer,
  toggleServerStatus
};
