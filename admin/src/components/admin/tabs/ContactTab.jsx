import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { renderFormattedText } from '../../../utils/textFormatter';
import WhatsAppIcon from '../../layout/WhatsAppIcon';
import { API_BASE_URL } from '../../../config';
import {
  DEFAULT_FORM_FIELDS_CONFIG,
  DEFAULT_OFFICE_LOCATIONS,
} from '../../../context/SettingsContext';
import InteractiveMapPicker from '../../common/InteractiveMapPicker';
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  Map,
  ClipboardList,
  Sparkles,
  Eye,
  Check,
  RotateCcw,
  Info,
  Maximize2,
  Moon,
  Sun,
  Database,
  CheckCircle2,
  RefreshCw,
  Zap,
  ChevronDown,
  Plus,
  Trash2,
  Sliders,
  Palette,
  EyeOff,
} from 'lucide-react';

// Default embeds
const DEFAULT_MAP_EMBED_GORAKHPUR =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.08277259169!2d83.303977598466!3d26.7634863378516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991446a0c332489%3A0x1ff3f97fdcc6b711!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714080123512!5m2!1sen!2sin';

const MUMBAI_MAP_PRESET =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.789124449836!2d72.8633390758414!3d19.07297925206979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e9b81b2123%3A0x2db4283c4bc5b1a0!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714080999999!5m2!1sen!2sin';

const SAMPLE_LOCATIONS = [
  // Official Main Hubs
  "Startup Cafe – Gorakhpur Hub (Vijay Chowk, Gorakhpur)",
  "Startup Cafe – Mumbai Office (Parinee Crescenzo, BKC, Mumbai)",

  // Mumbai & Navi Mumbai, Maharashtra
  "Nariman Point, Mumbai, Maharashtra",
  "Bandra Kurla Complex (BKC), Mumbai, Maharashtra",
  "Lower Parel, Mumbai, Maharashtra",
  "Worli, Mumbai, Maharashtra",
  "Colaba, Mumbai, Maharashtra",
  "Fort, Mumbai, Maharashtra",
  "Andheri East, Mumbai, Maharashtra",
  "Powai, Mumbai, Maharashtra",
  "Malad West (Mindspace), Mumbai, Maharashtra",
  "Vashi (Navi Mumbai), Maharashtra",
  "Zaveri Bazar, Mumbai, Maharashtra",
  "Crawford Market, Mumbai, Maharashtra",
  "Dharavi (Leather & Small Scale), Mumbai, Maharashtra",
  "Saki Naka, Mumbai, Maharashtra",
  "Kalamboli (Steel Market), Navi Mumbai, Maharashtra",

  // Gorakhpur, Uttar Pradesh
  "Baxipur, Gorakhpur, Uttar Pradesh",
  "Golghar, Gorakhpur, Uttar Pradesh",
  "Mohaddipur, Gorakhpur, Uttar Pradesh",
  "Asuran Chowk, Gorakhpur, Uttar Pradesh",
  "Vijay Chowk, Gorakhpur, Uttar Pradesh",
  "Taramandal, Gorakhpur, Uttar Pradesh",
  "Betiahata, Gorakhpur, Uttar Pradesh",
  "Medical College Road, Gorakhpur, Uttar Pradesh",
  "Sahabganj, Gorakhpur, Uttar Pradesh",
  "Transport Nagar, Gorakhpur, Uttar Pradesh",
  "GIDA, Sahjanwa, Gorakhpur, Uttar Pradesh",

  // Hyderabad, Telangana
  "Begum Bazar, Hyderabad, Telangana",
  "HITEC City, Hyderabad, Telangana",
  "Gachibowli, Hyderabad, Telangana",
  "Madhapur, Hyderabad, Telangana",
  "Financial District, Hyderabad, Telangana",
  "Banjara Hills, Hyderabad, Telangana",
  "Jubilee Hills, Hyderabad, Telangana",
  "Abids, Hyderabad, Telangana",
  "Ameerpet, Hyderabad, Telangana",
  "Laad Bazar, Hyderabad, Telangana",
  "Koti, Hyderabad, Telangana",
  "Patancheru, Hyderabad, Telangana",
  "Jeedimetla, Hyderabad, Telangana",
  "Cherlapally, Hyderabad, Telangana"
];

// Helper to extract clean URL from raw URL or full pasted <iframe> code
const extractMapSrc = (input) => {
  if (!input) return DEFAULT_MAP_EMBED_GORAKHPUR;
  const trimmed = input.trim();
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) return iframeMatch[1];
  return trimmed;
};

export default function ContactTab({ current, onChange, onFocus, setFormData }) {
  const [subTab, setSubTab] = useState('form'); // 'form' | 'map' | 'backend' | 'headers' | 'preview'
  const [mapInputMode, setMapInputMode] = useState('picker'); // 'picker' | 'manual'
  const [showEmbedGuide, setShowEmbedGuide] = useState(false);
  const [previewMode, setPreviewMode] = useState('form'); // 'form' | 'success'
  const [backendHealth, setBackendHealth] = useState(null); // 'online' | 'offline' | 'checking'
  const [backendPingResult, setBackendPingResult] = useState('');

  // Interactive Form Test State (Live replica inside admin panel)
  const [testForm, setTestForm] = useState({
    name: 'Rohan Singh',
    email: 'rohan@example.com',
    phone: '9876543210',
    planType: 'Dedicated Desk – ₹6999/month',
    duration: 'Monthly',
    date: new Date().toISOString().split('T')[0],
    people: '1',
    location: 'Startup Cafe – Gorakhpur Hub (Vijay Chowk, Gorakhpur)',
    message: 'Window view preferred for team.',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const [testSubmitNotice, setTestSubmitNotice] = useState('');

  // ==========================================
  // Dynamic Form Fields & Style Configuration
  // ==========================================
  const formConfig = {
    ...DEFAULT_FORM_FIELDS_CONFIG,
    ...(current.contactFormFieldsConfig || {}),
  };

  const updateFormConfig = (fieldKey, value) => {
    setFormData?.((prev) => ({
      ...prev,
      contactFormFieldsConfig: {
        ...DEFAULT_FORM_FIELDS_CONFIG,
        ...(prev.contactFormFieldsConfig || {}),
        [fieldKey]: value,
      },
    }));
  };

  const resetFormConfig = () => {
    if (window.confirm('Reset all form fields, visibility toggles, and styles to default?')) {
      setFormData?.((prev) => ({
        ...prev,
        contactFormFieldsConfig: DEFAULT_FORM_FIELDS_CONFIG,
      }));
    }
  };

  const getFormGlowClass = (glow) => {
    switch (glow) {
      case 'blue':
        return 'border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]';
      case 'purple':
        return 'border-purple-500/40 shadow-[0_0_30px_rgba(176,38,255,0.2)]';
      case 'pink':
        return 'border-pink-500/40 shadow-[0_0_30px_rgba(255,41,117,0.2)]';
      default:
        return 'border-white/10';
    }
  };

  const getButtonGradientClass = (grad) => {
    switch (grad) {
      case 'pink-purple':
        return 'bg-gradient-to-r from-neon-pink to-neon-purple hover:shadow-[0_0_20px_rgba(255,41,117,0.4)]';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]';
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]';
      default:
        return 'bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]';
    }
  };

  // ==========================================
  // Dynamic Map & Office Locations Configuration
  // ==========================================
  const mapEmbedUrl = current.mapEmbedUrl || DEFAULT_MAP_EMBED_GORAKHPUR;
  const cleanMapUrl = extractMapSrc(mapEmbedUrl);
  const mapHeight = current.mapHeight || '400px';
  const mapFilterPreset =
    current.mapFilterPreset || (current.mapDarkModeFilter === false ? 'natural' : 'cyberpunk');
  const mapRadius = current.mapRadius || 'rounded-2xl';
  const mapBorderGlow = current.mapBorderGlow || 'none';

  const getMapFilter = () => {
    if (mapFilterPreset === 'natural' || current.mapDarkModeFilter === false) return 'none';
    if (mapFilterPreset === 'grayscale') return 'grayscale(100%) invert(90%)';
    if (mapFilterPreset === 'midnight') return 'invert(95%) hue-rotate(200deg) brightness(85%) contrast(120%)';
    if (mapFilterPreset === 'muted') return 'sepia(40%) contrast(110%) brightness(90%)';
    return 'invert(90%) hue-rotate(180deg)';
  };

  const getMapGlowClass = (glow) => {
    switch (glow) {
      case 'blue':
        return 'border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.25)]';
      case 'purple':
        return 'border-purple-500/40 shadow-[0_0_25px_rgba(176,38,255,0.25)]';
      case 'pink':
        return 'border-pink-500/40 shadow-[0_0_25px_rgba(255,41,117,0.25)]';
      default:
        return 'border-white/10';
    }
  };

  // Office locations array (backward compatible with office1/office2)
  const officesList =
    Array.isArray(current.contactOfficesList) && current.contactOfficesList.length > 0
      ? current.contactOfficesList
      : [
        {
          id: 'office-1',
          title: current.contactOffice1Title || 'Mumbai Office',
          address:
            current.contactOffice1Address ||
            'Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051',
          iconType: 'Building2',
          color: 'text-neon-blue',
          visible: true,
        },
        {
          id: 'office-2',
          title: current.contactOffice2Title || 'Gorakhpur Hub',
          address:
            current.contactOffice2Address ||
            '2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, Uttar Pradesh - 273001',
          iconType: 'MapPin',
          color: 'text-neon-pink',
          visible: true,
        },
      ];

  const updateOfficesList = (newList) => {
    setFormData?.((prev) => {
      const updateObj = {
        ...prev,
        contactOfficesList: newList,
      };
      if (newList[0]) {
        updateObj.contactOffice1Title = newList[0].title;
        updateObj.contactOffice1Address = newList[0].address;
      }
      if (newList[1]) {
        updateObj.contactOffice2Title = newList[1].title;
        updateObj.contactOffice2Address = newList[1].address;
      }
      return updateObj;
    });
  };

  const updateOfficeItem = (index, field, value) => {
    const updated = [...officesList];
    updated[index] = { ...updated[index], [field]: value };
    updateOfficesList(updated);
  };

  const toggleOfficeVisibility = (index) => {
    const updated = [...officesList];
    const isVis = updated[index].visible !== false;
    updated[index] = { ...updated[index], visible: !isVis };
    updateOfficesList(updated);
  };

  const handleAddOffice = () => {
    const newOffice = {
      id: `office-${Date.now()}`,
      title: `Office Hub ${officesList.length + 1}`,
      address: 'Suite #101, Business Center, City - PIN',
      iconType: officesList.length % 2 === 0 ? 'Building2' : 'MapPin',
      color: officesList.length % 2 === 0 ? 'text-neon-blue' : 'text-neon-pink',
      visible: true,
    };
    updateOfficesList([...officesList, newOffice]);
  };

  const handleDeleteOffice = (index) => {
    if (officesList.length <= 1) {
      alert('You must keep at least one office hub.');
      return;
    }
    if (window.confirm(`Delete office "${officesList[index]?.title || 'Hub'}"?`)) {
      const updated = officesList.filter((_, i) => i !== index);
      updateOfficesList(updated);
    }
  };

  const resetOfficesToDefault = () => {
    if (window.confirm('Reset office hubs to original defaults (Mumbai & Gorakhpur)?')) {
      updateOfficesList(DEFAULT_OFFICE_LOCATIONS);
    }
  };

  // Contact details & Button texts
  const contactPhone = current.contactPhone !== undefined ? current.contactPhone : '+91 96701 11167';
  const contactEmail = current.contactEmail !== undefined ? current.contactEmail : 'startupcafegkp@gmail.com';
  const contactWhatsappNumber =
    current.contactWhatsappNumber !== undefined ? current.contactWhatsappNumber : '919670111167';

  const formSubmitText =
    current.contactFormSubmitText !== undefined ? current.contactFormSubmitText : 'Confirm Booking';
  const formWhatsappCtaText =
    current.contactFormWhatsappCtaText !== undefined
      ? current.contactFormWhatsappCtaText
      : 'Quick Inquiry via WhatsApp';
  const whatsappInquiryMessage =
    current.contactWhatsappInquiryMessage !== undefined
      ? current.contactWhatsappInquiryMessage
      : "Hello Startup Cafe! I'm reaching out from your website to make an inquiry.";

  const successTitle = current.contactSuccessTitle !== undefined ? current.contactSuccessTitle : 'Request Received!';
  const successMessage =
    current.contactSuccessMessage !== undefined
      ? current.contactSuccessMessage
      : 'Our team will review your booking and contact you shortly to confirm.';
  const successNotice =
    current.contactSuccessNotice !== undefined
      ? current.contactSuccessNotice
      : 'For immediate assistance, feel free to reach out via WhatsApp.';
  const successWhatsappButtonText =
    current.contactSuccessWhatsappButtonText !== undefined
      ? current.contactSuccessWhatsappButtonText
      : 'WhatsApp Now';
  const successWhatsappMessage =
    current.contactSuccessWhatsappMessage !== undefined
      ? current.contactSuccessWhatsappMessage
      : 'Hello Startup Cafe! I have just submitted a booking request on your website and would like to follow up on it.';

  // Check backend health
  const checkBackendHealth = async () => {
    setBackendHealth('checking');
    setBackendPingResult('Pinging API endpoint...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        setBackendHealth('online');
        setBackendPingResult('✅ Backend API is reachable and responding OK');
      } else {
        setBackendHealth('offline');
        setBackendPingResult('⚠️ Server responded with HTTP status ' + res.status);
      }
    } catch {
      setBackendHealth('offline');
      setBackendPingResult('🟡 Backend offline / unreachable. Graceful local storage active.');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Compute test form total price
  const calculateTestPrice = () => {
    const match = testForm.planType.match(/₹(\d+)/);
    const base = match ? parseInt(match[1], 10) : 6999;
    const people = testForm.planType.includes('Private Cabin') ? 1 : parseInt(testForm.people) || 1;
    return base * people;
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setIsTestSubmitting(true);
    setTestSubmitNotice('');

    const payload = {
      name: testForm.name || 'Test User',
      email: testForm.email || 'test@example.com',
      phone: testForm.phone || '9876543210',
      plan: testForm.planType,
      duration: testForm.duration,
      date: testForm.date,
      people: Number(testForm.people) || 1,
      location: testForm.location,
      message: testForm.message,
    };

    let backendOk = false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) backendOk = true;
    } catch {
      backendOk = false;
    }

    // Always backup to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('startupcafe_local_bookings') || '[]');
      stored.unshift({
        ...payload,
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('startupcafe_local_bookings', JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    setIsTestSubmitting(false);
    setPreviewMode('success');
    setTestSubmitNotice(
      backendOk
        ? '✓ Test booking successfully saved to MongoDB & Local Cache!'
        : '✓ Test booking saved to Local Cache (Backend offline fallback worked smoothly)!'
    );
  };

  const hubOptions = [
    ...(Array.isArray(officesList) && officesList.length > 0
      ? officesList.filter((o) => o.visible !== false).map((o) => `${o.title} — ${o.address}`)
      : []),
    ...SAMPLE_LOCATIONS
  ].filter((loc, idx, self) => self.indexOf(loc) === idx);

  const handleLocationKeyDown = (e) => {
    if (!showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlightedIndex(0);
      return;
    }

    if (showSuggestions && hubOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < hubOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : hubOptions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < hubOptions.length) {
          setTestForm((p) => ({ ...p, location: hubOptions[highlightedIndex] }));
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10">
        <button
          type="button"
          onClick={() => setSubTab('form')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'form'
            ? 'bg-neon-purple/20 text-white border-neon-purple/50 shadow-sm shadow-neon-purple/20'
            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <ClipboardList size={15} className={subTab === 'form' ? 'text-neon-purple' : ''} />
          <span>Form Fields &amp; Styles</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('map')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'map'
            ? 'bg-neon-blue/20 text-white border-neon-blue/50 shadow-sm shadow-neon-blue/20'
            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <MapPin size={15} className={subTab === 'map' ? 'text-neon-blue' : ''} />
          <span>Map &amp; Office Hubs</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('backend')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'backend'
            ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Database size={15} className={subTab === 'backend' ? 'text-amber-400' : ''} />
          <span>Backend &amp; Data Sync</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('headers')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'headers'
            ? 'bg-neon-pink/20 text-white border-neon-pink/50 shadow-sm shadow-neon-pink/20'
            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Sparkles size={15} className={subTab === 'headers' ? 'text-neon-pink' : ''} />
          <span>Section Headings</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('preview')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'preview'
            ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-sm shadow-emerald-500/20'
            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Eye size={15} className={subTab === 'preview' ? 'text-emerald-400' : ''} />
          <span>Full 2-Col View</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: FORM FIELDS, VISUAL STYLES & AUTHENTIC REPLICA                  */}
      {/* ========================================================================= */}
      {subTab === 'form' && (
        <div className="space-y-6">
          {/* Header & Mode Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList size={16} className="text-neon-purple" />
                Live Form Replica (Matches Website 1:1)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Realtime preview reacting to field visibility, custom labels, border radius, and glow.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setPreviewMode('form')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${previewMode === 'form'
                  ? 'bg-neon-purple/25 text-white border border-neon-purple/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                📝 Form Input View
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('success')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${previewMode === 'success'
                  ? 'bg-green-500/25 text-green-300 border border-green-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                ✅ Success Screen View
              </button>
            </div>
          </div>

          {testSubmitNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>{testSubmitNotice}</span>
              <button
                type="button"
                onClick={() => setTestSubmitNotice('')}
                className="text-emerald-400 hover:text-white font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Authentic Form Card (Looking exactly like Contact.jsx) */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`glass-card p-6 sm:p-10 ${formConfig.formCardRadius || 'rounded-3xl'
                } border ${getFormGlowClass(formConfig.formCardGlow)} relative overflow-hidden shadow-2xl transition-all`}
            >
              {previewMode === 'success' ? (
                /* Success Screen State */
                <div className="h-full flex flex-col items-center justify-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {renderFormattedText(successTitle)}
                  </h3>
                  <p className="text-slate-300 text-base mb-8 max-w-md mx-auto leading-relaxed">
                    {renderFormattedText(successMessage)} <br />
                    <span className="text-slate-400 text-sm mt-4 block italic">
                      {renderFormattedText(successNotice)}
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <a
                      href={`https://wa.me/${(contactWhatsappNumber || '919670111167').replace(
                        /\D/g,
                        ''
                      )}?text=${encodeURIComponent(successWhatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white transition-all shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)] text-sm"
                    >
                      <WhatsAppIcon size={18} />
                      {renderFormattedText(successWhatsappButtonText)}
                    </a>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('form')}
                      className="flex-1 py-3.5 rounded-xl font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all text-sm cursor-pointer"
                    >
                      New Booking
                    </button>
                  </div>
                </div>
              ) : (
                /* Actual Form Input Fields Reacting to Admin Toggles */
                <form className="space-y-5" onSubmit={handleTestSubmit}>
                  {/* Selected Plan notice */}
                  <div className="p-3.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5">Sample Selection Notice:</p>
                    <p className="text-sm font-bold text-white">
                      {testForm.planType} — {testForm.duration === 'Daily' ? 'Daily Access' : 'Monthly Dedicated'}
                    </p>
                  </div>

                  {/* Row 1: Name & Email */}
                  {(formConfig.showNameField !== false || formConfig.showEmailField !== false) && (
                    <div
                      className={`grid grid-cols-1 ${formConfig.showNameField !== false && formConfig.showEmailField !== false
                        ? 'md:grid-cols-2'
                        : ''
                        } gap-6 mt-2`}
                    >
                      {formConfig.showNameField !== false && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.nameLabel || 'Full Name')}
                          </label>
                          <input
                            required
                            type="text"
                            value={testForm.name}
                            onChange={(e) => setTestForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                            placeholder={formConfig.namePlaceholder || 'Rohan Singh'}
                          />
                        </div>
                      )}
                      {formConfig.showEmailField !== false && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.emailLabel || 'Email Address')}
                          </label>
                          <input
                            required
                            type="email"
                            value={testForm.email}
                            onChange={(e) => setTestForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                            placeholder={formConfig.emailPlaceholder || 'rohan@example.com'}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 2: Phone & Plan Type */}
                  {(formConfig.showPhoneField !== false || formConfig.showPlanField !== false) && (
                    <div
                      className={`grid grid-cols-1 ${formConfig.showPhoneField !== false && formConfig.showPlanField !== false
                        ? 'md:grid-cols-2'
                        : ''
                        } gap-6`}
                    >
                      {formConfig.showPhoneField !== false && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.phoneLabel || 'Phone Number')}
                          </label>
                          <input
                            required
                            type="tel"
                            value={testForm.phone}
                            onChange={(e) =>
                              setTestForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm font-mono"
                            placeholder={formConfig.phonePlaceholder || '98765 43210'}
                          />
                        </div>
                      )}
                      {formConfig.showPlanField !== false && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.planLabel || 'Plan Type')}
                          </label>
                          <div className="relative">
                            <select
                              value={testForm.planType}
                              onChange={(e) => setTestForm((p) => ({ ...p, planType: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all appearance-none [&>option]:bg-[#1a1a1a] cursor-pointer text-sm"
                            >
                              <option value="Day Pass – ₹499/day">Day Pass – ₹499/day</option>
                              <option value="Conference Room – ₹999/hr">Conference Room – ₹999/hr</option>
                              <option value="Private Cabin (Daily) – ₹999/hr">Private Cabin (Daily) – ₹999/hr</option>
                              <option value="Dedicated Desk – ₹6999/month">Dedicated Desk – ₹6999/month</option>
                              <option value="Private Cabin (Monthly) – ₹29999/month">
                                Private Cabin (Monthly) – ₹29999/month
                              </option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                              <ChevronDown size={16} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 3: Duration, Date, People */}
                  {(formConfig.showDurationSwitch !== false ||
                    formConfig.showDateField !== false ||
                    formConfig.showPeopleField !== false) && (
                      <div
                        className={`grid grid-cols-1 ${(formConfig.showDurationSwitch !== false ? 1 : 0) +
                          (formConfig.showDateField !== false ? 1 : 0) +
                          (formConfig.showPeopleField !== false ? 1 : 0) ===
                          3
                          ? 'lg:grid-cols-3'
                          : (formConfig.showDurationSwitch !== false ? 1 : 0) +
                            (formConfig.showDateField !== false ? 1 : 0) +
                            (formConfig.showPeopleField !== false ? 1 : 0) ===
                            2
                            ? 'md:grid-cols-2'
                            : ''
                          } gap-6`}
                      >
                        {formConfig.showDurationSwitch !== false && (
                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                              {renderFormattedText(formConfig.durationLabel || 'Duration')}
                            </label>
                            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 relative min-h-[46px]">
                              <button
                                type="button"
                                onClick={() => setTestForm((p) => ({ ...p, duration: 'Daily' }))}
                                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all relative z-10 cursor-pointer ${testForm.duration === 'Daily' ? 'text-white' : 'text-slate-500'
                                  }`}
                              >
                                Daily
                              </button>
                              <button
                                type="button"
                                onClick={() => setTestForm((p) => ({ ...p, duration: 'Monthly' }))}
                                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all relative z-10 cursor-pointer ${testForm.duration === 'Monthly' ? 'text-white' : 'text-slate-500'
                                  }`}
                              >
                                Monthly
                              </button>
                              <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg transition-transform duration-300 ${testForm.duration === 'Monthly' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'
                                  }`}
                              />
                            </div>
                          </div>
                        )}

                        {formConfig.showDateField !== false && (
                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                              {renderFormattedText(formConfig.dateLabel || 'Start Date')}
                            </label>
                            <input
                              required
                              type="date"
                              value={testForm.date}
                              onChange={(e) => setTestForm((p) => ({ ...p, date: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-all [color-scheme:dark] text-sm"
                            />
                          </div>
                        )}

                        {formConfig.showPeopleField !== false && (
                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                              {renderFormattedText(formConfig.peopleLabel || 'People')}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={testForm.people}
                              onChange={(e) => setTestForm((p) => ({ ...p, people: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}

                  {/* Row 4: Location Search & Message */}
                  {(formConfig.showLocationField !== false || formConfig.showMessageField !== false) && (
                    <div
                      className={`grid grid-cols-1 ${formConfig.showLocationField !== false && formConfig.showMessageField !== false
                        ? 'lg:grid-cols-2'
                        : ''
                        } gap-6`}
                    >
                      {formConfig.showLocationField !== false && (
                        <div className="space-y-1.5 relative">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.locationLabel || 'Location')}
                          </label>
                          <div className="relative group">
                            <input
                              required
                              type="text"
                              value={testForm.location}
                              onChange={(e) => {
                                setTestForm((p) => ({ ...p, location: e.target.value }));
                                setShowSuggestions(true);
                                setHighlightedIndex(-1);
                              }}
                              onFocus={() => {
                                setShowSuggestions(true);
                                const foundIdx = hubOptions.findIndex(h => h === testForm.location);
                                setHighlightedIndex(foundIdx >= 0 ? foundIdx : -1);
                              }}
                              onBlur={() => setTimeout(() => { setShowSuggestions(false); setHighlightedIndex(-1); }, 250)}
                              onKeyDown={handleLocationKeyDown}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                              placeholder={
                                formConfig.locationPlaceholder || 'Select hub (Gorakhpur Hub, Mumbai Office)'
                              }
                            />
                            <MapPin
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-blue transition-colors pointer-events-none"
                              size={18}
                            />
                          </div>

                          {showSuggestions && hubOptions.length > 0 && (
                            <div className="absolute z-50 left-0 right-0 top-full mt-2 glass-card border border-white/15 rounded-xl overflow-hidden shadow-2xl bg-black/95 max-h-[220px] overflow-y-auto">
                              {hubOptions.map((loc, i) => {
                                const isHighlighted = highlightedIndex === i;
                                const isSelected = testForm.location === loc;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setTestForm((p) => ({ ...p, location: loc }));
                                      setShowSuggestions(false);
                                      setHighlightedIndex(-1);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(i)}
                                    className={`w-full text-left px-3.5 py-2.5 text-xs transition-all border-b border-white/5 last:border-0 flex items-center justify-between gap-2 cursor-pointer ${isHighlighted
                                        ? 'bg-neon-blue/25 text-white font-semibold'
                                        : isSelected
                                          ? 'bg-white/10 text-white font-medium'
                                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <MapPin
                                        size={12}
                                        className={
                                          isHighlighted || isSelected
                                            ? 'text-neon-blue shrink-0'
                                            : 'text-neon-pink shrink-0'
                                        }
                                      />
                                      <span className="truncate">{loc}</span>
                                    </div>
                                    {isHighlighted && (
                                      <span className="text-[10px] text-neon-blue font-mono uppercase shrink-0 bg-neon-blue/15 px-2 py-0.5 rounded border border-neon-blue/30">
                                        ↵ Enter
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {formConfig.showMessageField !== false && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(formConfig.messageLabel || 'Message (Optional)')}
                          </label>
                          <textarea
                            rows={1}
                            value={testForm.message}
                            onChange={(e) => setTestForm((p) => ({ ...p, message: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all resize-none text-sm"
                            placeholder={formConfig.messagePlaceholder || 'Special requirements?'}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Amount & Price Breakdown */}
                  {formConfig.showPriceBreakdown !== false && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-0.5">
                          Total Amount
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          ₹{calculateTestPrice().toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-0.5">
                          Breakdown
                        </p>
                        <p className="text-xs text-slate-400">
                          {testForm.planType} x {testForm.people}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isTestSubmitting}
                    className={`w-full py-4 rounded-xl font-bold ${getButtonGradientClass(
                      formConfig.buttonGradient
                    )} text-white transition-all cursor-pointer text-sm`}
                  >
                    {isTestSubmitting ? 'Sending Booking...' : renderFormattedText(formSubmitText)}
                  </button>

                  {/* WhatsApp Quick CTA Button */}
                  {formConfig.showWhatsappButton !== false && (
                    <a
                      href={`https://wa.me/${(contactWhatsappNumber || '919670111167').replace(
                        /\D/g,
                        ''
                      )}?text=${encodeURIComponent(whatsappInquiryMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm"
                    >
                      <WhatsAppIcon size={18} />
                      {renderFormattedText(formWhatsappCtaText)}
                    </a>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: FORM VISUAL STYLING & ACCENTS                                  */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Palette size={14} className="text-neon-purple" />
              Form Card Style &amp; Appearance (Radius, Glow &amp; Button Gradient)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Corner Radius */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Card Corner Radius</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Medium', val: 'rounded-xl' },
                    { label: 'Large', val: 'rounded-2xl' },
                    { label: 'Extra (Default)', val: 'rounded-3xl' },
                  ].map((rad) => (
                    <button
                      key={rad.val}
                      type="button"
                      onClick={() => updateFormConfig('formCardRadius', rad.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${formConfig.formCardRadius === rad.val
                        ? 'bg-neon-purple/20 text-white border-neon-purple/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {rad.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Border Glow */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Card Border Glow</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'None', val: 'none' },
                    { label: 'Cyan', val: 'blue' },
                    { label: 'Purple', val: 'purple' },
                    { label: 'Pink', val: 'pink' },
                  ].map((glow) => (
                    <button
                      key={glow.val}
                      type="button"
                      onClick={() => updateFormConfig('formCardGlow', glow.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${formConfig.formCardGlow === glow.val
                        ? 'bg-neon-purple/20 text-white border-neon-purple/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {glow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Gradient Style */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Submit Button Theme</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Cyan/Purple', val: 'default' },
                    { label: 'Pink/Purple', val: 'pink-purple' },
                    { label: 'Emerald', val: 'emerald' },
                    { label: 'Amber', val: 'amber' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => updateFormConfig('buttonGradient', btn.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${formConfig.buttonGradient === btn.val
                        ? 'bg-neon-blue/20 text-white border-neon-blue/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: FORM FIELDS MANAGER (TOGGLE / HIDE / DELETE / CUSTOMIZE)       */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sliders size={14} className="text-neon-blue" />
                  Form Fields Manager (Add, Hide or Delete Any Field)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Toggle any field off to hide/delete it from the booking form. The backend will always save safely.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFormConfig}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw size={11} />
                Reset All Fields
              </button>
            </div>

            {/* List of 11 fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Field 1: Name */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showNameField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    1. Full Name Field
                    {formConfig.showNameField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showNameField', formConfig.showNameField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showNameField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showNameField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={formConfig.nameLabel ?? ''}
                      placeholder="Full Name"
                      onChange={(e) => updateFormConfig('nameLabel', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      value={formConfig.namePlaceholder ?? ''}
                      placeholder="Rohan Singh"
                      onChange={(e) => updateFormConfig('namePlaceholder', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Field 2: Email */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showEmailField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    2. Email Address Field
                    {formConfig.showEmailField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showEmailField', formConfig.showEmailField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showEmailField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showEmailField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={formConfig.emailLabel ?? ''}
                      placeholder="Email Address"
                      onChange={(e) => updateFormConfig('emailLabel', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      value={formConfig.emailPlaceholder ?? ''}
                      placeholder="rohan@example.com"
                      onChange={(e) => updateFormConfig('emailPlaceholder', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Phone */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showPhoneField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    3. Phone Number Field
                    {formConfig.showPhoneField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showPhoneField', formConfig.showPhoneField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showPhoneField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showPhoneField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={formConfig.phoneLabel ?? ''}
                      placeholder="Phone Number"
                      onChange={(e) => updateFormConfig('phoneLabel', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      value={formConfig.phonePlaceholder ?? ''}
                      placeholder="98765 43210"
                      onChange={(e) => updateFormConfig('phonePlaceholder', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Field 4: Plan Type */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showPlanField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    4. Plan Selection Dropdown
                    {formConfig.showPlanField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showPlanField', formConfig.showPlanField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showPlanField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showPlanField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={formConfig.planLabel ?? ''}
                    placeholder="Plan Type"
                    onChange={(e) => updateFormConfig('planLabel', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Field 5: Duration Switcher */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showDurationSwitch !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    5. Daily / Monthly Switcher
                    {formConfig.showDurationSwitch !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateFormConfig('showDurationSwitch', formConfig.showDurationSwitch === false)
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showDurationSwitch !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showDurationSwitch !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={formConfig.durationLabel ?? ''}
                    placeholder="Duration"
                    onChange={(e) => updateFormConfig('durationLabel', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Field 6: Date */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showDateField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    6. Start Date Picker
                    {formConfig.showDateField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showDateField', formConfig.showDateField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showDateField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showDateField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={formConfig.dateLabel ?? ''}
                    placeholder="Start Date"
                    onChange={(e) => updateFormConfig('dateLabel', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Field 7: People Count */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showPeopleField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    7. People / Seats Count
                    {formConfig.showPeopleField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showPeopleField', formConfig.showPeopleField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showPeopleField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showPeopleField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={formConfig.peopleLabel ?? ''}
                    placeholder="People"
                    onChange={(e) => updateFormConfig('peopleLabel', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Field 8: Location */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showLocationField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    8. Location Autocomplete
                    {formConfig.showLocationField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showLocationField', formConfig.showLocationField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showLocationField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showLocationField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={formConfig.locationLabel ?? ''}
                      placeholder="Location"
                      onChange={(e) => updateFormConfig('locationLabel', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      value={formConfig.locationPlaceholder ?? ''}
                      placeholder="Select hub (Gorakhpur Hub, Mumbai Office)"
                      onChange={(e) => updateFormConfig('locationPlaceholder', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Field 9: Message */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${formConfig.showMessageField !== false
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    9. Message / Requirements
                    {formConfig.showMessageField !== false ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden / Removed
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFormConfig('showMessageField', formConfig.showMessageField === false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showMessageField !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showMessageField !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={formConfig.messageLabel ?? ''}
                      placeholder="Message (Optional)"
                      onChange={(e) => updateFormConfig('messageLabel', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      value={formConfig.messagePlaceholder ?? ''}
                      placeholder="Special requirements?"
                      onChange={(e) => updateFormConfig('messagePlaceholder', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Field 10 & 11: Price Breakdown & WhatsApp CTA */}
              <div className="p-3.5 rounded-xl border bg-white/[0.03] border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">10. Dynamic Price Card</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateFormConfig('showPriceBreakdown', formConfig.showPriceBreakdown === false)
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showPriceBreakdown !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showPriceBreakdown !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-bold text-white">11. WhatsApp Inquiry Button</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateFormConfig('showWhatsappButton', formConfig.showWhatsappButton === false)
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${formConfig.showWhatsappButton !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {formConfig.showWhatsappButton !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: BUTTON LABELS & WHATSAPP TEXTS                                 */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles size={14} className="text-neon-purple" />
              Customizable Form Button Texts &amp; Messages
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Primary Submit Button Text
                </label>
                <input
                  type="text"
                  name="contactFormSubmitText"
                  value={formSubmitText}
                  onChange={onChange}
                  onFocus={() => onFocus?.('contactFormSubmitText')}
                  placeholder="e.g. Confirm Booking"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  WhatsApp Quick CTA Button Text
                </label>
                <input
                  type="text"
                  name="contactFormWhatsappCtaText"
                  value={formWhatsappCtaText}
                  onChange={onChange}
                  onFocus={() => onFocus?.('contactFormWhatsappCtaText')}
                  placeholder="e.g. Quick Inquiry via WhatsApp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Success Screen Title
                </label>
                <input
                  type="text"
                  name="contactSuccessTitle"
                  value={successTitle}
                  onChange={onChange}
                  onFocus={() => onFocus?.('contactSuccessTitle')}
                  placeholder="e.g. Request Received!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Success WhatsApp Button Text
                </label>
                <input
                  type="text"
                  name="contactSuccessWhatsappButtonText"
                  value={successWhatsappButtonText}
                  onChange={onChange}
                  onFocus={() => onFocus?.('contactSuccessWhatsappButtonText')}
                  placeholder="e.g. WhatsApp Now"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: MAP PORTION, FILTER STYLES & OFFICE HUBS MANAGER                */}
      {/* ========================================================================= */}
      {subTab === 'map' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-start gap-3">
            <Map className="text-neon-blue shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block font-semibold mb-0.5">Map &amp; Locations Controls</strong>
              Change map visual filter presets (Cyberpunk dark, natural, grayscale, midnight), corner radius, outer glow, and add, edit, or delete office hubs shown on the public site.
            </div>
          </div>

          {/* Map Location Selector & Presets */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MapPin size={14} className="text-neon-blue" />
                Office Map Location &amp; Embed Config
              </label>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setMapInputMode('picker')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${mapInputMode === 'picker'
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <MapPin size={12} />
                  Interactive Finder (Search &amp; Pin)
                </button>
                <button
                  type="button"
                  onClick={() => setMapInputMode('manual')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${mapInputMode === 'manual'
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Map size={12} />
                  Manual Embed / Presets
                </button>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE MAP FINDER */}
            {mapInputMode === 'picker' && (
              <div className="space-y-3 pt-1">
                <InteractiveMapPicker
                  initialAddress={current.contactOffice2Address || current.contactOffice1Address || 'Vijay Chowk, Gorakhpur'}
                  applyButtonLabel="Apply as Public Map Location"
                  onSelectLocation={({ address: newAddr, embedUrl }) => {
                    setFormData?.((prev) => ({
                      ...prev,
                      mapEmbedUrl: embedUrl,
                    }));
                  }}
                />
              </div>
            )}

            {/* TAB 2: MANUAL EMBED / CODE */}
            {mapInputMode === 'manual' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Paste custom Google Maps embed URL or raw &lt;iframe&gt; code:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmbedGuide(!showEmbedGuide)}
                    className="text-[11px] text-neon-blue hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Info size={12} />
                    {showEmbedGuide ? 'Hide instructions' : 'How to get embed link?'}
                  </button>
                </div>

                {showEmbedGuide && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-1.5">
                    <p className="font-semibold text-white">How to get a Google Maps embed URL:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                      <li>Open Google Maps and search for your location.</li>
                      <li>Click the <strong>Share</strong> button.</li>
                      <li>Choose the <strong>Embed a map</strong> tab.</li>
                      <li>Click <strong>COPY HTML</strong> and paste it directly below (we automatically extract the URL).</li>
                    </ol>
                  </div>
                )}

                <textarea
                  name="mapEmbedUrl"
                  value={current.mapEmbedUrl || ''}
                  onChange={(e) => {
                    const extracted = extractMapSrc(e.target.value);
                    setFormData?.((prev) => ({ ...prev, mapEmbedUrl: extracted }));
                  }}
                  onFocus={() => onFocus?.('mapEmbedUrl')}
                  rows={3}
                  placeholder="Paste Google Maps embed URL or full <iframe src='...'> code..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none placeholder-slate-500 font-mono"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFormData?.((prev) => ({ ...prev, mapEmbedUrl: DEFAULT_MAP_EMBED_GORAKHPUR }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/10 hover:border-neon-pink/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <MapPin size={11} className="text-neon-pink" />
                    Gorakhpur Hub (Original)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData?.((prev) => ({ ...prev, mapEmbedUrl: MUMBAI_MAP_PRESET }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/10 hover:border-neon-blue/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Building2 size={11} className="text-neon-blue" />
                    Mumbai BKC
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData?.((prev) => ({ ...prev, mapEmbedUrl: '' }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    Default
                  </button>
                </div>
              </div>
            )}

            {/* Current Active Map Embed Preview URL */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] flex items-center justify-between gap-2">
              <span className="text-slate-400 shrink-0">Current Active Map URL:</span>
              <span className="text-neon-blue font-mono truncate text-right flex-1" title={cleanMapUrl}>
                {cleanMapUrl}
              </span>
            </div>

            {/* Map Filter Preset Picker */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Palette size={13} className="text-neon-pink" />
                Map Visual Filter Style Preset
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'cyberpunk', label: 'Cyberpunk Dark (Default)', desc: 'Neon Inverted' },
                  { id: 'natural', label: 'Natural Google', desc: 'Standard Bright' },
                  { id: 'grayscale', label: 'Monochrome', desc: 'Sleek Grayscale' },
                  { id: 'midnight', label: 'Midnight Blue', desc: 'High Contrast' },
                  { id: 'muted', label: 'Muted Sepia', desc: 'Warm Tint' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setFormData?.((prev) => ({
                        ...prev,
                        mapFilterPreset: preset.id,
                        mapDarkModeFilter: preset.id !== 'natural',
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${mapFilterPreset === preset.id
                      ? 'bg-neon-blue/20 border-neon-blue text-white shadow-sm font-bold'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                  >
                    <span className="block text-xs font-semibold leading-snug">{preset.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Height, Radius & Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Map Height */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Maximize2 size={13} className="text-neon-blue" />
                  Map Height ({mapHeight})
                </span>
                <div className="flex items-center gap-1.5">
                  {['350px', '400px', '480px', '550px'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData?.((prev) => ({ ...prev, mapHeight: h }))}
                      className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer border ${mapHeight === h
                        ? 'bg-neon-blue/20 text-white border-neon-blue/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Corner Radius */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-white block">Map Corner Radius</span>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Medium', val: 'rounded-xl' },
                    { label: 'Large (Default)', val: 'rounded-2xl' },
                    { label: 'Extra', val: 'rounded-3xl' },
                  ].map((rad) => (
                    <button
                      key={rad.val}
                      type="button"
                      onClick={() => setFormData?.((prev) => ({ ...prev, mapRadius: rad.val }))}
                      className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer border ${mapRadius === rad.val
                        ? 'bg-neon-blue/20 text-white border-neon-blue/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {rad.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Outer Glow */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-white block">Map Border Glow</span>
                <div className="flex gap-1.5">
                  {[
                    { label: 'None', val: 'none' },
                    { label: 'Cyan', val: 'blue' },
                    { label: 'Purple', val: 'purple' },
                    { label: 'Pink', val: 'pink' },
                  ].map((glow) => (
                    <button
                      key={glow.val}
                      type="button"
                      onClick={() => setFormData?.((prev) => ({ ...prev, mapBorderGlow: glow.val }))}
                      className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer border ${mapBorderGlow === glow.val
                        ? 'bg-neon-pink/20 text-white border-neon-pink/50 font-bold'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {glow.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Live Map Test Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Eye size={12} className="text-neon-blue" />
                Live Map Connection with Applied Filter:
              </span>
              <div
                className={`w-full ${mapRadius || 'rounded-2xl'} overflow-hidden border ${getMapGlowClass(
                  mapBorderGlow
                )} bg-black/60 relative shadow-2xl transition-all`}
                style={{ height: '220px' }}
              >
                <iframe
                  src={cleanMapUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: getMapFilter(),
                  }}
                  title="Admin Map Preview"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: OFFICE HUBS MANAGER (ADD / EDIT / DELETE HUBS)                 */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Building2 size={14} className="text-neon-blue" />
                  Office Hubs &amp; Locations Manager ({officesList.length} Active)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add new co-working hubs, edit titles, addresses, icons and neon colors, or delete offices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddOffice}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neon-blue/20 hover:bg-neon-blue/30 text-white border border-neon-blue/40 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  Add Office Hub
                </button>
                <button
                  type="button"
                  onClick={resetOfficesToDefault}
                  className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Reset to Mumbai and Gorakhpur offices"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* List of Office Hubs Cards */}
            <div className="space-y-3 pt-1">
              {officesList.map((office, idx) => {
                const IconComponent = office.iconType === 'MapPin' ? MapPin : Building2;
                const isVis = office.visible !== false;

                return (
                  <div
                    key={office.id || idx}
                    className={`p-4 rounded-xl border transition-all ${isVis
                      ? 'bg-white/[0.02] border-white/15'
                      : 'bg-red-500/[0.03] border-red-500/20 opacity-75'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                          <IconComponent className={office.color || 'text-neon-blue'} size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Hub #{idx + 1}: {office.title || 'Untitled Hub'}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            ID: {office.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleOfficeVisibility(idx)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${isVis
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                            }`}
                        >
                          {isVis ? 'Visible on site' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOffice(idx)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                          title="Delete office hub"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Hub Name / Title</label>
                        <input
                          type="text"
                          value={office.title || ''}
                          onChange={(e) => updateOfficeItem(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                          placeholder="e.g. Mumbai Office"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-400 block mb-1">Full Physical Address</label>
                        <textarea
                          rows={2}
                          value={office.address || ''}
                          onChange={(e) => updateOfficeItem(idx, 'address', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none resize-none"
                          placeholder="Complete address with floor, street, city & pin code"
                        />
                      </div>
                    </div>

                    {/* Icon and Color selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 mt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">Pin Icon:</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateOfficeItem(idx, 'iconType', 'Building2')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border flex items-center gap-1 ${office.iconType !== 'MapPin'
                              ? 'bg-white/20 text-white border-white/40 font-bold'
                              : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                              }`}
                          >
                            <Building2 size={12} />
                            Building
                          </button>
                          <button
                            type="button"
                            onClick={() => updateOfficeItem(idx, 'iconType', 'MapPin')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border flex items-center gap-1 ${office.iconType === 'MapPin'
                              ? 'bg-white/20 text-white border-white/40 font-bold'
                              : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                              }`}
                          >
                            <MapPin size={12} />
                            MapPin
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="text-[11px] text-slate-400 font-medium">Color Theme:</span>
                        <div className="flex gap-1">
                          {[
                            { name: 'Cyan', val: 'text-neon-blue', bg: 'bg-cyan-400' },
                            { name: 'Pink', val: 'text-neon-pink', bg: 'bg-pink-500' },
                            { name: 'Purple', val: 'text-neon-purple', bg: 'bg-purple-500' },
                            { name: 'Emerald', val: 'text-emerald-400', bg: 'bg-emerald-400' },
                            { name: 'Amber', val: 'text-amber-400', bg: 'bg-amber-400' },
                          ].map((col) => (
                            <button
                              key={col.val}
                              type="button"
                              onClick={() => updateOfficeItem(idx, 'color', col.val)}
                              className={`w-5 h-5 rounded-full ${col.bg} transition-all cursor-pointer ${(office.color || 'text-neon-blue') === col.val
                                ? 'ring-2 ring-white scale-110'
                                : 'opacity-40 hover:opacity-100'
                                }`}
                              title={col.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Details (Phone & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Phone size={14} className="text-neon-blue" />
                  General Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={contactPhone}
                  onChange={onChange}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none font-mono"
                />
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Mail size={14} className="text-neon-purple" />
                  General Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={contactEmail}
                  onChange={onChange}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: BACKEND & DATA SYNC HUB                                         */}
      {/* ========================================================================= */}
      {subTab === 'backend' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Backend API &amp; MongoDB Connectivity
                </span>
                {backendHealth === 'online' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Active
                  </span>
                )}
                {backendHealth === 'offline' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Local Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bookings submitted on the website automatically dual-sync to MongoDB (via Express backend) and local browser storage.
              </p>
            </div>

            <button
              type="button"
              onClick={checkBackendHealth}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:border-neon-blue/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw size={13} className={backendHealth === 'checking' ? 'animate-spin text-neon-blue' : ''} />
              <span>Ping Backend</span>
            </button>
          </div>

          {backendPingResult && (
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300">
              {backendPingResult}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 text-neon-blue uppercase">
                <Database size={14} />
                Database Schema (models/Booking.js)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                When MongoDB is connected, inquiries are securely written to the <code className="text-neon-pink">Booking</code> collection with fields:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-slate-300 space-y-0.5">
                <div><span className="text-neon-blue">name</span>: String (required)</div>
                <div><span className="text-neon-blue">email</span>: String (required)</div>
                <div><span className="text-neon-blue">phone</span>: String (10 digits)</div>
                <div><span className="text-neon-blue">plan</span>: String (Plan title &amp; price)</div>
                <div><span className="text-neon-blue">duration</span>: Daily | Monthly</div>
                <div><span className="text-neon-blue">date</span>: YYYY-MM-DD</div>
                <div><span className="text-neon-blue">people</span>: Number (1+)</div>
                <div><span className="text-neon-blue">location</span>: String</div>
                <div><span className="text-neon-blue">message</span>: String</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 text-neon-purple uppercase">
                <Zap size={14} />
                Zero-Downtime Guarantee
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your frontend form will <strong>NEVER crash</strong> even if your backend server is restarting, MongoDB is down, or internet disconnects:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Submissions gracefully fallback to browser localStorage</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Default safe values for any deleted/hidden frontend fields</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Admin Bookings tab merges and deduplicates all sources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: SECTION HEADINGS & COLORS                                       */}
      {/* ========================================================================= */}
      {subTab === 'headers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VisualTextEditor
              label="Heading (Prefix)"
              name="contactHeading"
              value={current.contactHeading || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('contactHeading')}
              placeholder="e.g. Book Your"
            />
            <VisualTextEditor
              label="Accent Word (Gradient Highlight)"
              name="contactAccent"
              value={current.contactAccent || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('contactAccent')}
              placeholder="e.g. Workspace"
            />
          </div>

          <VisualTextEditor
            label="Contact Subtitle / Notice"
            name="contactDescription"
            value={current.contactDescription || ''}
            onChange={onChange}
            onFocus={() => onFocus?.('contactDescription')}
            placeholder="Contact subtitle or special notice..."
            isTextarea={true}
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <ColorPaletteInput
              label="Heading Color"
              name="contactHeadingColor"
              value={current.contactHeadingColor || ''}
              onChange={onChange}
              defaultValue="#ffffff"
              defaultLabel="Default (White)"
            />
            <ColorPaletteInput
              label="Subtitle Text Color"
              name="contactDescriptionColor"
              value={current.contactDescriptionColor || ''}
              onChange={onChange}
              defaultValue="#94a3b8"
              defaultLabel="Default (Muted)"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: FULL 2-COLUMN SECTION VIEW (MAP + FORM)                         */}
      {/* ========================================================================= */}
      {subTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/15 bg-black/60 relative overflow-hidden space-y-6">
            <div className="text-center">
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ color: current.contactHeadingColor || undefined }}
              >
                {renderFormattedText(current.contactHeading || 'Book Your')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                  {renderFormattedText(current.contactAccent || 'Workspace')}
                </span>
              </h2>
              <p
                className="text-xs text-slate-400 max-w-md mx-auto"
                style={{ color: current.contactDescriptionColor || undefined }}
              >
                {renderFormattedText(
                  current.contactDescription || 'Ready to level up your workspace? Reserve your spot today.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Map & Active Offices */}
              <div className="space-y-4">
                <div
                  className={`overflow-hidden border ${getMapGlowClass(mapBorderGlow)} ${mapRadius || 'rounded-2xl'
                    } relative h-[260px] bg-black/50 shadow-xl`}
                >
                  <iframe
                    src={cleanMapUrl}
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter: getMapFilter(),
                    }}
                    title="Simulation Map"
                  />
                </div>

                <div className="space-y-2.5">
                  {officesList
                    .filter((o) => o.visible !== false)
                    .map((office, idx) => {
                      const IconComp = office.iconType === 'MapPin' ? MapPin : Building2;
                      const colClass = office.color || (idx % 2 === 0 ? 'text-neon-blue' : 'text-neon-pink');
                      return (
                        <div
                          key={office.id || idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10"
                        >
                          <IconComp size={16} className={`${colClass} shrink-0 mt-0.5`} />
                          <div>
                            <span className={`text-[11px] uppercase font-bold ${colClass} block`}>
                              {renderFormattedText(office.title)}
                            </span>
                            <p className="text-xs text-slate-300 line-clamp-2">
                              {renderFormattedText(office.address)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Column: Mini Form Replica */}
              <div
                className={`glass-card p-5 ${formConfig.formCardRadius || 'rounded-3xl'
                  } border ${getFormGlowClass(formConfig.formCardGlow)} space-y-3 shadow-xl`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Form Preview
                  </span>
                  <span className="text-[10px] text-neon-blue font-mono font-bold">● Live Sync</span>
                </div>

                {(formConfig.showNameField !== false || formConfig.showEmailField !== false) && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {formConfig.showNameField !== false && (
                      <input
                        readOnly
                        value={formConfig.namePlaceholder || 'Rohan Singh'}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                    )}
                    {formConfig.showEmailField !== false && (
                      <input
                        readOnly
                        value={formConfig.emailPlaceholder || 'rohan@example.com'}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                    )}
                  </div>
                )}

                {(formConfig.showPhoneField !== false || formConfig.showPlanField !== false) && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {formConfig.showPhoneField !== false && (
                      <input
                        readOnly
                        value={formConfig.phonePlaceholder || '98765 43210'}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                    )}
                    {formConfig.showPlanField !== false && (
                      <input
                        readOnly
                        value="Dedicated Desk (₹6999/mo)"
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-neon-blue font-bold truncate"
                      />
                    )}
                  </div>
                )}

                <div
                  className={`py-2.5 rounded-xl font-bold text-xs text-center ${getButtonGradientClass(
                    formConfig.buttonGradient
                  )} text-white shadow-md`}
                >
                  {formSubmitText}
                </div>

                {formConfig.showWhatsappButton !== false && (
                  <div className="py-2 rounded-xl text-xs font-medium text-center border border-white/10 text-slate-300 flex items-center justify-center gap-2">
                    <WhatsAppIcon size={14} />
                    {formWhatsappCtaText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
