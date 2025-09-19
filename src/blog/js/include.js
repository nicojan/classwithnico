// Blog-local navbar loader: ONLY use /partials/navbar.html; no /index.html fallback.
(function () {
  function stripScripts(root) {
    root.querySelectorAll('script').forEach(s => s.remove());
    return root;
  }

  async function loadBlogNav() {
    try {
      const target = document.getElementById('site-navbar');
      if (!target) return;

      // Try a dedicated partial at the site root. If it's missing, we bail.
      const res = await fetch('/partials/navbar.html', { credentials: 'omit', cache: 'no-cache' });
      if (!res.ok) {
        console.warn('Blog include.js: /partials/navbar.html not found – navbar will be omitted on blog pages.');
        return;
      }

      const html = await res.text();
      const tmp  = document.createElement('div');
      tmp.innerHTML = html;
      stripScripts(tmp);

      const nav = tmp.querySelector('nav') || tmp.firstElementChild || tmp;
      if (!nav) return;

      target.innerHTML = nav.outerHTML ? nav.outerHTML : nav.innerHTML;
      document.dispatchEvent(new CustomEvent('nav:loaded'));
    } catch (e) {
      console.error('Blog include.js failed:', e);
    }
  }

  // Auto-run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogNav);
  } else {
    loadBlogNav();
  }
})();