import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Download,
  Search,
  Clock,
  Coins,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import WhatsAppIcon from '../../layout/WhatsAppIcon';

export default function FranchiseLeadsTab({ inquiries = [], onClear, onDeleteSingle }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInquiries = inquiries.filter((item) => {
    const term = searchTerm.toLowerCase();
    const name = (item.fullName || item.name || '').toLowerCase();
    const city = (item.city || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const budget = (item.budget || '').toLowerCase();
    return (
      name.includes(term) ||
      city.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      budget.includes(term)
    );
  });

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['Full Name', 'Phone', 'Email', 'City', 'Budget', 'Message', 'Timestamp'];
    const rows = inquiries.map((i) => [
      `"${(i.fullName || i.name || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.city || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.timestamp || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `franchise_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 size={18} className="text-neon-blue" />
              Franchise Partner Applications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and contact entrepreneurs who applied through the Franchise page inquiry form.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {inquiries.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Export all applications to a CSV file"
                >
                  <Download size={13} className="text-neon-blue" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Clear all saved franchise applications"
                >
                  <Trash2 size={13} />
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Applicants</p>
            <p className="text-xl font-bold text-white mt-0.5">{inquiries.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Unique Cities</p>
            <p className="text-xl font-bold text-neon-blue mt-0.5">
              {new Set(inquiries.map((i) => (i.city || '').split(',')[0].trim()).filter(Boolean)).size}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Latest Lead</p>
            <p className="text-xs font-medium text-slate-300 mt-1 truncate">
              {inquiries[0]?.fullName || inquiries[0]?.name || (inquiries.length === 0 ? 'None yet' : 'Anonymous')}
            </p>
          </div>
        </div>

        {/* Search Input */}
        {inquiries.length > 0 && (
          <div className="relative pt-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-0.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by applicant name, city, phone, email, or budget..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-neon-blue focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Leads List */}
      {inquiries.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue mx-auto flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <h4 className="text-sm font-bold text-white">No Franchise Inquiries Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            When potential franchise partners fill out the application form on the franchise page, their full contact details and budget will show up here instantly.
          </p>
          <a
            href="/franchise#inquiry-form"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all mt-2"
          >
            Open Franchise Page Form
            <ExternalLink size={12} />
          </a>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs text-slate-400">
          No inquiries matched "{searchTerm}".
        </div>
      ) : (
        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
          {filteredInquiries.map((item, idx) => {
            const applicantName = item.fullName || item.name || 'Anonymous Applicant';
            const cleanPhone = String(item.phone || '').replace(/\D/g, '');
            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waMsg = `Hello ${applicantName}, thank you for your interest in partnering with Startup Cafe! I am reaching out to discuss your franchise application.`;

            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                      {applicantName.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {applicantName}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} className="text-slate-500" />
                        {item.timestamp || 'Recent Application'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.budget && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1">
                        <Coins size={11} />
                        {item.budget}
                      </span>
                    )}
                    {onDeleteSingle && (
                      <button
                        type="button"
                        onClick={() => onDeleteSingle(item.id || idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete this lead"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.city && (
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin size={13} className="text-neon-pink shrink-0 mt-0.5" />
                      <span className="truncate">{item.city}</span>
                    </div>
                  )}

                  {item.email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail size={13} className="text-neon-purple shrink-0" />
                      <a href={`mailto:${item.email}`} className="truncate hover:text-white transition-colors">
                        {item.email}
                      </a>
                    </div>
                  )}

                  {item.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone size={13} className="text-neon-blue shrink-0" />
                      <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                        +91 {cleanPhone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Message if present */}
                {item.message && (
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-300 space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                      <MessageSquare size={10} />
                      Applicant Notes
                    </p>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </div>
                )}

                {/* Quick 1-Click Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  {item.phone && (
                    <>
                      <a
                        href={`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <WhatsAppIcon size={13} />
                        WhatsApp Lead
                      </a>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone size={12} className="text-neon-blue" />
                        Call
                      </a>
                    </>
                  )}

                  {item.email && (
                    <a
                      href={`mailto:${item.email}?subject=Startup Cafe Franchise Inquiry Response`}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail size={12} className="text-neon-purple" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
