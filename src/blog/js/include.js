// Blog-local navbar loader: strictly inject ONLY the <nav>, never the whole page.
(function () {
  function stripScripts(root) {
    root.querySelectorAll('script').forEach(s => s.remove());
    return root;
  }

  async function loadBlogNav() {
    try {
      const target = document.getElementById('site-navbar');
      if (!target) return;

      // 1) Prefer a dedicated partial at the site root (best)
      try {
        const partial = await fetch('/partials/navbar.html', { credentials: 'omit', cache: 'no-cache' });
        if (partial.ok) {
          const html = await partial.text();
          const tmp = document.createElement('div');
          tmp.innerHTML = html;
          stripScripts(tmp);
          const nav = tmp.querySelector('nav') || tmp;   // inject only nav if present
          target.innerHTML = nav.innerHTML;
          document.dispatchEvent(new CustomEvent('nav:loaded'));
          return;
        }
      } catch (_) { /* fall through */ }

      // 2) Fallback: fetch /index.html but accept ONLY an explicit <nav>
      const res = await fetch('/index.html', { credentials: 'omit', cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to fetch /index.html for navbar');

      const html = await res.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');

      // Tight selectors to avoid pulling hero/sections
      const selectors = [
        'header nav.site-nav',
        'header nav[role="navigation"]',
        'header nav[aria-label="Primary"]',
        'header nav',
        '#site-navbar nav',
        '#navbar nav',
        'nav.site-nav',
        'nav[role="navigation"]'
      ];

      let navEl = null;
      for (const sel of selectors) {
        const el = doc.querySelector(sel);
        if (el) { navEl = el; break; }
      }

      if (!navEl) {
        console.warn('Blog include.js: No <nav> element found; skipping injection to avoid importing homepage.');
        return; // bail out safely
      }

      const tmp = document.createElement('div');
      tmp.appendChild(navEl.cloneNode(true));
      stripScripts(tmp);
      target.innerHTML = tmp.innerHTML;
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