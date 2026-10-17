import { useState } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_SERVICES } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import {
  Monitor,
  Users,
  Briefcase,
  Zap,
  Coffee,
  Globe,
  Mic,
  Wifi,
  Shield,
  Sparkles,
  Building,
  PhoneCall,
  Calendar,
  Laptop,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Monitor', label: 'Monitor', icon: Monitor, color: 'text-neon-blue' },
  { name: 'Briefcase', label: 'Cabin', icon: Briefcase, color: 'text-neon-purple' },
  { name: 'Users', label: 'Conference', icon: Users, color: 'text-neon-pink' },
  { name: 'Globe', label: 'Virtual', icon: Globe, color: 'text-neon-blue' },
  { name: 'Zap', label: 'Network', icon: Zap, color: 'text-[#facc15]' },
  { name: 'Coffee', label: 'Cafe', icon: Coffee, color: 'text-neon-pink' },
  { name: 'Mic', label: 'Podcast', icon: Mic, color: 'text-neon-blue' },
  { name: 'Wifi', label: 'High-Speed', icon: Wifi, color: 'text-neon-purple' },
  { name: 'Shield', label: 'Security', icon: Shield, color: 'text-emerald-400' },
  { name: 'Sparkles', label: 'VIP', icon: Sparkles, color: 'text-yellow-400' },
  { name: 'Building', label: 'Infra', icon: Building, color: 'text-cyan-400' },
  { name: 'PhoneCall', label: 'Phone Booth', icon: PhoneCall, color: 'text-pink-400' },
  { name: 'Calendar', label: 'Events', icon: Calendar, color: 'text-neon-blue' },
  { name: 'Laptop', label: 'Workstation', icon: Laptop, color: 'text-neon-purple' },
];

const GRADIENT_PRESETS = [
  { label: 'Neon Blue', value: 'from-neon-blue/20 to-transparent' },
  { label: 'Neon Purple', value: 'from-neon-purple/20 to-transparent' },
  { label: 'Neon Pink', value: 'from-neon-pink/20 to-transparent' },
  { label: 'Blue to Purple', value: 'from-neon-blue/20 to-neon-purple/20' },
  { label: 'Pink to Purple', value: 'from-neon-pink/20 to-neon-purple/20' },
  { label: 'Gold / Amber', value: 'from-[#facc15]/20 to-transparent' },
];

export default function ServicesTab({ current, onChange, onFocus, setFormData }) {
  const servicesList = Array.isArray(current.servicesList) && current.servicesList.length > 0
    ? current.servicesList
    : DEFAULT_SERVICES;

  const [editingId, setEditingId] = useState(null); // card id or 'new'
  const [cardForm, setCardForm] = useState({
    id: '',
    title: '',
    description: '',
    iconName: 'Monitor',
    gradient: 'from-neon-blue/20 to-transparent'
  });

  const handleStartAdd = () => {
    setCardForm({
      id: `service-${Date.now()}`,
      title: '',
      description: '',
      iconName: 'Mic',
      gradient: 'from-neon-blue/20 to-transparent'
    });
    setEditingId('new');
  };

  const handleStartEdit = (card) => {
    setCardForm({
      id: card.id || `service-${Date.now()}`,
      title: card.title || '',
      description: card.description || '',
      iconName: card.iconName || 'Monitor',
      gradient: card.gradient || 'from-neon-blue/20 to-transparent'
    });
    setEditingId(card.id || card.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveCard = (e) => {
    e?.preventDefault();
    if (!cardForm.title.trim()) {
      alert('Please enter a service card title');
      return;
    }

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...servicesList, cardForm];
    } else {
      updatedList = servicesList.map((card) =>
        (card.id === editingId || card.title === editingId) ? cardForm : card
      );
    }

    setFormData((prev) => ({
      ...prev,
      servicesList: updatedList,
    }));
    setEditingId(null);
  };

  const handleDeleteCard = (cardId) => {
    if (servicesList.length <= 1) {
      alert('You must keep at least 1 service card.');
      return;
    }
    const updatedList = servicesList.filter(
      (c) => c.id !== cardId && c.title !== cardId
    );
    setFormData((prev) => ({
      ...prev,
      servicesList: updatedList,
    }));
    if (editingId === cardId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= servicesList.length) return;
    const copy = [...servicesList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      servicesList: copy,
    }));
  };

  const handleRestoreDefaultCards = () => {
    if (window.confirm('Restore the original 6 default service cards?')) {
      setFormData((prev) => ({
        ...prev,
        servicesList: DEFAULT_SERVICES,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, size = 20) => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName) || AVAILABLE_ICONS[0];
    const IconComp = found.icon;
    return <IconComp size={size} className={found.color} />;
  };

  return (
    <div className="space-y-6">
      {/* Header Copy Settings */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Services Section Copy</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Offerings &amp; Environments — format words with inline visual color, size, and gradient tools
          </p>
        </div>
        <span className="text-xs text-neon-pink font-semibold px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/20">
          Offerings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualTextEditor
          label="Heading (Prefix)"
          name="servicesHeading"
          value={current.servicesHeading || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('servicesHeading')}
          placeholder="e.g. Premium Work"
        />
        <VisualTextEditor
          label="Accent Word (Gradient Highlight)"
          name="servicesAccent"
          value={current.servicesAccent || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('servicesAccent')}
          placeholder="e.g. Environments"
        />
      </div>

      <VisualTextEditor
        label="Services Subtitle Description"
        name="servicesDescription"
        value={current.servicesDescription || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('servicesDescription')}
        placeholder="Describe your workspace environments..."
        isTextarea={true}
        rows={3}
      />

      {/* Individual Services Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Services Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Services</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Heading Color"
            name="servicesHeadingColor"
            value={current.servicesHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Subtitle Text Color"
            name="servicesDescriptionColor"
            value={current.servicesDescriptionColor || ''}
            onChange={onChange}
            defaultValue="#94a3b8"
            defaultLabel="Default (Muted)"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC SERVICE CARDS MANAGER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Manage Workspace Cards
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-semibold">
                {servicesList.length} Cards Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add new cards or customize offerings. Resets to original 6 when you click &quot;Reset Defaults&quot;.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaultCards}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset service cards back to original 6 defaults"
            >
              <RotateCcw size={13} />
              Reset Cards
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-pink hover:to-neon-purple text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(176,38,255,0.4)] transition-all cursor-pointer"
            >
              <Plus size={15} />
              Add New Card
            </button>
          </div>
        </div>

        {/* INLINE CARD ADD / EDIT FORM */}
        {editingId && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-neon-blue/40 shadow-lg space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-neon-blue uppercase tracking-wider">
                {editingId === 'new' ? '✨ Add New Service Card' : '✏️ Edit Service Card'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <VisualTextEditor
                label="Card Title"
                name="serviceTitle"
                value={cardForm.title}
                onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                placeholder="e.g. Podcast & Media Studio"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />

              <VisualTextEditor
                label="Card Description"
                name="serviceDescription"
                value={cardForm.description}
                onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                isTextarea={true}
                rows={2}
                placeholder="Describe this workspace environment..."
                helperText="Highlight words to style them."
              />

              {/* Icon Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Icon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {AVAILABLE_ICONS.map((ico) => {
                    const isSelected = cardForm.iconName === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setCardForm({ ...cardForm, iconName: ico.name })}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                            : 'bg-black/40 border-white/10 hover:border-white/30 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComp size={16} className={ico.color} />
                        <span className="text-[11px] truncate">{ico.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glow Accent */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Card Glow Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = cardForm.gradient === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setCardForm({ ...cardForm, gradient: preset.value })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/20 border-white text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCard}
                className="px-5 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs hover:bg-neon-blue/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                Save Card
              </button>
            </div>
          </div>
        )}

        {/* CARDS LIST */}
        <div className="space-y-2.5">
          {servicesList.map((card, index) => {
            const cardId = card.id || card.title || `service-${index}`;
            return (
              <div
                key={cardId}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
              >
                <div
                  onClick={() => handleStartEdit(card)}
                  className="flex items-start sm:items-center gap-3 min-w-0 cursor-pointer flex-1 group/item"
                  title="Click to edit this card"
                >
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 group-hover/item:scale-105 transition-transform">
                    {renderIconComponent(card.iconName, 22)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        #{index + 1}
                      </span>
                      <h5 className="text-sm font-bold text-white truncate group-hover/item:text-neon-blue transition-colors">
                        {renderFormattedText(card.title)}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      {renderFormattedText(card.description)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === servicesList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(card)}
                    className="p-1.5 rounded-lg border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-colors cursor-pointer"
                    title="Edit card"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(cardId)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 size={14} />
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
