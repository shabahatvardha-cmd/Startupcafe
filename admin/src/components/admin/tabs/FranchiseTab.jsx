import { useState, useRef, useEffect } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import {
  Sparkles,
  BarChart3,
  Building2,
  ExternalLink,
  Coins,
  Square,
  Video,
  Film,
  Briefcase,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  Info,
  RotateCcw,
  Network,
  MapPin,
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  Star,
  Globe,
  Rocket,
  HeartHandshake,
  Crown,
  Trophy,
  Zap,
  Target,
  Coffee,
  Flame,
  Compass,
  Sliders,
  Monitor,
  Laptop,
  Calendar,
  Landmark,
  Plus,
  Pencil,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Check,
  X,
  CheckSquare,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import { DEFAULT_REVENUE_STREAMS } from '../../../context/SettingsContext';
import { renderFormattedText } from '../../../utils/textFormatter';
import FranchiseSectionBar from './FranchiseSectionBar';
import defaultVisionImg from '../../../assets/franchise_about.png';
import defaultHeroImg from '../../../assets/franchise_hero.png';
import {
  LOGO_PRESETS,
  DEFAULT_ECOSYSTEM_PARTNERS,
  getPartnerLogoSrc,
} from '../../franchise/ecosystemConstants';

const AVAILABLE_PILLAR_ICONS = [
  { name: 'Network', label: 'Network', icon: Network },
  { name: 'MapPin', label: 'Location', icon: MapPin },
  { name: 'Award', label: 'Award', icon: Award },
  { name: 'ShieldCheck', label: 'Trust', icon: ShieldCheck },
  { name: 'TrendingUp', label: 'Growth', icon: TrendingUp },
  { name: 'Users', label: 'Community', icon: Users },
  { name: 'Building2', label: 'Spaces', icon: Building2 },
  { name: 'Sparkles', label: 'VIP', icon: Sparkles },
  { name: 'Star', label: 'Top Rated', icon: Star },
  { name: 'Globe', label: 'Global', icon: Globe },
  { name: 'Rocket', label: 'Launch', icon: Rocket },
  { name: 'HeartHandshake', label: 'Partner', icon: HeartHandshake },
  { name: 'Crown', label: 'Pioneer', icon: Crown },
  { name: 'Trophy', label: 'Trophy', icon: Trophy },
  { name: 'Briefcase', label: 'Enterprise', icon: Briefcase },
  { name: 'Zap', label: 'Speed', icon: Zap },
];

const AVAILABLE_VISION_ICONS = [
  { name: 'Target', label: 'Target / Vision', icon: Target },
  { name: 'TrendingUp', label: 'Growth / Metric', icon: TrendingUp },
  { name: 'Users', label: 'Community / People', icon: Users },
  { name: 'Rocket', label: 'Launch / Scale', icon: Rocket },
  { name: 'Sparkles', label: 'Innovation', icon: Sparkles },
  { name: 'Zap', label: 'Speed / Energy', icon: Zap },
  { name: 'Building2', label: 'Workspaces', icon: Building2 },
  { name: 'Globe', label: 'Expansion', icon: Globe },
  { name: 'Award', label: 'Recognition', icon: Award },
  { name: 'ShieldCheck', label: 'Trust / Security', icon: ShieldCheck },
  { name: 'HeartHandshake', label: 'Partnership', icon: HeartHandshake },
  { name: 'Crown', label: 'Leadership', icon: Crown },
  { name: 'Coffee', label: 'Cafe Culture', icon: Coffee },
  { name: 'Coins', label: 'Profitable ROI', icon: Coins },
  { name: 'Briefcase', label: 'Enterprise', icon: Briefcase },
  { name: 'Star', label: 'Excellence', icon: Star },
  { name: 'Trophy', label: 'Success', icon: Trophy },
  { name: 'Compass', label: 'Direction', icon: Compass },
  { name: 'Flame', label: 'High Demand', icon: Flame },
  { name: 'CheckCircle2', label: 'Verified', icon: CheckCircle2 },
  { name: 'Network', label: 'Ecosystem', icon: Network },
  { name: 'MapPin', label: 'Footprint', icon: MapPin },
];

const AVAILABLE_STREAM_ICONS = [
  { name: 'Monitor', label: 'Dedicated Desk / Monitor', icon: Monitor },
  { name: 'Laptop', label: 'Private Cabin / Laptop', icon: Laptop },
  { name: 'Coffee', label: 'Cafe Services', icon: Coffee },
  { name: 'Calendar', label: 'Events & Workshops', icon: Calendar },
  { name: 'Landmark', label: 'Financial / Income', icon: Landmark },
  { name: 'Building2', label: 'Workspaces', icon: Building2 },
  { name: 'Users', label: 'Community', icon: Users },
  { name: 'Zap', label: 'High Speed', icon: Zap },
  { name: 'Briefcase', label: 'Enterprise', icon: Briefcase },
  { name: 'Award', label: 'Premium', icon: Award },
  { name: 'Sparkles', label: 'VIP Services', icon: Sparkles },
  { name: 'Coins', label: 'High Margin', icon: Coins },
  { name: 'TrendingUp', label: 'Growth', icon: TrendingUp },
];

function getEmbedVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

export default function FranchiseTab({ current, onChange, onFocus, setFormData, viewMode = 'all', onSwitchView }) {
  const [internalSection, setInternalSection] = useState(viewMode || 'all');
  const [inlineExpandStory, setInlineExpandStory] = useState(false);

  useEffect(() => {
    if (viewMode) {
      setInternalSection(viewMode);
    }
  }, [viewMode]);

  const activeSection = internalSection;
  const isAll = activeSection === 'all';
  const showHeroOnly = activeSection === 'overview' || activeSection === 'franchise';
  const showCredibilityOnly = activeSection === 'credibility' || activeSection === 'franchiseCredibility';
  const showFounderVideoOnly = activeSection === 'founderVideo';
  const showVisionOnly = activeSection === 'vision' || activeSection === 'franchiseVision';
  const showEcosystemOnly = activeSection === 'story' || activeSection === 'franchiseStory' || activeSection === 'ecosystem' || activeSection === 'franchiseEcosystem';
  const showRevenueOnly = activeSection === 'revenue' || activeSection === 'franchiseRevenue';

  const showHero = isAll || showHeroOnly;
  const showCredibility = isAll || showCredibilityOnly || (showHeroOnly && inlineExpandStory);
  const showFounderVideo = isAll || showFounderVideoOnly;
  const showVision = isAll || showVisionOnly || (showHeroOnly && inlineExpandStory);
  const showEcosystem = isAll || showEcosystemOnly;
  const showRevenue = isAll || showRevenueOnly;

  const handleSwitchSection = (mode) => {
    const directTabs = [
      'credibility',
      'franchiseCredibility',
      'founderVideo',
      'vision',
      'franchiseVision',
      'ecosystem',
      'franchiseStory',
      'benefits',
      'franchiseBenefits',
      'process',
      'franchiseProcess',
      'support',
      'franchiseSupport',
      'requirements',
      'franchiseRequirements',
      'testimonials',
      'franchiseTestimonials',
      'inquiry',
      'franchiseInquiry'
    ];
    if (directTabs.includes(mode)) {
      setInternalSection(mode);
      onSwitchView?.(mode);
      return;
    }
    setInternalSection(mode);
    if (onSwitchView) {
      onSwitchView(mode);
    }
  };

  const revenueStreams = Array.isArray(current.revenueStreamsList) && current.revenueStreamsList.length > 0
    ? current.revenueStreamsList
    : DEFAULT_REVENUE_STREAMS;

  const [editingStreamId, setEditingStreamId] = useState(null);
  const [streamForm, setStreamForm] = useState({
    id: '',
    title: '',
    price: '',
    iconName: 'Monitor',
  });

  const handleStartAddStream = () => {
    setStreamForm({
      id: `stream-${Date.now()}`,
      title: '',
      price: '',
      iconName: 'Monitor',
    });
    setEditingStreamId('new');
  };

  const handleStartEditStream = (item) => {
    setStreamForm({
      id: item.id || `stream-${Date.now()}`,
      title: item.title || '',
      price: item.price || '',
      iconName: item.iconName || 'Monitor',
    });
    setEditingStreamId(item.id || item.title);
  };

  const handleSaveStream = (e) => {
    e?.preventDefault();
    if (!streamForm.title.trim()) {
      alert('Please enter a stream title (e.g. Dedicated Desk)');
      return;
    }
    const updated = {
      id: streamForm.id || `stream-${Date.now()}`,
      title: streamForm.title.trim(),
      price: streamForm.price.trim() || 'Custom Pricing',
      iconName: streamForm.iconName || 'Monitor',
    };

    if (editingStreamId === 'new') {
      setFormData?.((prev) => ({
        ...prev,
        revenueStreamsList: [...revenueStreams, updated],
      }));
    } else {
      const nextList = revenueStreams.map((s) =>
        (s.id === editingStreamId || s.title === editingStreamId) ? updated : s
      );
      setFormData?.((prev) => ({
        ...prev,
        revenueStreamsList: nextList,
      }));
    }
    setEditingStreamId(null);
  };

  const handleDeleteStream = (streamId) => {
    if (revenueStreams.length <= 1) {
      alert('You must keep at least 1 revenue stream card.');
      return;
    }
    const updated = revenueStreams.filter((s) => s.id !== streamId && s.title !== streamId);
    setFormData?.((prev) => ({
      ...prev,
      revenueStreamsList: updated,
    }));
    if (editingStreamId === streamId) setEditingStreamId(null);
  };

  const handleMoveStream = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= revenueStreams.length) return;
    const copy = [...revenueStreams];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData?.((prev) => ({
      ...prev,
      revenueStreamsList: copy,
    }));
  };

  const handleRestoreDefaultStreams = () => {
    if (window.confirm('Restore the original 4 default revenue stream cards?')) {
      setFormData?.((prev) => ({
        ...prev,
        revenueStreamsList: DEFAULT_REVENUE_STREAMS,
      }));
      setEditingStreamId(null);
    }
  };

  // Ecosystem & Recognition Partners State & Handlers
  const ecosystemPartners = Array.isArray(current.ecosystemPartnersList) && current.ecosystemPartnersList.length > 0
    ? current.ecosystemPartnersList
    : DEFAULT_ECOSYSTEM_PARTNERS;

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({
    id: '',
    name: '',
    badge: 'Acknowledged by',
    isGov: true,
    logoKey: 'logo1',
    imageUrl: '',
  });
  const [partnerLogoSource, setPartnerLogoSource] = useState('preset'); // 'preset' | 'upload' | 'url'
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const partnerFileInputRef = useRef(null);

  const handleStartAddPartner = () => {
    setPartnerForm({
      id: `partner-${Date.now()}`,
      name: '',
      badge: 'Acknowledged by',
      isGov: true,
      logoKey: 'logo1',
      imageUrl: '',
    });
    setPartnerLogoSource('preset');
    setEditingPartnerId('new');
  };

  const handleStartEditPartner = (item) => {
    setPartnerForm({
      id: item.id || `partner-${Date.now()}`,
      name: item.name || '',
      badge: item.badge || 'Acknowledged by',
      isGov: item.isGov !== undefined ? Boolean(item.isGov) : true,
      logoKey: item.logoKey || 'logo1',
      imageUrl: item.imageUrl || '',
    });
    setPartnerLogoSource(item.imageUrl ? (item.imageUrl.startsWith('data:') ? 'upload' : 'url') : 'preset');
    setEditingPartnerId(item.id || item.name);
  };

  const handleCancelPartner = () => {
    setEditingPartnerId(null);
  };

  const handlePartnerImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file is too large. Please select an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPartnerForm((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePartner = (e) => {
    e?.preventDefault();
    if (!partnerForm.name.trim()) {
      alert('Please enter a partner name (e.g. Ministry of Commerce & Industry)');
      return;
    }

    const newPartner = {
      id: partnerForm.id || `partner-${Date.now()}`,
      name: partnerForm.name.trim(),
      badge: partnerForm.badge.trim() || 'Acknowledged by',
      isGov: Boolean(partnerForm.isGov),
      logoKey: partnerForm.logoKey || 'logo1',
      imageUrl: partnerLogoSource === 'preset' ? '' : (partnerForm.imageUrl || '').trim(),
    };

    if (editingPartnerId === 'new') {
      const updatedList = [...ecosystemPartners, newPartner];
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          ecosystemPartnersList: updatedList,
        }));
      } else {
        onChange?.({
          target: {
            name: 'ecosystemPartnersList',
            value: updatedList,
          },
        });
      }
    } else {
      const updatedList = ecosystemPartners.map((item) =>
        (item.id === editingPartnerId || item.name === editingPartnerId) ? newPartner : item
      );
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          ecosystemPartnersList: updatedList,
        }));
      } else {
        onChange?.({
          target: {
            name: 'ecosystemPartnersList',
            value: updatedList,
          },
        });
      }
    }

    setEditingPartnerId(null);
  };

  const handleDeletePartner = (id) => {
    if (!window.confirm('Are you sure you want to remove this partner from the ecosystem carousel?')) return;
    const updatedList = ecosystemPartners.filter((item) => item.id !== id && item.name !== id);
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        ecosystemPartnersList: updatedList,
      }));
    } else {
      onChange?.({
        target: {
          name: 'ecosystemPartnersList',
          value: updatedList,
        },
      });
    }
    if (editingPartnerId === id) {
      setEditingPartnerId(null);
    }
  };

  const handleMovePartner = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ecosystemPartners.length) return;
    const reordered = [...ecosystemPartners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        ecosystemPartnersList: reordered,
      }));
    } else {
      onChange?.({
        target: {
          name: 'ecosystemPartnersList',
          value: reordered,
        },
      });
    }
  };

  const handleRestoreDefaultPartners = () => {
    if (window.confirm('Reset all ecosystem partner cards back to the original 12 defaults?')) {
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          ecosystemBadge: 'Ecosystem & Recognition',
          ecosystemHeading: 'Recognized &',
          ecosystemAccent: 'Trusted Ecosystem',
          ecosystemDescription: 'Startup Cafe is proud to be acknowledged by key Government bodies and associated with top media and industry networks.',
          ecosystemPartnersList: DEFAULT_ECOSYSTEM_PARTNERS,
        }));
      } else {
        onChange?.({ target: { name: 'ecosystemBadge', value: 'Ecosystem & Recognition' } });
        onChange?.({ target: { name: 'ecosystemHeading', value: 'Recognized &' } });
        onChange?.({ target: { name: 'ecosystemAccent', value: 'Trusted Ecosystem' } });
        onChange?.({ target: { name: 'ecosystemDescription', value: 'Startup Cafe is proud to be acknowledged by key Government bodies and associated with top media and industry networks.' } });
        onChange?.({ target: { name: 'ecosystemPartnersList', value: DEFAULT_ECOSYSTEM_PARTNERS } });
      }
      setEditingPartnerId(null);
    }
  };

  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com') ||
      url.startsWith('http://') ||
      url.startsWith('https://')
    );
  };

  const isVideoFile = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('data:video') || url.startsWith('blob:');
  };

  const initialVideoMode = (() => {
    const src = current.founderVideoSource || 'default';
    if (src === 'workspace') return 'workspace';
    if (src === 'custom' || src === 'upload' || src === 'youtube') {
      if (isVideoFile(current.founderVideoUrl)) return 'upload';
      if (isVideoUrl(current.founderVideoUrl)) return 'youtube';
      return 'upload';
    }
    return 'default';
  })();

  const [selectedVideoMode, setSelectedVideoMode] = useState(initialVideoMode);
  const [urlInput, setUrlInput] = useState(() => (isVideoUrl(current.founderVideoUrl) ? current.founderVideoUrl : ''));
  const [uploadedFileName, setUploadedFileName] = useState(() => (isVideoFile(current.founderVideoUrl) ? 'Custom Uploaded Video' : ''));
  const [fileError, setFileError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (current.founderVideoSource === 'workspace') {
      setSelectedVideoMode('workspace');
    } else if (current.founderVideoSource === 'default' || !current.founderVideoSource) {
      setSelectedVideoMode('default');
    } else if (current.founderVideoSource === 'custom' || current.founderVideoSource === 'upload' || current.founderVideoSource === 'youtube') {
      if (isVideoUrl(current.founderVideoUrl)) {
        setSelectedVideoMode('youtube');
        setUrlInput(current.founderVideoUrl);
      } else {
        setSelectedVideoMode('upload');
      }
    }
  }, [current.founderVideoSource, current.founderVideoUrl]);

  // Hero Background Banner Image Upload State & Handlers
  const heroFileInputRef = useRef(null);
  const [heroImageInputMode, setHeroImageInputMode] = useState('upload');
  const [heroUploadError, setHeroUploadError] = useState('');
  const [isHeroUploading, setIsHeroUploading] = useState(false);

  const handleHeroFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploadError('');
    if (!file.type.startsWith('image/')) {
      setHeroUploadError('Please select a valid image file (WebP, PNG, JPG).');
      return;
    }
    setIsHeroUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 1920;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (setFormData) {
          setFormData((prev) => ({ ...prev, franchiseHeroImage: dataUrl }));
        } else {
          onChange?.({ target: { name: 'franchiseHeroImage', value: dataUrl } });
        }
        setIsHeroUploading(false);
      };
      img.onerror = () => {
        setHeroUploadError('Failed to load image.');
        setIsHeroUploading(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setHeroUploadError('Failed to read file.');
      setIsHeroUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleResetHeroImage = () => {
    if (setFormData) {
      setFormData((prev) => ({ ...prev, franchiseHeroImage: '' }));
    } else {
      onChange?.({ target: { name: 'franchiseHeroImage', value: '' } });
    }
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = '';
    }
  };

  // Vision Section Image Upload State & Handlers
  const visionFileInputRef = useRef(null);
  const [visionImageInputMode, setVisionImageInputMode] = useState('upload');
  const [visionUploadError, setVisionUploadError] = useState('');
  const [isVisionUploading, setIsVisionUploading] = useState(false);

  const handleVisionFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVisionUploadError('');
    if (!file.type.startsWith('image/')) {
      setVisionUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setIsVisionUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (setFormData) {
          setFormData((prev) => ({ ...prev, franchiseVisionImage: dataUrl }));
        } else {
          onChange?.({ target: { name: 'franchiseVisionImage', value: dataUrl } });
        }
        setIsVisionUploading(false);
      };
      img.onerror = () => {
        setVisionUploadError('Failed to load image.');
        setIsVisionUploading(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setVisionUploadError('Failed to read file.');
      setIsVisionUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleResetVisionImage = () => {
    if (setFormData) {
      setFormData((prev) => ({ ...prev, franchiseVisionImage: '' }));
    } else {
      onChange?.({ target: { name: 'franchiseVisionImage', value: '' } });
    }
    if (visionFileInputRef.current) {
      visionFileInputRef.current.value = '';
    }
  };

  const videoSource = current.founderVideoSource || 'default';
  const customVideoUrl = current.founderVideoUrl || '';
  const detectedEmbed = getEmbedVideoUrl(customVideoUrl);

  const handleSelectSource = (src) => {
    setSelectedVideoMode(src);
    if (src === 'default') {
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          founderVideoSource: 'default',
        }));
      } else {
        onChange?.({ target: { name: 'founderVideoSource', value: 'default' } });
      }
    } else if (src === 'workspace') {
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          founderVideoSource: 'workspace',
        }));
      } else {
        onChange?.({ target: { name: 'founderVideoSource', value: 'workspace' } });
      }
    } else if (src === 'upload') {
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          founderVideoSource: 'custom',
        }));
      } else {
        onChange?.({ target: { name: 'founderVideoSource', value: 'custom' } });
      }
    } else if (src === 'youtube') {
      const trimmedUrl = urlInput.trim();
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          founderVideoSource: 'custom',
          ...(trimmedUrl ? { founderVideoUrl: trimmedUrl } : {}),
        }));
      } else {
        onChange?.({ target: { name: 'founderVideoSource', value: 'custom' } });
        if (trimmedUrl) {
          onChange?.({ target: { name: 'founderVideoUrl', value: trimmedUrl } });
        }
      }
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setSelectedVideoMode('youtube');
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        founderVideoSource: 'custom',
        founderVideoUrl: urlInput.trim(),
      }));
    } else {
      onChange?.({ target: { name: 'founderVideoSource', value: 'custom' } });
      onChange?.({ target: { name: 'founderVideoUrl', value: urlInput.trim() } });
    }
  };

  const handleResetToDefault = () => {
    setSelectedVideoMode('default');
    setUrlInput('');
    setUploadedFileName('');
    setFileError('');
    setUploadProgress(null);
    handleClearCustomVideo();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video file (MP4, WebM, etc.)');
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 25) {
      setFileError(`Selected file is ${sizeMb.toFixed(1)} MB. For videos over 25 MB, using YouTube Shorts / embedding is recommended for fast performance.`);
    }

    setUploadedFileName(file.name);
    setSelectedVideoMode('upload');
    setUploadProgress(`Loading ${file.name} (${sizeMb.toFixed(1)} MB)...`);

    if (sizeMb <= 4) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        if (setFormData) {
          setFormData((prev) => ({
            ...prev,
            founderVideoSource: 'custom',
            founderVideoUrl: dataUrl,
          }));
        } else {
          onChange?.({ target: { name: 'founderVideoSource', value: 'custom' } });
          onChange?.({ target: { name: 'founderVideoUrl', value: dataUrl } });
        }
        setUploadProgress(null);
      };
      reader.onerror = () => {
        setFileError('Failed to read video file.');
        setUploadProgress(null);
      };
      reader.readAsDataURL(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          founderVideoSource: 'custom',
          founderVideoUrl: objectUrl,
        }));
      } else {
        onChange?.({ target: { name: 'founderVideoSource', value: 'custom' } });
        onChange?.({ target: { name: 'founderVideoUrl', value: objectUrl } });
      }
      setUploadProgress(null);
    }
  };

  const handleClearCustomVideo = () => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        founderVideoSource: 'default',
        founderVideoUrl: '',
      }));
    } else {
      onChange?.({ target: { name: 'founderVideoSource', value: 'default' } });
      onChange?.({ target: { name: 'founderVideoUrl', value: '' } });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* STANDARDIZED FRANCHISE SECTION BAR */}
      <FranchiseSectionBar
        activeSection={activeSection}
        onSwitchSection={handleSwitchSection}
        showAllOption={true}
      />

      {/* QUICK ACCESS BANNER FOR FOUNDER VIDEO & FRAME */}
      {showHero && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-pink/15 via-purple-900/20 to-neon-blue/15 border border-neon-pink/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-pink/20 border border-neon-pink/40 flex items-center justify-center shrink-0">
              <Video size={20} className="text-neon-pink" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                Founder Video &amp; Frame Customizer
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink border border-neon-pink/30 font-semibold">1-Click Quick Access</span>
              </h4>
              <p className="text-[11px] text-slate-300">
                Customize video player shape (16:9, 9:16), corner curvature (0px–52px), and bezel border thickness (0px–8px).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchSection('credibility')}
              className="px-3.5 py-2 rounded-xl bg-neon-purple/30 hover:bg-neon-purple/50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-neon-purple/40 shadow-md"
            >
              <Award size={14} className="text-neon-purple" />
              <span>3 Trust Pillars</span>
              <ArrowRight size={13} />
            </button>
            <button
              type="button"
              onClick={() => handleSwitchSection('founderVideo')}
              className="px-4 py-2 rounded-xl bg-neon-pink hover:bg-neon-pink/90 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-neon-pink/20"
            >
              <span>Open Video &amp; Frame Editor</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* OVERVIEW SECTIONS (1. HERO & 2. STATS) */}
      {showHero && (
        <>
          {/* 1. HERO PITCH & HEADLINES */}
          <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-neon-purple" />
                  Franchise Hero &amp; Brand Pitch
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the main headline, glowing accent, and value proposition on the Franchise page
                </p>
              </div>
              <span className="text-xs text-neon-purple font-semibold px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/20">
                Page Hero
              </span>
            </div>

            {/* Badge */}
            <VisualTextEditor
              label="Badge Tag (Pill above heading)"
              name="franchiseBadge"
              value={current.franchiseBadge || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseBadge')}
              placeholder="e.g. Franchise Opportunity"
            />

            {/* Heading + Accent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VisualTextEditor
                label="Main Heading (Prefix)"
                name="franchiseHeading"
                value={current.franchiseHeading || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseHeading')}
                placeholder="e.g. Start Your Own"
              />
              <VisualTextEditor
                label="Gradient Accent Highlight"
                name="franchiseAccent"
                value={current.franchiseAccent || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseAccent')}
                placeholder="e.g. Startup Cafe"
              />
            </div>

            {/* Description */}
            <VisualTextEditor
              label="Hero Subtitle / Value Proposition"
              name="franchiseDescription"
              value={current.franchiseDescription || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseDescription')}
              placeholder="Describe why entrepreneurs should partner with Startup Cafe..."
              isTextarea={true}
              rows={3}
            />

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <VisualTextEditor
                label="Primary Button (Scrolls to Form)"
                name="franchisePrimaryButton"
                value={current.franchisePrimaryButton || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('franchisePrimaryButton')}
                placeholder="e.g. Apply for Franchise"
              />
              <VisualTextEditor
                label="Secondary Button (Scrolls to Model)"
                name="franchiseSecondaryButton"
                value={current.franchiseSecondaryButton || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseSecondaryButton')}
                placeholder="e.g. Learn More"
              />
            </div>

            {/* Hero Background Banner Image Manager */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-neon-purple" />
                    <span>Hero Background Banner Image</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    The top full-width panoramic background of the Franchise page.
                  </p>
                </div>
                <div>
                  {current.franchiseHeroImage ? (
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Custom Background Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      Default Photo (franchise_hero.png)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Visual Thumbnail Preview */}
                <div className="md:col-span-5 space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg group">
                    <img
                      src={current.franchiseHeroImage || defaultHeroImg}
                      alt="Franchise Hero Background"
                      className="w-full h-36 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <div className="flex items-center justify-between w-full text-[10px]">
                        <span className="font-mono text-slate-300 truncate pr-2">
                          {current.franchiseHeroImage ? 'Custom Upload / URL' : 'franchise_hero.png'}
                        </span>
                        <span className="font-bold text-neon-purple shrink-0">
                          Hero Banner
                        </span>
                      </div>
                    </div>
                  </div>

                  {current.franchiseHeroImage && (
                    <button
                      type="button"
                      onClick={handleResetHeroImage}
                      className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-neon-purple/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Reset back to the original franchise_hero.png image"
                    >
                      <RotateCcw size={12} className="text-neon-purple" />
                      <span>Reset to Original Default Photo</span>
                    </button>
                  )}
                </div>

                {/* Upload or URL Controls */}
                <div className="md:col-span-7 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroImageInputMode('upload')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${heroImageInputMode === 'upload'
                        ? 'bg-neon-purple/20 text-white border-neon-purple/50 shadow-sm'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Upload size={13} />
                      <span>Upload from Device</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroImageInputMode('url')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${heroImageInputMode === 'url'
                        ? 'bg-neon-blue/20 text-white border-neon-blue/50 shadow-sm'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <LinkIcon size={13} />
                      <span>Paste Web Link / URL</span>
                    </button>
                  </div>

                  {heroImageInputMode === 'upload' ? (
                    <div className="space-y-2">
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                        id="franchise-hero-file-upload"
                      />
                      <label
                        htmlFor="franchise-hero-file-upload"
                        className={`w-full p-4 rounded-xl border border-dashed border-white/20 hover:border-neon-purple/50 bg-black/40 hover:bg-neon-purple/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${isHeroUploading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <Upload size={20} className="text-neon-purple" />
                        <span className="text-xs font-semibold text-white">
                          {isHeroUploading ? 'Optimizing Image...' : 'Click to Upload .webp, .png, or .jpg'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Recommended: 1920×1080 horizontal wide angle (auto-compressed)
                        </span>
                      </label>
                      {heroUploadError && (
                        <p className="text-[11px] text-rose-400 font-medium">{heroUploadError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <VisualTextEditor
                        label="Hero Background Image URL"
                        name="franchiseHeroImage"
                        value={current.franchiseHeroImage || ''}
                        onChange={onChange}
                        onFocus={() => onFocus?.('franchiseHeroImage')}
                        placeholder="https://example.com/your-panoramic-photo.webp"
                      />
                      <p className="text-[10px] text-slate-400">
                        Paste any public image URL or CDN link (Unsplash, imgur, etc.)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. FOUR KEY PERFORMANCE STATS */}
          <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
            <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-neon-blue" />
                  Key Business Metrics (Hero Stats Bar)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The four performance stats displayed directly beneath the Franchise Hero banner
                </p>
              </div>
              <div className="flex items-center gap-2">
                {setFormData && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        franchiseStat1Value: '15+',
                        franchiseStat1Label: 'Cities',
                        franchiseStat2Value: '50k+',
                        franchiseStat2Label: 'Sq Ft Managed',
                        franchiseStat3Value: '2000+',
                        franchiseStat3Label: 'Members',
                        franchiseStat4Value: 'High',
                        franchiseStat4Label: 'ROI Potential',
                      }));
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore original codebase defaults (15+ Cities, 50k+ Sq Ft, etc.)"
                  >
                    <RotateCcw size={12} className="text-neon-blue" />
                    <span>Restore Defaults</span>
                  </button>
                )}
                <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
                  4 Stats
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neon-blue/5 border border-neon-blue/20 text-[11px] text-slate-300 flex items-center justify-between">
              <span>💡 <strong>Safe Mode</strong>: Original codebase defaults (<code className="text-neon-blue">15+ Cities</code>, <code className="text-neon-purple">50k+ Sq Ft</code>, <code className="text-neon-pink">2000+ Members</code>, <code className="text-emerald-400">High ROI</code>) are permanently safeguarded. Any edits take effect live and can be restored anytime.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stat 1 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neon-blue block">Stat #1</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <VisualTextEditor
                    label="Stat #1 Value"
                    name="franchiseStat1Value"
                    value={current.franchiseStat1Value || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat1Value')}
                    placeholder="15+"
                  />
                  <VisualTextEditor
                    label="Stat #1 Label"
                    name="franchiseStat1Label"
                    value={current.franchiseStat1Label || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat1Label')}
                    placeholder="Cities"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neon-purple block">Stat #2</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <VisualTextEditor
                    label="Stat #2 Value"
                    name="franchiseStat2Value"
                    value={current.franchiseStat2Value || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat2Value')}
                    placeholder="50k+"
                  />
                  <VisualTextEditor
                    label="Stat #2 Label"
                    name="franchiseStat2Label"
                    value={current.franchiseStat2Label || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat2Label')}
                    placeholder="Sq Ft Managed"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neon-pink block">Stat #3</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <VisualTextEditor
                    label="Stat #3 Value"
                    name="franchiseStat3Value"
                    value={current.franchiseStat3Value || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat3Value')}
                    placeholder="2000+"
                  />
                  <VisualTextEditor
                    label="Stat #3 Label"
                    name="franchiseStat3Label"
                    value={current.franchiseStat3Label || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat3Label')}
                    placeholder="Members"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Stat #4</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <VisualTextEditor
                    label="Stat #4 Value"
                    name="franchiseStat4Value"
                    value={current.franchiseStat4Value || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat4Value')}
                    placeholder="High"
                  />
                  <VisualTextEditor
                    label="Stat #4 Label"
                    name="franchiseStat4Label"
                    value={current.franchiseStat4Label || ''}
                    onChange={onChange}
                    onFocus={() => onFocus?.('franchiseStat4Label')}
                    placeholder="ROI Potential"
                  />
                </div>
              </div>
            </div>

            {/* Quick jump to Credibility Pillars */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-blue/10 border border-neon-purple/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award size={14} className="text-neon-purple" />
                  <span>Section 02 · Credibility &amp; Authority Highlights (3 Pillars)</span>
                </span>
                <p className="text-[11px] text-slate-300">
                  Edit the 3 Trust authority cards (10+ Years of Startup Network, First Co-working Space of Eastern UP, Acknowledged by Startup Leaders &amp; Media).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setInlineExpandStory(!inlineExpandStory)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/20 flex items-center gap-1.5"
                  title="Expand Credibility Pillars directly below without leaving this view"
                >
                  <span>{inlineExpandStory ? 'Hide Credibility Pillars' : '⚡ Expand & Edit Right Here'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchSection('credibility')}
                  className="px-3.5 py-1.5 rounded-lg bg-neon-purple hover:bg-neon-purple/80 text-white text-xs font-bold transition-all cursor-pointer border border-neon-purple shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <Award size={13} />
                  <span>Go to Credibility Highlights →</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. CREDIBILITY & AUTHORITY HIGHLIGHTS (3 PILLARS) */}
      {showCredibility && (
        <div id="franchise-pillars-section" className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4 scroll-mt-6">
          {showCredibilityOnly && (
            <div className="p-3.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🏛️</span>
                <span className="font-bold text-white">Credibility &amp; Authority Highlights (3 Trust Pillars)</span>
                <span className="text-slate-300 text-[11px]">— Positioned directly after Overview &amp; before Founder's Message</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchSection('overview')}
                  className="text-xs text-neon-purple hover:text-white font-semibold underline cursor-pointer"
                >
                  ← Back to Overview
                </button>
                <span className="text-slate-500">|</span>
                <button
                  type="button"
                  onClick={() => handleSwitchSection('founderVideo')}
                  className="text-xs text-neon-pink hover:text-white font-semibold underline cursor-pointer"
                >
                  Founder Video →
                </button>
              </div>
            </div>
          )}
          <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={16} className="text-neon-purple" />
                Credibility &amp; Trust Pillars (Social Proof Banner)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The 3 authority highlight cards displayed on /franchise directly below the Hero stats
              </p>
            </div>
            <div className="flex items-center gap-2">
              {setFormData && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      credibilityPillar1Title: '10+ Years of Startup Network',
                      credibilityPillar1Desc: "A decade of building India's strongest startup ecosystem.",
                      credibilityPillar1Icon: 'Network',
                      credibilityPillar2Title: 'First Co-working Space of Eastern UP',
                      credibilityPillar2Desc: 'Pioneering the coworking culture in Eastern Uttar Pradesh.',
                      credibilityPillar2Icon: 'MapPin',
                      credibilityPillar3Title: 'Acknowledged by Startup Leaders & Media',
                      credibilityPillar3Desc: 'Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media.',
                      credibilityPillar3Icon: 'Award',
                    }));
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restore original codebase defaults for the 3 Credibility Pillars (text & icons)"
                >
                  <RotateCcw size={12} className="text-neon-purple" />
                  <span>Set to Default</span>
                </button>
              )}
              <span className="text-xs text-neon-purple font-semibold px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/20">
                3 Pillars
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neon-purple/5 border border-neon-purple/20 text-[11px] text-slate-300 flex items-center justify-between">
            <span>💡 <strong>Codebase Safe</strong>: Original content and icons (<code className="text-neon-blue">Network</code>, <code className="text-neon-purple">MapPin</code>, <code className="text-neon-pink">Award</code>) remain permanently preserved. Clicking <em>Set to Default</em> instantly restores them.</span>
          </div>

          <div className="space-y-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neon-blue flex items-center gap-1.5">
                  <Network size={14} /> Pillar 01 · Scale &amp; Longevity
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Default: 10+ Years</span>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Choose Pillar Icon</span>
                  <span className="text-[10px] text-neon-blue font-mono">Current: {current.credibilityPillar1Icon || 'Network'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                  {AVAILABLE_PILLAR_ICONS.map((ico) => {
                    const isSelected = (current.credibilityPillar1Icon || 'Network') === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormData?.((prev) => ({ ...prev, credibilityPillar1Icon: ico.name }))}
                        title={`${ico.label} (${ico.name})`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                          ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.4)] scale-110'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <VisualTextEditor
                label="Heading / Title"
                name="credibilityPillar1Title"
                value={current.credibilityPillar1Title ?? '10+ Years of Startup Network'}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar1Title')}
                placeholder="10+ Years of Startup Network"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />
              <VisualTextEditor
                label="Description / Subtext"
                name="credibilityPillar1Desc"
                isTextarea={true}
                rows={2}
                value={current.credibilityPillar1Desc ?? "A decade of building India's strongest startup ecosystem."}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar1Desc')}
                placeholder="A decade of building India's strongest startup ecosystem."
                helperText="Highlight any word to style it."
              />
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neon-purple flex items-center gap-1.5">
                  <MapPin size={14} /> Pillar 02 · Pioneer Advantage
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Default: Eastern UP</span>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Choose Pillar Icon</span>
                  <span className="text-[10px] text-neon-purple font-mono">Current: {current.credibilityPillar2Icon || 'MapPin'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                  {AVAILABLE_PILLAR_ICONS.map((ico) => {
                    const isSelected = (current.credibilityPillar2Icon || 'MapPin') === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormData?.((prev) => ({ ...prev, credibilityPillar2Icon: ico.name }))}
                        title={`${ico.label} (${ico.name})`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                          ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_8px_rgba(176,38,255,0.4)] scale-110'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <VisualTextEditor
                label="Heading / Title"
                name="credibilityPillar2Title"
                value={current.credibilityPillar2Title ?? 'First Co-working Space of Eastern UP'}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar2Title')}
                placeholder="First Co-working Space of Eastern UP"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />
              <VisualTextEditor
                label="Description / Subtext"
                name="credibilityPillar2Desc"
                isTextarea={true}
                rows={2}
                value={current.credibilityPillar2Desc ?? 'Pioneering the coworking culture in Eastern Uttar Pradesh.'}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar2Desc')}
                placeholder="Pioneering the coworking culture in Eastern Uttar Pradesh."
                helperText="Highlight any word to style it."
              />
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neon-pink flex items-center gap-1.5">
                  <Award size={14} /> Pillar 03 · Media &amp; Government Recognition
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Default: Leaders &amp; Media</span>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Choose Pillar Icon</span>
                  <span className="text-[10px] text-neon-pink font-mono">Current: {current.credibilityPillar3Icon || 'Award'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                  {AVAILABLE_PILLAR_ICONS.map((ico) => {
                    const isSelected = (current.credibilityPillar3Icon || 'Award') === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormData?.((prev) => ({ ...prev, credibilityPillar3Icon: ico.name }))}
                        title={`${ico.label} (${ico.name})`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                          ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_8px_rgba(255,0,128,0.4)] scale-110'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <VisualTextEditor
                label="Heading / Title"
                name="credibilityPillar3Title"
                value={current.credibilityPillar3Title ?? 'Acknowledged by Startup Leaders & Media'}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar3Title')}
                placeholder="Acknowledged by Startup Leaders & Media"
                helperText="Highlight any word to apply neon colors, gradients, bold, or size."
              />
              <VisualTextEditor
                label="Description / Subtext"
                name="credibilityPillar3Desc"
                isTextarea={true}
                rows={2}
                value={current.credibilityPillar3Desc ?? 'Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media.'}
                onChange={onChange}
                onFocus={() => onFocus?.('credibilityPillar3Desc')}
                placeholder="Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media."
                helperText="Highlight any word to style it."
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. FOUNDER VIDEO & BRAND STORY MANAGER */}
      {showFounderVideo && (
        <div id="founder-video-manager" className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-5">
          {showFounderVideoOnly && (
            <div className="p-3.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🎬</span>
                <span className="font-bold text-white">Direct Founder Video &amp; Frame Layout Editor</span>
                <span className="text-slate-300 text-[11px]">— Customize video source, aspect ratio, frame curvature &amp; bezel thickness</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchSection('credibility')}
                  className="text-xs text-neon-purple hover:text-white font-semibold underline cursor-pointer"
                >
                  ← Credibility Highlights
                </button>
                <span className="text-slate-500">|</span>
                <button
                  type="button"
                  onClick={() => handleSwitchSection('story')}
                  className="text-xs text-neon-blue hover:text-white font-semibold underline cursor-pointer"
                >
                  Ecosystem &amp; Recognition →
                </button>
              </div>
            </div>
          )}
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video size={16} className="text-neon-pink" />
                Founder Video &amp; Brand Story Manager
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between built-in videos, upload a new video file, or embed YouTube Shorts inside the vertical phone frame on /franchise
              </p>
            </div>
            <span className="text-xs text-neon-pink font-semibold px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/20">
              Video Customizer
            </span>
          </div>

          {/* Video Source Picker Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Choose Founder Video Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Original WebM */}
              <button
                type="button"
                onClick={() => handleSelectSource('default')}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${selectedVideoMode === 'default'
                  ? 'bg-neon-purple/15 border-neon-purple shadow-lg shadow-neon-purple/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Film size={18} className={selectedVideoMode === 'default' ? 'text-neon-purple' : 'text-slate-400'} />
                    <span className="text-xs font-bold text-white">Original Founder Message</span>
                  </div>
                  {selectedVideoMode === 'default' && (
                    <CheckCircle2 size={16} className="text-neon-purple shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Default vertical video (0726-copy.webm) with phone mockup &amp; Startup Cafe branding.
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-300">
                  Built-in WebM (Default)
                </span>
              </button>

              {/* Option 2: Commercial Real Estate Pitch (MP4) */}
              <button
                type="button"
                onClick={() => handleSelectSource('workspace')}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${selectedVideoMode === 'workspace'
                  ? 'bg-neon-blue/15 border-neon-blue shadow-lg shadow-neon-blue/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className={selectedVideoMode === 'workspace' ? 'text-neon-blue' : 'text-slate-400'} />
                    <span className="text-xs font-bold text-white">Commercial Pitch by Arun</span>
                  </div>
                  {selectedVideoMode === 'workspace' && (
                    <CheckCircle2 size={16} className="text-neon-blue shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Built-in MP4 workspace walkthrough video (founder_video.mp4) showcasing office &amp; members.
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-300">
                  Built-in MP4 Video
                </span>
              </button>

              {/* Option 3: Upload Custom Video File */}
              <button
                type="button"
                onClick={() => handleSelectSource('upload')}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${selectedVideoMode === 'upload'
                  ? 'bg-neon-pink/15 border-neon-pink shadow-lg shadow-neon-pink/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Upload size={18} className={selectedVideoMode === 'upload' ? 'text-neon-pink' : 'text-slate-400'} />
                    <span className="text-xs font-bold text-white">Upload Your Video File</span>
                  </div>
                  {selectedVideoMode === 'upload' && (
                    <CheckCircle2 size={16} className="text-neon-pink shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Upload an MP4, WebM or MOV directly from your computer (auto saved as local data link).
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-300">
                  File Upload (MP4 / WebM)
                </span>
              </button>

              {/* Option 4: Embed YouTube / Video URL */}
              <button
                type="button"
                onClick={() => handleSelectSource('youtube')}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${selectedVideoMode === 'youtube'
                  ? 'bg-amber-400/15 border-amber-400 shadow-lg shadow-amber-400/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={18} className={selectedVideoMode === 'youtube' ? 'text-amber-400' : 'text-slate-400'} />
                    <span className="text-xs font-bold text-white">YouTube Shorts or Direct URL</span>
                  </div>
                  {selectedVideoMode === 'youtube' && (
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Embed YouTube Shorts, regular YouTube videos, or any CDN .mp4 / .webm link directly.
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-300">
                  YouTube / External Link
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic input panel for Upload or YouTube */}
          {selectedVideoMode === 'upload' && (
            <div className="p-4 rounded-xl bg-neon-pink/5 border border-neon-pink/20 space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-neon-pink uppercase tracking-wider block">
                Upload Custom Video
              </span>
              <p className="text-xs text-slate-300">
                Choose a vertical (9:16) or horizontal (16:9) video file from your computer (max 40MB recommended):
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neon-pink file:text-white hover:file:bg-neon-pink/80 cursor-pointer"
                />
                {uploadedFileName && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    {uploadedFileName}
                  </span>
                )}
              </div>
              {uploadProgress && (
                <p className="text-xs text-neon-blue animate-pulse">{uploadProgress}</p>
              )}
              {fileError && (
                <p className="text-xs text-rose-400 font-semibold">{fileError}</p>
              )}
            </div>
          )}

          {selectedVideoMode === 'youtube' && (
            <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                External Video or YouTube Shorts URL
              </span>
              <p className="text-xs text-slate-300">
                Paste any YouTube Shorts link (e.g. <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">https://youtube.com/shorts/...</code>) or standard YouTube video URL:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/shorts/YOUR_VIDEO_ID"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Apply Link
                </button>
              </div>
            </div>
          )}

          {/* Reset button to clear custom video */}
          {(selectedVideoMode !== 'default' || (current.founderVideoSource && current.founderVideoSource !== 'default') || current.founderVideoUrl) && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset to Original Built-in Video</span>
              </button>
            </div>
          )}

          {/* ADVANCED FRAME & LAYOUT CONTROLS */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-neon-pink" />
                  <span>Phone Mockup Frame &amp; Corner Curvature Controls</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fine-tune the mobile bezel screen curvature and border styling on /franchise
                </p>
              </div>
            </div>

            {/* 1. Corner Curvature Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Phone Frame Corner Curvature (Border Radius)
                </span>
                <span className="text-[10px] font-mono text-neon-blue">
                  {(() => {
                    const val = current.founderVideoRadius;
                    if (!val || val === 'default' || val === '48') return '48px (Default Phone)';
                    if (val === 'none' || val === '0') return '0px (Square)';
                    if (val === 'medium' || val === '20') return '20px (Rounded)';
                    if (val === 'pill' || val === '56') return '56px (Maximum)';
                    return `${val}px`;
                  })()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Square (0px)', sub: 'Sharp corners', icon: '⬛' },
                  { id: 'medium', label: 'Rounded (20px)', sub: 'Soft tablet curve', icon: '🔲' },
                  { id: 'default', label: 'Phone Curvature (48px)', sub: 'Standard modern smartphone', icon: '📱' },
                  { id: 'pill', label: 'Maximum (56px)', sub: 'Pill-shaped curve', icon: '💊' },
                ].map((curv) => {
                  const isSelected =
                    (current.founderVideoRadius || 'default') === curv.id ||
                    (curv.id === 'default' && (!current.founderVideoRadius || current.founderVideoRadius === '48')) ||
                    (curv.id === 'none' && current.founderVideoRadius === '0') ||
                    (curv.id === 'medium' && current.founderVideoRadius === '20') ||
                    (curv.id === 'pill' && current.founderVideoRadius === '56');
                  return (
                    <button
                      key={curv.id}
                      type="button"
                      onClick={() => {
                        setFormData?.((prev) => ({ ...prev, founderVideoRadius: curv.id }));
                        onChange?.({ target: { name: 'founderVideoRadius', value: curv.id } });
                      }}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${isSelected
                        ? 'bg-neon-blue/15 border-neon-blue text-white shadow-sm ring-1 ring-neon-blue/50'
                        : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                        }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="text-xs">{curv.icon}</span>
                        {isSelected && <span className="text-[9px] font-bold text-neon-blue">Active</span>}
                      </div>
                      <div className="text-xs font-semibold truncate">{curv.label}</div>
                      <div className="text-[9px] text-slate-400 truncate">{curv.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Bezel / Border Thickness */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Border Bezel Thickness
                </span>
                <span className="text-[10px] font-mono text-neon-pink">
                  {current.founderVideoBorderWidth === 'default' || !current.founderVideoBorderWidth || current.founderVideoBorderWidth === '4' ? '4px (Default)' : `${current.founderVideoBorderWidth}px`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: '0', label: '0px (Borderless)', sub: 'Edge-to-Edge Screen' },
                  { id: '2', label: '2px (Thin)', sub: 'Sleek Hairline' },
                  { id: 'default', label: '4px (Default)', sub: 'Original Phone Bezel' },
                  { id: '6', label: '6px (Bold)', sub: 'Prominent Chassis' },
                  { id: '8', label: '8px (Thick)', sub: 'Heavy Hardware Bezel' },
                ].map((thick) => {
                  const isSelected =
                    (current.founderVideoBorderWidth || 'default') === thick.id ||
                    (thick.id === 'default' && (!current.founderVideoBorderWidth || current.founderVideoBorderWidth === '4')) ||
                    (thick.id === '4' && current.founderVideoBorderWidth === 'default');
                  return (
                    <button
                      key={thick.id}
                      type="button"
                      onClick={() => {
                        setFormData?.((prev) => ({ ...prev, founderVideoBorderWidth: thick.id }));
                        onChange?.({ target: { name: 'founderVideoBorderWidth', value: thick.id } });
                      }}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${isSelected
                        ? 'bg-neon-pink/15 border-neon-pink text-white shadow-sm ring-1 ring-neon-pink/50'
                        : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                        }`}
                    >
                      <div className="text-xs font-semibold">{thick.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">{thick.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Bezel Border Color (Optional Accent) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Bezel Border Color (Optional Accent)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {current.founderVideoBorderColor || 'Default Slate (#1e293b)'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { color: '', label: 'Default Slate', sample: '#1e293b' },
                  { color: '#000000', label: 'Matte Black', sample: '#000000' },
                  { color: '#ff2975', label: 'Neon Pink', sample: '#ff2975' },
                  { color: '#00f0ff', label: 'Neon Blue', sample: '#00f0ff' },
                  { color: '#b026ff', label: 'Neon Purple', sample: '#b026ff' },
                  { color: 'rgba(255,255,255,0.3)', label: 'Glass White', sample: '#ffffff' },
                ].map((c) => {
                  const isSelected = (current.founderVideoBorderColor || '') === c.color;
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => {
                        setFormData?.((prev) => ({ ...prev, founderVideoBorderColor: c.color }));
                        onChange?.({ target: { name: 'founderVideoBorderColor', value: c.color } });
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${isSelected
                        ? 'bg-white/15 border-white text-white font-semibold ring-1 ring-white/50'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shrink-0"
                        style={{ backgroundColor: c.sample }}
                      ></span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FOUNDER STORY HEADLINES & COPYWRITING */}
          <div className="pt-3 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Founder Story &amp; Headline Content
              </span>
              <span className="text-[10px] text-slate-400">
                Displayed right next to the phone video
              </span>
            </div>

            {/* Badge Tag */}
            <VisualTextEditor
              label="Badge Tag (Pill above heading)"
              name="founderBadge"
              value={current.founderBadge || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('founderBadge')}
              placeholder="e.g. Founder's Message"
            />

            {/* Headline 3-part grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <VisualTextEditor
                label="Heading Prefix"
                name="founderHeading"
                value={current.founderHeading || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('founderHeading')}
                placeholder="e.g. Why"
              />
              <VisualTextEditor
                label="Gradient Accent Word"
                name="founderAccent"
                value={current.founderAccent || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('founderAccent')}
                placeholder="e.g. Startup Cafe"
              />
              <VisualTextEditor
                label="Heading Suffix"
                name="founderSuffix"
                value={current.founderSuffix !== undefined ? current.founderSuffix : ''}
                onChange={onChange}
                onFocus={() => onFocus?.('founderSuffix')}
                placeholder="e.g. Matters"
              />
            </div>

            {/* Vision Paragraph 1 */}
            <VisualTextEditor
              label="Founder Story Paragraph 1 (Lead Vision)"
              name="founderDescription"
              value={current.founderDescription || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('founderDescription')}
              placeholder="Startup Cafe was born from a simple belief..."
              isTextarea={true}
              rows={2}
            />

            {/* Vision Paragraph 2 */}
            <VisualTextEditor
              label="Founder Story Paragraph 2 (Subtext & Purpose)"
              name="founderSubtext"
              value={current.founderSubtext || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('founderSubtext')}
              placeholder="In this short message, our founder shares the vision..."
              isTextarea={true}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* 4. ECOSYSTEM & RECOGNITION (PARTNER LOGOS CAROUSEL) */}
      {showEcosystem && (
        <>
          {showEcosystemOnly && (
            <div className="p-3.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <span className="font-bold text-white">Ecosystem &amp; Recognition Manager</span>
                <span className="text-slate-300 text-[11px]">— Trusted startup ecosystem &amp; circular partner logos marquee</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchSection('founderVideo')}
                  className="text-xs text-neon-pink hover:text-white font-semibold underline cursor-pointer"
                >
                  ← Founder Video
                </button>
                <span className="text-slate-500">|</span>
                <button
                  type="button"
                  onClick={() => handleSwitchSection('vision')}
                  className="text-xs text-purple-400 hover:text-white font-semibold underline cursor-pointer"
                >
                  Vision &amp; Concept →
                </button>
              </div>
            </div>
          )}

          {/* 2.6 ECOSYSTEM & RECOGNITION (PARTNER LOGOS CAROUSEL) */}
          <div id="franchise-ecosystem-section" className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-5 scroll-mt-6">
            <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-neon-blue" />
                  Ecosystem &amp; Recognition (Partner Logos Carousel)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the "Recognized &amp; Trusted Ecosystem" section, government bodies, media brands, and circular logo marquee
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDefaultPartners}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restore original 12 default partners and section copy"
                >
                  <RotateCcw size={12} className="text-neon-blue" />
                  <span>Reset to Default</span>
                </button>
                <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
                  {ecosystemPartners.length} Partners
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neon-blue/5 border border-neon-blue/20 text-[11px] text-slate-300 flex items-center justify-between">
              <span>💡 <strong>Live Frontend Safe</strong>: The public website displays the clean, continuous marquee. All editing, adding, and removing happen exclusively in this admin view without disturbing the live site.</span>
            </div>

            {/* Section Header Copywriting */}
            <div className="space-y-4">
              <VisualTextEditor
                label="Section Badge Tag (Pill above heading)"
                name="ecosystemBadge"
                value={current.ecosystemBadge !== undefined ? current.ecosystemBadge : 'Ecosystem & Recognition'}
                onChange={onChange}
                onFocus={() => onFocus?.('ecosystemBadge')}
                placeholder="e.g. Ecosystem & Recognition"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VisualTextEditor
                  label="Main Heading (Prefix)"
                  name="ecosystemHeading"
                  value={current.ecosystemHeading !== undefined ? current.ecosystemHeading : 'Recognized &'}
                  onChange={onChange}
                  onFocus={() => onFocus?.('ecosystemHeading')}
                  placeholder="e.g. Recognized &"
                />
                <VisualTextEditor
                  label="Gradient Accent Highlight"
                  name="ecosystemAccent"
                  value={current.ecosystemAccent !== undefined ? current.ecosystemAccent : 'Trusted Ecosystem'}
                  onChange={onChange}
                  onFocus={() => onFocus?.('ecosystemAccent')}
                  placeholder="e.g. Trusted Ecosystem"
                />
              </div>

              <VisualTextEditor
                label="Section Description Paragraph"
                name="ecosystemDescription"
                value={current.ecosystemDescription !== undefined ? current.ecosystemDescription : 'Startup Cafe is proud to be acknowledged by key Government bodies and associated with top media and industry networks.'}
                onChange={onChange}
                onFocus={() => onFocus?.('ecosystemDescription')}
                placeholder="Describe the recognition and ecosystem partners..."
                isTextarea={true}
                rows={2}
              />
            </div>

            {/* PARTNER LOGOS MANAGER & LIST */}
            <div className="pt-2 border-t border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>🏛️</span> Ecosystem Partners ({ecosystemPartners.length})
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add, edit, remove, or reorder partner cards appearing in the live marquee
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={partnerSearchQuery}
                      onChange={(e) => setPartnerSearchQuery(e.target.value)}
                      placeholder="Filter by name..."
                      className="pl-7 pr-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:border-neon-blue focus:outline-none w-36 sm:w-44"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleStartAddPartner}
                    className="px-3 py-1.5 rounded-lg bg-neon-blue hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-neon-blue/20"
                  >
                    <Plus size={14} />
                    <span>Add Partner</span>
                  </button>
                </div>
              </div>

              {/* ADD / EDIT PARTNER FORM MODAL/PANEL */}
              {editingPartnerId !== null && (
                <div className="p-4 rounded-xl bg-black/60 border border-neon-blue/40 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-neon-blue flex items-center gap-1.5 uppercase tracking-wider">
                      {editingPartnerId === 'new' ? <Plus size={14} /> : <Pencil size={14} />}
                      <span>{editingPartnerId === 'new' ? 'Add New Partner Card' : 'Edit Partner Card'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelPartner}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Close form"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side: Form Controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Partner / Organization Name *
                        </label>
                        <input
                          type="text"
                          value={partnerForm.name}
                          onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Ministry of Commerce & Industry"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Top Badge Tag
                          </label>
                          <input
                            type="text"
                            value={partnerForm.badge}
                            onChange={(e) => setPartnerForm((prev) => ({ ...prev, badge: e.target.value }))}
                            placeholder="Acknowledged by"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {['Acknowledged by', 'Associated with', 'Supported by', 'Featured in'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setPartnerForm((prev) => ({ ...prev, badge: tag }))}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Partner Style / Tier
                          </label>
                          <button
                            type="button"
                            onClick={() => setPartnerForm((prev) => ({ ...prev, isGov: !prev.isGov }))}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-colors cursor-pointer ${partnerForm.isGov
                              ? 'bg-neon-blue/15 border-neon-blue text-neon-blue'
                              : 'bg-white/5 border-white/15 text-slate-300'
                              }`}
                          >
                            <span>{partnerForm.isGov ? '🏛️ Official / Key Authority' : '🤝 Standard Association'}</span>
                            <span className="text-[10px] font-mono">{partnerForm.isGov ? 'Blue Glow' : 'Clean'}</span>
                          </button>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Official status displays with neon-blue border and highlight badge.
                          </p>
                        </div>
                      </div>

                      {/* Logo Source Selector */}
                      <div className="space-y-2 pt-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Choose Logo Source
                        </label>
                        <div className="flex rounded-lg bg-black/60 p-1 border border-white/10 text-xs">
                          <button
                            type="button"
                            onClick={() => setPartnerLogoSource('preset')}
                            className={`flex-1 py-1 rounded text-center font-semibold transition-colors cursor-pointer ${partnerLogoSource === 'preset' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            Preset Logos (12)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartnerLogoSource('upload')}
                            className={`flex-1 py-1 rounded text-center font-semibold transition-colors cursor-pointer ${partnerLogoSource === 'upload' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            Upload Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartnerLogoSource('url')}
                            className={`flex-1 py-1 rounded text-center font-semibold transition-colors cursor-pointer ${partnerLogoSource === 'url' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            Image URL
                          </button>
                        </div>

                        {/* Preset Picker */}
                        {partnerLogoSource === 'preset' && (
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Select from built-in high-res circular partner logos:
                            </span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 scrollbar-thin">
                              {LOGO_PRESETS.map((preset) => {
                                const isSelected = partnerForm.logoKey === preset.id && !partnerForm.imageUrl;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() =>
                                      setPartnerForm((prev) => ({
                                        ...prev,
                                        logoKey: preset.id,
                                        imageUrl: '',
                                        name: prev.name.trim() ? prev.name : preset.name,
                                      }))
                                    }
                                    title={preset.name}
                                    className={`p-1 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer group ${isSelected
                                      ? 'bg-neon-blue/20 border-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.3)] scale-105'
                                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                      }`}
                                  >
                                    <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                                      <img
                                        src={preset.src}
                                        alt={preset.name}
                                        className="w-full h-full rounded-full object-cover pointer-events-none"
                                      />
                                    </div>
                                    <span className="text-[8px] text-slate-400 truncate max-w-[50px] group-hover:text-white">
                                      {preset.name.split(' ')[0]}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Upload File */}
                        {partnerLogoSource === 'upload' && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                            <input
                              ref={partnerFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePartnerImageUpload}
                              className="hidden"
                            />
                            <div
                              onClick={() => partnerFileInputRef.current?.click()}
                              className="border-2 border-dashed border-white/20 hover:border-neon-blue/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.03]"
                            >
                              <Upload size={20} className="mx-auto text-neon-blue mb-1" />
                              <p className="text-xs font-semibold text-white">Click to select partner logo file</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG or WEBP (Max 2MB)</p>
                            </div>
                            {partnerForm.imageUrl && partnerForm.imageUrl.startsWith('data:') && (
                              <div className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                <span>✓ Image uploaded ready</span>
                                <button
                                  type="button"
                                  onClick={() => setPartnerForm((prev) => ({ ...prev, imageUrl: '' }))}
                                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                                >
                                  Clear
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* URL Input */}
                        {partnerLogoSource === 'url' && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                            <input
                              type="text"
                              value={partnerForm.imageUrl}
                              onChange={(e) => setPartnerForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                              placeholder="https://example.com/logo.png"
                              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:border-neon-blue focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-400">
                              Direct web link to image file (transparent PNG or JPG).
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Live Card Preview Exactly like Carousel */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-dark-bg/80 border border-white/10 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Card Carousel Preview
                      </span>

                      {/* Render exact card container */}
                      <div
                        className={`w-56 h-48 flex flex-col justify-between items-center p-3 rounded-2xl bg-[#09090b]/90 border backdrop-blur-md shadow-lg select-none ${partnerForm.isGov
                          ? 'border-neon-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'border-white/10'
                          }`}
                      >
                        {/* Top Badge */}
                        <div className="w-full flex justify-center h-5 items-center">
                          {partnerForm.isGov ? (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-neon-blue bg-neon-blue/10 border border-neon-blue/30 px-2 py-0.5 rounded-md">
                              {renderFormattedText(partnerForm.badge || 'Acknowledged by')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-300">
                              {renderFormattedText(partnerForm.badge || 'Associated with')}
                            </span>
                          )}
                        </div>

                        {/* Circular Logo */}
                        <div className="w-20 h-20 rounded-full bg-white/95 p-1 flex items-center justify-center overflow-hidden shadow-md">
                          <img
                            src={getPartnerLogoSrc(partnerForm)}
                            alt={partnerForm.name || 'Preview'}
                            className="w-full h-full rounded-full object-cover pointer-events-none"
                          />
                        </div>

                        {/* Partner Name */}
                        <div className="w-full text-center">
                          <p className="text-xs font-semibold text-slate-200 truncate px-2">
                            {renderFormattedText(partnerForm.name || 'Partner Name')}
                          </p>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 text-center max-w-xs">
                        This card will seamlessly loop inside the auto-scrolling marquee on /franchise.
                      </p>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCancelPartner}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePartner}
                      className="px-4 py-1.5 rounded-lg bg-neon-blue hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-neon-blue/20"
                    >
                      <Check size={14} />
                      <span>{editingPartnerId === 'new' ? 'Add to Carousel' : 'Update Partner'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LIST OF PARTNER ITEMS */}
              <div className="space-y-2">
                {ecosystemPartners
                  .filter((item) =>
                    partnerSearchQuery.trim()
                      ? (item.name || '').toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                      (item.badge || '').toLowerCase().includes(partnerSearchQuery.toLowerCase())
                      : true
                  )
                  .map((partner, index) => {
                    const realIndex = ecosystemPartners.findIndex((p) => (p.id || p.name) === (partner.id || partner.name));
                    const imgSrc = getPartnerLogoSrc(partner);
                    const isEditing = editingPartnerId === (partner.id || partner.name);

                    return (
                      <div
                        key={partner.id || `${partner.name}-${index}`}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isEditing
                          ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                          }`}
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[11px] font-mono text-slate-500 w-5 text-center shrink-0">
                            {realIndex + 1}
                          </span>

                          {/* Circular Thumbnail */}
                          <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 overflow-hidden shadow-sm border border-white/20">
                            <img
                              src={imgSrc}
                              alt={partner.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                                {partner.name}
                              </span>
                              {partner.isGov ? (
                                <span className="text-[9px] uppercase font-bold text-neon-blue bg-neon-blue/15 border border-neon-blue/30 px-1.5 py-0.2 rounded shrink-0">
                                  Official
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.2 rounded shrink-0">
                                  Standard
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate">
                              Badge: <span className="text-slate-300">{partner.badge || 'Acknowledged by'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {/* Reorder Buttons */}
                          <button
                            type="button"
                            onClick={() => handleMovePartner(realIndex, -1)}
                            disabled={realIndex === 0}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            title="Move Up in marquee"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePartner(realIndex, 1)}
                            disabled={realIndex === ecosystemPartners.length - 1}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            title="Move Down in marquee"
                          >
                            <ArrowDown size={13} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEditPartner(partner)}
                            className="p-1.5 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 cursor-pointer transition-colors"
                            title="Edit partner"
                          >
                            <Pencil size={13} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeletePartner(partner.id || partner.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                            title="Remove from carousel"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 5. VISION & CONCEPT STORY MANAGER */}
      {showVision && (
        <div id="franchise-vision-section" className="p-5 rounded-2xl bg-[#090a0f]/90 border border-neon-pink/40 shadow-xl space-y-4 scroll-mt-6 ring-1 ring-neon-pink/20">
          {showVisionOnly && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <span className="font-bold text-white">Vision &amp; Concept Narrative</span>
                <span className="text-slate-300 text-[11px]">— "Why India is Betting Big on Coworking", metrics &amp; photo</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchSection('story')}
                  className="text-xs text-neon-blue hover:text-white font-semibold underline cursor-pointer"
                >
                  ← Ecosystem &amp; Recognition
                </button>
                <span className="text-slate-500">|</span>
                <button
                  type="button"
                  onClick={() => handleSwitchSection('benefits')}
                  className="text-xs text-neon-blue hover:text-white font-semibold underline cursor-pointer"
                >
                  Why Partner with Us →
                </button>
              </div>
            </div>
          )}
          <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neon-pink/20 text-neon-pink border border-neon-pink/30">
                  🎯 Core Vision Narrative
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Target size={18} className="text-neon-pink" />
                Vision: "Why India is Betting Big on Coworking"
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Customize the "Why India is Betting Big on Coworking" headline, vision paragraphs, photo, and 2 key feature cards
              </p>
            </div>
            <div className="flex items-center gap-2">
              {setFormData && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      franchiseVisionBadge: 'Vision & Concept',
                      franchiseVisionBadgeIcon: 'Target',
                      franchiseVisionHeading: 'Why India is Betting Big on',
                      franchiseVisionAccent: 'Coworking',
                      franchiseVisionDesc1: 'With the rise of the digital economy and hybrid work culture, demand for high-quality, professional workspaces is exploding across India, particularly in Tier 2 and Tier 3 cities.',
                      franchiseVisionDesc2: 'Startup Cafe is more than just a place to plug in. It’s an ecosystem where founders find mentors, freelancers find clients, and companies find culture.',
                      franchiseVisionFeature1Title: 'Growth Engine',
                      franchiseVisionFeature1Desc: "India's coworking market is projected to reach $1.5B by 2027.",
                      franchiseVisionFeature1Icon: 'TrendingUp',
                      franchiseVisionFeature2Title: 'Community Focus',
                      franchiseVisionFeature2Desc: 'High retention through events and meaningful networking.',
                      franchiseVisionFeature2Icon: 'Users',
                      franchiseVisionImage: '',
                    }));
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restore original codebase defaults for Vision & Concept"
                >
                  <RotateCcw size={12} className="text-neon-pink" />
                  <span>Set to Default</span>
                </button>
              )}
              <span className="text-xs text-neon-pink font-semibold px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/20">
                Vision Section
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neon-pink/5 border border-neon-pink/20 text-[11px] text-slate-300 flex items-center justify-between">
            <span>💡 <strong>Codebase Safe</strong>: All original text, statistics ($1.5B by 2027), icons, and default photo remain permanently safe. Clicking <em>Set to Default</em> instantly restores them.</span>
          </div>

          {/* Badge Icon Picker */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Target size={14} className="text-neon-pink" />
                  <span>Choose Badge Icon</span>
                </span>
                <span className="text-[10px] text-neon-pink font-mono">Current: {current.franchiseVisionBadgeIcon || 'Target'}</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                {AVAILABLE_VISION_ICONS.map((ico) => {
                  const isSelected = (current.franchiseVisionBadgeIcon || 'Target') === ico.name;
                  const IconComp = ico.icon;
                  return (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setFormData?.((prev) => ({ ...prev, franchiseVisionBadgeIcon: ico.name }))}
                      title={`${ico.label} (${ico.name})`}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                        ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_8px_rgba(255,0,128,0.4)] scale-110'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <IconComp size={14} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badge & Headings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <VisualTextEditor
              label="Badge Text"
              name="franchiseVisionBadge"
              value={current.franchiseVisionBadge ?? 'Vision & Concept'}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseVisionBadge')}
              placeholder="Vision & Concept"
            />
            <VisualTextEditor
              label="Heading Prefix"
              name="franchiseVisionHeading"
              value={current.franchiseVisionHeading ?? 'Why India is Betting Big on'}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseVisionHeading')}
              placeholder="Why India is Betting Big on"
            />
            <VisualTextEditor
              label="Gradient Accent Word"
              name="franchiseVisionAccent"
              value={current.franchiseVisionAccent ?? 'Coworking'}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseVisionAccent')}
              placeholder="Coworking"
            />
          </div>

          {/* Story Paragraphs */}
          <div className="space-y-3">
            <VisualTextEditor
              label="Story Paragraph 1 (Market Demand)"
              name="franchiseVisionDesc1"
              isTextarea={true}
              rows={2}
              value={current.franchiseVisionDesc1 ?? 'With the rise of the digital economy and hybrid work culture, demand for high-quality, professional workspaces is exploding across India, particularly in Tier 2 and Tier 3 cities.'}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseVisionDesc1')}
              placeholder="With the rise of the digital economy..."
            />
            <VisualTextEditor
              label="Story Paragraph 2 (Ecosystem & Community)"
              name="franchiseVisionDesc2"
              isTextarea={true}
              rows={2}
              value={current.franchiseVisionDesc2 ?? 'Startup Cafe is more than just a place to plug in. It’s an ecosystem where founders find mentors, freelancers find clients, and companies find culture.'}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseVisionDesc2')}
              placeholder="Startup Cafe is more than just a place to plug in..."
            />
          </div>

          {/* 2 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Feature 1 */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neon-blue flex items-center gap-1.5">
                  <TrendingUp size={14} /> Feature 01 · Growth Metric
                </span>
                <span className="text-[10px] text-neon-blue font-mono">Current: {current.franchiseVisionFeature1Icon || 'TrendingUp'}</span>
              </div>

              {/* Feature 1 Icon Picker */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Choose Feature 1 Icon</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                  {AVAILABLE_VISION_ICONS.map((ico) => {
                    const isSelected = (current.franchiseVisionFeature1Icon || 'TrendingUp') === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormData?.((prev) => ({ ...prev, franchiseVisionFeature1Icon: ico.name }))}
                        title={`${ico.label} (${ico.name})`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                          ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.4)] scale-110'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <VisualTextEditor
                label="Feature 1 Title"
                name="franchiseVisionFeature1Title"
                value={current.franchiseVisionFeature1Title ?? 'Growth Engine'}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseVisionFeature1Title')}
                placeholder="Growth Engine"
              />
              <VisualTextEditor
                label="Feature 1 Description"
                name="franchiseVisionFeature1Desc"
                isTextarea={true}
                rows={2}
                value={current.franchiseVisionFeature1Desc ?? "India's coworking market is projected to reach $1.5B by 2027."}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseVisionFeature1Desc')}
                placeholder="India's coworking market is projected to reach $1.5B by 2027."
              />
            </div>

            {/* Feature 2 */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neon-purple flex items-center gap-1.5">
                  <Users size={14} /> Feature 02 · Community Metric
                </span>
                <span className="text-[10px] text-neon-purple font-mono">Current: {current.franchiseVisionFeature2Icon || 'Users'}</span>
              </div>

              {/* Feature 2 Icon Picker */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Choose Feature 2 Icon</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10">
                  {AVAILABLE_VISION_ICONS.map((ico) => {
                    const isSelected = (current.franchiseVisionFeature2Icon || 'Users') === ico.name;
                    const IconComp = ico.icon;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormData?.((prev) => ({ ...prev, franchiseVisionFeature2Icon: ico.name }))}
                        title={`${ico.label} (${ico.name})`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isSelected
                          ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_8px_rgba(176,38,255,0.4)] scale-110'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <VisualTextEditor
                label="Feature 2 Title"
                name="franchiseVisionFeature2Title"
                value={current.franchiseVisionFeature2Title ?? 'Community Focus'}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseVisionFeature2Title')}
                placeholder="Community Focus"
              />
              <VisualTextEditor
                label="Feature 2 Description"
                name="franchiseVisionFeature2Desc"
                isTextarea={true}
                rows={2}
                value={current.franchiseVisionFeature2Desc ?? 'High retention through events and meaningful networking.'}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseVisionFeature2Desc')}
                placeholder="High retention through events and meaningful networking."
              />
            </div>
          </div>

          {/* Feature Image URL / Upload / Reset Card */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-neon-pink" />
                  <span>Featured Side Photo ("Why India is Betting Big on Coworking")</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  The high-resolution office picture displayed next to the vision narrative and features.
                </p>
              </div>
              <div>
                {current.franchiseVisionImage ? (
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Custom Photo Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Default Photo (franchise_about.png)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Visual Thumbnail Preview */}
              <div className="md:col-span-5 space-y-2">
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg group">
                  <img
                    src={current.franchiseVisionImage || defaultVisionImg}
                    alt="Vision Coworking Space"
                    className="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <div className="flex items-center justify-between w-full text-[10px]">
                      <span className="font-mono text-slate-300 truncate pr-2">
                        {current.franchiseVisionImage ? 'Custom Upload / URL' : 'franchise_about.png'}
                      </span>
                      <span className="font-bold text-neon-pink shrink-0">
                        Vision Photo
                      </span>
                    </div>
                  </div>
                </div>

                {current.franchiseVisionImage && (
                  <button
                    type="button"
                    onClick={handleResetVisionImage}
                    className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-neon-pink/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Reset back to the original franchise_about.png image"
                  >
                    <RotateCcw size={12} className="text-neon-pink" />
                    <span>Reset to Original Default Photo</span>
                  </button>
                )}
              </div>

              {/* Upload or URL Controls */}
              <div className="md:col-span-7 space-y-2.5">
                {/* Input Mode Selector */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisionImageInputMode('upload')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${visionImageInputMode === 'upload'
                      ? 'bg-neon-pink/20 text-white border-neon-pink/50 shadow-sm'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Upload size={13} />
                    <span>Upload from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisionImageInputMode('url')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${visionImageInputMode === 'url'
                      ? 'bg-neon-blue/20 text-white border-neon-blue/50 shadow-sm'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <LinkIcon size={13} />
                    <span>Paste Web Link / URL</span>
                  </button>
                </div>

                {/* Mode: Device File Upload */}
                {visionImageInputMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={visionFileInputRef}
                      onChange={handleVisionFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => visionFileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-neon-pink/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]"
                    >
                      <Upload size={22} className="mx-auto text-neon-pink mb-1.5" />
                      <p className="text-xs font-semibold text-white">
                        Click to choose an image from your laptop / phone
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, WebP (Automatically optimized for fast loading)
                      </p>
                    </div>
                    {isVisionUploading && (
                      <p className="text-xs text-neon-pink animate-pulse mt-1 font-medium">Processing &amp; optimizing image...</p>
                    )}
                    {visionUploadError && (
                      <p className="text-xs text-rose-400 mt-1 font-medium">{visionUploadError}</p>
                    )}
                  </div>
                )}

                {/* Mode: Image URL */}
                {visionImageInputMode === 'url' && (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="franchiseVisionImage"
                        value={current.franchiseVisionImage || ''}
                        onChange={onChange}
                        onFocus={() => onFocus?.('franchiseVisionImage')}
                        placeholder="e.g. https://images.unsplash.com/... or paste Base64 image"
                        className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-neon-pink focus:outline-none font-mono"
                      />
                      {current.franchiseVisionImage && (
                        <button
                          type="button"
                          onClick={handleResetVisionImage}
                          className="px-3 py-2 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors shrink-0"
                          title="Clear custom image URL"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Paste any direct image link or Base64 data URL.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* 6. INCOME POTENTIAL & REVENUE MODEL (BUILT FOR PROFITABILITY) */}
      {showRevenue && (
        <div id="franchise-revenue-section" className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-5 scroll-mt-6">
          {showRevenueOnly && (
            <div className="p-3.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">💰</span>
                <span className="font-bold text-white">Revenue &amp; Profitability Model</span>
                <span className="text-slate-300 text-[11px]">— Customize investment estimation and dynamic revenue stream cards</span>
              </div>
              <button
                type="button"
                onClick={() => handleSwitchSection('story')}
                className="text-xs text-neon-blue hover:text-white font-semibold underline cursor-pointer"
              >
                ← Back to Ecosystem
              </button>
            </div>
          )}
          <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark size={16} className="text-neon-blue" />
                Income Potential &amp; Revenue Model (Built for Profitability)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The financial and profit model section displaying multiple income streams and estimated investment
              </p>
            </div>
            <span className="text-xs text-neon-blue font-semibold px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
              Revenue Model
            </span>
          </div>

          {/* Section Header Copy */}
          <div className="space-y-4">
            <VisualTextEditor
              label="Section Badge Tag"
              name="revenueBadge"
              value={current.revenueBadge !== undefined ? current.revenueBadge : 'Income Potential'}
              onChange={onChange}
              onFocus={() => onFocus?.('revenueBadge')}
              placeholder="e.g. Income Potential"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VisualTextEditor
                label="Main Heading (Prefix)"
                name="revenueHeading"
                value={current.revenueHeading !== undefined ? current.revenueHeading : 'Built for'}
                onChange={onChange}
                onFocus={() => onFocus?.('revenueHeading')}
                placeholder="e.g. Built for"
              />
              <VisualTextEditor
                label="Gradient Accent Word"
                name="revenueAccent"
                value={current.revenueAccent !== undefined ? current.revenueAccent : 'Profitability'}
                onChange={onChange}
                onFocus={() => onFocus?.('revenueAccent')}
                placeholder="e.g. Profitability"
              />
            </div>

            <VisualTextEditor
              label="Revenue Model Description Paragraph"
              name="revenueDescription"
              value={current.revenueDescription !== undefined ? current.revenueDescription : 'Our business model goes beyond just "renting space". We\'ve optimized multiple revenue streams to ensure high occupancy and diverse income sources.'}
              onChange={onChange}
              onFocus={() => onFocus?.('revenueDescription')}
              placeholder="Describe the diverse income streams..."
              isTextarea={true}
              rows={3}
            />
          </div>

          {/* Estimated Investment Card & Disclaimer */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins size={14} />
                Estimated Investment Box &amp; Carpet Space
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <VisualTextEditor
                label="Investment Box Heading"
                name="revenueInvestmentLabel"
                value={current.revenueInvestmentLabel !== undefined ? current.revenueInvestmentLabel : 'Estimated Investment'}
                onChange={onChange}
                onFocus={() => onFocus?.('revenueInvestmentLabel')}
                placeholder="e.g. Estimated Investment"
              />

              <VisualTextEditor
                label="Investment Value Range"
                name="franchiseInvestment"
                value={current.franchiseInvestment || ''}
                onChange={onChange}
                onFocus={() => onFocus?.('franchiseInvestment')}
                placeholder="e.g. ₹25L - ₹45L"
              />

              <VisualTextEditor
                label="Subtext Note"
                name="revenueInvestmentSubtext"
                value={current.revenueInvestmentSubtext !== undefined ? current.revenueInvestmentSubtext : '(Approximate)'}
                onChange={onChange}
                onFocus={() => onFocus?.('revenueInvestmentSubtext')}
                placeholder="e.g. (Approximate)"
              />
            </div>

            <VisualTextEditor
              label="Investment Disclaimer Note"
              name="revenueInvestmentDisclaimer"
              value={current.revenueInvestmentDisclaimer !== undefined ? current.revenueInvestmentDisclaimer : '*Values vary based on location, area, and city tier.'}
              onChange={onChange}
              onFocus={() => onFocus?.('revenueInvestmentDisclaimer')}
              placeholder="e.g. *Values vary based on location, area, and city tier."
            />

            <VisualTextEditor
              label="Area Required Carpet Description"
              name="franchiseAreaRequired"
              value={current.franchiseAreaRequired || ''}
              onChange={onChange}
              onFocus={() => onFocus?.('franchiseAreaRequired')}
              placeholder="e.g. Ideally 1000 – 3000 sq ft of premium carpet area in a commercial building."
              isTextarea={true}
              rows={2}
            />
          </div>

          {/* Dynamic Revenue Streams Manager */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Revenue Stream Cards</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-semibold">
                    {revenueStreams.length} Streams
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize desk plans, cabin monetization, cafe footfall, and event pricing cards
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDefaultStreams}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset revenue streams to original 4 defaults"
                >
                  <RotateCcw size={12} className="text-neon-blue" />
                  <span>Reset Streams</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartAddStream}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-pink hover:to-neon-blue text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Stream Card</span>
                </button>
              </div>
            </div>

            {/* Inline Edit / Add Stream Form */}
            {editingStreamId && (
              <div className="p-4 rounded-xl bg-black/70 border border-neon-blue/40 shadow-lg space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-neon-blue uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} />
                    {editingStreamId === 'new' ? 'Add New Revenue Stream' : 'Edit Revenue Stream'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingStreamId(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-md"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <VisualTextEditor
                    label="Stream Title"
                    name="streamTitle"
                    value={streamForm.title}
                    onChange={(e) => setStreamForm({ ...streamForm, title: e.target.value })}
                    placeholder="e.g. Dedicated Desk, Private Cabin, Cafe Services"
                    helperText="Highlight any word to apply neon colors, gradients, bold, or size."
                  />

                  <VisualTextEditor
                    label="Price / Monetization Subtext"
                    name="streamPrice"
                    value={streamForm.price}
                    onChange={(e) => setStreamForm({ ...streamForm, price: e.target.value })}
                    placeholder="e.g. Starting ₹6,999/mo, Daily Footfall Monetization"
                    helperText="Highlight any word to style it."
                  />
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Stream Icon
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-black/50 rounded-xl border border-white/10">
                    {AVAILABLE_STREAM_ICONS.map((item) => {
                      const IconC = item.icon;
                      const isSelected = streamForm.iconName === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setStreamForm({ ...streamForm, iconName: item.name })}
                          className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${isSelected
                            ? 'bg-neon-blue/20 border-2 border-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.4)] text-white scale-105'
                            : 'bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <IconC size={16} className={isSelected ? 'text-neon-blue' : ''} />
                          <span className="text-[9px] truncate w-full text-center leading-tight">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingStreamId(null)}
                    className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStream}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  >
                    <Check size={14} />
                    Save Stream
                  </button>
                </div>
              </div>
            )}

            {/* List of Stream Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {revenueStreams.map((item, index) => {
                const foundIcon = AVAILABLE_STREAM_ICONS.find((i) => i.name === item.iconName) || AVAILABLE_STREAM_ICONS[0];
                const IconC = foundIcon.icon;
                const isEditing = editingStreamId === (item.id || item.title);
                return (
                  <div
                    key={item.id || index}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${isEditing
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-neon-blue/10 flex items-center justify-center shrink-0">
                        <IconC size={18} className="text-neon-blue" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{renderFormattedText(item.title)}</h5>
                        <p className="text-[11px] text-neon-blue font-medium truncate">{renderFormattedText(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveStream(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStream(index, 1)}
                        disabled={index === revenueStreams.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEditStream(item)}
                        className="p-1 rounded text-neon-blue hover:bg-neon-blue/10 cursor-pointer"
                        title="Edit Stream"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStream(item.id || item.title)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Stream"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. QUICK SHORTCUT TO FRANCHISE PAGE */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Building2 size={16} className="text-neon-purple" />
          <span className="text-xs text-slate-300 font-medium">
            Preview the live Franchise page in a new window
          </span>
        </div>
        <a
          href="/franchise"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>Open /franchise</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
