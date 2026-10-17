import { useState } from 'react';
import { renderFormattedText } from '../../utils/textFormatter';
import { EyeIcon, TypeIcon, PaletteIcon } from './adminIcons';
import {
  Award,
  ShieldCheck,
  Zap,
  Handshake,
  Globe,
  TrendingUp,
  Users,
  Target,
  Rocket,
  Crown,
  Building2,
  Sparkles,
  Star,
  Coins,
  Briefcase,
  HeartHandshake,
  Flame,
  Shield,
  CheckCircle2,
  Check,
  BarChart3,
  Coffee,
  MapPin,
  Network,
  Compass,
  Monitor,
  Laptop,
  Calendar,
  Landmark,
  ClipboardList,
  Paintbrush,
  Route,
  Key,
  Flag,
  Megaphone,
  Cpu,
  GraduationCap,
  LifeBuoy,
  Headphones,
  Download,
  Square,
  Map,
  Building,
  Maximize2,
  CheckSquare,
  DoorOpen,
  Warehouse,
  Quote,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Video,
  EyeOff,
} from 'lucide-react';
import {
  DEFAULT_FRANCHISE_BENEFITS,
  DEFAULT_REVENUE_STREAMS,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_SUPPORT_ITEMS,
  DEFAULT_REQUIREMENTS_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_AMENITIES,
  DEFAULT_PRICING_PLANS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FORM_FIELDS_CONFIG,
  DEFAULT_OFFICE_LOCATIONS,
  DEFAULT_FRANCHISE_TESTIMONIALS,
  DEFAULT_FRANCHISE_BUDGET_OPTIONS,
} from '../../context/SettingsContext';
import { ICON_MAP } from '../sections/Services';
import { AMENITY_ICON_MAP } from '../sections/Amenities';
import { INITIAL_PRESS_ITEMS } from '../sections/PressCoverage';
import { getPartnerLogoSrc, DEFAULT_ECOSYSTEM_PARTNERS } from '../franchise/ecosystemConstants';
import defaultAboutImg from '../../assets/about_workspace.png';
import defaultVisionImg from '../../assets/franchise_about.png';
import sanyaImg from '../../assets/sanya.png';
import rohanImg from '../../assets/rohan.png';
import arjunImg from '../../assets/arjun.png';
import rajeshImg from '../../assets/partners/rajesh.png';
import priyaImg from '../../assets/partners/priya.png';

const BENEFIT_ICONS_MAP = {
  Award,
  ShieldCheck,
  Zap,
  Handshake,
  Globe,
  TrendingUp,
  Users,
  Target,
  Rocket,
  Crown,
  Building2,
  Sparkles,
  Star,
  Coins,
  Briefcase,
  HeartHandshake,
  Flame,
  Shield,
  CheckCircle2,
  BarChart3,
  Coffee,
  MapPin,
  Network,
  Compass,
  Monitor,
  Laptop,
  Calendar,
  Landmark,
  ClipboardList,
  Paintbrush,
  Route,
  Key,
  Flag,
  Megaphone,
  Cpu,
  GraduationCap,
  LifeBuoy,
  Headphones,
  Download,
  Square,
  Map,
  Building,
  Maximize2,
  CheckSquare,
  DoorOpen,
  Warehouse,
  Video,
};

function renderBenefitIcon(name, className, size = 18) {
  const IconComp = BENEFIT_ICONS_MAP[name] || Award;
  return <IconComp className={className} size={size} />;
}

function renderPreviewServiceIcon(service, size = 18) {
  if (service?.icon && typeof service.icon !== 'string') {
    return service.icon;
  }
  const item = ICON_MAP?.[service?.iconName] || ICON_MAP?.Monitor;
  const Comp = item?.comp || Monitor;
  return <Comp size={size} className={item?.color || 'text-neon-blue'} />;
}

function renderPreviewAmenityIcon(amenity, size = 18) {
  const iconName = amenity?.iconName;
  const item = AMENITY_ICON_MAP?.[iconName] || AMENITY_ICON_MAP?.Sparkles;
  const Comp = item?.comp || Sparkles;
  const colorClass = amenity?.color || item?.defaultColor || 'text-neon-blue';
  return <Comp size={size} className={colorClass} />;
}

const DEFAULT_TESTIMONIAL_AVATARS = {
  rohan: rohanImg,
  sanya: sanyaImg,
  arjun: arjunImg,
};

function getTestimonialAvatar(item) {
  if (!item) return null;
  if (item.avatarUrl) return item.avatarUrl;
  if (item.avatarKey && DEFAULT_TESTIMONIAL_AVATARS[item.avatarKey]) {
    return DEFAULT_TESTIMONIAL_AVATARS[item.avatarKey];
  }
  if (item.image) return item.image;
  if (item.id === 'rohan-verma') return rohanImg;
  if (item.id === 'sanya-sharma') return sanyaImg;
  if (item.id === 'arjun-desai') return arjunImg;
  return null;
}

function getTestimonialInitials(name) {
  if (!name) return 'SC';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminLivePreview({ previewTab, setPreviewTab, current, onSelectTab, setFormData }) {
  const [previewPricingMonthly, setPreviewPricingMonthly] = useState(true);
  const [previewTestimonialIndex, setPreviewTestimonialIndex] = useState(0);

  const handleTogglePreviewPopular = (planId) => {
    if (!setFormData) return;
    const currentPlans = (Array.isArray(current.pricingPlans) && current.pricingPlans.length > 0)
      ? current.pricingPlans
      : DEFAULT_PRICING_PLANS;
    const updated = currentPlans.map((p) => {
      const id = p.id || p.name;
      if (id === planId) {
        return { ...p, popular: !p.popular };
      }
      return p;
    });
    setFormData((prev) => ({ ...prev, pricingPlans: updated }));
  };

  const PREVIEW_TAB_LABELS = {
    hero: 'Hero Banner',
    acknowledged: 'Acknowledged By',
    about: 'About',
    services: 'Services',
    amenities: 'Amenities',
    media: 'Press',
    pricing: 'Pricing',
    gallery: 'Gallery',
    testimonials: 'Reviews',
    contact: 'Contact',
    franchise: 'Franchise Opportunity',
    franchiseCredibility: 'Credibility Highlights',
    founderVideo: "Founder's Message",
    franchiseStory: 'Ecosystem & Recognition',
    franchiseVision: 'Vision Portion',
    franchiseRevenue: 'Revenue Model',
    franchiseBenefits: 'Why Partner',
    franchiseProcess: 'Roadmap',
    franchiseSupport: 'Support',
    franchiseRequirements: 'Requirements',
    franchiseTestimonials: 'Voice of Franchise',
    franchiseInquiry: 'Franchise Application',
    typography: 'Typography',
    theme: 'Theme',
  };

  const previewTabs = [
    'hero',
    'acknowledged',
    'about',
    'services',
    'amenities',
    'media',
    'pricing',
    'gallery',
    'testimonials',
    'contact',
    'franchise',
    'franchiseCredibility',
    'founderVideo',
    'franchiseStory',
    'franchiseVision',
    'franchiseRevenue',
    'franchiseBenefits',
    'franchiseProcess',
    'franchiseSupport',
    'franchiseRequirements',
    'franchiseTestimonials',
    'franchiseInquiry',
    'typography',
    'theme',
  ];

  return (
    <div className="sticky top-28">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <EyeIcon size={14} className="text-neon-blue" />
            Live Preview:
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-neon-purple/20 text-neon-purple border border-neon-purple/40 shadow-sm">
            {PREVIEW_TAB_LABELS[previewTab] || previewTab}
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Sync
        </span>
      </div>

      {/* Preview Card */}
      <div
        className="glass-card rounded-2xl border border-white/15 relative overflow-hidden flex flex-col justify-start transition-all duration-300 p-3.5 sm:p-4 min-h-[360px] max-h-[calc(100vh-9.5rem)] overflow-y-auto scrollbar-thin"
        style={{
          backgroundColor: current.backgroundColor || '#050505',
          color: current.primaryTextColor || '#f8fafc',
          fontFamily: current.fontFamily || "'Poppins', sans-serif",
          letterSpacing: current.letterSpacing || '0px',
        }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute -top-20 -left-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-40"
          style={{ backgroundColor: current.accentColor || '#b026ff' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-40"
          style={{ backgroundColor: current.gradientEnd || '#00f0ff' }}
        />

        {/* HERO PREVIEW */}
        {previewTab === 'hero' && (
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="inline-block mb-4 px-3.5 py-1 rounded-full border border-white/15 glass">
              <span
                className="text-xs font-semibold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
                }}
              >
                {renderFormattedText(current.badgeText || 'Badge Text')}
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 leading-tight"
              style={{ color: current.heroHeadingColor || undefined }}
            >
              {renderFormattedText(current.mainHeading || 'Main Heading')}
            </h2>
            <div
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${current.gradientStart || '#ff2975'}, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
              }}
            >
              {renderFormattedText(current.subHeading || 'Sub Heading')}
            </div>

            <p
              className="text-xs sm:text-sm font-light mb-6 max-w-sm line-clamp-3 text-slate-300"
              style={{ color: current.heroDescriptionColor || undefined }}
            >
              {renderFormattedText(current.description || 'Description text goes here.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                type="button"
                style={{
                  background: `linear-gradient(to right, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg"
              >
                {renderFormattedText(current.primaryButtonText || 'Primary Button')}
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white glass-card"
              >
                {renderFormattedText(current.secondaryButtonText || 'Secondary Button')}
              </button>
            </div>
          </div>
        )}

        {/* ACKNOWLEDGED BY PREVIEW */}
        {previewTab === 'acknowledged' && (
          <div className="relative z-10 text-center pt-1 pb-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-semibold text-neon-blue uppercase tracking-wider">
                Acknowledged By Section Preview
              </span>
              {current.showAcknowledgedOnHome === false && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <EyeOff size={10} /> Hidden on Home
                </span>
              )}
            </div>
            <div
              className={`relative p-[1.5px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-2xl max-w-xl mx-auto shadow-xl transition-opacity ${current.showAcknowledgedOnHome === false ? 'opacity-60' : 'opacity-100'
                }`}
            >
              <div className="px-4 py-6 bg-[#050507]/90 rounded-[14px]">
                <div className="text-center mb-3">
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    {renderFormattedText(current.acknowledgedHeading || 'Acknowledged By')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {((Array.isArray(current.ecosystemPartnersList) && current.ecosystemPartnersList.length > 0)
                    ? current.ecosystemPartnersList
                    : DEFAULT_ECOSYSTEM_PARTNERS
                  ).map((partner, idx) => {
                    const isCustom = Boolean(
                      (partner.imageUrl && partner.imageUrl.trim()) ||
                      (partner.image && partner.image.trim())
                    );
                    return (
                      <div
                        key={partner.id || idx}
                        className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/10 overflow-hidden shadow-sm"
                        title={partner.name}
                      >
                        <img
                          src={getPartnerLogoSrc(partner)}
                          alt={partner.name}
                          className={`max-h-full max-w-full object-contain ${isCustom ? 'rounded-full' : 'grayscale invert mix-blend-screen'
                            }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PREVIEW */}
        {previewTab === 'about' && (
          <div className="relative z-10 text-left">
            <span className="text-[11px] font-semibold text-neon-purple uppercase tracking-wider block mb-2">
              About Section Preview
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-5 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue blur-lg opacity-25 rounded-xl"></div>
                <img
                  src={current.aboutImage || defaultAboutImg}
                  alt="About Workspace Preview"
                  className="rounded-xl border border-white/10 w-full h-32 sm:h-36 object-cover relative z-10 shadow-md"
                />
              </div>
              <div className="sm:col-span-7">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-2 leading-tight"
                  style={{ color: current.aboutHeadingColor || undefined }}
                >
                  {renderFormattedText(current.aboutHeading || 'More than just')}{' '}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${current.accentColor || '#b026ff'}, ${current.gradientStart || '#ff2975'})`,
                    }}
                  >
                    {renderFormattedText(current.aboutAccent || 'desk.')}
                  </span>
                </h2>
                <p
                  className="text-xs leading-relaxed mb-2 text-slate-300 line-clamp-3"
                  style={{ color: current.aboutDescriptionColor || undefined }}
                >
                  {renderFormattedText(current.aboutDescription1 || 'First paragraph...')}
                </p>
                <p
                  className="text-xs leading-relaxed text-slate-400 line-clamp-2"
                  style={{ color: current.aboutDescriptionColor || undefined }}
                >
                  {renderFormattedText(current.aboutDescription2 || 'Second paragraph...')}
                </p>

                {/* 3 HIGHLIGHT STATS */}
                <div className="flex gap-4 sm:gap-6 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {renderFormattedText(current.aboutStat1Value || '500+')}
                    </h4>
                    <p className="text-neon-blue text-[10px] sm:text-[11px] font-semibold">
                      {renderFormattedText(current.aboutStat1Label || 'Trusted Members')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {renderFormattedText(current.aboutStat2Value || '9-7')}
                    </h4>
                    <p className="text-neon-pink text-[10px] sm:text-[11px] font-semibold">
                      {renderFormattedText(current.aboutStat2Label || 'Access')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {renderFormattedText(current.aboutStat3Value || '100+')}
                    </h4>
                    <p className="text-neon-purple text-[10px] sm:text-[11px] font-semibold">
                      {renderFormattedText(current.aboutStat3Label || 'Dedicated Desk')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEDIA & HIGHLIGHTS PREVIEW */}
        {previewTab === 'media' && (
          <div className="relative z-10 text-center py-1 space-y-2.5">
            <span className="inline-block px-3 py-0.5 text-[10px] font-semibold tracking-wider text-neon-pink uppercase border border-neon-pink/30 rounded-full bg-neon-pink/10 backdrop-blur-md">
              {renderFormattedText(current.pressBadge || 'Media & Highlights')}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mb-0.5 leading-tight">
              {renderFormattedText(current.pressHeading || 'In The Spotlight')}
            </h2>
            <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed line-clamp-2">
              {renderFormattedText(
                current.pressSubheading ||
                'See what leading newspapers, media outlets, and the community are saying about our revolutionary co-working space.'
              )}
            </p>

            {/* 4 Newspaper Cards Grid (With Blurred Paper Images as requested) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1.5 text-left">
              {((Array.isArray(current.mediaHighlightsList) && current.mediaHighlightsList.length > 0
                ? current.mediaHighlightsList.filter((i) => !i.hidden)
                : INITIAL_PRESS_ITEMS
              ).slice(0, 4)).map((item, idx) => {
                const meta = {
                  title: item.title || 'Media Highlight',
                  publisher: item.publisher || 'Feature',
                  excerpt: item.excerpt || '',
                };

                return (
                  <div
                    key={item.id || item.url || idx}
                    className="glass-card rounded-xl overflow-hidden border border-white/10 flex flex-col group transition-all"
                  >
                    {/* Newspaper Image Container (Blurred as requested) */}
                    <div className="h-20 sm:h-24 overflow-hidden relative bg-white/5">
                      <div className="absolute inset-0 bg-dark-bg/20 z-10"></div>
                      <img
                        src={item.url}
                        alt={meta.title}
                        className="w-full h-full object-cover object-top blur-[2px] scale-105 opacity-85"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      {/* Publisher badge overlay */}
                      <div className="absolute bottom-1.5 left-1.5 z-20">
                        <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md rounded-full text-[9px] font-semibold text-white border border-white/10 line-clamp-1 max-w-[110px]">
                          {renderFormattedText(meta.publisher)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-2 sm:p-2.5 flex-1 flex flex-col bg-white/[0.02]">
                      <h4 className="text-[11px] font-bold text-white mb-0.5 line-clamp-1 group-hover:text-neon-blue transition-colors">
                        {renderFormattedText(meta.title)}
                      </h4>
                      <p className="text-slate-400 text-[10px] leading-snug line-clamp-2 mt-auto font-light">
                        {renderFormattedText(meta.excerpt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SERVICES PREVIEW */}
        {previewTab === 'services' && (
          <div className="relative z-10 text-center py-1 space-y-2.5">
            <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest block">
              Services Section Preview
            </span>
            <h2
              className="text-lg sm:text-xl font-extrabold mb-0.5 leading-tight"
              style={{ color: current.servicesHeadingColor || undefined }}
            >
              {renderFormattedText(current.servicesHeading || 'Premium Work')}{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${current.gradientEnd || '#00f0ff'}, ${current.accentColor || '#b026ff'})`,
                }}
              >
                {renderFormattedText(current.servicesAccent || 'Environments')}
              </span>
            </h2>
            <p
              className="text-[11px] max-w-sm mx-auto leading-relaxed text-slate-300 line-clamp-2"
              style={{ color: current.servicesDescriptionColor || undefined }}
            >
              {renderFormattedText(
                current.servicesDescription ||
                'From focused private spaces to collaborative open desk, we provide everything your startup needs to thrive.'
              )}
            </p>

            {/* Actual Services Cards Grid (Compact, Fits on Screen) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1.5 text-left">
              {((Array.isArray(current.servicesList) && current.servicesList.length > 0)
                ? current.servicesList
                : DEFAULT_SERVICES
              ).map((service, idx) => (
                <div
                  key={service.id || service.title || idx}
                  className="relative group p-0.5 rounded-xl w-full transition-transform hover:-translate-y-0.5 duration-200"
                >
                  {/* Outer ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl opacity-15 group-hover:opacity-40 blur-sm transition-opacity duration-300 pointer-events-none"></div>

                  {/* Card Content with subtle background gradient */}
                  <div
                    className={`relative h-full bg-[#0a0a0c] rounded-xl p-3 border border-white/10 overflow-hidden flex flex-col items-start gap-1.5 z-10 bg-gradient-to-br ${service.gradient || 'from-neon-blue/20 to-transparent'
                      }`}
                  >
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md shrink-0 shadow-inner">
                      {renderPreviewServiceIcon(service, 16)}
                    </div>
                    <h3 className="text-xs font-bold text-white mt-0.5 leading-snug line-clamp-1">
                      {renderFormattedText(service.title)}
                    </h3>
                    <p className="text-slate-400 font-light text-[10px] leading-snug line-clamp-2">
                      {renderFormattedText(service.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AMENITIES PREVIEW */}
        {previewTab === 'amenities' && (() => {
          const activeAmenities = (Array.isArray(current.amenitiesList) && current.amenitiesList.length > 0)
            ? current.amenitiesList
            : DEFAULT_AMENITIES;

          return (
            <div className="relative z-10 text-center py-1 space-y-2.5">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-neon-blue backdrop-blur-md">
                  <Sparkles size={12} className="text-neon-blue" />
                  Included With Every Desk
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${current.showAmenities
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-700/60 text-slate-400 border border-white/10'
                    }`}
                >
                  {current.showAmenities ? 'Live on Site' : 'Hidden'}
                </span>
              </div>

              <h2
                className="text-lg sm:text-xl font-extrabold mb-0.5 leading-tight"
                style={{ color: current.amenitiesHeadingColor || undefined }}
              >
                {renderFormattedText(current.amenitiesHeading || 'World-Class')}{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${current.gradientEnd || '#00f0ff'}, ${current.accentColor || '#b026ff'})`,
                  }}
                >
                  {renderFormattedText(current.amenitiesAccent || 'Amenities')}
                </span>
              </h2>

              <p
                className="text-[11px] max-w-sm mx-auto leading-relaxed text-slate-300 line-clamp-2"
                style={{ color: current.amenitiesDescriptionColor || undefined }}
              >
                {renderFormattedText(
                  current.amenitiesDescription ||
                  'Every workstation comes fully loaded with enterprise infrastructure and hospitality perks.'
                )}
              </p>

              {/* Amenity Cards Grid (Faithful representation of website design) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1.5 text-left">
                {activeAmenities.map((amenity, idx) => (
                  <div
                    key={amenity.id || amenity.title || idx}
                    className="glass-card p-3 rounded-xl border border-white/10 hover:border-white/25 transition-all group flex flex-col justify-between relative overflow-hidden bg-white/[0.02] hover:-translate-y-0.5 duration-200"
                  >
                    {/* Ambient subtle hover glow */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-neon-purple/10 rounded-full blur-xl group-hover:bg-neon-blue/20 transition-all pointer-events-none" />

                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          {renderPreviewAmenityIcon(amenity, 16)}
                        </div>

                        {amenity.badge && (
                          <span className="text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 group-hover:text-white group-hover:border-neon-blue/40 transition-colors line-clamp-1 max-w-[90px]">
                            {renderFormattedText(amenity.badge)}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-bold text-white mb-1 group-hover:text-neon-blue transition-colors line-clamp-1">
                        {renderFormattedText(amenity.title)}
                      </h3>
                      <p className="text-slate-400 font-light text-[10px] leading-snug line-clamp-2">
                        {renderFormattedText(amenity.description)}
                      </p>
                    </div>

                    {/* Bottom Accent Perk Line */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">
                      <span>Standard Perk</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* PRICING PREVIEW */}
        {previewTab === 'pricing' && (() => {
          const activePlans = (Array.isArray(current.pricingPlans) && current.pricingPlans.length > 0)
            ? current.pricingPlans
            : DEFAULT_PRICING_PLANS;

          const visiblePlans = activePlans.filter((plan) => {
            if (!previewPricingMonthly && plan.monthlyPrice !== null && plan.dailyPrice === null) return false;
            if (previewPricingMonthly && plan.dailyPrice !== null && plan.monthlyPrice === null) return false;
            return true;
          });

          return (
            <div className="relative z-10 text-center py-1 space-y-2.5">
              <span className="text-[10px] font-bold text-neon-pink uppercase tracking-widest block">
                Pricing Section Preview
              </span>
              <h2
                className="text-lg sm:text-xl font-extrabold mb-0.5 leading-tight"
                style={{ color: current.pricingHeadingColor || undefined }}
              >
                {renderFormattedText(current.pricingHeading || 'Simple, Transparent')}{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${current.gradientStart || '#ff2975'}, ${current.accentColor || '#b026ff'})`,
                  }}
                >
                  {renderFormattedText(current.pricingAccent || 'Pricing')}
                </span>
              </h2>

              {/* Daily / Monthly Toggle matching website */}
              <div className="flex items-center justify-center gap-2 pt-0.5 pb-1">
                <span className={`text-[11px] font-semibold transition-colors ${!previewPricingMonthly ? 'text-white' : 'text-slate-400'}`}>
                  Daily
                </span>
                <div
                  className="w-10 h-5.5 bg-white/10 rounded-full p-0.5 cursor-pointer border border-white/20 relative"
                  onClick={() => setPreviewPricingMonthly(!previewPricingMonthly)}
                  title="Toggle Daily / Monthly plans preview"
                >
                  <div
                    className={`w-4 h-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full shadow-md transition-transform duration-200 ${previewPricingMonthly ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                  />
                </div>
                <span className={`text-[11px] font-semibold transition-colors ${previewPricingMonthly ? 'text-white' : 'text-slate-400'}`}>
                  Monthly
                </span>
              </div>

              {/* Actual Cards Grid Matching Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-left items-stretch">
                {visiblePlans.map((plan, index) => {
                  const planId = plan.id || plan.name || `preview-plan-${index}`;
                  const price = previewPricingMonthly ? plan.monthlyPrice : plan.dailyPrice;
                  const displayUnit = plan.priceUnit || (
                    previewPricingMonthly
                      ? '/mo'
                      : (plan.name === 'Conference Room' || plan.name === 'Private Cabin' ? ' per hour' : '/day')
                  );

                  return (
                    <div
                      key={planId}
                      className={`relative glass-card p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${plan.popular
                        ? 'border-neon-purple shadow-[0_0_25px_rgba(176,38,255,0.25)] bg-gradient-to-b from-neon-purple/[0.08] to-transparent ring-1 ring-neon-purple/50'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                        }`}
                    >
                      {/* MOST POPULAR Banner */}
                      {plan.popular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-neon-purple to-neon-pink text-white text-[9px] font-extrabold px-3 py-0.5 rounded-full shadow-lg tracking-wider whitespace-nowrap">
                          MOST POPULAR
                        </div>
                      )}

                      <div>
                        {/* Plan Header & Tick Button */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                            {renderFormattedText(plan.name)}
                          </h3>

                          {/* Quick Tick button to switch Most Popular */}
                          <button
                            type="button"
                            onClick={() => handleTogglePreviewPopular(planId)}
                            className={`p-1 rounded-md border text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${plan.popular
                              ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-sm'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                              }`}
                            title={plan.popular ? 'Currently Most Popular. Click tick to toggle.' : 'Click tick to set as Most Popular'}
                          >
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${plan.popular ? 'border-neon-pink bg-neon-pink text-white' : 'border-white/25 bg-black/40'
                              }`}>
                              {plan.popular && <Check size={10} className="stroke-[3]" />}
                            </div>
                            <span className="text-[9px] font-medium hidden sm:inline">{plan.popular ? 'Popular' : 'Pick'}</span>
                          </button>
                        </div>

                        <p className="text-slate-400 text-[11px] font-light leading-snug line-clamp-2 mb-2.5">
                          {renderFormattedText(plan.description)}
                        </p>

                        <div className="mb-3">
                          <span className="text-xl sm:text-2xl font-extrabold text-white">
                            ₹{price}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {' '}{displayUnit}
                          </span>
                        </div>

                        {/* Feature bullets with checkmarks */}
                        <ul className="space-y-1.5 mb-4 text-[11px] text-slate-300">
                          {(plan.features || []).slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check size={13} className="text-neon-blue shrink-0" />
                              <span className="line-clamp-1">{renderFormattedText(feature)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button matching website */}
                      <button
                        type="button"
                        className="w-full py-2 rounded-xl font-bold text-xs transition-all bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md pointer-events-none"
                      >
                        {renderFormattedText(current.pricingButtonText || 'Book Now')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* TESTIMONIALS PREVIEW */}
        {previewTab === 'testimonials' && (() => {
          const activeTestimonials = (Array.isArray(current.testimonialsList) && current.testimonialsList.length > 0)
            ? current.testimonialsList
            : DEFAULT_TESTIMONIALS;

          const safeIndex = previewTestimonialIndex >= activeTestimonials.length ? 0 : previewTestimonialIndex;
          const currentTestimonial = activeTestimonials[safeIndex] || activeTestimonials[0];

          const handleNext = () => {
            setPreviewTestimonialIndex((prev) => (prev + 1) % activeTestimonials.length);
          };

          const handlePrev = () => {
            setPreviewTestimonialIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
          };

          const avatarSrc = getTestimonialAvatar(currentTestimonial);
          const rating = typeof currentTestimonial?.rating === 'number' ? currentTestimonial.rating : 5;

          return (
            <div className="relative z-10 w-full py-1 text-center">
              {/* Glow backdrop matching website */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Title & Section Tag */}
              <span className="text-[10px] font-semibold text-neon-pink uppercase tracking-wider block mb-1">
                Testimonials &amp; Reviews Preview
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
                style={{ color: current.testimonialsHeadingColor || undefined }}
              >
                {renderFormattedText(current.testimonialsHeading || 'What Co-Works')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                  {renderFormattedText(current.testimonialsAccent || 'Say')}
                </span>
              </h2>

              {/* Main Testimonial Stage matching original website */}
              <div className="relative min-h-[220px] flex items-center justify-center px-8 sm:px-12">
                <div className="w-full flex flex-col items-center justify-center">
                  {/* Star Rating */}
                  {rating > 0 && (
                    <div className="flex items-center justify-center gap-1 mb-2.5">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                        />
                      ))}
                    </div>
                  )}

                  {/* Authentic Quote Icon */}
                  <Quote className="mx-auto text-neon-blue/40 w-10 h-10 sm:w-12 sm:h-12 mb-2.5" />

                  {/* Review Content */}
                  <p
                    className="text-sm sm:text-base md:text-lg text-slate-200 font-light italic max-w-xl mx-auto leading-relaxed mb-5"
                    style={{ color: current.testimonialsTextColor || undefined }}
                  >
                    "{renderFormattedText(currentTestimonial?.content || '')}"
                  </p>

                  {/* Reviewer Identity with Authentic Avatar */}
                  <div className="flex items-center justify-center gap-3.5">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={currentTestimonial?.name || 'Reviewer'}
                        className="w-12 h-12 rounded-full border-2 border-neon-purple object-cover shadow-[0_0_15px_rgba(176,38,255,0.3)] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-neon-purple bg-gradient-to-br from-neon-purple/40 to-neon-blue/40 text-white font-bold flex items-center justify-center text-xs shadow-[0_0_15px_rgba(176,38,255,0.3)] select-none shrink-0">
                        {getTestimonialInitials(currentTestimonial?.name)}
                      </div>
                    )}
                    <div className="text-left">
                      <h4 className="text-white font-semibold text-sm sm:text-base leading-tight">
                        {renderFormattedText(currentTestimonial?.name || 'Anonymous')}
                      </h4>
                      {currentTestimonial?.role && (
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-tight">
                          {renderFormattedText(currentTestimonial.role)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left/Right Carousel Controls */}
                {activeTestimonials.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-0 sm:left-1 p-2 sm:p-2.5 rounded-full glass-card border border-white/10 hover:bg-white/15 text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title="Previous Review"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-0 sm:right-1 p-2 sm:p-2.5 rounded-full glass-card border border-white/10 hover:bg-white/15 text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title="Next Review"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Dots Indicators matching website */}
              {activeTestimonials.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-5">
                  {activeTestimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPreviewTestimonialIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === safeIndex ? 'bg-neon-blue w-7' : 'bg-white/20 hover:bg-white/40 w-2.5'
                        }`}
                      title={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Quick Jump Badges for Reviewers */}
              {activeTestimonials.length > 1 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                  {activeTestimonials.map((t, i) => (
                    <button
                      key={t.id || i}
                      type="button"
                      onClick={() => setPreviewTestimonialIndex(i)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer font-medium ${i === safeIndex
                        ? 'bg-neon-purple/25 border-neon-purple text-white shadow-sm font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                    >
                      #{i + 1} {renderFormattedText(t.name || `Review ${i + 1}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* GALLERY PREVIEW */}
        {previewTab === 'gallery' && (
          <div className="relative z-10 text-center pt-1 pb-2 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {renderFormattedText(current.galleryHeading || 'Inside')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink">
                {renderFormattedText(current.galleryAccent || 'Startup Cafe')}
              </span>
            </h2>
            {current.galleryDescription && (
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {renderFormattedText(current.galleryDescription)}
              </p>
            )}

            {/* Simulated Gallery Grid Preview */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group"
                >
                  <span className="text-[9px] font-mono text-slate-500">Photo {i}</span>
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] text-white">
                    {current.galleryBadge || 'Workspace View'}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400">
              Showing first {Number(current.galleryInitialCount) || 6} photos before "View All"
            </div>
          </div>
        )}

        {/* CONTACT PREVIEW */}
        {previewTab === 'contact' && (() => {
          const mapSrc = (() => {
            const raw = current.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.08277259169!2d83.303977598466!3d26.7634863378516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991446a0c332489%3A0x1ff3f97fdcc6b711!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714080123512!5m2!1sen!2sin';
            const m = raw.match(/src=["']([^"']+)["']/i);
            return m ? m[1] : raw.trim();
          })();

          const formConfig = {
            ...DEFAULT_FORM_FIELDS_CONFIG,
            ...(current.contactFormFieldsConfig || {}),
          };

          const mapFilterPreset = current.mapFilterPreset || (current.mapDarkModeFilter === false ? 'natural' : 'cyberpunk');
          const getMapFilter = () => {
            if (mapFilterPreset === 'natural' || current.mapDarkModeFilter === false) return 'none';
            if (mapFilterPreset === 'grayscale') return 'grayscale(100%) invert(90%)';
            if (mapFilterPreset === 'midnight') return 'invert(95%) hue-rotate(200deg) brightness(85%) contrast(120%)';
            if (mapFilterPreset === 'muted') return 'sepia(40%) contrast(110%) brightness(90%)';
            return 'invert(90%) hue-rotate(180deg)';
          };

          const getGlowClass = (glow) => {
            switch (glow) {
              case 'blue': return 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]';
              case 'purple': return 'border-purple-500/40 shadow-[0_0_20px_rgba(176,38,255,0.2)]';
              case 'pink': return 'border-pink-500/40 shadow-[0_0_20px_rgba(255,41,117,0.2)]';
              default: return 'border-white/10';
            }
          };

          const getBtnGrad = (grad) => {
            switch (grad) {
              case 'pink-purple': return 'bg-gradient-to-r from-neon-pink to-neon-purple';
              case 'emerald': return 'bg-gradient-to-r from-emerald-500 to-teal-500';
              case 'amber': return 'bg-gradient-to-r from-amber-500 to-orange-500';
              default: return 'bg-gradient-to-r from-neon-blue to-neon-purple';
            }
          };

          const offices = Array.isArray(current.contactOfficesList) && current.contactOfficesList.length > 0
            ? current.contactOfficesList.filter(o => o.visible !== false)
            : [
              { id: '1', title: current.contactOffice1Title || 'Mumbai Office', address: current.contactOffice1Address || 'Startup Cafe, Bandra East, Mumbai', iconType: 'Building2', color: 'text-neon-blue' },
              { id: '2', title: current.contactOffice2Title || 'Gorakhpur Hub', address: current.contactOffice2Address || 'Vijay Chowk, Gorakhpur', iconType: 'MapPin', color: 'text-neon-pink' },
            ];

          return (
            <div className="relative z-10 text-center py-2 space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-neon-pink uppercase tracking-wider block mb-1">
                  Contact &amp; Booking Preview
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ color: current.contactHeadingColor || undefined }}
                >
                  {renderFormattedText(current.contactHeading || 'Book Your')}{' '}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${current.gradientEnd || '#00f0ff'}, ${current.accentColor || '#b026ff'})`,
                    }}
                  >
                    {renderFormattedText(current.contactAccent || 'Workspace')}
                  </span>
                </h2>
                <p
                  className="text-xs max-w-sm mx-auto leading-relaxed text-slate-300"
                  style={{ color: current.contactDescriptionColor || undefined }}
                >
                  {renderFormattedText(current.contactDescription || 'Ready to level up your workspace? Reserve your spot today.')}
                </p>
              </div>

              {/* Two Column Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {/* Left: Map & Office Preview */}
                <div className="space-y-2">
                  <div className={`overflow-hidden border ${getGlowClass(current.mapBorderGlow)} ${current.mapRadius || 'rounded-xl'} h-36 bg-black/60 relative`}>
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        filter: getMapFilter(),
                      }}
                      title="Contact Live Preview Map"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {offices.map((office, idx) => {
                      const IconComp = office.iconType === 'MapPin' ? MapPin : Building2;
                      const col = office.color || (idx % 2 === 0 ? 'text-neon-blue' : 'text-neon-pink');
                      return (
                        <div key={office.id || idx} className="p-2 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-2">
                          <IconComp size={13} className={`${col} shrink-0 mt-0.5`} />
                          <div className="min-w-0">
                            <span className={`text-[10px] font-bold ${col} block uppercase truncate`}>
                              {renderFormattedText(office.title)}
                            </span>
                            <p className="text-[9px] text-slate-300 line-clamp-1">
                              {renderFormattedText(office.address)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Booking Form Preview */}
                <div className={`p-3.5 ${formConfig.formCardRadius || 'rounded-2xl'} bg-white/[0.03] border ${getGlowClass(formConfig.formCardGlow)} space-y-2.5`}>
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Booking Form Preview</span>
                    <span className="text-[9px] font-mono text-neon-blue">● Realtime Sync</span>
                  </div>

                  {(formConfig.showNameField !== false || formConfig.showEmailField !== false) && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {formConfig.showNameField !== false && (
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">{formConfig.nameLabel || 'FULL NAME'}</span>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white truncate">{formConfig.namePlaceholder || 'Rohan Singh'}</div>
                        </div>
                      )}
                      {formConfig.showEmailField !== false && (
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">{formConfig.emailLabel || 'EMAIL'}</span>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white truncate">{formConfig.emailPlaceholder || 'rohan@example.com'}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {(formConfig.showPhoneField !== false || formConfig.showPlanField !== false) && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {formConfig.showPhoneField !== false && (
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">{formConfig.phoneLabel || 'PHONE'}</span>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white font-mono truncate">{formConfig.phonePlaceholder || '98765 43210'}</div>
                        </div>
                      )}
                      {formConfig.showPlanField !== false && (
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">{formConfig.planLabel || 'PLAN TYPE'}</span>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neon-blue font-semibold truncate">Dedicated Desk (₹6999/mo)</div>
                        </div>
                      )}
                    </div>
                  )}

                  {(formConfig.showDurationSwitch !== false || formConfig.showLocationField !== false) && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {formConfig.showDurationSwitch !== false && (
                        <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-center font-bold">
                          <span className="flex-1 py-0.5 rounded bg-gradient-to-r from-neon-blue to-neon-purple text-white">Monthly</span>
                          <span className="flex-1 py-0.5 text-slate-500">Daily</span>
                        </div>
                      )}
                      {formConfig.showLocationField !== false && (
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 truncate">
                          📍 BKC, Mumbai
                        </div>
                      )}
                    </div>
                  )}

                  {formConfig.showPriceBreakdown !== false && (
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold">Total: ₹6,999</span>
                      <span className="text-slate-500 text-[9px]">1 Pax</span>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-0.5">
                    <div className={`w-full py-2 rounded-xl font-bold text-[10px] text-center ${getBtnGrad(formConfig.buttonGradient)} text-white shadow-md`}>
                      {renderFormattedText(current.contactFormSubmitText || 'Confirm Booking')}
                    </div>
                    {formConfig.showWhatsappButton !== false && (
                      <div className="w-full py-1.5 rounded-xl font-medium text-[9px] text-center border border-white/10 text-slate-300 bg-white/[0.02] flex items-center justify-center gap-1.5">
                        <Phone size={10} className="text-green-400" />
                        {renderFormattedText(current.contactFormWhatsappCtaText || 'Quick Inquiry via WhatsApp')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 1. FRANCHISE OPPORTUNITY & STATS PREVIEW */}
        {previewTab === 'franchise' && (
          <div className="relative z-10 text-center pt-1 pb-2 space-y-3.5">
            {current.franchiseHeroImage && (
              <div className="w-full h-20 rounded-xl overflow-hidden border border-white/10 relative mb-2 shadow-inner">
                <img
                  src={current.franchiseHeroImage}
                  alt="Custom Hero Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-[10px] text-emerald-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                    ● Custom Hero Background Active
                  </span>
                </div>
              </div>
            )}
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-[11px] font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md">
                {renderFormattedText(current.franchiseBadge || 'Franchise Opportunity')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                {renderFormattedText(current.franchiseHeading || 'Start Your Own')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue">
                  {renderFormattedText(current.franchiseAccent || 'Startup Cafe')}
                </span>
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {renderFormattedText(current.franchiseDescription || "Join India's fastest-growing coworking brand and transform the way people work in your city.")}
              </p>
            </div>

            {/* Buttons preview */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="px-4 py-2 text-xs font-bold text-black bg-white rounded-full shadow-md">
                {current.franchisePrimaryButton || 'Apply for Franchise'}
              </span>
              <span className="px-4 py-2 text-xs font-bold text-white border border-white/20 rounded-full bg-white/5">
                {current.franchiseSecondaryButton || 'Learn More'}
              </span>
            </div>

            {/* 4 Stats Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-base font-extrabold text-white">{renderFormattedText(current.franchiseStat1Value || '15+')}</p>
                <p className="text-[10px] text-slate-400">{renderFormattedText(current.franchiseStat1Label || 'Cities')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-base font-extrabold text-white">{renderFormattedText(current.franchiseStat2Value || '50k+')}</p>
                <p className="text-[10px] text-slate-400">{renderFormattedText(current.franchiseStat2Label || 'Sq Ft Managed')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-base font-extrabold text-white">{renderFormattedText(current.franchiseStat3Value || '2000+')}</p>
                <p className="text-[10px] text-slate-400">{renderFormattedText(current.franchiseStat3Label || 'Members')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-base font-extrabold text-white">{renderFormattedText(current.franchiseStat4Value || 'High')}</p>
                <p className="text-[10px] text-slate-400">{renderFormattedText(current.franchiseStat4Label || 'ROI Potential')}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. FOUNDER VIDEO & MESSAGE DEDICATED PREVIEW */}
        {previewTab === 'founderVideo' && (
          <div className="relative z-10 text-left py-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-neon-pink bg-neon-pink/10 border border-neon-pink/30 uppercase tracking-wider flex items-center gap-1.5">
                <Video size={12} className="text-neon-pink" />
                {renderFormattedText(current.founderBadge || "Founder's Message")}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded">
                {current.founderVideoSource === 'workspace'
                  ? '🏢 Arun Pitch MP4'
                  : current.founderVideoSource === 'custom'
                    ? '📁 Custom Video'
                    : '🎬 Original WebM'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg">
              {/* Interactive Video Frame Mockup */}
              {(() => {
                const previewRatio = current.founderVideoAspectRatio === '16:9' || (current.founderVideoAspectRatio === 'auto' && current.founderVideoSource === 'workspace')
                  ? '16:9'
                  : current.founderVideoAspectRatio === '4:3'
                    ? '4:3'
                    : current.founderVideoAspectRatio === '1:1'
                      ? '1:1'
                      : '9:16';
                const frameClass = previewRatio === '16:9'
                  ? 'w-full sm:w-56 aspect-[16/9]'
                  : previewRatio === '4:3'
                    ? 'w-48 aspect-[4/3]'
                    : previewRatio === '1:1'
                      ? 'w-40 aspect-square'
                      : 'w-36 aspect-[9/16]';
                const RADIUS_MAP = {
                  none: 0,
                  '0': 0,
                  square: 0,
                  medium: 20,
                  '20': 20,
                  rounded: 20,
                  default: 48,
                  '48': 48,
                  pill: 56,
                  '56': 56,
                };
                let frameRadius = 48;
                if (current.founderVideoRadius && current.founderVideoRadius !== 'default') {
                  if (RADIUS_MAP[current.founderVideoRadius] !== undefined) {
                    frameRadius = RADIUS_MAP[current.founderVideoRadius];
                  } else {
                    const parsed = Number(current.founderVideoRadius);
                    if (!isNaN(parsed)) frameRadius = parsed;
                  }
                }
                let frameBorderWidth = 4;
                if (current.founderVideoBorderWidth && current.founderVideoBorderWidth !== 'default') {
                  const parsed = Number(current.founderVideoBorderWidth);
                  if (!isNaN(parsed)) frameBorderWidth = parsed;
                }
                const frameBorderColor = current.founderVideoBorderColor || '#1e293b';

                return (
                  <div
                    className={`${frameClass} bg-black relative overflow-hidden flex flex-col justify-between p-2 shadow-2xl transition-all shrink-0 mx-auto sm:mx-0 group`}
                    style={{
                      borderRadius: `${frameRadius}px`,
                      borderWidth: `${frameBorderWidth}px`,
                      borderStyle: frameBorderWidth > 0 ? 'solid' : 'none',
                      borderColor: frameBorderColor,
                    }}
                  >
                    <div className="flex items-center justify-between text-[8px] font-bold text-neon-pink z-10 px-1">
                      <span>STARTUP CAFE</span>
                      <span className="text-slate-400 font-mono text-[7px]">{previewRatio}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/90 mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-black text-xs ml-0.5">▶</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-400 z-10 px-1">
                      <span className="w-12 h-1 bg-neon-pink/70 rounded-full"></span>
                      <span className="font-mono text-[7px]">HD LIVE</span>
                    </div>
                  </div>
                );
              })()}

              {/* Founder Copy */}
              <div className="space-y-2 flex-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {renderFormattedText(current.founderHeading || 'Why')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                    {renderFormattedText(current.founderAccent || 'Startup Cafe')}
                  </span>{' '}
                  {renderFormattedText(current.founderSuffix !== undefined ? current.founderSuffix : 'Matters')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {renderFormattedText(current.founderDescription || 'Startup Cafe was born from a simple belief: great ideas need great environments to flourish.')}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {renderFormattedText(current.founderSubtext || 'In this short message, our founder shares the vision behind creating India’s most collaborative coworking ecosystem.')}
                </p>

                {/* 3 mini highlights */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neon-purple block truncate">
                      {renderFormattedText(current.founderHighlight1Title || 'Built for')}
                    </span>
                    <span className="text-[9px] text-slate-300 truncate">
                      {renderFormattedText(current.founderHighlight1Sub || 'Founders')}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neon-blue block truncate">
                      {renderFormattedText(current.founderHighlight2Title || 'Designed for')}
                    </span>
                    <span className="text-[9px] text-slate-300 truncate">
                      {renderFormattedText(current.founderHighlight2Sub || 'Growth')}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neon-pink block truncate">
                      {renderFormattedText(current.founderHighlight3Title || 'Focused on')}
                    </span>
                    <span className="text-[9px] text-slate-300 truncate">
                      {renderFormattedText(current.founderHighlight3Sub || 'Impact')}
                    </span>
                  </div>
                </div>

                {/* 2 CTA Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1 text-[10px] font-bold text-white rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple shadow truncate">
                    {renderFormattedText(current.founderPrimaryButton || 'Book a Seat Today')}
                  </span>
                  <span className="text-slate-500 text-[10px]">or</span>
                  <span className="text-[10px] font-bold text-neon-blue underline truncate">
                    {renderFormattedText(current.founderSecondaryButton || 'Schedule a Visit')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. VISION & CONCEPT STORY DEDICATED PREVIEW */}
        {previewTab === 'franchiseVision' && (
          <div className="relative z-10 text-left py-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Side Image with glowing aura */}
              <div className="w-full sm:w-1/2 relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue blur-2xl opacity-25 rounded-2xl transform -rotate-3"></div>
                <img
                  src={current.franchiseVisionImage || defaultVisionImg}
                  onError={(e) => {
                    if (e.currentTarget.src !== defaultVisionImg) {
                      e.currentTarget.src = defaultVisionImg;
                    }
                  }}
                  alt="Vision Coworking Space"
                  className="w-full h-48 object-cover rounded-2xl border border-white/10 relative z-10 shadow-2xl"
                />
              </div>

              {/* Narrative */}
              <div className="w-full sm:w-1/2 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-neon-pink/15 text-neon-pink border border-neon-pink/30 flex items-center justify-center shrink-0">
                    {renderBenefitIcon(current.franchiseVisionBadgeIcon || 'Target', 'w-3 h-3 text-neon-pink', 12)}
                  </span>
                  <span className="text-[11px] font-semibold text-neon-pink uppercase tracking-wider">
                    {renderFormattedText(current.franchiseVisionBadge || 'Vision & Concept')}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {renderFormattedText(current.franchiseVisionHeading || 'Why India is Betting Big on')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                    {renderFormattedText(current.franchiseVisionAccent || 'Coworking')}
                  </span>
                </h3>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {renderFormattedText(current.franchiseVisionDesc1 || 'With the rise of the digital economy and hybrid work culture, demand for high-quality, professional workspaces is exploding across India, particularly in Tier 2 and Tier 3 cities.')}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {renderFormattedText(current.franchiseVisionDesc2 || 'Startup Cafe is more than just a place to plug in. It’s an ecosystem where founders find mentors, freelancers find clients, and companies find culture.')}
                </p>
              </div>
            </div>

            {/* 2 Feature Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-neon-blue/15 text-neon-blue border border-neon-blue/30 flex items-center justify-center shrink-0">
                    {renderBenefitIcon(current.franchiseVisionFeature1Icon || 'TrendingUp', 'w-3 h-3 text-neon-blue', 12)}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {renderFormattedText(current.franchiseVisionFeature1Title || 'Growth Engine')}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {renderFormattedText(current.franchiseVisionFeature1Desc || "India's coworking market is projected to reach $1.5B by 2027.")}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-neon-purple/15 text-neon-purple border border-neon-purple/30 flex items-center justify-center shrink-0">
                    {renderBenefitIcon(current.franchiseVisionFeature2Icon || 'Users', 'w-3 h-3 text-neon-purple', 12)}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {renderFormattedText(current.franchiseVisionFeature2Title || 'Community Focus')}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {renderFormattedText(current.franchiseVisionFeature2Desc || 'High retention through events and meaningful networking.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3.5 CREDIBILITY & AUTHORITY HIGHLIGHTS PREVIEW */}
        {previewTab === 'franchiseCredibility' && (
          <div className="relative z-10 text-left py-2 space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Credibility &amp; Authority Highlights
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white truncate">
                      {renderFormattedText(current.credibilityPillar1Title || '10+ Years of Startup Network')}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neon-blue/15 text-neon-blue border border-neon-blue/30 font-mono shrink-0">
                      {current.credibilityPillar1Icon || 'Network'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {renderFormattedText(current.credibilityPillar1Desc || "A decade of building India's strongest startup ecosystem.")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white truncate">
                      {renderFormattedText(current.credibilityPillar2Title || 'First Co-working Space of Eastern UP')}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neon-purple/15 text-neon-purple border border-neon-purple/30 font-mono shrink-0">
                      {current.credibilityPillar2Icon || 'MapPin'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {renderFormattedText(current.credibilityPillar2Desc || 'Pioneering the coworking culture in Eastern Uttar Pradesh.')}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white truncate">
                      {renderFormattedText(current.credibilityPillar3Title || 'Acknowledged by Startup Leaders & Media')}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neon-pink/15 text-neon-pink border border-neon-pink/30 font-mono shrink-0">
                      {current.credibilityPillar3Icon || 'Award'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {renderFormattedText(current.credibilityPillar3Desc || 'Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ECOSYSTEM & RECOGNITION CAROUSEL PREVIEW */}
        {previewTab === 'franchiseStory' && (
          <div className="relative z-10 text-left py-2 space-y-4">
            {/* Ecosystem & Recognition Carousel */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-center">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-semibold text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10">
                  {renderFormattedText(current.ecosystemBadge || 'Ecosystem & Recognition')}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {renderFormattedText(current.ecosystemHeading || 'Recognized &')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue">
                    {renderFormattedText(current.ecosystemAccent || 'Trusted Ecosystem')}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 max-w-sm mx-auto mt-0.5">
                  {renderFormattedText(current.ecosystemDescription || 'Startup Cafe is proud to be acknowledged by key Government bodies, Media houses, and Leading Innovation Hubs across India.')}
                </p>
              </div>

              {/* Partner Logos Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {(Array.isArray(current.ecosystemPartnersList) && current.ecosystemPartnersList.length > 0
                  ? current.ecosystemPartnersList
                  : DEFAULT_ECOSYSTEM_PARTNERS
                ).slice(0, 10).map((partner, idx) => (
                  <div
                    key={partner.id || idx}
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-[10px]"
                  >
                    <div className="w-5 h-5 rounded-full bg-white p-0.5 shrink-0 overflow-hidden">
                      <img
                        src={getPartnerLogoSrc(partner)}
                        alt={partner.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-slate-300 truncate max-w-[100px] font-medium">{partner.name}</span>
                    {partner.isGov && (
                      <span className="text-[8px] text-neon-blue bg-neon-blue/15 px-1 py-0.2 rounded font-mono">Gov</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. INCOME POTENTIAL & REVENUE MODEL DEDICATED PREVIEW */}
        {previewTab === 'franchiseRevenue' && (() => {
          const investment = current.franchiseInvestment || '₹25L - ₹45L';
          const streams = (Array.isArray(current.revenueStreamsList) && current.revenueStreamsList.length > 0)
            ? current.revenueStreamsList
            : DEFAULT_REVENUE_STREAMS;

          return (
            <div className="relative z-10 text-left pt-1 pb-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                {/* LEFT COLUMN: Badge, Heading, Description & Estimated Investment Box */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Landmark className="text-neon-blue w-3.5 h-3.5 shrink-0" />
                      <span className="text-neon-blue font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
                        {renderFormattedText(current.revenueBadge !== undefined ? current.revenueBadge : 'Income Potential')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-tight">
                      {renderFormattedText(current.revenueHeading !== undefined ? current.revenueHeading : 'Built for')}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                        {renderFormattedText(current.revenueAccent !== undefined ? current.revenueAccent : 'Profitability')}
                      </span>
                    </h3>

                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      {renderFormattedText(
                        current.revenueDescription !== undefined
                          ? current.revenueDescription
                          : 'Our business model goes beyond just "renting space". We\'ve optimized multiple revenue streams to ensure high occupancy and diverse income sources.'
                      )}
                    </p>
                  </div>

                  {/* Estimated Investment Card (matching original RevenueModel.jsx: border-none, bg-white/[0.05], scaled to fit) */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="p-3 sm:p-3.5 glass-card border-none bg-white/[0.05] rounded-xl">
                      <h4 className="text-white font-bold mb-1 text-xs sm:text-[13px]">
                        {renderFormattedText(
                          current.revenueInvestmentLabel !== undefined
                            ? current.revenueInvestmentLabel
                            : 'Estimated Investment'
                        )}
                      </h4>
                      <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                          {renderFormattedText(investment)}
                        </span>
                        <span className="text-slate-400 text-[10px] sm:text-xs">
                          {renderFormattedText(
                            current.revenueInvestmentSubtext !== undefined
                              ? current.revenueInvestmentSubtext
                              : '(Approximate)'
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {renderFormattedText(
                        current.revenueInvestmentDisclaimer !== undefined
                          ? current.revenueInvestmentDisclaimer
                          : '*Values vary based on location, area, and city tier.'
                      )}
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: Revenue Stream Cards Grid (compactly adjusted 2x2 grid) */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-2.5">
                  {streams.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-2.5 sm:p-3 glass-card border border-white/5 hover:bg-white/[0.05] transition-all rounded-xl group flex flex-col justify-between min-h-[88px]"
                    >
                      <div className="p-1.5 sm:p-2 bg-neon-blue/10 rounded-lg sm:rounded-xl w-fit mb-2 group-hover:bg-neon-blue text-neon-blue group-hover:text-black transition-all">
                        {renderBenefitIcon(item.iconName, 'w-3.5 h-3.5 sm:w-4 sm:h-4', 16)}
                      </div>
                      <div>
                        <h4 className="text-[11px] sm:text-xs font-bold text-white mb-0.5 group-hover:text-neon-blue transition-colors line-clamp-1">
                          {renderFormattedText(item.title)}
                        </h4>
                        <p className="text-neon-blue font-semibold text-[10px] sm:text-xs truncate">
                          {renderFormattedText(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* WHY PARTNER WITH US DEDICATED PREVIEW */}
        {previewTab === 'franchiseBenefits' && (
          <div className="relative z-10 text-center py-2 space-y-4">
            <div>
              {current.franchiseBenefitsBadge && (
                <span className="inline-block px-3 py-1 mb-2 text-[10px] font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md">
                  {renderFormattedText(current.franchiseBenefitsBadge)}
                </span>
              )}
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight"
                style={{ color: current.franchiseBenefitsHeadingColor || undefined }}
              >
                {renderFormattedText(current.franchiseBenefitsHeading !== undefined ? current.franchiseBenefitsHeading : 'Why Partner with')}{' '}
                <span className="text-neon-blue">
                  {renderFormattedText(current.franchiseBenefitsAccent !== undefined ? current.franchiseBenefitsAccent : 'Us?')}
                </span>
              </h2>
              <p
                className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed"
                style={{ color: current.franchiseBenefitsSubtitleColor || undefined }}
              >
                {renderFormattedText(current.franchiseBenefitsSubtitle !== undefined ? current.franchiseBenefitsSubtitle : 'We provide the foundation, tools, and brand power you need to build a successful coworking business from day one.')}
              </p>
            </div>

            {/* Benefits Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
              {(Array.isArray(current.franchiseBenefitsList) && current.franchiseBenefitsList.length > 0
                ? current.franchiseBenefitsList
                : DEFAULT_FRANCHISE_BENEFITS
              ).map((benefit, idx) => (
                <div
                  key={benefit.id || idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg ${benefit.bg || 'bg-neon-blue/10'} flex items-center justify-center mb-2`}>
                    {renderBenefitIcon(benefit.iconName, `${benefit.color || 'text-neon-blue'} w-4 h-4`, 16)}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {renderFormattedText(benefit.title)}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {renderFormattedText(benefit.desc)}
                  </p>
                </div>
              ))}

              {/* Callout Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10 flex flex-col justify-center items-center text-center">
                <h4 className="text-xs font-bold text-white mb-1">
                  {renderFormattedText(current.franchiseBenefitsCtaTitle !== undefined ? current.franchiseBenefitsCtaTitle : 'Start Your Journey')}
                </h4>
                <p className="text-[10px] text-slate-300 mb-2 italic">
                  "{renderFormattedText(current.franchiseBenefitsCtaQuote !== undefined ? current.franchiseBenefitsCtaQuote : 'Building the workspace of tomorrow, together.')}"
                </p>
                <div className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold shadow-sm">
                  {renderFormattedText(current.franchiseBenefitsCtaButton !== undefined ? current.franchiseBenefitsCtaButton : 'Inquire Now')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PATH TO OWNERSHIP / PROCESS ROADMAP PREVIEW */}
        {previewTab === 'franchiseProcess' && (
          <div className="relative z-10 text-center py-2 space-y-4">
            <div>
              {(() => {
                const badge = current.processBadge !== undefined ? current.processBadge : 'Roadmap';
                return badge ? (
                  <span className="inline-block px-3 py-1 mb-2 text-[10px] font-semibold tracking-wider text-neon-pink uppercase border border-neon-pink/30 rounded-full bg-neon-pink/10 backdrop-blur-md">
                    {renderFormattedText(badge)}
                  </span>
                ) : null;
              })()}
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight"
                style={{ color: current.processHeadingColor || undefined }}
              >
                {renderFormattedText(current.processHeading !== undefined ? current.processHeading : 'Your Path to')}{' '}
                <span className="text-neon-pink">
                  {renderFormattedText(current.processAccent !== undefined ? current.processAccent : 'Ownership')}
                </span>
              </h2>
              <p
                className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mb-2"
                style={{ color: current.processSubtitleColor || undefined }}
              >
                {renderFormattedText(current.processSubtitle !== undefined ? current.processSubtitle : 'Five simple steps to launching your own Startup Cafe.')}
              </p>

              {/* Layout Indicator Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                <span>Layout Style: <strong className="text-neon-pink uppercase">{current.processLayoutStyle || 'alternating'}</strong></span>
              </div>
            </div>

            {/* PREVIEW: ALTERNATING TIMELINE */}
            {(!current.processLayoutStyle || current.processLayoutStyle === 'alternating') && (
              <div className="space-y-2 relative text-left pt-2 max-w-md mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden sm:block -translate-x-1/2" />
                {(Array.isArray(current.processStepsList) && current.processStepsList.length > 0
                  ? current.processStepsList
                  : DEFAULT_PROCESS_STEPS
                ).map((step, idx) => {
                  const stepNum = step.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1);
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={step.id || idx}
                      className={`flex items-center gap-2 text-xs relative ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                        }`}
                    >
                      <div className="flex-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-lg bg-neon-pink/15 text-neon-pink flex items-center justify-center shrink-0">
                            {renderBenefitIcon(step.iconName, 'w-3 h-3 text-neon-pink', 12)}
                          </div>
                          <span className="font-bold text-white text-[11px] truncate">{renderFormattedText(step.title)}</span>
                          <span className="text-[9px] font-mono text-neon-pink ml-auto">#{renderFormattedText(stepNum)}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 line-clamp-1">{renderFormattedText(step.desc)}</p>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-neon-pink shadow-[0_0_8px_#ff2975] shrink-0 hidden sm:block" />
                      <div className="flex-1 hidden sm:block" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* PREVIEW: BENTO CARDS GRID */}
            {current.processLayoutStyle === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
                {(Array.isArray(current.processStepsList) && current.processStepsList.length > 0
                  ? current.processStepsList
                  : DEFAULT_PROCESS_STEPS
                ).map((step, idx) => {
                  const stepNum = step.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1);
                  return (
                    <div
                      key={step.id || idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-neon-pink/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-neon-pink/15 text-neon-pink flex items-center justify-center">
                          {renderBenefitIcon(step.iconName, 'w-3.5 h-3.5 text-neon-pink', 14)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-neon-pink px-2 py-0.5 rounded-full bg-neon-pink/10 border border-neon-pink/30">
                          #{renderFormattedText(stepNum)}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5 truncate">{renderFormattedText(step.title)}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{renderFormattedText(step.desc)}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PREVIEW: MILESTONE STEPPER */}
            {current.processLayoutStyle === 'horizontal' && (
              <div className="space-y-3 text-left pt-1">
                {/* Mini track */}
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-[9px] font-mono">
                  {(Array.isArray(current.processStepsList) && current.processStepsList.length > 0
                    ? current.processStepsList
                    : DEFAULT_PROCESS_STEPS
                  ).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                      {renderFormattedText(s.stepNumber || (i + 1 < 10 ? `0${i + 1}` : i + 1))}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(current.processStepsList) && current.processStepsList.length > 0
                    ? current.processStepsList
                    : DEFAULT_PROCESS_STEPS
                  ).map((step, idx) => (
                    <div key={step.id || idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-amber-400/20">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-md bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                          {renderBenefitIcon(step.iconName, 'w-3 h-3 text-amber-300', 12)}
                        </div>
                        <span className="text-[11px] font-bold text-white truncate">{renderFormattedText(step.title)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 line-clamp-1">{renderFormattedText(step.desc)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREVIEW: LEFT-SPINE RAIL */}
            {current.processLayoutStyle === 'left-spine' && (
              <div className="relative pl-6 border-l-2 border-emerald-400/30 space-y-2 text-left max-w-sm mx-auto pt-1">
                {(Array.isArray(current.processStepsList) && current.processStepsList.length > 0
                  ? current.processStepsList
                  : DEFAULT_PROCESS_STEPS
                ).map((step, idx) => {
                  const stepNum = step.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1);
                  return (
                    <div key={step.id || idx} className="relative group">
                      <div className="absolute -left-[31px] top-2.5 w-5 h-5 rounded-full bg-dark-bg border border-emerald-400 text-emerald-300 flex items-center justify-center font-mono text-[9px] font-bold">
                        {renderFormattedText(stepNum)}
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {renderBenefitIcon(step.iconName, 'w-3 h-3 text-emerald-400', 12)}
                          <h4 className="text-[11px] font-bold text-white truncate">{renderFormattedText(step.title)}</h4>
                        </div>
                        <p className="text-[9px] text-slate-400 line-clamp-1">{renderFormattedText(step.desc)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* UNMATCHED SUPPORT PREVIEW */}
        {previewTab === 'franchiseSupport' && (
          <div className="relative z-10 text-center py-2 space-y-4">
            <div>
              {(() => {
                const badge = current.supportBadge !== undefined ? current.supportBadge : 'Comprehensive Ecosystem';
                return badge ? (
                  <span className="inline-block px-3 py-1 mb-2 text-[10px] font-semibold tracking-wider text-neon-purple uppercase border border-neon-purple/30 rounded-full bg-neon-purple/10 backdrop-blur-md">
                    {renderFormattedText(badge)}
                  </span>
                ) : null;
              })()}
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight"
                style={{ color: current.supportHeadingColor || undefined }}
              >
                {renderFormattedText(current.supportHeading !== undefined ? current.supportHeading : 'Unmatched')}{' '}
                <span className="text-neon-purple">
                  {renderFormattedText(current.supportAccent !== undefined ? current.supportAccent : 'Support')}
                </span>
              </h2>
              <p
                className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mb-2"
                style={{ color: current.supportSubtitleColor || undefined }}
              >
                {renderFormattedText(current.supportSubtitle !== undefined ? current.supportSubtitle : 'You are never alone on your journey. Our expert teams are with you from day one to ensure your cafe is a massive success.')}
              </p>

              {/* Layout Indicator Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
                <span>Layout Style: <strong className="text-neon-purple uppercase">{current.supportLayoutStyle || 'grid'}</strong></span>
              </div>
            </div>

            {/* PREVIEW: BENTO GRID + CTA (ORIGINAL) */}
            {(!current.supportLayoutStyle || current.supportLayoutStyle === 'grid') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
                {(Array.isArray(current.supportItemsList) && current.supportItemsList.length > 0
                  ? current.supportItemsList
                  : DEFAULT_SUPPORT_ITEMS
                ).map((item, idx) => (
                  <div key={item.id || idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-neon-purple/15 text-neon-purple flex items-center justify-center shrink-0">
                        {renderBenefitIcon(item.iconName, 'w-3 h-3 text-neon-purple', 12)}
                      </div>
                      <span className="text-[11px] font-bold text-white truncate">{renderFormattedText(item.title)}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 line-clamp-1">{renderFormattedText(item.desc)}</p>
                  </div>
                ))}
                {/* Mini CTA Card */}
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 border border-white/15 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-white mb-0.5">
                    {renderFormattedText(current.supportCtaTitle || 'Ready to Lead?')}
                  </span>
                  <p className="text-[8px] text-slate-300 line-clamp-1 mb-1.5 px-1 opacity-90">
                    {renderFormattedText(current.supportCtaSubtitle || 'Download our complete franchise brochure.')}
                  </p>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-bold shadow-sm">
                    <Download size={10} />
                    <span>{renderFormattedText(current.supportCtaButton || 'Brochure')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: INTERACTIVE TABS */}
            {current.supportLayoutStyle === 'interactive-tabs' && (
              <div className="space-y-2 text-left pt-1">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-neon-purple/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-neon-purple">Active Pillar Spotlight</span>
                    <span className="text-[9px] font-mono text-slate-400">1 of {current.supportItemsList?.length || 5}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {renderFormattedText((current.supportItemsList || DEFAULT_SUPPORT_ITEMS)[0]?.title)}
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {renderFormattedText((current.supportItemsList || DEFAULT_SUPPORT_ITEMS)[0]?.desc)}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate max-w-[180px]">
                    {renderFormattedText(current.supportCtaTitle || 'Ready to Lead?')}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white text-black font-bold">
                    {renderFormattedText(current.supportCtaButton || 'Brochure')}
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: NUMBERED CARDS & BANNER */}
            {current.supportLayoutStyle === 'compact-cards' && (
              <div className="space-y-2 text-left pt-1">
                <div className="grid grid-cols-2 gap-2">
                  {(Array.isArray(current.supportItemsList) && current.supportItemsList.length > 0
                    ? current.supportItemsList.slice(0, 4)
                    : DEFAULT_SUPPORT_ITEMS.slice(0, 4)
                  ).map((item, idx) => (
                    <div key={item.id || idx} className="p-2 rounded-xl bg-white/[0.03] border border-emerald-400/20">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                        {renderBenefitIcon(item.iconName, 'w-3 h-3 text-emerald-400', 12)}
                      </div>
                      <h4 className="text-[10px] font-bold text-white truncate">{renderFormattedText(item.title)}</h4>
                    </div>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-400/30 text-center">
                  <span className="text-[10px] font-bold text-emerald-300">
                    {renderFormattedText(current.supportCtaButton || 'Download Brochure')} →
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: SPLIT COLUMNS & STICKY CTA */}
            {current.supportLayoutStyle === 'split-columns' && (
              <div className="grid grid-cols-2 gap-2 text-left pt-1">
                <div className="space-y-1.5">
                  {(Array.isArray(current.supportItemsList) && current.supportItemsList.length > 0
                    ? current.supportItemsList.slice(0, 2)
                    : DEFAULT_SUPPORT_ITEMS.slice(0, 2)
                  ).map((item, idx) => (
                    <div key={item.id || idx} className="p-2 rounded-lg bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-bold text-white block truncate">{renderFormattedText(item.title)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-amber-300 mb-1">
                    {renderFormattedText(current.supportCtaTitle || 'Brochure Kit')}
                  </span>
                  <div className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[9px]">
                    {renderFormattedText(current.supportCtaButton || 'Download')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SPACE & REQUIREMENTS PREVIEW */}
        {previewTab === 'franchiseRequirements' && (
          <div className="relative z-10 text-center py-2 space-y-4">
            <div>
              {(() => {
                const badge = current.requirementsBadge !== undefined ? current.requirementsBadge : 'Space & Criteria';
                return badge ? (
                  <span className="inline-block px-3 py-1 mb-2 text-[10px] font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md">
                    {renderFormattedText(badge)}
                  </span>
                ) : null;
              })()}
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight"
                style={{ color: current.requirementsHeadingColor || undefined }}
              >
                {renderFormattedText(current.requirementsHeading !== undefined ? current.requirementsHeading : 'Space &')}{' '}
                <span className="text-neon-blue">
                  {renderFormattedText(current.requirementsAccent !== undefined ? current.requirementsAccent : 'Requirements')}
                </span>
              </h2>
              <p
                className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mb-2"
                style={{ color: current.requirementsSubtitleColor || undefined }}
              >
                {renderFormattedText(current.requirementsSubtitle !== undefined ? current.requirementsSubtitle : 'Do you have what it takes to build a Startup Cafe?')}
              </p>

              {/* Layout Indicator Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                <span>Layout Style: <strong className="text-neon-blue uppercase">{current.requirementsLayoutStyle || 'grid'}</strong></span>
              </div>
            </div>

            {/* PREVIEW: BENTO GRID (ORIGINAL BASELINE) */}
            {(!current.requirementsLayoutStyle || current.requirementsLayoutStyle === 'grid') && (
              <div className="space-y-2 text-left pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Array.isArray(current.requirementsItemsList) && current.requirementsItemsList.length > 0
                    ? current.requirementsItemsList
                    : DEFAULT_REQUIREMENTS_ITEMS
                  ).map((item, idx) => (
                    <div key={item.id || idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center mb-1.5">
                        {renderBenefitIcon(item.iconName, 'w-3.5 h-3.5 text-neon-blue', 14)}
                      </div>
                      <h4 className="text-[11px] font-bold text-white truncate w-full mb-0.5">
                        {renderFormattedText(item.title)}
                      </h4>
                      <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                        {renderFormattedText(item.desc)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Investment Note Callout */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h5 className="text-[10px] font-bold text-white italic truncate">
                      {renderFormattedText(current.requirementsNoteTitle || 'Note on Investment capability:')}
                    </h5>
                    <p className="text-[9px] text-slate-400 line-clamp-1">
                      {renderFormattedText(current.requirementsNoteDesc || 'Apart from physical requirements, we look for partners who have financial capability...')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-neon-blue text-black font-bold text-[10px] shrink-0 shadow-sm">
                    {renderFormattedText(current.requirementsCtaButton || 'Apply Now')}
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: CRITERIA SPOTLIGHT */}
            {current.requirementsLayoutStyle === 'showcase' && (
              <div className="space-y-2 text-left pt-1">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-neon-blue/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-neon-blue">Active Criterion Spotlight</span>
                    <span className="text-[9px] font-mono text-slate-400">1 of {current.requirementsItemsList?.length || 3}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {renderFormattedText((current.requirementsItemsList || DEFAULT_REQUIREMENTS_ITEMS)[0]?.title)}
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {renderFormattedText((current.requirementsItemsList || DEFAULT_REQUIREMENTS_ITEMS)[0]?.desc)}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate max-w-[200px]">
                    {renderFormattedText(current.requirementsNoteTitle || 'Note on Investment capability:')}
                  </span>
                  <span className="text-[9px] px-2.5 py-0.5 rounded bg-neon-blue text-black font-bold">
                    {renderFormattedText(current.requirementsCtaButton || 'Apply Now')}
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: NUMBERED METRIC SPECS */}
            {current.requirementsLayoutStyle === 'modern' && (
              <div className="space-y-2 text-left pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Array.isArray(current.requirementsItemsList) && current.requirementsItemsList.length > 0
                    ? current.requirementsItemsList
                    : DEFAULT_REQUIREMENTS_ITEMS
                  ).map((item, idx) => (
                    <div key={item.id || idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-extrabold text-neon-pink">0{idx + 1}</span>
                        {renderBenefitIcon(item.iconName, 'w-3 h-3 text-neon-pink', 12)}
                      </div>
                      <h4 className="text-[11px] font-bold text-white truncate">{renderFormattedText(item.title)}</h4>
                      <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{renderFormattedText(item.desc)}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-white/15 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[8px] uppercase tracking-wider text-neon-pink font-bold block">Financial Capability</span>
                    <span className="text-[10px] text-white font-bold truncate block">
                      {renderFormattedText(current.requirementsNoteTitle || 'Note on Investment capability:')}
                    </span>
                  </div>
                  <span className="text-[9px] px-3 py-1 rounded bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shrink-0">
                    {renderFormattedText(current.requirementsCtaButton || 'Apply Now')}
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: SPLIT CHECKLIST & STICKY NOTE */}
            {current.requirementsLayoutStyle === 'checklist' && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-left pt-1 items-start">
                <div className="sm:col-span-7 space-y-1.5">
                  {(Array.isArray(current.requirementsItemsList) && current.requirementsItemsList.length > 0
                    ? current.requirementsItemsList
                    : DEFAULT_REQUIREMENTS_ITEMS
                  ).map((item, idx) => (
                    <div key={item.id || idx} className="p-2 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0">
                        {renderBenefitIcon(item.iconName, 'w-3 h-3 text-emerald-400', 12)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-white block truncate">{renderFormattedText(item.title)}</span>
                        <span className="text-[8px] text-slate-400 block truncate">{renderFormattedText(item.desc)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sm:col-span-5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-400/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Investor Check</span>
                    <h5 className="text-[10px] font-bold text-white leading-tight mb-1">
                      {renderFormattedText(current.requirementsNoteTitle || 'Note on Investment capability:')}
                    </h5>
                  </div>
                  <div className="mt-2 text-center py-1 rounded bg-emerald-400 text-black font-bold text-[9px]">
                    {renderFormattedText(current.requirementsCtaButton || 'Apply Now')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FRANCHISE TESTIMONIALS (PARTNER REVIEWS) PREVIEW */}
        {previewTab === 'franchiseTestimonials' && (() => {
          const partnersList = Array.isArray(current.franchiseTestimonialsList) && current.franchiseTestimonialsList.length > 0
            ? current.franchiseTestimonialsList
            : DEFAULT_FRANCHISE_TESTIMONIALS;

          const partnerAvatarMap = {
            rajesh: rajeshImg,
            priya: priyaImg,
            rohan: rohanImg,
            sanya: sanyaImg,
            arjun: arjunImg,
          };

          return (
            <div className="relative z-10 text-center py-2 space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-neon-pink uppercase tracking-wider block mb-1">
                  Partner Testimonials Preview
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ color: current.franchiseTestimonialsHeadingColor || undefined }}
                >
                  {renderFormattedText(current.franchiseTestimonialsHeading || 'Voice of our')}{' '}
                  <span className="text-neon-pink">
                    {renderFormattedText(current.franchiseTestimonialsAccent || 'Franchise Partners')}
                  </span>
                </h2>
                <p
                  className="text-xs max-w-sm mx-auto leading-relaxed text-slate-300"
                  style={{ color: current.franchiseTestimonialsSubtitleColor || undefined }}
                >
                  {renderFormattedText(current.franchiseTestimonialsSubtitle || 'Hear directly from those who are already growing with us.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-1">
                {partnersList.map((t, i) => {
                  const avatarSrc = partnerAvatarMap[t.avatarKey] || t.avatarUrl || (t.name?.toLowerCase().includes('priya') ? priyaImg : rajeshImg);
                  return (
                    <div
                      key={t.id || i}
                      className="glass-card p-3 rounded-xl border border-white/10 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={avatarSrc}
                          alt={t.name}
                          className="w-8 h-8 rounded-full border border-neon-pink p-0.5 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate leading-tight">
                            {renderFormattedText(t.name)}
                          </h4>
                          <span className="text-[10px] text-neon-pink font-semibold block truncate">
                            {renderFormattedText(t.location || t.role || 'Partner')}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 italic line-clamp-3 leading-relaxed">
                        "{renderFormattedText(t.text || t.content || '')}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* FRANCHISE INQUIRY FORM PREVIEW */}
        {previewTab === 'franchiseInquiry' && (() => {
          const budgetOptions = Array.isArray(current.franchiseInquiryBudgetOptions) && current.franchiseInquiryBudgetOptions.length > 0
            ? current.franchiseInquiryBudgetOptions
            : DEFAULT_FRANCHISE_BUDGET_OPTIONS;

          const showName = current.franchiseInquiryShowName !== false;
          const showEmail = current.franchiseInquiryShowEmail !== false;
          const showPhone = current.franchiseInquiryShowPhone !== false;
          const showCity = current.franchiseInquiryShowCity !== false;
          const showBudget = current.franchiseInquiryShowBudget !== false;
          const showMessage = current.franchiseInquiryShowMessage !== false;
          const showWhatsapp = current.franchiseInquiryShowWhatsapp !== false;

          const glowClass = current.franchiseInquiryCardGlow === 'blue'
            ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
            : current.franchiseInquiryCardGlow === 'purple'
              ? 'border-purple-500/40 shadow-[0_0_20px_rgba(176,38,255,0.2)]'
              : current.franchiseInquiryCardGlow === 'pink'
                ? 'border-pink-500/40 shadow-[0_0_20px_rgba(255,41,117,0.2)]'
                : 'border-white/10';

          const radiusClass = current.franchiseInquiryCardRadius === 'rounded-xl'
            ? 'rounded-xl'
            : current.franchiseInquiryCardRadius === 'rounded-3xl'
              ? 'rounded-3xl'
              : 'rounded-2xl';

          const btnGradClass = current.franchiseInquiryButtonGradient === 'pink-purple'
            ? 'bg-gradient-to-r from-neon-pink to-neon-purple'
            : current.franchiseInquiryButtonGradient === 'emerald'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : current.franchiseInquiryButtonGradient === 'amber'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink';

          return (
            <div className="relative z-10 text-center py-2 space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-neon-blue uppercase tracking-wider block mb-1">
                  Franchise Application Form Preview
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ color: current.franchiseInquiryHeadingColor || undefined }}
                >
                  {renderFormattedText(current.franchiseInquiryHeading || 'Start Your')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">
                    {renderFormattedText(current.franchiseInquiryAccent || 'Partner Journey')}
                  </span>
                </h2>
                <p
                  className="text-xs max-w-sm mx-auto leading-relaxed text-slate-300"
                  style={{ color: current.franchiseInquirySubtitleColor || undefined }}
                >
                  {renderFormattedText(current.franchiseInquirySubtitle || "Take the first step towards owning a premium co-working franchise. Let's discuss your vision.")}
                </p>
              </div>

              <div className={`glass-card p-4 ${radiusClass} border ${glowClass} text-left space-y-2.5 max-w-md mx-auto transition-all`}>
                {(showName || showEmail) && (
                  <div className={`grid ${showName && showEmail ? 'grid-cols-2' : 'grid-cols-1'} gap-2 text-xs`}>
                    {showName && (
                      <div>
                        <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                          {renderFormattedText(current.franchiseInquiryNameLabel || 'Full Name')}
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] truncate">
                          {renderFormattedText(current.franchiseInquiryNamePlaceholder || 'Sachin Tendulkar')}
                        </div>
                      </div>
                    )}
                    {showEmail && (
                      <div>
                        <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                          {renderFormattedText(current.franchiseInquiryEmailLabel || 'Email Address')}
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] truncate">
                          {renderFormattedText(current.franchiseInquiryEmailPlaceholder || 'sachin@luxury.com')}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(showPhone || showCity) && (
                  <div className={`grid ${showPhone && showCity ? 'grid-cols-2' : 'grid-cols-1'} gap-2 text-xs`}>
                    {showPhone && (
                      <div>
                        <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                          {renderFormattedText(current.franchiseInquiryPhoneLabel || 'Phone Number')}
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-[10px] truncate">
                          {renderFormattedText(current.franchiseInquiryPhonePlaceholder || '98765 43210')}
                        </div>
                      </div>
                    )}
                    {showCity && (
                      <div>
                        <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                          {renderFormattedText(current.franchiseInquiryCityLabel || 'Interested City')}
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] truncate">
                          📍 {renderFormattedText(current.franchiseInquiryCityPlaceholder || 'e.g. Gorakhpur, Lucknow, Varanasi')}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showBudget && (
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                      {renderFormattedText(current.franchiseInquiryBudgetLabel || 'Investment Budget')}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neon-pink font-semibold text-[10px] flex items-center justify-between">
                      <span>
                        {renderFormattedText(current.franchiseInquiryBudgetPlaceholder || 'Select an investment range')}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">({budgetOptions.length} Tiers Available)</span>
                    </div>
                  </div>
                )}

                {showMessage && (
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase">
                      {renderFormattedText(current.franchiseInquiryMessageLabel || 'Vision & Requirements')}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] italic line-clamp-2">
                      {renderFormattedText(current.franchiseInquiryMessagePlaceholder || 'Tell us about your interest in Startup Cafe...')}
                    </div>
                  </div>
                )}

                <div className="pt-1 space-y-1.5">
                  <div className={`py-2.5 rounded-xl font-bold text-xs text-center ${btnGradClass} text-white shadow-md transition-all`}>
                    {renderFormattedText(current.franchiseInquirySubmitText || 'Submit Application')}
                  </div>
                  {showWhatsapp ? (
                    <div className="py-2 rounded-xl text-[11px] font-semibold text-center bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center gap-1.5 transition-all">
                      <span>💬</span>
                      <span>{renderFormattedText(current.franchiseInquiryWhatsappText || 'WhatsApp Support')}</span>
                    </div>
                  ) : (
                    <div className="py-1 text-[10px] text-slate-500 italic text-center border border-dashed border-white/10 rounded-lg">
                      (WhatsApp Support button is hidden)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TYPOGRAPHY PREVIEW */}
        {previewTab === 'typography' && (
          <div className="relative z-10 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <TypeIcon size={14} className="text-neon-purple" />
                Live Typography Specimen
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-white/15"
                style={{ color: current.accentColor || '#b026ff' }}
              >
                Scale: {current.fontSizeScale || '100%'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Display Title (H1) • Weight {current.headingWeight || '700'}
              </span>
              <h1
                className="text-2xl sm:text-3xl tracking-tight text-white leading-tight mb-1"
                style={{ fontWeight: current.headingWeight || '700' }}
              >
                Next-Gen Workspace
              </h1>
              <div
                className="text-2xl sm:text-3xl tracking-tight text-transparent bg-clip-text"
                style={{
                  fontWeight: current.headingWeight || '700',
                  backgroundImage: `linear-gradient(to right, ${current.gradientStart || '#ff2975'}, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
                }}
              >
                Engineered for Founders
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Body Copy &amp; Description
              </span>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: current.mutedTextColor || '#94a3b8' }}
              >
                A dynamic ecosystem crafted for visionaries, freelancers, and rapidly scaling teams looking to innovate without limits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                style={{
                  background: `linear-gradient(to right, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg"
              >
                Explore Spaces
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                Font: {current.fontFamily?.replace(/['",]/g, '').split(' ')[0] || 'Poppins'}
              </span>
            </div>
          </div>
        )}

        {/* THEME & COLOR PREVIEW */}
        {previewTab === 'theme' && (
          <div className="relative z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <PaletteIcon size={14} className="text-neon-pink" />
                Theme Palette Breakdown
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Contrast Verified</span>
            </div>

            {/* Swatches */}
            <div className="grid grid-cols-3 gap-2">
              <div
                className="p-3 rounded-xl border border-white/15 text-center shadow-lg"
                style={{ backgroundColor: current.accentColor || '#b026ff' }}
              >
                <span className="text-[10px] font-extrabold text-white uppercase drop-shadow">Accent</span>
                <div className="text-[9px] text-white/90 font-mono mt-0.5">{current.accentColor || '#b026ff'}</div>
              </div>
              <div
                className="p-3 rounded-xl border border-white/15 text-center shadow-lg"
                style={{ backgroundColor: current.gradientStart || '#ff2975' }}
              >
                <span className="text-[10px] font-extrabold text-white uppercase drop-shadow">Grad Start</span>
                <div className="text-[9px] text-white/90 font-mono mt-0.5">{current.gradientStart || '#ff2975'}</div>
              </div>
              <div
                className="p-3 rounded-xl border border-white/15 text-center shadow-lg"
                style={{ backgroundColor: current.gradientEnd || '#00f0ff' }}
              >
                <span className="text-[10px] font-extrabold text-black uppercase drop-shadow">Grad End</span>
                <div className="text-[9px] text-black/80 font-mono mt-0.5">{current.gradientEnd || '#00f0ff'}</div>
              </div>
            </div>

            {/* Surface Contrast Test */}
            <div
              className="p-4 rounded-xl border border-white/10 space-y-2"
              style={{ backgroundColor: current.backgroundColor || '#050505' }}
            >
              <div className="flex items-center justify-between">
                <h4
                  className="text-sm font-bold"
                  style={{ color: current.primaryTextColor || '#f8fafc' }}
                >
                  Surface &amp; Text Legibility
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  BG: {current.backgroundColor || '#050505'}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: current.mutedTextColor || '#94a3b8' }}
              >
                This preview confirms that high contrast and vibrant glowing neon elements remain readable and balanced on all screen sizes.
              </p>
              <div className="pt-2">
                <div
                  className="h-2 rounded-full w-full shadow-md"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${current.gradientStart || '#ff2975'}, ${current.accentColor || '#b026ff'}, ${current.gradientEnd || '#00f0ff'})`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
