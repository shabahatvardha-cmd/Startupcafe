import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useSettings, DEFAULT_FORM_FIELDS_CONFIG, DEFAULT_OFFICE_LOCATIONS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';
import WhatsAppIcon from '../layout/WhatsAppIcon';

// Helper to extract clean URL from raw URL or full pasted <iframe> code
const extractMapSrc = (input) => {
  if (!input) return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.08277259169!2d83.303977598466!3d26.7634863378516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991446a0c332489%3A0x1ff3f97fdcc6b711!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714080123512!5m2!1sen!2sin";
  const trimmed = input.trim();
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) return iframeMatch[1];
  return trimmed;
};

export default function Contact({ selectedBooking }) {
  const { settings } = useSettings();
  const {
    contactHeading = 'Book Your',
    contactAccent = 'Workspace',
    contactDescription = 'Ready to level up your workspace? Reserve your spot today.',
    accentColor = '#b026ff',
    gradientEnd = '#00f0ff',
    contactHeadingColor,
    contactDescriptionColor,
    // Map Portion Settings (100% backward compatible defaults)
    mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.08277259169!2d83.303977598466!3d26.7634863378516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991446a0c332489%3A0x1ff3f97fdcc6b711!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714080123512!5m2!1sen!2sin',
    mapHeight = '400px',
    mapDarkModeFilter = true,
    mapFilterPreset = 'cyberpunk',
    mapRadius = 'rounded-2xl',
    mapBorderGlow = 'none',
    contactOffice1Title = 'Mumbai Office',
    contactOffice1Address = 'Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051',
    contactOffice2Title = 'Gorakhpur Hub',
    contactOffice2Address = '2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, Uttar Pradesh - 273001',
    contactOfficesList = DEFAULT_OFFICE_LOCATIONS,
    contactPhone = '+91 96701 11167',
    contactEmail = 'startupcafegkp@gmail.com',
    contactWhatsappNumber = '919670111167',
    // Form Portion Settings & Dynamic Fields
    contactFormFieldsConfig = DEFAULT_FORM_FIELDS_CONFIG,
    contactFormSubmitText = 'Confirm Booking',
    contactFormWhatsappCtaText = 'Quick Inquiry via WhatsApp',
    contactWhatsappInquiryMessage = "Hello Startup Cafe! I'm reaching out from your website to make an inquiry.",
    contactSuccessTitle = 'Request Received!',
    contactSuccessMessage = 'Our team will review your booking and contact you shortly to confirm.',
    contactSuccessNotice = 'For immediate assistance, feel free to reach out via WhatsApp.',
    contactSuccessWhatsappButtonText = 'WhatsApp Now',
    contactSuccessWhatsappMessage = 'Hello Startup Cafe! I have just submitted a booking request on your website and would like to follow up on it.',
  } = settings || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    planType: '',
    duration: 'Monthly',
    date: '',
    people: '1',
    location: '',
    message: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const planPrices = {
    'Day Pass – ₹499/day': 499,
    'Conference Room – ₹999/hr': 999,
    'Private Cabin (Daily) – ₹999/hr': 999,
    'Dedicated Desk – ₹6999/month': 6999,
    'Private Cabin (Monthly) – ₹29999/month': 29999
  };

  // All Startup Cafe Hubs and Locations (Mumbai, Gorakhpur, Hyderabad)
  const defaultHubLocations = [
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

  // Dynamic office locations with 100% backward compatible fallback
  const activeOffices = Array.isArray(contactOfficesList) && contactOfficesList.length > 0
    ? contactOfficesList.filter(o => o.visible !== false)
    : [
      {
        id: 'office-1',
        title: contactOffice1Title || 'Mumbai Office',
        address: contactOffice1Address,
        iconType: 'Building2',
        color: 'text-neon-blue'
      },
      {
        id: 'office-2',
        title: contactOffice2Title || 'Gorakhpur Hub',
        address: contactOffice2Address,
        iconType: 'MapPin',
        color: 'text-neon-pink'
      }
    ].filter(o => o.address);

  const hubOptions = [
    ...activeOffices.map(o => `${o.title} — ${o.address}`),
    ...defaultHubLocations
  ].filter((loc, idx, self) => self.indexOf(loc) === idx);

  const [locationSuggestions, setLocationSuggestions] = useState(hubOptions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (selectedBooking) {
      setFormData(prev => ({
        ...prev,
        planType: selectedBooking.planName,
        duration: selectedBooking.duration
      }));
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (formData.planType.includes('Day Pass') || formData.planType.includes('Daily') || formData.planType.includes('Conference Room')) {
      setFormData(prev => ({ ...prev, duration: 'Daily' }));
    } else if (formData.planType.includes('Monthly') || formData.planType.includes('Dedicated Desk')) {
      setFormData(prev => ({ ...prev, duration: 'Monthly' }));
    }
  }, [formData.planType]);

  useEffect(() => {
    let base = planPrices[formData.planType];
    if (base === undefined) {
      const match = formData.planType.match(/₹(\d+)/);
      base = match ? parseInt(match[1], 10) : (selectedBooking?.basePrice || 0);
    }
    const people = formData.planType.includes('Private Cabin') ? 1 : parseInt(formData.people) || 1;
    setTotalPrice(base * people);
  }, [formData.planType, formData.people, selectedBooking]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Only allow numbers and max 10 digits
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }

    if (name === 'location') {
      const query = value.trim().toLowerCase();
      setHighlightedIndex(-1);
      if (!query) {
        setLocationSuggestions(hubOptions);
        setShowSuggestions(true);
      } else {
        const filtered = hubOptions.filter(loc =>
          loc.toLowerCase().includes(query)
        );
        setLocationSuggestions(filtered);
        setShowSuggestions(true);
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (inputDate) => {
    if (!inputDate) return "";
    if (inputDate.includes('-') && inputDate.split('-')[0].length === 4) return inputDate;

    const parts = inputDate.split("-");
    if (parts.length !== 3) return inputDate;

    // Check if it's DD-MM-YYYY or YYYY-MM-DD
    const [p1, p2, p3] = parts;
    if (p1.length === 4) return inputDate; // already YYYY-MM-DD
    return `${p3}-${p2}-${p1}`;
  };

  // Merge dynamic form configuration with default fallbacks
  const formConfig = {
    ...DEFAULT_FORM_FIELDS_CONFIG,
    ...(contactFormFieldsConfig || {}),
  };

  // Dynamically centers and pins the Google Map to the selected location
  const getDynamicMapSrc = () => {
    if (!formData.location || !formData.location.trim()) {
      return extractMapSrc(mapEmbedUrl);
    }
    let query = formData.location.trim();
    if (query.includes(' — ')) {
      query = query.split(' — ')[1] || query;
    }
    query = query.replace(/^Startup Cafe\s*[–-]\s*/i, '').trim();
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const getMapFilter = () => {
    if (mapFilterPreset === 'natural' || mapDarkModeFilter === false) return 'none';
    if (mapFilterPreset === 'grayscale') return 'grayscale(100%) invert(90%)';
    if (mapFilterPreset === 'midnight') return 'invert(95%) hue-rotate(200deg) brightness(85%) contrast(120%)';
    if (mapFilterPreset === 'muted') return 'sepia(40%) contrast(110%) brightness(90%)';
    return 'invert(90%) hue-rotate(180deg)';
  };

  const getMapGlowClass = () => {
    switch (mapBorderGlow) {
      case 'blue': return 'border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.25)]';
      case 'purple': return 'border-purple-500/40 shadow-[0_0_25px_rgba(176,38,255,0.25)]';
      case 'pink': return 'border-pink-500/40 shadow-[0_0_25px_rgba(255,41,117,0.25)]';
      default: return 'border-white/10';
    }
  };

  const getFormGlowClass = () => {
    switch (formConfig.formCardGlow) {
      case 'blue': return 'border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]';
      case 'purple': return 'border-purple-500/40 shadow-[0_0_30px_rgba(176,38,255,0.2)]';
      case 'pink': return 'border-pink-500/40 shadow-[0_0_30px_rgba(255,41,117,0.2)]';
      default: return 'border-white/10';
    }
  };

  const getButtonGradientClass = () => {
    switch (formConfig.buttonGradient) {
      case 'pink-purple': return 'bg-gradient-to-r from-neon-pink to-neon-purple hover:shadow-[0_0_20px_rgba(255,41,117,0.4)]';
      case 'emerald': return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]';
      case 'amber': return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]';
      default: return 'bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]';
    }
  };

  const handleLocationKeyDown = (e) => {
    if (!showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlightedIndex(0);
      return;
    }

    if (showSuggestions && locationSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < locationSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : locationSuggestions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < locationSuggestions.length) {
          setFormData((prev) => ({ ...prev, location: locationSuggestions[highlightedIndex] }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formConfig.showPhoneField !== false && formData.phone.length !== 10) {
        alert("❌ Please enter a valid 10-digit phone number.");
        setLoading(false);
        return;
      }

      // Safe defaults so MongoDB backend schema is satisfied even if admin hides/deletes fields
      const bookingData = {
        name: formData.name || "Customer",
        email: formData.email || "inquiry@startupcafe.in",
        phone: formData.phone || "9999999999",
        plan: formData.planType || "Day Pass – ₹499/day",
        duration: formData.duration || "Daily",
        date: formatDate(formData.date) || today,
        people: Number(formData.people) || 1,
        location: formData.location || "Startup Cafe Hub",
        message: formData.message || "N/A"
      };

      // Dual-sync: Try backend (MongoDB/Express), gracefully fallback to frontend cache
      try {
        const response = await fetch(`${API_BASE_URL}/api/book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });
        if (response.ok) {
          console.log("✅ Booking saved to backend database successfully");
        }
      } catch (err) {
        console.log("ℹ️ Backend server unreachable, booking saved to local browser cache");
      }

      // Store in localStorage so bookings are always accessible on frontend
      try {
        const stored = JSON.parse(localStorage.getItem('startupcafe_local_bookings') || '[]');
        stored.unshift({
          ...bookingData,
          id: Date.now(),
          timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('startupcafe_local_bookings', JSON.stringify(stored));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      alert("✅ Booking successful! Your seat request has been recorded.");
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '', email: '', phone: '', planType: '', duration: 'Monthly', date: '', people: '1', location: '', message: ''
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const activePricingPlans = Array.isArray(settings?.pricingPlans) && settings.pricingPlans.length > 0
    ? settings.pricingPlans
    : null;

  const dynamicPlanOptions = activePricingPlans ? activePricingPlans.map(plan => {
    const isMonthly = plan.monthlyPrice !== null && plan.monthlyPrice !== undefined;
    const duration = isMonthly ? 'Monthly' : 'Daily';
    const price = isMonthly ? plan.monthlyPrice : plan.dailyPrice;
    let label = plan.name;
    if (plan.name === 'Private Cabin') {
      label = `Private Cabin (${duration})`;
    }
    let suffix = duration === 'Monthly' ? '/month' : '/day';
    if (plan.priceUnit) {
      if (plan.priceUnit.includes('hour') || plan.priceUnit === '/hr') suffix = '/hr';
      else if (plan.priceUnit.includes('mo') || plan.priceUnit === '/month') suffix = '/month';
      else if (plan.priceUnit.includes('day')) suffix = '/day';
      else suffix = plan.priceUnit.startsWith('/') ? plan.priceUnit : `/${plan.priceUnit}`;
    } else if (plan.name === 'Conference Room' || (plan.name === 'Private Cabin' && duration === 'Daily')) {
      suffix = '/hr';
    }
    return `${label} – ₹${price}${suffix}`;
  }) : [
    'Day Pass – ₹499/day',
    'Conference Room – ₹999/hr',
    'Private Cabin (Daily) – ₹999/hr',
    'Dedicated Desk – ₹6999/month',
    'Private Cabin (Monthly) – ₹29999/month'
  ];

  const planDropdownOptions = formData.planType && !dynamicPlanOptions.includes(formData.planType)
    ? [formData.planType, ...dynamicPlanOptions]
    : dynamicPlanOptions;

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 border-t border-white/5 scroll-mt-28">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ color: contactHeadingColor || undefined }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {renderFormattedText(contactHeading)}{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientEnd}, ${accentColor})`
            }}
          >
            {renderFormattedText(contactAccent)}
          </span>
        </motion.h2>
        <p
          style={{ color: contactDescriptionColor || undefined }}
          className="text-slate-400"
        >
          {renderFormattedText(contactDescription)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 order-2 lg:order-1"
        >
          <div
            className={`glass-card p-1 overflow-hidden ${mapRadius || 'rounded-2xl'} relative border ${getMapGlowClass()}`}
            style={{ height: mapHeight || '400px' }}
          >
            {formData.location && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-neon-blue/40 text-white text-xs font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <MapPin className="text-neon-blue shrink-0 animate-pulse" size={14} />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  {formData.location.split(' — ')[0]}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, location: '' }))}
                  className="ml-1 text-slate-400 hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/10"
                  title="Reset to default map"
                >
                  ✕
                </button>
              </div>
            )}
            <iframe
              key={getDynamicMapSrc()}
              src={getDynamicMapSrc()}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: getMapFilter()
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Startup Cafe Map - ${formData.location || 'Default'}`}
            ></iframe>
          </div>

          <div className="space-y-6">
            {/* Dynamic Office Hub Cards (Interactive: click to focus map & select) */}
            {activeOffices.map((office, idx) => {
              const IconComponent = office.iconType === 'MapPin' ? MapPin : Building2;
              const colorClass = office.color || (idx % 2 === 0 ? 'text-neon-blue' : 'text-neon-pink');
              const isSelected = formData.location && (
                formData.location.includes(office.title) ||
                (office.address && formData.location.includes(office.address))
              );
              return (
                <div
                  key={office.id || idx}
                  onClick={() => {
                    const chosen = `${office.title} — ${office.address}`;
                    setFormData(p => ({ ...p, location: chosen }));
                  }}
                  className={`flex items-start gap-4 p-3.5 rounded-xl transition-all cursor-pointer border ${isSelected
                      ? 'bg-white/10 border-neon-blue/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  title="Click to view on map and select in form"
                >
                  <div className="p-3 bg-white/5 rounded-full border border-white/10 shrink-0 mt-0.5">
                    <IconComponent className={colorClass} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs uppercase font-bold tracking-wider ${colorClass} mb-1`}>
                        {renderFormattedText(office.title || 'Office Hub')}
                      </p>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue font-bold border border-neon-blue/40 shrink-0">
                          ✓ On Map
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {renderFormattedText(office.address)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 bg-white/5 rounded-full border border-white/10 shrink-0"><Phone className="text-neon-blue" size={18} /></div>
                <a href={`tel:${(contactPhone || '+91 96701 11167').replace(/\s+/g, '')}`} className="text-sm font-medium hover:text-white transition-colors">
                  {contactPhone || '+91 96701 11167'}
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 bg-white/5 rounded-full border border-white/10 shrink-0"><Mail className="text-neon-purple" size={18} /></div>
                <a href={`mailto:${contactEmail || 'startupcafegkp@gmail.com'}`} className="text-sm font-medium hover:text-white transition-colors">
                  {contactEmail || 'startupcafegkp@gmail.com'}
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          id="booking-form"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`glass-card p-8 md:p-12 ${formConfig.formCardRadius || 'rounded-3xl'} relative overflow-hidden order-1 lg:order-2 scroll-mt-28 border ${getFormGlowClass()}`}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                >
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {renderFormattedText(contactSuccessTitle || 'Request Received!')}
              </h3>
              <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                {renderFormattedText(contactSuccessMessage || 'Our team will review your booking and contact you shortly to confirm.')} <br />
                <span className="text-slate-400 text-sm mt-4 block italic">
                  {renderFormattedText(contactSuccessNotice || 'For immediate assistance, feel free to reach out via WhatsApp.')}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <a
                  href={`https://wa.me/${(contactWhatsappNumber || '919670111167').replace(/\D/g, '')}?text=${encodeURIComponent(contactSuccessWhatsappMessage || "Hello Startup Cafe! I have just submitted a booking request on your website and would like to follow up on it.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white transition-all shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)]"
                >
                  <WhatsAppIcon size={20} />
                  {renderFormattedText(contactSuccessWhatsappButtonText || 'WhatsApp Now')}
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="flex-1 py-4 rounded-xl font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
                >
                  New Booking
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {selectedBooking && (
                <div className="mb-8 p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="text-sm font-bold uppercase tracking-wider mb-1">You selected:</p>
                  <p className="text-xl font-bold text-white">{selectedBooking.planName} — {selectedBooking.price}/{selectedBooking.duration.toLowerCase() === 'daily' ? 'day' : 'month'}</p>
                </div>
              )}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Row 1: Full Name & Email */}
                {(formConfig.showNameField !== false || formConfig.showEmailField !== false) && (
                  <div className={`grid grid-cols-1 ${formConfig.showNameField !== false && formConfig.showEmailField !== false ? 'md:grid-cols-2' : ''} gap-8 mt-4`}>
                    {formConfig.showNameField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.nameLabel || 'Full Name')}
                        </label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all" placeholder={formConfig.namePlaceholder || 'Rohan Singh'} />
                      </div>
                    )}
                    {formConfig.showEmailField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.emailLabel || 'Email Address')}
                        </label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all" placeholder={formConfig.emailPlaceholder || 'rohan@example.com'} />
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2: Phone & Plan Type */}
                {(formConfig.showPhoneField !== false || formConfig.showPlanField !== false) && (
                  <div className={`grid grid-cols-1 ${formConfig.showPhoneField !== false && formConfig.showPlanField !== false ? 'md:grid-cols-2' : ''} gap-8`}>
                    {formConfig.showPhoneField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.phoneLabel || 'Phone Number')}
                        </label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all"
                          placeholder={formConfig.phonePlaceholder || '98765 43210'}
                        />
                      </div>
                    )}
                    {formConfig.showPlanField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.planLabel || 'Plan Type')}
                        </label>
                        <div className="relative">
                          <select name="planType" value={formData.planType} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all appearance-none [&>option]:bg-[#1a1a1a] cursor-pointer">
                            <option value="">Select a Plan</option>
                            {planDropdownOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Row 3: Duration, Date, People */}
                {(formConfig.showDurationSwitch !== false || formConfig.showDateField !== false || (formConfig.showPeopleField !== false && !formData.planType.includes('Private Cabin'))) && (
                  <div className={`grid grid-cols-1 ${((formConfig.showDurationSwitch !== false ? 1 : 0) +
                      (formConfig.showDateField !== false ? 1 : 0) +
                      (formConfig.showPeopleField !== false && !formData.planType.includes('Private Cabin') ? 1 : 0)) === 3
                      ? 'lg:grid-cols-3'
                      : ((formConfig.showDurationSwitch !== false ? 1 : 0) +
                        (formConfig.showDateField !== false ? 1 : 0) +
                        (formConfig.showPeopleField !== false && !formData.planType.includes('Private Cabin') ? 1 : 0)) === 2
                        ? 'md:grid-cols-2'
                        : ''
                    } gap-8`}>
                    {formConfig.showDurationSwitch !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.durationLabel || 'Duration')}
                        </label>
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 relative min-h-[50px]">
                          <button
                            type="button"
                            disabled={formData.planType.includes('Dedicated Desk') || formData.planType.includes('Monthly')}
                            onClick={() => setFormData(p => ({ ...p, duration: 'Daily' }))}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all relative z-10 ${formData.duration === 'Daily' ? 'text-white' : 'text-slate-500 disabled:opacity-30'}`}
                          >
                            Daily
                          </button>
                          <button
                            type="button"
                            disabled={formData.planType.includes('Day Pass') || formData.planType.includes('Daily') || formData.planType.includes('Conference Room')}
                            onClick={() => setFormData(p => ({ ...p, duration: 'Monthly' }))}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all relative z-10 ${formData.duration === 'Monthly' ? 'text-white' : 'text-slate-600 disabled:opacity-30'}`}
                          >
                            Monthly
                          </button>
                          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg transition-transform duration-300 ${formData.duration === 'Monthly' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    )}
                    {formConfig.showDateField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.dateLabel || 'Start Date')}
                        </label>
                        <input
                          required
                          type="date"
                          name="date"
                          min={today}
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all [color-scheme:dark]"
                        />
                      </div>
                    )}
                    {formConfig.showPeopleField !== false && !formData.planType.includes('Private Cabin') && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.peopleLabel || 'People')}
                        </label>
                        <input type="number" min="1" name="people" value={formData.people} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all" />
                      </div>
                    )}
                  </div>
                )}

                {/* Row 4: Location & Message */}
                {(formConfig.showLocationField !== false || formConfig.showMessageField !== false) && (
                  <div className={`grid grid-cols-1 ${formConfig.showLocationField !== false && formConfig.showMessageField !== false ? 'lg:grid-cols-2' : ''} gap-8`}>
                    {formConfig.showLocationField !== false && (
                      <div className="space-y-2 relative">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.locationLabel || 'Location')}
                        </label>
                        <div className="relative group">
                          <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={(e) => {
                              handleChange(e);
                              setHighlightedIndex(-1);
                            }}
                            onBlur={() => setTimeout(() => { setShowSuggestions(false); setHighlightedIndex(-1); }, 250)}
                            onFocus={() => {
                              setLocationSuggestions(formData.location ? hubOptions.filter(l => l.toLowerCase().includes(formData.location.toLowerCase())) : hubOptions);
                              setShowSuggestions(true);
                              const foundIdx = hubOptions.findIndex(h => h === formData.location);
                              setHighlightedIndex(foundIdx >= 0 ? foundIdx : -1);
                            }}
                            onKeyDown={handleLocationKeyDown}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all"
                            placeholder={formConfig.locationPlaceholder || 'Select hub (Gorakhpur Hub, Mumbai Office)'}
                            autoComplete="off"
                          />
                          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                        </div>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                          {showSuggestions && locationSuggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-[60] left-0 right-0 top-full mt-2 glass-card border border-white/10 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto shadow-2xl bg-black/95"
                            >
                              {locationSuggestions.map((loc, i) => {
                                const isHighlighted = highlightedIndex === i;
                                const isSelected = formData.location === loc;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setFormData(prev => ({ ...prev, location: loc }));
                                      setShowSuggestions(false);
                                      setHighlightedIndex(-1);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(i)}
                                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-b border-white/5 last:border-0 flex items-center justify-between gap-2.5 cursor-pointer ${isHighlighted
                                        ? 'bg-neon-blue/20 text-white font-medium'
                                        : isSelected
                                          ? 'bg-white/10 text-white'
                                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <MapPin size={13} className={isHighlighted || isSelected ? 'text-neon-blue shrink-0' : 'text-neon-pink shrink-0'} />
                                      <span className="truncate">{loc}</span>
                                    </div>
                                    {isHighlighted && (
                                      <span className="text-[10px] text-neon-blue font-mono uppercase shrink-0 bg-neon-blue/10 px-1.5 py-0.5 rounded border border-neon-blue/30">
                                        ↵ Enter
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {formConfig.showMessageField !== false && (
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider ml-1">
                          {renderFormattedText(formConfig.messageLabel || 'Message (Optional)')}
                        </label>
                        <textarea rows={1} name="message" value={formData.message} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all resize-none" placeholder={formConfig.messagePlaceholder || 'Special requirements?'}></textarea>
                      </div>
                    )}
                  </div>
                )}

                {/* Total Price breakdown */}
                {formConfig.showPriceBreakdown !== false && totalPrice > 0 && (
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-white">₹{totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Breakdown</p>
                      <p className="text-xs text-slate-400">
                        {formData.planType} x {formData.planType === 'Private Cabin' ? 1 : formData.people}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold ${getButtonGradientClass()} text-white transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : renderFormattedText(contactFormSubmitText || 'Confirm Booking')}
                </button>

                {formConfig.showWhatsappButton !== false && (
                  <a
                    href={`https://wa.me/${(contactWhatsappNumber || '919670111167').replace(/\D/g, '')}?text=${encodeURIComponent(contactWhatsappInquiryMessage || "Hello Startup Cafe! I'm reaching out from your website to make an inquiry.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
                  >
                    <WhatsAppIcon size={18} />
                    {renderFormattedText(contactFormWhatsappCtaText || 'Quick Inquiry via WhatsApp')}
                  </a>
                )}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
