import { useState, useRef } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import {
  Image,
  Sparkles,
  Layers,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  CheckCircle2,
  FileImage,
  RefreshCw
} from 'lucide-react';

// Import the local gallery images for the admin visual overview
const imageModules = import.meta.glob('../../../assets/gallery/*.jpeg', { eager: true, import: 'default' });
const localImages = Object.keys(imageModules)
  .sort((a, b) => {
    const matchA = a.match(/(\d+)\.jpeg$/);
    const matchB = b.match(/(\d+)\.jpeg$/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  })
  .map(key => imageModules[key]);

// Client-side image optimizer using Canvas API
const optimizeImageFile = (file, maxWidth = 1280, quality = 0.82) => {
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

export default function GalleryTab({ current, onChange, onFocus, setFormData }) {
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const fileInputRef = useRef(null);

  const customImages = Array.isArray(current.customGalleryImages) ? current.customGalleryImages : [];

  // Handle files selected via input or drag-and-drop
  const handleProcessFiles = async (filesList) => {
    const validFiles = Array.from(filesList).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const optimizedResults = await Promise.all(
        validFiles.map((file) => optimizeImageFile(file))
      );

      // Add to pending staged list with default captions
      const staged = optimizedResults.map((res) => ({
        id: Date.now() + Math.random(),
        url: res.dataUrl,
        title: res.originalName || 'Workspace View',
        sizeKb: res.sizeKb,
        dimensions: `${res.width}x${res.height}`,
      }));

      setPendingFiles((prev) => [...prev, ...staged]);
    } catch (err) {
      console.error('Error optimizing image:', err);
      alert('Could not process some of the selected images.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmPendingFiles = () => {
    if (pendingFiles.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      customGalleryImages: [
        ...(Array.isArray(prev.customGalleryImages) ? prev.customGalleryImages : []),
        ...pendingFiles,
      ],
    }));

    setPendingFiles([]);
  };

  const handleRemovePending = (idToRemove) => {
    setPendingFiles((prev) => prev.filter((p) => p.id !== idToRemove));
  };

  const handleUpdatePendingTitle = (id, newTitle) => {
    setPendingFiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p))
    );
  };

  // URL fallback addition
  const handleAddCustomUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newEntry = {
      id: Date.now(),
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || 'Custom Workspace Photo',
    };

    setFormData((prev) => ({
      ...prev,
      customGalleryImages: [
        ...(Array.isArray(prev.customGalleryImages) ? prev.customGalleryImages : []),
        newEntry,
      ],
    }));

    setNewImageUrl('');
    setNewImageTitle('');
  };

  const handleRemoveCustomImage = (idToRemove) => {
    setFormData((prev) => ({
      ...prev,
      customGalleryImages: (Array.isArray(prev.customGalleryImages) ? prev.customGalleryImages : []).filter(
        (img, idx) => (img.id || idx) !== idToRemove
      ),
    }));
  };

  const initialCount = Number(current.galleryInitialCount) || 6;

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADERS & LABELS */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="pb-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-neon-blue" />
              Gallery Header &amp; Badge
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize the section title, glowing accent, and card badge shown across the photo gallery
            </p>
          </div>
          <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
            Copy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VisualTextEditor
            label="Heading (Prefix)"
            name="galleryHeading"
            value={current.galleryHeading || ''}
            onChange={onChange}
            onFocus={() => onFocus?.('galleryHeading')}
            placeholder="e.g. Inside"
          />
          <VisualTextEditor
            label="Gradient Accent Highlight"
            name="galleryAccent"
            value={current.galleryAccent || ''}
            onChange={onChange}
            onFocus={() => onFocus?.('galleryAccent')}
            placeholder="e.g. Startup Cafe"
          />
        </div>

        <VisualTextEditor
          label="Gallery Subtitle (Optional)"
          name="galleryDescription"
          value={current.galleryDescription || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('galleryDescription')}
          placeholder="e.g. Take a visual tour through our futuristic workstations and collaborative spaces..."
          isTextarea={true}
          rows={2}
        />

        <VisualTextEditor
          label="Photo Card Hover Badge"
          name="galleryBadge"
          value={current.galleryBadge || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('galleryBadge')}
          placeholder="e.g. Workspace View"
        />
      </div>

      {/* 2. INITIAL DISPLAY LIMIT */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="pb-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-neon-pink" />
              Initial Visible Photos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How many photos to display on the page before visitors click "View All"
            </p>
          </div>
          <span className="text-xs text-neon-pink font-semibold px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/20">
            Layout
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[6, 8, 9, 12, 100].map((num) => {
            const isSelected = num === 100 ? initialCount >= 50 : initialCount === num;
            const label = num === 100 ? 'All Photos' : `${num} Photos`;
            return (
              <button
                key={num}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    galleryInitialCount: num === 100 ? 100 : num,
                  }))
                }
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-neon-pink/20 border-neon-pink text-white shadow-[0_0_15px_rgba(255,41,117,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {label} {num === 6 && <span className="text-[10px] opacity-70 block font-normal">(Default)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. UPLOAD PHOTOS DIRECTLY OR VIA URL */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload size={16} className="text-emerald-400" />
              Upload Photos to Gallery
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or drop photos directly from your computer or phone without needing any web links
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload size={12} />
              Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                uploadMode === 'url'
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon size={12} />
              Paste Web URL
            </button>
          </div>
        </div>

        {/* MODE A: DIRECT FILE UPLOAD (DRAG & DROP) */}
        {uploadMode === 'file' && (
          <div className="space-y-4">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              multiple
              onChange={(e) => handleProcessFiles(e.target.files)}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) handleProcessFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 select-none ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.25)] scale-[1.01]'
                  : 'border-white/15 bg-white/[0.02] hover:border-emerald-400/50 hover:bg-white/[0.04]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
                {isProcessing ? (
                  <RefreshCw size={22} className="animate-spin text-emerald-400" />
                ) : (
                  <Upload size={22} />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {isProcessing
                    ? 'Optimizing and compressing photos...'
                    : 'Click to choose photos or drag & drop here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WebP • Auto-optimized for instant website loading
                </p>
              </div>

              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors">
                Browse Files from Device
              </span>
            </div>

            {/* STAGED PENDING FILES PREVIEW (BEFORE SAVING) */}
            {pendingFiles.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200">
                      {pendingFiles.length} Photo{pendingFiles.length > 1 ? 's' : ''} Ready to Add
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingFiles([])}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmPendingFiles}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      Add to Gallery Now
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {pendingFiles.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-black/60 border border-white/10 space-y-2 flex flex-col justify-between"
                    >
                      <div className="relative aspect-video rounded overflow-hidden bg-black/40">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-emerald-300 font-mono">
                          {item.sizeKb} KB
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Caption</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdatePendingTitle(item.id, e.target.value)}
                          placeholder="Photo Caption"
                          className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePending(item.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1 pt-1"
                      >
                        <Trash2 size={11} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE B: URL INPUT MODE */}
        {uploadMode === 'url' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Direct Image URL (e.g. https://.../photo.jpg)"
                className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:border-neon-blue focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                placeholder="Photo Label / Caption (Optional)"
                className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:border-neon-blue focus:outline-none transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handleAddCustomUrl}
              disabled={!newImageUrl.trim()}
              className="px-4 py-2.5 rounded-xl bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-neon-blue text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <Plus size={14} />
              Add URL to Gallery
            </button>
          </div>
        )}

        {/* LIST OF CURRENTLY ADDED CUSTOM / UPLOADED PHOTOS */}
        {customImages.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileImage size={14} className="text-emerald-400" />
                Your Added Photos ({customImages.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Remove all custom uploaded photos?')) {
                    setFormData((prev) => ({ ...prev, customGalleryImages: [] }));
                  }
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Remove All Uploaded
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {customImages.map((img, idx) => {
                const url = typeof img === 'string' ? img : img.url;
                const title = typeof img === 'object' && img.title ? img.title : `Custom Photo #${idx + 1}`;
                const targetId = typeof img === 'object' && img.id ? img.id : idx;

                return (
                  <div
                    key={targetId}
                    className="relative group rounded-xl overflow-hidden border border-white/15 aspect-video bg-black/40"
                  >
                    <img src={url} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomImage(targetId)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer"
                        title="Remove this photo from gallery"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white truncate">
                      {title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. VISUAL OVERVIEW OF ORIGINAL PRE-LOADED PHOTOS */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image size={16} className="text-neon-purple" />
            <h4 className="text-sm font-bold text-white">
              Original Pre-Loaded Photos ({localImages.length} Built-in Assets)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Default Baseline</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          These 14 original high-resolution photos are stored locally in the project repository. Any uploaded photos you add will appear alongside these in the gallery.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 pt-2">
          {localImages.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40 group"
            >
              <img src={img} alt={`Workspace ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">#{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
