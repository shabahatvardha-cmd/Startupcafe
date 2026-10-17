import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_REQUIREMENTS_ITEMS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import {
  Square,
  Map,
  Building,
  Maximize2,
  Layers,
  ShieldCheck,
  Zap,
  Car,
  Compass,
  Store,
  Coffee,
  Briefcase,
  Clock,
  Sparkles,
  Users,
  CheckCircle,
  CheckSquare,
  DoorOpen,
  Warehouse,
  Flame,
  Shield,
  Laptop,
  Key,
  PhoneCall,
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
  Eye,
  FileText,
} from 'lucide-react';

export const AVAILABLE_REQUIREMENTS_ICONS = [
  { name: 'Square', label: 'Square Area (Default)', icon: Square },
  { name: 'Map', label: 'Prime Location (Default)', icon: Map },
  { name: 'Building', label: 'Building Standards (Default)', icon: Building },
  { name: 'Maximize2', label: 'Expansive Floor Plan', icon: Maximize2 },
  { name: 'Layers', label: 'Multi-Floor Layout', icon: Layers },
  { name: 'ShieldCheck', label: 'Security & Compliance', icon: ShieldCheck },
  { name: 'Zap', label: '100% Power Backup', icon: Zap },
  { name: 'Car', label: 'Parking & Accessibility', icon: Car },
  { name: 'Compass', label: 'Strategic Highway Access', icon: Compass },
  { name: 'Store', label: 'High Street Retail Zone', icon: Store },
  { name: 'Coffee', label: 'Cafe & Pantry Provision', icon: Coffee },
  { name: 'Briefcase', label: 'Corporate Tech Hub', icon: Briefcase },
  { name: 'Clock', label: '24/7 Access Permission', icon: Clock },
  { name: 'Sparkles', label: 'Grade-A Architecture', icon: Sparkles },
  { name: 'Users', label: 'High Footfall Zone', icon: Users },
  { name: 'CheckCircle', label: 'Verified Property', icon: CheckCircle },
  { name: 'CheckSquare', label: 'Criteria Checklist', icon: CheckSquare },
  { name: 'DoorOpen', label: 'Wide Entrance & Lift', icon: DoorOpen },
  { name: 'Warehouse', label: 'High Ceiling Structure', icon: Warehouse },
  { name: 'Flame', label: 'Fire Safety Compliant', icon: Flame },
  { name: 'Shield', label: 'Gated Commercial Park', icon: Shield },
  { name: 'Laptop', label: 'High-Speed Fiber Ready', icon: Laptop },
  { name: 'Key', label: 'Direct Landlord Lease', icon: Key },
  { name: 'PhoneCall', label: 'Dedicated Reception Desk', icon: PhoneCall },
];

export const REQUIREMENTS_LAYOUT_STYLES = [
  {
    id: 'grid',
    name: 'Bento Grid & Callout',
    tag: 'Original Baseline',
    desc: 'Classic 3-column responsive grid with dark glass cards, hover scaling, and bottom Note on Investment capability card.',
    icon: LayoutGrid,
    badgeColor: 'border-neon-blue/40 text-neon-blue bg-neon-blue/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="42" height="24" rx="3" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
        <rect x="59" y="8" width="42" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="108" y="8" width="42" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <rect x="10" y="38" width="140" height="12" rx="3" fill="#0f172a" stroke="#00f0ff" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: 'showcase',
    name: 'Criteria Spotlight Tab',
    tag: 'Interactive Focus',
    desc: 'Interactive selector tabs on the left with glowing focal criteria spotlight on the right, plus integrated investment callout.',
    icon: Layers,
    badgeColor: 'border-neon-purple/40 text-neon-purple bg-neon-purple/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="8" width="46" height="8" rx="2" fill="#1e293b" stroke="#b026ff" strokeWidth="1" />
        <rect x="12" y="19" width="46" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="12" y="30" width="46" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="66" y="8" width="82" height="30" rx="4" fill="#0f172a" stroke="#b026ff" strokeWidth="1.2" />
        <circle cx="82" cy="18" r="4" fill="#b026ff" />
        <rect x="92" y="15" width="46" height="4" rx="2" fill="#94a3b8" />
        <rect x="76" y="27" width="62" height="3" rx="1.5" fill="#475569" />
        <rect x="12" y="42" width="136" height="8" rx="2" fill="#1e1b4b" stroke="#b026ff" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    id: 'modern',
    name: 'Numbered Metric Specs',
    tag: 'Modern & Clean',
    desc: 'Numbered glass cards (#01, #02, #03) with glowing category icons and an elevated dual-tone investment capability module.',
    icon: Bookmark,
    badgeColor: 'border-neon-pink/40 text-neon-pink bg-neon-pink/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="42" height="23" rx="3" fill="#1e293b" stroke="#ff007f" strokeWidth="1" />
        <text x="16" y="18" fill="#ff007f" fontSize="8" fontFamily="monospace" fontWeight="bold">01</text>
        <rect x="59" y="8" width="42" height="23" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <text x="65" y="18" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">02</text>
        <rect x="108" y="8" width="42" height="23" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <text x="114" y="18" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">03</text>
        <rect x="10" y="37" width="140" height="13" rx="3" fill="#3b0764" stroke="#ff007f" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: 'checklist',
    name: 'Split Checklist & Sticky Note',
    tag: 'High Clarity',
    desc: 'Two-column split view: Verified physical criteria checklist on the left, dedicated sticky note on investment capability on the right.',
    icon: Columns,
    badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="80" height="11" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
        <rect x="10" y="23" width="80" height="11" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="10" y="38" width="80" height="11" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <rect x="98" y="8" width="52" height="41" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
        <rect x="106" y="16" width="36" height="5" rx="2" fill="#a7f3d0" />
        <rect x="106" y="25" width="36" height="3" rx="1.5" fill="#6ee7b7" />
        <rect x="106" y="38" width="36" height="6" rx="2" fill="#10b981" />
      </svg>
    ),
  },
];

export default function FranchiseRequirementsTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const itemsList = Array.isArray(current.requirementsItemsList) && current.requirementsItemsList.length > 0
    ? current.requirementsItemsList
    : DEFAULT_REQUIREMENTS_ITEMS;

  const currentLayoutStyle = current.requirementsLayoutStyle || 'grid';

  // Automatically activate Space & Requirements in Live Preview on mount
  useEffect(() => {
    onFocus?.('requirementsHeading');
  }, []);

  const [editingId, setEditingId] = useState(null); // item id or 'new'
  const [snapshotList, setSnapshotList] = useState(null);
  const [form, setForm] = useState({
    id: '',
    title: '',
    desc: '',
    iconName: 'Square',
  });

  const handleSelectLayout = (layoutId) => {
    setFormData((prev) => ({
      ...prev,
      requirementsLayoutStyle: layoutId,
    }));
    onFocus?.('requirementsLayoutStyle');
  };

  const handleStartAdd = () => {
    setForm({
      id: `req-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Square',
    });
    setEditingId('new');
    onFocus?.('reqTitle');
  };

  const handleStartEdit = (item) => {
    setSnapshotList(itemsList);
    setForm({
      id: item.id || `req-${Date.now()}`,
      title: item.title || '',
      desc: item.desc || '',
      iconName: item.iconName || 'Square',
    });
    setEditingId(item.id || item.title);
    onFocus?.('reqTitle');
  };

  const handleCancelEdit = () => {
    if (snapshotList) {
      setFormData?.((prev) => ({
        ...prev,
        requirementsItemsList: snapshotList,
      }));
      setSnapshotList(null);
    }
    setEditingId(null);
    onFocus?.('requirementsHeading');
  };

  // Live-updates requirement card changes into formData.requirementsItemsList while typing
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
          requirementsItemsList: nextList,
        }));
      }
      return nextForm;
    });
  };

  const handleSaveItem = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a requirement title.');
      return;
    }

    const updatedItem = {
      id: form.id || `req-${Date.now()}`,
      title: form.title.trim(),
      desc: form.desc.trim(),
      iconName: form.iconName || 'Square',
    };

    if (editingId === 'new') {
      setFormData((prev) => ({
        ...prev,
        requirementsItemsList: [...itemsList, updatedItem],
      }));
    } else {
      const nextList = itemsList.map((item) =>
        (item.id === editingId || item.title === editingId) ? updatedItem : item
      );
      setFormData((prev) => ({
        ...prev,
        requirementsItemsList: nextList,
      }));
    }
    setSnapshotList(null);
    setEditingId(null);
    onFocus?.('requirementsHeading');
  };

  const handleDeleteItem = (targetId) => {
    if (itemsList.length <= 1) {
      alert('You must keep at least 1 requirement criteria.');
      return;
    }
    const updatedList = itemsList.filter((s) => s.id !== targetId && s.title !== targetId);
    setFormData((prev) => ({
      ...prev,
      requirementsItemsList: updatedList,
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
      requirementsItemsList: copy,
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all space requirements back to original defaults?')) {
      setFormData((prev) => ({
        ...prev,
        requirementsItemsList: DEFAULT_REQUIREMENTS_ITEMS,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, className = 'w-5 h-5') => {
    const iconObj = AVAILABLE_REQUIREMENTS_ICONS.find((i) => i.name === iconName);
    const IconComp = iconObj ? iconObj.icon : Square;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-8">
      {/* STANDARDIZED FRANCHISE SECTION BAR */}
      <FranchiseSectionBar
        activeSection="requirements"
        onSwitchSection={onSwitchView}
      />

      {/* 1. ARRANGEMENT & LAYOUT STYLES SELECTOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-blue/5 via-dark-card to-neon-purple/5 border-2 border-neon-blue/30 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-neon-blue" />
              <h3 className="text-base font-bold text-white">Select Arrangement Style</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                New Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Choose how the space criteria cards and the "Note on Investment capability" card are arranged. The original codebase layout is preserved by default.
            </p>
          </div>
          <span className="text-xs font-mono text-neon-blue bg-black/40 px-3 py-1 rounded-lg border border-neon-blue/30 shrink-0">
            Active: <span className="font-bold uppercase">{currentLayoutStyle}</span>
          </span>
        </div>

        {/* Layout Cards Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {REQUIREMENTS_LAYOUT_STYLES.map((style) => {
            const isSelected = currentLayoutStyle === style.id;
            const IconComp = style.icon;
            return (
              <div
                key={style.id}
                onClick={() => handleSelectLayout(style.id)}
                className={`relative rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between group ${isSelected
                    ? 'bg-white/[0.08] border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-neon-blue'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <IconComp
                        size={15}
                        className={isSelected ? 'text-neon-blue' : 'text-slate-400 group-hover:text-white'}
                      />
                      <span className="text-xs font-bold text-white">{style.name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-neon-blue text-black flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-block px-1.5 py-0.5 mb-2 rounded text-[9px] font-mono font-semibold uppercase tracking-wider border ${style.badgeColor}`}
                  >
                    {style.tag}
                  </span>

                  {/* Visual SVG Blueprint */}
                  <div className="rounded-lg bg-black/50 border border-white/5 p-1 mb-2.5 overflow-hidden">
                    {style.previewSvg}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{style.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-neon-blue font-semibold' : 'text-slate-500'}>
                    {isSelected ? '● Currently Active' : 'Click to preview'}
                  </span>
                  <span className="font-mono text-slate-400 uppercase">{style.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION HEADINGS & BADGE */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-neon-blue" />
            <h3 className="text-base font-bold text-white">Section Headers &amp; Badge</h3>
          </div>
          <span className="text-xs text-slate-400">Word-level neon styling available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisualTextEditor
            label="Section Badge"
            name="requirementsBadge"
            value={current.requirementsBadge !== undefined ? current.requirementsBadge : 'Space & Criteria'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsBadge')}
            placeholder="e.g. Space & Criteria"
            helpText="Small pill label displayed above heading."
          />

          <VisualTextEditor
            label="Main Heading Prefix"
            name="requirementsHeading"
            value={current.requirementsHeading !== undefined ? current.requirementsHeading : 'Space &'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsHeading')}
            placeholder="e.g. Space &"
            helpText="Main heading prefix text."
          />

          <VisualTextEditor
            label="Accent Word (Neon Color)"
            name="requirementsAccent"
            value={current.requirementsAccent !== undefined ? current.requirementsAccent : 'Requirements'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsAccent')}
            placeholder="e.g. Requirements"
            helpText="Highlighted accent word."
          />

          <VisualTextEditor
            label="Section Subtitle"
            name="requirementsSubtitle"
            value={current.requirementsSubtitle !== undefined ? current.requirementsSubtitle : 'Do you have what it takes to build a Startup Cafe?'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsSubtitle')}
            placeholder="Do you have what it takes to build a Startup Cafe?"
            helpText="Descriptive paragraph explaining criteria."
            multiline
            rows={2}
          />
        </div>

        {/* Heading Color Palettes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
          <ColorPaletteInput
            label="Heading Color Override (Optional)"
            name="requirementsHeadingColor"
            value={current.requirementsHeadingColor || ''}
            onChange={onChange}
          />
          <ColorPaletteInput
            label="Subtitle Color Override (Optional)"
            name="requirementsSubtitleColor"
            value={current.requirementsSubtitleColor || ''}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 3. NOTE ON INVESTMENT CAPABILITY & CTA */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-purple/5 via-dark-card to-neon-blue/5 border-2 border-neon-purple/30 space-y-4 shadow-[0_0_20px_rgba(176,38,255,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-neon-purple" />
              <h3 className="text-base font-bold text-white">Note on Investment Capability &amp; CTA Button</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Customize the investor capability callout note and the bottom application action button.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-neon-purple/20 text-neon-purple border border-neon-purple/30 font-semibold shrink-0">
            Bottom Callout
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <VisualTextEditor
            label="Investment Note Title"
            name="requirementsNoteTitle"
            value={current.requirementsNoteTitle !== undefined ? current.requirementsNoteTitle : 'Note on Investment capability:'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsNoteTitle')}
            placeholder="Note on Investment capability:"
          />

          <VisualTextEditor
            label="Investment Note Description"
            name="requirementsNoteDesc"
            value={current.requirementsNoteDesc !== undefined ? current.requirementsNoteDesc : 'Apart from the physical requirements, we look for partners who are passionate about building startup communities and have the financial capability to sustain operations for the first 18 months.'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsNoteDesc')}
            multiline
            rows={2}
            placeholder="Apart from the physical requirements, we look for partners who are passionate about building startup communities..."
          />

          <VisualTextEditor
            label="CTA Button Text (Scrolls to Application Form)"
            name="requirementsCtaButton"
            value={current.requirementsCtaButton !== undefined ? current.requirementsCtaButton : 'Apply Now'}
            onChange={onChange}
            onFocus={() => onFocus?.('requirementsCtaButton')}
            placeholder="e.g. Apply Now"
          />
        </div>

        {/* Live Callout Preview Box */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="text-left max-w-xl">
            <h4 className="text-white font-bold text-sm mb-1 italic">
              {renderFormattedText(current.requirementsNoteTitle !== undefined ? current.requirementsNoteTitle : 'Note on Investment capability:')}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {renderFormattedText(current.requirementsNoteDesc !== undefined ? current.requirementsNoteDesc : 'Apart from the physical requirements, we look for partners who are passionate about building startup communities and have the financial capability to sustain operations for the first 18 months.')}
            </p>
          </div>
          <div className="px-6 py-2.5 rounded-xl bg-neon-blue font-bold text-black text-xs shadow-md shrink-0">
            {renderFormattedText(current.requirementsCtaButton !== undefined ? current.requirementsCtaButton : 'Apply Now')}
          </div>
        </div>
      </div>

      {/* 4. SPACE CRITERIA ITEMS MANAGER */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-neon-blue" />
              <h3 className="text-base font-bold text-white">Space Criteria Cards ({itemsList.length})</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage the physical property requirements: Area Required, Prime Location, Building Standards, etc.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs border border-white/10 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neon-blue hover:bg-neon-blue/80 text-black font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              <Plus size={14} strokeWidth={3} />
              Add Requirement
            </button>
          </div>
        </div>

        {/* INLINE ADD / EDIT FORM MODAL */}
        {editingId && (
          <div className="p-4 rounded-xl bg-black/60 border-2 border-neon-blue/60 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-neon-blue flex items-center gap-1.5">
                <Pencil size={13} />
                {editingId === 'new' ? 'Add New Space Requirement' : 'Edit Space Requirement'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <VisualTextEditor
                  label="Requirement Title *"
                  name="reqTitle"
                  value={form.title}
                  onChange={(e) => handleUpdateFormField('title', e.target.value)}
                  onFocus={() => onFocus?.('reqTitle')}
                  placeholder="e.g. Area Required, Prime Location, Ceiling Height..."
                  helperText="Highlight words to apply colors, bold, or gradient."
                />
              </div>

              {/* Icon Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Card Icon</label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-neon-blue/15 text-neon-blue border border-neon-blue/30 flex items-center justify-center shrink-0">
                    {renderIconComponent(form.iconName, 'w-4 h-4')}
                  </div>
                  <select
                    value={form.iconName}
                    onChange={(e) => {
                      handleUpdateFormField('iconName', e.target.value);
                      onFocus?.('reqIcon');
                    }}
                    className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                  >
                    {AVAILABLE_REQUIREMENTS_ICONS.map((icon) => (
                      <option key={icon.name} value={icon.name} className="bg-slate-900 text-white">
                        {icon.label} ({icon.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <VisualTextEditor
                  label="Requirement Description *"
                  name="reqDesc"
                  value={form.desc}
                  onChange={(e) => handleUpdateFormField('desc', e.target.value)}
                  onFocus={() => onFocus?.('reqDesc')}
                  placeholder="Specify physical carpet area, commercial classification, or facility requirements..."
                  isTextarea={true}
                  rows={2}
                  helperText="Highlight words to style them."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-4 py-1.5 rounded-lg bg-neon-blue text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Check size={14} strokeWidth={3} />
                Save Requirement
              </button>
            </div>
          </div>
        )}

        {/* ITEMS LIST */}
        <div className="space-y-2.5">
          {itemsList.map((item, index) => {
            const isEditing = editingId === (item.id || item.title);
            return (
              <div
                key={item.id || index}
                className={`p-3.5 rounded-xl border transition-all ${isEditing
                    ? 'bg-neon-blue/10 border-neon-blue ring-1 ring-neon-blue'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>

                    <div className="w-9 h-9 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20 flex items-center justify-center shrink-0">
                      {renderIconComponent(item.iconName, 'w-4 h-4')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white truncate">
                          {renderFormattedText(item.title)}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                          {item.iconName || 'Square'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {renderFormattedText(item.desc)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === itemsList.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-slate-300 hover:text-neon-blue border border-white/5"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id || item.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/5"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
