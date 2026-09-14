const supabase = require('../config/supabase');

// 1. Get All APKs
const getApks = async (req, res) => {
  try {
    const { include_inactive } = req.query;
    let query = supabase.from('apks').select('*').order('created_at', { ascending: false });
    if (include_inactive !== 'true') query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Get Single APK by Slug
const getApkBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase.from('apks').select('*, download_servers(*)').eq('slug', slug).single();
    if (error) return res.status(404).json({ status: 'fail', message: 'APK tidak ditemukan' });
    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. Create APK
const createApk = async (req, res) => {
  try {
    const { title, slug, icon_url, version, category, developer, file_size, mod_features, description } = req.body;
    const { data, error } = await supabase.from('apks').insert([{ title, slug, icon_url, version, category, developer, file_size, mod_features, description }]).select();
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    res.status(201).json({ status: 'success', data: data[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. Update APK
const updateApk = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('apks').update(req.body).eq('id', id).select();
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    res.json({ status: 'success', data: data[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. Delete APK (Beserta relasi server & traffic)
const deleteApk = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('download_servers').delete().eq('apk_id', id);
    await supabase.from('traffic_logs').delete().eq('apk_id', id);
    const { data, error } = await supabase.from('apks').delete().eq('id', id).select();
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    res.json({ status: 'success', message: 'APK berhasil dihapus', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 6. Toggle Status Aktif/Nonaktif
const toggleApkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const { data, error } = await supabase.from('apks').update({ is_active }).eq('id', id).select();
    if (error) return res.status(400).json({ status: 'fail', message: error.message });
    res.json({ status: 'success', data: data[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// EXPORT SEMUA FUNGSI TERSEBUT
module.exports = {
  getApks,
  getApkBySlug,
  createApk,
  updateApk,
  deleteApk,
  toggleApkStatus
};
