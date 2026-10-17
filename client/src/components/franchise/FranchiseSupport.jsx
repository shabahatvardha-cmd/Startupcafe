import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, DEFAULT_SUPPORT_ITEMS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';
import {
  MapPin,
  Palette,
  Megaphone,
  Cpu,
  GraduationCap,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Users,
  BarChart3,
  Target,
  Rocket,
  Zap,
  Award,
  Store,
  Coffee,
  Laptop,
  Handshake,
  Compass,
  FileCheck,
  PhoneCall,
  Clock,
  Sparkles,
  TrendingUp,
  Download,
  X,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

const SUPPORT_ICON_MAP = {
  MapPin,
  Palette,
  Megaphone,
  Cpu,
  GraduationCap,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Users,
  BarChart3,
  Target,
  Rocket,
  Zap,
  Award,
  Store,
  Coffee,
  Laptop,
  Handshake,
  Compass,
  FileCheck,
  PhoneCall,
  Clock,
  Sparkles,
  TrendingUp,
};

function resolveSupportIcon(item, fallbackIdx = 0) {
  if (item.iconName && SUPPORT_ICON_MAP[item.iconName]) {
    return SUPPORT_ICON_MAP[item.iconName];
  }
  if (item.icon) {
    return item.icon;
  }
  const defaults = [MapPin, Palette, Megaphone, Cpu, GraduationCap];
  return defaults[fallbackIdx % defaults.length] || LifeBuoy;
}

export default function FranchiseSupport() {
  const { settings, defaultSettings } = useSettings();
  const current = settings || defaultSettings || {};

  const supportItems = Array.isArray(current.supportItemsList) && current.supportItemsList.length > 0
    ? current.supportItemsList
    : DEFAULT_SUPPORT_ITEMS;

  const layoutStyle = current.supportLayoutStyle || 'grid';

  // Section Header Data
  const badgeText = current.supportBadge !== undefined ? current.supportBadge : 'Comprehensive Ecosystem';
  const headingText = current.supportHeading !== undefined ? current.supportHeading : 'Unmatched';
  const accentText = current.supportAccent !== undefined ? current.supportAccent : 'Support';
  const subtitleText = current.supportSubtitle !== undefined
    ? current.supportSubtitle
    : 'You are never alone on your journey. Our expert teams are with you from day one to ensure your cafe is a massive success.';

  const headingColor = current.supportHeadingColor || undefined;
  const subtitleColor = current.supportSubtitleColor || undefined;

  // Brochure CTA Card Data
  const ctaTitle = current.supportCtaTitle !== undefined ? current.supportCtaTitle : 'Ready to Lead?';
  const ctaSubtitle = current.supportCtaSubtitle !== undefined
    ? current.supportCtaSubtitle
    : 'Download our complete franchise brochure to see the full list of support services.';
  const ctaButtonText = current.supportCtaButton !== undefined ? current.supportCtaButton : 'Download Brochure';
  const brochureUrl = current.supportBrochureUrl || '/StartUp%20Cafe%20Brochure.pdf';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Tab Showcase State
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('कृपया अपना नाम भरें (Please enter your name)');
      return;
    }
    if (formData.phone.trim().length !== 10) {
      alert('कृपया 10 अंकों का मान्य मोबाइल नंबर भरें (Please enter a valid 10-digit phone number)');
      return;
    }
    if (!formData.email.trim()) {
      alert('कृपया अपना ईमेल भरें (Please enter your email)');
      return;
    }

    setLoading(true);

    try {
      // Post details to dedicated brochure download API endpoint
      const response = await fetch(`${API_BASE_URL}/api/brochure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('⚠️ Backend submission warning:', errorData);
      }
    } catch (err) {
      console.error('⚠️ Connection error while saving lead to backend:', err);
    } finally {
      // Trigger PDF Download
      const link = document.createElement('a');
      link.href = brochureUrl;
      link.download = brochureUrl.split('/').pop() || 'StartUp Cafe Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
      setSubmitted(true);

      // Close modal after 2.5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', email: '' });
      }, 2500);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitted(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <section id="support" className="py-20 md:py-24 px-6 md:px-12 bg-white/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-3"
            >
              <span className="px-3.5 py-1 text-xs font-semibold tracking-wider text-neon-purple uppercase border border-neon-purple/30 rounded-full bg-neon-purple/10 backdrop-blur-md">
                {renderFormattedText(badgeText)}
              </span>
            </motion.div>
          )}

          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ color: headingColor }}
          >
            {renderFormattedText(headingText)}{' '}
            <span className="text-neon-purple">
              {renderFormattedText(accentText)}
            </span>
          </h2>

          <p
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: subtitleColor }}
          >
            {renderFormattedText(subtitleText)}
          </p>
        </div>

        {/* =========================================================================
            STYLE 1: BENTO GRID + CTA CARD (ORIGINAL DEFAULT - 100% UNTOUCHED BASELINE)
            ========================================================================= */}
        {layoutStyle === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportItems.map((item, index) => {
              const ItemIcon = resolveSupportIcon(item, index);
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 md:p-8 rounded-3xl bg-dark-bg/60 border border-white/5 hover:border-neon-purple/50 transition-all group"
                >
                  <div className="mb-6 p-3 md:p-4 bg-neon-purple/10 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-neon-purple group-hover:text-black transition-all">
                    <ItemIcon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                    {renderFormattedText(item.title)}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                    {renderFormattedText(item.desc)}
                  </p>
                </motion.div>
              );
            })}

            {/* Original Gradient Brochure CTA Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-neon-blue to-neon-purple flex flex-col justify-center items-center text-center shadow-xl min-h-[250px]"
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {renderFormattedText(ctaTitle)}
              </h3>
              <p className="text-white/80 mb-6 text-xs md:text-sm max-w-xs">
                {renderFormattedText(ctaSubtitle)}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform text-sm md:text-base cursor-pointer shadow-lg hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
                {renderFormattedText(ctaButtonText)}
              </button>
            </motion.div>
          </div>
        )}

        {/* =========================================================================
            STYLE 2: INTERACTIVE TAB SHOWCASE (LEFT TABS + RIGHT FEATURE SPOTLIGHT)
            ========================================================================= */}
        {layoutStyle === 'interactive-tabs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Pillars List (5 Cols) */}
              <div className="lg:col-span-5 space-y-2.5 flex flex-col justify-center">
                {supportItems.map((item, index) => {
                  const ItemIcon = resolveSupportIcon(item, index);
                  const isSelected = activeTabIndex === index;
                  return (
                    <div
                      key={item.id || index}
                      onClick={() => setActiveTabIndex(index)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-neon-purple/20 to-transparent border-neon-purple shadow-[0_0_20px_rgba(176,38,255,0.25)]'
                          : 'bg-dark-bg/60 border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl transition-all ${
                          isSelected ? 'bg-neon-purple text-white shadow-[0_0_12px_#b026ff]' : 'bg-white/5 text-slate-400'
                        }`}>
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-bold text-white">
                            {renderFormattedText(item.title)}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Pillar 0{index + 1}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={isSelected ? 'text-neon-purple translate-x-1' : 'text-slate-600'} />
                    </div>
                  );
                })}
              </div>

              {/* Right Featured Spotlight Card (7 Cols) */}
              <div className="lg:col-span-7">
                {(() => {
                  const activeItem = supportItems[activeTabIndex] || supportItems[0];
                  const ActiveIcon = resolveSupportIcon(activeItem, activeTabIndex);
                  return (
                    <motion.div
                      key={activeTabIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full p-8 md:p-10 rounded-3xl bg-dark-bg/90 border-2 border-neon-purple/40 shadow-[0_0_35px_rgba(176,38,255,0.2)] flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="p-4 bg-neon-purple/15 text-neon-purple rounded-2xl border border-neon-purple/30 shadow-[0_0_20px_rgba(176,38,255,0.3)]">
                            <ActiveIcon className="w-10 h-10" />
                          </div>
                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                            Support Pillar 0{activeTabIndex + 1}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                          {renderFormattedText(activeItem.title)}
                        </h3>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                          {renderFormattedText(activeItem.desc)}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs text-slate-400 font-mono">
                          Backed by 10+ years of startup cafe operational expertise.
                        </div>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-5 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-purple/90 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(176,38,255,0.4)] cursor-pointer shrink-0 transition-transform hover:scale-105"
                        >
                          <Download size={14} />
                          <span>Get Full Support Specs</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>

            {/* Bottom Full-Width CTA Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-transparent border border-neon-purple/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{renderFormattedText(ctaTitle)}</h4>
                <p className="text-slate-300 text-sm max-w-xl">{renderFormattedText(ctaSubtitle)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform text-sm cursor-pointer shadow-lg hover:bg-slate-100 flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{renderFormattedText(ctaButtonText)}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STYLE 3: NUMBERED TECH CARDS & BANNER (CLEAN MODERN CARDS + CTA STRIP)
            ========================================================================= */}
        {layoutStyle === 'compact-cards' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportItems.map((item, index) => {
                const ItemIcon = resolveSupportIcon(item, index);
                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="p-6 md:p-7 rounded-3xl bg-dark-bg/80 border border-white/10 hover:border-emerald-400/50 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-2xl border border-emerald-400/20 group-hover:scale-110 transition-transform">
                          <ItemIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400/80 px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {renderFormattedText(item.title)}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {renderFormattedText(item.desc)}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                      <span>Full Operational Assistance</span>
                      <ArrowRight size={12} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
            >
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Brochure &amp; Franchise Kit
                </span>
                <h4 className="text-2xl font-bold text-white mb-1">{renderFormattedText(ctaTitle)}</h4>
                <p className="text-slate-300 text-sm max-w-xl">{renderFormattedText(ctaSubtitle)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl hover:scale-105 transition-transform text-sm cursor-pointer shadow-lg shadow-emerald-400/20 flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{renderFormattedText(ctaButtonText)}</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* =========================================================================
            STYLE 4: DUAL COLUMN & STICKY CTA (HIGH CONVERSION)
            ========================================================================= */}
        {layoutStyle === 'split-columns' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Dual-Column Cards (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {supportItems.map((item, index) => {
                const ItemIcon = resolveSupportIcon(item, index);
                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="p-6 rounded-3xl bg-dark-bg/70 border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="p-3 bg-amber-400/10 text-amber-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <ItemIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {renderFormattedText(item.title)}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {renderFormattedText(item.desc)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Sticky CTA Card (4 Cols) */}
            <div className="lg:col-span-4 sticky top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-dark-card to-dark-bg border-2 border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.2)] text-center relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Download size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {renderFormattedText(ctaTitle)}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {renderFormattedText(ctaSubtitle)}
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl hover:scale-105 transition-all text-sm cursor-pointer shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>{renderFormattedText(ctaButtonText)}</span>
                </button>

                <p className="text-[11px] text-slate-500 mt-4 font-mono">
                  Instant PDF download with full architectural SOPs and unit economics.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          DOWNLOAD BROCHURE FORM MODAL (100% UNTOUCHED API & LEAD CAPTURE LOGIC)
          ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl overflow-hidden text-white"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Your details have been recorded and your PDF brochure is downloading automatically.
                  </p>
                  <p className="text-xs text-neon-purple font-medium">धन्यवाद! ब्रोशर डाउनलोड हो रहा है...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-neon-purple/20 text-neon-purple rounded-2xl">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Download Brochure</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Please fill details to download PDF</p>
                    </div>
                  </div>

                  <form onSubmit={handleBrochureSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Name / नाम <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone Number / फोन नंबर <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email / ईमेल <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neon-purple/20 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Submit & Download PDF</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
