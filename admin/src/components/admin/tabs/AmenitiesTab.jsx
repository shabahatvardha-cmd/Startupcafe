import { useState } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_AMENITIES } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import {
  Wifi,
  Coffee,
  Zap,
  PhoneCall,
  Printer,
  Lock,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Monitor,
  Users,
  Briefcase,
  Award,
  Heart,
  Star,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

const AVAILABLE_AMENITY_ICONS = [
  { name: 'Wifi', label: 'WiFi', icon: Wifi, color: 'text-neon-blue' },
  { name: 'Coffee', label: 'Coffee', icon: Coffee, color: 'text-neon-pink' },
  { name: 'Zap', label: 'Power', icon: Zap, color: 'text-[#facc15]' },
  { name: 'PhoneCall', label: 'Calling Pod', icon: PhoneCall, color: 'text-neon-purple' },
  { name: 'Printer', label: 'Printing', icon: Printer, color: 'text-emerald-400' },
  { name: 'Lock', label: 'Lockers', icon: Lock, color: 'text-cyan-400' },
  { name: 'Gamepad2', label: 'Gaming', icon: Gamepad2, color: 'text-rose-400' },
  { name: 'ShieldCheck', label: 'Security', icon: ShieldCheck, color: 'text-neon-blue' },
  { name: 'Sparkles', label: 'VIP Perk', icon: Sparkles, color: 'text-yellow-400' },
  { name: 'Monitor', label: 'Workstation', icon: Monitor, color: 'text-neon-blue' },
  { name: 'Users', label: 'Community', icon: Users, color: 'text-neon-pink' },
  { name: 'Briefcase', label: 'Executive', icon: Briefcase, color: 'text-neon-purple' },
  { name: 'Award', label: 'Premium', icon: Award, color: 'text-amber-400' },
  { name: 'Heart', label: 'Wellness', icon: Heart, color: 'text-pink-400' },
  { name: 'Star', label: 'Featured', icon: Star, color: 'text-yellow-400' }
];

export default function AmenitiesTab({ current, onChange, onFocus, setFormData }) {
  const amenitiesList = Array.isArray(current.amenitiesList) && current.amenitiesList.length > 0
    ? current.amenitiesList
    : DEFAULT_AMENITIES;

  const [editingId, setEditingId] = useState(null); // amenity id or 'new'
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    badge: 'Included',
    iconName: 'Wifi',
    color: 'text-neon-blue'
  });

  const handleStartAdd = () => {
    setForm({
      id: `amenity-${Date.now()}`,
      title: '',
      description: 'Enterprise perk provided complimentary to all members.',
      badge: 'Included',
      iconName: 'Sparkles',
      color: 'text-yellow-400'
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setForm({
      id: item.id || `${item.title}-${Date.now()}`,
      title: item.title || '',
      description: item.description || '',
      badge: item.badge || '',
      iconName: item.iconName || 'Sparkles',
      color: item.color || 'text-neon-blue'
    });
    setEditingId(item.id || item.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveAmenity = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter an amenity title.');
      return;
    }

    const updatedItem = {
      id: form.id,
      title: form.title.trim(),
      description: form.description.trim(),
      badge: form.badge.trim(),
      iconName: form.iconName,
      color: form.color
    };

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...amenitiesList, updatedItem];
    } else {
      updatedList = amenitiesList.map((item) =>
        (item.id === editingId || item.title === editingId) ? updatedItem : item
      );
    }

    setFormData((prev) => ({
      ...prev,
      amenitiesList: updatedList,
    }));
    setEditingId(null);
  };

  const handleDeleteAmenity = (amenityId) => {
    if (amenitiesList.length <= 1) {
      alert('You must keep at least 1 amenity card.');
      return;
    }
    const updatedList = amenitiesList.filter(
      (item) => item.id !== amenityId && item.title !== amenityId
    );
    setFormData((prev) => ({
      ...prev,
      amenitiesList: updatedList,
    }));
    if (editingId === amenityId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= amenitiesList.length) return;
    const copy = [...amenitiesList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      amenitiesList: copy,
    }));
  };

  const handleRestoreDefaultAmenities = () => {
    if (window.confirm('Restore the original 8 default amenity cards?')) {
      setFormData((prev) => ({
        ...prev,
        amenitiesList: DEFAULT_AMENITIES,
      }));
      setEditingId(null);
    }
  };

  const renderIconComponent = (iconName, colorClass, size = 20) => {
    const found = AVAILABLE_AMENITY_ICONS.find((i) => i.name === iconName) || AVAILABLE_AMENITY_ICONS[0];
    const IconComp = found.icon;
    return <IconComp size={size} className={colorClass || found.color} />;
  };

  return (
    <div className="space-y-6">
      {/* Master Display Toggle */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          current.showAmenities
            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
            : 'bg-black/50 border-white/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  current.showAmenities ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <h4 className="text-sm font-bold text-white">
                Amenities Section Visibility on Website
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {current.showAmenities
                ? 'Section is currently VISIBLE on the live website (below Services).'
                : 'Section is currently HIDDEN. Original website layout is untouched.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                showAmenities: !prev.showAmenities,
              }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
              current.showAmenities
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-400'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {current.showAmenities ? '✓ Section Enabled (Click to Hide)' : '+ Enable Section on Site'}
          </button>
        </div>
      </div>

      {/* Header Copy Settings */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Amenities Section Copy</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Perks &amp; Infrastructure — format words with inline visual color, size, and gradient tools
          </p>
        </div>
        <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
          Amenities
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualTextEditor
          label="Heading (Prefix)"
          name="amenitiesHeading"
          value={current.amenitiesHeading || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('amenitiesHeading')}
          placeholder="e.g. World-Class"
        />
        <VisualTextEditor
          label="Accent Word (Gradient Highlight)"
          name="amenitiesAccent"
          value={current.amenitiesAccent || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('amenitiesAccent')}
          placeholder="e.g. Amenities"
        />
      </div>

      <VisualTextEditor
        label="Amenities Subtitle Description"
        name="amenitiesDescription"
        value={current.amenitiesDescription || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('amenitiesDescription')}
        placeholder="Describe your workspace perks and features..."
        isTextarea={true}
        rows={3}
      />

      {/* Individual Amenities Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Amenities Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Amenities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Heading Color"
            name="amenitiesHeadingColor"
            value={current.amenitiesHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Subtitle Text Color"
            name="amenitiesDescriptionColor"
            value={current.amenitiesDescriptionColor || ''}
            onChange={onChange}
            defaultValue="#94a3b8"
            defaultLabel="Default (Muted)"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC AMENITIES CARDS MANAGER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Manage Amenity Cards
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-semibold">
                {amenitiesList.length} Cards Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customize or add new workplace perks. Resets to original 8 when you click &quot;Reset Defaults&quot;.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaultAmenities}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset amenity cards back to original 8 defaults"
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
              Add New Amenity
            </button>
          </div>
        </div>

        {/* INLINE CARD ADD / EDIT FORM */}
        {editingId && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-neon-blue/40 shadow-lg space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-neon-blue uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                {editingId === 'new' ? 'Add New Amenity Card' : 'Edit Amenity Card'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <VisualTextEditor
                label="Amenity Title"
                name="amenityTitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 1 Gbps Mesh WiFi"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />

              <VisualTextEditor
                label="Badge Pill (Optional)"
                name="amenityBadge"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. Ultra Fast, Included, Zero Downtime"
                helperText="Highlight words to style them."
              />
            </div>

            <VisualTextEditor
              label="Description"
              name="amenityDescription"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              isTextarea={true}
              rows={2}
              placeholder="Describe this perk..."
              helperText="Highlight words to style them."
            />

            {/* Icon Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Icon &amp; Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {AVAILABLE_AMENITY_ICONS.map((ico) => {
                  const isSelected = form.iconName === ico.name;
                  const IconComp = ico.icon;
                  return (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setForm({ ...form, iconName: ico.name, color: ico.color })}
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
                onClick={handleSaveAmenity}
                className="px-5 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs hover:bg-neon-blue/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                Save Amenity
              </button>
            </div>
          </div>
        )}

        {/* CARDS LIST */}
        <div className="space-y-2.5">
          {amenitiesList.map((item, index) => {
            const itemId = item.id || item.title || `amenity-${index}`;
            return (
              <div
                key={itemId}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
              >
                <div
                  onClick={() => handleStartEdit(item)}
                  className="flex items-start sm:items-center gap-3 min-w-0 cursor-pointer flex-1 group/item"
                  title="Click to edit this amenity"
                >
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 group-hover/item:scale-105 transition-transform">
                    {renderIconComponent(item.iconName, item.color, 22)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        #{index + 1}
                      </span>
                      <h5 className="text-sm font-bold text-white truncate group-hover/item:text-neon-blue transition-colors">
                        {renderFormattedText(item.title)}
                      </h5>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {renderFormattedText(item.badge)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      {renderFormattedText(item.description)}
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
                    disabled={index === amenitiesList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-colors cursor-pointer"
                    title="Edit amenity"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAmenity(itemId)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete amenity"
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
