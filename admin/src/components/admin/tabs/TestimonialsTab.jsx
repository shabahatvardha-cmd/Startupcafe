import { useState } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_TESTIMONIALS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  User,
  Quote,
  Sparkles
} from 'lucide-react';

export default function TestimonialsTab({ current, onChange, onFocus, setFormData }) {
  const testimonialsList = Array.isArray(current.testimonialsList) && current.testimonialsList.length > 0
    ? current.testimonialsList
    : DEFAULT_TESTIMONIALS;

  const [editingId, setEditingId] = useState(null); // testimonial id or 'new'
  const [form, setForm] = useState({
    id: '',
    name: '',
    role: '',
    content: '',
    rating: 5,
    avatarKey: '',
    avatarUrl: '',
  });

  const handleStartAdd = () => {
    setForm({
      id: `testimonial-${Date.now()}`,
      name: '',
      role: 'Founder & CEO',
      content: 'Startup Cafe provided our team with the perfect environment to scale rapidly.',
      rating: 5,
      avatarKey: '',
      avatarUrl: '',
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setForm({
      id: item.id || `testimonial-${Date.now()}`,
      name: item.name || '',
      role: item.role || '',
      content: item.content || '',
      rating: typeof item.rating === 'number' ? item.rating : 5,
      avatarKey: item.avatarKey || '',
      avatarUrl: item.avatarUrl || '',
    });
    setEditingId(item.id || item.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveReview = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a reviewer name.');
      return;
    }
    if (!form.content.trim()) {
      alert('Please enter review content.');
      return;
    }

    const updatedItem = {
      id: form.id,
      name: form.name.trim(),
      role: form.role.trim(),
      content: form.content.trim(),
      rating: Number(form.rating) || 5,
      avatarKey: form.avatarKey || '',
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
      testimonialsList: updatedList,
    }));
    setEditingId(null);
  };

  const handleDeleteReview = (targetId) => {
    if (testimonialsList.length <= 1) {
      alert('You must keep at least 1 testimonial review.');
      return;
    }

    const updatedList = testimonialsList.filter(
      (item) => item.id !== targetId && item.name !== targetId
    );

    setFormData((prev) => ({
      ...prev,
      testimonialsList: updatedList,
    }));

    if (editingId === targetId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= testimonialsList.length) return;
    const copy = [...testimonialsList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setFormData((prev) => ({
      ...prev,
      testimonialsList: copy,
    }));
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Restore the original 3 default reviews (Rohan, Sanya, Arjun)?')) {
      setFormData((prev) => ({
        ...prev,
        testimonialsList: DEFAULT_TESTIMONIALS,
      }));
      setEditingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SC';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Copy Settings */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Quote className="text-neon-pink" size={18} />
            Testimonials Section Copy
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Client Reviews &amp; Social Proof — edit heading, accent text, and color overrides
          </p>
        </div>
        <span className="text-xs text-neon-pink font-semibold px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/20">
          Reviews
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualTextEditor
          label="Heading (Prefix)"
          name="testimonialsHeading"
          value={current.testimonialsHeading || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('testimonialsHeading')}
          placeholder="e.g. What Co-Works"
        />
        <VisualTextEditor
          label="Accent Word (Gradient Highlight)"
          name="testimonialsAccent"
          value={current.testimonialsAccent || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('testimonialsAccent')}
          placeholder="e.g. Say"
        />
      </div>

      {/* Individual Section Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Testimonials Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Testimonials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Heading Color"
            name="testimonialsHeadingColor"
            value={current.testimonialsHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Quote Text Color"
            name="testimonialsTextColor"
            value={current.testimonialsTextColor || ''}
            onChange={onChange}
            defaultValue="#e2e8f0"
            defaultLabel="Default (Light Slate)"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC TESTIMONIALS MANAGER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Manage Client Reviews
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/30 font-semibold">
                {testimonialsList.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new client reviews, edit quotes, change star ratings, and reorder.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset reviews back to original 3 defaults (Rohan, Sanya, Arjun)"
            >
              <RotateCcw size={13} />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3.5 py-1.5 rounded-xl bg-neon-pink text-white font-bold text-xs hover:bg-neon-pink/90 shadow-[0_0_15px_rgba(255,41,117,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add New Review
            </button>
          </div>
        </div>

        {/* ADD / EDIT FORM MODAL / INLINE CARD */}
        {editingId !== null && (
          <div className="p-4 rounded-xl bg-black/60 border border-neon-pink/40 shadow-[0_0_20px_rgba(255,41,117,0.15)] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={14} className="text-neon-pink" />
                {editingId === 'new' ? 'Add New Client Review' : 'Edit Client Review'}
              </h5>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <VisualTextEditor
                label="Client / Reviewer Name"
                name="reviewerName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />

              <VisualTextEditor
                label="Designation / Role / Company"
                name="reviewerRole"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Founder & CEO @ NexaAI"
                helperText="Highlight words to style them."
              />
            </div>

            <VisualTextEditor
              label="Review / Testimonial Quote"
              name="reviewerContent"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              isTextarea={true}
              rows={3}
              placeholder="Share the client's experience at Startup Cafe..."
              helperText="Highlight words to style them."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Star Rating Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Star Rating (1–5)
                </label>
                <div className="flex items-center gap-2 bg-black/60 border border-white/15 px-3 py-2 rounded-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="cursor-pointer transition-transform hover:scale-125"
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={18}
                        className={
                          star <= form.rating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                            : 'text-slate-600'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-300 font-bold ml-2">
                    {form.rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Avatar Type */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Avatar Option
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatarKey: 'rohan', avatarUrl: '' })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      form.avatarKey === 'rohan'
                        ? 'border-neon-pink bg-neon-pink/20 text-white'
                        : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    Rohan
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatarKey: 'sanya', avatarUrl: '' })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      form.avatarKey === 'sanya'
                        ? 'border-neon-pink bg-neon-pink/20 text-white'
                        : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    Sanya
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatarKey: 'arjun', avatarUrl: '' })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      form.avatarKey === 'arjun'
                        ? 'border-neon-pink bg-neon-pink/20 text-white'
                        : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    Arjun
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatarKey: '', avatarUrl: '' })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      !form.avatarKey && !form.avatarUrl
                        ? 'border-neon-pink bg-neon-pink/20 text-white'
                        : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                    }`}
                    title="Use automatic initials badge"
                  >
                    Initials
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Custom Image URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Optional Custom Image URL (Overrides presets if entered)
              </label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value, avatarKey: '' })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-neon-pink focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2 rounded-xl bg-neon-pink text-white font-bold text-xs hover:bg-neon-pink/90 shadow-[0_0_15px_rgba(255,41,117,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                Save Review
              </button>
            </div>
          </div>
        )}

        {/* CARDS LIST */}
        <div className="space-y-2.5">
          {testimonialsList.map((item, index) => {
            const itemId = item.id || item.name || `testimonial-${index}`;
            const ratingCount = typeof item.rating === 'number' ? item.rating : 5;
            return (
              <div
                key={itemId}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
              >
                <div
                  onClick={() => handleStartEdit(item)}
                  className="flex items-start sm:items-center gap-3 min-w-0 cursor-pointer flex-1 group/row"
                  title="Click to edit this review"
                >
                  {/* Avatar or Initials Preview */}
                  <div className="w-11 h-11 rounded-full border border-neon-pink/50 bg-neon-pink/10 text-white font-bold flex items-center justify-center text-xs shrink-0 select-none group-hover/row:scale-105 transition-transform">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : item.avatarKey ? (
                      <span className="capitalize">{item.avatarKey[0]}</span>
                    ) : (
                      getInitials(item.name)
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        #{index + 1}
                      </span>
                      <h5 className="text-sm font-bold text-white truncate group-hover/row:text-neon-pink transition-colors">
                        {renderFormattedText(item.name)}
                      </h5>
                      {item.role && (
                        <span className="text-[11px] text-slate-400 truncate">
                          • {renderFormattedText(item.role)}
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 ml-1">
                        {[...Array(ratingCount)].map((_, i) => (
                          <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic truncate max-w-lg mt-0.5">
                      &quot;{renderFormattedText(item.content)}&quot;
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
                    disabled={index === testimonialsList.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-neon-pink hover:border-neon-pink/40 hover:bg-neon-pink/10 transition-colors cursor-pointer"
                    title="Edit review"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReview(itemId)}
                    disabled={testimonialsList.length <= 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Delete review"
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
