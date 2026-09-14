const supabase = require('../config/supabase');

// 1. Catat View APK (Bisa pakai ID atau Slug)
const recordView = async (req, res) => {
  try {
    const { apkId } = req.params;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (!apkId) {
      return res.status(400).json({ status: 'fail', message: 'apkId / slug wajib diisi.' });
    }

    // Cari APK berdasarkan ID (UUID) ATAU Slug
    let query = supabase.from('apks').select('id, view_count');
    
    // Cek apakah apkId berformat UUID atau Slug string
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apkId);
    
    if (isUuid) {
      query = query.eq('id', apkId);
    } else {
      query = query.eq('slug', apkId);
    }

    const { data: apks, error: apkError } = await query;

    if (apkError || !apks || apks.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'APK tidak ditemukan.' });
    }

    const currentApk = apks[0];
    const newViewCount = (Number(currentApk.view_count) || 0) + 1;

    // Catat log ke traffic_logs
    await supabase.from('traffic_logs').insert([
      { apk_id: currentApk.id, event_type: 'view', user_agent: userAgent }
    ]);

    // Update view_count di tabel apks
    const { error: updateError } = await supabase
      .from('apks')
      .update({ view_count: newViewCount })
      .eq('id', currentApk.id);

    if (updateError) {
      return res.status(400).json({ status: 'fail', message: updateError.message });
    }

    res.json({
      status: 'success',
      message: 'View berhasil dicatat.',
      view_count: newViewCount
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Catat Download & Ambil URL Download Aktif
const processDownload = async (req, res) => {
  try {
    const { apkId } = req.params;
    const { server_id } = req.query;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (!apkId) {
      return res.status(400).json({ status: 'fail', message: 'apkId / slug wajib diisi.' });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apkId);
    let query = supabase.from('apks').select('id, download_count, is_active');
    
    if (isUuid) {
      query = query.eq('id', apkId);
    } else {
      query = query.eq('slug', apkId);
    }

    const { data: apks, error: apkError } = await query;

    if (apkError || !apks || apks.length === 0 || !apks[0].is_active) {
      return res.status(404).json({ status: 'fail', message: 'APK tidak ditemukan atau tidak aktif.' });
    }

    const currentApk = apks[0];

    // Cari server download aktif
    let serverQuery = supabase
      .from('download_servers')
      .select('*')
      .eq('apk_id', currentApk.id)
      .eq('is_active', true);

    if (server_id) {
      serverQuery = serverQuery.eq('id', server_id);
    }

    const { data: servers, error: serverError } = await serverQuery;

    if (serverError || !servers || servers.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tidak ada server download aktif yang tersedia untuk APK ini.'
      });
    }

    const targetServer = servers[0];
    const newDownloadCount = (Number(currentApk.download_count) || 0) + 1;

    // Catat log traffic download
    await supabase.from('traffic_logs').insert([
      { apk_id: currentApk.id, event_type: 'download', user_agent: userAgent }
    ]);

    // Update download_count di tabel apks
    await supabase
      .from('apks')
      .update({ download_count: newDownloadCount })
      .eq('id', currentApk.id);

    res.json({
      status: 'success',
      message: 'Download berhasil dicatat.',
      download_url: targetServer.download_url,
      server_name: targetServer.server_name,
      download_count: newDownloadCount
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  recordView,
  processDownload
};
