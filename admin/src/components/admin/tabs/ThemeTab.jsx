import { PaletteIcon } from '../adminIcons';
import { THEME_PRESETS } from '../adminConstants';
import ColorPaletteInput from '../ColorPaletteInput';

export default function ThemeTab({ current, onChange, onApplyPreset }) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PaletteIcon size={20} className="text-neon-pink" />
            Color Palette &amp; Atmosphere
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select curated neon themes or customize primary accents, gradients, text, and background colors.
          </p>
        </div>
      </div>

      {/* 1-Click Curated Theme Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
          1-Click Theme Palettes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected =
              (current.accentColor || '#b026ff') === preset.accentColor &&
              (current.gradientStart || '#ff2975') === preset.gradientStart;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${isSelected
                  ? 'border-white bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-1 ring-white/40'
                  : 'border-white/10 bg-black/50 hover:border-white/30 hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{preset.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mb-2">{preset.tag}</span>

                {/* Gradient Preview Bar */}
                <div
                  className="h-2 rounded-full w-full mb-2"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${preset.gradientStart}, ${preset.accentColor}, ${preset.gradientEnd})`,
                  }}
                />

                {/* Dot swatches */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.accentColor }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.gradientStart }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.gradientEnd }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.backgroundColor }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Neon & Accent Pickers */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Neon Accent Colors &amp; Gradients
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColorPaletteInput
            label="Primary Accent Glow"
            name="accentColor"
            value={current.accentColor || '#b026ff'}
            onChange={onChange}
            defaultValue="#b026ff"
            defaultLabel="Neon Purple (#b026ff)"
          />
          <ColorPaletteInput
            label="Gradient Start"
            name="gradientStart"
            value={current.gradientStart || '#ff2975'}
            onChange={onChange}
            defaultValue="#ff2975"
            defaultLabel="Neon Pink (#ff2975)"
          />
          <ColorPaletteInput
            label="Gradient End / Highlight"
            name="gradientEnd"
            value={current.gradientEnd || '#00f0ff'}
            onChange={onChange}
            defaultValue="#00f0ff"
            defaultLabel="Neon Cyan (#00f0ff)"
          />
        </div>
      </div>

      {/* Surface & Typography Text Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Text &amp; Background Atmosphere
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColorPaletteInput
            label="Primary Text Color"
            name="primaryTextColor"
            value={current.primaryTextColor || '#f8fafc'}
            onChange={onChange}
            defaultValue="#f8fafc"
            defaultLabel="Default (Pure Light)"
          />
          <ColorPaletteInput
            label="Muted / Subtitle Text"
            name="mutedTextColor"
            value={current.mutedTextColor || '#94a3b8'}
            onChange={onChange}
            defaultValue="#94a3b8"
            defaultLabel="Default (Slate Muted)"
          />
          <ColorPaletteInput
            label="Page Background Base"
            name="backgroundColor"
            value={current.backgroundColor || '#050505'}
            onChange={onChange}
            defaultValue="#050505"
            defaultLabel="Default (Dark Night)"
          />
        </div>
      </div>
    </div>
  );
}
