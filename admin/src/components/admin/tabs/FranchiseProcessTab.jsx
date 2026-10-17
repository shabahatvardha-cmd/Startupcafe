import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_PROCESS_STEPS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import {
  ClipboardList,
  MapPin,
  Paintbrush,
  Users,
  Rocket,
  Search,
  FileText,
  Briefcase,
  Key,
  CheckCircle,
  Coins,
  Award,
  Sparkles,
  TrendingUp,
  Handshake,
  Target,
  Building2,
  Store,
  Coffee,
  Laptop,
  ShieldCheck,
  Zap,
  Globe,
  Flag,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  LayoutGrid,
  GitCommit,
  Columns,
  Route,
  SlidersHorizontal,
} from 'lucide-react';

export const AVAILABLE_PROCESS_ICONS = [
  { name: 'ClipboardList', label: 'Application / Inquiry', icon: ClipboardList },
  { name: 'MapPin', label: 'Site & Location', icon: MapPin },
  { name: 'Paintbrush', label: 'Setup & Design', icon: Paintbrush },
  { name: 'Users', label: 'Hiring & Training', icon: Users },
  { name: 'Rocket', label: 'Grand Launch', icon: Rocket },
  { name: 'Search', label: 'Due Diligence', icon: Search },
  { name: 'FileText', label: 'Agreement & Docs', icon: FileText },
  { name: 'Briefcase', label: 'Business Planning', icon: Briefcase },
  { name: 'Key', label: 'Handover & Keys', icon: Key },
  { name: 'CheckCircle', label: 'Approval & KYC', icon: CheckCircle },
  { name: 'Coins', label: 'Financial Planning', icon: Coins },
  { name: 'Award', label: 'Brand Certification', icon: Award },
  { name: 'Sparkles', label: 'Interior Fitout', icon: Sparkles },
  { name: 'TrendingUp', label: 'Ramp Up & Growth', icon: TrendingUp },
  { name: 'Handshake', label: 'Partnership Signoff', icon: Handshake },
  { name: 'Target', label: 'Target Audience', icon: Target },
  { name: 'Building2', label: 'Commercial Site', icon: Building2 },
  { name: 'Store', label: 'Outlet Ready', icon: Store },
  { name: 'Coffee', label: 'Cafe Barista Setup', icon: Coffee },
  { name: 'Laptop', label: 'Tech & POS Setup', icon: Laptop },
  { name: 'ShieldCheck', label: 'Compliance & Safety', icon: ShieldCheck },
  { name: 'Zap', label: 'Fast-Track Setup', icon: Zap },
  { name: 'Globe', label: 'Digital Marketing', icon: Globe },
  { name: 'Flag', label: 'Milestone Completed', icon: Flag },
];

export const LAYOUT_STYLES = [
  {
    id: 'alternating',
    name: 'Alternating Timeline',
    tag: 'Original Baseline',
    desc: 'Classic centered vertical line with zigzagging animated left/right cards and center glowing nodes.',
    icon: Route,
    badgeColor: 'border-neon-pink/40 text-neon-pink bg-neon-pink/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="80" y1="4" x2="80" y2="52" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
        {/* Node 1 left */}
        <circle cx="80" cy="14" r="3" fill="#ff2975" />
        <rect x="20" y="8" width="48" height="12" rx="3" fill="#1e293b" stroke="#ff2975" strokeWidth="1" />
        {/* Node 2 right */}
        <circle cx="80" cy="30" r="3" fill="#ff2975" />
        <rect x="92" y="24" width="48" height="12" rx="3" fill="#1e293b" stroke="#b026ff" strokeWidth="1" />
        {/* Node 3 left */}
        <circle cx="80" cy="46" r="3" fill="#ff2975" />
        <rect x="20" y="40" width="48" height="12" rx="3" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'grid',
    name: 'Bento Cards Grid',
    tag: 'Modern & Clean',
    desc: 'Structured responsive cards in an elegant grid layout with prominent #01–#05 glowing step badges.',
    icon: LayoutGrid,
    badgeColor: 'border-neon-blue/40 text-neon-blue bg-neon-blue/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="8" width="38" height="38" rx="4" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="26" cy="18" r="4" fill="#00f0ff" />
        <rect x="22" y="28" width="22" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="22" y="34" width="16" height="2.5" rx="1" fill="#64748b" />

        <rect x="61" y="8" width="38" height="38" rx="4" fill="#1e293b" stroke="#b026ff" strokeWidth="1" />
        <circle cx="73" cy="18" r="4" fill="#b026ff" />
        <rect x="69" y="28" width="22" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="69" y="34" width="16" height="2.5" rx="1" fill="#64748b" />

        <rect x="108" y="8" width="38" height="38" rx="4" fill="#1e293b" stroke="#ff2975" strokeWidth="1" />
        <circle cx="120" cy="18" r="4" fill="#ff2975" />
        <rect x="116" y="28" width="22" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="116" y="34" width="16" height="2.5" rx="1" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'horizontal',
    name: 'Milestone Stepper',
    tag: 'Sequential Flow',
    desc: 'Connected horizontal progress track showing sequential milestone steps and numbered indicators.',
    icon: GitCommit,
    badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="24" y1="20" x2="136" y2="20" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="32" cy="20" r="7" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="32" cy="20" r="3" fill="#f59e0b" />
        <rect x="18" y="32" width="28" height="14" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />

        <circle cx="80" cy="20" r="7" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="20" r="3" fill="#f59e0b" />
        <rect x="66" y="32" width="28" height="14" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />

        <circle cx="128" cy="20" r="7" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="128" cy="20" r="3" fill="#f59e0b" />
        <rect x="114" y="32" width="28" height="14" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: 'left-spine',
    name: 'Left-Spine Rail',
    tag: 'Modern Tech Rail',
    desc: 'Vertical timeline spine along the left margin with continuous glowing connector and wide glass cards.',
    icon: Columns,
    badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10',
    previewSvg: (
      <svg className="w-full h-14" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="28" y1="6" x2="28" y2="50" stroke="#10b981" strokeWidth="2" />
        {/* Step 1 */}
        <circle cx="28" cy="14" r="5" fill="#042f2e" stroke="#10b981" strokeWidth="2" />
        <rect x="42" y="8" width="98" height="12" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="0.8" />
        {/* Step 2 */}
        <circle cx="28" cy="30" r="5" fill="#042f2e" stroke="#10b981" strokeWidth="2" />
        <rect x="42" y="24" width="98" height="12" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Step 3 */}
        <circle cx="28" cy="46" r="5" fill="#042f2e" stroke="#10b981" strokeWidth="2" />
        <rect x="42" y="40" width="98" height="12" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
      </svg>
    ),
  },
];

export default function FranchiseProcessTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const stepsList = Array.isArray(current.processStepsList) && current.processStepsList.length > 0
    ? current.processStepsList
    : DEFAULT_PROCESS_STEPS;

  const currentLayoutStyle = current.processLayoutStyle || 'alternating';

  // Automatically activate Path to Ownership in Live Preview on mount
  useEffect(() => {
    onFocus?.('processHeading');
  }, []);

  const [editingId, setEditingId] = useState(null); // card id or 'new'
  const [snapshotList, setSnapshotList] = useState(null);
  const [form, setForm] = useState({
    id: '',
    stepNumber: '01',
    title: '',
    desc: '',
    iconName: 'ClipboardList',
  });

  const handleSelectLayout = (layoutId) => {
    setFormData((prev) => ({
      ...prev,
      processLayoutStyle: layoutId,
    }));
    onFocus?.('processLayoutStyle');
  };

  const handleStartAdd = () => {
    const nextNum = (stepsList.length + 1).toString().padStart(2, '0');
    setForm({
      id: `step-${Date.now()}`,
      stepNumber: nextNum,
      title: '',
      desc: '',
      iconName: 'Rocket',
    });
    setEditingId('new');
    onFocus?.('processStepTitle');
  };

  const handleStartEdit = (step) => {
    setSnapshotList(stepsList);
    setForm({
      id: step.id || `step-${Date.now()}`,
      stepNumber: step.stepNumber || '01',
      title: step.title || '',
      desc: step.desc || '',
      iconName: step.iconName || 'ClipboardList',
    });
    setEditingId(step.id || step.title);
    onFocus?.('processStepTitle');
  };

  const handleCancelEdit = () => {
    if (snapshotList) {
      setFormData?.((prev) => ({
        ...prev,
        processStepsList: snapshotList,
      }));
      setSnapshotList(null);
    }
    setEditingId(null);
    onFocus?.('processHeading');
  };

  // Live-updates step changes into formData.processStepsList while typing
  const handleUpdateFormField = (fieldKey, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [fieldKey]: value };
      if (editingId && editingId !== 'new') {
        const nextList = stepsList.map((item) =>
          (item.id === editingId || item.title === editingId)
            ? { ...item, ...nextForm }
            : item
        );
        setFormData?.((prevData) => ({
          ...prevData,
          processStepsList: nextList,
        }));
      }
      return nextForm;
    });
  };

  const handleSaveStep = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a step title.');
      return;
    }

    const updatedItem = {
      id: form.id || `step-${Date.now()}`,
      stepNumber: form.stepNumber || '01',
      title: form.title.trim(),
      desc: form.desc.trim(),
      iconName: form.iconName || 'ClipboardList',
    };

    if (editingId === 'new') {
      setFormData((prev) => ({
        ...prev,
        processStepsList: [...stepsList, updatedItem],
      }));
    } else {
      const nextList = stepsList.map((item) =>
        (item.id === editingId || item.title === editingId) ? updatedItem : item
      );
      setFormData((prev) => ({
        ...prev,
        processStepsList: nextList,
      }));
    }
    setSnapshotList(null);
    setEditingId(null);
    onFocus?.('processHeading');
  };

  const handleDeleteStep = (stepId) => {
    if (stepsList.length <= 1) {
      alert('You must keep at least 1 process step.');
      return;
    }
    const updatedList = stepsList.filter((s) => s.id !== stepId && s.title !== stepId);
    setFormData((prev) => ({
      ...prev,
      processStepsList: updatedList,
    }));
    if (editingId === stepId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= stepsList.length) return;
    const copy = [...stepsList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      processStepsList: copy,
    }));
  };

  const handleResetSteps = () => {
    if (window.confirm('Reset all steps back to the default 5-step roadmap?')) {
      setFormData((prev) => ({
        ...prev,
        processStepsList: DEFAULT_PROCESS_STEPS,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, className = 'w-5 h-5') => {
    const iconObj = AVAILABLE_PROCESS_ICONS.find((i) => i.name === iconName);
    const IconComp = iconObj ? iconObj.icon : Rocket;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-8">
      {/* STANDARDIZED FRANCHISE SECTION BAR */}
      <FranchiseSectionBar
        activeSection="process"
        onSwitchSection={onSwitchView}
      />

      {/* 1. ARRANGEMENT & LAYOUT STYLES SELECTOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neon-pink/5 via-dark-card to-neon-purple/5 border-2 border-neon-pink/30 space-y-4 shadow-[0_0_25px_rgba(255,41,117,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-neon-pink" />
              <h3 className="text-base font-bold text-white">Select Arrangement Style</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink border border-neon-pink/30">
                New Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Choose how the 5-step roadmap is arranged on your live website. The original codebase layout is preserved by default.
            </p>
          </div>
          <span className="text-xs font-mono text-neon-pink bg-black/40 px-3 py-1 rounded-lg border border-neon-pink/30 shrink-0">
            Active: <span className="font-bold uppercase">{currentLayoutStyle}</span>
          </span>
        </div>

        {/* Layout Cards Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {LAYOUT_STYLES.map((style) => {
            const isSelected = currentLayoutStyle === style.id;
            const StyleIcon = style.icon;
            return (
              <div
                key={style.id}
                onClick={() => handleSelectLayout(style.id)}
                className={`group relative p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-neon-pink shadow-[0_0_20px_rgba(255,41,117,0.35)] scale-[1.02]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                  }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-neon-pink text-white flex items-center justify-center shadow-[0_0_10px_#ff2975]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                {/* Card Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/5 text-slate-300'}`}>
                      <StyleIcon size={16} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeColor}`}>
                      {style.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-neon-pink transition-colors">
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
              Customize the section title, accent word, and introductory description.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VisualTextEditor
            label="Section Badge"
            name="processBadge"
            value={current.processBadge !== undefined ? current.processBadge : 'Roadmap'}
            onChange={onChange}
            onFocus={() => onFocus?.('processBadge')}
            placeholder="e.g. Roadmap or 5-Step Process"
            helpText="Small pill label displayed above heading."
          />

          <VisualTextEditor
            label="Main Heading"
            name="processHeading"
            value={current.processHeading !== undefined ? current.processHeading : 'Your Path to'}
            onChange={onChange}
            onFocus={() => onFocus?.('processHeading')}
            placeholder="e.g. Your Path to"
            helpText="Main white heading text."
          />

          <VisualTextEditor
            label="Accent Word (Neon Pink)"
            name="processAccent"
            value={current.processAccent !== undefined ? current.processAccent : 'Ownership'}
            onChange={onChange}
            onFocus={() => onFocus?.('processAccent')}
            placeholder="e.g. Ownership"
            helpText="Highlighted glowing accent word."
          />
        </div>

        <VisualTextEditor
          label="Process Subtitle"
          name="processSubtitle"
          value={current.processSubtitle !== undefined ? current.processSubtitle : 'Five simple steps to launching your own Startup Cafe.'}
          onChange={onChange}
          onFocus={() => onFocus?.('processSubtitle')}
          multiline
          rows={2}
          placeholder="e.g. Five simple steps to launching your own Startup Cafe."
          helpText="Descriptive paragraph explaining the roadmap."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <ColorPaletteInput
            label="Heading Color Override (Optional)"
            name="processHeadingColor"
            value={current.processHeadingColor || ''}
            onChange={onChange}
          />
          <ColorPaletteInput
            label="Subtitle Color Override (Optional)"
            name="processSubtitleColor"
            value={current.processSubtitleColor || ''}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 3. DYNAMIC ROADMAP STEPS CARDS MANAGER */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Roadmap Steps ({stepsList.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Edit step names, descriptions, numbers, and Lucide icons. Reorder or add new milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSteps}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset back to the original 5 steps"
            >
              <RotateCcw size={13} />
              Reset Original 5 Steps
            </button>

            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3.5 py-1.5 rounded-lg bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink border border-neon-pink/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} />
              Add Step
            </button>
          </div>
        </div>

        {/* INLINE EDIT / CREATE FORM */}
        {editingId !== null && (
          <div
            className="p-5 rounded-2xl bg-white/[0.04] border-2 border-neon-pink/50 space-y-4 shadow-[0_0_20px_rgba(255,41,117,0.2)] animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-neon-pink uppercase tracking-wider flex items-center gap-2">
                {editingId === 'new' ? <Plus size={15} /> : <Pencil size={15} />}
                <span>{editingId === 'new' ? 'Add New Roadmap Step' : 'Edit Step Details'}</span>
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <VisualTextEditor
                  label="Step Number / Badge"
                  name="stepNumber"
                  value={form.stepNumber}
                  onChange={(e) => handleUpdateFormField('stepNumber', e.target.value)}
                  onFocus={() => onFocus?.('processStepNumber')}
                  placeholder="e.g. 01, Step 1"
                  helperText="Highlight to color or style."
                />
              </div>

              <div className="sm:col-span-2">
                <VisualTextEditor
                  label="Step Title"
                  name="stepTitle"
                  value={form.title}
                  onChange={(e) => handleUpdateFormField('title', e.target.value)}
                  onFocus={() => onFocus?.('processStepTitle')}
                  placeholder="e.g. Application, Site Selection, Grand Launch"
                  helperText="Highlight any word to apply neon colors, gradients, bold, or size."
                />
              </div>
            </div>

            <VisualTextEditor
              label="Step Description"
              name="stepDesc"
              value={form.desc}
              onChange={(e) => handleUpdateFormField('desc', e.target.value)}
              onFocus={() => onFocus?.('processStepDesc')}
              isTextarea
              rows={2}
              placeholder="Briefly describe what happens during this step..."
              helperText="Highlight any word to style it."
            />

            {/* Icon Picker Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Step Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-black/40 border border-white/10">
                {AVAILABLE_PROCESS_ICONS.map((item) => {
                  const isSelected = form.iconName === item.name;
                  const IconC = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        handleUpdateFormField('iconName', item.name);
                        onFocus?.('processStepIcon');
                      }}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer ${isSelected
                          ? 'bg-neon-pink/25 border-2 border-neon-pink text-white shadow-[0_0_12px_rgba(255,41,117,0.5)]'
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
                onClick={handleSaveStep}
                className="px-4 py-1.5 rounded-lg bg-neon-pink hover:bg-neon-pink/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,41,117,0.4)] cursor-pointer"
              >
                <Check size={14} />
                Save Step
              </button>
            </div>
          </div>
        )}

        {/* STEPS LIST ACCORDION / CARDS */}
        <div className="space-y-2.5">
          {stepsList.map((step, index) => {
            const isEditingThis = editingId === (step.id || step.title);
            return (
              <div
                key={step.id || index}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isEditingThis
                    ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_15px_rgba(255,41,117,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                  }`}
              >
                {/* Left Step Info */}
                <div
                  onClick={() => handleStartEdit(step)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1 group"
                  title="Click to edit this roadmap step"
                >
                  {/* Step Number Pill */}
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-black/60 border border-neon-pink/40 text-neon-pink text-xs font-mono font-bold flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {renderFormattedText(step.stepNumber || (index + 1 < 10 ? `0${index + 1}` : index + 1))}
                  </span>

                  {/* Icon Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink p-[1px] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-dark-bg rounded-xl flex items-center justify-center text-white">
                      {renderIconComponent(step.iconName, 'w-5 h-5 text-neon-pink')}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate flex items-center gap-2 group-hover:text-neon-pink transition-colors">
                      <span>{renderFormattedText(step.title)}</span>
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                      {renderFormattedText(step.desc)}
                    </p>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Reorder Buttons */}
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
                    disabled={index === stepsList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(step)}
                    className="px-2.5 py-1.5 rounded-lg border border-neon-pink/40 bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Edit Step"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(step.id || step.title)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 cursor-pointer transition-colors"
                    title="Delete Step"
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
