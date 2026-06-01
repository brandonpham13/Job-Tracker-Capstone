/**
 * Clerk authentication utilities for the Job Tracker client.
 *
 * Exposes a global `Auth` object on window with:
 *   Auth.clerk       – the Clerk instance (after load)
 *   Auth.getToken()  – returns a Bearer token for API calls
 *   Auth.signOut()   – signs the user out and redirects to landing
 *   Auth.ready       – a Promise that resolves once Clerk is fully loaded
 */

(function () {
  let clerkInstance = null;
  let readyResolve;
  let readyReject;

  const readyPromise = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          script.setAttribute(key, attrs[key]);
        });
      }
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Failed to load script: " + src));
      };
      document.head.appendChild(script);
    });
  }

  async function init() {
    try {
      const res = await fetch("/api/auth/config");
      const { publishableKey } = await res.json();

      if (!publishableKey) {
        throw new Error(
          "Missing CLERK_PUBLISHABLE_KEY – check your server .env",
        );
      }

      const clerkDomain = atob(publishableKey.split("_")[2]).slice(0, -1);

      await loadScript(
        "https://" + clerkDomain + "/npm/@clerk/ui@1/dist/ui.browser.js",
      );
      await loadScript(
        "https://" +
          clerkDomain +
          "/npm/@clerk/clerk-js@6/dist/clerk.browser.js",
        { "data-clerk-publishable-key": publishableKey },
      );

      clerkInstance = window.Clerk;
      if (!clerkInstance) {
        throw new Error("Clerk JS failed to load from CDN");
      }

      await clerkInstance.load({
        ui: { ClerkUI: window.__internal_ClerkUICtor },
      });
      readyResolve(clerkInstance);
    } catch (err) {
      console.error("Auth init failed:", err);
      readyReject(err);
    }
  }

  async function getToken() {
    const clerk = await readyPromise;
    if (!clerk.session) return null;
    return clerk.session.getToken();
  }

  async function signOut() {
    const clerk = await readyPromise;
    await clerk.signOut();
    window.location.href = "/index.html";
  }

  async function protect() {
    try {
      const clerk = await readyPromise;
      if (!clerk.user) {
        window.location.href = "/index.html";
      }
    } catch {
      window.location.href = "/index.html";
    }
  }

  async function apiFetch(url, options = {}) {
    const token = await getToken();
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };
    return fetch(url, { ...options, headers });
  }

  window.Auth = {
    init,
    ready: readyPromise,
    getToken,
    signOut,
    protect,
    apiFetch,
    get clerk() {
      return clerkInstance;
    },
  };
})();
