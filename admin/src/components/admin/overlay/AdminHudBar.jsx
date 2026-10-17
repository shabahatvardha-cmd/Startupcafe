import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { ShieldCheck, Eye, EyeOff, Settings, LogOut, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Floating Admin HUD Bar for authenticated administrators on the live frontend.
 *
 * CRITICAL REQUIREMENT: Zero footprint for regular visitors.
 * When `isAdmin` is false, returns `null` immediately.
 */
export default function AdminHudBar() {
  const { isAdmin, overlayEnabled, toggleOverlay, logoutAdmin } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Zero Interference for public users
  if (!isAdmin) {
    return null;
  }

  return (
    <aside
      aria-label="Admin controls"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none font-sans"
    >
      <div className="glass-card bg-slate-950/90 border border-neon-purple/50 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl px-3.5 py-2 rounded-2xl flex items-center gap-3 text-xs text-white ring-1 ring-white/10 transition-all">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-white hidden sm:inline flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400 inline" />
            <span>Admin Active</span>
          </span>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-2">
            {/* Toggle Overlays ON/OFF */}
            <button
              type="button"
              onClick={toggleOverlay}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                overlayEnabled
                  ? 'bg-neon-purple/25 border-neon-purple/60 text-purple-200 hover:bg-neon-purple/40'
                  : 'bg-white/5 border-white/15 text-slate-400 hover:text-white'
              }`}
              title="Toggle in-context Edit badges on website sections"
            >
              {overlayEnabled ? <Eye size={13} className="text-neon-purple" /> : <EyeOff size={13} />}
              <span>{overlayEnabled ? 'Badges: ON' : 'Badges: OFF'}</span>
            </button>

            {/* Jump to Admin Dashboard */}
            <Link
              to="/admin"
              className="px-2.5 py-1 rounded-xl bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-cyan-200 hover:text-white transition-all font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open full Website Customization Panel"
            >
              <Settings size={13} className="text-neon-blue" />
              <span>Dashboard</span>
            </Link>

            {/* Exit Admin Mode */}
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white transition-all font-semibold flex items-center gap-1 cursor-pointer"
              title="Exit Admin Mode (Restores clean public view)"
            >
              <LogOut size={12} />
              <span>Exit</span>
            </button>
          </div>
        )}

        {/* Minimize / Expand Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          title={collapsed ? 'Expand Admin HUD' : 'Collapse Admin HUD'}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </aside>
  );
}
