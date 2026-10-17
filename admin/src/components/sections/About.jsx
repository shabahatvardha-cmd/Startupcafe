import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';
import aboutImg from '../../assets/about_workspace.png';

export default function About() {
  const { settings } = useSettings();
  const {
    aboutHeading = 'More than just',
    aboutAccent = 'desk.',
    aboutDescription1 = "Startup Cafe was born from a vision to bring Silicon Valley's collaborative ecosystem to our community. We provide founders, freelancers, and growing teams with a premium, focused space that drives innovation forward.",
    aboutDescription2 = "Here, you don't just rent an office. You join a community of driven individuals reshaping the tech landscape.",
    accentColor = '#b026ff',
    gradientStart = '#ff2975',
    aboutHeadingColor,
    aboutDescriptionColor,
    aboutImage,
    aboutStat1Value = '500+',
    aboutStat1Label = 'Trusted Members',
    aboutStat2Value = '9-7',
    aboutStat2Label = 'Access',
    aboutStat3Value = '100+',
    aboutStat3Label = 'Dedicated Desk',
  } = settings || {};

  const displayImage = (aboutImage && typeof aboutImage === 'string' && aboutImage.trim()) ? aboutImage : aboutImg;

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue blur-3xl opacity-20 transform -rotate-6 rounded-full"></div>
          <img 
            src={displayImage}
            alt="Collab" 
            className="rounded-3xl border border-white/10 relative z-10 w-full object-cover"
          />
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ color: aboutHeadingColor || undefined }}
          >
            {renderFormattedText(aboutHeading)}{' '}
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColor}, ${gradientStart})`
              }}
            >
              {renderFormattedText(aboutAccent)}
            </span>
          </h2>
          <p 
            className="text-slate-300 text-lg mb-6 leading-relaxed"
            style={{ color: aboutDescriptionColor || undefined }}
          >
            {renderFormattedText(aboutDescription1)}
          </p>
          <p 
            className="text-slate-300 text-lg mb-8 leading-relaxed"
            style={{ color: aboutDescriptionColor || undefined }}
          >
            {renderFormattedText(aboutDescription2)}
          </p>
          <div className="flex gap-8">
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">
                {renderFormattedText(aboutStat1Value)}
              </h4>
              <p className="text-neon-blue text-sm">
                {renderFormattedText(aboutStat1Label)}
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">
                {renderFormattedText(aboutStat2Value)}
              </h4>
              <p className="text-neon-pink text-sm">
                {renderFormattedText(aboutStat2Label)}
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">
                {renderFormattedText(aboutStat3Value)}
              </h4>
              <p className="text-neon-purple text-sm">
                {renderFormattedText(aboutStat3Label)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
