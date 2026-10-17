import React from 'react';

/**
 * Renders text with support for inline word-level styling tags:
 * - Colors: [#00f0ff:Word], [gold:Word], [cyan:Word], [pink:Word], [purple:Word], [green:Word]
 * - Effects: [gradient:Word], [accent:Word]
 * - Formatting: [bold:Word] or [b:Word], [italic:Word] or [i:Word], [large:Word]
 * - Combinations: [gold,bold:Word], [cyan,large:Word], [gradient,bold:Word]
 * - Preserves line breaks (\n) as <br />
 */
export function renderFormattedText(text, fallbackStyle = {}) {
  if (!text || typeof text !== 'string') return text;

  const hasFormatting = text.includes('[') && text.includes(']') && text.includes(':');
  const hasLineBreaks = text.includes('\n');

  if (!hasFormatting && !hasLineBreaks) {
    return text;
  }

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const regex = /\[([a-zA-Z0-9#=,\s._-]+):([^\]]+)\]/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        elements.push(line.slice(lastIndex, matchIndex));
      }

      const spec = match[1].trim();
      let content = match[2];
      if (content.includes('[') || content.includes(']')) {
        content = content.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
      }
      if (!content) {
        lastIndex = regex.lastIndex;
        continue;
      }
      const key = `fmt-${lineIdx}-${matchIndex}`;

      let inlineStyle = { ...fallbackStyle };
      let classNames = [];

      // Support comma-separated tags, e.g. [gold,bold:Word]
      const parts = spec.split(',').map((p) => p.trim());
      const BRAND_COLORS = {
        gold: '#fbbf24',
        cyan: '#00f0ff',
        pink: '#ff2975',
        purple: '#b026ff',
        blue: '#3b82f6',
        green: '#10b981',
        white: '#ffffff',
      };

      for (const part of parts) {
        const lower = part.toLowerCase();
        if (part.startsWith('#') || part.startsWith('rgb')) {
          inlineStyle.color = part;
        } else if (part.startsWith('color=')) {
          inlineStyle.color = part.replace('color=', '').trim();
        } else if (lower === 'gradient') {
          classNames.push('text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue font-bold');
        } else if (lower === 'accent') {
          inlineStyle.color = 'var(--color-neon-purple, #b026ff)';
        } else if (lower === 'bold' || lower === 'b') {
          inlineStyle.fontWeight = '700';
        } else if (lower === 'italic' || lower === 'i') {
          inlineStyle.fontStyle = 'italic';
        } else if (lower === 'underline' || lower === 'u') {
          inlineStyle.textDecoration = 'underline';
        } else if (lower === 'large' || lower === 'lg') {
          inlineStyle.fontSize = '1.25em';
        } else if (lower === 'huge' || lower === 'xl' || lower === '2xl') {
          inlineStyle.fontSize = '1.6em';
        } else if (lower === 'small' || lower === 'sm') {
          inlineStyle.fontSize = '0.85em';
        } else if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(lower)) {
          inlineStyle.fontSize = lower;
        } else if (lower.startsWith('size=')) {
          inlineStyle.fontSize = lower.replace('size=', '').trim();
        } else if (BRAND_COLORS[lower]) {
          inlineStyle.color = BRAND_COLORS[lower];
        } else {
          // Direct named color (emerald, red, etc.) or CSS values
          inlineStyle.color = part;
        }
      }

      elements.push(
        <span key={key} style={inlineStyle} className={classNames.join(' ')}>
          {content}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(line.slice(lastIndex));
    }

    return (
      <React.Fragment key={`line-${lineIdx}`}>
        {elements}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default renderFormattedText;
