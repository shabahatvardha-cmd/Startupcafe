import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_SUPPORT_ITEMS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import {
  MapPin,
  Palette,
  Megaphone,
  Cpu,
  GraduationCap,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Users,
  BarChart3,
  Target,
  Rocket,
  Zap,
  Award,
  Store,
  Coffee,
  Laptop,
  Handshake,
  Compass,
  FileCheck,
  PhoneCall,
  Clock,
  Sparkles,
  TrendingUp,
  Download,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  LayoutGrid,
  Columns,
  SlidersHorizontal,
  Bookmark,
  Layers,
} from 'lucide-react';

export const AVAILABLE_SUPPORT_ICONS = [
  { name: 'MapPin', label: 'Location Guidance', icon: MapPin },
  { name: 'Palette', label: 'Interior Design', icon: Palette },
  { name: 'Megaphone', label: 'Digital Marketing', icon: Megaphone },
  { name: 'Cpu', label: 'Tech Stack & Apps', icon: Cpu },
  { name: 'GraduationCap', label: 'Staff Training', icon: GraduationCap },
  { name: 'Headphones', label: 'Dedicated Support', icon: Headphones },
  { name: 'LifeBuoy', label: 'Ecosystem Care', icon: LifeBuoy },
  { name: 'ShieldCheck', label: 'Legal & SOP Compliance', icon: ShieldCheck },
  { name: 'Users', label: 'Community Growth', icon: Users },
  { name: 'BarChart3', label: 'Financial Auditing', icon: BarChart3 },
  { name: 'Target', label: 'Local Lead Gen', icon: Target },
  { name: 'Rocket', label: 'Launch Acceleration', icon: Rocket },
  { name: 'Zap', label: 'Speedy Resolution', icon: Zap },
  { name: 'Award', label: 'Quality Standards', icon: Award },
  { name: 'Store', label: 'Workspace Retail', icon: Store },
  { name: 'Coffee', label: 'F&B Cafe Standards', icon: Coffee },
  { name: 'Laptop', label: 'IT & Hardware Setup', icon: Laptop },
  { name: 'Handshake', label: 'Franchise Relations', icon: Handshake },
  { name: 'Compass', label: 'Expansion Roadmap', icon: Compass },
  { name: 'FileCheck', label: 'License & Permits', icon: FileCheck },
  { name: 'PhoneCall', label: '24/7 Hotline', icon: PhoneCall },
  { name: 'Clock', label: 'Operational Uptime', icon: Clock },
  { name: 'Sparkles', label: 'VIP Experiences', icon: Sparkles },
  { name: 'TrendingUp', label: 'Revenue Growth Mentorship', icon: TrendingUp },
];

export const SUPPORT_LAYOUT_STYLES = [
  {
    id: 'grid',
    name: 'Bento Grid + CTA Card',
    tag: 'Original Baseline',
    desc: 'Classic 3-column responsive grid with dark glass cards, hover scaling, and the vibrant gradient brochure card.',
    icon: LayoutGrid,
    badgeColor: 'border-neon-purple/40 text-neon-purple bg-neon-purple/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="42" height="18" rx="3" fill="#1e293b" stroke="#b026ff" strokeWidth="1" />
        <rect x="59" y="8" width="42" height="18" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="108" y="8" width="42" height="18" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="10" y="30" width="42" height="18" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="59" y="30" width="42" height="18" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="108" y="30" width="42" height="18" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'interactive-tabs',
    name: 'Interactive Tab Showcase',
    tag: 'Interactive Focus',
    desc: 'Interactive pillar list on the left with a prominent glowing spotlight card on the right and quick brochure action.',
    icon: Layers,
    badgeColor: 'border-neon-blue/40 text-neon-blue bg-neon-blue/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Tabs */}
        <rect x="12" y="8" width="46" height="8" rx="2" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
        <rect x="12" y="19" width="46" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="12" y="30" width="46" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="12" y="41" width="46" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Right Big Showcase Card */}
        <rect x="66" y="8" width="82" height="41" rx="4" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.2" />
        <circle cx="82" cy="22" r="5" fill="#00f0ff" />
        <rect x="94" y="18" width="44" height="4" rx="2" fill="#94a3b8" />
        <rect x="76" y="32" width="62" height="3" rx="1.5" fill="#475569" />
        <rect x="76" y="38" width="40" height="3" rx="1.5" fill="#475569" />
      </svg>
    ),
  },
  {
    id: 'compact-cards',
    name: 'Numbered Cards & Banner',
    tag: 'Modern & Clean',
    desc: 'Numbered glass cards (#01–#05) with glowing category icons and a full-width bottom brochure download banner.',
    icon: Bookmark,
    badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="32" height="24" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
        <rect x="46" y="8" width="32" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="82" y="8" width="32" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="118" y="8" width="32" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Full-width bottom banner */}
        <rect x="10" y="36" width="140" height="13" rx="3" fill="#042f2e" stroke="#10b981" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'split-columns',
    name: 'Dual Column & Sticky CTA',
    tag: 'High Conversion',
    desc: 'Two-column stacked pillar cards on the left paired with a dedicated sticky brochure download card on the right.',
    icon: Columns,
    badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Col 1 */}
        <rect x="10" y="8" width="44" height="19" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <rect x="10" y="30" width="44" height="19" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Left Col 2 */}
        <rect x="58" y="8" width="44" height="19" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="58" y="30" width="44" height="19" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Right Sticky CTA */}
        <rect x="106" y="8" width="44" height="41" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="128" cy="22" r="5" fill="#f59e0b" />
        <rect x="114" y="34" width="28" height="6" rx="2" fill="#fef3c7" />
      </svg>
    ),
  },
];

export default function FranchiseSupportTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const itemsList = Array.isArray(current.supportItemsList) && current.supportItemsList.length > 0
    ? current.supportItemsList
    : DEFAULT_SUPPORT_ITEMS;

  const currentLayoutStyle = current.supportLayoutStyle || 'grid';

  // Automatically activate Operational Support in Live Preview on mount
  useEffect(() => {
    onFocus?.('supportHeading');
  }, []);

  const [editingId, setEditingId] = useState(null); // card id or 'new'
  const [snapshotList, setSnapshotList] = useState(null);
  const [form, setForm] = useState({
    id: '',
    title: '',
    desc: '',
    iconName: 'MapPin',
  });

  const handleSelectLayout = (layoutId) => {
    setFormData((prev) => ({
      ...prev,
      supportLayoutStyle: layoutId,
    }));
    onFocus?.('supportLayoutStyle');
  };

  const handleStartAdd = () => {
    setForm({
      id: `support-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'LifeBuoy',
    });
    setEditingId('new');
    onFocus?.('pillarTitle');
  };

  const handleStartEdit = (item) => {
    setSnapshotList(itemsList);
    setForm({
      id: item.id || `support-${Date.now()}`,
      title: item.title || '',
      desc: item.desc || '',
      iconName: item.iconName || 'MapPin',
    });
    setEditingId(item.id || item.title);
    onFocus?.('pillarTitle');
  };

  const handleCancelEdit = () => {
    if (snapshotList) {
      setFormData?.((prev) => ({
        ...prev,
        supportItemsList: snapshotList,
      }));
      setSnapshotList(null);
    }
    setEditingId(null);
    onFocus?.('supportHeading');
  };

  // Live-updates pillar changes into formData.supportItemsList while typing
  const handleUpdateFormField = (fieldKey, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [fieldKey]: value };
      if (editingId && editingId !== 'new') {
        const nextList = itemsList.map((item) =>
          (item.id === editingId || item.title === editingId)
            ? { ...item, ...nextForm }
            : item
        );
        setFormData?.((prevData) => ({
          ...prevData,
          supportItemsList: nextList,
        }));
      }
      return nextForm;
    });
  };

  const handleSaveItem = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a support pillar title.');
      return;
    }

    const updatedItem = {
      id: form.id || `support-${Date.now()}`,
      title: form.title.trim(),
      desc: form.desc.trim(),
      iconName: form.iconName || 'MapPin',
    };

    if (editingId === 'new') {
      setFormData((prev) => ({
        ...prev,
        supportItemsList: [...itemsList, updatedItem],
      }));
    } else {
      const nextList = itemsList.map((item) =>
        (item.id === editingId || item.title === editingId) ? updatedItem : item
      );
      setFormData((prev) => ({
        ...prev,
        supportItemsList: nextList,
      }));
    }
    setSnapshotList(null);
    setEditingId(null);
    onFocus?.('supportHeading');
  };

  const handleDeleteItem = (targetId) => {
    if (itemsList.length <= 1) {
      alert('You must keep at least 1 support pillar.');
      return;
    }
    const updatedList = itemsList.filter((s) => s.id !== targetId && s.title !== targetId);
    setFormData((prev) => ({
      ...prev,
      supportItemsList: updatedList,
    }));
    if (editingId === targetId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= itemsList.length) return;
    const copy = [...itemsList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      supportItemsList: copy,
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all support pillars back to original defaults?')) {
      setFormData((prev) => ({
        ...prev,
        supportItemsList: DEFAULT_SUPPORT_ITEMS,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, className = 'w-5 h-5') => {
    const iconObj = AVAILABLE_SUPPORT_ICONS.find((i) => i.name === iconName);
    const IconComp = iconObj ? iconObj.icon : LifeBuoy;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-8">
      {/* STANDARDIZED FRANCHISE SECTION BAR */}
      <FranchiseSectionBar
        activeSection="support"
        onSwitchSection={onSwitchView}
      />

      {/* 1. ARRANGEMENT & LAYOUT STYLES SELECTOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-purple/5 via-dark-card to-neon-blue/5 border-2 border-neon-purple/30 space-y-4 shadow-[0_0_25px_rgba(176,38,255,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-neon-purple" />
              <h3 className="text-base font-bold text-white">Select Arrangement Style</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                New Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Choose how the support pillars and brochure download CTA are arranged. The original codebase bento layout is preserved by default.
            </p>
          </div>
          <span className="text-xs font-mono text-neon-purple bg-black/40 px-3 py-1 rounded-lg border border-neon-purple/30 shrink-0">
            Active: <span className="font-bold uppercase">{currentLayoutStyle}</span>
          </span>
        </div>

        {/* Layout Cards Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {SUPPORT_LAYOUT_STYLES.map((style) => {
            const isSelected = currentLayoutStyle === style.id;
            const StyleIcon = style.icon;
            return (
              <div
                key={style.id}
                onClick={() => handleSelectLayout(style.id)}
                className={`group relative p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-neon-purple shadow-[0_0_20px_rgba(176,38,255,0.35)] scale-[1.02]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                  }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-neon-purple text-white flex items-center justify-center shadow-[0_0_10px_#b026ff]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                {/* Card Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/5 text-slate-300'}`}>
                      <StyleIcon size={16} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeColor}`}>
                      {style.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">
                    {style.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {style.desc}
                  </p>
                </div>

                {/* Miniature Visual Diagram */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-center bg-black/40 rounded-lg p-1">
                  {style.previewSvg}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION HEADER & COPY EDITORS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Section Header &amp; Subtitle
            </h3>
            <p className="text-xs text-slate-400">
              Customize the section badge, title, accent word, and introductory description.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VisualTextEditor
            label="Section Badge"
            name="supportBadge"
            value={current.supportBadge !== undefined ? current.supportBadge : 'Comprehensive Ecosystem'}
            onChange={onChange}
            onFocus={() => onFocus?.('supportBadge')}
            placeholder="e.g. Comprehensive Ecosystem or 360° Partner Care"
            helpText="Small pill label displayed above heading."
          />

          <VisualTextEditor
            label="Main Heading"
            name="supportHeading"
            value={current.supportHeading !== undefined ? current.supportHeading : 'Unmatched'}
            onChange={onChange}
            onFocus={() => onFocus?.('supportHeading')}
            placeholder="e.g. Unmatched"
            helpText="Main heading text."
          />

          <VisualTextEditor
            label="Accent Word (Neon Purple)"
            name="supportAccent"
            value={current.supportAccent !== undefined ? current.supportAccent : 'Support'}
            onChange={onChange}
            onFocus={() => onFocus?.('supportAccent')}
            placeholder="e.g. Support"
            helpText="Glowing highlighted accent word."
          />
        </div>

        <VisualTextEditor
          label="Support Description / Paragraph"
          name="supportSubtitle"
          value={current.supportSubtitle !== undefined ? current.supportSubtitle : 'You are never alone on your journey. Our expert teams are with you from day one to ensure your cafe is a massive success.'}
          onChange={onChange}
          onFocus={() => onFocus?.('supportSubtitle')}
          multiline
          rows={2}
          placeholder="e.g. You are never alone on your journey..."
          helpText="Descriptive paragraph explaining the support network."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <ColorPaletteInput
            label="Heading Color Override (Optional)"
            name="supportHeadingColor"
            value={current.supportHeadingColor || ''}
            onChange={onChange}
          />
          <ColorPaletteInput
            label="Subtitle Color Override (Optional)"
            name="supportSubtitleColor"
            value={current.supportSubtitleColor || ''}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 3. BROCHURE DOWNLOAD CTA CARD EDITORS */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-blue/10 via-white/[0.02] to-neon-purple/10 border border-neon-blue/30 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-neon-blue" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Brochure Download CTA Card
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Modal &amp; Lead Capture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <VisualTextEditor
            label="CTA Card Title"
            name="supportCtaTitle"
            value={current.supportCtaTitle !== undefined ? current.supportCtaTitle : 'Ready to Lead?'}
            onChange={onChange}
            onFocus={() => onFocus?.('supportCtaTitle')}
            placeholder="e.g. Ready to Lead?"
          />

          <VisualTextEditor
            label="CTA Button Text"
            name="supportCtaButton"
            value={current.supportCtaButton !== undefined ? current.supportCtaButton : 'Download Brochure'}
            onChange={onChange}
            onFocus={() => onFocus?.('supportCtaButton')}
            placeholder="e.g. Download Brochure"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Brochure File Download Link
            </label>
            <input
              type="text"
              name="supportBrochureUrl"
              value={current.supportBrochureUrl !== undefined ? current.supportBrochureUrl : '/StartUp%20Cafe%20Brochure.pdf'}
              onChange={onChange}
              onFocus={() => onFocus?.('supportBrochureUrl')}
              placeholder="/StartUp%20Cafe%20Brochure.pdf"
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-mono focus:border-neon-blue focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default: /StartUp%20Cafe%20Brochure.pdf
            </span>
          </div>
        </div>

        <VisualTextEditor
          label="CTA Card Subtitle / Description"
          name="supportCtaSubtitle"
          value={current.supportCtaSubtitle !== undefined ? current.supportCtaSubtitle : 'Download our complete franchise brochure to see the full list of support services.'}
          onChange={onChange}
          onFocus={() => onFocus?.('supportCtaSubtitle')}
          multiline
          rows={2}
          placeholder="e.g. Download our complete franchise brochure to see the full list of support services."
        />
      </div>

      {/* 4. DYNAMIC SUPPORT PILLARS MANAGER */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Support Pillars ({itemsList.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Customize each pillar of support, assign Lucide icons, or reorder the services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset back to original 5 support pillars"
            >
              <RotateCcw size={13} />
              Reset Defaults
            </button>

            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3.5 py-1.5 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} />
              Add Support Pillar
            </button>
          </div>
        </div>

        {/* INLINE EDIT / CREATE FORM */}
        {editingId !== null && (
          <div
            className="p-5 rounded-2xl bg-white/[0.04] border-2 border-neon-purple/50 space-y-4 shadow-[0_0_20px_rgba(176,38,255,0.2)] animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-neon-purple uppercase tracking-wider flex items-center gap-2">
                {editingId === 'new' ? <Plus size={15} /> : <Pencil size={15} />}
                <span>{editingId === 'new' ? 'Add Support Pillar' : 'Edit Pillar Details'}</span>
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <VisualTextEditor
              label="Pillar Title"
              name="pillarTitle"
              value={form.title}
              onChange={(e) => handleUpdateFormField('title', e.target.value)}
              onFocus={() => onFocus?.('pillarTitle')}
              placeholder="e.g. Location Selection, Tech Stack, Staff Training"
              helperText="Highlight any word to apply neon colors, gradients, bold, or size."
            />

            <VisualTextEditor
              label="Pillar Description"
              name="pillarDesc"
              value={form.desc}
              onChange={(e) => handleUpdateFormField('desc', e.target.value)}
              onFocus={() => onFocus?.('pillarDesc')}
              isTextarea
              rows={2}
              placeholder="Briefly describe what kind of support is offered..."
              helperText="Highlight any word to style it."
            />

            {/* Icon Picker Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Pillar Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-black/40 border border-white/10">
                {AVAILABLE_SUPPORT_ICONS.map((item) => {
                  const isSelected = form.iconName === item.name;
                  const IconC = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        handleUpdateFormField('iconName', item.name);
                        onFocus?.('supportPillarIcon');
                      }}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer ${isSelected
                          ? 'bg-neon-purple/25 border-2 border-neon-purple text-white shadow-[0_0_12px_rgba(176,38,255,0.5)]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      title={item.label}
                    >
                      <IconC size={18} />
                      <span className="text-[9px] truncate max-w-full leading-tight font-medium">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 rounded-lg border border-white/20 text-xs font-medium text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-4 py-1.5 rounded-lg bg-neon-purple hover:bg-neon-purple/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(176,38,255,0.4)] cursor-pointer"
              >
                <Check size={14} />
                Save Pillar
              </button>
            </div>
          </div>
        )}

        {/* PILLARS LIST */}
        <div className="space-y-2.5">
          {itemsList.map((item, index) => {
            const isEditingThis = editingId === (item.id || item.title);
            return (
              <div
                key={item.id || index}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isEditingThis
                    ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_15px_rgba(176,38,255,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                  }`}
              >
                {/* Left Pillar Info */}
                <div
                  onClick={() => handleStartEdit(item)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1 group"
                  title="Click to edit this support pillar"
                >
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {renderIconComponent(item.iconName, 'w-5 h-5 text-neon-purple')}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate flex items-center gap-2 group-hover:text-neon-purple transition-colors">
                      <span>{renderFormattedText(item.title)}</span>
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                      {renderFormattedText(item.desc)}
                    </p>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === itemsList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="px-2.5 py-1.5 rounded-lg border border-neon-purple/40 bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Edit Pillar"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id || item.title)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 cursor-pointer transition-colors"
                    title="Delete Pillar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
