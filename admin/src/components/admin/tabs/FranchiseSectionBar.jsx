import React from 'react';
import {
  Sliders,
  Building2,
  Video,
  Award,
  Landmark,
  Route,
  LifeBuoy,
  CheckSquare,
  Sparkles,
  MessageSquareQuote,
  Send,
  Target,
} from 'lucide-react';

export const FRANCHISE_SECTIONS = [
  {
    id: 'overview',
    number: '1',
    label: 'Hero & Metrics',
    shortLabel: 'Overview',
    tabId: 'franchise',
    icon: Building2,
    activeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.25)]',
  },
  {
    id: 'credibility',
    number: '2',
    label: 'Credibility & Authority',
    shortLabel: 'Credibility',
    tabId: 'franchiseCredibility',
    icon: Award,
    activeColor: 'bg-neon-purple/20 text-neon-purple border-neon-purple/40 shadow-[0_0_12px_rgba(176,38,255,0.25)] ring-1 ring-neon-purple/40',
  },
  {
    id: 'founderVideo',
    number: '3',
    label: 'Founder Video & Message',
    shortLabel: 'Founder Video',
    tabId: 'founderVideo',
    icon: Video,
    activeColor: 'bg-neon-pink/20 text-neon-pink border-neon-pink/40 shadow-[0_0_12px_rgba(255,0,128,0.25)] ring-1 ring-neon-pink/40',
  },
  {
    id: 'story',
    number: '4',
    label: 'Ecosystem & Recognition',
    shortLabel: 'Ecosystem',
    tabId: 'franchiseStory',
    icon: Sparkles,
    activeColor: 'bg-neon-blue/20 text-neon-blue border-neon-blue/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]',
  },
  {
    id: 'vision',
    number: '5',
    label: 'Vision: "Why India is Betting Big"',
    shortLabel: 'Vision',
    tabId: 'franchiseVision',
    icon: Target,
    activeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40',
  },
  {
    id: 'benefits',
    number: '6',
    label: 'Why Partner with Us',
    shortLabel: 'Why Partner',
    tabId: 'franchiseBenefits',
    icon: Award,
    activeColor: 'bg-neon-blue/20 text-neon-blue border-neon-blue/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]',
  },
  {
    id: 'revenue',
    number: '7',
    label: 'Income & Revenue',
    shortLabel: 'Revenue Model',
    tabId: 'franchiseRevenue',
    icon: Landmark,
    activeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'process',
    number: '8',
    label: 'Path to Ownership',
    shortLabel: 'Roadmap',
    tabId: 'franchiseProcess',
    icon: Route,
    activeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
  },
  {
    id: 'support',
    number: '9',
    label: 'Operational Support',
    shortLabel: 'Support',
    tabId: 'franchiseSupport',
    icon: LifeBuoy,
    activeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
  },
  {
    id: 'requirements',
    number: '10',
    label: 'Space & Requirements',
    shortLabel: 'Criteria',
    tabId: 'franchiseRequirements',
    icon: CheckSquare,
    activeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.25)]',
  },
  {
    id: 'testimonials',
    number: '11',
    label: 'Voice of Franchise Partners',
    shortLabel: 'Reviews',
    tabId: 'franchiseTestimonials',
    icon: MessageSquareQuote,
    activeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]',
  },
  {
    id: 'inquiry',
    number: '12',
    label: 'Application & Inquiry Form',
    shortLabel: 'Inquiry Form',
    tabId: 'franchiseInquiry',
    icon: Send,
    activeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.25)]',
  },
];

/**
 * Standardized Section Bar across all Franchise Editor Tabs.
 * Ensures consistent numbers (1-11), colors, icons, and 1-click jumps.
 */
export default function FranchiseSectionBar() {
  // Redundant sub-bar removed as requested to keep UI clean and avoid duplication
  return null;
}

