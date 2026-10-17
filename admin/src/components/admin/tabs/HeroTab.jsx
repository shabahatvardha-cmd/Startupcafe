import VisualTextEditor from '../VisualTextEditor';
import { renderFormattedText } from '../../../utils/textFormatter';
import ColorPaletteInput from '../ColorPaletteInput';

export default function HeroTab({ current, onChange, onFocus, setFormData }) {
  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Hero Section Copy</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any word below to change its color, size, or style visually without any code brackets!
          </p>
        </div>
        <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
          Top Landing View
        </span>
      </div>

      {/* Badge Text */}
      <VisualTextEditor
        label="Badge Text (Top Pill)"
        name="badgeText"
        value={current.badgeText || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('badgeText')}
        placeholder="e.g. Premium Workspace Experience"
      />

      {/* Main Heading */}
      <VisualTextEditor
        label="Main Heading (Line 1)"
        name="mainHeading"
        value={current.mainHeading || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('mainHeading')}
        placeholder="e.g. Your Premium Office"
      />

      {/* Gradient Accent Subheading */}
      <VisualTextEditor
        label="Gradient Accent Subheading (Line 2)"
        name="subHeading"
        value={current.subHeading || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('subHeading')}
        placeholder="e.g. @ Startup Cafe"
      />

      {/* Description */}
      <VisualTextEditor
        label="Hero Description / Paragraph"
        name="description"
        value={current.description || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('description')}
        placeholder="Describe your workspace value proposition..."
        isTextarea={true}
        rows={3}
      />

      {/* CTA Buttons - Visual Text Editors & Color Controls */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            CTA Button Labels &amp; Styles
          </h4>
          <span className="text-[10px] text-slate-400">Select words to format with colors, sizes, or bold</span>
        </div>

        <div className="space-y-3">
          <VisualTextEditor
            label="Primary CTA Button Label (e.g. Book a Seat)"
            name="primaryButtonText"
            value={current.primaryButtonText || ''}
            onChange={onChange}
            onFocus={() => onFocus?.('primaryButtonText')}
            placeholder="e.g. Book a Seat"
          />

          <VisualTextEditor
            label="Secondary CTA Button Label (e.g. Schedule a Visit)"
            name="secondaryButtonText"
            value={current.secondaryButtonText || ''}
            onChange={onChange}
            onFocus={() => onFocus?.('secondaryButtonText')}
            placeholder="e.g. Schedule a Visit"
          />
        </div>

        {/* Primary Button Gradient Colors */}
        <div className="pt-2 border-t border-white/5 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Primary Button Glow &amp; Gradient Colors
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ColorPaletteInput
              label="Gradient Left / Glow"
              name="accentColor"
              value={current.accentColor || '#b026ff'}
              onChange={onChange}
              defaultValue="#b026ff"
              defaultLabel="Neon Purple (#b026ff)"
            />
            <ColorPaletteInput
              label="Gradient Right"
              name="gradientEnd"
              value={current.gradientEnd || '#00f0ff'}
              onChange={onChange}
              defaultValue="#00f0ff"
              defaultLabel="Neon Cyan (#00f0ff)"
            />
          </div>

          {/* Button Live Preview Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Button Preview:</span>
            <button
              type="button"
              style={{
                background: `linear-gradient(to right, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm pointer-events-none"
            >
              {renderFormattedText(current.primaryButtonText || 'Book a Seat')}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white glass-card border border-white/20 pointer-events-none"
            >
              {renderFormattedText(current.secondaryButtonText || 'Schedule a Visit')}
            </button>
          </div>
        </div>
      </div>

      {/* Individual Hero Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Hero Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Hero</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Main Heading Color"
            name="heroHeadingColor"
            value={current.heroHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Description Color"
            name="heroDescriptionColor"
            value={current.heroDescriptionColor || ''}
            onChange={onChange}
            defaultValue="#cbd5e1"
            defaultLabel="Default (Slate)"
          />
        </div>
      </div>
    </div>
  );
}
