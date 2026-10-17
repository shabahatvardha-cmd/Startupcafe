import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, MapPin, ZoomIn, ZoomOut, Navigation, Check, Loader2, Sparkles, Sun, Moon } from 'lucide-react';

// Preset notable hubs for instant jumping
const QUICK_HUBS = [
  { name: 'Gorakhpur Hub', query: 'Vijay Chowk, Gorakhpur, Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  { name: 'Mumbai BKC', query: 'Startup Cafe, Parinee Crescenzo, Bandra East, Mumbai, Maharashtra', lat: 19.0657, lng: 72.8687 },
];

export default function InteractiveMapPicker({
  initialLat = 26.7606,
  initialLng = 83.3732,
  initialAddress = '',
  height = '360px',
  onSelectLocation,
  compact = false,
  showApplyButton = true,
  applyButtonLabel = 'Apply Selected Location',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState(initialAddress || 'Vijay Chowk, Gorakhpur, Uttar Pradesh');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [applied, setApplied] = useState(false);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' | 'natural'

  // Helper to load Leaflet dynamically if not already on window
  const ensureLeaflet = useCallback(() => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.L) {
        return resolve(window.L);
      }
      const existingScript = document.querySelector('script[src*="leaflet.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.L));
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    });
  }, []);

  // Reverse geocode lat/lng into human address using OpenStreetMap Nominatim
  const fetchAddressFromCoords = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const readable =
          data.display_name ||
          `${data.address?.suburb || data.address?.road || ''}, ${data.address?.city || data.address?.town || ''}, ${data.address?.state || ''}`.replace(/^,\s*|,\s*$/g, '') ||
          `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(readable);
        return readable;
      }
    } catch (err) {
      console.warn('Reverse geocode fallback:', err);
    } finally {
      setIsGeocoding(false);
    }
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setAddress(fallback);
    return fallback;
  };

  // Move marker and center map smoothly
  const updateMapPosition = (lat, lng, newAddress, zoom = 16) => {
    setCoords({ lat, lng });
    if (newAddress) setAddress(newAddress);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    ensureLeaflet().then((L) => {
      if (isCancelled || !mapContainerRef.current || mapInstanceRef.current) return;

      try {
        const startLat = coords.lat || 26.7606;
        const startLng = coords.lng || 83.3732;

        const map = L.map(mapContainerRef.current, {
          center: [startLat, startLng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
        });

        // 100% Free OpenStreetMap Tiles (Official, zero API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
          className: 'osm-cyberpunk-tile',
        }).addTo(map);

        // Custom Neon Pin Marker Icon
        const neonIcon = L.divIcon({
          className: 'neon-map-pin-container',
          html: `
            <div style="position: relative; width: 34px; height: 34px; transform: translate(-50%, -100%); cursor: grab;">
              <div style="
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #00f0ff 0%, #b026ff 100%);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 0 16px rgba(0,240,255,0.8), 0 0 30px rgba(176,38,255,0.6);
                border: 2px solid #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 9px;
                  height: 9px;
                  background: #ffffff;
                  border-radius: 50%;
                  transform: rotate(45deg);
                  box-shadow: 0 0 6px #ffffff;
                "></div>
              </div>
              <div style="
                width: 12px;
                height: 5px;
                background: rgba(0,240,255,0.4);
                border-radius: 50%;
                margin: 2px auto 0;
                filter: blur(1.5px);
              "></div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        const marker = L.marker([startLat, startLng], {
          icon: neonIcon,
          draggable: true,
        }).addTo(map);

        // Drag marker to fine-tune location
        marker.on('dragend', async (e) => {
          const pos = e.target.getLatLng();
          setCoords({ lat: pos.lat, lng: pos.lng });
          await fetchAddressFromCoords(pos.lat, pos.lng);
        });

        // Click anywhere on map to drop / move pin
        map.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setCoords({ lat, lng });
          await fetchAddressFromCoords(lat, lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setMapLoaded(true);

        // Trigger map recalculation once layout stabilizes
        setTimeout(() => map.invalidateSize(), 300);
      } catch (e) {
        console.error('Error mounting Leaflet map:', e);
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [ensureLeaflet]);

  // Debounced search handler for location input
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
        if (results.length > 0) {
          const first = results[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);
          updateMapPosition(newLat, newLng, first.display_name, 16);
        }
      }
    } catch (err) {
      console.warn('Place search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    updateMapPosition(newLat, newLng, result.display_name, 17);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleQuickHub = (hub) => {
    updateMapPosition(hub.lat, hub.lng, hub.query, 16);
  };

  const handleConfirm = () => {
    const embedUrl = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    const googleMapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;

    onSelectLocation?.({
      lat: coords.lat,
      lng: coords.lng,
      address,
      embedUrl,
      googleMapsUrl,
    });

    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-3 w-full text-slate-200">
      {/* Top Search & Controls Bar */}
      <div className="relative z-20">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-neon-blue transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any place, landmark, city (e.g. Connaught Place, BKC, Vijay Chowk)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
            Search
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 max-h-56 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-3.5 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-start gap-2.5 cursor-pointer"
              >
                <MapPin size={14} className="text-neon-pink shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick City Presets */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles size={11} className="text-neon-blue" />
            Quick Presets:
          </span>
          {QUICK_HUBS.map((hub, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickHub(hub)}
              className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {hub.name}
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Style for OpenStreetMap Tiles (100% Free, No API Key) */}
      <style>{`
        .osm-theme-dark .osm-cyberpunk-tile {
          filter: invert(90%) hue-rotate(180deg) brightness(88%) contrast(120%) !important;
        }
        .osm-theme-natural .osm-cyberpunk-tile {
          filter: none !important;
        }
      `}</style>

      {/* Map Interactive Canvas */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black/70 shadow-2xl group ${
          mapTheme === 'dark' ? 'osm-theme-dark' : 'osm-theme-natural'
        }`}
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Controls (Theme Toggle + Zoom) */}
        <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setMapTheme((t) => (t === 'dark' ? 'natural' : 'dark'))}
            className="w-8 h-8 rounded-lg bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center hover:text-neon-pink transition-all cursor-pointer"
            title={mapTheme === 'dark' ? 'Switch to Natural Map' : 'Switch to Cyberpunk Dark Map'}
          >
            {mapTheme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-cyan-400" />}
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-lg bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center hover:text-neon-blue transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-lg bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center hover:text-neon-blue transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
        </div>

        {/* Bottom Helper Instruction Badge */}
        <div className="absolute left-3 bottom-3 z-[400] pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] text-slate-300 font-medium flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block"></span>
            Click map or drag the neon pin to select exact spot
          </span>
        </div>
      </div>

      {/* Selected Location Details Card */}
      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="p-2 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg border border-neon-blue/30 shrink-0 mt-0.5">
            <MapPin size={15} className="text-neon-blue" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-neon-blue">
                Selected Location
              </span>
              {isGeocoding && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> detecting address...
                </span>
              )}
            </div>
            <p className="text-xs text-white font-medium truncate mt-0.5" title={address}>
              {address}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </p>
          </div>
        </div>

        {/* Confirm / Apply Action Button */}
        {showApplyButton && (
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
              applied
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-white'
            }`}
          >
            {applied ? (
              <>
                <Check size={14} /> Location Applied!
              </>
            ) : (
              <>
                <Check size={14} /> {applyButtonLabel}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
