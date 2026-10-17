import { useState, useRef, useEffect } from 'react';

export const CURATED_PALETTES = [
  {
    name: 'Neon & Cyber',
    colors: [
      { label: 'Hot Pink', hex: '#ff2975' },
      { label: 'Cyan Glow', hex: '#00f0ff' },
      { label: 'Neon Purple', hex: '#b026ff' },
      { label: 'Electric Gold', hex: '#fbbf24' },
      { label: 'Emerald Neon', hex: '#10b981' },
      { label: 'Pure White', hex: '#ffffff' },
    ],
  },
  {
    name: 'Sunset & Warmth',
    colors: [
      { label: 'Sunset Red', hex: '#ef4444' },
      { label: 'Coral Orange', hex: '#ff5722' },
      { label: 'Amber Sun', hex: '#f59e0b' },
      { label: 'Rose Pink', hex: '#f43f5e' },
      { label: 'Magenta', hex: '#ec4899' },
      { label: 'Peach Gold', hex: '#fef08a' },
    ],
  },
  {
    name: 'Tech & Ocean',
    colors: [
      { label: 'Sky Cyan', hex: '#06b6d4' },
      { label: 'Royal Blue', hex: '#3b82f6' },
      { label: 'Deep Indigo', hex: '#6366f1' },
      { label: 'Teal Green', hex: '#14b8a6' },
      { label: 'Electric Azure', hex: '#0ea5e9' },
      { label: 'Cobalt', hex: '#2563eb' },
    ],
  },
  {
    name: 'Luxury & Minimal',
    colors: [
      { label: 'Crisp White', hex: '#ffffff' },
      { label: 'Champagne Gold', hex: '#fde047' },
      { label: 'Lavender Mist', hex: '#d8b4fe' },
      { label: 'Sage Mint', hex: '#a7f3d0' },
      { label: 'Platinum Slate', hex: '#cbd5e1' },
      { label: 'Graphite Dark', hex: '#1e293b' },
    ],
  },
];

const RECENT_KEY = 'startupcafe_recent_colors';

export function getRecentColors() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : ['#ff2975', '#00f0ff', '#b026ff', '#fbbf24'];
  } catch {
    return ['#ff2975', '#00f0ff', '#b026ff', '#fbbf24'];
  }
}

export function saveRecentColor(hex) {
  if (!hex || !hex.startsWith('#')) return;
  try {
    const recents = getRecentColors().filter((c) => c.toLowerCase() !== hex.toLowerCase());
    recents.unshift(hex);
    const trimmed = recents.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * ColorPaletteInput
 * High-end color picker field with:
 * - Direct visual preview swatch
 * - Curated designer palettes
 * - Full custom color picker spectrum
 * - Hex code text input
 * - Recently used colors
 */
export default function ColorPaletteInput({
  label,
  name,
  value = '',
  onChange,
  defaultValue = '',
  defaultLabel = 'Default (Theme)',
  helperText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(value || defaultValue || '#ff2975');
  const [recentColors, setRecentColors] = useState(() => getRecentColors());
  const popoverRef = useRef(null);

  useEffect(() => {
    if (value && value.startsWith('#')) {
      setCustomHex(value);
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectColor = (hex) => {
    saveRecentColor(hex);
    setRecentColors(getRecentColors());
    setCustomHex(hex);
    onChange({ target: { name, value: hex } });
  };

  const handleReset = () => {
    onChange({ target: { name, value: '' } });
    setIsOpen(false);
  };

  const activeColor = value || defaultValue || '#ffffff';
  const isDefault = !value;

  return (
    <div className="space-y-1.5 relative" ref={popoverRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}

      {/* Main Bar: Swatch + Label + Quick Palette Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/50 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex-1 text-left group"
        >
          {/* Visual Swatch */}
          <div
            className="w-6 h-6 rounded-lg border border-white/20 shrink-0 shadow-sm relative overflow-hidden"
            style={{
              backgroundColor: isDefault && !defaultValue ? '#ffffff' : activeColor,
            }}
          >
            {isDefault && !defaultValue && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rose-500/40 to-transparent" />
            )}
          </div>

          {/* Color Name or Hex */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono font-semibold text-white block truncate">
              {value ? value.toUpperCase() : defaultLabel}
            </span>
          </div>

          <span className="text-[11px] text-neon-blue font-medium px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 group-hover:bg-neon-blue/20 transition-colors">
            🎨 Palette ▾
          </span>
        </button>

        {/* Reset button if custom color is applied */}
        {value && (
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-2 rounded-xl border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
            title="Reset to default theme color"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Interactive Color Palette Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 sm:right-auto sm:w-[320px] top-full mt-2 p-3.5 rounded-2xl bg-slate-950/95 border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>🎨</span> Color Palette Picker
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>

          {/* 1. Custom Spectrum Wheel & Hex Input */}
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Custom Color Picker
              </span>
              <span className="text-[10px] text-slate-500">Pick any shade</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Native Spectrum Wheel */}
              <label
                className="w-9 h-9 rounded-xl border border-white/30 cursor-pointer relative overflow-hidden flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                style={{ backgroundColor: customHex }}
                title="Open system color wheel"
              >
                <input
                  type="color"
                  value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#ff2975'}
                  onChange={(e) => handleSelectColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>

              {/* Hex Input Field */}
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomHex(val);
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      handleSelectColor(val);
                    }
                  }}
                  placeholder="#FF2975"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-white font-mono text-xs uppercase focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customHex.startsWith('#')) {
                      handleSelectColor(customHex);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neon-purple hover:bg-neon-purple/80 hover:shadow-[0_0_15px_rgba(176,38,255,0.7)] hover:scale-105 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer border border-neon-purple shrink-0 shadow-sm select-none"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* 2. Recently Used Colors */}
          {recentColors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Recently Used
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {recentColors.map((col, idx) => (
                  <button
                    key={`${col}-${idx}`}
                    type="button"
                    onClick={() => handleSelectColor(col)}
                    className="w-6 h-6 rounded-lg border border-white/20 hover:scale-115 transition-transform cursor-pointer shadow-sm relative group"
                    style={{ backgroundColor: col }}
                    title={`Apply ${col}`}
                  >
                    {value.toLowerCase() === col.toLowerCase() && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Curated Designer Palettes */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Curated Brand Themes
            </span>
            <div className="space-y-2">
              {CURATED_PALETTES.map((palette) => (
                <div key={palette.name} className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">{palette.name}</span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {palette.colors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleSelectColor(c.hex)}
                        className="h-6 rounded-md border border-white/20 hover:scale-115 transition-transform cursor-pointer shadow-sm relative group"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.label} (${c.hex})`}
                      >
                        {value.toLowerCase() === c.hex.toLowerCase() && (
                          <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
