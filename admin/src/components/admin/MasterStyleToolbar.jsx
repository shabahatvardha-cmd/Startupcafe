import { useState } from 'react';
import { FIELD_LABELS } from './adminConstants';

// 1-Click Master Sticky Styling Toolbar for Text Editing
export default function MasterStyleToolbar({ activeField, onApplyStyle }) {
  const [showGuide, setShowGuide] = useState(false);
  const [customColor, setCustomColor] = useState('#00f0ff');

  const chips = [
    { label: 'Bold', icon: '𝗕', tag: 'bold', title: 'Toggle bold [bold:word]' },
    { label: 'Italic', icon: '𝘐', tag: 'italic', title: 'Toggle italic [italic:word]' },
    { label: 'Underline', icon: 'U̲', tag: 'underline', title: 'Toggle underline [underline:word]' },
    { label: 'Clear', icon: '✕', tag: 'clear', isClear: true, title: 'Step-by-step clear last styled word' },
    { label: 'Clear All', icon: '🧹', tag: 'clear-all', isClearAll: true, title: 'Clear all style tags in active box' },
  ];

  const fieldDisplayName = FIELD_LABELS[activeField] || activeField || 'Hero Main Heading';

  return (
    <div className="sticky top-20 z-20 backdrop-blur-xl bg-slate-950/90 border border-neon-purple/40 shadow-[0_8px_32px_rgba(0,0,0,0.45)] rounded-2xl p-3 sm:p-3.5 mb-6 transition-all duration-300 ring-1 ring-white/10">
      {/* Header Row: Active Field Indicator & Guide Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Styling Target:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-white font-bold text-xs shadow-sm">
            {fieldDisplayName}
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            (Select any word in the field below &amp; click a style button)
          </span>
        </div>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowGuide(!showGuide)}
          className="text-[11px] text-neon-blue hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-medium transition-colors"
        >
          <span>❓</span> Style Guide {showGuide ? '▲' : '▼'}
        </button>
      </div>

      {/* Tools Row: Ultra-minimal Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {/* 🌈 Gradient FX */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onApplyStyle(activeField, 'gradient')}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 hover:from-neon-purple/50 hover:to-neon-blue/50 border border-neon-purple/40 text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-xs active:scale-95"
          title="Toggle glowing neon gradient [gradient:word]"
        >
          <span>🌈</span>
          <span>Gradient</span>
        </button>

        {/* 🎨 1-Click Visual Color Picker */}
        <label
          onMouseDown={(e) => e.preventDefault()}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs relative overflow-hidden font-medium active:scale-95 shadow-sm"
          title="Pick ANY custom color from color wheel [#hex:word]"
        >
          <span
            className="w-3 h-3 rounded-full border border-white/40 shrink-0 shadow-sm"
            style={{ backgroundColor: customColor }}
          />
          <span>🎨 Color</span>
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              const newCol = e.target.value;
              setCustomColor(newCol);
              onApplyStyle(activeField, newCol);
            }}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>

        {/* 📏 Custom Font Size Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.value) {
                onApplyStyle(activeField, e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition-all text-xs cursor-pointer focus:outline-none focus:border-neon-purple appearance-none pr-5 font-medium shadow-sm"
            title="Set exact font size for selected word"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">📏 Size ▾</option>
            <option value="sm" className="bg-slate-900 text-white">Small (0.85x)</option>
            <option value="large" className="bg-slate-900 text-white">Large (1.25x)</option>
            <option value="huge" className="bg-slate-900 text-white">Huge (1.6x)</option>
            <option value="16px" className="bg-slate-900 text-white">16px</option>
            <option value="20px" className="bg-slate-900 text-white">20px</option>
            <option value="24px" className="bg-slate-900 text-white">24px</option>
            <option value="28px" className="bg-slate-900 text-white">28px</option>
            <option value="36px" className="bg-slate-900 text-white">36px</option>
            <option value="48px" className="bg-slate-900 text-white">48px</option>
          </select>
          <span className="absolute right-1.5 text-[9px] pointer-events-none text-slate-400">▾</span>
        </div>

        {/* 𝗕 Bold, 𝘐 Italic, U̲ Underline */}
        {chips.slice(0, 3).map((chip) => (
          <button
            key={chip.tag}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyStyle(activeField, chip.tag)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs active:scale-95 shadow-sm"
            title={chip.title}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}

        <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

        {/* ✕ Clear, 🧹 Clear All */}
        {chips.slice(3).map((chip) => (
          <button
            key={chip.tag}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyStyle(activeField, chip.tag)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm ${chip.isClear
                ? 'bg-rose-500/10 hover:bg-rose-500/25 border-rose-500/30 text-rose-300 hover:text-rose-100'
                : 'bg-amber-500/10 hover:bg-amber-500/25 border-amber-500/30 text-amber-300 hover:text-amber-100'
              }`}
            title={chip.title}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable Style Guide */}
      {showGuide && (
        <div className="mt-3 p-3.5 rounded-xl bg-black/95 border border-white/20 shadow-2xl text-[11px] text-slate-300 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-white text-xs">
            <span className="flex items-center gap-1.5">
              <span>💡</span> Master Styling Cheatsheet:
            </span>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowGuide(false)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-400 text-xs">
            Select any word or phrase in the active box below and click any button above. You can also write tags directly:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-neon-purple font-bold">[gradient:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Glowing gradient</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white font-bold">[bold:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Bold weight</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white italic">[italic:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Italic emphasis</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white underline">[underline:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Underlined text</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-cyan-300 font-bold">[#00f0ff:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Any custom color</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">[28px:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Custom font size</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-amber-300 font-bold">[bold,italic:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Multiple effects</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-pink-300 font-bold">[#ff2975,24px:Word]</span>
              <span className="block text-slate-400 font-sans mt-0.5">Color + size combo</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
            <span><strong className="text-purple-300">Active Field:</strong> Automatically updates when you click or type into any input.</span>
            <span><strong className="text-rose-300">✕ Clear:</strong> Removes styling step-by-step from styled words.</span>
            <span><strong className="text-amber-300">🧹 Clear All:</strong> Instantly resets all tags in the active field.</span>
          </div>
        </div>
      )}
    </div>
  );
}
