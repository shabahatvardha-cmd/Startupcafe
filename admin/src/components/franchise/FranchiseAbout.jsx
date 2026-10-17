import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Zap,
  Building2,
  Globe,
  Award,
  ShieldCheck,
  HeartHandshake,
  Coins,
  Coffee,
  Briefcase,
  Crown,
  Star,
  Rocket,
  Network,
  MapPin,
  Trophy,
  Flame,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import aboutImg from '../../assets/franchise_about.png';
import { useSettings } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

const VISION_ICON_MAP = {
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  Building2,
  Globe,
  Award,
  ShieldCheck,
  HeartHandshake,
  Coins,
  Coffee,
  Briefcase,
  Crown,
  Star,
  Rocket,
  Network,
  MapPin,
  Trophy,
  Flame,
  CheckCircle2,
  Compass,
};

export default function FranchiseAbout() {
  const { settings } = useSettings();

  const badge = settings?.franchiseVisionBadge || 'Vision & Concept';
  const heading = settings?.franchiseVisionHeading || 'Why India is Betting Big on';
  const accent = settings?.franchiseVisionAccent || 'Coworking';
  const desc1 = settings?.franchiseVisionDesc1 || 'With the rise of the digital economy and hybrid work culture, demand for high-quality, professional workspaces is exploding across India, particularly in Tier 2 and Tier 3 cities.';
  const desc2 = settings?.franchiseVisionDesc2 || 'Startup Cafe is more than just a place to plug in. It’s an ecosystem where founders find mentors, freelancers find clients, and companies find culture.';
  const f1Title = settings?.franchiseVisionFeature1Title || 'Growth Engine';
  const f1Desc = settings?.franchiseVisionFeature1Desc || "India's coworking market is projected to reach $1.5B by 2027.";
  const f2Title = settings?.franchiseVisionFeature2Title || 'Community Focus';
  const f2Desc = settings?.franchiseVisionFeature2Desc || 'High retention through events and meaningful networking.';
  const image = settings?.franchiseVisionImage || aboutImg;

  const BadgeIcon = VISION_ICON_MAP[settings?.franchiseVisionBadgeIcon] || Target;
  const Feature1Icon = VISION_ICON_MAP[settings?.franchiseVisionFeature1Icon] || TrendingUp;
  const Feature2Icon = VISION_ICON_MAP[settings?.franchiseVisionFeature2Icon] || Users;

  return (
    <section id="model" className="py-20 md:py-24 px-6 md:px-12 bg-dark-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue blur-3xl opacity-20 transform -rotate-12 rounded-full"></div>
            <img 
              src={image}
              onError={(e) => {
                if (e.currentTarget.src !== aboutImg) {
                  e.currentTarget.src = aboutImg;
                }
              }}
              alt="Community Collaboration" 
              className="w-full rounded-2xl md:rounded-3xl border border-white/10 relative z-10 shadow-2xl"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-2 mb-4">
            <BadgeIcon className="text-neon-pink w-5 h-5 md:w-6 md:h-6" />
            <span className="text-neon-pink font-semibold tracking-wider uppercase text-xs md:text-sm">
              {renderFormattedText(badge)}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8">
            {renderFormattedText(heading)}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
              {renderFormattedText(accent)}
            </span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            {renderFormattedText(desc1)}
          </p>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            {renderFormattedText(desc2)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-3 bg-neon-blue/10 rounded-xl h-fit">
                <Feature1Icon className="text-neon-blue w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">
                  {renderFormattedText(f1Title)}
                </h4>
                <p className="text-slate-400 text-sm">
                  {renderFormattedText(f1Desc)}
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-3 bg-neon-purple/10 rounded-xl h-fit">
                <Feature2Icon className="text-neon-purple w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">
                  {renderFormattedText(f2Title)}
                </h4>
                <p className="text-slate-400 text-sm">
                  {renderFormattedText(f2Desc)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
