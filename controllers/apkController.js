const supabase = require('../config/supabase');

// 1. Ambil Semua APK Aktif (Public)
// Get All APKs (Publik hanya aktif, Admin semua)
const getAllApks = async (req, res) => {
  try {
    const { include_inactive } = req.query;
    
    let query = supabase
      .from('apks')
      .select('*, download_servers(*)')
      .order('created_at', { ascending: false });

    // Jika BUKAN permintaan dari admin, tampilkan yang aktif saja
    if (include_inactive !== 'true') {
      query = query.eq('is_active', true);
    }

    const { data: apks, error } = await query;

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({
      status: 'success',
      results: apks.length,
      data: apks
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Toggle Status APK (Aktif/Nonaktif)
const updateApkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const { data, error } = await supabase
      .from('apks')
      .update({ is_active, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({
      status: 'success',
      message: `Status APK berhasil diubah menjadi ${is_active ? 'Aktif' : 'Nonaktif'}`,
      data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Ambil Detail APK Berdasarkan Slug (Public)
const getApkBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: apk, error } = await supabase
      .from('apks')
      .select('*, download_servers(*)')
      .eq('slug', slug)
      .single();

    if (error || !apk) {
      return res.status(404).json({ status: 'fail', message: 'APK tidak ditemukan.' });
    }

    // Filter server download agar publik hanya bisa lihat yang is_active = true
    if (apk.download_servers) {
      apk.download_servers = apk.download_servers.filter(server => server.is_active);
    }

    res.json({ status: 'success', data: apk });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. Tambah APK Baru (Admin Only)
const createApk = async (req, res) => {
  try {
    const { title, slug, icon_url, description, version, file_size, developer, category, mod_features } = req.body;

    if (!title || !slug || !version) {
      return res.status(400).json({ status: 'fail', message: 'Title, slug, dan version wajib diisi.' });
    }

    const { data, error } = await supabase
      .from('apks')
      .insert([
        { title, slug, icon_url, description, version, file_size, developer, category, mod_features }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.status(201).json({ status: 'success', message: 'APK berhasil ditambahkan!', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. Update APK (Admin Only)
const updateApk = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('apks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({ status: 'success', message: 'APK berhasil diperbarui!', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. Hapus APK (Admin Only)
// Hapus APK beserta seluruh relasi server & traffic log-nya
const deleteApk = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'ID APK wajib diisi.' });
    }

    console.log(`[DEBUG DELETE] Memulai proses hapus APK ID: ${id}`);

    // 1. Hapus server download terkait
    const { error: serverErr } = await supabase.from('download_servers').delete().eq('apk_id', id);
    if (serverErr) {
      console.error('[DEBUG DELETE ERROR - SERVERS]:', serverErr);
      return res.status(400).json({ status: 'fail', message: 'Gagal hapus download_servers: ' + serverErr.message });
    }

    // 2. Hapus log traffic terkait
    const { error: trafficErr } = await supabase.from('traffic_logs').delete().eq('apk_id', id);
    if (trafficErr) {
      console.error('[DEBUG DELETE ERROR - TRAFFIC]:', trafficErr);
      return res.status(400).json({ status: 'fail', message: 'Gagal hapus traffic_logs: ' + trafficErr.message });
    }

    // 3. Hapus APK utama
    const { data, error: apkDeleteError } = await supabase
      .from('apks')
      .delete()
      .eq('id', id)
      .select();

    if (apkDeleteError) {
      console.error('[DEBUG DELETE ERROR - APKS]:', apkDeleteError);
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Gagal menghapus APK: ' + apkDeleteError.message 
      });
    }

    console.log('[DEBUG DELETE SUCCESS]: Data terhapus:', data);

    res.json({
      status: 'success',
      message: 'APK beserta seluruh data server dan log berhasil dihapus!',
      data
    });
  } catch (err) {
    console.error('[DEBUG DELETE CATCH ERROR]:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// 6. Toggle Aktif/Nonaktif APK (Admin Only)
const toggleApkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ status: 'fail', message: 'Status is_active harus berupa boolean (true/false).' });
    }

    const { data, error } = await supabase
      .from('apks')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }

    res.json({ status: 'success', message: `APK berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}.`, data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getAllApks,
  getApkBySlug,
  createApk,
  updateApk,
  deleteApk,
  toggleApkStatus
};
