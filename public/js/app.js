// StoryReader Blog Client App
const API_BASE = '/api';

// Current user state helper
const Auth = {
  getUser() {
    const raw = localStorage.getItem('storyreader_user');
    return raw ? JSON.parse(raw) : null;
  },
  getToken() {
    return localStorage.getItem('storyreader_token');
  },
  setUser(user, token) {
    localStorage.setItem('storyreader_user', JSON.stringify(user));
    if (token) localStorage.setItem('storyreader_token', token);
  },
  logout() {
    localStorage.removeItem('storyreader_user');
    localStorage.removeItem('storyreader_token');
    window.location.href = '/login.html';
  },
  isLoggedIn() {
    return !!this.getUser();
  }
};

// Update header auth state UI
function updateAuthHeader() {
  const user = Auth.getUser();
  const authNav = document.getElementById('authNav');
  if (!authNav) return;

  if (user) {
    authNav.innerHTML = `
      <div class="flex items-center gap-3">
        <a href="/create-post.html" class="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1.5">
          <i class="fa-solid fa-feather"></i> Viết bài
        </a>
        <div class="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-full">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" class="w-6 h-6 rounded-full object-cover" alt="avatar" />
          <span class="text-xs font-medium text-slate-200">${user.fullName || user.username}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold uppercase">${user.role || 'Member'}</span>
        </div>
        <button onclick="Auth.logout()" class="text-xs text-slate-400 hover:text-rose-400 transition" title="Đăng xuất">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
  } else {
    authNav.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="/login.html" class="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition">Đăng nhập</a>
        <a href="/register.html" class="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">Đăng ký</a>
      </div>
    `;
  }
}

// Global notification alert
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-indigo-600';
  toast.className = `fixed bottom-5 right-5 z-50 text-white px-4 py-2.5 rounded-lg shadow-xl text-sm font-medium animate-fade-in flex items-center gap-2 ${bg}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle'}"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Initialise auth status
document.addEventListener('DOMContentLoaded', () => {
  updateAuthHeader();
});
