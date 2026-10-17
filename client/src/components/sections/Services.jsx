import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Monitor,
  Users,
  Briefcase,
  Zap,
  Coffee,
  Globe,
  Mic,
  Wifi,
  Shield,
  Sparkles,
  Building,
  PhoneCall,
  Calendar,
  Laptop
} from 'lucide-react';
import { useSettings, DEFAULT_SERVICES } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

export const ICON_MAP = {
  Monitor: { comp: Monitor, color: 'text-neon-blue' },
  Briefcase: { comp: Briefcase, color: 'text-neon-purple' },
  Users: { comp: Users, color: 'text-neon-pink' },
  Globe: { comp: Globe, color: 'text-neon-blue' },
  Zap: { comp: Zap, color: 'text-[#facc15]' },
  Coffee: { comp: Coffee, color: 'text-neon-pink' },
  Mic: { comp: Mic, color: 'text-neon-blue' },
  Wifi: { comp: Wifi, color: 'text-neon-purple' },
  Shield: { comp: Shield, color: 'text-emerald-400' },
  Sparkles: { comp: Sparkles, color: 'text-yellow-400' },
  Building: { comp: Building, color: 'text-cyan-400' },
  PhoneCall: { comp: PhoneCall, color: 'text-pink-400' },
  Calendar: { comp: Calendar, color: 'text-neon-blue' },
  Laptop: { comp: Laptop, color: 'text-neon-purple' }
};

function renderServiceIcon(service) {
  if (service.icon && typeof service.icon !== 'string') {
    return service.icon;
  }
  const item = ICON_MAP[service.iconName] || ICON_MAP.Monitor;
  const Comp = item.comp;
  return <Comp size={32} className={item.color} />;
}

function TiltCard({ service }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    // Values range from -1 to 1 for hover intensity
    mouseX.set((x / width) * 2 - 1);
    mouseY.set((y / height) * 2 - 1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: useMotionTemplate`${mouseY.get() * -15}deg`,
        rotateY: useMotionTemplate`${mouseX.get() * 15}deg`,
      }}
      className="perspective-1000 transform-gpu relative group p-1 w-full rounded-2xl"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-blue rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
      
      {/* Card Content */}
      <div className={`relative h-full bg-[#0a0a0c] rounded-2xl p-8 border border-white/5 overflow-hidden flex flex-col items-start gap-4 z-10 bg-gradient-to-br ${service.gradient}`}>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
          {renderServiceIcon(service)}
        </div>
        <h3 className="text-2xl font-bold text-white mt-4">{renderFormattedText(service.title)}</h3>
        <p className="text-slate-400 font-light leading-relaxed">
          {renderFormattedText(service.description)}
        </p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { settings } = useSettings();
  const {
    servicesHeading = 'Premium Work',
    servicesAccent = 'Environments',
    servicesDescription = 'From focused private spaces to collaborative open desk, we provide everything your startup needs to thrive.',
    accentColor = '#b026ff',
    gradientEnd = '#00f0ff',
    servicesHeadingColor,
    servicesDescriptionColor,
    servicesList,
  } = settings || {};

  const activeServices = (Array.isArray(servicesList) && servicesList.length > 0)
    ? servicesList
    : DEFAULT_SERVICES;

  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ color: servicesHeadingColor || undefined }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {renderFormattedText(servicesHeading)} <br className="md:hidden" />
          <span 
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientEnd}, ${accentColor})`
            }}
          >
            {renderFormattedText(servicesAccent)}
          </span>
        </motion.h2>
        <p 
          style={{ color: servicesDescriptionColor || undefined }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          {renderFormattedText(servicesDescription)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeServices.map((service, index) => (
          <motion.div 
            key={service.id || service.title || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <TiltCard service={service} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
