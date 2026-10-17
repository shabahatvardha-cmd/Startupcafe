export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://startup-cafe.onrender.com');

export const CLIENT_SITE_URL =
  import.meta.env.VITE_CLIENT_SITE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5173' : window.location.origin);
