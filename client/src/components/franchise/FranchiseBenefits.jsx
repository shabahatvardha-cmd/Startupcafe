import { motion } from 'framer-motion';
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
  BarChart3,
  Coffee,
  MapPin,
  Network,
  Compass,
} from 'lucide-react';
import { useSettings, DEFAULT_FRANCHISE_BENEFITS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

const BENEFIT_ICONS = {
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
};

function getBenefitIcon(iconName) {
  return BENEFIT_ICONS[iconName] || Award;
}

export default function FranchiseBenefits() {
  const { settings, defaultSettings } = useSettings();
  const current = settings || defaultSettings || {};

  const benefitsList = Array.isArray(current.franchiseBenefitsList) && current.franchiseBenefitsList.length > 0
    ? current.franchiseBenefitsList
    : DEFAULT_FRANCHISE_BENEFITS;

  const handleScrollToInquiry = () => {
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="why-partner-with-us" className="py-20 md:py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          {current.franchiseBenefitsBadge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 backdrop-blur-md"
            >
              <span className="text-xs font-semibold text-neon-blue uppercase tracking-wider">
                {renderFormattedText(current.franchiseBenefitsBadge)}
              </span>
            </motion.div>
          )}

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            style={{ color: current.franchiseBenefitsHeadingColor || undefined }}
          >
            {renderFormattedText(current.franchiseBenefitsHeading !== undefined ? current.franchiseBenefitsHeading : 'Why Partner with')}{' '}
            <span className="text-neon-blue">
              {renderFormattedText(current.franchiseBenefitsAccent !== undefined ? current.franchiseBenefitsAccent : 'Us?')}
            </span>
          </motion.h2>

          <p 
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: current.franchiseBenefitsSubtitleColor || undefined }}
          >
            {renderFormattedText(current.franchiseBenefitsSubtitle !== undefined ? current.franchiseBenefitsSubtitle : 'We provide the foundation, tools, and brand power you need to build a successful coworking business from day one.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefitsList.map((benefit, index) => {
            const IconComponent = getBenefitIcon(benefit.iconName);
            return (
              <motion.div
                key={benefit.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-6 md:p-8 border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${benefit.bg || 'bg-neon-blue/10'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`${benefit.color || 'text-neon-blue'} w-6 h-6 md:w-8 md:h-8`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {renderFormattedText(benefit.title)}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {renderFormattedText(benefit.desc)}
                </p>
              </motion.div>
            );
          })}
          
          {/* Join Community / Callout Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10 flex flex-col justify-center items-center text-center group"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {renderFormattedText(current.franchiseBenefitsCtaTitle !== undefined ? current.franchiseBenefitsCtaTitle : 'Start Your Journey')}
            </h3>
            <p className="text-slate-300 mb-8 italic">
              "{renderFormattedText(current.franchiseBenefitsCtaQuote !== undefined ? current.franchiseBenefitsCtaQuote : 'Building the workspace of tomorrow, together.')}"
            </p>
            <button 
              type="button"
              onClick={handleScrollToInquiry}
              className="px-8 py-3 rounded-full bg-white text-black font-bold hover:shadow-[0_0_20px_white] transition-all cursor-pointer"
            >
              {renderFormattedText(current.franchiseBenefitsCtaButton !== undefined ? current.franchiseBenefitsCtaButton : 'Inquire Now')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
