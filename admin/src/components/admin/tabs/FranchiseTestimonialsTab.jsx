import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_FRANCHISE_TESTIMONIALS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import rajeshImg from '../../../assets/partners/rajesh.png';
import priyaImg from '../../../assets/partners/priya.png';
import rohanImg from '../../../assets/rohan.png';
import sanyaImg from '../../../assets/sanya.png';
import arjunImg from '../../../assets/arjun.png';
import {
  Quote,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  User,
  Sparkles,
  MessageSquareQuote,
  Image as ImageIcon,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'rajesh', label: 'Rajesh Khanna', src: rajeshImg },
  { id: 'priya', label: 'Priya Sharma', src: priyaImg },
  { id: 'rohan', label: 'Rohan Verma', src: rohanImg },
  { id: 'sanya', label: 'Sanya Sharma', src: sanyaImg },
  { id: 'arjun', label: 'Arjun Desai', src: arjunImg },
];

export default function FranchiseTestimonialsTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const testimonialsList = Array.isArray(current.franchiseTestimonialsList) && current.franchiseTestimonialsList.length > 0
    ? current.franchiseTestimonialsList
    : DEFAULT_FRANCHISE_TESTIMONIALS;

  // Automatically activate Voice of Franchise in Live Preview on mount
  useEffect(() => {
    onFocus?.('franchiseTestimonialsHeading');
  }, []);

  const [editingId, setEditingId] = useState(null); // id or 'new'
  const [snapshotList, setSnapshotList] = useState(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    location: '',
    text: '',
    avatarKey: 'rajesh',
    avatarUrl: '',
  });

  const handleStartAdd = () => {
    setForm({
      id: `partner-${Date.now()}`,
      name: '',
      location: 'Partner',
      text: 'Startup Cafe has provided phenomenal returns and unmatched support for our local community.',
      avatarKey: 'rajesh',
      avatarUrl: '',
    });
    setEditingId('new');
    onFocus?.('partnerName');
  };

  const handleStartEdit = (item) => {
    setSnapshotList(testimonialsList);
    setForm({
      id: item.id || `partner-${Date.now()}`,
      name: item.name || '',
      location: item.location || item.role || 'Partner',
      text: item.text || item.content || '',
      avatarKey: item.avatarKey || (item.name?.toLowerCase().includes('priya') ? 'priya' : 'rajesh'),
      avatarUrl: item.avatarUrl || '',
    });
    setEditingId(item.id || item.name);
    onFocus?.('partnerName');
  };

  const handleCancelEdit = () => {
    if (snapshotList) {
      setFormData?.((prev) => ({
        ...prev,
        franchiseTestimonialsList: snapshotList,
      }));
      setSnapshotList(null);
    }
    setEditingId(null);
    onFocus?.('franchiseTestimonialsHeading');
  };

  // Live-updates partner review changes into formData.franchiseTestimonialsList while typing
  const handleUpdateFormField = (fieldKey, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [fieldKey]: value };
      if (editingId && editingId !== 'new') {
        const nextList = testimonialsList.map((item) =>
          (item.id === editingId || item.name === editingId)
            ? { ...item, ...nextForm }
            : item
        );
        setFormData?.((prevData) => ({
          ...prevData,
          franchiseTestimonialsList: nextList,
        }));
      }
      return nextForm;
    });
  };

  const handleSaveReview = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a partner name.');
      return;
    }
    if (!form.text.trim()) {
      alert('Please enter testimonial content.');
      return;
    }

    const updatedItem = {
      id: form.id || `partner-${Date.now()}`,
      name: form.name.trim(),
      location: form.location.trim() || 'Partner',
      text: form.text.trim(),
      avatarKey: form.avatarKey || 'rajesh',
      avatarUrl: form.avatarUrl.trim(),
    };

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...testimonialsList, updatedItem];
    } else {
      updatedList = testimonialsList.map((item) =>
        (item.id === editingId || item.name === editingId) ? updatedItem : item
      );
    }

    setFormData((prev) => ({
      ...prev,
      franchiseTestimonialsList: updatedList,
    }));
    setSnapshotList(null);
    setEditingId(null);
    onFocus?.('franchiseTestimonialsHeading');
  };

  const handleDelete = (id) => {
    if (testimonialsList.length <= 1) {
      alert('Please keep at least one partner review visible on the website.');
      return;
    }
    const updatedList = testimonialsList.filter((item) => (item.id || item.name) !== id);
    setFormData((prev) => ({
      ...prev,
      franchiseTestimonialsList: updatedList,
    }));
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= testimonialsList.length) return;
    const updatedList = [...testimonialsList];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIndex, 0, moved);
    setFormData((prev) => ({
      ...prev,
      franchiseTestimonialsList: updatedList,
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset partner testimonials to default (Rajesh Khanna & Priya Sharma)?')) {
      setFormData((prev) => ({
        ...prev,
        franchiseTestimonialsHeading: 'Voice of our',
        franchiseTestimonialsAccent: 'Franchise Partners',
        franchiseTestimonialsSubtitle: 'Hear directly from those who are already growing with us.',
        franchiseTestimonialsList: DEFAULT_FRANCHISE_TESTIMONIALS,
        franchiseTestimonialsHeadingColor: '',
        franchiseTestimonialsSubtitleColor: '',
      }));
      setEditingId(null);
    }
  };

  const resolveAvatar = (item) => {
    if (item.avatarKey && AVATAR_OPTIONS.find((a) => a.id === item.avatarKey)) {
      return AVATAR_OPTIONS.find((a) => a.id === item.avatarKey).src;
    }
    if (item.avatarUrl) return item.avatarUrl;
    return item.name?.toLowerCase().includes('priya') ? priyaImg : rajeshImg;
  };

  return (
    <div className="space-y-6">
      {/* Franchise Section Bar */}
      <FranchiseSectionBar
        activeSection="testimonials"
        onSwitchSection={onSwitchView}
      />

      {/* Main Section Header */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="text-neon-pink" size={20} />
            <span>Voice of Franchise Partners (Reviews &amp; Testimonials)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage franchisee social proof, real partner success stories &amp; photo cards
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Section Headings & Subtitle */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VisualTextEditor
            label="Section Heading (Prefix)"
            name="franchiseTestimonialsHeading"
            value={current.franchiseTestimonialsHeading !== undefined ? current.franchiseTestimonialsHeading : 'Voice of our'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseTestimonialsHeading')}
            placeholder="e.g. Voice of our"
          />
          <VisualTextEditor
            label="Accent Word (Gradient Highlight)"
            name="franchiseTestimonialsAccent"
            value={current.franchiseTestimonialsAccent !== undefined ? current.franchiseTestimonialsAccent : 'Franchise Partners'}
            onChange={onChange}
            onFocus={() => onFocus?.('franchiseTestimonialsAccent')}
            placeholder="e.g. Franchise Partners"
          />
        </div>

        <VisualTextEditor
          label="Section Subtitle / Notice"
          name="franchiseTestimonialsSubtitle"
          value={current.franchiseTestimonialsSubtitle !== undefined ? current.franchiseTestimonialsSubtitle : 'Hear directly from those who are already growing with us.'}
          onChange={onChange}
          onFocus={() => onFocus?.('franchiseTestimonialsSubtitle')}
          placeholder="Subtitle under section heading..."
          isTextarea={true}
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
          <ColorPaletteInput
            label="Heading Color"
            name="franchiseTestimonialsHeadingColor"
            value={current.franchiseTestimonialsHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Subtitle Color"
            name="franchiseTestimonialsSubtitleColor"
            value={current.franchiseTestimonialsSubtitleColor || ''}
            onChange={onChange}
            defaultValue="#94a3b8"
            defaultLabel="Default (Slate)"
          />
        </div>
      </div>

      {/* Partner Reviews CRUD List */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Quote className="text-neon-pink" size={16} />
              <span>Partner Testimonials List ({testimonialsList.length})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new franchisee quotes, update partner photos, and reorder cards
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartAdd}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neon-pink/20 hover:bg-neon-pink/30 text-white border border-neon-pink/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Partner Review</span>
          </button>
        </div>

        {/* Modal / Inline Edit Card */}
        {editingId && (
          <div className="p-4 rounded-xl bg-black/60 border border-neon-pink/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-neon-pink uppercase tracking-wider">
                {editingId === 'new' ? 'Add New Partner Review' : 'Edit Partner Review'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Partner Full Name</label>
                <input
                  type="text"
                  name="partnerName"
                  value={form.name}
                  onChange={(e) => handleUpdateFormField('name', e.target.value)}
                  onFocus={() => onFocus?.('partnerName')}
                  placeholder="e.g. Rajesh Khanna"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Partner Location / Role</label>
                <input
                  type="text"
                  name="partnerLocation"
                  value={form.location}
                  onChange={(e) => handleUpdateFormField('location', e.target.value)}
                  onFocus={() => onFocus?.('partnerLocation')}
                  placeholder="e.g. Partner, Mumbai Central"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Partner Photo Avatar</label>
              <div className="flex flex-wrap items-center gap-3">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      handleUpdateFormField('avatarKey', av.id);
                      handleUpdateFormField('avatarUrl', '');
                      onFocus?.('partnerAvatar');
                    }}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                      form.avatarKey === av.id && !form.avatarUrl
                        ? 'border-neon-pink bg-neon-pink/20 shadow-[0_0_12px_rgba(255,41,117,0.3)]'
                        : 'border-white/10 bg-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av.src} alt={av.label} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-[11px] text-white font-medium">{av.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-[11px] text-slate-400 block mb-1">Or Custom Image URL:</label>
                <input
                  type="text"
                  name="partnerAvatarUrl"
                  value={form.avatarUrl}
                  onChange={(e) => {
                    handleUpdateFormField('avatarUrl', e.target.value);
                    if (e.target.value) handleUpdateFormField('avatarKey', '');
                  }}
                  onFocus={() => onFocus?.('partnerAvatar')}
                  placeholder="https://example.com/partner-photo.jpg"
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Testimonial Quote</label>
              <textarea
                rows={3}
                name="partnerQuote"
                value={form.text}
                onChange={(e) => handleUpdateFormField('text', e.target.value)}
                onFocus={() => onFocus?.('partnerQuote')}
                placeholder="Partner's review about occupancy, returns, design, or team support..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-neon-pink/30 hover:bg-neon-pink/40 text-white border border-neon-pink/50 transition-all flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Review</span>
              </button>
            </div>
          </div>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-3">
          {testimonialsList.map((item, idx) => {
            const avatarSrc = resolveAvatar(item);
            const isEditing = editingId === (item.id || item.name);

            return (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  isEditing
                    ? 'border-neon-pink bg-neon-pink/[0.05]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSrc}
                      alt={item.name}
                      className="w-11 h-11 rounded-full border-2 border-neon-pink p-0.5 object-cover shrink-0"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-white leading-tight">
                        {renderFormattedText(item.name)}
                      </h5>
                      <span className="text-[11px] text-neon-pink font-semibold">
                        {renderFormattedText(item.location || item.role || 'Partner')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === testimonialsList.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg text-neon-blue hover:text-cyan-300 transition-all"
                      title="Edit review"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id || item.name)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic mt-3 pl-2 border-l-2 border-neon-pink/40 line-clamp-2">
                  "{renderFormattedText(item.text || item.content || '')}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
