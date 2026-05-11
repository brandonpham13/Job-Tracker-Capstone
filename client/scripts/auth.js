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

  const readyPromise = new Promise((resolve) => {
    readyResolve = resolve;
  });

  async function init() {
    const res = await fetch("/api/auth/config");
    const { publishableKey } = await res.json();

    if (!publishableKey) {
      console.error("Missing CLERK_PUBLISHABLE_KEY – check your server .env");
      return;
    }

    const Clerk = window.Clerk;
    clerkInstance = new Clerk(publishableKey);
    await clerkInstance.load();

    readyResolve(clerkInstance);
  }

  async function getToken() {
    const clerk = await readyPromise;
    if (!clerk.session) return null;
    return clerk.session.getToken();
  }

  async function signOut() {
    const clerk = await readyPromise;
    await clerk.signOut();
    window.location.href = "/pages/index.html";
  }

  /**
   * Call on protected pages. Redirects to the landing page
   * if the user is not signed in once Clerk finishes loading.
   */
  async function protect() {
    const clerk = await readyPromise;
    if (!clerk.user) {
      window.location.href = "/pages/index.html";
    }
  }

  /**
   * Wrapper around fetch that automatically attaches the Clerk
   * session token as a Bearer header.
   */
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
