import { motion } from 'framer-motion';
import heroImg from '../../assets/franchise_hero.png';
import { useSettings } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

export default function FranchiseHero() {
  const { settings } = useSettings();

  const badge = settings?.franchiseBadge || 'Franchise Opportunity';
  const heading = settings?.franchiseHeading || 'Start Your Own';
  const accent = settings?.franchiseAccent || 'Startup Cafe';
  const description = settings?.franchiseDescription || "Join India's fastest-growing coworking brand and transform the way people work in your city.";
  const primaryButtonText = settings?.franchisePrimaryButton || 'Apply for Franchise';
  const secondaryButtonText = settings?.franchiseSecondaryButton || 'Learn More';

  const stat1Value = settings?.franchiseStat1Value || '15+';
  const stat1Label = settings?.franchiseStat1Label || 'Cities';
  const stat2Value = settings?.franchiseStat2Value || '50k+';
  const stat2Label = settings?.franchiseStat2Label || 'Sq Ft Managed';
  const stat3Value = settings?.franchiseStat3Value || '2000+';
  const stat3Label = settings?.franchiseStat3Label || 'Members';
  const stat4Value = settings?.franchiseStat4Value || 'High';
  const stat4Label = settings?.franchiseStat4Label || 'ROI Potential';

  const heroBackground = settings?.franchiseHeroImage || heroImg;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Modern Coworking Space"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/0 via-dark-bg/40 to-dark-bg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md">
            {renderFormattedText(badge)}
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            {renderFormattedText(heading)}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue">
              {renderFormattedText(accent)}
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            {renderFormattedText(description)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-neon-blue hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
            >
              {renderFormattedText(primaryButtonText)}
            </button>
            <button
              onClick={() => document.getElementById('model').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white glass-card border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {renderFormattedText(secondaryButtonText)}
            </button>
          </div>
        </motion.div>

        {/* Stats segment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-20 p-6 md:p-8 glass-card border border-white/5"
        >
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-white">{renderFormattedText(stat1Value)}</h4>
            <p className="text-slate-400 text-xs md:text-sm">{renderFormattedText(stat1Label)}</p>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-white">{renderFormattedText(stat2Value)}</h4>
            <p className="text-slate-400 text-xs md:text-sm">{renderFormattedText(stat2Label)}</p>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-white">{renderFormattedText(stat3Value)}</h4>
            <p className="text-slate-400 text-xs md:text-sm">{renderFormattedText(stat3Label)}</p>
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-white">{renderFormattedText(stat4Value)}</h4>
            <p className="text-slate-400 text-xs md:text-sm">{renderFormattedText(stat4Label)}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
