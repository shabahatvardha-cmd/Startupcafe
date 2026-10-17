import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { getPartnerLogoSrc, DEFAULT_ECOSYSTEM_PARTNERS } from './ecosystemConstants';
import { renderFormattedText } from '../../utils/textFormatter';

export default function LogoCarousel() {
  const { settings } = useSettings();

  const badge = settings?.ecosystemBadge || 'Ecosystem & Recognition';
  const heading = settings?.ecosystemHeading || 'Recognized &';
  const accent = settings?.ecosystemAccent || 'Trusted Ecosystem';
  const description = settings?.ecosystemDescription || 'Startup Cafe is proud to be acknowledged by key Government bodies and associated with top media and industry networks.';

  const partners = Array.isArray(settings?.ecosystemPartnersList) && settings.ecosystemPartnersList.length > 0
    ? settings.ecosystemPartnersList
    : DEFAULT_ECOSYSTEM_PARTNERS;

  // Ensure seamless marquee animation by repeating items
  const scrollItems = partners.length < 6
    ? [...partners, ...partners, ...partners, ...partners]
    : [...partners, ...partners];

  return (
    <section className="py-12 md:py-16 bg-dark-bg relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-neon-blue uppercase border border-neon-blue/30 rounded-full bg-neon-blue/10 backdrop-blur-md">
            {renderFormattedText(badge)}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            {renderFormattedText(heading)}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue">
              {renderFormattedText(accent)}
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {renderFormattedText(description)}
          </p>
        </div>

        {/* Carousel Container with Faded Edges */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-bg to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-bg to-transparent z-20 pointer-events-none"></div>

          <div className="flex animate-marquee gap-8 py-6">
            {scrollItems.map((item, idx) => {
              const imgSrc = getPartnerLogoSrc(item);
              return (
                <div
                  key={`${item.id || idx}-${idx}`}
                  className={`w-64 h-56 flex flex-col justify-between items-center p-4 rounded-3xl bg-[#09090b]/40 border backdrop-blur-md transition-all duration-300 group hover:scale-[1.02] hover:bg-[#0c0c0f]/60 select-none ${
                    item.isGov
                      ? 'border-neon-blue/20 hover:border-neon-blue/50'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="w-full flex justify-center h-6 items-center">
                    {item.isGov ? (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2 py-0.5 rounded-md">
                        {renderFormattedText(item.badge || 'Acknowledged by')}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-300">
                        {renderFormattedText(item.badge || 'Associated with')}
                      </span>
                    )}
                  </div>

                  {/* Circular Logo Image Container */}
                  <div className="w-24 h-24 rounded-full bg-white/95 p-1 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={imgSrc}
                      alt={item.name || 'Partner Logo'}
                      className="w-full h-full rounded-full object-cover pointer-events-none"
                    />
                  </div>

                  {/* Footer Name */}
                  <div className="w-full text-center">
                    <p className="text-xs md:text-sm font-semibold text-slate-200 truncate px-2 group-hover:text-white transition-colors">
                      {renderFormattedText(item.name || 'Partner Name')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
