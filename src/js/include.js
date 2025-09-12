(async function () {
  async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });   // <-- will 404 if the path is wrong
      if (!res.ok) throw new Error(`Failed to load ${url} (status ${res.status})`);
      host.outerHTML = await res.text();
      document.dispatchEvent(new CustomEvent("nav:loaded"));
    } catch (err) {
      console.error("Navbar include error:", err);
    }
  }

  function loadNav() {
    // Use RELATIVE path for local dev; switch back to /partials/nav.html in prod if your host is domain-rooted
    include("#site-navbar", "partials/nav.html");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNav);
  } else {
    loadNav();
  }
})();