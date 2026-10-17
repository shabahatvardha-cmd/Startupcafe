import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MapPin, Globe, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import WhatsAppIcon from '../layout/WhatsAppIcon';
import { useSettings, DEFAULT_FRANCHISE_BUDGET_OPTIONS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

export default function InquiryForm() {
  const { settings } = useSettings();

  const heading = settings?.franchiseInquiryHeading || 'Start Your';
  const accent = settings?.franchiseInquiryAccent || 'Partner Journey';
  const subtitle = settings?.franchiseInquirySubtitle || "Take the first step towards owning a premium co-working franchise. Let's discuss your vision.";
  const budgetOptions = Array.isArray(settings?.franchiseInquiryBudgetOptions) && settings.franchiseInquiryBudgetOptions.length > 0
    ? settings.franchiseInquiryBudgetOptions
    : DEFAULT_FRANCHISE_BUDGET_OPTIONS;
  const submitText = settings?.franchiseInquirySubmitText || 'Submit Application';
  const whatsappButtonText = settings?.franchiseInquiryWhatsappText || 'WhatsApp Support';
  const whatsappNumber = (settings?.contactWhatsappNumber || '919670111167').replace(/\D/g, '');
  const whatsappMessage = settings?.franchiseInquiryWhatsappMessage || 'Hello Startup Cafe! I have just submitted a franchise inquiry form and would like to get more information about the partnership opportunity.';
  const successTitle = settings?.franchiseInquirySuccessTitle || 'Application Received!';
  const successMessage = settings?.franchiseInquirySuccessMessage || 'Thank you for your interest in partnering with us. Our franchise development team will review your details and contact you within 48 hours.';
  const headingColor = settings?.franchiseInquiryHeadingColor;
  const subtitleColor = settings?.franchiseInquirySubtitleColor;

  const nameLabel = settings?.franchiseInquiryNameLabel || 'Full Name';
  const namePlaceholder = settings?.franchiseInquiryNamePlaceholder || 'Sachin Tendulkar';
  const emailLabel = settings?.franchiseInquiryEmailLabel || 'Email Address';
  const emailPlaceholder = settings?.franchiseInquiryEmailPlaceholder || 'sachin@luxury.com';
  const phoneLabel = settings?.franchiseInquiryPhoneLabel || 'Phone Number';
  const phonePlaceholder = settings?.franchiseInquiryPhonePlaceholder || '98765 43210';
  const cityLabel = settings?.franchiseInquiryCityLabel || 'Interested City';
  const cityPlaceholder = settings?.franchiseInquiryCityPlaceholder || 'e.g. Gorakhpur, Lucknow, Varanasi';
  const budgetLabel = settings?.franchiseInquiryBudgetLabel || 'Investment Budget';
  const budgetPlaceholder = settings?.franchiseInquiryBudgetPlaceholder || 'Select an investment range';
  const messageLabel = settings?.franchiseInquiryMessageLabel || 'Vision & Requirements';
  const messagePlaceholder = settings?.franchiseInquiryMessagePlaceholder || 'Tell us about your interest in Startup Cafe...';
  const showWhatsapp = settings?.franchiseInquiryShowWhatsapp !== false;

  const showName = settings?.franchiseInquiryShowName !== false;
  const showEmail = settings?.franchiseInquiryShowEmail !== false;
  const showPhone = settings?.franchiseInquiryShowPhone !== false;
  const showCity = settings?.franchiseInquiryShowCity !== false;
  const showBudget = settings?.franchiseInquiryShowBudget !== false;
  const showMessage = settings?.franchiseInquiryShowMessage !== false;

  const cardRadius = settings?.franchiseInquiryCardRadius || 'rounded-[2.5rem]';
  const cardGlow = settings?.franchiseInquiryCardGlow || 'none';
  const buttonGradient = settings?.franchiseInquiryButtonGradient || 'default';
  const successNotice = settings?.franchiseInquirySuccessNotice || 'Our franchise development team will review your profile and connect within 48 hours.';

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

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    budget: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [citySync, setCitySync] = useState('');
  const [showCities, setShowCities] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Real-time city search using OpenStreetMap Nominatim API
  useEffect(() => {
    const fetchCities = async () => {
      if (citySync.length < 3) {
        setCitySuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citySync)}&format=json&addressdetails=1&countrycodes=in&limit=10`);
        const data = await response.json();

        const formatted = data.map(item => {
          const addr = item.address;
          const main = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || addr.city_district || addr.state_district || '';
          const state = addr.state || '';
          return {
            main: main,
            sub: `${state}, India`
          };
        })
          .filter(item => item.main && item.main.toLowerCase().includes(citySync.toLowerCase()))
          .filter((v, i, a) => a.findIndex(t => t.main === v.main && t.sub === v.sub) === i)
          .slice(0, 5);

        setCitySuggestions(formatted);
      } catch (error) {
        console.error("City search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [citySync]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }

    if (name === 'city') {
      setCitySync(value);
      setShowCities(true);
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectCity = (cityObj) => {
    const displayValue = `${cityObj.main}, ${cityObj.sub}`;
    setFormData(prev => ({ ...prev, city: displayValue }));
    setCitySync(displayValue);
    setShowCities(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      alert("❌ Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      // Try backend if available
      try {
        await fetch(`${API_BASE_URL}/api/franchise`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        // Backend not running / no MongoDB needed - continue smoothly on frontend
      }

      // Store in localStorage so inquiries are preserved on frontend
      try {
        const stored = JSON.parse(localStorage.getItem('startupcafe_franchise_inquiries') || '[]');
        stored.unshift({
          ...formData,
          id: Date.now(),
          timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('startupcafe_franchise_inquiries', JSON.stringify(stored));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      setSubmitted(true);
      // Reset form
      setFormData({
        fullName: '', email: '', phone: '', city: '', budget: '', message: ''
      });
      setCitySync('');
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    return (
      <section className="py-24 px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl mx-auto p-12 glass-card border border-neon-blue/20 text-center rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 pointer-events-none"></div>

          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              <CheckCircle2 className="text-green-500 w-12 h-12" />
            </motion.div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {renderFormattedText(successTitle)}
          </h2>
          <p className="text-slate-300 text-lg mb-4 max-w-md mx-auto leading-relaxed">
            {renderFormattedText(successMessage)}
          </p>
          {successNotice && (
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto italic">
              {renderFormattedText(successNotice)}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showWhatsapp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold shadow-lg transition-all group"
              >
                <WhatsAppIcon size={20} className="group-hover:rotate-12 transition-transform" />
                {renderFormattedText(whatsappButtonText)}
              </a>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-4 text-slate-300 border border-white/10 hover:bg-white/5 rounded-2xl font-bold transition-all cursor-pointer"
            >
              Submit New Inquiry
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="inquiry-form" className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-blue/10 blur-[150px] rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
            style={{ color: headingColor || undefined }}
          >
            {renderFormattedText(heading)}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">
              {renderFormattedText(accent)}
            </span>
          </motion.h2>
          <p
            className="text-slate-400 max-w-2xl mx-auto"
            style={{ color: subtitleColor || undefined }}
          >
            {renderFormattedText(subtitle)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`glass-card p-8 md:p-12 border ${getFormGlowClass(cardGlow)} ${cardRadius} shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all`}>
          {(showName || showEmail) && (
            <div className={`grid grid-cols-1 ${showName && showEmail ? 'md:grid-cols-2' : ''} gap-8 mb-8`}>
              {showName && (
                <div className="space-y-3">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    {renderFormattedText(nameLabel)}
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    placeholder={namePlaceholder}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all"
                  />
                </div>
              )}
              {showEmail && (
                <div className="space-y-3">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    {renderFormattedText(emailLabel)}
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder={emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-purple focus:bg-white/[0.05] transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {(showPhone || showCity) && (
            <div className={`grid grid-cols-1 ${showPhone && showCity ? 'md:grid-cols-2' : ''} gap-8 mb-8`}>
              {showPhone && (
                <div className="space-y-3">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    {renderFormattedText(phoneLabel)}
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder={phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all"
                  />
                </div>
              )}
              {showCity && (
                <div className="space-y-3">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    {renderFormattedText(cityLabel)}
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      name="city"
                      placeholder={cityPlaceholder}
                      value={citySync}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-purple focus:bg-white/[0.05] transition-all"
                    />
                    <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />

                    {/* City Suggestions Dropdown */}
                    {showCities && (citySuggestions.length > 0 || isSearching) && (
                      <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#0c0c0f] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                        {isSearching ? (
                          <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                            <span className="w-3 h-3 rounded-full border-2 border-neon-blue border-t-transparent animate-spin"></span>
                            Searching verified locations...
                          </div>
                        ) : (
                          citySuggestions.map((item, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectCity(item)}
                              className={`w-full text-left px-5 py-4 hover:bg-white/10 transition-all border-b border-white/5 last:border-none group cursor-pointer`}
                            >
                              <div className="flex items-center gap-3">
                                <Globe size={16} className="text-neon-blue group-hover:scale-110 transition-transform" />
                                <div>
                                  <p className="text-white font-bold text-sm">{item.main}</p>
                                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{item.sub}</p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {showBudget && (
            <div className="space-y-3 mb-8">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                {renderFormattedText(budgetLabel)}
              </label>
              <div className="relative">
                <select
                  required
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-pink focus:bg-white/[0.05] transition-all appearance-none [&>option]:bg-[#1a1a1a]"
                >
                  <option value="">{budgetPlaceholder}</option>
                  {budgetOptions.map((opt, i) => {
                    const val = typeof opt === 'string' ? opt : opt.value;
                    const label = typeof opt === 'string' ? (
                      opt.includes('20L') ? `Premium Range (${opt})`
                        : opt.includes('35L') ? `Elite Range (${opt})`
                          : opt.includes('50L') ? `Grand Range (${opt})`
                            : opt
                    ) : opt.label || opt.value;
                    return (
                      <option key={i} value={val}>{label}</option>
                    );
                  })}
                </select>
                <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
              </div>
            </div>
          )}

          {showMessage && (
            <div className="space-y-3 mb-10">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                {renderFormattedText(messageLabel)}
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder={messagePlaceholder}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-neon-blue focus:bg-white/[0.05] transition-all resize-none"
              ></textarea>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 md:py-5 flex items-center justify-center rounded-[1.25rem] ${getButtonGradientClass(buttonGradient)} text-white text-sm md:text-base font-black uppercase tracking-widest md:tracking-[0.2em] shadow-lg transition-all disabled:opacity-70 group relative overflow-hidden cursor-pointer`}
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
                <span className="relative z-10">{submitText}</span>
                <Send className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>

          {showWhatsapp && (
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 text-[#25D366] text-xs font-bold transition-all group shadow-sm hover:shadow-[0_0_20px_rgba(37,211,102,0.2)]"
              >
                <WhatsAppIcon size={16} className="group-hover:rotate-12 transition-transform" />
                <span>{renderFormattedText(whatsappButtonText)}</span>
              </a>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
