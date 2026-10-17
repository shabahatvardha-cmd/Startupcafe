import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_ECOSYSTEM_PARTNERS } from '../components/franchise/ecosystemConstants';
import { API_BASE_URL } from '../config';

export { DEFAULT_ECOSYSTEM_PARTNERS };

const STORAGE_KEY = 'startupcafe_admin_settings';

export const DEFAULT_SERVICES = [
  {
    id: 'dedicated-desk',
    title: 'Dedicated Desk',
    description: 'Your personal workspace in a shared environment, guaranteed yours every day.',
    iconName: 'Monitor',
    gradient: 'from-neon-blue/20 to-transparent'
  },
  {
    id: 'private-cabin',
    title: 'Private Cabin',
    description: 'Enclosed, customized spaces for teams focusing on high-growth and privacy.',
    iconName: 'Briefcase',
    gradient: 'from-neon-purple/20 to-transparent'
  },
  {
    id: 'conference-rooms',
    title: 'Conference Rooms',
    description: 'High-tech conference rooms equipped with smart screens and VC facilities.',
    iconName: 'Users',
    gradient: 'from-neon-pink/20 to-transparent'
  },
  {
    id: 'virtual-office',
    title: 'Virtual Office',
    description: 'Professional business address and mail handling without the physical space.',
    iconName: 'Globe',
    gradient: 'from-neon-blue/20 to-neon-purple/20'
  },
  {
    id: 'startup-networking',
    title: 'Startup Networking',
    description: 'Join a thriving ecosystem of founders, mentors, and investors.',
    iconName: 'Zap',
    gradient: 'from-[#facc15]/20 to-transparent'
  },
  {
    id: 'lounge-cafe',
    title: 'Lounge & Cafe',
    description: 'Relax, recharge, and collaborate over premium brewed coffee.',
    iconName: 'Coffee',
    gradient: 'from-neon-pink/20 to-neon-purple/20'
  }
];

export const DEFAULT_PRICING_PLANS = [
  {
    id: 'conference-room',
    name: 'Conference Room',
    monthlyPrice: null,
    dailyPrice: 999,
    priceUnit: 'per hour',
    description: 'Professional space for meetings and presentations.',
    features: ['Smart TV / Projector', 'High-Speed WiFi', 'Whiteboard', 'Free Coffee & Tea'],
    popular: false,
  },
  {
    id: 'day-pass',
    name: 'Day Pass',
    monthlyPrice: null,
    dailyPrice: 499,
    priceUnit: '/day',
    description: 'Perfect for drop-ins and occasional visits.',
    features: ['High-Speed WiFi', 'Open Desk Seating', 'Free Coffee & Tea', 'Community Access'],
    popular: true,
  },
  {
    id: 'private-cabin-daily',
    name: 'Private Cabin',
    monthlyPrice: null,
    dailyPrice: 999,
    priceUnit: 'per hour',
    description: 'Daily access to a private, quiet workspace.',
    features: ['Secured Space', 'High-Speed WiFi', 'Meeting Room Access', 'Free Coffee & Tea'],
    popular: false,
  },
  {
    id: 'dedicated-desk',
    name: 'Dedicated Desk',
    monthlyPrice: 6999,
    dailyPrice: null,
    priceUnit: '/mo',
    description: 'Your own permanent desk in our workspace.',
    features: ['Reserved Desk', '24/7 Access', 'Meeting Room', 'Locker Storage', 'Printing Services', 'Free Coffee & Tea'],
    popular: true,
  },
  {
    id: 'private-cabin-monthly',
    name: 'Private Cabin',
    monthlyPrice: 29999,
    dailyPrice: null,
    priceUnit: '/mo',
    description: 'Secured private office for startups and teams.',
    features: ['Furnished Cabin for 2-5', 'Company Branding', 'Meeting Rooms', 'Premium Network', 'Free Coffee & Tea', 'Dedicated IP Address'],
    popular: false,
  }
];

export const DEFAULT_AMENITIES = [
  {
    id: 'wifi',
    title: 'Ultra High-Speed WiFi',
    description: 'Redundant dual-ISP gigabit fiber connections with 99.9% uptime and zero throttling.',
    iconName: 'Wifi',
    color: 'text-neon-blue',
    badge: '1 Gbps'
  },
  {
    id: 'coffee',
    title: 'Artisanal Coffee & Tea',
    description: 'Unlimited single-origin roasts, specialty espresso drinks, and herbal tea bar all day.',
    iconName: 'Coffee',
    color: 'text-neon-pink',
    badge: 'Unlimited'
  },
  {
    id: 'power',
    title: '100% Power Backup',
    description: 'Zero interruption with enterprise UPS and on-site generator automatic failover.',
    iconName: 'Zap',
    color: 'text-[#facc15]',
    badge: '24/7'
  },
  {
    id: 'phone-booth',
    title: 'Acoustic Sound Pods',
    description: 'Soundproof privacy booths for confidential investor calls, podcasts, and zoom meetings.',
    iconName: 'PhoneCall',
    color: 'text-neon-purple',
    badge: 'Private'
  },
  {
    id: 'printing',
    title: 'Wireless Color Printing',
    description: 'Cloud printing, document scanning, and binding stations directly from your laptop.',
    iconName: 'Printer',
    color: 'text-emerald-400',
    badge: 'Complimentary'
  },
  {
    id: 'lockers',
    title: 'Biometric Smart Lockers',
    description: 'Keep your laptops, hardware, and personal belongings protected overnight with passcode locks.',
    iconName: 'Lock',
    color: 'text-cyan-400',
    badge: 'Secure'
  },
  {
    id: 'gaming',
    title: 'Game & Recharge Zone',
    description: 'Take high-energy breaks with PS5 gaming setups, board games, and massage recliners.',
    iconName: 'Gamepad2',
    color: 'text-rose-400',
    badge: 'Breakout'
  },
  {
    id: 'security',
    title: 'CCTV & Biometric Access',
    description: 'Round-the-clock physical security guards and 24/7 RFID/biometric turnstile entrance.',
    iconName: 'ShieldCheck',
    color: 'text-neon-blue',
    badge: '24/7 Monitored'
  }
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 'rohan-verma',
    name: 'Rohan Verma',
    role: 'Tech Founder',
    avatarKey: 'rohan',
    avatarUrl: '',
    rating: 5,
    content: 'Startup Cafe transformed how my team works. The environment is inspiring, the networking is unmatched, and the 9-7 access helps us hit strict deadlines.',
  },
  {
    id: 'sanya-sharma',
    name: 'Sanya Sharma',
    role: 'Creative Director',
    avatarKey: 'sanya',
    avatarUrl: '',
    rating: 5,
    content: "The best co-working space I've ever worked in! The aesthetic is literally what I try to design for my clients. Super productive atmosphere.",
  },
  {
    id: 'arjun-desai',
    name: 'Arjun Desai',
    role: 'Serial Entrepreneur',
    avatarKey: 'arjun',
    avatarUrl: '',
    rating: 5,
    content: 'We moved our whole startup to a private cabin here. The VC facilities and the community support feel like we are in a top-tier tech hub.',
  }
];

export const DEFAULT_FRANCHISE_BENEFITS = [
  {
    id: 'benefit-1',
    title: 'Strong Brand Identity',
    desc: 'Leverage our established presence and premium positioning to attract high-value clients instantly.',
    iconName: 'Award',
    color: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
  },
  {
    id: 'benefit-2',
    title: 'Proven Business Model',
    desc: 'Skip the trial and error with our standardized SOPs and optimized revenue structures.',
    iconName: 'ShieldCheck',
    color: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
  },
  {
    id: 'benefit-3',
    title: 'Marketing Support',
    desc: 'National marketing campaigns and localized lead generation strategies to keep your space full.',
    iconName: 'Zap',
    color: 'text-neon-pink',
    bg: 'bg-neon-pink/10',
  },
  {
    id: 'benefit-4',
    title: 'Operational Guidance',
    desc: 'End-to-end support for day-to-day operations, from hospitality management to billing.',
    iconName: 'Handshake',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    id: 'benefit-5',
    title: 'ROI & Growth',
    desc: 'Average payback period of 24-30 months with multiple high-margin revenue streams.',
    iconName: 'Globe',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
];

export const DEFAULT_REVENUE_STREAMS = [
  { id: 'stream-1', iconName: 'Monitor', title: 'Dedicated Desk', price: 'Starting ₹6,999/mo' },
  { id: 'stream-2', iconName: 'Laptop', title: 'Private Cabin', price: 'Starting ₹29,999/mo' },
  { id: 'stream-3', iconName: 'Coffee', title: 'Cafe Services', price: 'Daily Footfall Monetization' },
  { id: 'stream-4', iconName: 'Calendar', title: 'Events & Workshops', price: 'Venue Booking Charges' },
];

export const DEFAULT_PROCESS_STEPS = [
  {
    id: 'step-1',
    stepNumber: '01',
    title: 'Application',
    desc: 'Fill the inquiry form and our franchise experts will get in touch with you for initial screening.',
    iconName: 'ClipboardList',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    title: 'Site Selection',
    desc: 'We help you identify or validate the perfect location based on data-driven footfall & demand analysis.',
    iconName: 'MapPin',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    title: 'Setup & Design',
    desc: "Our interior design team provides standard layouts to maintain our premium 'Startup Cafe' aesthetic.",
    iconName: 'Paintbrush',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    title: 'Hiring & Training',
    desc: 'Recruitment assistance and intensive training for your staff on our hospitality standards and software.',
    iconName: 'Users',
  },
  {
    id: 'step-5',
    stepNumber: '05',
    title: 'Grand Launch',
    desc: 'A massive marketing push and launch event to ensure high occupancy from day one.',
    iconName: 'Rocket',
  },
];

export const DEFAULT_SUPPORT_ITEMS = [
  {
    id: 'support-1',
    title: 'Location Selection',
    desc: 'Expert guidance in finding the perfect building with high visibility and accessibility.',
    iconName: 'MapPin',
  },
  {
    id: 'support-2',
    title: 'Interior Design',
    desc: "Standardized high-end architectural plans and interior themes that scream 'Startups'.",
    iconName: 'Palette',
  },
  {
    id: 'support-3',
    title: 'Digital Marketing',
    desc: 'Listing optimizations, social media handling, and lead generation ad campaigns.',
    iconName: 'Megaphone',
  },
  {
    id: 'support-4',
    title: 'Tech Stack',
    desc: 'Custom booking software, automated billing, and high-speed network management apps.',
    iconName: 'Cpu',
  },
  {
    id: 'support-5',
    title: 'Staff Training',
    desc: 'Comprehensive training on hospitality, sales, and community management for your team.',
    iconName: 'GraduationCap',
  },
];

export const DEFAULT_REQUIREMENTS_ITEMS = [
  {
    id: 'req-1',
    title: 'Area Required',
    desc: 'Ideally 1000 – 3000 sq ft of premium carpet area in a commercial building.',
    iconName: 'Square',
  },
  {
    id: 'req-2',
    title: 'Prime Location',
    desc: 'Proximity to business hubs, transport hubs, or educational institutes.',
    iconName: 'Map',
  },
  {
    id: 'req-3',
    title: 'Building Standards',
    desc: 'Full power backup, lift connectivity, and professional security presence.',
    iconName: 'Building',
  },
];

export const DEFAULT_OFFICE_LOCATIONS = [
  {
    id: 'office-1',
    title: 'Mumbai Office',
    address: 'Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051',
    iconType: 'Building2',
    color: 'text-neon-blue',
    visible: true,
  },
  {
    id: 'office-2',
    title: 'Gorakhpur Hub',
    address: '2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, Uttar Pradesh - 273001',
    iconType: 'MapPin',
    color: 'text-neon-pink',
    visible: true,
  },
];

export const DEFAULT_FORM_FIELDS_CONFIG = {
  // Field toggles (Admin can hide, show, or delete fields)
  showNameField: true,
  showEmailField: true,
  showPhoneField: true,
  showPlanField: true,
  showDurationSwitch: true,
  showDateField: true,
  showPeopleField: true,
  showLocationField: true,
  showMessageField: true,
  showPriceBreakdown: true,
  showWhatsappButton: true,

  // Customizable labels & placeholders
  nameLabel: 'Full Name',
  namePlaceholder: 'Rohan Singh',
  emailLabel: 'Email Address',
  emailPlaceholder: 'rohan@example.com',
  phoneLabel: 'Phone Number',
  phonePlaceholder: '98765 43210',
  planLabel: 'Plan Type',
  durationLabel: 'Duration',
  dateLabel: 'Start Date',
  peopleLabel: 'People',
  locationLabel: 'Location',
  locationPlaceholder: 'Select hub (Gorakhpur Hub, Mumbai Office)',
  messageLabel: 'Message (Optional)',
  messagePlaceholder: 'Special requirements?',

  // Form styling options
  formCardRadius: 'rounded-3xl', // 'rounded-2xl' | 'rounded-3xl' | 'rounded-xl'
  formCardGlow: 'none', // 'none' | 'blue' | 'purple' | 'pink'
  buttonGradient: 'default', // 'default' | 'pink-purple' | 'emerald' | 'amber'
};

export const DEFAULT_FRANCHISE_TESTIMONIALS = [
  {
    id: 'partner-rajesh',
    name: 'Rajesh Khanna',
    location: 'Partner',
    avatarKey: 'rajesh',
    avatarUrl: '',
    text: "Startup Cafe has been a game-changer for my real estate portfolio. The brand's focus on community and technology made it very easy to reach 90% occupancy within just 4 months of launch.",
  },
  {
    id: 'partner-priya',
    name: 'Priya Sharma',
    location: 'Partner',
    avatarKey: 'priya',
    avatarUrl: '',
    text: "Deciding to take a franchise of Startup Cafe was the best business decision I've made. The support team is incredible, and the design aesthetic really sets us apart from local competitors.",
  },
];

export const DEFAULT_FRANCHISE_BUDGET_OPTIONS = [
  '₹20L - ₹35L',
  '₹35L - ₹50L',
  '₹50L+',
];

export const DEFAULT_SETTINGS = {
  // Hero Section
  badgeText: 'Premium Workspace Experience',
  mainHeading: 'Your Premium Office',
  subHeading: '@ Startup Cafe',
  description: 'Elevate your work in a dynamic, futuristic ecosystem designed for creators, entrepreneurs, and visionaries.',
  primaryButtonText: 'Book a Seat',
  secondaryButtonText: 'Schedule a Visit',

  // About Section
  aboutHeading: 'More than just',
  aboutAccent: 'desk.',
  aboutDescription1: "Startup Cafe was born from a vision to bring Silicon Valley's collaborative ecosystem to our community. We provide founders, freelancers, and growing teams with a premium, focused space that drives innovation forward.",
  aboutDescription2: "Here, you don't just rent an office. You join a community of driven individuals reshaping the tech landscape.",
  aboutImage: '',
  aboutStat1Value: '500+',
  aboutStat1Label: 'Trusted Members',
  aboutStat2Value: '9-7',
  aboutStat2Label: 'Access',
  aboutStat3Value: '100+',
  aboutStat3Label: 'Dedicated Desk',

  // Services Section
  servicesHeading: 'Premium Work',
  servicesAccent: 'Environments',
  servicesDescription: 'From focused private spaces to collaborative open desk, we provide everything your startup needs to thrive.',
  servicesList: DEFAULT_SERVICES,

  // Amenities Section (Disabled by default so original website baseline is untouched)
  showAmenities: false,
  amenitiesHeading: 'World-Class',
  amenitiesAccent: 'Amenities',
  amenitiesDescription: 'Every workstation comes fully loaded with enterprise infrastructure and hospitality perks.',
  amenitiesList: DEFAULT_AMENITIES,
  amenitiesHeadingColor: '',
  amenitiesDescriptionColor: '',

  // Pricing Section
  pricingHeading: 'Simple, Transparent',
  pricingAccent: 'Pricing',
  pricingButtonText: 'Book Now',
  pricingPlans: DEFAULT_PRICING_PLANS,

  // Contact Section
  contactHeading: 'Book Your',
  contactAccent: 'Workspace',
  contactDescription: 'Ready to level up your workspace? Reserve your spot today.',
  contactHeadingColor: '',
  contactDescriptionColor: '',

  // Map Portion Settings & Styles
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.08277259169!2d83.303977598466!3d26.7634863378516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991446a0c332489%3A0x1ff3f97fdcc6b711!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714080123512!5m2!1sen!2sin',
  mapHeight: '400px',
  mapDarkModeFilter: true,
  mapFilterPreset: 'cyberpunk', // 'cyberpunk' | 'natural' | 'grayscale' | 'midnight' | 'muted'
  mapRadius: 'rounded-2xl', // 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl'
  mapBorderGlow: 'none', // 'none' | 'blue' | 'purple' | 'pink'
  contactOffice1Title: 'Mumbai Office',
  contactOffice1Address: 'Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051',
  contactOffice2Title: 'Gorakhpur Hub',
  contactOffice2Address: '2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, Uttar Pradesh - 273001',
  contactPhone: '+91 96701 11167',
  contactEmail: 'startupcafegkp@gmail.com',
  contactWhatsappNumber: '919670111167',
  contactOfficesList: DEFAULT_OFFICE_LOCATIONS,

  // Form Portion Settings & Dynamic Fields
  contactFormFieldsConfig: DEFAULT_FORM_FIELDS_CONFIG,
  contactFormSubmitText: 'Confirm Booking',
  contactFormWhatsappCtaText: 'Quick Inquiry via WhatsApp',
  contactWhatsappInquiryMessage: "Hello Startup Cafe! I'm reaching out from your website to make an inquiry.",
  contactSuccessTitle: 'Request Received!',
  contactSuccessMessage: 'Our team will review your booking and contact you shortly to confirm.',
  contactSuccessNotice: 'For immediate assistance, feel free to reach out via WhatsApp.',
  contactSuccessWhatsappButtonText: 'WhatsApp Now',
  contactSuccessWhatsappMessage: 'Hello Startup Cafe! I have just submitted a booking request on your website and would like to follow up on it.',

  // Gallery Section
  galleryHeading: 'Inside',
  galleryAccent: 'Startup Cafe',
  galleryDescription: '',
  galleryBadge: 'Workspace View',
  galleryInitialCount: 6,
  customGalleryImages: [],

  // Media & Highlights Section
  pressBadge: 'Media & Highlights',
  pressHeading: 'In The Spotlight',
  pressSubheading: 'See what leading newspapers, media outlets, and the community are saying about our revolutionary co-working space.',
  mediaHighlightsList: [],

  // Franchise Content & Stats
  franchiseBadge: 'Franchise Opportunity',
  franchiseHeading: 'Start Your Own',
  franchiseAccent: 'Startup Cafe',
  franchiseDescription: "Join India's fastest-growing coworking brand and transform the way people work in your city.",
  franchisePrimaryButton: 'Apply for Franchise',
  franchiseSecondaryButton: 'Learn More',

  // Franchise 4 Key Performance Stats
  franchiseStat1Value: '15+',
  franchiseStat1Label: 'Cities',
  franchiseStat2Value: '50k+',
  franchiseStat2Label: 'Sq Ft Managed',
  franchiseStat3Value: '2000+',
  franchiseStat3Label: 'Members',
  franchiseStat4Value: 'High',
  franchiseStat4Label: 'ROI Potential',

  // Franchise Credibility Highlights (3 Trust Pillars)
  credibilityPillar1Title: '10+ Years of Startup Network',
  credibilityPillar1Desc: "A decade of building India's strongest startup ecosystem.",
  credibilityPillar1Icon: 'Network',
  credibilityPillar2Title: 'First Co-working Space of Eastern UP',
  credibilityPillar2Desc: 'Pioneering the coworking culture in Eastern Uttar Pradesh.',
  credibilityPillar2Icon: 'MapPin',
  credibilityPillar3Title: 'Acknowledged by Startup Leaders & Media',
  credibilityPillar3Desc: 'Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media.',
  credibilityPillar3Icon: 'Award',

  // Franchise Vision & Concept (FranchiseAbout)
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

  // Franchise Investment & Space (Revenue Model)
  revenueBadge: 'Income Potential',
  revenueHeading: 'Built for',
  revenueAccent: 'Profitability',
  revenueDescription: 'Our business model goes beyond just "renting space". We\'ve optimized multiple revenue streams to ensure high occupancy and diverse income sources.',
  revenueInvestmentLabel: 'Estimated Investment',
  revenueInvestmentSubtext: '(Approximate)',
  revenueInvestmentDisclaimer: '*Values vary based on location, area, and city tier.',
  franchiseInvestment: '₹25L - ₹45L',
  franchiseAreaRequired: 'Ideally 1000 – 3000 sq ft of premium carpet area in a commercial building.',
  revenueStreamsList: DEFAULT_REVENUE_STREAMS,

  // Founder Video & Message
  founderBadge: "Founder's Message",
  founderHeading: 'Why',
  founderAccent: 'Startup Cafe',
  founderSuffix: 'Matters',
  founderDescription: 'Startup Cafe was born from a simple belief – that great ideas can come from anywhere, but they need the right environment to grow.',
  founderSubtext: 'In this short message, our founder shares the vision, the mission, and why this space is built for dreamers, doers, and disruptors.',
  founderVideoSource: 'default',
  founderVideoUrl: '',
  founderVideoAspectRatio: 'auto',
  founderVideoRadius: 'default',
  founderVideoBorderWidth: 'default',
  founderVideoBorderColor: '',

  // Franchise Why Partner With Us (Benefits Section)
  franchiseBenefitsBadge: 'Partnership Advantages',
  franchiseBenefitsHeading: 'Why Partner with',
  franchiseBenefitsAccent: 'Us?',
  franchiseBenefitsSubtitle: 'We provide the foundation, tools, and brand power you need to build a successful coworking business from day one.',
  franchiseBenefitsList: DEFAULT_FRANCHISE_BENEFITS,
  franchiseBenefitsCtaTitle: 'Start Your Journey',
  franchiseBenefitsCtaQuote: 'Building the workspace of tomorrow, together.',
  franchiseBenefitsCtaButton: 'Inquire Now',
  franchiseBenefitsHeadingColor: '',
  franchiseBenefitsSubtitleColor: '',

  // Franchise Path to Ownership (Process Roadmap)
  processBadge: 'Roadmap',
  processHeading: 'Your Path to',
  processAccent: 'Ownership',
  processSubtitle: 'Five simple steps to launching your own Startup Cafe.',
  processLayoutStyle: 'alternating', // 'alternating' (Original timeline) | 'grid' (Bento cards) | 'horizontal' (Milestone stepper) | 'left-spine' (Clean spine)
  processStepsList: DEFAULT_PROCESS_STEPS,
  processHeadingColor: '',
  processSubtitleColor: '',

  // Franchise Unmatched Support
  supportBadge: 'Comprehensive Ecosystem',
  supportHeading: 'Unmatched',
  supportAccent: 'Support',
  supportSubtitle: 'You are never alone on your journey. Our expert teams are with you from day one to ensure your cafe is a massive success.',
  supportLayoutStyle: 'grid', // 'grid' (Original Bento Grid) | 'tabs' (Interactive Tab Showcase) | 'compact' (Numbered Cards & Banner) | 'split' (Two-Column & Sticky CTA)
  supportItemsList: DEFAULT_SUPPORT_ITEMS,
  supportCtaTitle: 'Ready to Lead?',
  supportCtaSubtitle: 'Download our complete franchise brochure to see the full list of support services.',
  supportCtaButton: 'Download Brochure',
  supportBrochureUrl: '/StartUp%20Cafe%20Brochure.pdf',
  supportHeadingColor: '',
  supportSubtitleColor: '',

  // Franchise Space & Requirements (Physical Specs & Investment Note)
  requirementsBadge: 'Space & Criteria',
  requirementsHeading: 'Space &',
  requirementsAccent: 'Requirements',
  requirementsSubtitle: 'Do you have what it takes to build a Startup Cafe?',
  requirementsLayoutStyle: 'grid', // 'grid' (Original Baseline) | 'showcase' (Interactive Criteria Spotlight) | 'modern' (Numbered Spec Cards) | 'checklist' (Split Checklist & Sticky Note)
  requirementsItemsList: DEFAULT_REQUIREMENTS_ITEMS,
  requirementsNoteTitle: 'Note on Investment capability:',
  requirementsNoteDesc: 'Apart from the physical requirements, we look for partners who are passionate about building startup communities and have the financial capability to sustain operations for the first 18 months.',
  requirementsCtaButton: 'Apply Now',
  requirementsHeadingColor: '',
  requirementsSubtitleColor: '',

  // Ecosystem & Recognition (Logo Carousel)
  ecosystemBadge: 'Ecosystem & Recognition',
  ecosystemHeading: 'Recognized &',
  ecosystemAccent: 'Trusted Ecosystem',
  ecosystemDescription: 'Startup Cafe is proud to be acknowledged by key Government bodies and associated with top media and industry networks.',
  ecosystemPartnersList: DEFAULT_ECOSYSTEM_PARTNERS,

  // Homepage Acknowledged By Strip
  showAcknowledgedOnHome: true,
  acknowledgedHeading: 'Acknowledged By',

  // Testimonials Section
  testimonialsHeading: 'What Co-Works',
  testimonialsAccent: 'Say',
  testimonialsList: DEFAULT_TESTIMONIALS,
  testimonialsHeadingColor: '',
  testimonialsTextColor: '',

  // Franchise Testimonials / Partner Reviews
  franchiseTestimonialsHeading: 'Voice of our',
  franchiseTestimonialsAccent: 'Franchise Partners',
  franchiseTestimonialsSubtitle: 'Hear directly from those who are already growing with us.',
  franchiseTestimonialsList: DEFAULT_FRANCHISE_TESTIMONIALS,
  franchiseTestimonialsHeadingColor: '',
  franchiseTestimonialsSubtitleColor: '',

  // Franchise Inquiry Form
  franchiseInquiryHeading: 'Start Your',
  franchiseInquiryAccent: 'Partner Journey',
  franchiseInquirySubtitle: "Take the first step towards owning a premium co-working franchise. Let's discuss your vision.",
  franchiseInquiryBudgetOptions: DEFAULT_FRANCHISE_BUDGET_OPTIONS,
  franchiseInquirySubmitText: 'Submit Application',
  franchiseInquiryWhatsappText: 'WhatsApp Support',
  franchiseInquiryWhatsappMessage: 'Hello Startup Cafe! I have just submitted a franchise inquiry form and would like to get more information about the partnership opportunity.',
  franchiseInquirySuccessTitle: 'Application Received!',
  franchiseInquirySuccessMessage: 'Thank you for your interest in partnering with us. Our franchise development team will review your details and contact you within 48 hours.',
  franchiseInquiryHeadingColor: '',
  franchiseInquirySubtitleColor: '',

  // Franchise Application Form Fields & Placeholders
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
  franchiseInquiryShowWhatsapp: true,

  // Franchise Field Visibility Toggles & Styling Options (Mirrors Contact & Location system)
  franchiseInquiryShowName: true,
  franchiseInquiryShowEmail: true,
  franchiseInquiryShowPhone: true,
  franchiseInquiryShowCity: true,
  franchiseInquiryShowBudget: true,
  franchiseInquiryShowMessage: true,
  franchiseInquiryCardRadius: 'rounded-[2.5rem]',
  franchiseInquiryCardGlow: 'none',
  franchiseInquiryButtonGradient: 'default',
  franchiseInquirySuccessNotice: 'Our franchise development team will review your profile and connect within 48 hours.',

  // Typography
  fontFamily: "'Poppins', sans-serif",
  headingFont: "'Poppins', sans-serif",
  fontSizeScale: '100%',
  fontWeight: '400',
  headingWeight: '700',
  letterSpacing: '0px',

  // Theme Colors & Atmosphere
  accentColor: '#b026ff',
  gradientStart: '#ff2975',
  gradientEnd: '#00f0ff',
  primaryTextColor: '#f8fafc',
  mutedTextColor: '#94a3b8',
  backgroundColor: '#050505',

  // Individual Section Heading & Description Colors (Optional overrides)
  heroHeadingColor: '',
  heroDescriptionColor: '',
  aboutHeadingColor: '',
  aboutDescriptionColor: '',
  servicesHeadingColor: '',
  servicesDescriptionColor: '',
  pricingHeadingColor: '',
  contactHeadingColor: '',
  contactDescriptionColor: '',
};

// Safe localStorage loader with fallback
const getInitialSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        servicesList: Array.isArray(parsed.servicesList) && parsed.servicesList.length > 0
          ? parsed.servicesList
          : DEFAULT_SERVICES,
        pricingPlans: Array.isArray(parsed.pricingPlans) && parsed.pricingPlans.length > 0
          ? parsed.pricingPlans
          : DEFAULT_PRICING_PLANS,
        amenitiesList: Array.isArray(parsed.amenitiesList) && parsed.amenitiesList.length > 0
          ? parsed.amenitiesList
          : DEFAULT_AMENITIES,
        testimonialsList: Array.isArray(parsed.testimonialsList) && parsed.testimonialsList.length > 0
          ? parsed.testimonialsList
          : DEFAULT_TESTIMONIALS,
        mediaHighlightsList: Array.isArray(parsed.mediaHighlightsList)
          ? parsed.mediaHighlightsList
          : [],
        franchiseBenefitsList: Array.isArray(parsed.franchiseBenefitsList) && parsed.franchiseBenefitsList.length > 0
          ? parsed.franchiseBenefitsList
          : DEFAULT_FRANCHISE_BENEFITS,
        revenueStreamsList: Array.isArray(parsed.revenueStreamsList) && parsed.revenueStreamsList.length > 0
          ? parsed.revenueStreamsList
          : DEFAULT_REVENUE_STREAMS,
        processStepsList: Array.isArray(parsed.processStepsList) && parsed.processStepsList.length > 0
          ? parsed.processStepsList
          : DEFAULT_PROCESS_STEPS,
        processLayoutStyle: parsed.processLayoutStyle || 'alternating',
        supportItemsList: Array.isArray(parsed.supportItemsList) && parsed.supportItemsList.length > 0
          ? parsed.supportItemsList
          : DEFAULT_SUPPORT_ITEMS,
        supportLayoutStyle: parsed.supportLayoutStyle || 'grid',
        requirementsItemsList: Array.isArray(parsed.requirementsItemsList) && parsed.requirementsItemsList.length > 0
          ? parsed.requirementsItemsList
          : DEFAULT_REQUIREMENTS_ITEMS,
        requirementsLayoutStyle: parsed.requirementsLayoutStyle || 'grid',
        ecosystemPartnersList: Array.isArray(parsed.ecosystemPartnersList) && parsed.ecosystemPartnersList.length > 0
          ? parsed.ecosystemPartnersList
          : DEFAULT_ECOSYSTEM_PARTNERS,
        contactOfficesList: Array.isArray(parsed.contactOfficesList) && parsed.contactOfficesList.length > 0
          ? parsed.contactOfficesList
          : DEFAULT_OFFICE_LOCATIONS,
        contactFormFieldsConfig: {
          ...DEFAULT_FORM_FIELDS_CONFIG,
          ...(parsed.contactFormFieldsConfig || {}),
        },
        franchiseTestimonialsList: Array.isArray(parsed.franchiseTestimonialsList) && parsed.franchiseTestimonialsList.length > 0
          ? parsed.franchiseTestimonialsList
          : DEFAULT_FRANCHISE_TESTIMONIALS,
        franchiseInquiryBudgetOptions: Array.isArray(parsed.franchiseInquiryBudgetOptions) && parsed.franchiseInquiryBudgetOptions.length > 0
          ? parsed.franchiseInquiryBudgetOptions
          : DEFAULT_FRANCHISE_BUDGET_OPTIONS,
      };
    }
  } catch (error) {
    console.error('Failed to parse settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  // Dynamically apply typography and theme variables to document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    const current = settings || DEFAULT_SETTINGS;

    const fontFamily = current.fontFamily || DEFAULT_SETTINGS.fontFamily;
    const fontSizeScale = current.fontSizeScale || DEFAULT_SETTINGS.fontSizeScale;
    const fontWeight = current.fontWeight || DEFAULT_SETTINGS.fontWeight;
    const headingWeight = current.headingWeight || DEFAULT_SETTINGS.headingWeight;
    const letterSpacing = current.letterSpacing || DEFAULT_SETTINGS.letterSpacing;
    const accentColor = current.accentColor || DEFAULT_SETTINGS.accentColor;
    const gradientStart = current.gradientStart || DEFAULT_SETTINGS.gradientStart;
    const gradientEnd = current.gradientEnd || DEFAULT_SETTINGS.gradientEnd;
    const primaryTextColor = current.primaryTextColor || DEFAULT_SETTINGS.primaryTextColor;
    const mutedTextColor = current.mutedTextColor || DEFAULT_SETTINGS.mutedTextColor;
    const backgroundColor = current.backgroundColor || DEFAULT_SETTINGS.backgroundColor;

    root.style.setProperty('--app-font-family', fontFamily);
    root.style.setProperty('--app-font-size', fontSizeScale);
    root.style.setProperty('--app-font-weight', fontWeight);
    root.style.setProperty('--app-heading-weight', headingWeight);
    root.style.setProperty('--app-letter-spacing', letterSpacing);

    root.style.setProperty('--color-neon-purple', accentColor);
    root.style.setProperty('--color-neon-pink', gradientStart);
    root.style.setProperty('--color-neon-blue', gradientEnd);
    root.style.setProperty('--color-dark-bg', backgroundColor);
    root.style.setProperty('--app-text-color', primaryTextColor);
    root.style.setProperty('--app-muted-color', mutedTextColor);

    root.style.fontSize = fontSizeScale;

    if (body) {
      body.style.fontFamily = fontFamily;
      body.style.letterSpacing = letterSpacing;
    }
  }, [settings]);

  // Background sync with server settings API (if server is running)
  useEffect(() => {
    let isMounted = true;
    try {
      fetch(`${API_BASE_URL}/api/settings`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.success && data?.settings && Object.keys(data.settings).length > 0) {
            setSettings((prev) => ({
              ...DEFAULT_SETTINGS,
              ...prev,
              ...data.settings,
            }));
          }
        })
        .catch(() => {
          // Graceful fallback: silent failure keeping existing localStorage/defaults
        });
    } catch {
      // safe fallback
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage and broadcast across browser tabs whenever settings change
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...(typeof newSettings === 'function' ? newSettings(prev) : newSettings),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to persist settings to localStorage:', error);
        if (error?.name === 'QuotaExceededError' || error?.code === 22) {
          console.warn('Storage quota limit reached in localStorage. Changes remain active in current session.');
        }
      }

      // Sync with backend settings JSON file if available
      try {
        fetch(`${API_BASE_URL}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(() => { });
      } catch {
        // safe fallback
      }

      // Instant cross-tab sync via BroadcastChannel
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('startupcafe_settings_channel');
          bc.postMessage({ type: 'UPDATE_SETTINGS', payload: updated });
          bc.close();
        }
      } catch (e) {
        // Fallback handled by storage event
      }

      return updated;
    });
  };

  // Reset back to default values
  const resetSettings = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove settings from localStorage:', error);
    }
    setSettings(DEFAULT_SETTINGS);

    // Reset server settings
    try {
      fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).catch(() => { });
    } catch {
      // safe fallback
    }

    // Instant cross-tab sync via BroadcastChannel
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('startupcafe_settings_channel');
        bc.postMessage({ type: 'RESET_SETTINGS' });
        bc.close();
      }
    } catch (e) {
      // Fallback handled by storage event
    }
  };

  // Cross-tab / cross-window sync listener (storage event + BroadcastChannel)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(e.newValue) });
          } catch (err) {
            console.error('Error parsing storage event data:', err);
          }
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let bc;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('startupcafe_settings_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'UPDATE_SETTINGS' && event.data.payload) {
            setSettings({ ...DEFAULT_SETTINGS, ...event.data.payload });
          } else if (event.data?.type === 'RESET_SETTINGS') {
            setSettings(DEFAULT_SETTINGS);
          }
        };
      }
    } catch (e) {
      // BroadcastChannel optional fallback
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

  const isCustomized = useMemo(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      defaultSettings: DEFAULT_SETTINGS,
      isCustomized,
    }),
    [settings, isCustomized]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook with safe fallback
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    console.warn(
      'Warning: useSettings was called outside of a <SettingsProvider>. Falling back to DEFAULT_SETTINGS.'
    );
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => { },
      resetSettings: () => { },
      defaultSettings: DEFAULT_SETTINGS,
      isCustomized: false,
    };
  }
  return context;
}

export default SettingsContext;
