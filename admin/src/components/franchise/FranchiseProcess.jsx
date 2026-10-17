import { motion } from 'framer-motion';
import { useSettings, DEFAULT_PROCESS_STEPS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';
import {
  ClipboardList,
  MapPin,
  Paintbrush,
  Users,
  Rocket,
  Search,
  FileText,
  Briefcase,
  Key,
  CheckCircle,
  Coins,
  Award,
  Sparkles,
  TrendingUp,
  Handshake,
  Target,
  Building2,
  Store,
  Coffee,
  Laptop,
  ShieldCheck,
  Zap,
  Globe,
  Flag,
  ChevronRight,
} from 'lucide-react';

const ICON_MAP = {
  ClipboardList,
  MapPin,
  Paintbrush,
  Users,
  Rocket,
  Search,
  FileText,
  Briefcase,
  Key,
  CheckCircle,
  Coins,
  Award,
  Sparkles,
  TrendingUp,
  Handshake,
  Target,
  Building2,
  Store,
  Coffee,
  Laptop,
  ShieldCheck,
  Zap,
  Globe,
  Flag,
};

function resolveIcon(step, fallbackIdx = 0) {
  if (step.iconName && ICON_MAP[step.iconName]) {
    return ICON_MAP[step.iconName];
  }
  if (step.icon) {
    return step.icon;
  }
  const defaults = [ClipboardList, MapPin, Paintbrush, Users, Rocket];
  return defaults[fallbackIdx % defaults.length] || Rocket;
}

export default function FranchiseProcess() {
  const { settings, defaultSettings } = useSettings();
  const current = settings || defaultSettings || {};

  const steps = Array.isArray(current.processStepsList) && current.processStepsList.length > 0
    ? current.processStepsList
    : DEFAULT_PROCESS_STEPS;

  const layoutStyle = current.processLayoutStyle || 'alternating';

  // Section Header Data
  const badgeText = current.processBadge !== undefined ? current.processBadge : 'Roadmap';
  const headingText = current.processHeading !== undefined ? current.processHeading : 'Your Path to';
  const accentText = current.processAccent !== undefined ? current.processAccent : 'Ownership';
  const subtitleText = current.processSubtitle !== undefined ? current.processSubtitle : 'Five simple steps to launching your own Startup Cafe.';

  const headingColor = current.processHeadingColor || undefined;
  const subtitleColor = current.processSubtitleColor || undefined;

  return (
    <section id="process" className="py-20 md:py-24 px-6 md:px-12 relative overflow-hidden">
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
              <span className="px-3.5 py-1 text-xs font-semibold tracking-wider text-neon-pink uppercase border border-neon-pink/30 rounded-full bg-neon-pink/10 backdrop-blur-md">
                {renderFormattedText(badgeText)}
              </span>
            </motion.div>
          )}

          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ color: headingColor }}
          >
            {renderFormattedText(headingText)}{' '}
            <span className="text-neon-pink">
              {renderFormattedText(accentText)}
            </span>
          </h2>

          <p
            className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto"
            style={{ color: subtitleColor }}
          >
            {renderFormattedText(subtitleText)}
          </p>
        </div>

        {/* =========================================================================
            STYLE 1: ALTERNATING TIMELINE (ORIGINAL DEFAULT - 100% UNTOUCHED BASELINE)
            ========================================================================= */}
        {layoutStyle === 'alternating' && (
          <div className="relative">
            {/* Vertical line for desktop */}
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10 hidden lg:block"></div>

            <div className="space-y-16 lg:space-y-0">
              {steps.map((step, index) => {
                const StepIcon = resolveIcon(step, index);
                const stepNum = step.stepNumber || (index + 1 < 10 ? `0${index + 1}` : index + 1);

                return (
                  <div
                    key={step.id || index}
                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                      <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-[1px] rounded-2xl mb-4 shadow-[0_0_20px_rgba(176,38,255,0.3)]">
                        <div className="bg-dark-bg p-4 md:p-5 rounded-2xl flex items-center justify-center">
                          <StepIcon
                            size={36}
                            strokeWidth={2.5}
                            className="text-white drop-shadow-[0_0_12px_rgba(255,41,117,0.8)]"
                          />
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 mb-2">
                        <span className="text-[11px] font-mono font-bold text-neon-pink tracking-wider">
                          STEP {renderFormattedText(stepNum)}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {renderFormattedText(step.title)}
                      </h3>
                      <p className="text-slate-400 text-sm md:text-base max-w-sm md:max-w-md leading-relaxed">
                        {renderFormattedText(step.desc)}
                      </p>
                    </motion.div>

                    {/* Center Circle */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-neon-pink shadow-[0_0_15px_#ff2975] z-10 items-center justify-center"></div>

                    <div className="lg:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STYLE 2: BENTO CARDS GRID (MODERN RESPONSIVE CARDS)
            ========================================================================= */}
        {layoutStyle === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {steps.map((step, index) => {
              const StepIcon = resolveIcon(step, index);
              const stepNum = step.stepNumber || (index + 1 < 10 ? `0${index + 1}` : index + 1);

              return (
                <motion.div
                  key={step.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-neon-pink/50 transition-all duration-300 shadow-lg hover:shadow-[0_10px_35px_rgba(255,41,117,0.2)] flex flex-col justify-between"
                >
                  {/* Subtle Top-Right Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Top Row: Icon & Step Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-[1px] rounded-2xl shadow-[0_0_20px_rgba(176,38,255,0.25)] group-hover:shadow-[0_0_25px_rgba(255,41,117,0.5)] transition-shadow">
                        <div className="bg-dark-bg p-3.5 rounded-2xl flex items-center justify-center">
                          <StepIcon
                            size={28}
                            strokeWidth={2.3}
                            className="text-white drop-shadow-[0_0_10px_rgba(255,41,117,0.7)] group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      </div>

                      <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/30 group-hover:bg-neon-pink group-hover:text-white transition-colors duration-200">
                        #{renderFormattedText(stepNum)}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-neon-pink transition-colors">
                      {renderFormattedText(step.title)}
                    </h3>

                    {/* Step Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {renderFormattedText(step.desc)}
                    </p>
                  </div>

                  {/* Card Bottom Accent Line */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Phase {index + 1} of {steps.length}</span>
                    <span className="text-neon-pink/60 group-hover:text-neon-pink transition-colors">
                      Startup Cafe Model →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            STYLE 3: MILESTONE PROGRESS STEPPER (CONNECTED HORIZONTAL SEQUENTIAL FLOW)
            ========================================================================= */}
        {layoutStyle === 'horizontal' && (
          <div className="space-y-10 relative z-10">
            {/* Top Continuous Progress Track (Desktop) */}
            <div className="hidden lg:block relative py-6 px-8 rounded-2xl bg-white/[0.02] border border-white/10">
              {/* Connecting Gradient Line */}
              <div className="absolute top-1/2 left-16 right-16 -translate-y-1/2 h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-full shadow-[0_0_15px_rgba(255,41,117,0.5)] z-0" />

              <div className="relative z-10 flex items-center justify-between">
                {steps.map((step, idx) => {
                  const stepNum = step.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1);
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-dark-bg border-2 border-neon-pink text-white font-mono font-bold flex items-center justify-center shadow-[0_0_15px_#ff2975] text-sm hover:scale-110 transition-transform">
                        {renderFormattedText(stepNum)}
                      </div>
                      <span className="text-xs font-bold text-white mt-2 max-w-[120px] text-center truncate">
                        {renderFormattedText(step.title)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => {
                const StepIcon = resolveIcon(step, index);
                const stepNum = step.stepNumber || (index + 1 < 10 ? `0${index + 1}` : index + 1);

                return (
                  <motion.div
                    key={step.id || index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.05] transition-all duration-300 relative group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <StepIcon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-400 tracking-wider">
                          MILESTONE {renderFormattedText(stepNum)}
                        </span>
                        <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {renderFormattedText(step.title)}
                        </h4>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {renderFormattedText(step.desc)}
                    </p>

                    {index < steps.length - 1 && (
                      <div className="mt-4 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <span>Next: {renderFormattedText(steps[index + 1].title)}</span>
                        <ChevronRight size={13} className="text-amber-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STYLE 4: LEFT-SPINE RAIL TIMELINE (CLEAN MODERN TECH RAIL)
            ========================================================================= */}
        {layoutStyle === 'left-spine' && (
          <div className="relative max-w-4xl mx-auto pl-6 sm:pl-10 border-l-2 border-emerald-400/30 space-y-10 my-4">
            {steps.map((step, index) => {
              const StepIcon = resolveIcon(step, index);
              const stepNum = step.stepNumber || (index + 1 < 10 ? `0${index + 1}` : index + 1);

              return (
                <motion.div
                  key={step.id || index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Left Spine Node */}
                  <div className="absolute -left-[37px] sm:-left-[53px] top-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-dark-bg border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-[0_0_15px_#10b981] font-mono text-[11px] sm:text-xs font-bold group-hover:scale-115 transition-transform">
                    {renderFormattedText(stepNum)}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-400/40 transition-all duration-300 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 shrink-0">
                          <StepIcon size={22} strokeWidth={2.3} />
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {renderFormattedText(step.title)}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-emerald-400/80 px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20 self-start sm:self-center">
                        Step {renderFormattedText(stepNum)} of {steps.length < 10 ? `0${steps.length}` : steps.length}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-0 sm:pl-12">
                      {renderFormattedText(step.desc)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
