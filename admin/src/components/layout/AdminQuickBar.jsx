import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function AdminQuickBar() {
  const { resetSettings, isCustomized } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleReset = () => {
    resetSettings();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-sans select-none">
      {/* Toast Notice */}
      {resetNotice && (
        <div className="px-4 py-2 rounded-xl bg-purple-900/90 border border-purple-500/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>🔄</span> Typography, colors, and headings reset to original defaults!
        </div>
      )}

      {/* Main Bar */}
      <div className="glass-card bg-black/80 border border-white/15 px-3 py-2 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center gap-2.5 text-xs text-white">
        {/* Status indicator dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isCustomized ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-500'
          }`}
          title={isCustomized ? 'Custom settings applied' : 'Using default settings'}
        />

        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium hidden sm:inline">
              {isCustomized ? 'Custom Theme & Content' : 'Default Theme & Content'}
            </span>

            {/* Quick Reset Button (Visible when custom settings are applied) */}
            {isCustomized && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-500/30 transition-all font-semibold flex items-center gap-1 cursor-pointer"
                title="Reset all fonts, colors, headings and settings back to original defaults"
              >
                <span>🔄</span> Reset to Default
              </button>
            )}

            {/* Link to Admin Panel */}
            <Link
              to="/admin"
              className="px-2.5 py-1 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/40 text-purple-200 hover:text-white border border-neon-purple/30 transition-all font-semibold flex items-center gap-1"
            >
              <span>⚙️</span> Customize Site
            </Link>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer text-[10px]"
          title={collapsed ? 'Expand Admin Bar' : 'Minimize'}
        >
          {collapsed ? '⚙️ Admin' : '✕'}
        </button>
      </div>
    </div>
  );
}
