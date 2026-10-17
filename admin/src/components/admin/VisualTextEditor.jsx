import { useRef, useState, useEffect } from 'react';
import { CURATED_PALETTES, getRecentColors, saveRecentColor } from './ColorPaletteInput';

const BRAND_COLORS = {
  gold: '#fbbf24',
  cyan: '#00f0ff',
  pink: '#ff2975',
  purple: '#b026ff',
  blue: '#3b82f6',
  green: '#10b981',
  white: '#ffffff',
};

const PALETTE_COLORS = [
  { key: 'pink', label: 'Pink', color: '#ff2975' },
  { key: 'cyan', label: 'Cyan', color: '#00f0ff' },
  { key: 'gold', label: 'Gold', color: '#fbbf24' },
  { key: 'purple', label: 'Purple', color: '#b026ff' },
  { key: 'green', label: 'Green', color: '#10b981' },
  { key: 'white', label: 'White', color: '#ffffff' },
];

const COLOR_KEYS = ['gold', 'cyan', 'pink', 'purple', 'blue', 'green', 'white', 'gradient'];
const isColorSpec = (s) => COLOR_KEYS.includes(s.toLowerCase()) || s.startsWith('#') || s.startsWith('rgb');
const isSizeSpec = (s) => ['small', 'sm', 'large', 'lg', 'huge', 'xl', '2xl'].includes(s.toLowerCase());

function computeChipStyles(spec) {
  const parts = spec.split(',').map((p) => p.trim());
  let styles = {};

  let hasColor = false;
  let isGradient = false;

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (part.startsWith('#') || part.startsWith('rgb')) {
      styles.color = part;
      styles.borderColor = `${part}80`;
      styles.backgroundColor = `${part}18`;
      hasColor = true;
    } else if (BRAND_COLORS[lower]) {
      const hex = BRAND_COLORS[lower];
      styles.color = hex;
      styles.borderColor = `${hex}80`;
      styles.backgroundColor = `${hex}18`;
      hasColor = true;
    } else if (lower === 'gradient') {
      styles.backgroundImage = 'linear-gradient(to right, #b026ff, #ff2975, #00f0ff)';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.borderColor = 'rgba(176, 38, 255, 0.6)';
      styles.backgroundColor = 'rgba(176, 38, 255, 0.15)';
      styles.fontWeight = '700';
      isGradient = true;
    } else if (lower === 'bold' || lower === 'b') {
      styles.fontWeight = '700';
    } else if (lower === 'large' || lower === 'lg') {
      styles.fontSize = '1.25em';
    } else if (lower === 'huge' || lower === 'xl') {
      styles.fontSize = '1.5em';
    } else if (lower === 'small' || lower === 'sm') {
      styles.fontSize = '0.85em';
    }
  }

  if (!hasColor && !isGradient) {
    styles.color = '#ffffff';
    styles.borderColor = 'rgba(255, 255, 255, 0.3)';
    styles.backgroundColor = 'rgba(255, 255, 255, 0.08)';
  }

  return styles;
}

function applySpanBaseStyles(span) {
  span.style.display = 'inline-block';
  span.style.padding = '0 5px';
  span.style.borderRadius = '4px';
  span.style.borderWidth = '1px';
  span.style.borderStyle = 'solid';
  span.style.lineHeight = '1.3';
  span.style.verticalAlign = 'baseline';
  span.style.transition = 'all 0.15s ease';
  span.style.cursor = 'pointer';
}

// Convert internal [spec:word] string to clean visual HTML for the editor
function taggedToVisualHtml(text) {
  if (!text) return '';
  const regex = /\[([a-zA-Z0-9#=,\s._-]+):([^\]]+)\]/g;
  return text.replace(regex, (match, spec, content) => {
    const cleanSpec = spec.trim();
    let cleanContent = content;
    // Strip any nested brackets if present from old data
    if (cleanContent.includes('[') || cleanContent.includes(']')) {
      cleanContent = cleanContent.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
    }
    const styles = computeChipStyles(cleanSpec);
    const styleAttr = Object.entries(styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${v}`)
      .join('; ');
    return `<span data-spec="${cleanSpec}" class="visual-word-span" style="${styleAttr}; display: inline-block; padding: 0 5px; border-radius: 4px; border-width: 1px; border-style: solid; line-height: 1.3; vertical-align: baseline; cursor: pointer;">${cleanContent}</span>`;
  }).replace(/\n/g, '<br>');
}

// Convert visual editor DOM back to internal [spec:word] string
function domToTaggedString(node) {
  let result = '';
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'BR') {
        result += '\n';
      } else if (child.hasAttribute('data-spec')) {
        const spec = child.getAttribute('data-spec');
        const text = child.textContent;
        if (text && text.trim()) {
          result += `[${spec}:${text}]`;
        }
      } else if (child.tagName === 'DIV' || child.tagName === 'P') {
        if (result.length > 0 && !result.endsWith('\n')) {
          result += '\n';
        }
        result += domToTaggedString(child);
      } else {
        result += domToTaggedString(child);
      }
    }
  }
  return result;
}

function parseFormattedWords(text) {
  if (!text) return [];
  const regex = /\[([a-zA-Z0-9#=,\s._-]+):([^\]]+)\]/g;
  const list = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const spec = match[1].trim();
    let word = match[2];
    if (word.includes('[') || word.includes(']')) {
      word = word.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
    }
    const styles = computeChipStyles(spec);
    list.push({
      fullTag: match[0],
      spec,
      word,
      color: styles.color || '#fff',
      isBold: styles.fontWeight === '700',
      isGradient: spec.includes('gradient'),
      fontSize: styles.fontSize || 'normal',
    });
  }
  return list;
}

function parseSpecProperties(spec) {
  if (!spec) return { color: null, size: 'normal', isBold: false, isGradient: false };
  const parts = spec.split(',').map((p) => p.trim());
  let color = null;
  let size = 'normal';
  let isBold = false;
  let isGradient = false;

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === 'gradient') {
      isGradient = true;
    } else if (lower === 'bold' || lower === 'b') {
      isBold = true;
    } else if (lower === 'small' || lower === 'sm') {
      size = 'small';
    } else if (lower === 'large' || lower === 'lg') {
      size = 'large';
    } else if (lower === 'huge' || lower === 'xl' || lower === '2xl') {
      size = 'huge';
    } else if (BRAND_COLORS[lower]) {
      color = BRAND_COLORS[lower];
    } else if (lower.startsWith('#') || lower.startsWith('rgb')) {
      color = part;
    }
  }
  return { color, size, isBold, isGradient };
}

function formatFriendlyTags(spec) {
  if (!spec) return [];
  const parts = spec.split(',').map((p) => p.trim());
  const friendly = [];
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === 'gradient') friendly.push('🌈 Gradient');
    else if (lower === 'bold' || lower === 'b') friendly.push('Bold');
    else if (lower === 'small' || lower === 'sm') friendly.push('Small');
    else if (lower === 'large' || lower === 'lg') friendly.push('Large');
    else if (lower === 'huge' || lower === 'xl' || lower === '2xl') friendly.push('Huge');
    else if (lower === 'pink' || part.toLowerCase() === '#ff2975') friendly.push('Pink');
    else if (lower === 'cyan' || part.toLowerCase() === '#00f0ff') friendly.push('Cyan');
    else if (lower === 'gold' || part.toLowerCase() === '#fbbf24') friendly.push('Gold');
    else if (lower === 'purple' || part.toLowerCase() === '#b026ff') friendly.push('Purple');
    else if (lower === 'green' || part.toLowerCase() === '#10b981') friendly.push('Green');
    else if (lower === 'white' || part.toLowerCase() === '#ffffff') friendly.push('White');
    else if (part.startsWith('#')) friendly.push(`Color: ${part}`);
    else friendly.push(part);
  }
  return friendly;
}

function getSpanAtSelection(editor) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);

  let node = sel.anchorNode;
  while (node && node !== editor) {
    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-spec')) {
      return node;
    }
    node = node.parentNode;
  }

  const spans = editor.querySelectorAll('span[data-spec]');
  for (const span of spans) {
    if (range.intersectsNode(span)) {
      return span;
    }
  }
  return null;
}

/**
 * VisualTextEditor
 * - Client sees clean human text styled visually with real colors and sizes (Google Docs / Canva style).
 * - ZERO code brackets [...] or colons (:) are ever shown in the editing area.
 * - Selecting any word immediately activates the toolbar property controls (Color, Size, Bold, Gradient).
 * - Modifying a property visually transforms the word on the spot without showing any markup syntax.
 */
export default function VisualTextEditor({
  label,
  name,
  value = '',
  onChange,
  onFocus,
  placeholder = '',
  isTextarea = false,
  multiline = false,
  rows = 3,
  helperText,
}) {
  const isMulti = isTextarea || multiline;
  const editorRef = useRef(null);
  const lastSerializedRef = useRef('');
  const [customColor, setCustomColor] = useState('#ff2975');
  const [activeProps, setActiveProps] = useState({
    color: null,
    size: 'normal',
    isBold: false,
    isGradient: false,
    hasSpan: false,
    word: '',
  });

  const [showPalettePopover, setShowPalettePopover] = useState(false);
  const [paletteHex, setPaletteHex] = useState('#ff2975');
  const [paletteInputVal, setPaletteInputVal] = useState('');
  const [recentColors, setRecentColors] = useState(() => getRecentColors());
  const paletteContainerRef = useRef(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (paletteContainerRef.current && !paletteContainerRef.current.contains(e.target)) {
        setShowPalettePopover(false);
      }
    };
    if (showPalettePopover) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showPalettePopover]);

  useEffect(() => {
    if (activeProps.color && activeProps.color.startsWith('#')) {
      setPaletteHex(activeProps.color);
      setPaletteInputVal(activeProps.color);
    }
  }, [activeProps.color]);

  const updateActiveSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const span = getSpanAtSelection(editor);
    if (span) {
      const spec = span.getAttribute('data-spec') || '';
      const parsed = parseSpecProperties(spec);
      setActiveProps({
        ...parsed,
        hasSpan: true,
        word: span.textContent,
      });
    } else {
      const sel = window.getSelection();
      const selectedText = sel && sel.rangeCount > 0 ? sel.toString().trim() : '';
      setActiveProps({
        color: null,
        size: 'normal',
        isBold: false,
        isGradient: false,
        hasSpan: false,
        word: selectedText,
      });
    }
  };

  // Synchronize visual DOM when value changes from outside (tabs, initial load, reset)
  useEffect(() => {
    if (editorRef.current) {
      const currentVal = value || '';
      if (currentVal !== lastSerializedRef.current) {
        editorRef.current.innerHTML = taggedToVisualHtml(currentVal);
        lastSerializedRef.current = currentVal;
        updateActiveSelection();
      }
    }
  }, [value]);

  // Keep toolbar controls in sync when selection changes anywhere in this editor
  useEffect(() => {
    const handleDocSelectionChange = () => {
      const editor = editorRef.current;
      if (!editor) return;
      const sel = window.getSelection();
      if (sel && sel.anchorNode && editor.contains(sel.anchorNode)) {
        updateActiveSelection();
      }
    };
    document.addEventListener('selectionchange', handleDocSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleDocSelectionChange);
    };
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    const tagged = domToTaggedString(editorRef.current);
    lastSerializedRef.current = tagged;
    onChange({ target: { name, value: tagged } });
    updateActiveSelection();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const rawText = e.clipboardData.getData('text/plain');
    // If text being pasted contains tags, convert directly to visual spans
    if (rawText.includes('[') && rawText.includes(':')) {
      const html = taggedToVisualHtml(rawText);
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('insertText', false, rawText);
    }
    handleInput();
  };

  const applyStyleToSelection = (property) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const sel = window.getSelection();

    // 1. CLEAR ALL: Instantly remove all formatting from this entire box
    if (property === 'clear-all') {
      const stripped = (value || '').replace(/\[[a-zA-Z0-9#=,\s._-]+:([^\]]+)\]/g, '$1');
      editor.innerHTML = taggedToVisualHtml(stripped);
      lastSerializedRef.current = stripped;
      onChange({ target: { name, value: stripped } });
      updateActiveSelection();
      return;
    }

    let targetSpan = getSpanAtSelection(editor);

    // 2. CLEAR SINGLE WORD
    if (property === 'clear') {
      if (targetSpan) {
        const textNode = document.createTextNode(targetSpan.textContent);
        targetSpan.parentNode.replaceChild(textNode, targetSpan);
        handleInput();
        return;
      }
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const spans = editor.querySelectorAll('span[data-spec]');
        let removed = false;
        spans.forEach((sp) => {
          if (range.intersectsNode(sp)) {
            const textNode = document.createTextNode(sp.textContent);
            sp.parentNode.replaceChild(textNode, sp);
            removed = true;
          }
        });
        if (removed) {
          handleInput();
          return;
        }
      }
      return;
    }

    // 3. MODIFY EXISTING STYLED SPAN
    if (targetSpan) {
      const currentSpec = targetSpan.getAttribute('data-spec') || '';
      let tags = currentSpec.split(',').map((t) => t.trim().toLowerCase());

      if (property === 'clear-color') {
        tags = tags.filter((t) => !isColorSpec(t) && t !== 'gradient');
      } else if (property === 'normal') {
        tags = tags.filter((t) => !isSizeSpec(t));
      } else if (isColorSpec(property) || property === 'gradient') {
        const propLower = property.toLowerCase();
        if (tags.includes(propLower)) {
          // Toggle off if clicking the active color
          tags = tags.filter((t) => t !== propLower);
        } else {
          // Replace previous color or gradient
          tags = tags.filter((t) => !isColorSpec(t) && t !== 'gradient');
          tags.unshift(property);
        }
      } else if (isSizeSpec(property)) {
        const propLower = property.toLowerCase();
        if (tags.includes(propLower)) {
          // Toggle off back to normal
          tags = tags.filter((t) => t !== propLower);
        } else {
          tags = tags.filter((t) => !isSizeSpec(t));
          tags.push(property);
        }
      } else if (property.toLowerCase() === 'bold') {
        if (tags.includes('bold') || tags.includes('b')) {
          tags = tags.filter((t) => t !== 'bold' && t !== 'b');
        } else {
          tags.push('bold');
        }
      }

      if (tags.length === 0) {
        const textNode = document.createTextNode(targetSpan.textContent);
        targetSpan.parentNode.replaceChild(textNode, targetSpan);
      } else {
        const newSpec = tags.join(',');
        targetSpan.setAttribute('data-spec', newSpec);
        const newStyles = computeChipStyles(newSpec);
        targetSpan.removeAttribute('style');
        Object.assign(targetSpan.style, newStyles);
        applySpanBaseStyles(targetSpan);
      }

      handleInput();
      return;
    }

    // 4. APPLY STYLE TO SELECTED WORD (OR EXPAND CURSOR TO SURROUNDING WORD)
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);

      // If no text was highlighted, expand cursor to the current word automatically
      if (range.collapsed) {
        const textNode = range.startContainer;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          const str = textNode.textContent;
          let s = range.startOffset;
          let e = range.startOffset;
          while (s > 0 && !/\s|[.,!?;:()[\]{}"']/.test(str[s - 1])) s--;
          while (e < str.length && !/\s|[.,!?;:()[\]{}"']/.test(str[e])) e++;
          if (e > s) {
            range.setStart(textNode, s);
            range.setEnd(textNode, e);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }

      const selectedText = sel.toString().trim();
      if (selectedText && property !== 'normal' && property !== 'clear' && property !== 'clear-color') {
        const span = document.createElement('span');
        span.setAttribute('data-spec', property);
        span.className = 'visual-word-span';
        const styles = computeChipStyles(property);
        Object.assign(span.style, styles);
        applySpanBaseStyles(span);
        span.textContent = selectedText;

        range.deleteContents();
        range.insertNode(span);

        // Keep selection inside the span so property controls show active state
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);

        handleInput();
      }
    }
  };

  const removeSpecificTag = (fullTag, plainWord) => {
    const newVal = (value || '').replace(fullTag, plainWord);
    lastSerializedRef.current = newVal;
    onChange({ target: { name, value: newVal } });
    if (editorRef.current) {
      editorRef.current.innerHTML = taggedToVisualHtml(newVal);
      updateActiveSelection();
    }
  };

  const selectWordSpan = (targetWord) => {
    const editor = editorRef.current;
    if (!editor) return;
    const spans = editor.querySelectorAll('span[data-spec]');
    for (const span of spans) {
      if (span.textContent === targetWord) {
        const range = document.createRange();
        range.selectNodeContents(span);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        updateActiveSelection();
        span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      }
    }
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const handleApplyPaletteColor = (hex, closePopover = true) => {
    let normalized = hex ? hex.trim() : '';
    if (!normalized) return;
    if (!normalized.startsWith('#')) normalized = '#' + normalized;
    if (/^#([0-9A-Fa-f]{3})$/.test(normalized)) {
      normalized = '#' + normalized[1] + normalized[1] + normalized[2] + normalized[2] + normalized[3] + normalized[3];
    }
    if (!/^#([0-9A-Fa-f]{6})$/.test(normalized)) return;

    saveRecentColor(normalized);
    setRecentColors(getRecentColors());
    setPaletteHex(normalized);
    setPaletteInputVal(normalized);
    restoreSelection();
    applyStyleToSelection(normalized);
    if (closePopover) {
      setShowPalettePopover(false);
    }
  };

  const formattedWords = parseFormattedWords(value);

  return (
    <div className="space-y-1.5">
      {/* Label and Visual Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>

        {/* Visual Formatting Toolbar - Highlights active properties like Google Docs / Canva */}
        <div className="flex flex-wrap items-center gap-1 bg-black/60 border border-white/10 px-2 py-1 rounded-lg text-xs shadow-sm">
          {/* 🌈 Gradient Button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyStyleToSelection('gradient')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-all border active:scale-95 flex items-center gap-1 ${activeProps.isGradient
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white border-white ring-2 ring-neon-purple shadow-md'
                : 'bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 hover:from-neon-purple/50 hover:to-neon-blue/50 text-white border-neon-purple/40'
              }`}
            title={activeProps.isGradient ? "Gradient Active (Click to remove)" : "Make selected word Glowing Neon Gradient"}
          >
            <span>🌈</span> Gradient
          </button>

          {/* ⚡ Quick Color Palette Dots */}
          <div className="flex items-center gap-1 px-1">
            {PALETTE_COLORS.map((c) => {
              const isSelected =
                activeProps.color &&
                (activeProps.color.toLowerCase() === c.color.toLowerCase() ||
                  activeProps.color.toLowerCase() === c.key);
              return (
                <button
                  key={c.color}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyStyleToSelection(isSelected ? 'clear-color' : c.key)}
                  className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all border ${isSelected
                      ? 'scale-125 ring-2 ring-white border-white shadow-lg'
                      : 'border-white/30 hover:scale-125 opacity-85 hover:opacity-100'
                    }`}
                  style={{ backgroundColor: c.color }}
                  title={`${c.label} ${isSelected ? '(Active - click to remove)' : ''}`}
                />
              );
            })}
          </div>

          {/* 🎨 Palette Button with Dropdown Popover */}
          <div className="relative" ref={paletteContainerRef}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                if (!showPalettePopover) {
                  saveCurrentSelection();
                }
              }}
              onClick={() => {
                setShowPalettePopover((prev) => !prev);
                setRecentColors(getRecentColors());
              }}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-all border active:scale-95 flex items-center gap-1 ${showPalettePopover || (activeProps.color && !PALETTE_COLORS.some(c => c.color.toLowerCase() === activeProps.color?.toLowerCase() || c.key === activeProps.color?.toLowerCase()))
                  ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/60 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/15'
                }`}
              title="Open full custom color palette picker"
            >
              <div
                className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: activeProps.color || paletteHex || '#ff2975' }}
              />
              <span className="text-[10px]">Palette ▾</span>
            </button>

            {/* Floating Color Palette Popover */}
            {showPalettePopover && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute z-50 right-0 top-full mt-2 w-[300px] p-3 rounded-2xl bg-slate-950/95 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: paletteHex || '#ff2975' }}
                    />
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>🎨</span> Word Color Palette
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPalettePopover(false)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer px-1"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Custom Spectrum Wheel & Hex Input */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Custom Color
                    </span>
                    <span className="text-[10px] text-slate-500">Wheel or Hex</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      className="w-8 h-8 rounded-lg border border-white/30 cursor-pointer relative overflow-hidden flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                      style={{ backgroundColor: paletteHex }}
                      title="Open color wheel"
                    >
                      <input
                        type="color"
                        value={paletteHex.startsWith('#') && paletteHex.length === 7 ? paletteHex : '#ff2975'}
                        onChange={(e) => {
                          const col = e.target.value;
                          setPaletteHex(col);
                          setPaletteInputVal(col);
                          handleApplyPaletteColor(col, false);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>

                    <div className="flex-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="#HEX code"
                        value={paletteInputVal}
                        onChange={(e) => setPaletteInputVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            let h = paletteInputVal.trim();
                            if (!h.startsWith('#')) h = '#' + h;
                            handleApplyPaletteColor(h, true);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono uppercase focus:border-neon-blue focus:outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          let h = paletteInputVal.trim();
                          if (!h && paletteHex) h = paletteHex;
                          if (h && !h.startsWith('#')) h = '#' + h;
                          handleApplyPaletteColor(h, true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neon-blue hover:bg-neon-blue/80 hover:shadow-[0_0_15px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 text-black font-bold text-xs cursor-pointer transition-all border border-neon-blue shrink-0 shadow-sm select-none"
                        title="Apply color and close"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Recently Used Colors */}
                {recentColors && recentColors.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                      Recent Colors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recentColors.map((hex, i) => (
                        <button
                          key={`${hex}-${i}`}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleApplyPaletteColor(hex, true)}
                          className={`w-6 h-6 rounded-md border transition-all cursor-pointer hover:scale-110 shadow-sm ${activeProps.color?.toLowerCase() === hex.toLowerCase()
                              ? 'border-white ring-2 ring-white scale-110'
                              : 'border-white/20 hover:border-white/50'
                            }`}
                          style={{ backgroundColor: hex }}
                          title={`Apply ${hex}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Curated Designer Brand Palettes */}
                <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                  {CURATED_PALETTES.map((palette) => (
                    <div key={palette.name} className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {palette.name}
                      </span>
                      <div className="grid grid-cols-6 gap-1">
                        {palette.colors.map((c) => {
                          const isCurSelected = activeProps.color?.toLowerCase() === c.hex.toLowerCase();
                          return (
                            <button
                              key={c.hex}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleApplyPaletteColor(c.hex, true)}
                              className={`h-6 rounded border transition-all cursor-pointer hover:scale-110 shadow-sm ${isCurSelected
                                  ? 'border-white ring-2 ring-white scale-110'
                                  : 'border-white/20 hover:border-white/50'
                                }`}
                              style={{ backgroundColor: c.hex }}
                              title={`${c.label} (${c.hex})`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Clear Color Option */}
                {activeProps.color && (
                  <div className="pt-2 border-t border-white/10 flex justify-end">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        applyStyleToSelection('clear-color');
                        setShowPalettePopover(false);
                      }}
                      className="text-xs text-rose-300 hover:text-rose-100 cursor-pointer"
                    >
                      ✕ Remove Color from Word
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <span className="w-px h-3.5 bg-white/20 mx-0.5" />

          {/* 𝗕 Bold Button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyStyleToSelection('bold')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors border active:scale-95 ${activeProps.isBold
                ? 'bg-neon-purple/40 text-neon-blue border-neon-purple/60 ring-1 ring-neon-purple/60 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            title={activeProps.isBold ? "Bold Active (Click to remove)" : "Make selected word Bold"}
          >
            𝗕
          </button>

          {/* 📏 Size Dropdown - Displays active size of selected word */}
          <div className="relative inline-flex items-center">
            <select
              value={activeProps.size || 'normal'}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                applyStyleToSelection(e.target.value);
              }}
              className={`bg-black/90 text-[10px] rounded px-1.5 py-0.5 border cursor-pointer focus:outline-none appearance-none pr-4 font-medium transition-colors ${activeProps.size && activeProps.size !== 'normal'
                  ? 'border-neon-purple/60 text-neon-blue ring-1 ring-neon-purple/40 font-semibold'
                  : 'border-white/15 text-slate-300'
                }`}
              title="Change font size of selected word"
            >
              <option value="normal" className="bg-slate-900 text-white">Size: Normal</option>
              <option value="small" className="bg-slate-900 text-white">Size: Small (0.85x)</option>
              <option value="large" className="bg-slate-900 text-white">Size: Large (1.25x)</option>
              <option value="huge" className="bg-slate-900 text-white">Size: Huge (1.5x)</option>
            </select>
            <span className="absolute right-1 text-[8px] pointer-events-none text-slate-400">▾</span>
          </div>

          <span className="w-px h-3.5 bg-white/20 mx-0.5" />

          {/* ✕ Clear Word Style */}
          {activeProps.hasSpan && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyleToSelection('clear')}
              className="px-1.5 py-0.5 rounded text-[10px] text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 cursor-pointer transition-colors border border-rose-500/30"
              title="Remove styling from this word"
            >
              ✕ Clear Word
            </button>
          )}

          {/* 🧹 Clear All in this box */}
          {formattedWords.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyleToSelection('clear-all')}
              className="px-1.5 py-0.5 rounded text-[10px] text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 cursor-pointer transition-colors"
              title="Remove all formatting from this box"
            >
              🧹 Clear All
            </button>
          )}
        </div>
      </div>

      {/* Visual WYSIWYG Editing Box: ZERO code brackets, real colors & sizes! */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={onFocus}
          onKeyUp={updateActiveSelection}
          onMouseUp={updateActiveSelection}
          onKeyDown={(e) => {
            if (!isMulti && e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className={`w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors text-sm leading-relaxed ${isMulti ? 'min-h-[85px] whitespace-pre-wrap' : 'min-h-[42px] overflow-x-auto whitespace-nowrap'
            }`}
          style={{ wordBreak: 'break-word' }}
        />
        {!value && placeholder && (
          <div className="absolute top-2.5 left-4 text-slate-500 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Active Formatted Words: Human-readable badges with 1-click select & remove (NO code brackets!) */}
      {formattedWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
            Formatted Words:
          </span>
          {formattedWords.map((item, idx) => (
            <div
              key={`${item.spec}-${idx}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
            >
              <button
                type="button"
                onClick={() => selectWordSpan(item.word)}
                className="font-medium cursor-pointer text-left flex items-center gap-1.5 hover:underline"
                title={`Click to select "${item.word}" in editor`}
              >
                <span
                  style={{
                    color: item.color,
                    fontWeight: item.isBold ? 'bold' : 'normal',
                  }}
                >
                  {item.word}
                </span>
                <span className="flex items-center gap-1">
                  {formatFriendlyTags(item.spec).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-slate-300 font-sans border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </button>

              <button
                type="button"
                onClick={() => removeSpecificTag(item.fullTag, item.word)}
                className="text-slate-400 hover:text-rose-300 text-xs cursor-pointer ml-1 transition-colors px-1 py-0.5 rounded hover:bg-rose-500/20"
                title={`Remove formatting from "${item.word}"`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
