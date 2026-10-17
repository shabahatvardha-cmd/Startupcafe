import { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Image as ImageIcon,
  Check,
  X,
  Info,
} from 'lucide-react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { getPartnerLogoSrc, DEFAULT_ECOSYSTEM_PARTNERS } from '../../franchise/ecosystemConstants';
import defaultAboutImg from '../../../assets/about_workspace.png';

// Canvas-based image optimizer to keep file size lightweight in localStorage
const optimizeImageFile = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({
          dataUrl,
          width,
          height,
          sizeKb,
          originalName: file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function AboutTab({ current, onChange, onFocus, setFormData, onSelectTab }) {
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const ecosystemPartners = Array.isArray(current.ecosystemPartnersList) && current.ecosystemPartnersList.length > 0
    ? current.ecosystemPartnersList
    : DEFAULT_ECOSYSTEM_PARTNERS;

  const isCustomImage = Boolean(current.aboutImage && current.aboutImage.trim());
  const displayImage = isCustomImage ? current.aboutImage : defaultAboutImg;

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, SVG).');
      return;
    }
    setUploadError('');
    setIsProcessing(true);
    setUploadNotice('Optimizing image...');
    try {
      const optimized = await optimizeImageFile(file, 1200, 0.82);
      setFormData?.((prev) => ({
        ...prev,
        aboutImage: optimized.dataUrl,
      }));
      setUploadNotice(`✓ Photo loaded! (${optimized.width}×${optimized.height}px · ~${optimized.sizeKb} KB)`);
      setTimeout(() => setUploadNotice(''), 4000);
    } catch (err) {
      console.error('Failed to process image:', err);
      setUploadError('Could not process this image file. Try another photo or enter an image URL.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetImage = () => {
    setFormData?.((prev) => ({
      ...prev,
      aboutImage: '',
    }));
    setUploadNotice('Reset back to original workspace photo.');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(() => setUploadNotice(''), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">About Section &amp; Workspace Story</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the "More than just desk." photo, headlines, story paragraphs and acknowledged partner logos.
          </p>
        </div>
        <span className="text-xs text-neon-purple font-semibold px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/20">
          Story &amp; Workspace
        </span>
      </div>

      {/* FEATURED WORKSPACE IMAGE MANAGER */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-neon-purple/10 via-black/50 to-neon-blue/10 border border-neon-purple/30 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} className="text-neon-purple" />
              <span>Workspace Photo ("More than just desk.")</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              The featured photograph shown directly next to the "More than just desk." heading and metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isCustomImage ? (
              <span className="text-[11px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Custom Photo Active
              </span>
            ) : (
              <span className="text-[11px] text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Default Workspace Photo
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Live Visual Preview */}
          <div className="md:col-span-5 space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Current Live Preview
            </label>
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 group shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue blur-xl opacity-20 transform -rotate-3 pointer-events-none"></div>
              <img
                src={displayImage}
                alt="Workspace Preview"
                className="w-full h-48 object-cover relative z-10 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-white/90 border border-white/10 font-mono">
                  {isCustomImage ? 'Custom Asset' : 'about_workspace.png'}
                </span>
                <span className="text-[10px] bg-neon-purple/85 backdrop-blur-md px-2 py-0.5 rounded text-white font-semibold">
                  More than just desk.
                </span>
              </div>
            </div>

            {isCustomImage && (
              <button
                type="button"
                onClick={handleResetImage}
                className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-neon-pink/40 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Reset back to the original about_workspace.png"
              >
                <RotateCcw size={13} className="text-neon-pink" />
                <span>Reset to Original Default Photo</span>
              </button>
            )}
          </div>

          {/* Right Column: Upload or URL Controls */}
          <div className="md:col-span-7 space-y-3">
            {/* Input Mode Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setImageInputMode('upload');
                  setUploadError('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  imageInputMode === 'upload'
                    ? 'bg-neon-purple/20 text-white border-neon-purple/50 shadow-sm shadow-neon-purple/20'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <Upload size={14} className={imageInputMode === 'upload' ? 'text-neon-purple' : ''} />
                <span>Upload Image File</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageInputMode('url');
                  setUploadError('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  imageInputMode === 'url'
                    ? 'bg-neon-blue/20 text-white border-neon-blue/50 shadow-sm shadow-neon-blue/20'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <LinkIcon size={14} className={imageInputMode === 'url' ? 'text-neon-blue' : ''} />
                <span>Image Web URL</span>
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {imageInputMode === 'upload' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                  }}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processFile(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-neon-purple bg-neon-purple/15 scale-[1.01]'
                      : 'border-white/20 hover:border-neon-purple/60 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <Upload
                    size={24}
                    className={`mx-auto mb-2 transition-transform ${
                      isDragging ? 'text-neon-purple scale-110' : 'text-neon-purple/70'
                    }`}
                  />
                  <p className="text-xs font-semibold text-white">
                    {isProcessing ? 'Processing & Optimizing Image...' : 'Click to select or drop an image file'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PNG, JPG, JPEG, WEBP · Auto-compressed for instant loading
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Image Web URL */}
            {imageInputMode === 'url' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">
                  Paste External Image URL:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="aboutImage"
                    value={current.aboutImage || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('aboutImage')}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none placeholder-slate-500"
                  />
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  {current.aboutImage && (
                    <button
                      type="button"
                      onClick={() => setFormData?.((prev) => ({ ...prev, aboutImage: '' }))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                      title="Clear image URL"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste any direct HTTPS image link from Unsplash, Imgur, Cloudinary, AWS S3, or your server.
                </p>
              </div>
            )}

            {/* Status Feedback Messages */}
            {uploadNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-300">
                <Check size={14} className="shrink-0 text-emerald-400" />
                <span>{uploadNotice}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300">
                <X size={14} className="shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Guidance Note */}
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-start gap-2 text-[11px] text-slate-400">
              <Info size={14} className="text-neon-blue shrink-0 mt-0.5" />
              <span>
                <strong>Aesthetic Tip:</strong> A 4:3 or 1:1 ratio photo (~800–1200px wide) featuring an active coworking area, meeting space, or community lounge creates an eye-catching look. You can reset to the original default photo anytime!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACKNOWLEDGED BY / ECOSYSTEM PARTNERS BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-transparent border border-neon-blue/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-neon-blue" />
              <span>Acknowledged By · Partner Logos Strip</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              The partner logos displayed in the "Acknowledged By" banner directly above the About section on the homepage ({ecosystemPartners.length} partners currently active).
            </p>
          </div>
          {onSelectTab && (
            <button
              type="button"
              onClick={() => onSelectTab('acknowledged')}
              className="px-3 py-1.5 rounded-lg bg-neon-blue hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-neon-blue/20"
              title="Jump to edit partner logos in Acknowledged By section"
            >
              <span>Manage in Acknowledged By Section ({ecosystemPartners.length}) →</span>
            </button>
          )}
        </div>

        {/* Live Partner Logos Preview Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {ecosystemPartners.map((partner, idx) => (
            <div
              key={partner.id || idx}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-white p-0.5 shrink-0 overflow-hidden">
                <img
                  src={getPartnerLogoSrc(partner)}
                  alt={partner.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-slate-200 font-medium">{partner.name}</span>
              {partner.isGov && (
                <span className="text-[9px] text-neon-blue bg-neon-blue/15 px-1 py-0.2 rounded font-mono">
                  Gov
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualTextEditor
          label="Heading (Prefix)"
          name="aboutHeading"
          value={current.aboutHeading || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('aboutHeading')}
          placeholder="e.g. More than just"
        />
        <VisualTextEditor
          label="Accent Word (Gradient Highlight)"
          name="aboutAccent"
          value={current.aboutAccent || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('aboutAccent')}
          placeholder="e.g. desk."
        />
      </div>

      <VisualTextEditor
        label="First Paragraph (Vision)"
        name="aboutDescription1"
        value={current.aboutDescription1 || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('aboutDescription1')}
        placeholder="First paragraph describing the vision..."
        isTextarea={true}
        rows={3}
      />

      <VisualTextEditor
        label="Second Paragraph (Community)"
        name="aboutDescription2"
        value={current.aboutDescription2 || ''}
        onChange={onChange}
        onFocus={() => onFocus?.('aboutDescription2')}
        placeholder="Second paragraph describing the community..."
        isTextarea={true}
        rows={3}
      />

      {/* 3 HIGHLIGHT METRICS (500+ Trusted Members, 9-7 Access, 100+ Dedicated Desk) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-transparent border border-white/10 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-neon-blue" />
            <span>Key Metrics &amp; Achievements (3 Highlight Numbers)</span>
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            These 3 highlight badges appear directly underneath the About paragraphs on the Homepage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1 */}
          <div className="p-3 rounded-lg bg-black/60 border border-neon-blue/30 space-y-2">
            <div className="text-[11px] font-bold text-neon-blue uppercase tracking-wider">
              Badge 1 · Members
            </div>
            <VisualTextEditor
              label="Number / Stat"
              name="aboutStat1Value"
              value={current.aboutStat1Value !== undefined ? current.aboutStat1Value : '500+'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat1Value')}
              placeholder="500+"
            />
            <VisualTextEditor
              label="Label Text"
              name="aboutStat1Label"
              value={current.aboutStat1Label !== undefined ? current.aboutStat1Label : 'Trusted Members'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat1Label')}
              placeholder="Trusted Members"
            />
          </div>

          {/* Metric 2 */}
          <div className="p-3 rounded-lg bg-black/60 border border-neon-pink/30 space-y-2">
            <div className="text-[11px] font-bold text-neon-pink uppercase tracking-wider">
              Badge 2 · Timing / Access
            </div>
            <VisualTextEditor
              label="Number / Stat"
              name="aboutStat2Value"
              value={current.aboutStat2Value !== undefined ? current.aboutStat2Value : '9-7'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat2Value')}
              placeholder="9-7"
            />
            <VisualTextEditor
              label="Label Text"
              name="aboutStat2Label"
              value={current.aboutStat2Label !== undefined ? current.aboutStat2Label : 'Access'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat2Label')}
              placeholder="Access"
            />
          </div>

          {/* Metric 3 */}
          <div className="p-3 rounded-lg bg-black/60 border border-neon-purple/30 space-y-2">
            <div className="text-[11px] font-bold text-neon-purple uppercase tracking-wider">
              Badge 3 · Desks / Spaces
            </div>
            <VisualTextEditor
              label="Number / Stat"
              name="aboutStat3Value"
              value={current.aboutStat3Value !== undefined ? current.aboutStat3Value : '100+'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat3Value')}
              placeholder="100+"
            />
            <VisualTextEditor
              label="Label Text"
              name="aboutStat3Label"
              value={current.aboutStat3Label !== undefined ? current.aboutStat3Label : 'Dedicated Desk'}
              onChange={onChange}
              onFocus={() => onFocus?.('aboutStat3Label')}
              placeholder="Dedicated Desk"
            />
          </div>
        </div>
      </div>

      {/* Individual About Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            About Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for About</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPaletteInput
            label="Heading Color"
            name="aboutHeadingColor"
            value={current.aboutHeadingColor || ''}
            onChange={onChange}
            defaultValue="#ffffff"
            defaultLabel="Default (White)"
          />
          <ColorPaletteInput
            label="Paragraphs Text Color"
            name="aboutDescriptionColor"
            value={current.aboutDescriptionColor || ''}
            onChange={onChange}
            defaultValue="#cbd5e1"
            defaultLabel="Default (Slate)"
          />
        </div>
      </div>
    </div>
  );
}
