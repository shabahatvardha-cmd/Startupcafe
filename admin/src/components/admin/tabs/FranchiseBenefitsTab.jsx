import { useState } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_FRANCHISE_BENEFITS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import {
  Award,
  ShieldCheck,
  Zap,
  Handshake,
  Globe,
  TrendingUp,
  Users,
  Target,
  Rocket,
  Crown,
  Building2,
  Sparkles,
  Star,
  Coins,
  Briefcase,
  HeartHandshake,
  Flame,
  Shield,
  CheckCircle2,
  BarChart3,
  Coffee,
  MapPin,
  Network,
  Video,
  Sliders,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  Compass,
  Route,
  LifeBuoy,
  CheckSquare,
} from 'lucide-react';

export const AVAILABLE_BENEFIT_ICONS = [
  { name: 'Award', label: 'Brand Award', icon: Award },
  { name: 'ShieldCheck', label: 'Trust & Model', icon: ShieldCheck },
  { name: 'Zap', label: 'Marketing Power', icon: Zap },
  { name: 'Handshake', label: 'Operations & Support', icon: Handshake },
  { name: 'Globe', label: 'ROI & Global Growth', icon: Globe },
  { name: 'TrendingUp', label: 'Revenue Growth', icon: TrendingUp },
  { name: 'Users', label: 'Community Network', icon: Users },
  { name: 'Target', label: 'Target Market', icon: Target },
  { name: 'Rocket', label: 'Fast Launch', icon: Rocket },
  { name: 'Crown', label: 'Market Leader', icon: Crown },
  { name: 'Building2', label: 'Prime Real Estate', icon: Building2 },
  { name: 'Sparkles', label: 'Premium Quality', icon: Sparkles },
  { name: 'Star', label: '5-Star Reputation', icon: Star },
  { name: 'Coins', label: 'High Margin', icon: Coins },
  { name: 'Briefcase', label: 'Corporate Clients', icon: Briefcase },
  { name: 'HeartHandshake', label: 'True Partnership', icon: HeartHandshake },
  { name: 'Flame', label: 'High Demand', icon: Flame },
  { name: 'Shield', label: 'Risk Mitigation', icon: Shield },
  { name: 'CheckCircle2', label: 'Proven SOPs', icon: CheckCircle2 },
  { name: 'BarChart3', label: 'Data & Metrics', icon: BarChart3 },
  { name: 'Coffee', label: 'Cafe Experience', icon: Coffee },
  { name: 'MapPin', label: 'Prime Location', icon: MapPin },
  { name: 'Network', label: 'Ecosystem Access', icon: Network },
  { name: 'Compass', label: 'Strategic Roadmap', icon: Compass },
];

export const COLOR_THEME_PRESETS = [
  { label: 'Neon Blue', color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', preview: '#00f0ff' },
  { label: 'Neon Purple', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', preview: '#b026ff' },
  { label: 'Neon Pink', color: 'text-neon-pink', bg: 'bg-neon-pink/10', border: 'border-neon-pink/30', preview: '#ff2975' },
  { label: 'Warm Orange', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', preview: '#fb923c' },
  { label: 'Emerald Green', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', preview: '#4ade80' },
  { label: 'Cyber Gold', color: 'text-[#facc15]', bg: 'bg-[#facc15]/10', border: 'border-amber-400/30', preview: '#facc15' },
  { label: 'Cyan Aqua', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', preview: '#22d3ee' },
  { label: 'Rose Red', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30', preview: '#fb7185' },
];

export default function FranchiseBenefitsTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const benefitsList = Array.isArray(current.franchiseBenefitsList) && current.franchiseBenefitsList.length > 0
    ? current.franchiseBenefitsList
    : DEFAULT_FRANCHISE_BENEFITS;

  const [editingId, setEditingId] = useState(null); // card id or 'new'
  const [form, setForm] = useState({
    id: '',
    title: '',
    desc: '',
    iconName: 'Award',
    color: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
  });

  const handleStartAdd = () => {
    setForm({
      id: `benefit-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Sparkles',
      color: 'text-neon-blue',
      bg: 'bg-neon-blue/10',
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setForm({
      id: item.id || `benefit-${Date.now()}`,
      title: item.title || '',
      desc: item.desc || '',
      iconName: item.iconName || 'Award',
      color: item.color || 'text-neon-blue',
      bg: item.bg || 'bg-neon-blue/10',
    });
    setEditingId(item.id || item.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveBenefit = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a benefit title.');
      return;
    }

    const updatedItem = {
      id: form.id || `benefit-${Date.now()}`,
      title: form.title.trim(),
      desc: form.desc.trim(),
      iconName: form.iconName || 'Award',
      color: form.color || 'text-neon-blue',
      bg: form.bg || 'bg-neon-blue/10',
    };

    if (editingId === 'new') {
      setFormData((prev) => ({
        ...prev,
        franchiseBenefitsList: [...benefitsList, updatedItem],
      }));
    } else {
      const nextList = benefitsList.map((item) =>
        (item.id === editingId || item.title === editingId) ? updatedItem : item
      );
      setFormData((prev) => ({
        ...prev,
        franchiseBenefitsList: nextList,
      }));
    }
    setEditingId(null);
  };

  const handleDeleteBenefit = (benefitId) => {
    if (benefitsList.length <= 1) {
      alert('You must keep at least 1 benefit card.');
      return;
    }
    const updatedList = benefitsList.filter(
      (item) => item.id !== benefitId && item.title !== benefitId
    );
    setFormData((prev) => ({
      ...prev,
      franchiseBenefitsList: updatedList,
    }));
    if (editingId === benefitId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= benefitsList.length) return;
    const copy = [...benefitsList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      franchiseBenefitsList: copy,
    }));
  };

  const handleRestoreDefaultBenefits = () => {
    if (window.confirm('Restore the original 5 default partnership benefit cards?')) {
      setFormData((prev) => ({
        ...prev,
        franchiseBenefitsList: DEFAULT_FRANCHISE_BENEFITS,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, colorClass, size = 20) => {
    const found = AVAILABLE_BENEFIT_ICONS.find((i) => i.name === iconName) || AVAILABLE_BENEFIT_ICONS[0];
    const IconComp = found.icon;
    return <IconComp size={size} className={colorClass || found.color || 'text-neon-blue'} />;
  };

  return (
    <div className="space-y-6">
      {/* STANDARDIZED FRANCHISE SECTION BAR */}
      <FranchiseSectionBar
        activeSection="benefits"
        onSwitchSection={onSwitchView}
      />

      {/* Main Section Header Copy */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Why Partner with Us Section</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Core brand advantages, proven business model pillars &amp; partner value proposition
          </p>
        </div>
        <span className="text-xs text-neon-blue font-semibold px-2.5 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
          Partner Value
        </span>
      </div>

      {/* Badge, Heading & Subtitle Fields */}
      <div className="space-y-4">
        <VisualTextEditor
          label="Section Badge Tag (Optional)"
          name="franchiseBenefitsBadge"
          value={current.franchiseBenefitsBadge || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('franchiseBenefitsBadge')}
          placeholder="e.g. Partnership Advantages"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VisualTextEditor
            label="Heading (Prefix)"
            name="franchiseBenefitsHeading"
            value={current.franchiseBenefitsHeading !== undefined ? current.franchiseBenefitsHeading : 'Why Partner with'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseBenefitsHeading')}
            placeholder="e.g. Why Partner with"
          />
          <VisualTextEditor
            label="Accent Word (Gradient Highlight)"
            name="franchiseBenefitsAccent"
            value={current.franchiseBenefitsAccent !== undefined ? current.franchiseBenefitsAccent : 'Us?'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseBenefitsAccent')}
            placeholder="e.g. Us?"
          />
        </div>

        <VisualTextEditor
          label="Section Subtitle / Description"
          name="franchiseBenefitsSubtitle"
          value={current.franchiseBenefitsSubtitle !== undefined ? current.franchiseBenefitsSubtitle : 'We provide the foundation, tools, and brand power you need to build a successful coworking business from day one.'}
          onChange={onChange}
          onFocus={() => onFocus?.('franchiseBenefitsSubtitle')}
          placeholder="We provide the foundation, tools, and brand power you need to build a successful coworking business from day one."
          isTextarea={true}
          rows={3}
        />
      </div>

      {/* Section Color Overrides */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Why Partner with Us</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Heading Color"
            name="franchiseBenefitsHeadingColor"
            value={current.franchiseBenefitsHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Subtitle Text Color"
            name="franchiseBenefitsSubtitleColor"
            value={current.franchiseBenefitsSubtitleColor || ''}
            onChange={onChange}
            defaultValue="#94a3b8"
            defaultLabel="Default (Muted)"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC BENEFITS CARDS MANAGER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Manage Partner Advantage Cards
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-semibold">
                {benefitsList.length} Cards Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add, edit, reorder or delete brand identity and business model value cards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaultBenefits}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset benefit cards back to original 5 defaults"
            >
              <RotateCcw size={13} />
              Reset Cards
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-pink hover:to-neon-blue text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              <Plus size={15} />
              Add Advantage Card
            </button>
          </div>
        </div>

        {/* INLINE CARD ADD / EDIT FORM */}
        {editingId && (
          <div className="p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-neon-blue/50 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-neon-blue uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                {editingId === 'new' ? 'Add New Advantage Card' : 'Edit Advantage Card'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <VisualTextEditor
              label="Advantage Title"
              name="benefitTitle"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Strong Brand Identity, Proven Business Model"
              helperText="Highlight any word to apply neon colors, gradients, bold, or size."
            />

            <VisualTextEditor
              label="Description & Value Proposition"
              name="benefitDesc"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              isTextarea
              rows={3}
              placeholder="Explain the specific value provided to franchise partners..."
              helperText="Highlight any word to style it."
            />

            {/* Icon Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Choose Card Icon
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                {AVAILABLE_BENEFIT_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = form.iconName === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setForm({ ...form, iconName: item.name })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neon-blue/20 border-2 border-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.4)] text-white scale-105'
                          : 'bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={item.label}
                    >
                      <IconComp size={18} className={isSelected ? 'text-neon-blue' : ''} />
                      <span className="text-[9px] truncate w-full text-center leading-tight">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color & Tint Preset */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Card Accent Color &amp; Background Tint
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_THEME_PRESETS.map((preset) => {
                  const isSelected = form.color === preset.color;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setForm({ ...form, color: preset.color, bg: preset.bg })}
                      className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.2)] text-white'
                          : 'border-white/10 bg-black/40 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.preview }}
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Mini Preview of this card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Card Mini Preview:
              </span>
              <div className="glass-card p-5 border border-white/10 rounded-xl max-w-sm">
                <div className={`w-12 h-12 rounded-2xl ${form.bg} flex items-center justify-center mb-4`}>
                  {renderIconComponent(form.iconName, form.color, 24)}
                </div>
                <h5 className="text-base font-bold text-white mb-2">
                  {form.title || 'Advantage Title Preview'}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {form.desc || 'Advantage description explaining the benefits and value proposition to prospective partners.'}
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBenefit}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                <Check size={14} />
                Save Card
              </button>
            </div>
          </div>
        )}

        {/* LIST OF CARDS */}
        <div className="space-y-2.5">
          {benefitsList.map((card, index) => {
            const isEditing = editingId === (card.id || card.title);
            return (
              <div
                key={card.id || index}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isEditing
                    ? 'border-neon-blue bg-neon-blue/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div
                  onClick={() => handleStartEdit(card)}
                  className="flex items-start gap-3.5 min-w-0 cursor-pointer flex-1 group"
                  title="Click to edit this card"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg || 'bg-neon-blue/10'} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {renderIconComponent(card.iconName, card.color, 20)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white truncate group-hover:text-neon-blue transition-colors">
                        {renderFormattedText(card.title)}
                      </h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400 shrink-0">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {renderFormattedText(card.desc)}
                    </p>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === benefitsList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(card)}
                    className="px-2.5 py-1.5 rounded-lg border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Edit Card"
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBenefit(card.id || card.title)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CALLOUT / CTA CARD: "START YOUR JOURNEY" */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border border-white/15 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-neon-pink" />
              <span>Partner Callout Card (Final Card in Grid)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              The high-converting gradient callout card featuring your vision tagline and inquiry button.
            </p>
          </div>
          <span className="text-[10px] font-mono text-neon-blue uppercase px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/30">
            CTA Action
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VisualTextEditor
            label="Callout Card Title"
            name="franchiseBenefitsCtaTitle"
            value={current.franchiseBenefitsCtaTitle !== undefined ? current.franchiseBenefitsCtaTitle : 'Start Your Journey'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseBenefitsCtaTitle')}
            placeholder="e.g. Start Your Journey"
          />

          <VisualTextEditor
            label="Callout Button Text"
            name="franchiseBenefitsCtaButton"
            value={current.franchiseBenefitsCtaButton !== undefined ? current.franchiseBenefitsCtaButton : 'Inquire Now'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseBenefitsCtaButton')}
            placeholder="e.g. Inquire Now"
          />
        </div>

        <VisualTextEditor
          label="Callout Quote / Tagline"
          name="franchiseBenefitsCtaQuote"
          value={current.franchiseBenefitsCtaQuote !== undefined ? current.franchiseBenefitsCtaQuote : 'Building the workspace of tomorrow, together.'}
          onChange={onChange}
          onFocus={() => onFocus?.('franchiseBenefitsCtaQuote')}
          placeholder="e.g. Building the workspace of tomorrow, together."
        />

        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
          <span className="text-neon-blue">ℹ</span>
          <span>Clicking &quot;{current.franchiseBenefitsCtaButton || 'Inquire Now'}&quot; on the website smoothly scrolls the user directly to the official Franchise Inquiry Form.</span>
        </div>
      </div>
    </div>
  );
}
