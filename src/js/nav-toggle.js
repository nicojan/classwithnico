(function () {
  function bindToggle() {
    const header = document.querySelector('.header');
    const icon = document.querySelector('.icon-container');
    if (!header || !icon) return;

    // optional A11y state
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', 'Toggle menu');

    function toggle() {
      const open = header.classList.toggle('menu-open');
      icon.setAttribute('aria-expanded', String(open));
    }

    icon.addEventListener('click', toggle);
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  // Bind when the injected nav is ready
  document.addEventListener('nav:loaded', bindToggle);

  // Also try once on DOMContentLoaded (in case nav markup exists directly)
  document.addEventListener('DOMContentLoaded', bindToggle);
}());
