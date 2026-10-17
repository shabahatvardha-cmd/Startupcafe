import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Upload,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import VisualTextEditor from '../VisualTextEditor';
import {
  LOGO_PRESETS,
  DEFAULT_ECOSYSTEM_PARTNERS,
  getPartnerLogoSrc,
} from '../../franchise/ecosystemConstants';

export default function AcknowledgedTab({ current, onChange, onFocus, setFormData }) {
  const ecosystemPartners = Array.isArray(current.ecosystemPartnersList) && current.ecosystemPartnersList.length > 0
    ? current.ecosystemPartnersList
    : DEFAULT_ECOSYSTEM_PARTNERS;

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({
    id: '',
    name: '',
    badge: 'Acknowledged by',
    isGov: true,
    logoKey: 'logo1',
    imageUrl: '',
  });
  const [partnerLogoSource, setPartnerLogoSource] = useState('preset'); // 'preset' | 'upload' | 'url'
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const showOnHome = current.showAcknowledgedOnHome !== false;

  const handleToggleShowOnHome = (value) => {
    if (setFormData) {
      setFormData((prev) => ({ ...prev, showAcknowledgedOnHome: value }));
    }
    onChange?.({ target: { name: 'showAcknowledgedOnHome', value } });
  };

  const handleStartAddPartner = () => {
    setPartnerForm({
      id: `partner-${Date.now()}`,
      name: '',
      badge: 'Acknowledged by',
      isGov: true,
      logoKey: 'logo1',
      imageUrl: '',
    });
    setPartnerLogoSource('preset');
    setEditingPartnerId('new');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEditPartner = (item) => {
    const hasCustomImg = Boolean(item.imageUrl || item.image);
    const customImgSrc = (item.imageUrl || item.image || '').trim();
    setPartnerForm({
      id: item.id || `partner-${Date.now()}`,
      name: item.name || '',
      badge: item.badge || 'Acknowledged by',
      isGov: item.isGov !== undefined ? Boolean(item.isGov) : true,
      logoKey: item.logoKey || (hasCustomImg ? '' : 'logo1'),
      imageUrl: customImgSrc,
    });
    setPartnerLogoSource(
      hasCustomImg
        ? (customImgSrc.startsWith('data:') ? 'upload' : 'url')
        : 'preset'
    );
    setEditingPartnerId(item.id || item.name);
  };

  const handleCancelPartner = () => {
    setEditingPartnerId(null);
  };

  const handlePartnerImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file is too large. Please select an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPartnerForm((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePartner = (e) => {
    e?.preventDefault?.();
    if (!partnerForm.name.trim()) {
      alert('Please enter a partner name (e.g. Ministry of Commerce & Industry)');
      return;
    }

    const isPreset = partnerLogoSource === 'preset';
    const newPartner = {
      id: partnerForm.id || `partner-${Date.now()}`,
      name: partnerForm.name.trim(),
      badge: partnerForm.badge.trim() || 'Acknowledged by',
      isGov: Boolean(partnerForm.isGov),
      logoKey: isPreset ? (partnerForm.logoKey || 'logo1') : '',
      imageUrl: isPreset ? '' : (partnerForm.imageUrl || '').trim(),
    };

    let updatedList;
    if (editingPartnerId === 'new') {
      updatedList = [...ecosystemPartners, newPartner];
    } else {
      updatedList = ecosystemPartners.map((item) =>
        (item.id === editingPartnerId || item.name === editingPartnerId) ? newPartner : item
      );
    }

    if (setFormData) {
      setFormData((prev) => ({ ...prev, ecosystemPartnersList: updatedList }));
    }
    onChange?.({ target: { name: 'ecosystemPartnersList', value: updatedList } });

    setEditingPartnerId(null);
  };

  const handleDeletePartner = (idOrName) => {
    if (!confirm('Are you sure you want to remove this partner logo?')) return;
    const updatedList = ecosystemPartners.filter(
      (item) => item.id !== idOrName && item.name !== idOrName
    );
    if (setFormData) {
      setFormData((prev) => ({ ...prev, ecosystemPartnersList: updatedList }));
    }
    onChange?.({ target: { name: 'ecosystemPartnersList', value: updatedList } });
  };

  const handleMovePartner = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ecosystemPartners.length) return;
    const reordered = [...ecosystemPartners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    if (setFormData) {
      setFormData((prev) => ({ ...prev, ecosystemPartnersList: reordered }));
    }
    onChange?.({ target: { name: 'ecosystemPartnersList', value: reordered } });
  };

  const handleResetToDefault = () => {
    if (!confirm('Reset all partner logos back to the default list (12 verified partners)?')) return;
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        ecosystemPartnersList: DEFAULT_ECOSYSTEM_PARTNERS,
        acknowledgedHeading: 'Acknowledged By',
        showAcknowledgedOnHome: true,
      }));
    }
    onChange?.({ target: { name: 'ecosystemPartnersList', value: DEFAULT_ECOSYSTEM_PARTNERS } });
    onChange?.({ target: { name: 'acknowledgedHeading', value: 'Acknowledged By' } });
    onChange?.({ target: { name: 'showAcknowledgedOnHome', value: true } });
  };

  const filteredPartners = partnerSearchQuery.trim()
    ? ecosystemPartners.filter((item) =>
        item.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(partnerSearchQuery.toLowerCase()))
      )
    : ecosystemPartners;

  return (
    <div className="space-y-6">
      {/* SECTION HEADER HELPER BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-neon-blue/15 via-neon-purple/10 to-transparent border border-neon-blue/30 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center text-neon-blue">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Acknowledged By · Partner Logos Strip
              </h3>
              <p className="text-xs text-slate-300">
                Displayed right below the Hero Banner on the Homepage. Highlights key government bodies, academic institutions, and media coverage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset logos to standard 12 partners"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleShowOnHome(!showOnHome)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showOnHome
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {showOnHome ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showOnHome ? 'Visible on Home' : 'Hidden on Home'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STRIP HEADING TITLE */}
      <div className="glass-card p-5 rounded-xl border border-white/10 space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building2 size={14} className="text-neon-blue" />
          <span>Section Label &amp; Appearance</span>
        </h4>
        <VisualTextEditor
          label="Strip Title (Displayed above logos)"
          name="acknowledgedHeading"
          value={current.acknowledgedHeading !== undefined ? current.acknowledgedHeading : 'Acknowledged By'}
          onChange={onChange}
          onFocus={() => onFocus?.('acknowledgedHeading')}
          placeholder="Acknowledged By"
        />
      </div>

      {/* PARTNER LOGOS MANAGER */}
      <div className="glass-card p-5 rounded-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-neon-blue" />
              <span>Partner &amp; Institution Logos ({ecosystemPartners.length})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage all badges and logos shown in the ticker strip on your homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {ecosystemPartners.length > 5 && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={partnerSearchQuery}
                  onChange={(e) => setPartnerSearchQuery(e.target.value)}
                  placeholder="Filter logos..."
                  className="pl-8 pr-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue w-36 sm:w-44"
                />
              </div>
            )}

            {editingPartnerId === null && (
              <button
                type="button"
                onClick={handleStartAddPartner}
                className="px-3.5 py-1.5 rounded-lg bg-neon-blue hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-neon-blue/20 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Partner Logo</span>
              </button>
            )}
          </div>
        </div>

        {/* ADD / EDIT INLINE FORM (Using div to prevent nested form conflict) */}
        {editingPartnerId !== null && (
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                handleSavePartner();
              }
            }}
            className="p-4 rounded-xl bg-slate-900/90 border border-neon-blue/40 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h5 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-neon-blue" />
                <span>{editingPartnerId === 'new' ? 'Add New Partner Logo' : 'Edit Partner'}</span>
              </h5>
              <button
                type="button"
                onClick={handleCancelPartner}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Partner / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ministry of Commerce & Industry"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Badge Tag (e.g. Acknowledged by, Associated with)
                </label>
                <input
                  type="text"
                  value={partnerForm.badge}
                  onChange={(e) => setPartnerForm((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="Acknowledged by"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            {/* Logo Source Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Logo Source:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPartnerLogoSource('preset')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    partnerLogoSource === 'preset'
                      ? 'bg-neon-blue text-black'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Choose from 12 Built-in Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerLogoSource('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    partnerLogoSource === 'upload'
                      ? 'bg-neon-blue text-black'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Upload Custom Logo
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerLogoSource('url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    partnerLogoSource === 'url'
                      ? 'bg-neon-blue text-black'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {partnerLogoSource === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                  {LOGO_PRESETS.map((preset) => {
                    const isSelected = partnerForm.logoKey === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setPartnerForm((prev) => {
                            const prevPreset = LOGO_PRESETS.find((p) => p.id === prev.logoKey);
                            const shouldUpdateName = !prev.name.trim() || (prevPreset && prev.name === prevPreset.name);
                            return {
                              ...prev,
                              logoKey: preset.id,
                              imageUrl: '',
                              name: shouldUpdateName ? preset.name : prev.name,
                            };
                          })
                        }
                        className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-neon-blue/20 border-neon-blue ring-1 ring-neon-blue shadow-md'
                            : 'bg-black/40 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                          <img src={preset.src} alt={preset.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[10px] text-slate-300 line-clamp-1">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {partnerLogoSource === 'upload' && (
                <div className="pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePartnerImageUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-neon-blue/60 rounded-xl p-4 text-center cursor-pointer bg-black/40 transition-colors"
                  >
                    <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Click to choose an image (PNG, JPG, WEBP, SVG)
                    </p>
                    <p className="text-[10px] text-slate-500">Max size: 2MB</p>
                  </div>
                  {partnerForm.imageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white p-1 overflow-hidden">
                        <img src={partnerForm.imageUrl} alt="Uploaded logo preview" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">Custom logo ready!</span>
                    </div>
                  )}
                </div>
              )}

              {partnerLogoSource === 'url' && (
                <div className="pt-2 space-y-2">
                  <input
                    type="url"
                    value={partnerForm.imageUrl}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                  />
                  {partnerForm.imageUrl && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white p-1 overflow-hidden">
                        <img
                          src={partnerForm.imageUrl}
                          alt="URL preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">Preview</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gov / Partner checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isGovCheck"
                checked={partnerForm.isGov}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, isGov: e.target.checked }))}
                className="w-4 h-4 rounded text-neon-blue focus:ring-neon-blue cursor-pointer"
              />
              <label htmlFor="isGovCheck" className="text-xs text-slate-300 cursor-pointer">
                Government / Recognized Institution badge (Shows 'Gov' tag)
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelPartner}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePartner}
                className="px-4 py-1.5 rounded-lg bg-neon-blue hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-neon-blue/20 cursor-pointer"
              >
                <Check size={14} />
                <span>Save Partner Logo</span>
              </button>
            </div>
          </div>
        )}

        {/* PARTNERS LIST CARDS */}
        {filteredPartners.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
            No partner logos matched "{partnerSearchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredPartners.map((item, idx) => {
              const originalIndex = ecosystemPartners.findIndex((p) => (p.id || p.name) === (item.id || item.name));
              const logoSrc = getPartnerLogoSrc(item);
              const isCustom = Boolean((item.imageUrl && item.imageUrl.trim()) || (item.image && item.image.trim()));

              return (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      <img
                        src={logoSrc}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>{item.badge || 'Acknowledged by'}</span>
                        {item.isGov && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-neon-blue/20 text-neon-blue font-mono">
                            Gov
                          </span>
                        )}
                        {isCustom && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={originalIndex <= 0}
                      onClick={() => handleMovePartner(originalIndex, -1)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Move Earlier in strip"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={originalIndex < 0 || originalIndex >= ecosystemPartners.length - 1}
                      onClick={() => handleMovePartner(originalIndex, 1)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Move Later in strip"
                    >
                      <ChevronRight size={13} />
                    </button>

                    {/* Edit & Delete Buttons */}
                    <button
                      type="button"
                      onClick={() => handleStartEditPartner(item)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-neon-blue transition-colors cursor-pointer"
                      title="Edit Partner"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePartner(item.id || item.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Partner"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
