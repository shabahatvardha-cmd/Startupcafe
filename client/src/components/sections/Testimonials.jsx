import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import sanyaImg from '../../assets/sanya.png';
import rohanImg from '../../assets/rohan.png';
import arjunImg from '../../assets/arjun.png';
import { useSettings, DEFAULT_TESTIMONIALS } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

const DEFAULT_AVATARS = {
  rohan: rohanImg,
  sanya: sanyaImg,
  arjun: arjunImg,
};

export default function Testimonials() {
  const { settings } = useSettings();
  const {
    testimonialsHeading = 'What Co-Works',
    testimonialsAccent = 'Say',
    testimonialsHeadingColor,
    testimonialsTextColor,
    testimonialsList,
  } = settings || {};

  const activeTestimonials = (Array.isArray(testimonialsList) && testimonialsList.length > 0)
    ? testimonialsList
    : DEFAULT_TESTIMONIALS;

  const [index, setIndex] = useState(0);

  // Protect safe index within range
  const safeIndex = index >= activeTestimonials.length ? 0 : index;
  const current = activeTestimonials[safeIndex] || activeTestimonials[0];

  const next = () => setIndex((prev) => (prev + 1) % activeTestimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);

  useEffect(() => {
    if (activeTestimonials.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [activeTestimonials.length]);

  const getAvatar = (item) => {
    if (item.avatarUrl) return item.avatarUrl;
    if (item.avatarKey && DEFAULT_AVATARS[item.avatarKey]) return DEFAULT_AVATARS[item.avatarKey];
    if (item.image) return item.image;
    if (item.id === 'rohan-verma') return rohanImg;
    if (item.id === 'sanya-sharma') return sanyaImg;
    if (item.id === 'arjun-desai') return arjunImg;
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'SC';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarSrc = getAvatar(current);
  const rating = typeof current.rating === 'number' ? current.rating : 5;

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 relative z-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-16"
          style={{ color: testimonialsHeadingColor || undefined }}
        >
          {renderFormattedText(testimonialsHeading || 'What Co-Works')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
            {renderFormattedText(testimonialsAccent || 'Say')}
          </span>
        </motion.h2>

        <div className="relative min-h-[270px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || safeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              {/* Optional Star Rating */}
              {rating > 0 && (
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                  ))}
                </div>
              )}

              <Quote className="mx-auto text-neon-blue/40 w-16 h-16 mb-4" />

              <p
                className="text-xl md:text-2xl text-slate-200 font-light italic max-w-2xl mx-auto leading-relaxed mb-8"
                style={{ color: testimonialsTextColor || undefined }}
              >
                "{renderFormattedText(current.content || '')}"
              </p>

              <div className="flex items-center justify-center gap-4">
                {avatarSrc ? (
                  <img 
                    src={avatarSrc} 
                    alt={current.name} 
                    className="w-14 h-14 rounded-full border-2 border-neon-purple object-cover shadow-[0_0_15px_rgba(176,38,255,0.3)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-2 border-neon-purple bg-gradient-to-br from-neon-purple/40 to-neon-blue/40 text-white font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(176,38,255,0.3)] select-none">
                    {getInitials(current.name)}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="text-white font-semibold">{renderFormattedText(current.name)}</h4>
                  {current.role && <p className="text-xs text-slate-400 mt-0.5">{renderFormattedText(current.role)}</p>}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {activeTestimonials.length > 1 && (
            <>
              <button 
                onClick={prev} 
                className="absolute left-0 md:-left-12 p-3 rounded-full glass-card border border-white/10 hover:bg-white/10 transition text-white z-10 hidden sm:block cursor-pointer"
                title="Previous Review"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={next} 
                className="absolute right-0 md:-right-12 p-3 rounded-full glass-card border border-white/10 hover:bg-white/10 transition text-white z-10 hidden sm:block cursor-pointer"
                title="Next Review"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {activeTestimonials.length > 1 && (
          <div className="flex justify-center gap-3 mt-12 sm:mt-8">
            {activeTestimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  i === safeIndex ? 'bg-neon-blue w-8' : 'bg-white/20 hover:bg-white/40 w-3'
                }`}
                title={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
