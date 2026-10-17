import { useState, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_FRANCHISE_BUDGET_OPTIONS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import WhatsAppIcon from '../../layout/WhatsAppIcon';
import { API_BASE_URL } from '../../../config';
import {
  Send,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Sliders,
  Check,
  Eye,
  EyeOff,
  FileText,
  ClipboardList,
  MapPin,
  Database,
  RefreshCw,
  Palette,
  Globe,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  Download,
  Search,
  Clock,
  Coins,
} from 'lucide-react';

const PRESET_BUDGET_RANGES = [
  '₹15L - ₹25L',
  '₹20L - ₹35L',
  '₹35L - ₹50L',
  '₹50L - ₹75L',
  '₹75L - ₹1Cr',
  '₹1Cr+',
];

const RECOMMENDED_CITIES = [
  'Gorakhpur',
  'Lucknow',
  'Varanasi',
  'Kanpur',
  'Prayagraj',
  'Patna',
  'Indore',
  'Bhopal',
  'Jaipur',
  'Nagpur',
  'Ranchi',
  'Agra',
];

export default function FranchiseInquiryTab({ current, onChange, onFocus, setFormData, onSwitchView }) {
  const [subTab, setSubTab] = useState('form'); // 'form' | 'budget' | 'headings' | 'whatsapp' | 'leads'
  const [previewMode, setPreviewMode] = useState('form'); // 'form' | 'success'
  const [newBudget, setNewBudget] = useState('');
  const [backendHealth, setBackendHealth] = useState(null); // 'online' | 'offline' | 'checking'
  const [backendPingResult, setBackendPingResult] = useState('');
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const [testSubmitNotice, setTestSubmitNotice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Form Test State (Live replica inside admin panel)
  const [testForm, setTestForm] = useState({
    fullName: 'Sachin Tendulkar',
    email: 'sachin@luxury.com',
    phone: '9876543210',
    city: 'Gorakhpur, Uttar Pradesh, India',
    budget: '₹20L - ₹35L',
    message: 'Looking to launch a flagship Startup Cafe coworking space in Eastern UP.',
  });

  // Local storage inquiries for leads subtab
  const [inquiries, setInquiries] = useState([]);

  const loadInquiries = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('startupcafe_franchise_inquiries') || '[]');
      setInquiries(stored);
    } catch {
      setInquiries([]);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  // Budget Options
  const budgetOptions = Array.isArray(current.franchiseInquiryBudgetOptions) && current.franchiseInquiryBudgetOptions.length > 0
    ? current.franchiseInquiryBudgetOptions
    : DEFAULT_FRANCHISE_BUDGET_OPTIONS;

  // Field Visibility Toggles (Mirrors Contact & Location system)
  const showName = current.franchiseInquiryShowName !== false;
  const showEmail = current.franchiseInquiryShowEmail !== false;
  const showPhone = current.franchiseInquiryShowPhone !== false;
  const showCity = current.franchiseInquiryShowCity !== false;
  const showBudget = current.franchiseInquiryShowBudget !== false;
  const showMessage = current.franchiseInquiryShowMessage !== false;
  const isWhatsappVisible = current.franchiseInquiryShowWhatsapp !== false;

  // Visual Styles
  const cardRadius = current.franchiseInquiryCardRadius || 'rounded-[2.5rem]';
  const cardGlow = current.franchiseInquiryCardGlow || 'none';
  const buttonGradient = current.franchiseInquiryButtonGradient || 'default';

  // Content & Text
  const heading = current.franchiseInquiryHeading !== undefined ? current.franchiseInquiryHeading : 'Start Your';
  const accent = current.franchiseInquiryAccent !== undefined ? current.franchiseInquiryAccent : 'Partner Journey';
  const subtitle = current.franchiseInquirySubtitle !== undefined ? current.franchiseInquirySubtitle : "Take the first step towards owning a premium co-working franchise. Let's discuss your vision.";
  const submitText = current.franchiseInquirySubmitText !== undefined ? current.franchiseInquirySubmitText : 'Submit Application';
  const whatsappButtonText = current.franchiseInquiryWhatsappText !== undefined ? current.franchiseInquiryWhatsappText : 'WhatsApp Support';
  const whatsappNumber = (current.contactWhatsappNumber || '919670111167').replace(/\D/g, '');
  const whatsappMessage = current.franchiseInquiryWhatsappMessage !== undefined ? current.franchiseInquiryWhatsappMessage : 'Hello Startup Cafe! I have just submitted a franchise inquiry form and would like to get more information about the partnership opportunity.';

  const successTitle = current.franchiseInquirySuccessTitle !== undefined ? current.franchiseInquirySuccessTitle : 'Application Received!';
  const successMessage = current.franchiseInquirySuccessMessage !== undefined ? current.franchiseInquirySuccessMessage : 'Thank you for your interest in partnering with us. Our franchise development team will review your details and contact you within 48 hours.';
  const successNotice = current.franchiseInquirySuccessNotice !== undefined ? current.franchiseInquirySuccessNotice : 'Our franchise development team will review your profile and connect within 48 hours.';

  // Automatically activate Franchise Application in Live Preview on mount
  useEffect(() => {
    onFocus?.('franchiseInquiryHeading');
  }, []);

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
        return 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.5)]';
    }
  };

  const checkBackendHealth = async () => {
    setBackendHealth('checking');
    setBackendPingResult('Pinging Franchise API endpoint...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        setBackendHealth('online');
        setBackendPingResult('✅ Backend API is reachable and MongoDB sync is active');
      } else {
        setBackendHealth('offline');
        setBackendPingResult('⚠️ Server responded with HTTP status ' + res.status);
      }
    } catch {
      setBackendHealth('offline');
      setBackendPingResult('🟡 Backend offline. Safe local browser cache active.');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setIsTestSubmitting(true);
    setTestSubmitNotice('');

    const payload = {
      fullName: testForm.fullName || 'Sachin Tendulkar',
      email: testForm.email || 'sachin@luxury.com',
      phone: testForm.phone || '9876543210',
      city: testForm.city || 'Gorakhpur, Uttar Pradesh',
      budget: testForm.budget || '₹20L - ₹35L',
      message: testForm.message || 'Test Franchise Submission from Admin Panel',
    };

    let backendOk = false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/franchise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) backendOk = true;
    } catch {
      // Offline fallback
    }

    try {
      const stored = JSON.parse(localStorage.getItem('startupcafe_franchise_inquiries') || '[]');
      stored.unshift({
        ...payload,
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('startupcafe_franchise_inquiries', JSON.stringify(stored));
      loadInquiries();
    } catch (e) {
      console.error(e);
    }

    setIsTestSubmitting(false);
    setPreviewMode('success');
    setTestSubmitNotice(
      backendOk
        ? '✓ Test inquiry successfully recorded in MongoDB & Local Storage!'
        : '✓ Test inquiry saved to Local Storage (Graceful backend offline fallback)!'
    );
  };

  const updateSetting = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    onFocus?.(key);
  };

  const toggleField = (key) => {
    const currentVal = current[key] !== false;
    updateSetting(key, !currentVal);
  };

  const handleAddBudget = (valueToAdd) => {
    const val = (valueToAdd || newBudget).trim();
    if (!val) return;
    if (budgetOptions.includes(val)) {
      alert('This budget range already exists.');
      return;
    }
    const updated = [...budgetOptions, val];
    updateSetting('franchiseInquiryBudgetOptions', updated);
    setNewBudget('');
  };

  const handleRemoveBudget = (index) => {
    if (budgetOptions.length <= 1) {
      alert('Please keep at least one investment budget tier.');
      return;
    }
    const updated = budgetOptions.filter((_, i) => i !== index);
    updateSetting('franchiseInquiryBudgetOptions', updated);
  };

  const resetAllFields = () => {
    if (window.confirm('Reset all field labels, placeholders, and visibility toggles to default?')) {
      setFormData((prev) => ({
        ...prev,
        franchiseInquiryNameLabel: 'Full Name',
        franchiseInquiryNamePlaceholder: 'Sachin Tendulkar',
        franchiseInquiryEmailLabel: 'Email Address',
        franchiseInquiryEmailPlaceholder: 'sachin@luxury.com',
        franchiseInquiryPhoneLabel: 'Phone Number',
        franchiseInquiryPhonePlaceholder: '98765 43210',
        franchiseInquiryCityLabel: 'Interested City',
        franchiseInquiryCityPlaceholder: 'e.g. Gorakhpur, Lucknow, Varanasi',
        franchiseInquiryBudgetLabel: 'Investment Budget',
        franchiseInquiryBudgetPlaceholder: 'Select an investment range',
        franchiseInquiryMessageLabel: 'Vision & Requirements',
        franchiseInquiryMessagePlaceholder: 'Tell us about your interest in Startup Cafe...',
        franchiseInquiryShowName: true,
        franchiseInquiryShowEmail: true,
        franchiseInquiryShowPhone: true,
        franchiseInquiryShowCity: true,
        franchiseInquiryShowBudget: true,
        franchiseInquiryShowMessage: true,
        franchiseInquiryShowWhatsapp: true,
        franchiseInquiryCardRadius: 'rounded-[2.5rem]',
        franchiseInquiryCardGlow: 'none',
        franchiseInquiryButtonGradient: 'default',
      }));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Franchise Inquiry Form settings, fields, and budget tiers to factory defaults?')) {
      setFormData((prev) => ({
        ...prev,
        franchiseInquiryHeading: 'Start Your',
        franchiseInquiryAccent: 'Partner Journey',
        franchiseInquirySubtitle: "Take the first step towards owning a premium co-working franchise. Let's discuss your vision.",
        franchiseInquiryBudgetOptions: DEFAULT_FRANCHISE_BUDGET_OPTIONS,
        franchiseInquirySubmitText: 'Submit Application',
        franchiseInquiryWhatsappText: 'WhatsApp Support',
        franchiseInquiryWhatsappMessage: 'Hello Startup Cafe! I have just submitted a franchise inquiry form and would like to get more information about the partnership opportunity.',
        franchiseInquirySuccessTitle: 'Application Received!',
        franchiseInquirySuccessMessage: 'Thank you for your interest in partnering with us. Our franchise development team will review your details and contact you within 48 hours.',
        franchiseInquirySuccessNotice: 'Our franchise development team will review your profile and connect within 48 hours.',
        franchiseInquiryHeadingColor: '',
        franchiseInquirySubtitleColor: '',
        franchiseInquiryNameLabel: 'Full Name',
        franchiseInquiryNamePlaceholder: 'Sachin Tendulkar',
        franchiseInquiryEmailLabel: 'Email Address',
        franchiseInquiryEmailPlaceholder: 'sachin@luxury.com',
        franchiseInquiryPhoneLabel: 'Phone Number',
        franchiseInquiryPhonePlaceholder: '98765 43210',
        franchiseInquiryCityLabel: 'Interested City',
        franchiseInquiryCityPlaceholder: 'e.g. Gorakhpur, Lucknow, Varanasi',
        franchiseInquiryBudgetLabel: 'Investment Budget',
        franchiseInquiryBudgetPlaceholder: 'Select an investment range',
        franchiseInquiryMessageLabel: 'Vision & Requirements',
        franchiseInquiryMessagePlaceholder: 'Tell us about your interest in Startup Cafe...',
        franchiseInquiryShowName: true,
        franchiseInquiryShowEmail: true,
        franchiseInquiryShowPhone: true,
        franchiseInquiryShowCity: true,
        franchiseInquiryShowBudget: true,
        franchiseInquiryShowMessage: true,
        franchiseInquiryShowWhatsapp: true,
        franchiseInquiryCardRadius: 'rounded-[2.5rem]',
        franchiseInquiryCardGlow: 'none',
        franchiseInquiryButtonGradient: 'default',
      }));
    }
  };

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

  const handleClearInquiries = () => {
    if (window.confirm('Clear all saved franchise inquiries? This action cannot be undone.')) {
      localStorage.removeItem('startupcafe_franchise_inquiries');
      setInquiries([]);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Franchise Section Bar */}
      <FranchiseSectionBar
        activeSection="inquiry"
        onSwitchSection={onSwitchView}
      />

      {/* Main Section Header */}
      <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="text-neon-blue" size={20} />
            <span>Franchise Application Form &amp; Setup</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete management system matching Contact &amp; Location: live interactive replica, field switches, budget tiers &amp; lead tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={12} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Sub-navigation Tabs (Identical to ContactTab UX) */}
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
          onClick={() => setSubTab('budget')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'budget'
              ? 'bg-neon-pink/20 text-white border-neon-pink/50 shadow-sm shadow-neon-pink/20'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <CreditCard size={15} className={subTab === 'budget' ? 'text-neon-pink' : ''} />
          <span>Budget &amp; City Hubs</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('whatsapp')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'whatsapp'
              ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-sm shadow-emerald-500/20'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <WhatsAppIcon size={15} className={subTab === 'whatsapp' ? 'text-emerald-400' : ''} />
          <span>WhatsApp &amp; Success</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('headings')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'headings'
              ? 'bg-neon-blue/20 text-white border-neon-blue/50 shadow-sm shadow-neon-blue/20'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Sparkles size={15} className={subTab === 'headings' ? 'text-neon-blue' : ''} />
          <span>Section Headings</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('leads')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'leads'
              ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Database size={15} className={subTab === 'leads' ? 'text-amber-400' : ''} />
          <span>Leads &amp; Sync ({inquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('preview')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${subTab === 'preview'
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-sm'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
        >
          <Eye size={15} className={subTab === 'preview' ? 'text-cyan-400' : ''} />
          <span>Full Section View</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: FORM FIELDS, VISUAL STYLES & LIVE AUTHENTIC REPLICA             */}
      {/* ========================================================================= */}
      {subTab === 'form' && (
        <div className="space-y-6">
          {/* Header & Mode Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList size={16} className="text-neon-purple" />
                Live Franchise Form Replica (Matches Website 1:1)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time interactive replica reacting to field visibility, custom labels, border radius, and glow.
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

          {/* Authentic Form Card (Looking exactly like InquiryForm.jsx) */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`glass-card p-6 sm:p-10 ${cardRadius} border ${getFormGlowClass(cardGlow)} relative overflow-hidden shadow-2xl transition-all`}
            >
              {previewMode === 'success' ? (
                /* Success Screen State */
                <div className="h-full flex flex-col items-center justify-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {renderFormattedText(successTitle)}
                  </h3>
                  <p className="text-slate-300 text-base mb-4 max-w-md mx-auto leading-relaxed">
                    {renderFormattedText(successMessage)}
                  </p>
                  {successNotice && (
                    <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto italic">
                      {renderFormattedText(successNotice)}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    {isWhatsappVisible && (
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white transition-all shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)] text-sm"
                      >
                        <WhatsAppIcon size={18} />
                        {renderFormattedText(whatsappButtonText)}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewMode('form')}
                      className="flex-1 py-3.5 rounded-xl font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all text-sm cursor-pointer"
                    >
                      New Application
                    </button>
                  </div>
                </div>
              ) : (
                /* Actual Form Input Fields Reacting to Admin Toggles */
                <form className="space-y-5" onSubmit={handleTestSubmit}>
                  {/* Selected Range notice */}
                  <div className="p-3.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Franchise Tier</p>
                      <p className="text-sm font-bold text-white">{testForm.budget} Investment Range</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">Interactive Test Mode</span>
                  </div>

                  {/* Row 1: Name & Email */}
                  {(showName || showEmail) && (
                    <div className={`grid grid-cols-1 ${showName && showEmail ? 'md:grid-cols-2' : ''} gap-5`}>
                      {showName && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(current.franchiseInquiryNameLabel || 'Full Name')}
                          </label>
                          <input
                            required
                            type="text"
                            value={testForm.fullName}
                            onChange={(e) => setTestForm((p) => ({ ...p, fullName: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                            placeholder={current.franchiseInquiryNamePlaceholder || 'Sachin Tendulkar'}
                          />
                        </div>
                      )}
                      {showEmail && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(current.franchiseInquiryEmailLabel || 'Email Address')}
                          </label>
                          <input
                            required
                            type="email"
                            value={testForm.email}
                            onChange={(e) => setTestForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all text-sm"
                            placeholder={current.franchiseInquiryEmailPlaceholder || 'sachin@luxury.com'}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 2: Phone & City */}
                  {(showPhone || showCity) && (
                    <div className={`grid grid-cols-1 ${showPhone && showCity ? 'md:grid-cols-2' : ''} gap-5`}>
                      {showPhone && (
                        <div className="space-y-1.5">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(current.franchiseInquiryPhoneLabel || 'Phone Number')}
                          </label>
                          <input
                            required
                            type="tel"
                            value={testForm.phone}
                            onChange={(e) => setTestForm((p) => ({ ...p, phone: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                            placeholder={current.franchiseInquiryPhonePlaceholder || '98765 43210'}
                          />
                        </div>
                      )}
                      {showCity && (
                        <div className="space-y-1.5 relative">
                          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                            {renderFormattedText(current.franchiseInquiryCityLabel || 'Interested City')}
                          </label>
                          <div className="relative">
                            <input
                              required
                              type="text"
                              value={testForm.city}
                              onChange={(e) => setTestForm((p) => ({ ...p, city: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all text-sm"
                              placeholder={current.franchiseInquiryCityPlaceholder || 'e.g. Gorakhpur, Lucknow, Varanasi'}
                            />
                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 3: Investment Budget Dropdown */}
                  {showBudget && (
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                        {renderFormattedText(current.franchiseInquiryBudgetLabel || 'Investment Budget')}
                      </label>
                      <select
                        value={testForm.budget}
                        onChange={(e) => setTestForm((p) => ({ ...p, budget: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-pink transition-all text-sm appearance-none [&>option]:bg-[#1a1a1a]"
                      >
                        <option value="">{current.franchiseInquiryBudgetPlaceholder || 'Select an investment range'}</option>
                        {budgetOptions.map((opt, i) => (
                          <option key={i} value={typeof opt === 'string' ? opt : opt.value}>
                            {typeof opt === 'string' ? opt : opt.label || opt.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Row 4: Vision & Requirements */}
                  {showMessage && (
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                        {renderFormattedText(current.franchiseInquiryMessageLabel || 'Vision & Requirements')}
                      </label>
                      <textarea
                        rows={3}
                        value={testForm.message}
                        onChange={(e) => setTestForm((p) => ({ ...p, message: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all text-sm resize-none"
                        placeholder={current.franchiseInquiryMessagePlaceholder || 'Tell us about your interest in Startup Cafe...'}
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isTestSubmitting}
                      className={`w-full py-4 rounded-xl ${getButtonGradientClass(buttonGradient)} text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all`}
                    >
                      {isTestSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>{renderFormattedText(submitText)}</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* WhatsApp Support Button */}
                  {isWhatsappVisible && (
                    <div className="pt-1 text-center">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all shadow-sm"
                      >
                        <WhatsAppIcon size={15} />
                        <span>{renderFormattedText(whatsappButtonText)}</span>
                      </a>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VISUAL STYLING CONTROLS (RADIUS, GLOW, BUTTON GRADIENT)                   */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Palette size={14} className="text-neon-pink" />
              Card Visual Styling &amp; Atmosphere
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Corner Radius */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Card Corner Radius</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Medium', val: 'rounded-2xl' },
                    { label: 'Large', val: 'rounded-3xl' },
                    { label: 'Ultra', val: 'rounded-[2.5rem]' },
                  ].map((rad) => (
                    <button
                      key={rad.val}
                      type="button"
                      onClick={() => updateSetting('franchiseInquiryCardRadius', rad.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${cardRadius === rad.val
                          ? 'bg-neon-blue/20 text-white border-neon-blue/50 font-bold'
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
                      onClick={() => updateSetting('franchiseInquiryCardGlow', glow.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${cardGlow === glow.val
                          ? 'bg-neon-purple/20 text-white border-neon-purple/50 font-bold'
                          : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {glow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Theme */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Submit Button Theme</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Tricolor', val: 'default' },
                    { label: 'Pink/Purp', val: 'pink-purple' },
                    { label: 'Emerald', val: 'emerald' },
                    { label: 'Amber', val: 'amber' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => updateSetting('franchiseInquiryButtonGradient', btn.val)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${buttonGradient === btn.val
                          ? 'bg-neon-pink/20 text-white border-neon-pink/50 font-bold'
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
          {/* FORM FIELDS MANAGER (TOGGLE / HIDE / RENAME / PLACEHOLDERS)               */}
          {/* ========================================================================= */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="text-neon-blue" size={16} />
                  <span>Form Fields Manager (Add, Hide or Delete Any Field)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toggle any field off to hide/delete it from the public franchise application. Labels &amp; sample placeholders update in real-time.
                </p>
              </div>

              <button
                type="button"
                onClick={resetAllFields}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw size={11} />
                <span>Reset All Fields</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Full Name */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showName ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    1. Full Name Field
                    {showName ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowName')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showName ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showName ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryNameLabel"
                      value={current.franchiseInquiryNameLabel !== undefined ? current.franchiseInquiryNameLabel : 'Full Name'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryNameLabel')}
                      placeholder="Full Name"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      name="franchiseInquiryNamePlaceholder"
                      value={current.franchiseInquiryNamePlaceholder !== undefined ? current.franchiseInquiryNamePlaceholder : 'Sachin Tendulkar'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryNamePlaceholder')}
                      placeholder="Sachin Tendulkar"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 2: Email Address */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showEmail ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    2. Email Address Field
                    {showEmail ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowEmail')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showEmail ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showEmail ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryEmailLabel"
                      value={current.franchiseInquiryEmailLabel !== undefined ? current.franchiseInquiryEmailLabel : 'Email Address'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryEmailLabel')}
                      placeholder="Email Address"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      name="franchiseInquiryEmailPlaceholder"
                      value={current.franchiseInquiryEmailPlaceholder !== undefined ? current.franchiseInquiryEmailPlaceholder : 'sachin@luxury.com'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryEmailPlaceholder')}
                      placeholder="sachin@luxury.com"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Phone Number */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showPhone ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    3. Phone Number Field
                    {showPhone ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowPhone')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showPhone ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showPhone ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryPhoneLabel"
                      value={current.franchiseInquiryPhoneLabel !== undefined ? current.franchiseInquiryPhoneLabel : 'Phone Number'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryPhoneLabel')}
                      placeholder="Phone Number"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      name="franchiseInquiryPhonePlaceholder"
                      value={current.franchiseInquiryPhonePlaceholder !== undefined ? current.franchiseInquiryPhonePlaceholder : '98765 43210'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryPhonePlaceholder')}
                      placeholder="98765 43210"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 4: Interested City */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showCity ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    4. Interested City Field
                    {showCity ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowCity')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showCity ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showCity ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryCityLabel"
                      value={current.franchiseInquiryCityLabel !== undefined ? current.franchiseInquiryCityLabel : 'Interested City'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryCityLabel')}
                      placeholder="Interested City"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      name="franchiseInquiryCityPlaceholder"
                      value={current.franchiseInquiryCityPlaceholder !== undefined ? current.franchiseInquiryCityPlaceholder : 'e.g. Gorakhpur, Lucknow, Varanasi'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryCityPlaceholder')}
                      placeholder="e.g. Gorakhpur, Lucknow, Varanasi"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 5: Investment Budget Dropdown */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showBudget ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    5. Investment Budget Dropdown
                    {showBudget ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowBudget')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showBudget ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showBudget ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryBudgetLabel"
                      value={current.franchiseInquiryBudgetLabel !== undefined ? current.franchiseInquiryBudgetLabel : 'Investment Budget'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryBudgetLabel')}
                      placeholder="Investment Budget"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Prompt Option</span>
                    <input
                      type="text"
                      name="franchiseInquiryBudgetPlaceholder"
                      value={current.franchiseInquiryBudgetPlaceholder !== undefined ? current.franchiseInquiryBudgetPlaceholder : 'Select an investment range'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryBudgetPlaceholder')}
                      placeholder="Select an investment range"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-pink focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 6: Vision & Requirements */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${showMessage ? 'bg-white/[0.03] border-white/15' : 'bg-red-500/[0.05] border-red-500/20 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    6. Vision &amp; Requirements Textarea
                    {showMessage ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-mono">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleField('franchiseInquiryShowMessage')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${showMessage ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                  >
                    {showMessage ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Label</span>
                    <input
                      type="text"
                      name="franchiseInquiryMessageLabel"
                      value={current.franchiseInquiryMessageLabel !== undefined ? current.franchiseInquiryMessageLabel : 'Vision & Requirements'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryMessageLabel')}
                      placeholder="Vision & Requirements"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Placeholder</span>
                    <input
                      type="text"
                      name="franchiseInquiryMessagePlaceholder"
                      value={current.franchiseInquiryMessagePlaceholder !== undefined ? current.franchiseInquiryMessagePlaceholder : 'Tell us about your interest in Startup Cafe...'}
                      onChange={onChange}
                      onFocus={() => onFocus?.('franchiseInquiryMessagePlaceholder')}
                      placeholder="Tell us about your interest..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: INVESTMENT BUDGET OPTIONS & TARGET CITY HUBS                   */}
      {/* ========================================================================= */}
      {subTab === 'budget' && (
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="text-neon-pink" size={16} />
                  <span>Investment Budget Tiers ({budgetOptions.length} Active Ranges)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  These tiers appear inside the partner application dropdown. You can add new ranges or delete existing ones.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/30">
                Tier Dropdown Sync
              </span>
            </div>

            {/* Current Options Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {budgetOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-semibold flex items-center gap-2 group hover:border-neon-pink/40 transition-all shadow-sm"
                >
                  <span>{typeof opt === 'string' ? opt : opt.label || opt.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBudget(idx)}
                    className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                    title="Remove tier"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Range */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5 max-w-md">
              <input
                type="text"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBudget();
                  }
                }}
                placeholder="Add new custom range (e.g. ₹50L - ₹1Cr)"
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-pink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddBudget()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neon-pink/20 hover:bg-neon-pink/30 text-white border border-neon-pink/40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Tier</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[11px] text-slate-400 block font-medium">Quick Preset Suggestions (Click to Add):</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BUDGET_RANGES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddBudget(preset)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target City Suggestions / Recommendations */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="text-neon-blue" size={16} />
              <span>Target Tier 2 &amp; Tier 3 Cities in India</span>
            </h4>
            <p className="text-xs text-slate-400">
              High-demand startup markets in India. Click any city to update the sample placeholder prompt on the form.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {RECOMMENDED_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => updateSetting('franchiseInquiryCityPlaceholder', `e.g. ${city}, Lucknow, Varanasi`)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-neon-blue/15 border border-white/10 hover:border-neon-blue/40 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin size={11} className="text-neon-blue" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: SECTION HEADINGS & BRANDING                                     */}
      {/* ========================================================================= */}
      {subTab === 'headings' && (
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="text-neon-blue" size={16} />
              <span>Section Title &amp; Description</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VisualTextEditor
                label="Section Heading (Prefix)"
                name="franchiseInquiryHeading"
                value={heading}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseInquiryHeading')}
                placeholder="e.g. Start Your"
              />
              <VisualTextEditor
                label="Accent Word (Gradient Highlight)"
                name="franchiseInquiryAccent"
                value={accent}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseInquiryAccent')}
                placeholder="e.g. Partner Journey"
              />
            </div>

            <VisualTextEditor
              label="Section Subtitle / Description"
              name="franchiseInquirySubtitle"
              value={subtitle}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseInquirySubtitle')}
              placeholder="Subtitle under form heading..."
              isTextarea={true}
              rows={2}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <ColorPaletteInput
                label="Heading Color"
                name="franchiseInquiryHeadingColor"
                value={current.franchiseInquiryHeadingColor || ''}
                onChange={onChange}
                defaultValue="#ffffff"
                defaultLabel="Default (White)"
              />
              <ColorPaletteInput
                label="Subtitle Color"
                name="franchiseInquirySubtitleColor"
                value={current.franchiseInquirySubtitleColor || ''}
                onChange={onChange}
                defaultValue="#94a3b8"
                defaultLabel="Default (Slate)"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: WHATSAPP CALL TO ACTION & SUCCESS SCREEN                        */}
      {/* ========================================================================= */}
      {subTab === 'whatsapp' && (
        <div className="space-y-6">
          {/* WhatsApp Support Button Visibility Toggle */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    WhatsApp Support Button Visibility
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isWhatsappVisible
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                  >
                    {isWhatsappVisible ? 'Visible on Website' : 'Hidden / Invisible'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Control whether the direct WhatsApp support button is displayed below the form and on the thank-you screen.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleField('franchiseInquiryShowWhatsapp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${isWhatsappVisible
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}
              >
                {isWhatsappVisible ? (
                  <>
                    <EyeOff size={14} />
                    <span>Make Invisible (Hide)</span>
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    <span>Make Visible</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Primary Submit Button Text
                </label>
                <input
                  type="text"
                  name="franchiseInquirySubmitText"
                  value={submitText}
                  onChange={onChange}
                  onFocus={() => onFocus?.('franchiseInquirySubmitText')}
                  placeholder="e.g. Submit Application"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  WhatsApp Support Button Text
                </label>
                <input
                  type="text"
                  name="franchiseInquiryWhatsappText"
                  value={whatsappButtonText}
                  onChange={onChange}
                  onFocus={() => onFocus?.('franchiseInquiryWhatsappText')}
                  placeholder="e.g. WhatsApp Support"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-purple focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Pre-Filled WhatsApp Message
              </label>
              <textarea
                name="franchiseInquiryWhatsappMessage"
                rows={2}
                value={whatsappMessage}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseInquiryWhatsappMessage')}
                placeholder="Message that opens in prospective partner's WhatsApp..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Success Screen Configurations */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={16} />
              <span>Post-Submission Thank You Screen</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Success Title</label>
                <input
                  type="text"
                  name="franchiseInquirySuccessTitle"
                  value={successTitle}
                  onChange={onChange}
                  onFocus={() => onFocus?.('franchiseInquirySuccessTitle')}
                  placeholder="e.g. Application Received!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Review Time Notice</label>
                <input
                  type="text"
                  name="franchiseInquirySuccessNotice"
                  value={successNotice}
                  onChange={onChange}
                  onFocus={() => onFocus?.('franchiseInquirySuccessNotice')}
                  placeholder="e.g. Review within 48 hours notice..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Success Message Description</label>
              <textarea
                name="franchiseInquirySuccessMessage"
                rows={2}
                value={successMessage}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseInquirySuccessMessage')}
                placeholder="Thank you message details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-green-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: LEADS & BACKEND DATA SYNC HUB                                   */}
      {/* ========================================================================= */}
      {subTab === 'leads' && (
        <div className="space-y-6">
          {/* Backend Connectivity Status */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Franchise Leads Pipeline &amp; MongoDB
                </span>
                {backendHealth === 'online' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Backend Online
                  </span>
                )}
                {backendHealth === 'offline' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Local Cache Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {backendPingResult || 'Dual sync preserves all inquiries in MongoDB and browser storage.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={checkBackendHealth}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:border-neon-blue/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={13} className={backendHealth === 'checking' ? 'animate-spin text-neon-blue' : ''} />
                <span>Ping API</span>
              </button>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 size={16} className="text-neon-blue" />
                  <span>Submitted Partner Applications ({inquiries.length})</span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {inquiries.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} className="text-neon-blue" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearInquiries}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Clear All</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Search filter */}
            {inquiries.length > 0 && (
              <div className="relative max-w-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, city, phone or budget..."
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              </div>
            )}

            {filteredInquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-sm">No franchise applications found.</p>
                <p className="text-xs text-slate-600">
                  Switch to the "Form Fields &amp; Styles" tab and submit a test inquiry to see it here!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">Applicant</th>
                      <th className="py-2.5 px-3 font-semibold">Contact</th>
                      <th className="py-2.5 px-3 font-semibold">Target City</th>
                      <th className="py-2.5 px-3 font-semibold">Budget</th>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInquiries.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <p className="text-white font-bold">{item.fullName || item.name || 'Anonymous'}</p>
                          {item.message && (
                            <p className="text-slate-400 text-[10px] truncate max-w-xs">{item.message}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 space-y-0.5">
                          <p className="text-slate-300 font-mono text-[11px]">{item.phone || '—'}</p>
                          <p className="text-slate-500 text-[10px]">{item.email || '—'}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-neon-blue font-semibold">{item.city || '—'}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink text-[10px] font-semibold border border-neon-pink/30">
                            {item.budget || '—'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[10px] font-mono">
                          {item.timestamp || 'Recent'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.phone && (
                            <a
                              href={`https://wa.me/${(item.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello ${item.fullName || ''}, thank you for your interest in the Startup Cafe franchise in ${item.city || ''}!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-[10px] font-semibold transition-colors"
                            >
                              <WhatsAppIcon size={12} />
                              <span>Chat</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 6: FULL SECTION PREVIEW (MIRRORS PUBLIC /franchise PAGE)           */}
      {/* ========================================================================= */}
      {subTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-black/60 relative overflow-hidden space-y-6 shadow-2xl">
            <div className="text-center">
              <span className="text-[11px] font-bold text-neon-blue uppercase tracking-widest block mb-2">
                Live Public Section Replica
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight"
                style={{ color: current.franchiseInquiryHeadingColor || undefined }}
              >
                {renderFormattedText(heading)}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">
                  {renderFormattedText(accent)}
                </span>
              </h2>
              <p
                className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed"
                style={{ color: current.franchiseInquirySubtitleColor || undefined }}
              >
                {renderFormattedText(subtitle)}
              </p>
            </div>

            {/* Form Replica Card */}
            <div className="max-w-2xl mx-auto">
              <div className={`glass-card p-6 md:p-10 ${cardRadius} border ${getFormGlowClass(cardGlow)} shadow-2xl space-y-6 transition-all`}>
                {/* Row 1 */}
                {(showName || showEmail) && (
                  <div className={`grid grid-cols-1 ${showName && showEmail ? 'md:grid-cols-2' : ''} gap-5`}>
                    {showName && (
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                          {renderFormattedText(current.franchiseInquiryNameLabel || 'Full Name')}
                        </label>
                        <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/90 text-sm">
                          {current.franchiseInquiryNamePlaceholder || 'Sachin Tendulkar'}
                        </div>
                      </div>
                    )}
                    {showEmail && (
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                          {renderFormattedText(current.franchiseInquiryEmailLabel || 'Email Address')}
                        </label>
                        <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/90 text-sm">
                          {current.franchiseInquiryEmailPlaceholder || 'sachin@luxury.com'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2 */}
                {(showPhone || showCity) && (
                  <div className={`grid grid-cols-1 ${showPhone && showCity ? 'md:grid-cols-2' : ''} gap-5`}>
                    {showPhone && (
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                          {renderFormattedText(current.franchiseInquiryPhoneLabel || 'Phone Number')}
                        </label>
                        <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/90 font-mono text-sm">
                          {current.franchiseInquiryPhonePlaceholder || '98765 43210'}
                        </div>
                      </div>
                    )}
                    {showCity && (
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                          {renderFormattedText(current.franchiseInquiryCityLabel || 'Interested City')}
                        </label>
                        <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/90 text-sm flex items-center justify-between">
                          <span>{current.franchiseInquiryCityPlaceholder || 'e.g. Gorakhpur, Lucknow, Varanasi'}</span>
                          <MapPin size={16} className="text-slate-500" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Budget */}
                {showBudget && (
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                      {renderFormattedText(current.franchiseInquiryBudgetLabel || 'Investment Budget')}
                    </label>
                    <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-neon-pink font-semibold text-sm flex items-center justify-between">
                      <span>{current.franchiseInquiryBudgetPlaceholder || 'Select an investment range'}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({budgetOptions.length} Tiers Configured)</span>
                    </div>
                  </div>
                )}

                {/* Vision */}
                {showMessage && (
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                      {renderFormattedText(current.franchiseInquiryMessageLabel || 'Vision & Requirements')}
                    </label>
                    <div className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-400 text-xs italic min-h-[70px]">
                      {current.franchiseInquiryMessagePlaceholder || 'Tell us about your interest in Startup Cafe...'}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <div className={`w-full py-4 rounded-2xl ${getButtonGradientClass(buttonGradient)} text-white font-bold text-center text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2`}>
                    <span>{renderFormattedText(submitText)}</span>
                    <Send size={16} />
                  </div>
                </div>

                {/* WhatsApp button */}
                {isWhatsappVisible && (
                  <div className="pt-1 text-center">
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs font-bold shadow-sm">
                      <WhatsAppIcon size={16} />
                      <span>{renderFormattedText(whatsappButtonText)}</span>
                    </div>
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
