import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminSettings from './pages/AdminSettings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SettingsProvider>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen relative selection:bg-neon-pink selection:text-white bg-[#050505] text-[#f8fafc]">
            {/* Global Background Glow */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/15 blur-[120px] rounded-full mix-blend-screen"></div>
              <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-neon-blue/15 blur-[150px] rounded-full mix-blend-screen"></div>
            </div>

            <main>
              <Routes>
                {/* 🔐 Secure Authentication Route */}
                <Route path="/sc-portal/access" element={<Login />} />

                {/* 🔐 Secure Protected Admin Workspace */}
                <Route
                  path="/sc-portal/workspace"
                  element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Backward Compatibility Aliases (Ensures zero breakage) */}
                <Route path="/login" element={<Navigate to="/sc-portal/access" replace />} />
                <Route path="/dashboard" element={<Navigate to="/sc-portal/workspace" replace />} />
                <Route path="/admin" element={<Navigate to="/sc-portal/workspace" replace />} />
                <Route path="/admin/settings" element={<Navigate to="/sc-portal/workspace" replace />} />
                <Route path="/" element={<Navigate to="/sc-portal/workspace" replace />} />
                <Route path="*" element={<Navigate to="/sc-portal/workspace" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AdminAuthProvider>
    </SettingsProvider>
  );
}

export default App;
