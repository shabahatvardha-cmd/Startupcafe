import { motion } from 'framer-motion';
import { Network, MapPin, Award } from 'lucide-react';

export default function CredibilityHighlights() {
  return (
    <section className="py-12 md:py-16 px-6 md:px-12 bg-dark-bg relative overflow-hidden">
      {/* Soft ambient lighting backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative max-w-7xl mx-auto z-10"
      >
        {/* Subtle cyan -> purple -> pink outer gradient border glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 rounded-3xl blur-[6px] pointer-events-none"></div>

        {/* Container body */}
        <div className="relative rounded-3xl bg-[#070709]/85 backdrop-blur-2xl border border-white/5 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          
          {/* COLUMN 1 */}
          <div className="relative p-8 md:p-12 flex flex-col items-start justify-center border-b border-white/5 md:border-b-0 md:border-r border-white/5 overflow-hidden group hover:bg-white/[0.01] transition-all duration-300">
            {/* Small cyan outlined icon container */}
            <div className="mb-6 p-3 bg-neon-blue/5 border border-neon-blue/30 rounded-xl text-neon-blue w-fit group-hover:scale-110 group-hover:bg-neon-blue/10 transition-all duration-300">
              <Network className="w-6 h-6" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-[85%]">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight font-sans">
                10+ Years of Startup Network
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                A decade of building India's strongest startup ecosystem.
              </p>
            </div>
            
            {/* Background Number */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105">
              <span 
                className="text-8xl md:text-9xl font-black font-sans leading-none block text-transparent"
                style={{
                  WebkitTextStroke: '1.5px var(--color-neon-blue)',
                  opacity: 0.07
                }}
              >
                01
              </span>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="relative p-8 md:p-12 flex flex-col items-start justify-center border-b border-white/5 md:border-b-0 md:border-r border-white/5 overflow-hidden group hover:bg-white/[0.01] transition-all duration-300">
            {/* Small purple outlined icon container */}
            <div className="mb-6 p-3 bg-neon-purple/5 border border-neon-purple/30 rounded-xl text-neon-purple w-fit group-hover:scale-110 group-hover:bg-neon-purple/10 transition-all duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-[85%]">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight font-sans">
                First Co-working Space of Eastern UP
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Pioneering the coworking culture in Eastern Uttar Pradesh.
              </p>
            </div>
            
            {/* Background Number */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105">
              <span 
                className="text-8xl md:text-9xl font-black font-sans leading-none block text-transparent"
                style={{
                  WebkitTextStroke: '1.5px var(--color-neon-purple)',
                  opacity: 0.07
                }}
              >
                02
              </span>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="relative p-8 md:p-12 flex flex-col items-start justify-center overflow-hidden group hover:bg-white/[0.01] transition-all duration-300">
            {/* Small pink outlined icon container */}
            <div className="mb-6 p-3 bg-neon-pink/5 border border-neon-pink/30 rounded-xl text-neon-pink w-fit group-hover:scale-110 group-hover:bg-neon-pink/10 transition-all duration-300">
              <Award className="w-6 h-6" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-[85%]">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight font-sans">
                Acknowledged by Startup Leaders & Media
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Recognized by Startup Leaders, Central Ministers, Cabinet Ministers and leading News Media.
              </p>
            </div>
            
            {/* Background Number */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105">
              <span 
                className="text-8xl md:text-9xl font-black font-sans leading-none block text-transparent"
                style={{
                  WebkitTextStroke: '1.5px var(--color-neon-pink)',
                  opacity: 0.07
                }}
              >
                03
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
