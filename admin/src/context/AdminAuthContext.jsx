import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ADMIN_AUTH_KEY = 'startupcafe_admin_auth';
const ADMIN_OVERLAY_KEY = 'startupcafe_admin_overlay';

const AdminAuthContext = createContext({
  isAdmin: false,
  overlayEnabled: true,
  loginAdmin: () => {},
  logoutAdmin: () => {},
  toggleOverlay: () => {},
});

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [overlayEnabled, setOverlayEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_OVERLAY_KEY);
      return stored === null ? true : stored === 'true';
    } catch {
      return true;
    }
  });

  const loginAdmin = useCallback(() => {
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } catch {
      // storage unavailable fallback
    }
    setIsAdmin(true);
  }, []);

  const logoutAdmin = useCallback(() => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // storage unavailable fallback
    }
    setIsAdmin(false);
  }, []);

  const toggleOverlay = useCallback(() => {
    setOverlayEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ADMIN_OVERLAY_KEY, String(next));
      } catch {
        // fallback
      }
      return next;
    });
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === ADMIN_AUTH_KEY) {
        setIsAdmin(e.newValue === 'true');
      }
      if (e.key === ADMIN_OVERLAY_KEY) {
        setOverlayEnabled(e.newValue !== 'false');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Keyboard shortcut for admins to toggle/activate admin mode (Ctrl + Shift + A or Alt + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key === 'A') || (e.altKey && e.key === 'a')) {
        setIsAdmin((prev) => {
          const next = !prev;
          try {
            if (next) localStorage.setItem(ADMIN_AUTH_KEY, 'true');
            else localStorage.removeItem(ADMIN_AUTH_KEY);
          } catch {
            // fallback
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        overlayEnabled,
        loginAdmin,
        logoutAdmin,
        toggleOverlay,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default AdminAuthContext;
