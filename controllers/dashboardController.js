const supabase = require('../config/supabase');

// Mengambil Ringkasan Statistik untuk Dashboard Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Hitung Total APK & APK Aktif
    const { count: totalApks } = await supabase
      .from('apks')
      .select('id', { count: 'exact', head: true });

    const { count: activeApks } = await supabase
      .from('apks')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // 2. Hitung Total View & Total Download Keseluruhan dari Tabel apks
    const { data: apksStats } = await supabase
      .from('apks')
      .select('view_count, download_count');

    let totalViews = 0;
    let totalDownloads = 0;

    if (apksStats) {
      apksStats.forEach(apk => {
        totalViews += Number(apk.view_count) || 0;
        totalDownloads += Number(apk.download_count) || 0;
      });
    }

    // 3. Top 5 APK Paling Banyak Dilihat (Most Viewed)
    const { data: topViewed } = await supabase
      .from('apks')
      .select('id, title, slug, icon_url, view_count')
      .order('view_count', { ascending: false })
      .limit(5);

    // 4. Top 5 APK Paling Banyak Didownload (Most Downloaded)
    const { data: topDownloaded } = await supabase
      .from('apks')
      .select('id, title, slug, icon_url, download_count')
      .order('download_count', { ascending: false })
      .limit(5);

    // 5. Log Traffic Terbaru (10 Log Terakhir)
    const { data: recentLogs } = await supabase
      .from('traffic_logs')
      .select('id, event_type, created_at, apks(title, slug)')
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      status: 'success',
      data: {
        summary: {
          total_apks: totalApks || 0,
          active_apks: activeApks || 0,
          total_views: totalViews,
          total_downloads: totalDownloads
        },
        top_viewed: topViewed || [],
        top_downloaded: topDownloaded || [],
        recent_activity: recentLogs || []
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getDashboardStats
};
