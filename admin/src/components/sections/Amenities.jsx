import { motion } from 'framer-motion';
import {
  Wifi,
  Coffee,
  Zap,
  PhoneCall,
  Printer,
  Lock,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Monitor,
  Users,
  Briefcase,
  Award,
  Heart,
  Star
} from 'lucide-react';
import { useSettings, DEFAULT_AMENITIES } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

export const AMENITY_ICON_MAP = {
  Wifi: { comp: Wifi, defaultColor: 'text-neon-blue' },
  Coffee: { comp: Coffee, defaultColor: 'text-neon-pink' },
  Zap: { comp: Zap, defaultColor: 'text-[#facc15]' },
  PhoneCall: { comp: PhoneCall, defaultColor: 'text-neon-purple' },
  Printer: { comp: Printer, defaultColor: 'text-emerald-400' },
  Lock: { comp: Lock, defaultColor: 'text-cyan-400' },
  Gamepad2: { comp: Gamepad2, defaultColor: 'text-rose-400' },
  ShieldCheck: { comp: ShieldCheck, defaultColor: 'text-neon-blue' },
  Sparkles: { comp: Sparkles, defaultColor: 'text-yellow-400' },
  Monitor: { comp: Monitor, defaultColor: 'text-neon-blue' },
  Users: { comp: Users, defaultColor: 'text-neon-pink' },
  Briefcase: { comp: Briefcase, defaultColor: 'text-neon-purple' },
  Award: { comp: Award, defaultColor: 'text-amber-400' },
  Heart: { comp: Heart, defaultColor: 'text-pink-400' },
  Star: { comp: Star, defaultColor: 'text-yellow-400' }
};

function renderAmenityIcon(iconName, customColor) {
  const item = AMENITY_ICON_MAP[iconName] || AMENITY_ICON_MAP.Sparkles;
  const Comp = item.comp;
  const colorClass = customColor || item.defaultColor;
  return <Comp size={28} className={colorClass} />;
}

export default function Amenities() {
  const { settings } = useSettings();
  const {
    amenitiesHeading = 'World-Class',
    amenitiesAccent = 'Amenities',
    amenitiesDescription = 'Every workstation comes fully loaded with enterprise infrastructure and hospitality perks.',
    accentColor = '#b026ff',
    gradientEnd = '#00f0ff',
    amenitiesHeadingColor,
    amenitiesDescriptionColor,
    amenitiesList,
  } = settings || {};

  const activeAmenities = (Array.isArray(amenitiesList) && amenitiesList.length > 0)
    ? amenitiesList
    : DEFAULT_AMENITIES;

  return (
    <section id="amenities" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 scroll-mt-24">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-neon-purple/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-neon-blue mb-4 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-neon-blue" />
          Included With Every Desk
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ color: amenitiesHeadingColor || undefined }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {renderFormattedText(amenitiesHeading)}{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientEnd}, ${accentColor})`
            }}
          >
            {renderFormattedText(amenitiesAccent)}
          </span>
        </motion.h2>

        <p
          style={{ color: amenitiesDescriptionColor || undefined }}
          className="text-slate-400 max-w-2xl mx-auto text-base"
        >
          {renderFormattedText(amenitiesDescription)}
        </p>
      </div>

      {/* Grid of Amenity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {activeAmenities.map((amenity, index) => (
          <motion.div
            key={amenity.id || amenity.title || index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/25 transition-all group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient hover glow inside card */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-neon-purple/10 rounded-full blur-2xl group-hover:bg-neon-blue/20 transition-all duration-500 pointer-events-none"></div>

            <div>
              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  {renderAmenityIcon(amenity.iconName, amenity.color)}
                </div>

                {amenity.badge && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 group-hover:text-white group-hover:border-neon-blue/40 transition-colors">
                    {renderFormattedText(amenity.badge)}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                {renderFormattedText(amenity.title)}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                {renderFormattedText(amenity.description)}
              </p>
            </div>

            {/* Subtle bottom accent line on hover */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors">
              <span>Standard Perk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
