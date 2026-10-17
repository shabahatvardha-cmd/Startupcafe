import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../../../config';
import {
  Database,
  HardDrive,
  RefreshCw,
  Search,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function BookingsTab({ bookings = [], onClear }) {
  const [backendBookings, setBackendBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null); // true | false | null
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL'); // 'ALL' | 'DB' | 'LOCAL'
  const [localList, setLocalList] = useState(bookings);

  // Sync prop changes
  useEffect(() => {
    setLocalList(bookings);
  }, [bookings]);

  // Fetch bookings from MongoDB backend (smooth non-blocking)
  const fetchBackendBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/book`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        setBackendBookings(data);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendBookings();
  }, []);

  // Merge backend and local bookings smoothly (remove duplicates by matching phone + date + plan)
  const allBookings = useMemo(() => {
    const list = [];
    const seenKeys = new Set();

    // Backend bookings (MongoDB)
    backendBookings.forEach((b) => {
      const key = `${b.phone}-${b.date}-${b.plan}`;
      seenKeys.add(key);
      list.push({
        id: b._id || b.id,
        name: b.name || 'N/A',
        email: b.email || 'N/A',
        phone: b.phone || 'N/A',
        plan: b.plan || 'N/A',
        duration: b.duration || 'N/A',
        date: b.date || 'N/A',
        people: b.people || 1,
        location: b.location || 'N/A',
        message: b.message || '',
        timestamp: b.createdAt ? new Date(b.createdAt).toLocaleString() : 'Recent',
        source: 'MongoDB Database',
        isBackend: true,
      });
    });

    // Local Storage bookings
    localList.forEach((b) => {
      const key = `${b.phone}-${b.date}-${b.plan}`;
      if (!seenKeys.has(key)) {
        list.push({
          id: b.id || `local-${Math.random()}`,
          name: b.name || 'N/A',
          email: b.email || 'N/A',
          phone: b.phone || 'N/A',
          plan: b.plan || 'N/A',
          duration: b.duration || 'N/A',
          date: b.date || 'N/A',
          people: b.people || 1,
          location: b.location || 'N/A',
          message: b.message || '',
          timestamp: b.timestamp || 'Local Cache',
          source: 'Browser Local Storage',
          isBackend: false,
        });
      }
    });

    return list;
  }, [backendBookings, localList]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (filterSource === 'DB' && !b.isBackend) return false;
      if (filterSource === 'LOCAL' && b.isBackend) return false;
      if (filterPlan !== 'ALL' && !b.plan.toLowerCase().includes(filterPlan.toLowerCase())) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesPhone = b.phone.toLowerCase().includes(q);
        const matchesEmail = b.email.toLowerCase().includes(q);
        const matchesLocation = b.location.toLowerCase().includes(q);
        const matchesPlan = b.plan.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesLocation && !matchesPlan) {
          return false;
        }
      }

      return true;
    });
  }, [allBookings, filterSource, filterPlan, searchTerm]);

  // Delete single booking (handles backend delete if Mongo ID)
  const handleDeleteSingle = async (booking) => {
    if (!window.confirm(`Delete booking for "${booking.name}"?`)) return;

    if (booking.isBackend && booking.id) {
      try {
        await fetch(`${API_BASE_URL}/api/book/${booking.id}`, { method: 'DELETE' });
        setBackendBookings((prev) => prev.filter((b) => (b._id || b.id) !== booking.id));
      } catch (err) {
        console.error('Failed to delete on backend:', err);
      }
    }

    // Also remove from local storage if present
    try {
      const stored = JSON.parse(localStorage.getItem('startupcafe_local_bookings') || '[]');
      const updated = stored.filter((b) => b.id !== booking.id && b.phone !== booking.phone);
      localStorage.setItem('startupcafe_local_bookings', JSON.stringify(updated));
      setLocalList(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all local browser cached bookings?')) return;
    onClear?.();
    setLocalList([]);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Status bar */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Booking Inquiries Management</h3>
            {backendOnline === true && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Live ({backendBookings.length})
              </span>
            )}
            {backendOnline === false && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Browser Storage Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time bookings recorded from the website contact &amp; reservation form.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchBackendBookings}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:border-neon-blue/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Refresh bookings from backend"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin text-neon-blue' : ''} />
            <span>Sync</span>
          </button>

          {localList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Clear Cache</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, email, or area..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none cursor-pointer [&>option]:bg-[#121212]"
          >
            <option value="ALL">All Sources ({allBookings.length})</option>
            <option value="DB">MongoDB Live ({backendBookings.length})</option>
            <option value="LOCAL">Local Cache ({localList.length})</option>
          </select>
        </div>
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-white/10 bg-white/[0.01] space-y-2">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-1 stroke-1" />
          <h4 className="text-sm font-semibold text-white">No Bookings Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No bookings matched your search query. Try clearing the search box.'
              : 'Submit the booking form on the main website or test it directly in the Contact & Location tab!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredBookings.map((b, idx) => (
            <div
              key={b.id || idx}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-neon-blue/30 transition-all space-y-2.5 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-white">{b.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neon-blue/15 text-neon-blue border border-neon-blue/30">
                    {b.plan}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-white/5 border border-white/10">
                    {b.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border ${
                      b.isBackend
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {b.isBackend ? <Database size={10} /> : <HardDrive size={10} />}
                    {b.source}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSingle(b)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete this record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone size={12} className="text-neon-blue shrink-0" />
                  <a href={`tel:${b.phone}`} className="hover:text-white truncate font-mono">
                    {b.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail size={12} className="text-neon-purple shrink-0" />
                  <a href={`mailto:${b.email}`} className="hover:text-white truncate">
                    {b.email}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar size={12} className="text-neon-pink shrink-0" />
                  <span className="truncate">{b.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Users size={12} className="text-amber-400 shrink-0" />
                  <span>{b.people} Pax</span>
                </div>
              </div>

              {/* Location & Message */}
              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <div className="flex items-start gap-1.5">
                  <MapPin size={12} className="text-neon-pink shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium">{b.location}</span>
                </div>
                {b.message && b.message !== 'N/A' && (
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-400 italic">
                    "{b.message}"
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Received: {b.timestamp}</span>
                <a
                  href={`https://wa.me/${(b.phone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    b.name
                  )}!%20Thank%20you%20for%20your%20Startup%20Cafe%20booking%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  Contact on WhatsApp →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
