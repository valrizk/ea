/**
 * VRIZMODS FRONTEND ENGINE 2026
 * Pure Glassmorphism Tiered System + Dynamic Real Backend Fetch
 */
const API_BASE = '/api';

// Global App State
const state = {
  apks: [],
  filteredApks: [],
  categories: [],
  selectedCategory: 'All',
  searchQuery: '',
  loading: true,
  currentRoute: 'home',
  currentSlug: null
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();
  handleRouting();
  await fetchApksFromBackend();
}

function setupEventListeners() {
  const drawerSearch = document.getElementById('drawer-search-input');
  if (drawerSearch) {
    drawerSearch.addEventListener('input', (e) => {
      window.handleSearchInput(e.target.value);
    });
  }
}

// 1. FETCH API DATABASES
async function fetchApksFromBackend() {
  state.loading = true;
  renderView();
  try {
    const res = await fetch(`${API_BASE}/apks`);
    const result = await res.json();
    if (res.ok) {
      const rawData = Array.isArray(result) ? result : (result.data || result.apks || []);
      state.apks = rawData;
      extractCategories();
      applyFilters();
    } else {
      showToast('Gagal memuat data APK', 'error');
    }
  } catch (err) {
    showToast('Koneksi backend terputus', 'error');
  } finally {
    state.loading = false;
    renderView();
  }
}

function extractCategories() {
  const catSet = new Set(['All']);
  state.apks.forEach(apk => {
    if (apk.category) catSet.add(apk.category);
  });
  state.categories = Array.from(catSet);
  renderCategoryDrawer();
}

function applyFilters() {
  state.filteredApks = state.apks.filter(apk => {
    const title = apk.title || apk.name || '';
    const modFeatures = apk.mod_features || apk.features || '';
    const category = apk.category || '';
    
    const matchesCategory = state.selectedCategory === 'All' || category === state.selectedCategory;
    const matchesSearch = !state.searchQuery || 
      title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
      modFeatures.toLowerCase().includes(state.searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}

// 2. ROUTING SYSTEM
function handleRouting() {
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.startsWith('/apk/')) {
      state.currentRoute = 'detail';
      state.currentSlug = path.replace('/apk/', '');
    } else if (path === '/apks') {
      state.currentRoute = 'apks';
    } else {
      state.currentRoute = 'home';
    }
    renderView();
  });
}

window.scrollToPage = function(route, slug = null) {
  state.currentRoute = route;
  state.currentSlug = slug;
  if (route === 'detail' && slug) {
    window.history.pushState({}, '', `/apk/${slug}`);
  } else if (route === 'apks') {
    window.history.pushState({}, '', '/apks');
  } else {
    window.history.pushState({}, '', '/');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderView();
};

// 3. MAIN RENDER ENGINE
function renderView() {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  if (state.loading) {
    appRoot.innerHTML = renderSkeletonLoading();
    return;
  }

  if (state.currentRoute === 'detail' && state.currentSlug) {
    renderApkDetailPage(appRoot, state.currentSlug);
    return;
  }

  if (state.currentRoute === 'apks') {
    appRoot.innerHTML = renderApkListingPage();
    return;
  }

  appRoot.innerHTML = renderLandingPage();
}

// 4. VIEWS COMPONENTS (3D GLASSMORPHISM TIERED LAYERS)
function renderLandingPage() {
  const featured = state.apks.slice(0, 3);
  return `
    <!-- HERO SECTION (GLASS TIER 2 HERO PANEL) -->
    <section class="relative py-12 md:py-16 text-center">
      <div class="relative z-10 p-8 sm:p-12 rounded-3xl bg-slate-900/30 glass-effect-tier2 border border-white/15 shadow-glass-card max-w-5xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-400 mb-6 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Platform Mod APK Glassmorphism 2026
        </div>
        
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-100 max-w-4xl mx-auto">
          Unduh Game & Aplikasi Mod <br class="hidden sm:inline">
          <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            Layered Translucent Interface
          </span>
        </h1>
        
        <p class="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
          Pengalaman mengunduh file APK modifikasi dengan visual 3D frosted glass, responsif, dan terproteksi dari malware.
        </p>

        <!-- INSET GLASS SEARCH BAR -->
        <div class="mt-8 max-w-2xl mx-auto relative px-2">
          <div class="relative flex items-center">
            <input type="text" oninput="window.handleSearchInput(this.value)" value="${state.searchQuery}" placeholder="Cari game mod, MLBB, GTA, Canva..." class="w-full py-4 sm:py-4.5 pl-14 pr-32 bg-slate-950/70 shadow-glass-inset border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-sm sm:text-base">
            <i class="ph ph-magnifying-glass absolute left-5 text-2xl text-slate-400"></i>
            <button onclick="window.scrollToPage('apks')" class="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-500 hover:to-fuchsia-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-glow-blue hover:scale-105">
              Jelajah
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED APKS -->
    ${featured.length > 0 ? `
      <section class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-slate-100">APK Unggulan</h2>
            <p class="text-xs text-slate-400">Rekomendasi Mod paling popular</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${featured.map(apk => renderApkCard(apk, true)).join('')}
        </div>
      </section>
    ` : ''}

    <!-- ALL APKS SECTION -->
    <section class="mt-16">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-100">Daftar APK Mod</h2>
          <p class="text-xs text-slate-400">Katalog aplikasi yang siap diunduh</p>
        </div>

        <!-- Category Quick Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          ${state.categories.map(cat => `
            <button onclick="window.setCategory('${cat}')" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${state.selectedCategory === cat ? 'bg-blue-600/80 text-white shadow-glow-blue border border-blue-400/40' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- APK CARDS GRID -->
      ${state.filteredApks.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${state.filteredApks.map(apk => renderApkCard(apk)).join('')}
        </div>
      ` : renderEmptyState()}
    </section>
  `;
}

function renderApkListingPage() {
  return `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-black text-slate-100">Katalog APK Mod</h1>
        <p class="text-sm text-slate-400 mt-1">Temukan semua koleksi aplikasi & game modifikasi</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${state.filteredApks.length > 0 ? state.filteredApks.map(apk => renderApkCard(apk)).join('') : renderEmptyState()}
      </div>
    </div>
  `;
}

// 5. GLASS CARD COMPONENT (TIER 1 & HOVER LUMINOUS HIGHLIGHT)
function renderApkCard(apk, isFeatured = false) {
  const title = apk.title || apk.name || 'Untitled APK';
  const icon = apk.icon_url || apk.icon || '/media/logo.png';
  const version = apk.version || '1.0';
  const size = apk.file_size || apk.size || 'N/A';
  const category = apk.category || 'App';
  const modFeatures = apk.mod_features || apk.features || '';
  const views = apk.view_count ?? apk.views ?? 0;
  const downloads = apk.download_count ?? apk.downloads ?? 0;

  return `
    <div onclick="window.scrollToPage('detail', '${apk.slug}')" class="group relative bg-white/[0.04] glass-effect-tier1 border border-white/10 hover:border-white/30 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-glass-card cursor-pointer flex flex-col justify-between hover:bg-white/[0.08]">
      <div>
        <!-- Top Info Header -->
        <div class="flex items-start gap-4">
          <img src="${icon}" onerror="this.src='/media/logo.png'" alt="${title}" class="w-16 h-16 rounded-2xl object-cover bg-slate-800 border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300">
          <div class="flex-grow min-w-0">
            <span class="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-400 mb-1">
              ${category}
            </span>
            <h3 class="text-base font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
              ${title}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">v${version} • ${size}</p>
          </div>
        </div>

        <!-- Mod Feature Highlight -->
        ${modFeatures ? `
          <div class="mt-4 p-3 rounded-2xl bg-slate-950/40 shadow-glass-inset border border-white/5">
            <p class="text-xs text-emerald-400 font-medium line-clamp-2 flex items-center gap-1.5">
              <i class="ph ph-sparkle text-sm shrink-0"></i> ${modFeatures}
            </p>
          </div>
        ` : ''}
      </div>

      <!-- Footer Metadata & Action -->
      <div class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1"><i class="ph ph-eye text-sm text-slate-500"></i> ${views}</span>
          <span class="flex items-center gap-1"><i class="ph ph-download-simple text-sm text-slate-500"></i> ${downloads}</span>
        </div>
        <span class="text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Detail <i class="ph ph-arrow-right"></i>
        </span>
      </div>
    </div>
  `;
}

// DETAIL PAGE & MULTI-SERVER DOWNLOAD SWITCHER 2026
async function renderApkDetailPage(container, slug) {
  container.innerHTML = renderSkeletonLoading();

  try {
    const res = await fetch(`${API_BASE}/apks/${slug}`);
    const result = await res.json();

    if (!res.ok || !result.data) {
      container.innerHTML = renderEmptyState("APK tidak ditemukan.");
      return;
    }

    const apk = result.data;
    
    // Record View ke API
    let latestViews = (apk.view_count || 0) + 1;
    try {
      const viewRes = await fetch(`${API_BASE}/traffic/view/${apk.id}`, { method: 'POST' });
      const viewData = await viewRes.json();
      if (viewRes.ok && viewData.view_count) {
        latestViews = viewData.view_count;
        const localApk = state.apks.find(a => a.id === apk.id);
        if (localApk) localApk.view_count = latestViews;
      }
    } catch (e) {
      console.warn('Record view silent fail:', e);
    }

    const servers = apk.download_servers || [];

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8">
        <button onclick="window.scrollToPage('home')" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition shadow-glass-panel">
          <i class="ph ph-arrow-left text-base"></i> Kembali ke Beranda
        </button>

        <!-- ELEVATED GLASS CARD (TIER 3) -->
        <div class="bg-slate-900/50 glass-effect-tier3 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-glass-card">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img src="${apk.icon_url || '/media/logo.png'}" onerror="this.src='/media/logo.png'" class="w-28 h-28 rounded-3xl object-cover border border-white/15 shadow-2xl">
            <div class="flex-grow space-y-2">
              <span class="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                ${apk.category || 'General'}
              </span>
              <h1 class="text-2xl sm:text-4xl font-black text-slate-100">${apk.title}</h1>
              <p class="text-sm text-slate-400 font-medium">Pengembang: <span class="text-slate-200">${apk.developer || 'Unknown'}</span></p>
              
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
                <span class="flex items-center gap-1.5"><i class="ph ph-tag text-blue-400"></i> v${apk.version}</span>
                <span class="flex items-center gap-1.5"><i class="ph ph-hard-drive text-fuchsia-400"></i> ${apk.file_size || 'N/A'}</span>
                <span class="flex items-center gap-1.5"><i class="ph ph-eye text-cyan-400"></i> <strong class="text-slate-200">${latestViews}</strong> Views</span>
                <span class="flex items-center gap-1.5"><i class="ph ph-download-simple text-emerald-400"></i> <strong class="text-slate-200" id="detail-download-count">${apk.download_count || 0}</strong> Downloads</span>
              </div>
            </div>
          </div>

          ${apk.mod_features ? `
            <div class="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600/15 to-fuchsia-600/15 border border-blue-500/30">
              <h4 class="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
                <i class="ph ph-sparkle"></i> Fitur Modifikasi Spesial:
              </h4>
              <p class="text-sm text-slate-200 font-medium">${apk.mod_features}</p>
            </div>
          ` : ''}

          <!-- SLOT IKLAN 2 (DOWNLOAD ZONE HIGH-CTR) -->
          

          <!-- SECTION SERVER UNDUHAN -->
          <div class="mt-6 pt-6 border-t border-white/10 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
                <i class="ph ph-hard-drives text-blue-400"></i> Server Unduhan Terverifikasi (${servers.length || 1})
              </h3>
              <span class="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                100% Bebas Virus
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="download-servers-container">
              ${servers.length > 0 ? servers.map((server, idx) => `
                <button id="dl-btn-${server.id}" onclick="window.triggerDownload('${apk.id}', '${server.id}', 'dl-btn-${server.id}')" class="group relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] glass-effect-tier1 border border-white/10 hover:border-blue-500/40 hover:bg-blue-600/10 text-slate-200 font-semibold text-sm transition-all shadow-glass-panel hover:scale-[1.01]">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <i class="ph ph-cloud-arrow-down text-lg"></i>
                    </div>
                    <div class="text-left">
                      <div class="text-slate-100 font-bold text-xs sm:text-sm">${server.server_name}</div>
                      <div class="text-[10px] text-slate-400 font-normal">Server #${idx + 1} • Kencang & Stabil</div>
                    </div>
                  </div>
                  <i class="ph ph-arrow-square-out text-lg text-slate-400 group-hover:text-blue-400 transition-colors"></i>
                </button>
              `).join('') : `
                <button id="dl-btn-main" onclick="window.triggerDownload('${apk.id}', null, 'dl-btn-main')" class="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-glow-blue transition-all hover:scale-[1.01]">
                  <i class="ph ph-download-simple text-xl"></i> Unduh APK Sekarang
                </button>
              `}
            </div>
          </div>
        </div>

        <!-- Deskripsi Card -->
        <div class="bg-white/[0.04] glass-effect-tier1 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-glass-card">
          <h2 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <i class="ph ph-article text-blue-400"></i> Deskripsi & Informasi Detail
          </h2>
          <div class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            ${apk.description || 'Tidak ada deskripsi tambahan.'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = renderEmptyState("Gagal memuat detail APK.");
  }
}

// TRIGGER DOWNLOAD WITH LOADING STATE & REALTIME COUNT UPDATE
window.triggerDownload = async function(apkId, serverId = null, btnId = null) {
// Variable simpan status klik per APK
const downloadClickTracker = {};

window.triggerDownload = async function(apkId, serverId = null, btnId = null) {
  const DIRECT_LINK = "https://omg10.com/4/11803927";
  
  // Inisialisasi hitungan klik untuk APK ini jika belum ada
  if (!downloadClickTracker[apkId]) {
    downloadClickTracker[apkId] = 0;
  }

  // Tambah hitungan klik
  downloadClickTracker[apkId] += 1;
  const currentClicks = downloadClickTracker[apkId];

  // KLIK KE-1 ATAU KE-2 -> LEWATKAN KE DIRECTLINK IKLAN
  if (currentClicks < 3) {
    const sisa = 3 - currentClicks;
    showToast(`Langkah ${currentClicks}/3: Klik ${sisa}x lagi untuk mengunduh!`, "info");
    
    // Buka Iklan Directlink di Tab Baru
    window.open(DIRECT_LINK, '_blank');
    return;
  }

  // KLIK KE-3 -> UNDUHAN ASLI BERJALAN & RESET TRACKER
  downloadClickTracker[apkId] = 0; // Reset ke 0
  
  const btn = btnId ? document.getElementById(btnId) : null;
  const originalHtml = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `
      <div class="flex items-center gap-2 text-xs font-bold text-emerald-400 mx-auto">
        <div class="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        Membuka File Asli...
      </div>
    `;
  }

  showToast("Verifikasi sukses! Menyiapkan file unduhan...", "success");

  try {
    let url = `${API_BASE}/traffic/download/${apkId}`;
    if (serverId) url += `?server_id=${serverId}`;

    const res = await fetch(url);
    const result = await res.json();

    if (res.ok && result.download_url) {
      const dlCountElem = document.getElementById('detail-download-count');
      if (dlCountElem && result.download_count) {
        dlCountElem.textContent = result.download_count;
      }
      
      setTimeout(() => {
        window.open(result.download_url, '_blank');
      }, 500);
    } else {
      showToast(result.message || "Server unduhan tidak tersedia.", "error");
    }
  } catch (err) {
    showToast("Gagal memproses unduhan", "error");
  } finally {
    if (btn) {
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }, 1000);
    }
  }
};


// 8. UTILITIES & HELPER FUNCTIONS
window.toggleDrawer = function(drawerId) {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById(drawerId);
  if (!drawer || !overlay) return;

  overlay.classList.remove('opacity-0', 'pointer-events-none');
  if (drawerId === 'mobile-menu-drawer') drawer.classList.remove('translate-x-full');
  if (drawerId === 'filter-drawer') drawer.classList.remove('-translate-x-full');
  if (drawerId === 'search-drawer') drawer.classList.remove('-translate-y-full');
};

window.closeAllDrawers = function() {
  const overlay = document.getElementById('drawer-overlay');
  if (overlay) overlay.classList.add('opacity-0', 'pointer-events-none');

  ['mobile-menu-drawer', 'filter-drawer', 'search-drawer'].forEach(id => {
    const d = document.getElementById(id);
    if (d) {
      if (id === 'mobile-menu-drawer') d.classList.add('translate-x-full');
      if (id === 'filter-drawer') d.classList.add('-translate-x-full');
      if (id === 'search-drawer') d.classList.add('-translate-y-full');
    }
  });
};

window.setCategory = function(category) {
  state.selectedCategory = category;
  applyFilters();
  window.closeAllDrawers();
  renderView();
};

window.handleSearchInput = function(val) {
  state.searchQuery = val;
  applyFilters();
  renderView();
};

function renderCategoryDrawer() {
  const container = document.getElementById('category-drawer-list');
  if (!container) return;
  
  container.innerHTML = state.categories.map(cat => `
    <button onclick="window.setCategory('${cat}')" class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition ${state.selectedCategory === cat ? 'bg-blue-600/80 text-white shadow-glow-blue' : 'bg-white/5 text-slate-300 hover:bg-white/10'}">
      <span>${cat}</span>
      <i class="ph ph-chevron-right text-xs"></i>
    </button>
  `).join('');
}

function renderSkeletonLoading() {
  return `
    <div class="space-y-8 animate-pulse">
      <div class="h-44 bg-white/5 glass-effect-tier1 rounded-3xl border border-white/5"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${[1,2,3,4].map(() => `
          <div class="h-64 bg-white/5 glass-effect-tier1 rounded-3xl border border-white/5"></div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderEmptyState(message = "Belum ada APK yang tersedia.") {
  return `
    <div class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/15 rounded-3xl bg-white/[0.02] glass-effect-tier1 p-6">
      <div class="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-glow-blue">
        <i class="ph ph-package text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-200">Tidak Ada Data APK</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm">${message}</p>
    </div>
  `;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'error' ? 'bg-red-500/80 border-red-500/40' : type === 'success' ? 'bg-emerald-500/80 border-emerald-500/40' : 'bg-blue-600/80 border-blue-500/40';
  
  toast.className = `pointer-events-auto px-4 py-3 rounded-2xl text-white font-medium text-xs glass-effect-tier3 border shadow-2xl flex items-center gap-2 transition-all duration-300 transform translate-y-2 opacity-0 ${bgClass}`;
  toast.innerHTML = `<i class="ph ph-info text-base"></i> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
