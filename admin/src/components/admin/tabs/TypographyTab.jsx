import { TypeIcon } from '../adminIcons';
import { FONT_OPTIONS, FONT_SIZE_PRESETS, HEADING_WEIGHTS, LETTER_SPACINGS } from '../adminConstants';

export default function TypographyTab({ current, setFormData }) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TypeIcon size={20} className="text-neon-purple" />
            Typography &amp; Font Styling
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Change font family, size scaling, heading weights, and letter spacing across the entire website.
          </p>
        </div>
        <span className="text-xs text-neon-blue font-mono font-bold">
          {current.fontSizeScale || '100%'}
        </span>
      </div>

      {/* Font Family Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Font Family (Choose Modern Typography)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {FONT_OPTIONS.map((f) => {
            const isSelected = (current.fontFamily || "'Poppins', sans-serif") === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, fontFamily: f.id }))}
                style={{ fontFamily: f.id }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${isSelected
                  ? 'border-neon-purple bg-neon-purple/15 shadow-[0_0_15px_rgba(176,38,255,0.3)] ring-1 ring-neon-purple'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
                    {f.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-purple/40 text-purple-200 font-sans font-bold">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block font-sans mb-1.5">{f.category}</span>
                <p className="text-xs text-slate-200 font-light truncate">{f.sample}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size Scaling */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Global Font Size Scaling
            </label>
            <span className="text-[11px] text-slate-400 block">
              Scales all headings, cards, and body text proportionally across the site
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-white font-mono">
              {current.fontSizeScale || '100%'}
            </span>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {FONT_SIZE_PRESETS.map((preset) => {
            const isSelected = (current.fontSizeScale || '100%') === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, fontSizeScale: preset.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
                  ? 'bg-neon-purple text-white shadow-[0_0_12px_rgba(176,38,255,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {preset.label} <span className="opacity-60 text-[10px]">({preset.value})</span>
              </button>
            );
          })}
        </div>

        {/* Slider for fine tuning */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-slate-400 font-mono">85%</span>
          <input
            type="range"
            min="85"
            max="125"
            step="1"
            value={parseInt(current.fontSizeScale || '100', 10)}
            onChange={(e) => setFormData((prev) => ({ ...prev, fontSizeScale: `${e.target.value}%` }))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
          />
          <span className="text-xs text-slate-400 font-mono">125%</span>
        </div>
      </div>

      {/* Heading Weight & Letter Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Heading Font Weight */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Heading Font Weight
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {HEADING_WEIGHTS.map((w) => {
              const isSelected = (current.headingWeight || '700') === w.value;
              return (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, headingWeight: w.value }))}
                  style={{ fontWeight: w.value }}
                  className={`py-2 px-2 rounded-lg text-xs transition-all cursor-pointer text-center ${isSelected
                    ? 'bg-neon-blue/20 border border-neon-blue text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Letter Spacing
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {LETTER_SPACINGS.map((ls) => {
              const isSelected = (current.letterSpacing || '0px') === ls.value;
              return (
                <button
                  key={ls.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, letterSpacing: ls.value }))}
                  style={{ letterSpacing: ls.value }}
                  className={`py-2 px-2 rounded-lg text-xs transition-all cursor-pointer text-center ${isSelected
                    ? 'bg-neon-pink/20 border border-neon-pink text-white shadow-[0_0_10px_rgba(255,41,117,0.3)]'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                >
                  {ls.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
