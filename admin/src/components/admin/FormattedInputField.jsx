import { useRef, useState, useEffect } from 'react';
import { renderFormattedText } from '../../utils/textFormatter';

const BRAND_COLORS = {
  gold: '#fbbf24',
  cyan: '#00f0ff',
  pink: '#ff2975',
  purple: '#b026ff',
  blue: '#3b82f6',
  green: '#10b981',
  white: '#ffffff',
};

const COLOR_TAGS = ['gold', 'cyan', 'pink', 'gradient', 'purple', 'blue', 'green', 'white'];
const isColor = (t) => COLOR_TAGS.includes(t.toLowerCase()) || t.startsWith('#') || t.startsWith('rgb');
const isSize = (t) => ['small', 'sm', 'large', 'lg', 'huge', 'xl', '2xl'].includes(t.toLowerCase());

function computeChipStyle(spec) {
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
      const col = BRAND_COLORS[lower];
      styles.color = col;
      styles.borderColor = `${col}80`;
      styles.backgroundColor = `${col}18`;
      hasColor = true;
    } else if (lower === 'gradient') {
      styles.backgroundImage = 'linear-gradient(to right, #b026ff, #ff2975, #00f0ff)';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.borderColor = 'rgba(176, 38, 255, 0.6)';
      styles.backgroundColor = 'rgba(176, 38, 255, 0.15)';
      isGradient = true;
    } else if (lower === 'bold' || lower === 'b') {
      styles.fontWeight = '700';
    } else if (lower === 'large' || lower === 'lg') {
      styles.fontSize = '1.2em';
    } else if (lower === 'huge' || lower === 'xl') {
      styles.fontSize = '1.4em';
    } else if (lower === 'small' || lower === 'sm') {
      styles.fontSize = '0.85em';
    }
  }

  if (!hasColor && !isGradient) {
    styles.borderColor = 'rgba(255, 255, 255, 0.3)';
    styles.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    styles.color = '#ffffff';
  }

  return styles;
}

function taggedToHtml(text) {
  if (!text) return '';
  const regex = /\[([a-zA-Z0-9#=,\s._-]+):([^\]]+)\]/g;
  return text.replace(regex, (match, spec, content) => {
    const cleanSpec = spec.trim();
    const cleanContent = content;
    const styles = computeChipStyle(cleanSpec);
    const styleAttr = Object.entries(styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${v}`)
      .join('; ');
    return `<span data-spec="${cleanSpec}" class="admin-styled-chip" style="${styleAttr}; display: inline-block; padding: 0 4px; border-radius: 4px; border-width: 1px; border-style: solid; line-height: 1.3; vertical-align: baseline;">${cleanContent}</span>`;
  }).replace(/\n/g, '<br>');
}

function domToTagged(node) {
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
        if (text) {
          result += `[${spec}:${text}]`;
        }
      } else if (child.tagName === 'DIV' || child.tagName === 'P') {
        if (result.length > 0 && !result.endsWith('\n')) {
          result += '\n';
        }
        result += domToTagged(child);
      } else {
        result += domToTagged(child);
      }
    }
  }
  return result;
}

function parseFormattedChips(text) {
  if (!text) return [];
  const regex = /\[([a-zA-Z0-9#=,\s._-]+):([^\]]+)\]/g;
  const list = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const spec = match[1].trim();
    const word = match[2];
    const styles = computeChipStyle(spec);
    list.push({
      fullTag: match[0],
      spec,
      word,
      color: styles.color || '#fff',
      fontSize: styles.fontSize || 'normal',
      isBold: styles.fontWeight === '700',
      isGradient: spec.includes('gradient'),
    });
  }
  return list;
}

/**
 * Clean Visual Formatted Input Field
 * - In Visual Mode: Words are shown with colors/styles directly in the editor, NO messy brackets!
 * - Formatted Words strip below gives 1-click removal of any styled word.
 * - Toggle button allows switching between "Visual (Clean)" and "Raw Tags" if desired.
 */
export default function FormattedInputField({
  label,
  name,
  value = '',
  onChange,
  onFocus,
  placeholder = '',
  isTextarea = false,
  rows = 3,
  helperText,
}) {
  const editorRef = useRef(null);
  const rawInputRef = useRef(null);
  const isTypingRef = useRef(false);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'raw'
  const [customColor, setCustomColor] = useState('#00f0ff');

  // Synchronize contentEditable with value when not typing
  useEffect(() => {
    if (viewMode === 'visual' && editorRef.current) {
      if (!isTypingRef.current) {
        const currentTagged = domToTagged(editorRef.current);
        if (currentTagged !== value) {
          editorRef.current.innerHTML = taggedToHtml(value);
        }
      }
      isTypingRef.current = false;
    }
  }, [value, viewMode]);

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    isTypingRef.current = true;
    const tagged = domToTagged(editorRef.current);
    onChange({ target: { name, value: tagged } });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const applyTagToVisualEditor = (tag) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const sel = window.getSelection();

    // 1. CLEAR ALL
    if (tag === 'clear-all') {
      const stripped = (value || '').replace(/\[[a-zA-Z0-9#=,\s._-]+:([^\]]+)\]/g, '$1');
      onChange({ target: { name, value: stripped } });
      if (editor) editor.innerHTML = taggedToHtml(stripped);
      return;
    }

    let targetSpan = null;

    // Check if cursor/selection is inside an existing styled span
    if (sel.rangeCount > 0) {
      let node = sel.anchorNode;
      while (node && node !== editor) {
        if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-spec')) {
          targetSpan = node;
          break;
        }
        node = node.parentNode;
      }
    }

    // 2. CLEAR SINGLE WORD
    if (tag === 'clear') {
      if (targetSpan) {
        const textNode = document.createTextNode(targetSpan.textContent);
        targetSpan.parentNode.replaceChild(textNode, targetSpan);
        handleEditorInput();
        return;
      }
      if (sel.rangeCount > 0) {
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
          handleEditorInput();
          return;
        }
      }
      return;
    }

    // 3. IF ALREADY INSIDE STYLED SPAN: Update its spec
    if (targetSpan) {
      const currentSpec = targetSpan.getAttribute('data-spec') || '';
      let tags = currentSpec.split(',').map((t) => t.trim().toLowerCase());

      if (isColor(tag)) {
        if (tags.includes(tag.toLowerCase())) {
          tags = tags.filter((t) => t !== tag.toLowerCase());
        } else {
          tags = tags.filter((t) => !isColor(t));
          tags.unshift(tag);
        }
      } else if (isSize(tag)) {
        if (tags.includes(tag.toLowerCase())) {
          tags = tags.filter((t) => t !== tag.toLowerCase());
        } else {
          tags = tags.filter((t) => !isSize(t));
          tags.push(tag);
        }
      } else {
        const lower = tag.toLowerCase();
        if (tags.includes(lower)) {
          tags = tags.filter((t) => t !== lower);
        } else {
          tags.push(lower);
        }
      }

      if (tags.length === 0) {
        const textNode = document.createTextNode(targetSpan.textContent);
        targetSpan.parentNode.replaceChild(textNode, targetSpan);
      } else {
        const newSpec = tags.join(',');
        targetSpan.setAttribute('data-spec', newSpec);
        const newStyles = computeChipStyle(newSpec);
        Object.assign(targetSpan.style, newStyles);
      }

      handleEditorInput();
      return;
    }

    // 4. NEW SELECTION OR EXPAND TO WORD
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);

      // If collapsed, expand to surrounding word
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
      if (selectedText) {
        const span = document.createElement('span');
        span.setAttribute('data-spec', tag);
        span.className = 'admin-styled-chip';
        const styles = computeChipStyle(tag);
        Object.assign(span.style, styles);
        span.style.display = 'inline-block';
        span.style.padding = '0 4px';
        span.style.borderRadius = '4px';
        span.style.borderWidth = '1px';
        span.style.borderStyle = 'solid';
        span.style.lineHeight = '1.3';
        span.style.verticalAlign = 'baseline';
        span.textContent = selectedText;

        range.deleteContents();
        range.insertNode(span);
        sel.removeAllRanges();

        handleEditorInput();
      }
    }
  };

  const handleApplyTag = (tag) => {
    if (viewMode === 'visual') {
      applyTagToVisualEditor(tag);
    } else {
      // Raw mode tag insertion
      const input = rawInputRef.current;
      if (!input) return;
      const val = value || '';
      let start = input.selectionStart ?? 0;
      let end = input.selectionEnd ?? 0;

      if (tag === 'clear-all') {
        const stripped = val.replace(/\[[a-zA-Z0-9#=,\s._-]+:([^\]]+)\]/g, '$1');
        onChange({ target: { name, value: stripped } });
        return;
      }

      let selectedText = val.slice(start, end).trim() || 'Word';
      const replacement = `[${tag}:${selectedText}]`;
      const newVal = val.slice(0, start) + replacement + val.slice(end);
      onChange({ target: { name, value: newVal } });
    }
  };

  const removeSpecificTag = (fullTag, plainWord) => {
    const newVal = (value || '').replace(fullTag, plainWord);
    onChange({ target: { name, value: newVal } });
    if (editorRef.current && viewMode === 'visual') {
      editorRef.current.innerHTML = taggedToHtml(newVal);
    }
  };

  const styledChips = parseFormattedChips(value);
  const hasFormatting = styledChips.length > 0;

  return (
    <div className="space-y-1.5">
      {/* Header with Label, View Mode Switch, and Mini Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
          {/* Mode Switch Toggle: Visual vs Raw */}
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'visual' ? 'raw' : 'visual'))}
            className={`text-[10px] px-2 py-0.5 rounded cursor-pointer border transition-all ${
              viewMode === 'visual'
                ? 'bg-neon-purple/20 text-purple-200 border-neon-purple/40 hover:bg-neon-purple/30'
                : 'bg-white/10 text-slate-300 border-white/20 hover:text-white'
            }`}
            title="Switch between Clean Visual Editor and Raw Tags"
          >
            {viewMode === 'visual' ? '✨ Visual (Clean)' : '📝 Raw Tags'}
          </button>
        </div>

        {/* Embedded Mini Styling Toolbar */}
        <div className="flex flex-wrap items-center gap-1 bg-black/60 border border-white/10 px-2 py-1 rounded-lg text-xs shadow-sm">
          {/* 🌈 Gradient */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyTag('gradient')}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gradient-to-r from-neon-purple/40 to-neon-blue/40 hover:from-neon-purple/60 hover:to-neon-blue/60 text-white cursor-pointer transition-all border border-neon-purple/40 active:scale-95"
            title="Highlight word with Glowing Neon Gradient"
          >
            🌈 Gradient
          </button>

          {/* ⚡ Quick Color Palette */}
          <div className="flex items-center gap-1 px-1">
            {[
              { label: 'Cyan', color: '#00f0ff' },
              { label: 'Gold', color: '#fbbf24' },
              { label: 'Pink', color: '#ff2975' },
              { label: 'Purple', color: '#b026ff' },
              { label: 'Green', color: '#10b981' },
              { label: 'White', color: '#ffffff' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleApplyTag(c.color)}
                className="w-3.5 h-3.5 rounded-full border border-white/30 hover:scale-125 transition-transform cursor-pointer shadow-sm active:scale-90"
                style={{ backgroundColor: c.color }}
                title={`Color selected word ${c.label}`}
              />
            ))}
          </div>

          {/* 🎨 Custom Color Wheel */}
          <label
            onMouseDown={(e) => e.preventDefault()}
            className="w-4 h-4 rounded-full border border-white/40 cursor-pointer relative overflow-hidden flex items-center justify-center shrink-0 active:scale-90"
            title="Pick custom color from color wheel"
            style={{ backgroundColor: customColor }}
          >
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                const newCol = e.target.value;
                setCustomColor(newCol);
                handleApplyTag(newCol);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          <span className="w-px h-3.5 bg-white/20 mx-0.5" />

          {/* 𝗕 Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyTag('bold')}
            className="px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors active:scale-95"
            title="Make word bold"
          >
            𝗕
          </button>

          {/* 📏 Size Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                if (e.target.value) {
                  handleApplyTag(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-black/80 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-white/15 cursor-pointer focus:outline-none appearance-none pr-4 font-medium"
              title="Change word size"
            >
              <option value="" disabled>Size ▾</option>
              <option value="small" className="bg-slate-900 text-white">Small</option>
              <option value="large" className="bg-slate-900 text-white">Large</option>
              <option value="huge" className="bg-slate-900 text-white">Huge</option>
            </select>
            <span className="absolute right-1 text-[8px] pointer-events-none text-slate-400">▾</span>
          </div>

          <span className="w-px h-3.5 bg-white/20 mx-0.5" />

          {/* ✕ Clear word style */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyTag('clear')}
            className="px-1.5 py-0.5 rounded text-[10px] text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 cursor-pointer transition-colors"
            title="Remove style from selected word"
          >
            ✕ Word
          </button>

          {/* 🧹 Clear All */}
          {hasFormatting && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleApplyTag('clear-all')}
              className="px-1.5 py-0.5 rounded text-[10px] text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 cursor-pointer transition-colors"
              title="Remove all formatting tags from this box"
            >
              🧹 All
            </button>
          )}
        </div>
      </div>

      {/* Editing Area: Visual Mode (No messy brackets!) vs Raw Mode */}
      {viewMode === 'visual' ? (
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onPaste={handlePaste}
            onFocus={onFocus}
            onKeyDown={(e) => {
              if (!isTextarea && e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors text-sm leading-relaxed ${
              isTextarea ? 'min-h-[85px] whitespace-pre-wrap' : 'min-h-[42px] overflow-x-auto whitespace-nowrap'
            }`}
            style={{ wordBreak: 'break-word' }}
          />
          {!value && placeholder && (
            <div className="absolute top-2.5 left-4 text-slate-500 text-sm pointer-events-none select-none">
              {placeholder}
            </div>
          )}
        </div>
      ) : (
        <>
          {isTextarea ? (
            <textarea
              ref={rawInputRef}
              rows={rows}
              name={name}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors text-sm resize-none font-mono"
            />
          ) : (
            <input
              ref={rawInputRef}
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors text-sm font-mono"
            />
          )}
        </>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Active Formatted Words Pills Strip: 1-click removal of any styled word */}
      {hasFormatting && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Formatted Words:
          </span>
          {styledChips.map((chip, idx) => (
            <span
              key={`${chip.spec}-${idx}`}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border border-white/15 bg-black/40 text-slate-200"
            >
              <span
                style={{
                  color: chip.color,
                  fontWeight: chip.isBold ? 'bold' : 'normal',
                }}
              >
                {chip.word}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {chip.isGradient ? '🌈 Gradient' : chip.spec}
              </span>
              <button
                type="button"
                onClick={() => removeSpecificTag(chip.fullTag, chip.word)}
                className="text-rose-400 hover:text-rose-200 text-xs cursor-pointer ml-0.5"
                title={`Remove style from "${chip.word}"`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Instant Live Preview Strip directly underneath */}
      {hasFormatting && (
        <div className="mt-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <span>👁</span> Preview:
          </span>
          <div className="text-slate-200 text-xs font-medium leading-relaxed truncate">
            {renderFormattedText(value)}
          </div>
        </div>
      )}
    </div>
  );
}
