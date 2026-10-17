import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Square,
  Map,
  Building,
  Maximize2,
  Layers,
  ShieldCheck,
  Zap,
  Car,
  Compass,
  Store,
  Coffee,
  Briefcase,
  Clock,
  Sparkles,
  Users,
  CheckCircle,
  CheckSquare,
  DoorOpen,
  Warehouse,
  Flame,
  Shield,
  Laptop,
  Key,
  PhoneCall,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useSettings, DEFAULT_REQUIREMENTS_ITEMS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

const REQUIREMENTS_ICONS_MAP = {
  Square,
  Map,
  Building,
  Maximize2,
  Layers,
  ShieldCheck,
  Zap,
  Car,
  Compass,
  Store,
  Coffee,
  Briefcase,
  Clock,
  Sparkles,
  Users,
  CheckCircle,
  CheckSquare,
  DoorOpen,
  Warehouse,
  Flame,
  Shield,
  Laptop,
  Key,
  PhoneCall,
};

const COLOR_CYCLES = [
  { iconBg: 'bg-neon-blue/10', text: 'text-neon-blue', border: 'border-neon-blue/30', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]' },
  { iconBg: 'bg-neon-purple/10', text: 'text-neon-purple', border: 'border-neon-purple/30', glow: 'shadow-[0_0_20px_rgba(176,38,255,0.15)]' },
  { iconBg: 'bg-neon-pink/10', text: 'text-neon-pink', border: 'border-neon-pink/30', glow: 'shadow-[0_0_20px_rgba(255,0,127,0.15)]' },
  { iconBg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/30', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]' },
  { iconBg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/30', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]' },
];

function renderRequirementIcon(iconName, className = 'w-6 h-6 md:w-8 md:h-8') {
  const IconComp = REQUIREMENTS_ICONS_MAP[iconName] || Square;
  return <IconComp className={className} />;
}

function getGridColsClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-3';
}

export default function FranchiseRequirements() {
  const { settings } = useSettings();

  const badge = settings?.requirementsBadge || '';
  const heading = settings?.requirementsHeading !== undefined ? settings.requirementsHeading : 'Space &';
  const accent = settings?.requirementsAccent !== undefined ? settings.requirementsAccent : 'Requirements';
  const subtitle = settings?.requirementsSubtitle !== undefined ? settings.requirementsSubtitle : 'Do you have what it takes to build a Startup Cafe?';
  const headingColor = settings?.requirementsHeadingColor || '';
  const subtitleColor = settings?.requirementsSubtitleColor || '';
  const layoutStyle = settings?.requirementsLayoutStyle || 'grid';

  const noteTitle = settings?.requirementsNoteTitle !== undefined ? settings.requirementsNoteTitle : 'Note on Investment capability:';
  const noteDesc = settings?.requirementsNoteDesc !== undefined ? settings.requirementsNoteDesc : 'Apart from the physical requirements, we look for partners who are passionate about building startup communities and have the financial capability to sustain operations for the first 18 months.';
  const ctaButton = settings?.requirementsCtaButton !== undefined ? settings.requirementsCtaButton : 'Apply Now';

  // Fallback to legacy franchiseAreaRequired if present and original first item is untouched
  const rawItems = Array.isArray(settings?.requirementsItemsList) && settings.requirementsItemsList.length > 0
    ? settings.requirementsItemsList
    : DEFAULT_REQUIREMENTS_ITEMS;

  const items = rawItems.map((item, idx) => {
    if (idx === 0 && settings?.franchiseAreaRequired && (!item.desc || item.desc === DEFAULT_REQUIREMENTS_ITEMS[0].desc)) {
      return { ...item, desc: settings.franchiseAreaRequired };
    }
    return item;
  });

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const handleApplyClick = () => {
    const formElement = document.getElementById('inquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="requirements" className="py-20 md:py-24 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md"
            >
              {renderFormattedText(badge)}
            </motion.span>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ color: headingColor || undefined }}
          >
            {renderFormattedText(heading)}{' '}
            <span className="text-neon-blue">{renderFormattedText(accent)}</span>
          </motion.h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto"
              style={{ color: subtitleColor || undefined }}
            >
              {renderFormattedText(subtitle)}
            </motion.p>
          )}
        </div>

        {/* LAYOUT 1: BENTO GRID (ORIGINAL BASELINE) */}
        {layoutStyle === 'grid' && (
          <div>
            <div className={`grid ${getGridColsClass(items.length)} gap-6 md:gap-8`}>
              {items.map((item, idx) => {
                const colorScheme = COLOR_CYCLES[idx % COLOR_CYCLES.length];
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 md:p-10 glass-card border border-white/5 flex flex-col items-center text-center group hover:border-white/20 transition-all"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${colorScheme.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {renderRequirementIcon(item.iconName, `${colorScheme.text} w-6 h-6 md:w-8 md:h-8`)}
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-4">
                      {renderFormattedText(item.title)}
                    </h4>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      {renderFormattedText(item.desc)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Note on Investment capability Callout */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8"
            >
              <div className="lg:max-w-2xl text-center lg:text-left">
                <h4 className="text-white font-bold text-lg md:text-xl mb-2 italic">
                  {renderFormattedText(noteTitle)}
                </h4>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {renderFormattedText(noteDesc)}
                </p>
              </div>
              <button
                onClick={handleApplyClick}
                className="w-full lg:w-auto px-10 py-4 rounded-xl bg-neon-blue font-bold text-black hover:shadow-[0_0_20px_#00f0ff] transition-all text-sm md:text-base cursor-pointer shrink-0"
              >
                {renderFormattedText(ctaButton)}
              </button>
            </motion.div>
          </div>
        )}

        {/* LAYOUT 2: CRITERIA SPOTLIGHT TAB */}
        {layoutStyle === 'showcase' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Selector Pillars */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {items.map((item, idx) => {
                  const isSelected = activeItemIndex === idx;
                  const colorScheme = COLOR_CYCLES[idx % COLOR_CYCLES.length];
                  return (
                    <motion.div
                      key={item.id || idx}
                      onClick={() => setActiveItemIndex(idx)}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? `bg-white/[0.08] ${colorScheme.border} ${colorScheme.glow} ring-1 ${colorScheme.border}`
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl ${colorScheme.iconBg} flex items-center justify-center shrink-0`}>
                          {renderRequirementIcon(item.iconName, `${colorScheme.text} w-6 h-6`)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                            Requirement #{idx + 1}
                          </span>
                          <h4 className="text-base font-bold text-white truncate">
                            {renderFormattedText(item.title)}
                          </h4>
                        </div>
                      </div>
                      <ArrowRight size={18} className={`shrink-0 transition-transform ${isSelected ? `${colorScheme.text} translate-x-1` : 'text-slate-600'}`} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Big Spotlight Card */}
              <div className="lg:col-span-7">
                {(() => {
                  const currentItem = items[activeItemIndex] || items[0];
                  const currentColors = COLOR_CYCLES[activeItemIndex % COLOR_CYCLES.length];
                  return (
                    <motion.div
                      key={activeItemIndex}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`h-full min-h-[300px] p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.05] via-dark-card to-white/[0.02] border ${currentColors.border} ${currentColors.glow} flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-8">
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${currentColors.iconBg} border ${currentColors.border} flex items-center justify-center`}>
                            {renderRequirementIcon(currentItem.iconName, `${currentColors.text} w-8 h-8 md:w-10 md:h-10`)}
                          </div>
                          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/10">
                            CRITERION 0{activeItemIndex + 1}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                          {renderFormattedText(currentItem.title)}
                        </h3>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                          {renderFormattedText(currentItem.desc)}
                        </p>
                      </div>

                      <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                          <CheckCircle size={14} className={currentColors.text} />
                          Physical Space Pre-requisite
                        </span>
                        <span className="font-mono uppercase">{activeItemIndex + 1} of {items.length}</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>

            {/* Bottom Investment Note Callout */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-neon-purple/20 via-white/[0.03] to-neon-blue/20 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8"
            >
              <div className="lg:max-w-2xl text-center lg:text-left">
                <h4 className="text-white font-bold text-lg md:text-xl mb-2 italic">
                  {renderFormattedText(noteTitle)}
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {renderFormattedText(noteDesc)}
                </p>
              </div>
              <button
                onClick={handleApplyClick}
                className="w-full lg:w-auto px-10 py-4 rounded-xl bg-neon-blue font-bold text-black hover:shadow-[0_0_20px_#00f0ff] transition-all text-sm md:text-base cursor-pointer shrink-0"
              >
                {renderFormattedText(ctaButton)}
              </button>
            </motion.div>
          </div>
        )}

        {/* LAYOUT 3: NUMBERED METRIC SPECS */}
        {layoutStyle === 'modern' && (
          <div className="space-y-12">
            <div className={`grid ${getGridColsClass(items.length)} gap-6 md:gap-8`}>
              {items.map((item, idx) => {
                const colorScheme = COLOR_CYCLES[idx % COLOR_CYCLES.length];
                const itemNum = idx + 1 < 10 ? `0${idx + 1}` : idx + 1;
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between group hover:-translate-y-1.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className={`text-2xl md:text-3xl font-black font-mono ${colorScheme.text}`}>
                          #{itemNum}
                        </span>
                        <div className={`w-12 h-12 rounded-xl ${colorScheme.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {renderRequirementIcon(item.iconName, `${colorScheme.text} w-6 h-6`)}
                        </div>
                      </div>

                      <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                        {renderFormattedText(item.title)}
                      </h4>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        {renderFormattedText(item.desc)}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                      <span>Standard Specification</span>
                      <span className="w-2 h-2 rounded-full bg-neon-blue/60" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dual-Tone Investment Callout Module */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-neon-purple/20 via-neon-pink/10 to-neon-blue/20 border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_30px_rgba(176,38,255,0.15)]"
            >
              <div className="lg:max-w-2xl text-center lg:text-left">
                <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold uppercase tracking-wider text-neon-pink rounded-full bg-neon-pink/15 border border-neon-pink/30">
                  Investor Capability
                </span>
                <h4 className="text-white font-bold text-xl md:text-2xl mb-2">
                  {renderFormattedText(noteTitle)}
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {renderFormattedText(noteDesc)}
                </p>
              </div>
              <button
                onClick={handleApplyClick}
                className="w-full lg:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple font-bold text-white hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all text-sm md:text-base cursor-pointer shrink-0"
              >
                {renderFormattedText(ctaButton)}
              </button>
            </motion.div>
          </div>
        )}

        {/* LAYOUT 4: SPLIT CHECKLIST & STICKY NOTE */}
        {layoutStyle === 'checklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Physical Specs Checklist */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item, idx) => {
                const colorScheme = COLOR_CYCLES[idx % COLOR_CYCLES.length];
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl ${colorScheme.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      {renderRequirementIcon(item.iconName, `${colorScheme.text} w-6 h-6`)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-base md:text-lg font-bold text-white">
                          {renderFormattedText(item.title)}
                        </h4>
                        <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {renderFormattedText(item.desc)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Dedicated Sticky Investment Capability Card */}
            <div className="lg:col-span-5 sticky top-28">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.06] via-dark-card to-neon-blue/[0.08] border-2 border-neon-blue/40 shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-neon-blue rounded-full bg-neon-blue/15 border border-neon-blue/30">
                    Financial &amp; Vision Check
                  </span>
                  <h4 className="text-white font-bold text-xl md:text-2xl mb-4 italic">
                    {renderFormattedText(noteTitle)}
                  </h4>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                    {renderFormattedText(noteDesc)}
                  </p>
                </div>

                <button
                  onClick={handleApplyClick}
                  className="w-full py-4 rounded-xl bg-neon-blue font-bold text-black hover:shadow-[0_0_25px_#00f0ff] transition-all text-sm md:text-base cursor-pointer"
                >
                  {renderFormattedText(ctaButton)}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
