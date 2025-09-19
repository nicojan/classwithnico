(function () {
  async function loadBlogNav() {
    try {
      const target = document.getElementById('site-navbar');
      if (!target) return;

      // Prefer a dedicated partial if available at the site root:
      try {
        const partial = await fetch('/partials/navbar.html', { credentials: 'omit' });
        if (partial.ok) {
          target.innerHTML = await partial.text();
          document.dispatchEvent(new CustomEvent('nav:loaded'));
          return;
        }
      } catch (_) { /* fall through */ }

      // Fallback: fetch the homepage and extract ONLY #site-navbar
      const res = await fetch('/index.html', { credentials: 'omit' });
      if (!res.ok) throw new Error('Failed to fetch /index.html for navbar');

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const source = doc.querySelector('#site-navbar');
      if (source) {
        target.innerHTML = source.innerHTML;
        document.dispatchEvent(new CustomEvent('nav:loaded'));
      } else {
        console.warn('Blog include.js: #site-navbar not found in /index.html');
      }
    } catch (e) {
      console.error('Blog include.js failed to load navbar:', e);
    }
  }

  // Expose and auto-run
  window.loadBlogNav = loadBlogNav;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogNav);
  } else {
    loadBlogNav();
  }
})();
