import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import rajeshImg from '../../assets/partners/rajesh.png';
import priyaImg from '../../assets/partners/priya.png';
import rohanImg from '../../assets/rohan.png';
import sanyaImg from '../../assets/sanya.png';
import arjunImg from '../../assets/arjun.png';
import { useSettings, DEFAULT_FRANCHISE_TESTIMONIALS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

export const PARTNER_AVATAR_MAP = {
  rajesh: rajeshImg,
  priya: priyaImg,
  rohan: rohanImg,
  sanya: sanyaImg,
  arjun: arjunImg,
};

export const resolvePartnerAvatar = (item) => {
  if (!item) return rajeshImg;
  if (item.avatarKey && PARTNER_AVATAR_MAP[item.avatarKey]) {
    return PARTNER_AVATAR_MAP[item.avatarKey];
  }
  if (item.avatarUrl && typeof item.avatarUrl === 'string' && item.avatarUrl.trim()) {
    return item.avatarUrl.trim();
  }
  if (item.img) return item.img;
  return item.name?.toLowerCase().includes('priya') ? priyaImg : rajeshImg;
};

export default function FranchiseTestimonials() {
  const { settings } = useSettings();

  const heading = settings?.franchiseTestimonialsHeading || 'Voice of our';
  const accent = settings?.franchiseTestimonialsAccent || 'Franchise Partners';
  const subtitle = settings?.franchiseTestimonialsSubtitle || 'Hear directly from those who are already growing with us.';
  const headingColor = settings?.franchiseTestimonialsHeadingColor;
  const subtitleColor = settings?.franchiseTestimonialsSubtitleColor;

  const testimonials = Array.isArray(settings?.franchiseTestimonialsList) && settings.franchiseTestimonialsList.length > 0
    ? settings.franchiseTestimonialsList
    : DEFAULT_FRANCHISE_TESTIMONIALS;

  return (
    <section id="franchise-testimonials" className="py-20 md:py-24 px-6 md:px-12 bg-dark-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ color: headingColor || undefined }}
          >
            {renderFormattedText(heading)}{' '}
            <span className="text-neon-pink">
              {renderFormattedText(accent)}
            </span>
          </h2>
          <p
            className="text-slate-400 text-sm md:text-base max-w-xl mx-auto"
            style={{ color: subtitleColor || undefined }}
          >
            {renderFormattedText(subtitle)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => {
            const avatarSrc = resolvePartnerAvatar(t);
            return (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-6 md:p-10 border border-white/5 relative"
              >
                <Quote className="absolute top-4 right-6 text-white/5 w-12 h-12 md:w-16 md:h-16 pointer-events-none" />
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <img
                    src={avatarSrc}
                    alt={t.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-neon-pink p-0.5 md:p-1 object-cover"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg md:text-xl">
                      {renderFormattedText(t.name)}
                    </h4>
                    <p className="text-neon-pink text-xs md:text-sm font-semibold">
                      {renderFormattedText(t.location || t.role || 'Partner')}
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-base md:text-lg italic leading-relaxed relative z-10">
                  "{renderFormattedText(t.text || t.content || '')}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
