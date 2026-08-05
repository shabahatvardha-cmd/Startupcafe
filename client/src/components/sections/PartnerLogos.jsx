import React from 'react';
import logo1 from '../../assets/logos/cropped_circle_image.png';
import logo2 from '../../assets/logos/cropped_circle_image (2).png';
import logo3 from '../../assets/logos/cropped_circle_image (3).png';
import logo5 from '../../assets/logos/cropped_circle_image (5).png';
import logo6 from '../../assets/logos/cropped_circle_image (6).png';
import logo7 from '../../assets/logos/cropped_circle_image (7).png';
import logo8 from '../../assets/logos/cropped_circle_image (8).png';
import logo9 from '../../assets/logos/cropped_circle_image (9).png';
import logo10 from '../../assets/logos/cropped_circle_image (10).png';
import logo11 from '../../assets/logos/cropped_circle_image (11).png';
import logo12 from '../../assets/logos/cropped_circle_image (12).png';
import logo13 from '../../assets/logos/cropped_circle_image copy.png';

const logos = [
  { src: logo13, alt: "IIM Lucknow" },
  { src: logo2, alt: "IIT Kanpur" },
  { src: logo1, alt: "Ministry of Commerce" },
  { src: logo10, alt: "Associated Chambers of Commerce" },
  { src: logo5, alt: "Startup India" },
  { src: logo3, alt: "Make in India" },
  { src: logo6, alt: "NITI Aayog" },
  { src: logo7, alt: "Jagriti Yatra" },
  { src: logo8, alt: "YourStory Media" },
  { src: logo9, alt: "Inc42" },
  { src: logo11, alt: "CII" },
  { src: logo12, alt: "KPMG" },
];

export default function PartnerLogos({ hasBorder = false }) {
  const content = (
    <div className={`flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-y-6 md:gap-y-0 ${hasBorder ? 'px-4 py-8 md:py-10 bg-[#050507]/90 rounded-[22px]' : 'py-4'}`}>
      {logos.map((logo, index) => (
        <React.Fragment key={index}>
          {/* Logo wrapper */}
          <div className="flex items-center justify-center px-4 w-1/3 sm:w-1/4 md:w-auto md:flex-1 h-10 md:h-12">
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-full max-w-full object-contain grayscale invert mix-blend-screen opacity-70 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </div>
          {/* Vertical Divider (Hidden on mobile) */}
          {index < logos.length - 1 && (
            <div className="hidden md:block w-[1px] h-8 bg-white/10 self-center"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="py-8 bg-black relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {hasBorder && (
          <div className="text-center mb-6">
            <span className="text-xs md:text-sm font-bold tracking-widest text-slate-400 uppercase">
              Acknowledged By
            </span>
          </div>
        )}
        {hasBorder ? (
          <div className="relative p-[1.5px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-3xl">
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
