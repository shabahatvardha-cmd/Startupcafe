import { motion } from 'framer-motion';
import {
  Monitor,
  Laptop,
  Coffee,
  Calendar,
  Landmark,
  Building2,
  Users,
  Zap,
  Briefcase,
  Award,
  Sparkles,
  Globe,
  Coins,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { useSettings, DEFAULT_REVENUE_STREAMS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

const STREAM_ICONS = {
  Monitor,
  Laptop,
  Coffee,
  Calendar,
  Landmark,
  Building2,
  Users,
  Zap,
  Briefcase,
  Award,
  Sparkles,
  Globe,
  Coins,
  TrendingUp,
  Target,
  ShieldCheck,
};

function getStreamIcon(name) {
  return STREAM_ICONS[name] || Monitor;
}

export default function RevenueModel() {
  const { settings, defaultSettings } = useSettings();
  const current = settings || defaultSettings || {};

  const investment = current.franchiseInvestment || '₹25L - ₹45L';
  const streams = Array.isArray(current.revenueStreamsList) && current.revenueStreamsList.length > 0
    ? current.revenueStreamsList
    : DEFAULT_REVENUE_STREAMS;

  return (
    <section id="revenue-model" className="py-20 md:py-24 px-6 md:px-12 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="text-neon-blue w-5 h-5 md:w-6 md:h-6" />
              <span className="text-neon-blue font-semibold tracking-wider uppercase text-xs md:text-sm">
                {renderFormattedText(current.revenueBadge !== undefined ? current.revenueBadge : 'Income Potential')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {renderFormattedText(current.revenueHeading !== undefined ? current.revenueHeading : 'Built for')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                {renderFormattedText(current.revenueAccent !== undefined ? current.revenueAccent : 'Profitability')}
              </span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
              {renderFormattedText(current.revenueDescription !== undefined ? current.revenueDescription : 'Our business model goes beyond just "renting space". We\'ve optimized multiple revenue streams to ensure high occupancy and diverse income sources.')}
            </p>
            
            <div className="space-y-4">
              <div className="p-5 md:p-6 glass-card border-none bg-white/[0.05]">
                <h4 className="text-white font-bold mb-2 text-sm md:text-base">
                  {renderFormattedText(current.revenueInvestmentLabel !== undefined ? current.revenueInvestmentLabel : 'Estimated Investment')}
                </h4>
                <div className="flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-black text-white">{renderFormattedText(investment)}</span>
                  <span className="text-slate-400 text-xs md:text-sm mb-1">
                    {renderFormattedText(current.revenueInvestmentSubtext !== undefined ? current.revenueInvestmentSubtext : '(Approximate)')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {renderFormattedText(current.revenueInvestmentDisclaimer !== undefined ? current.revenueInvestmentDisclaimer : '*Values vary based on location, area, and city tier.')}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {streams.map((item, index) => {
              const IconComp = getStreamIcon(item.iconName);
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 md:p-8 glass-card border border-white/5 hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="p-3 bg-neon-blue/10 rounded-xl w-fit mb-6 group-hover:bg-neon-blue group-hover:text-black transition-all">
                    <IconComp className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">
                    {renderFormattedText(item.title)}
                  </h3>
                  <p className="text-neon-blue font-medium text-sm md:text-base">
                    {renderFormattedText(item.price)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
