import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

// Automatically import all .jpeg images from the gallery folder
const imageModules = import.meta.glob('../../assets/gallery/*.jpeg', { eager: true, import: 'default' });

// Sort images numerically based on filename (e.g., 1.jpeg, 2.jpeg... 10.jpeg)
const images = Object.keys(imageModules)
  .sort((a, b) => {
    const matchA = a.match(/(\d+)\.jpeg$/);
    const matchB = b.match(/(\d+)\.jpeg$/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  })
  .map(key => imageModules[key]);

export default function Gallery() {
  const { settings } = useSettings();

  const heading = settings?.galleryHeading || 'Inside';
  const accent = settings?.galleryAccent || 'Startup Cafe';
  const description = settings?.galleryDescription || '';
  const badgeLabel = settings?.galleryBadge || 'Workspace View';
  const initialCount = Number(settings?.galleryInitialCount) || 6;
  const customImages = Array.isArray(settings?.customGalleryImages) ? settings.customGalleryImages : [];

  // Combine original local gallery images with any custom uploaded images
  const allImages = [
    ...images.map((img) => ({ url: img, caption: badgeLabel })),
    ...customImages.map((img) => ({
      url: typeof img === 'string' ? img : img?.url,
      caption: (typeof img === 'object' && img?.title) ? img.title : badgeLabel,
    })).filter((item) => Boolean(item.url)),
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleImages = showAll ? allImages : allImages.slice(0, initialCount);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto relative z-10" onKeyDown={handleKeyDown}>
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {renderFormattedText(heading)}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink">
            {renderFormattedText(accent)}
          </span>
        </motion.h2>
        {description && (
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            {renderFormattedText(description)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {visibleImages.map((item, index) => (
            <motion.div
              key={item.url + index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.6 }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer aspect-video ${!showAll && index >= 4 ? 'hidden md:block' : ''}`}
              onClick={() => setSelectedImage(item.url)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img 
                src={item.url} 
                alt={item.caption || "Workspace"} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Overlay Zoom Icon */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-bg/20 backdrop-blur-[2px]">
                <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
              </div>

              <div className="absolute bottom-6 left-6 z-30 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/20">
                  {renderFormattedText(item.caption)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {allImages.length > initialCount && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-pink text-white transition-all font-medium group"
          >
            {showAll ? 'Show Less' : `View All (${allImages.length} Photos)`}
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-neon-pink group-hover:translate-y-1 ${showAll ? 'rotate-180 group-hover:-translate-y-1' : ''}`} />
          </button>
        </div>
      )}

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 backdrop-blur-md cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={selectedImage}
              alt="Full Page Workspace"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative z-40"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
