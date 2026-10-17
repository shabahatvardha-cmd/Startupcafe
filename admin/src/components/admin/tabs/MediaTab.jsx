import { useState, useRef, useMemo } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import { INITIAL_PRESS_ITEMS } from '../../sections/PressCoverage';
import { renderFormattedText } from '../../../utils/textFormatter';
import {
  Newspaper,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Search,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Image as ImageIcon,
  Sparkles,
  FileImage,
} from 'lucide-react';

// In-browser Canvas image optimizer (compresses image to compact data URL)
const optimizeImageFile = (file, maxWidth = 800, quality = 0.68) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Image processing timed out'));
    }, 10000);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        clearTimeout(timer);
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
          originalName: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'media-image',
        });
      };
      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Failed to load image'));
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export default function MediaTab({ current, onChange, onFocus, setFormData, updateSettings, onSave }) {
  // Mode & Form States
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' or 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [savedNotice, setSavedNotice] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const fileInputRef = useRef(null);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    title: '',
    publisher: '',
    excerpt: '',
    url: '',
    externalUrl: '',
  });

  // Editing Item Modal State
  const [editingItem, setEditingItem] = useState(null);

  // Determine current effective list
  const hasCustomList = Array.isArray(current?.mediaHighlightsList) && current.mediaHighlightsList.length > 0;
  const currentList = useMemo(() => {
    return hasCustomList ? current.mediaHighlightsList : INITIAL_PRESS_ITEMS;
  }, [hasCustomList, current?.mediaHighlightsList]);

  // Filtered list for search
  const filteredList = useMemo(() => {
    if (!searchFilter.trim()) return currentList;
    const q = searchFilter.toLowerCase();
    return currentList.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.publisher?.toLowerCase().includes(q) ||
        item.excerpt?.toLowerCase().includes(q)
    );
  }, [currentList, searchFilter]);

  // Helper to commit list mutations to state AND immediately sync with SettingsContext
  const updateList = (newList) => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        mediaHighlightsList: newList,
      }));
    }

    onChange?.({ target: { name: 'mediaHighlightsList', value: newList } });

    if (updateSettings) {
      updateSettings((prev) => ({
        ...prev,
        mediaHighlightsList: newList,
      }));
    }
  };

  // Validate image file by MIME type or common extensions (robust across Windows browsers)
  const isImageFile = (file) => {
    if (!file) return false;
    if (file.type && file.type.startsWith('image/')) return true;
    const name = file.name || '';
    return /\.(jpe?g|png|webp|gif|svg|jfif|bmp|avif)$/i.test(name);
  };

  // Image processor helper
  const processFile = async (file) => {
    if (!file) return;
    if (!isImageFile(file)) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }

    setIsProcessing(true);
    try {
      const optimized = await optimizeImageFile(file);
      setNewItem((prev) => ({
        ...prev,
        url: optimized.dataUrl,
      }));
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback: try raw FileReader if canvas compression failed
      try {
        const rawReader = new FileReader();
        rawReader.onload = (e) => {
          setNewItem((prev) => ({
            ...prev,
            url: e.target.result,
          }));
        };
        rawReader.readAsDataURL(file);
      } catch (readErr) {
        console.error('Raw FileReader error:', readErr);
        alert('Could not process image file. Please try another image.');
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Image upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Add New Item
  const handleAddNewItem = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isProcessing) {
      alert('Please wait for image compression to complete before adding.');
      return;
    }

    const titleText = (newItem.title || '').trim();
    const publisherText = (newItem.publisher || '').trim();
    const excerptText = (newItem.excerpt || '').trim();
    const urlText = (newItem.url || '').trim();
    const externalUrlText = (newItem.externalUrl || '').trim();

    // Flexible name handling: support user entering name in Title, Publisher, or both
    const finalTitle = titleText || publisherText;
    const finalPublisher = publisherText || 'Media Feature';

    if (!finalTitle) {
      alert('Please enter a headline or publisher name for this media highlight.');
      return;
    }

    const fallbackImage = INITIAL_PRESS_ITEMS?.[0]?.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';

    const createdItem = {
      id: `custom-media-${Date.now()}`,
      title: finalTitle,
      publisher: finalPublisher,
      excerpt: excerptText,
      url: urlText || fallbackImage,
      externalUrl: externalUrlText,
      hidden: false,
      isCustom: true,
    };

    // Prepend new highlight to the current list
    const updated = [createdItem, ...currentList];
    updateList(updated);

    // Reset Form
    setNewItem({
      title: '',
      publisher: '',
      excerpt: '',
      url: '',
      externalUrl: '',
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 3000);

    setSavedNotice(`"${finalTitle.slice(0, 30)}..." added & saved live to website!`);
    setTimeout(() => setSavedNotice(''), 6000);
  };

  // Remove Item
  const handleRemoveItem = (idToRemove) => {
    const item = currentList.find((i) => i.id === idToRemove);
    const confirmName = item?.title ? `"${item.title.slice(0, 35)}..."` : 'this media highlight';
    if (!window.confirm(`Are you sure you want to remove ${confirmName}?`)) return;

    const updated = currentList.filter((i) => i.id !== idToRemove);
    updateList(updated);
  };

  // Toggle Hidden Status
  const handleToggleHidden = (idToToggle) => {
    const updated = currentList.map((item) =>
      item.id === idToToggle ? { ...item, hidden: !item.hidden } : item
    );
    updateList(updated);
  };

  // Reorder Item
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const listCopy = [...currentList];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(targetIndex, 0, moved);
    updateList(listCopy);
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingItem) return;

    const updated = currentList.map((item) =>
      item.id === editingItem.id ? { ...editingItem } : item
    );
    updateList(updated);
    setEditingItem(null);
  };

  // Reset all media highlights back to original defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Set all media highlights back to the original default press clippings? Any custom additions or edits will be cleared.')) {
      updateList([]);
      setSavedNotice('Media highlights reset to original defaults!');
      setTimeout(() => setSavedNotice(''), 5000);
    }
  };

  const visibleCount = currentList.filter((i) => !i.hidden).length;

  return (
    <div className="space-y-10">
      {/* Live Saved Notification Banner */}
      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{savedNotice}</span>
          </div>
          <a
            href="/#press"
            target="_blank"
            rel="noreferrer"
            className="underline text-emerald-300 hover:text-white flex items-center gap-1 text-[11px] shrink-0"
          >
            View Live on Site <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* 1. Header & Text Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Newspaper size={20} className="text-neon-pink" />
              Media &amp; Highlights Copy
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize the section badge, main heading, and intro description displayed in the press section.
            </p>
          </div>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:shadow-neon-purple/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
              title="Save all headings and highlights live to the main website"
            >
              <Sparkles size={14} />
              Save &amp; Apply All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Badge Text */}
          <VisualTextEditor
            label="Section Badge"
            name="pressBadge"
            value={current?.pressBadge ?? 'Media & Highlights'}
            onChange={onChange}
            onFocus={() => onFocus && onFocus('pressBadge')}
            placeholder="e.g. Media & Highlights"
          />

          {/* Heading */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Main Heading</label>
            <VisualTextEditor
              name="pressHeading"
              value={current?.pressHeading ?? 'In The Spotlight'}
              onChange={onChange}
              onFocus={() => onFocus && onFocus('pressHeading')}
              placeholder="e.g. In The Spotlight"
            />
          </div>

          {/* Subheading */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Description &amp; Intro</label>
            <VisualTextEditor
              name="pressSubheading"
              value={
                current?.pressSubheading ??
                'See what leading newspapers, media outlets, and the community are saying about our revolutionary co-working space.'
              }
              onChange={onChange}
              onFocus={() => onFocus && onFocus('pressSubheading')}
              placeholder="Introductory text describing the press and media highlights..."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8" />

      {/* 2. Add New Media Highlight Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/15 bg-white/[0.02] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Plus size={18} className="text-neon-blue" />
              Add New Media Highlight / Clipping
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Add a new newspaper clipping, online feature, tweet, or video mention to Eastern UP's top coworking reel.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveInputMode('upload')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium cursor-pointer ${activeInputMode === 'upload'
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Upload size={14} />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setActiveInputMode('url')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium cursor-pointer ${activeInputMode === 'url'
                  ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <LinkIcon size={14} />
              Image URL
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload / URL Input */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {activeInputMode === 'upload' ? 'Upload Media Clipping Image (Optional)' : 'Image URL (Optional)'}
                <span className="text-[11px] text-slate-400 font-normal ml-1.5">(Default newspaper clipping used if omitted)</span>
              </label>

              {activeInputMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-file-input"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) processFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-neon-blue/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-black/30 hover:bg-neon-blue/5 flex flex-col items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-neon-blue text-sm">
                        <span className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                        Compressing &amp; optimizing image...
                      </div>
                    ) : newItem.url ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={newItem.url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-white/20 shadow-md"
                        />
                        <div className="text-left flex-1">
                          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <Check size={14} /> Image ready
                          </p>
                          <p className="text-[11px] text-slate-400">Click to change or replace image</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewItem((prev) => ({ ...prev, url: '' }));
                          }}
                          className="px-2.5 py-1 text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <>
                        <FileImage className="text-slate-400" size={28} />
                        <p className="text-xs text-slate-300">
                          Click to select a photo from your computer (auto-compressed for blazing speed)
                        </p>
                        <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP — or leave empty for default press graphic</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={newItem.url}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/press-coverage.jpg (or leave blank for default)"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-pink transition-colors"
                  />
                  {newItem.url && (
                    <div className="relative group shrink-0">
                      <img
                        src={newItem.url}
                        alt="URL Preview"
                        className="w-10 h-10 object-cover rounded-lg border border-white/20"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewItem((prev) => ({ ...prev, url: '' }))}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-500 cursor-pointer"
                        title="Clear image URL"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Publisher Name */}
            <VisualTextEditor
              label="Publisher / Outlet Name"
              name="newPublisher"
              value={newItem.publisher}
              onChange={(e) => setNewItem((prev) => ({ ...prev, publisher: e.target.value }))}
              onFocus={() => onFocus && onFocus('pressMedia')}
              placeholder="e.g. Hindustan Times, Dainik Jagran, Make in India"
            />

            {/* Title / Headline */}
            <VisualTextEditor
              label="Headline / Title"
              name="newTitle"
              value={newItem.title}
              onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
              onFocus={() => onFocus && onFocus('pressMedia')}
              placeholder="e.g. Co-working Cafe Shows New Path to Small Cities"
            />

            {/* Excerpt */}
            <div className="md:col-span-2">
              <VisualTextEditor
                label="Excerpt / Summary"
                name="newExcerpt"
                value={newItem.excerpt}
                onChange={(e) => setNewItem((prev) => ({ ...prev, excerpt: e.target.value }))}
                onFocus={() => onFocus && onFocus('pressMedia')}
                placeholder="A brief snippet or quote from the article describing Eastern UP's first coworking cafe..."
                multiline
                rows={2}
              />
            </div>

            {/* External URL (optional) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Article / Source Link (Optional)
              </label>
              <input
                type="url"
                value={newItem.externalUrl}
                onChange={(e) => setNewItem((prev) => ({ ...prev, externalUrl: e.target.value }))}
                onFocus={() => onFocus && onFocus('pressMedia')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewItem();
                  }
                }}
                placeholder="https://hindustantimes.com/news/article-link (optional)"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {justAdded && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                <Check size={14} className="text-emerald-400" />
                Added &amp; Saved live!
              </span>
            )}
            <button
              type="button"
              id="add-media-highlight-btn"
              onClick={handleAddNewItem}
              disabled={isProcessing}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                isProcessing
                  ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg hover:shadow-neon-blue/40 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                  Compressing Image...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add to Media Highlights
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Existing Media Highlights List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-neon-purple" />
              Manage Highlights ({currentList.length})
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {visibleCount} visible on website • {currentList.length - visibleCount} hidden
              {hasCustomList && (
                <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                  Customized List Active
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search clippings..."
                className="bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue w-40 sm:w-48"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Set to Default Button */}
            {hasCustomList && (
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-rose-500/15 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Set to Default - reset all media highlights back to original default press clippings"
              >
                <RotateCcw size={13} />
                Set to Default
              </button>
            )}
          </div>
        </div>

        {/* Highlights Cards List */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12 border border-white/10 rounded-2xl bg-white/[0.01]">
            <Newspaper className="mx-auto text-slate-600 mb-2" size={32} />
            <p className="text-sm text-slate-400">No media highlights match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredList.map((item, index) => {
              const originalIndex = currentList.findIndex((i) => i.id === item.id);
              const isHidden = Boolean(item.hidden);

              return (
                <div
                  key={item.id || item.url + index}
                  className={`rounded-xl border p-3.5 flex gap-3.5 items-start transition-all ${isHidden
                      ? 'bg-black/40 border-white/5 opacity-55'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/60 border border-white/10 relative group">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300';
                      }}
                    />
                    {item.isCustom && (
                      <span className="absolute top-1 left-1 bg-neon-blue/80 text-[8px] font-bold px-1 rounded text-black">
                        New
                      </span>
                    )}
                  </div>

                  {/* Content details */}
                  <div
                    onClick={() => setEditingItem({ ...item })}
                    className="flex-1 min-w-0 cursor-pointer group/title"
                    title="Click to edit highlight details"
                  >
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/20 truncate max-w-[160px]">
                        {renderFormattedText(item.publisher || 'Media Feature')}
                      </span>
                      {isHidden && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-medium">
                          Hidden
                        </span>
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-white line-clamp-1 mb-1 leading-snug group-hover/title:text-neon-blue transition-colors">
                      {renderFormattedText(item.title || 'Untitled Highlight')}
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {renderFormattedText(item.excerpt || 'No excerpt provided.')}
                    </p>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col items-center gap-1 shrink-0 self-center">
                    {/* Move Up / Down */}
                    <div className="flex flex-col gap-0.5 mb-1">
                      <button
                        type="button"
                        onClick={() => handleMove(originalIndex, -1)}
                        disabled={originalIndex === 0}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(originalIndex, 1)}
                        disabled={originalIndex === currentList.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...item })}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-slate-300 hover:text-neon-blue transition-colors cursor-pointer"
                      title="Edit highlight details"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleHidden(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isHidden
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      title={isHidden ? 'Show on website' : 'Hide from website'}
                    >
                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete highlight"
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

      {/* 4. Edit Highlight Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 size={16} className="text-neon-blue" />
                Edit Media Highlight
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-left">
              {/* Image URL preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Image URL / Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.url}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, url: e.target.value }))}
                    required
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                  />
                  {editingItem.url && (
                    <img
                      src={editingItem.url}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover border border-white/20"
                    />
                  )}
                </div>
              </div>

              {/* Publisher */}
              <VisualTextEditor
                label="Publisher"
                name="editPublisher"
                value={editingItem.publisher || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, publisher: e.target.value }))}
                placeholder="e.g. Hindustan Times"
              />

              {/* Title */}
              <VisualTextEditor
                label="Headline / Title"
                name="editTitle"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Headline title"
              />

              {/* Excerpt */}
              <VisualTextEditor
                label="Excerpt"
                name="editExcerpt"
                value={editingItem.excerpt || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Summary text..."
                multiline
                rows={3}
              />

              {/* External URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">External Link (Optional)</label>
                <input
                  type="url"
                  value={editingItem.externalUrl || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, externalUrl: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neon-blue"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs hover:bg-neon-blue/90 shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
