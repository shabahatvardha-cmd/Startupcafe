import { useNavigate } from 'react-router-dom';
import { Pencil, ArrowUpRight } from 'lucide-react';

/**
 * Isolated floating Edit badge for authenticated administrators.
 * Deep links directly to the specific section or item in the Admin Panel.
 */
export default function AdminEditBadge({
  tab,
  title,
  itemId,
  field,
  position = 'top-right',
  className = '',
}) {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const queryParams = new URLSearchParams();
    if (tab) queryParams.set('tab', tab);
    if (itemId) queryParams.set('item', itemId);
    if (field) queryParams.set('field', field);

    navigate(`/admin?${queryParams.toString()}`);
  };

  // Position utilities with isolated coordinates
  const positionClasses = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
  }[position] || 'top-5 right-5';

  return (
    <div
      className={`absolute ${positionClasses} z-30 pointer-events-auto select-none transition-all duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={handleEditClick}
        title={`Edit ${title || 'Section'} in Admin Panel`}
        className="group/badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-neon-purple/60 hover:border-neon-purple text-white text-xs font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(176,38,255,0.7)] backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ring-1 ring-white/10"
      >
        <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shrink-0" />
        <Pencil size={12} className="text-neon-purple group-hover/badge:rotate-12 transition-transform shrink-0" />
        <span className="tracking-wide">
          Edit {title ? <span className="text-purple-200 font-bold">{title}</span> : 'Section'}
        </span>
        <ArrowUpRight size={12} className="text-slate-400 group-hover/badge:text-white transition-colors shrink-0" />
      </button>
    </div>
  );
}
