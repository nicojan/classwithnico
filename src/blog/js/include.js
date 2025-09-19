// Blog-local navbar loader: fetch /nav.html and inject only the navbar markup.
(function () {
  function stripScripts(root) {
    root.querySelectorAll('script').forEach(s => s.remove());
    return root;
  }

  async function loadBlogNav() {
    try {
      const target = document.getElementById('site-navbar');
      if (!target) return;

      // Fetch the site-root nav fragment
      const res = await fetch('/nav.html', { credentials: 'omit', cache: 'no-cache' });
      if (!res.ok) {
        console.warn('Blog include.js: /nav.html not found – no navbar on blog pages.');
        return;
      }

      const html = await res.text();

      // Hard guard: if a full document slipped through, bail (prevents homepage injection)
      if (html.includes('<html') || html.includes('<body>')) {
        console.warn('Blog include.js: /nav.html looked like a full page; skipping injection.');
        return;
      }

      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      stripScripts(tmp);

      // Your nav.html contains the desktop <nav.navbar> and the mobile .mobile-navbar
      // Inject both, in the same container.
      const desktop = tmp.querySelector('nav.navbar');
      const mobile  = tmp.querySelector('.mobile-navbar');

      if (!desktop && !mobile) {
        console.warn('Blog include.js: no navbar elements found in /nav.html');
        return;
      }

      target.innerHTML = '';
      if (desktop) target.appendChild(desktop.cloneNode(true));
      if (mobile)  target.appendChild(mobile.cloneNode(true));

      document.dispatchEvent(new CustomEvent('nav:loaded'));
    } catch (e) {
      console.error('Blog include.js failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogNav);
  } else {
    loadBlogNav();
  }
})();