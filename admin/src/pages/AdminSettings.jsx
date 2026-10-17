import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { CLIENT_SITE_URL } from '../config';

// Icons & Constants
import {
  SettingsIcon,
  ArrowLeftIcon,
  EyeIcon,
  CheckIcon,
  ResetIcon,
  SparklesIcon,
} from '../components/admin/adminIcons';
import {
  FIELD_LABELS,
  DEFAULT_TAB_FIELDS,
  FONT_OPTIONS,
  FONT_SIZE_PRESETS,
  HEADING_WEIGHTS,
  LETTER_SPACINGS,
  THEME_PRESETS,
} from '../components/admin/adminConstants';

// Modular Admin Components
import AdminLivePreview from '../components/admin/AdminLivePreview';
import { NAV_TREE_DATA } from '../components/admin/AdminTreeNav';
import {
  Menu,
  ChevronRight,
  Search,
  LayoutGrid,
  Rocket,
  Paintbrush,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  ExternalLink,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import HeroTab from '../components/admin/tabs/HeroTab';
import AcknowledgedTab from '../components/admin/tabs/AcknowledgedTab';
import AboutTab from '../components/admin/tabs/AboutTab';
import MediaTab from '../components/admin/tabs/MediaTab';
import ServicesTab from '../components/admin/tabs/ServicesTab';
import AmenitiesTab from '../components/admin/tabs/AmenitiesTab';
import PricingTab from '../components/admin/tabs/PricingTab';
import TestimonialsTab from '../components/admin/tabs/TestimonialsTab';
import ContactTab from '../components/admin/tabs/ContactTab';
import TypographyTab from '../components/admin/tabs/TypographyTab';
import ThemeTab from '../components/admin/tabs/ThemeTab';
import BookingsTab from '../components/admin/tabs/BookingsTab';
import FranchiseLeadsTab from '../components/admin/tabs/FranchiseLeadsTab';
import FranchiseTab from '../components/admin/tabs/FranchiseTab';
import FranchiseBenefitsTab from '../components/admin/tabs/FranchiseBenefitsTab';
import FranchiseProcessTab from '../components/admin/tabs/FranchiseProcessTab';
import FranchiseSupportTab from '../components/admin/tabs/FranchiseSupportTab';
import FranchiseRequirementsTab from '../components/admin/tabs/FranchiseRequirementsTab';
import FranchiseTestimonialsTab from '../components/admin/tabs/FranchiseTestimonialsTab';
import FranchiseInquiryTab from '../components/admin/tabs/FranchiseInquiryTab';
import GalleryTab from '../components/admin/tabs/GalleryTab';
import SecurityTab from '../components/admin/tabs/SecurityTab';

// Re-export constants for backwards compatibility
export {
  FIELD_LABELS,
  DEFAULT_TAB_FIELDS,
  FONT_OPTIONS,
  FONT_SIZE_PRESETS,
  HEADING_WEIGHTS,
  LETTER_SPACINGS,
  THEME_PRESETS,
};

export default function AdminSettings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loginAdmin, logoutAdmin } = useAdminAuth();

  const { settings, updateSettings, resetSettings, defaultSettings } = useSettings();
  const [formData, setFormData] = useState(() => settings || defaultSettings || {});

  const normalizeTab = (tabId) => {
    if (!tabId) return 'hero';
    const aliasMap = {
      overview: 'franchise',
      credibility: 'franchiseCredibility',
      ecosystem: 'franchiseStory',
      story: 'franchiseStory',
      franchiseEcosystem: 'franchiseStory',
      founder: 'founderVideo',
      foundervideo: 'founderVideo',
      founderVideo: 'founderVideo',
      video: 'founderVideo',
      founderMessage: 'founderVideo',
      foundermessage: 'founderVideo',
      vision: 'franchiseVision',
      revenue: 'franchiseRevenue',
      benefits: 'franchiseBenefits',
      process: 'franchiseProcess',
      support: 'franchiseSupport',
      requirements: 'franchiseRequirements',
      franchiseReviews: 'franchiseTestimonials',
      franchisereviews: 'franchiseTestimonials',
      partnerReviews: 'franchiseTestimonials',
      reviews: 'testimonials',
      review: 'testimonials',
      inquiry: 'franchiseInquiry',
      all: 'franchiseAll',
      partners: 'acknowledged',
      partner: 'acknowledged',
      acknowledgedby: 'acknowledged',
      logos: 'acknowledged',
      password: 'security',
      passwords: 'security',
      auth: 'security',
      account: 'security',
    };
    return aliasMap[tabId] || (typeof tabId === 'string' && aliasMap[tabId.toLowerCase()]) || tabId;
  };

  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => normalizeTab(queryTab));
  const [previewTab, setPreviewTab] = useState(() => {
    const norm = normalizeTab(queryTab);
    return norm === 'franchiseAll' ? 'franchise' : norm;
  });
  const [activeField, setActiveField] = useState('mainHeading');
  const [saveToast, setSaveToast] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localBookings, setLocalBookings] = useState([]);
  const [franchiseInquiries, setFranchiseInquiries] = useState([]);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-login disabled: Authentication enforced via /login and ProtectedRoute
  // useEffect(() => {
  //   loginAdmin?.();
  // }, [loginAdmin]);

  const handleSelectTab = (tabId, updateUrl = true) => {
    const resolvedTab = normalizeTab(tabId);
    setActiveTab(resolvedTab);
    if (resolvedTab !== 'bookings' && resolvedTab !== 'franchiseInquiries') {
      setPreviewTab(resolvedTab === 'franchiseAll' ? 'franchise' : resolvedTab);
    }
    if (updateUrl) {
      setSearchParams({ tab: resolvedTab }, { replace: true });
    }
  };

  const handleFocusField = (fieldName) => {
    if (!fieldName) return;
    const name = typeof fieldName === 'string'
      ? fieldName
      : (fieldName.target?.name || fieldName.target?.id || '');
    const finalName = name || (typeof fieldName === 'string' ? fieldName : '');
    if (finalName) setActiveField(finalName);

    if (finalName.startsWith('acknowledged') || activeTab === 'acknowledged') {
      setPreviewTab('acknowledged');
    } else if (finalName.startsWith('founder') || activeTab === 'founderVideo') {
      setPreviewTab('founderVideo');
    } else if (finalName.startsWith('franchiseVision') || activeTab === 'franchiseVision') {
      setPreviewTab('franchiseVision');
    } else if (finalName.startsWith('credibilityPillar') || activeTab === 'franchiseCredibility') {
      setPreviewTab('franchiseCredibility');
    } else if (finalName.startsWith('ecosystem') || activeTab === 'franchiseStory') {
      setPreviewTab('franchiseStory');
    } else if (finalName.startsWith('revenue') || finalName === 'franchiseInvestment' || finalName === 'franchiseAreaRequired' || activeTab === 'franchiseRevenue') {
      setPreviewTab('franchiseRevenue');
    } else if (finalName.startsWith('franchiseBenefits') || activeTab === 'franchiseBenefits') {
      setPreviewTab('franchiseBenefits');
    } else if (finalName.startsWith('process') || finalName.startsWith('step') || activeTab === 'franchiseProcess') {
      setPreviewTab('franchiseProcess');
    } else if (finalName.startsWith('support') || finalName.startsWith('pillar') || activeTab === 'franchiseSupport') {
      setPreviewTab('franchiseSupport');
    } else if (finalName.startsWith('requirements') || finalName.startsWith('req') || activeTab === 'franchiseRequirements') {
      setPreviewTab('franchiseRequirements');
    } else if (finalName.startsWith('franchiseTestimonials') || finalName.startsWith('partner') || activeTab === 'franchiseTestimonials') {
      setPreviewTab('franchiseTestimonials');
    } else if (finalName.startsWith('franchiseInquiry') || finalName.startsWith('inquiry') || finalName.startsWith('budget') || activeTab === 'franchiseInquiry') {
      setPreviewTab('franchiseInquiry');
    } else if (finalName.startsWith('franchise') || activeTab === 'franchise' || activeTab === 'franchiseAll') {
      setPreviewTab('franchise');
    } else if (finalName.startsWith('about') || activeTab === 'about') {
      setPreviewTab('about');
    } else if (finalName.startsWith('services') || activeTab === 'services') {
      setPreviewTab('services');
    } else if (finalName.startsWith('amenities') || activeTab === 'amenities') {
      setPreviewTab('amenities');
    } else if (finalName.startsWith('press') || finalName.startsWith('media') || activeTab === 'media') {
      setPreviewTab('media');
    } else if (finalName.startsWith('pricing') || activeTab === 'pricing') {
      setPreviewTab('pricing');
    } else if (finalName.startsWith('gallery') || activeTab === 'gallery') {
      setPreviewTab('gallery');
    } else if (finalName.startsWith('testimonials') || activeTab === 'testimonials') {
      setPreviewTab('testimonials');
    } else if (finalName.startsWith('contact') || finalName.startsWith('map') || activeTab === 'contact') {
      setPreviewTab('contact');
    }
  };

  // React to URL search query changes dynamically
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      handleSelectTab(tabFromUrl, false);
    }
  }, [searchParams]);

  // Deep linking item/field auto-scroll and focus
  useEffect(() => {
    const targetItem = searchParams.get('item') || searchParams.get('field');
    if (targetItem) {
      setActiveField(targetItem);
      const timer = setTimeout(() => {
        const el = document.querySelector(`[name="${targetItem}"]`) || document.getElementById(targetItem);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus?.();
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searchParams, activeTab]);

  // Keep activeField relevant when switching tabs
  useEffect(() => {
    if (DEFAULT_TAB_FIELDS[activeTab]) {
      setActiveField(DEFAULT_TAB_FIELDS[activeTab]);
    }
  }, [activeTab]);

  // Synchronize local form state with context settings
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Load local bookings and franchise inquiries stored in frontend localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('startupcafe_local_bookings') || '[]');
      setLocalBookings(stored);
    } catch {
      setLocalBookings([]);
    }

    try {
      const storedFranchise = JSON.parse(localStorage.getItem('startupcafe_franchise_inquiries') || '[]');
      setFranchiseInquiries(storedFranchise);
    } catch {
      setFranchiseInquiries([]);
    }
  }, []);

  const handleChange = (e, val) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({
        ...prev,
        [e]: val,
      }));
      return;
    }
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleApplyWordStyle = (fieldName, tag) => {
    const targetField = fieldName || activeField || DEFAULT_TAB_FIELDS[activeTab] || 'mainHeading';
    const input = document.querySelector(`[name="${targetField}"]`);
    if (!input) return;

    let start = input.selectionStart ?? 0;
    let end = input.selectionEnd ?? 0;
    const val = input.value || '';

    // 1. CLEAR ALL: Instantly strip all style tags from this entire field
    if (tag === 'clear-all') {
      const stripped = val.replace(/\[[a-zA-Z0-9#=,\s._-]+:([^\]]+)\]/g, (match, inner) => {
        return inner.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
      });
      setFormData((prev) => ({ ...prev, [targetField]: stripped }));
      setTimeout(() => {
        input.focus();
      }, 50);
      return;
    }

    // 2. CLEAR (Single / Step-by-step backward)
    if (tag === 'clear') {
      if (start !== end) {
        const selectedText = val.slice(start, end);
        if (selectedText.includes('[') && selectedText.includes(':')) {
          const stripped = selectedText.replace(/\[[a-zA-Z0-9#=,\s._-]+:([^\]]+)\]/g, (match, inner) => {
            return inner.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
          });
          const newVal = val.slice(0, start) + stripped + val.slice(end);
          setFormData((prev) => ({ ...prev, [targetField]: newVal }));
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start + stripped.length);
          }, 50);
          return;
        }
      }

      const lastOpen = val.lastIndexOf('[', start > 0 ? start - 1 : 0);
      const lastCloseBeforeStart = val.lastIndexOf(']', start > 0 ? start - 1 : 0);

      let targetTagStart = -1;
      let targetTagEnd = -1;

      if (lastOpen !== -1 && (lastCloseBeforeStart === -1 || lastCloseBeforeStart < lastOpen)) {
        const nextClose = val.indexOf(']', start);
        const nextOpen = val.indexOf('[', start);
        if (nextClose !== -1 && (nextOpen === -1 || nextClose < nextOpen)) {
          const potentialTag = val.slice(lastOpen, nextClose + 1);
          if (potentialTag.includes(':')) {
            targetTagStart = lastOpen;
            targetTagEnd = nextClose + 1;
          }
        }
      }

      if (targetTagStart === -1 && start !== end) {
        const selected = val.slice(start, end);
        if (selected.startsWith('[') && selected.endsWith(']') && selected.includes(':')) {
          targetTagStart = start;
          targetTagEnd = end;
        }
      }

      if (targetTagStart === -1) {
        const allTags = [...val.matchAll(/\[[a-zA-Z0-9#=,\s._-]+:[^\]]+\]/g)];
        if (allTags.length > 0) {
          let closest = null;
          let minDistance = Infinity;

          for (const t of allTags) {
            const tStart = t.index;
            const tEnd = tStart + t[0].length;
            const dist = start >= tEnd ? (start - tEnd) : (tStart - start) + 10000;
            if (dist < minDistance) {
              minDistance = dist;
              closest = { start: tStart, end: tEnd };
            }
          }

          if (closest) {
            targetTagStart = closest.start;
            targetTagEnd = closest.end;
          }
        }
      }

      if (targetTagStart !== -1 && targetTagEnd !== -1) {
        const tagText = val.slice(targetTagStart, targetTagEnd);
        const cleanWord = tagText.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
        const newVal = val.slice(0, targetTagStart) + cleanWord + val.slice(targetTagEnd);

        setFormData((prev) => ({ ...prev, [targetField]: newVal }));

        setTimeout(() => {
          input.focus();
          const remainingTags = [...newVal.matchAll(/\[[a-zA-Z0-9#=,\s._-]+:[^\]]+\]/g)];
          if (remainingTags.length > 0) {
            let nextTarget = remainingTags[remainingTags.length - 1];
            for (let i = remainingTags.length - 1; i >= 0; i--) {
              if (remainingTags[i].index < targetTagStart) {
                nextTarget = remainingTags[i];
                break;
              }
            }
            const tText = nextTarget[0];
            const colonIdx = tText.indexOf(':');
            const innerStart = nextTarget.index + (colonIdx !== -1 ? colonIdx + 1 : 0);
            const innerEnd = nextTarget.index + tText.length - 1;
            input.setSelectionRange(innerStart, innerEnd);
          } else {
            input.setSelectionRange(targetTagStart, targetTagStart + cleanWord.length);
          }
        }, 50);
        return;
      }

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, end);
      }, 50);
      return;
    }

    // 3. APPLY / SWITCH / COMBINE PROPERTY CHIPS
    const lastOpen = val.lastIndexOf('[', start > 0 ? start - 1 : 0);
    const lastCloseBeforeStart = val.lastIndexOf(']', start > 0 ? start - 1 : 0);

    let isInsideTag = false;
    let tagStart = start;
    let tagEnd = end;

    if (lastOpen !== -1 && (lastCloseBeforeStart === -1 || lastCloseBeforeStart < lastOpen)) {
      const nextClose = val.indexOf(']', start);
      const nextOpen = val.indexOf('[', start);
      if (nextClose !== -1 && (nextOpen === -1 || nextClose < nextOpen)) {
        const potentialTag = val.slice(lastOpen, nextClose + 1);
        if (potentialTag.includes(':')) {
          tagStart = lastOpen;
          tagEnd = nextClose + 1;
          isInsideTag = true;
        }
      }
    }

    let targetRangeStart = start;
    let targetRangeEnd = end;
    let rawTarget = '';

    if (isInsideTag) {
      targetRangeStart = tagStart;
      targetRangeEnd = tagEnd;
      rawTarget = val.slice(tagStart, tagEnd);
    } else if (start !== end) {
      targetRangeStart = start;
      targetRangeEnd = end;
      rawTarget = val.slice(start, end);
    }

    const COLOR_TAGS = ['gold', 'cyan', 'pink', 'gradient', 'purple', 'blue', 'green', 'white'];
    const isColor = (t) => COLOR_TAGS.includes(t.toLowerCase()) || t.startsWith('#') || t.startsWith('rgb');
    const isSize = (t) =>
      ['large', 'huge', 'small', 'sm', 'lg', 'xl', '2xl'].includes(t.toLowerCase()) ||
      /^\d+(\.\d+)?(px|em|rem|%)$/.test(t.toLowerCase()) ||
      t.toLowerCase().startsWith('size=');

    let innerWord = '';
    let currentTags = [];

    if (rawTarget) {
      if (rawTarget.includes('[') && rawTarget.includes(']')) {
        const matches = [...rawTarget.matchAll(/\[([a-zA-Z0-9#=,\s._-]+):/g)];
        matches.forEach((m) => {
          m[1].split(',').forEach((p) => {
            const clean = p.trim().toLowerCase();
            if (clean && !currentTags.includes(clean)) {
              currentTags.push(clean);
            }
          });
        });
        innerWord = rawTarget.replace(/\[[a-zA-Z0-9#=,\s._-]+:/g, '').replace(/\]/g, '').trim();
      } else {
        innerWord = rawTarget.trim();
      }
    }

    if (!innerWord) {
      innerWord = 'Word';
    }

    let nextTags = [...currentTags];

    if (isColor(tag)) {
      if (currentTags.includes(tag.toLowerCase())) {
        nextTags = currentTags.filter((t) => t !== tag.toLowerCase());
      } else {
        nextTags = currentTags.filter((t) => !isColor(t));
        nextTags.unshift(tag);
      }
    } else if (isSize(tag)) {
      if (currentTags.includes(tag.toLowerCase())) {
        nextTags = currentTags.filter((t) => t !== tag.toLowerCase());
      } else {
        nextTags = currentTags.filter((t) => !isSize(t));
        nextTags.push(tag);
      }
    } else {
      const lowerTag = tag.toLowerCase();
      if (currentTags.includes(lowerTag)) {
        nextTags = currentTags.filter((t) => t !== lowerTag);
      } else {
        nextTags.push(lowerTag);
      }
    }

    let replacement = '';
    if (nextTags.length === 0) {
      replacement = innerWord;
    } else {
      replacement = `[${nextTags.join(',')}:${innerWord}]`;
    }

    let newVal = '';
    let selectStart = 0;
    let selectEnd = 0;

    if (rawTarget !== '') {
      newVal = val.slice(0, targetRangeStart) + replacement + val.slice(targetRangeEnd);
      const colonIdx = replacement.indexOf(':');
      const wordOffset = colonIdx !== -1 ? colonIdx + 1 : 0;
      selectStart = targetRangeStart + wordOffset;
      selectEnd = selectStart + innerWord.length;
    } else {
      const needSpace = targetRangeStart > 0 && val[targetRangeStart - 1] !== ' ' && val[targetRangeStart - 1] !== '\n';
      const prefix = needSpace ? ' ' : '';
      const fullInsert = prefix + replacement;
      newVal = val.slice(0, targetRangeStart) + fullInsert + val.slice(targetRangeStart);
      const colonIdx = fullInsert.indexOf(':');
      const wordOffset = colonIdx !== -1 ? colonIdx + 1 : prefix.length;
      selectStart = targetRangeStart + wordOffset;
      selectEnd = selectStart + innerWord.length;
    }

    setFormData((prev) => ({
      ...prev,
      [targetField]: newVal,
    }));

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(selectStart, selectEnd);
    }, 50);
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      accentColor: preset.accentColor,
      gradientStart: preset.gradientStart,
      gradientEnd: preset.gradientEnd,
      primaryTextColor: preset.primaryTextColor,
      mutedTextColor: preset.mutedTextColor,
      backgroundColor: preset.backgroundColor,
    }));
  };

  // 1. Save and stay in admin panel
  const handleSaveOnly = (e) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setSaveToast(true);
    setTimeout(() => setIsSaved(false), 2500);
    setTimeout(() => setSaveToast(false), 4000);
  };

  // 2. Save and immediately navigate to Main Page
  const handleSaveAndGoHome = (e) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    navigate('/');
  };

  // 3. Reset back to original defaults
  const handleReset = (e) => {
    if (e) e.preventDefault();
    resetSettings();
    setFormData(defaultSettings);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 4000);
  };


  const handleClearBookings = () => {
    if (window.confirm("Are you sure you want to clear locally stored bookings?")) {
      localStorage.removeItem('startupcafe_local_bookings');
      setLocalBookings([]);
    }
  };

  const handleClearFranchiseInquiries = () => {
    if (window.confirm("Are you sure you want to clear all franchise inquiries?")) {
      localStorage.removeItem('startupcafe_franchise_inquiries');
      setFranchiseInquiries([]);
    }
  };

  const handleDeleteSingleFranchiseInquiry = (targetId) => {
    const updated = franchiseInquiries.filter((item, idx) => (item.id || idx) !== targetId);
    localStorage.setItem('startupcafe_franchise_inquiries', JSON.stringify(updated));
    setFranchiseInquiries(updated);
  };

  const current = formData || defaultSettings || {};

  const currentTabInfo = NAV_TREE_DATA.flatMap((g) => g.items).find((i) => i.id === activeTab) || {
    id: activeTab,
    label: activeTab,
    description: 'Edit section settings and copy',
  };
  const currentGroupInfo = NAV_TREE_DATA.find((g) => g.items.some((i) => i.id === activeTab)) || NAV_TREE_DATA[0];
  const activeCategoryId = currentGroupInfo?.id || 'homepage';

  const allNavItems = NAV_TREE_DATA.flatMap((g) =>
    g.items.map((item) => ({ ...item, categoryName: g.category, categoryId: g.id }))
  );

  const searchResults = searchQuery.trim()
    ? allNavItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleSelectCategory = (catId) => {
    const group = NAV_TREE_DATA.find((g) => g.id === catId);
    if (group && group.items.length > 0) {
      handleSelectTab(group.items[0].id);
    }
  };

  const handleSwitchFranchiseView = (mode) => {
    const modeMap = {
      all: 'franchiseAll',
      franchiseAll: 'franchiseAll',
      overview: 'franchise',
      franchise: 'franchise',
      credibility: 'franchiseCredibility',
      franchiseCredibility: 'franchiseCredibility',
      founderVideo: 'founderVideo',
      vision: 'franchiseVision',
      franchiseVision: 'franchiseVision',
      story: 'franchiseStory',
      franchiseStory: 'franchiseStory',
      ecosystem: 'franchiseStory',
      franchiseEcosystem: 'franchiseStory',
      benefits: 'franchiseBenefits',
      franchiseBenefits: 'franchiseBenefits',
      revenue: 'franchiseRevenue',
      franchiseRevenue: 'franchiseRevenue',
      process: 'franchiseProcess',
      franchiseProcess: 'franchiseProcess',
      support: 'franchiseSupport',
      franchiseSupport: 'franchiseSupport',
      requirements: 'franchiseRequirements',
      franchiseRequirements: 'franchiseRequirements',
      testimonials: 'franchiseTestimonials',
      franchiseTestimonials: 'franchiseTestimonials',
      inquiry: 'franchiseInquiry',
      franchiseInquiry: 'franchiseInquiry',
    };
    handleSelectTab(modeMap[mode] || mode);
  };

  const isCopyTab = ['hero', 'acknowledged', 'about', 'media', 'services', 'amenities', 'pricing', 'testimonials', 'gallery', 'contact', 'franchise', 'franchiseAll', 'franchiseCredibility', 'founderVideo', 'franchiseVision', 'franchiseRevenue', 'franchiseStory', 'franchiseBenefits', 'franchiseProcess', 'franchiseSupport', 'franchiseRequirements', 'franchiseTestimonials', 'franchiseInquiry'].includes(activeTab);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1650px] mx-auto relative z-10 text-white">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2 group"
          >
            <ArrowLeftIcon size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Website
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <SettingsIcon className="text-neon-purple" size={32} />
              Website Customization Hub
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Easily select any website section below to edit content, customize colors &amp; fonts, and manage customer leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Live Preview */}
          {!['bookings', 'franchiseInquiries', 'security'].includes(activeTab) && (
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 cursor-pointer shadow-md ${showLivePreview
                ? 'bg-neon-blue/20 border-neon-blue/40 text-cyan-200 hover:bg-neon-blue/30'
                : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/15'
                }`}
              title="Toggle split-screen live preview"
            >
              {showLivePreview ? <Eye size={16} className="text-neon-blue" /> : <EyeOff size={16} className="text-slate-400" />}
              <span>{showLivePreview ? 'Live Preview: ON' : 'Live Preview: OFF'}</span>
            </button>
          )}

          {/* Top Quick Save Button */}
          {!['bookings', 'franchiseInquiries', 'security'].includes(activeTab) && (
            <button
              type="button"
              onClick={handleSaveOnly}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-md ${isSaved
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                : 'bg-neon-purple/20 border-neon-purple/50 text-white hover:bg-neon-purple/40 hover:shadow-[0_0_20px_rgba(176,38,255,0.4)]'
                }`}
            >
              {isSaved ? <Check size={16} className="text-emerald-400" /> : <Sparkles size={16} className="text-neon-purple" />}
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          )}

          <a
            href={CLIENT_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg transition-all flex items-center gap-2"
          >
            <ExternalLink size={15} className="text-neon-blue" />
            View Site ↗
          </a>

          <button
            type="button"
            onClick={() => handleSelectTab('security')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-300 hover:text-white'
            }`}
            title="Manage Admin Password & Security"
          >
            <ShieldCheck size={15} className="text-purple-400" />
            <span className="hidden md:inline">Password &amp; Security</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logoutAdmin?.();
              navigate('/sc-portal/access');
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            title="Log out of Admin session"
          >
            <LogOut size={15} className="text-red-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-auto">
        {saveToast && (
          <div className="px-5 py-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 font-medium shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md flex items-center gap-3 transition-all duration-300">
            <CheckIcon size={20} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Saved and Applied!</p>
              <p className="text-xs text-emerald-300">Changes are now live on your website.</p>
            </div>
            <Link
              to="/"
              className="ml-3 px-3 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-xs font-bold text-white border border-emerald-400/40 transition-colors"
            >
              View Site →
            </Link>
          </div>
        )}

        {resetToast && (
          <div className="px-5 py-3.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 font-medium shadow-[0_0_30px_rgba(176,38,255,0.3)] backdrop-blur-md flex items-center gap-3 transition-all duration-300">
            <ResetIcon size={18} className="text-neon-purple shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Restored to Defaults!</p>
              <p className="text-xs text-purple-300">Headings and settings reverted to factory defaults.</p>
            </div>
            <Link
              to="/"
              className="ml-3 px-3 py-1 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 text-xs font-bold text-white border border-purple-400/40 transition-colors"
            >
              View Site →
            </Link>
          </div>
        )}
      </div>

      {/* 🔍 GLOBAL QUICK FIND SEARCH BAR */}
      <div className="mb-6 relative">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-neon-blue pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Quick Find: Type what you want to edit (e.g. Hero, Pricing, WiFi, Phone, Franchise, Reviews, Colors)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-black/60 border border-white/15 focus:border-neon-blue text-sm text-white placeholder-slate-400 backdrop-blur-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-blue/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-2xl z-40 max-h-80 overflow-y-auto space-y-1.5 animate-in fade-in duration-150">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1 border-b border-white/10 flex justify-between">
              <span>Matching Sections ({searchResults.length})</span>
              <span className="text-slate-500">Click any section to edit immediately</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No sections matched "{searchQuery}". Try searching for Hero, Services, Pricing, Phone, WiFi, or Franchise.
              </div>
            ) : (
              searchResults.map((item) => {
                const ItemIcon = item.icon || Sparkles;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSelectTab(item.id);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple shrink-0 group-hover:scale-110 transition-transform">
                        <ItemIcon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium shrink-0">
                      {item.categoryName}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 🌟 4 PRIMARY VISUAL CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {NAV_TREE_DATA.map((cat) => {
          const CatIcon = cat.icon || LayoutGrid;
          const isActive = activeCategoryId === cat.id;
          const leadCount = cat.id === 'crm-leads' ? (localBookings.length + franchiseInquiries.length) : null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${isActive
                ? 'bg-gradient-to-br from-neon-purple/25 via-neon-blue/15 to-transparent border-neon-purple shadow-[0_0_25px_rgba(176,38,255,0.3)] ring-2 ring-neon-purple/50'
                : 'glass-card bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                }`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${isActive
                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg'
                    : 'bg-white/10 text-slate-300 border border-white/15'
                    }`}
                >
                  <CatIcon size={22} />
                </div>
                {leadCount !== null && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {leadCount} Leads
                  </span>
                )}
                {isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-blue shadow-[0_0_8px_#00f0ff] animate-pulse" />
                )}
              </div>
              <div className="font-extrabold text-base text-white group-hover:text-neon-blue transition-colors">
                {cat.category}
              </div>
              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {cat.subtitle}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <span>{cat.items.length} sections</span>
                <span>•</span>
                <span className={isActive ? 'text-neon-purple font-bold' : 'text-slate-400'}>
                  {isActive ? 'Active Category' : 'Click to View'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 🧭 HORIZONTAL SECTION SELECTOR RIBBON FOR ACTIVE CATEGORY */}
      <div className="mb-6 p-4 rounded-2xl glass-card border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentGroupInfo?.category} Sections:
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              (Click any section below to edit)
            </span>
          </div>
          <span className="text-xs text-neon-blue font-semibold">
            {currentGroupInfo?.items.findIndex(i => i.id === activeTab) + 1} of {currentGroupInfo?.items.length} Sections
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
          {currentGroupInfo?.items.map((item) => {
            const ItemIcon = item.icon || Sparkles;
            const isTabActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between group ${isTabActive
                  ? 'bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.4)] ring-1 ring-neon-purple'
                  : 'bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isTabActive
                      ? 'bg-neon-purple text-white shadow-sm'
                      : 'bg-white/10 text-slate-400 group-hover:text-white'
                      }`}
                  >
                    <ItemIcon size={14} />
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white/10 text-slate-300 border border-white/10">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs font-bold leading-tight line-clamp-1 ${isTabActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                >
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📋 CURRENT SECTION HELPER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-neon-purple/15 via-black/40 to-neon-blue/15 border border-white/15 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center text-white shrink-0 shadow-lg">
            {currentTabInfo.icon ? <currentTabInfo.icon size={20} /> : <Sparkles size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {currentGroupInfo?.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                {currentTabInfo.label}
              </span>
              {currentTabInfo.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-bold">
                  {currentTabInfo.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
              💡 {currentTabInfo.description || 'Edit content and settings below. Changes save live.'}
            </p>
          </div>
        </div>

        {/* View Layout Toggle */}
        {!['bookings', 'franchiseInquiries', 'security'].includes(activeTab) && (
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            {showLivePreview ? <EyeOff size={13} className="text-neon-blue" /> : <Eye size={13} className="text-neon-blue" />}
            <span>{showLivePreview ? 'Collapse Preview (Full Width)' : 'Split Live Preview'}</span>
          </button>
        )}
      </div>

      {/* Workspace Panels (Grid: 7/5 Split OR 12 Full-Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form */}
        <div
          className={
            !showLivePreview || ['bookings', 'franchiseInquiries', 'security'].includes(activeTab)
              ? 'lg:col-span-12 max-w-5xl mx-auto w-full'
              : 'lg:col-span-7 w-full'
          }
        >
          <div
            onFocusCapture={(e) => {
              if (e.target && e.target.name) {
                handleFocusField(e.target.name);
              }
            }}
            className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl"
          >
            {/* TAB PANELS */}
            {activeTab === 'hero' && (
              <HeroTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'acknowledged' && (
              <AcknowledgedTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'about' && (
              <AboutTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
                onSelectTab={handleSelectTab}
              />
            )}

            {activeTab === 'media' && (
              <MediaTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
                updateSettings={updateSettings}
                onSave={handleSaveOnly}
              />
            )}

            {activeTab === 'services' && (
              <ServicesTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'amenities' && (
              <AmenitiesTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'testimonials' && (
              <TestimonialsTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'contact' && (
              <ContactTab
                current={current}
                onChange={handleChange}
                onFocus={setActiveField}
                setFormData={setFormData}
              />
            )}

            {(activeTab === 'franchise' || activeTab === 'franchiseAll') && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode={activeTab === 'franchiseAll' ? 'all' : 'overview'}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseCredibility' && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode="credibility"
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'founderVideo' && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode="founderVideo"
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseStory' && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode="story"
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseVision' && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode="vision"
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseRevenue' && (
              <FranchiseTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                viewMode="revenue"
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseBenefits' && (
              <FranchiseBenefitsTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseProcess' && (
              <FranchiseProcessTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseSupport' && (
              <FranchiseSupportTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseRequirements' && (
              <FranchiseRequirementsTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseTestimonials' && (
              <FranchiseTestimonialsTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'franchiseInquiry' && (
              <FranchiseInquiryTab
                current={current}
                onChange={handleChange}
                onFocus={handleFocusField}
                setFormData={setFormData}
                onSwitchView={handleSwitchFranchiseView}
              />
            )}

            {activeTab === 'typography' && (
              <TypographyTab
                current={current}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'theme' && (
              <ThemeTab
                current={current}
                onChange={handleChange}
                onApplyPreset={handleApplyPreset}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab
                bookings={localBookings}
                onClear={handleClearBookings}
              />
            )}

            {activeTab === 'franchiseInquiries' && (
              <FranchiseLeadsTab
                inquiries={franchiseInquiries}
                onClear={handleClearFranchiseInquiries}
                onDeleteSingle={handleDeleteSingleFranchiseInquiry}
              />
            )}

            {activeTab === 'security' && (
              <SecurityTab />
            )}

            {/* Bottom Actions: Save / Save & View / Reset Defaults */}
            {!['bookings', 'franchiseInquiries', 'security'].includes(activeTab) && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-white/20 text-slate-300 hover:text-rose-200 hover:border-rose-500/50 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    title="Wipe custom settings and return everything back to original defaults"
                  >
                    <ResetIcon size={16} />
                    Reset Defaults
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveOnly}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 select-none ${isSaved
                      ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-[1.02]'
                      : 'bg-black/60 border border-neon-purple/60 text-white hover:border-neon-purple hover:bg-neon-purple/25 hover:shadow-[0_0_30px_rgba(176,38,255,0.6)] hover:-translate-y-0.5 active:bg-neon-purple/40 active:translate-y-0'
                      }`}
                    title="Save changes and apply immediately"
                  >
                    {isSaved ? (
                      <>
                        <CheckIcon size={18} className="text-emerald-400 animate-bounce" />
                        <span className="font-extrabold tracking-wide">Saved &amp; Applied!</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon size={16} className="text-neon-purple animate-pulse" />
                        <span>Save &amp; Apply</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAndGoHome}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/90 hover:to-neon-blue/90 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(176,38,255,0.4)] hover:shadow-[0_0_35px_rgba(176,38,255,0.8)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                    title="Save and navigate directly to the main live homepage"
                  >
                    <SparklesIcon size={16} />
                    Save &amp; View Site →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Live Preview */}
        {!['bookings', 'franchiseInquiries', 'security'].includes(activeTab) && showLivePreview && (
          <div className="lg:col-span-5 sticky top-28 self-start">
            <AdminLivePreview
              previewTab={previewTab}
              setPreviewTab={setPreviewTab}
              current={current}
              onSelectTab={handleSelectTab}
              setFormData={setFormData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
