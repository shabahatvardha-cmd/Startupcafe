import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Rocket, Play } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { renderFormattedText } from '../../utils/textFormatter';

import founderVideo from '../../assets/0726-copy(11).webm';
import workspaceVideo from '../../assets/29Video-Output-637Df63b-9B79-47E4-A862-5B5b5b23e004-1.mp4';
import logo2 from '../../assets/logo2.png';

const highlights = [
  {
    icon: <Users className="w-6 h-6 text-neon-purple" />,
    label: 'Built for\nFounders',
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-neon-blue" />,
    label: 'Designed for\nGrowth',
  },
  {
    icon: <Rocket className="w-6 h-6 text-neon-pink" />,
    label: 'Focused on\nImpact',
  },
];

function getEmbedVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

export default function FounderMessage() {
  const { settings } = useSettings();
  const [playing, setPlaying] = useState(false);
  const [detectedAspect, setDetectedAspect] = useState(null);
  const videoRef = useRef(null);

  // Video source resolution:
  // 'default'   -> original webm founder video
  // 'workspace' -> 29Video MP4 pitch by Arun
  // 'custom'    -> settings.founderVideoUrl (uploaded dataUrl / external URL)
  let activeVideoSrc = founderVideo;
  if (settings?.founderVideoSource === 'workspace') {
    activeVideoSrc = workspaceVideo;
  } else if (settings?.founderVideoSource === 'custom' && settings?.founderVideoUrl) {
    activeVideoSrc = settings.founderVideoUrl;
  }

  const embedUrl = typeof activeVideoSrc === 'string' ? getEmbedVideoUrl(activeVideoSrc) : null;

  // Aspect ratio resolution:
  // Configured in settings: 'auto', '9:16', '16:9', '4:3', '1:1'
  const configRatio = settings?.founderVideoAspectRatio || 'auto';

  const effectiveRatio = (() => {
    if (configRatio && configRatio !== 'auto') {
      return configRatio;
    }
    if (detectedAspect) {
      return detectedAspect;
    }
    // Automatic inference based on source type / link:
    if (settings?.founderVideoSource === 'workspace') {
      return '16:9'; // Commercial pitch presentation is landscape
    }
    if (typeof activeVideoSrc === 'string') {
      if (activeVideoSrc.includes('/shorts/')) {
        return '9:16';
      }
      if (
        activeVideoSrc.includes('youtube.com') ||
        activeVideoSrc.includes('youtu.be') ||
        activeVideoSrc.includes('vimeo.com')
      ) {
        return '16:9';
      }
    }
    // Default fallback: 9:16 phone frame
    return '9:16';
  })();

  const handleLoadedMetadata = (e) => {
    const video = e.target;
    if (video && video.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight;
      if (ratio > 1.35) {
        setDetectedAspect('16:9');
      } else if (ratio < 0.75) {
        setDetectedAspect('9:16');
      } else if (ratio >= 0.9 && ratio <= 1.1) {
        setDetectedAspect('1:1');
      } else {
        setDetectedAspect('4:3');
      }
    }
  };

  useEffect(() => {
    setPlaying(false);
    setDetectedAspect(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeVideoSrc]);

  const handlePlay = () => {
    setPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Video playback error:", err);
      });
    }
  };

  // Dynamic frame styles based on effective aspect ratio
  const isLandscape = effectiveRatio === '16:9';
  const isSquare = effectiveRatio === '1:1';
  const isStandard = effectiveRatio === '4:3';

  // Curvature (radius) map supporting both string IDs and numeric values
  const RADIUS_MAP = {
    none: 0,
    '0': 0,
    square: 0,
    medium: 20,
    '20': 20,
    rounded: 20,
    default: 48,
    '48': 48,
    pill: 56,
    '56': 56,
    max: 56,
  };

  const rawRadiusSetting = settings?.founderVideoRadius;
  let customRadius = null;
  if (rawRadiusSetting !== undefined && rawRadiusSetting !== null && rawRadiusSetting !== '' && rawRadiusSetting !== 'default') {
    if (RADIUS_MAP[rawRadiusSetting] !== undefined) {
      customRadius = RADIUS_MAP[rawRadiusSetting];
    } else {
      const parsed = Number(rawRadiusSetting);
      if (!isNaN(parsed)) {
        customRadius = parsed;
      }
    }
  }

  const defaultOuterRadius = isLandscape ? 34 : isSquare ? 36 : isStandard ? 32 : 48;
  const defaultInnerRadius = isLandscape ? 24 : isSquare ? 26 : isStandard ? 24 : 40;

  const outerBorderRadius = customRadius !== null
    ? customRadius
    : defaultOuterRadius;

  const innerBorderRadius = customRadius !== null
    ? (customRadius === 0 ? 0 : Math.max(0, customRadius - 8))
    : defaultInnerRadius;

  // Custom border thickness (bezel width) in pixels:
  let customBorderWidth = null;
  const rawBorderWidth = settings?.founderVideoBorderWidth;
  if (rawBorderWidth !== undefined && rawBorderWidth !== null && rawBorderWidth !== '' && rawBorderWidth !== 'default') {
    const parsed = Number(rawBorderWidth);
    if (!isNaN(parsed)) {
      customBorderWidth = parsed;
    }
  }
  const bezelBorderWidth = customBorderWidth !== null ? customBorderWidth : 4;

  // Custom border color
  const bezelBorderColor = settings?.founderVideoBorderColor || undefined;

  const outerFrameClass = isLandscape
    ? 'relative w-full max-w-xl p-3 sm:p-4 rounded-[32px] sm:rounded-[36px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all duration-300'
    : isStandard
      ? 'relative w-full max-w-lg p-3 sm:p-4 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all duration-300'
      : isSquare
        ? 'relative w-full max-w-[360px] sm:max-w-[400px] p-3 sm:p-4 rounded-[36px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all duration-300'
        : 'relative p-4 rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all duration-300';

  const innerScreenClass = isLandscape
    ? 'relative w-full aspect-[16/9] bg-black rounded-[22px] sm:rounded-[26px] overflow-hidden border-4 border-slate-800'
    : isStandard
      ? 'relative w-full aspect-[4/3] bg-black rounded-[24px] overflow-hidden border-4 border-slate-800'
      : isSquare
        ? 'relative w-full aspect-square bg-black rounded-[26px] overflow-hidden border-4 border-slate-800'
        : 'relative w-[280px] sm:w-[310px] aspect-[9/16] bg-black rounded-[32px] overflow-hidden border-4 border-slate-800';

  return (
    <section
      id="founder-message"
      className="py-20 px-6 md:px-12 relative z-10 overflow-hidden bg-dark-bg"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT: Phone / Widescreen Video Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div
            className={outerFrameClass}
            style={{
              borderRadius: `${outerBorderRadius}px`,
            }}
          >
            <div
              className={innerScreenClass}
              style={{
                borderRadius: `${innerBorderRadius}px`,
                borderWidth: `${bezelBorderWidth}px`,
                borderStyle: bezelBorderWidth > 0 ? 'solid' : 'none',
                borderColor: bezelBorderColor || undefined,
              }}
            >

              <div className="relative w-full h-full group overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={playing ? `${embedUrl}?autoplay=1&rel=0` : `${embedUrl}?autoplay=0&rel=0`}
                    title="Founder Video"
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={typeof activeVideoSrc === 'string' ? activeVideoSrc : 'internal'}
                    ref={videoRef}
                    src={activeVideoSrc}
                    className="w-full h-full object-cover"
                    controls={playing}
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                  />
                )}

                {/* 
                  ★ Startup Cafe Logo Badge (Watermark Cover) ★
                  - Always visible (opacity-100)
                  - Positioned at bottom-11 right-3 above video controls bar so Fullscreen & Mute buttons render clearly
                */}
                <div className="absolute bottom-11 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#090a0f]/95 border border-white/20 shadow-2xl backdrop-blur-md pointer-events-none">
                  <img src={logo2} alt="Startup Cafe" className="h-5 sm:h-6 w-auto object-contain" />
                </div>

                {!playing && (
                  <div
                    className="absolute inset-0 flex flex-col justify-between p-6 bg-black/40 cursor-pointer z-10"
                    onClick={handlePlay}
                  >
                    {/* Neon overlay logo */}
                    <div className="text-white font-bold tracking-widest text-xs flex flex-col">
                      <span className="text-neon-pink">STARTUP</span>
                      <span className="text-white">CAFE</span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration Bar Mockup */}
                    <div className="w-full flex flex-col gap-2 mt-auto">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-[15%] h-full bg-neon-pink rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/70">
                        <span>0:18 / 1:24</span>
                        <div className="flex gap-2">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11 1l-1.41 1.41c1.5 1.5 1.5 3.9 0 5.4l1.41 1.41c2.25-2.25 2.25-5.9 0-8.22z" /></svg>
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Text Content */}
        <div className="flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-semibold tracking-wider uppercase">
              {renderFormattedText(settings?.founderBadge || "Founder's Message")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
          >
            {renderFormattedText(settings?.founderHeading || 'Why')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
              {renderFormattedText(settings?.founderAccent || 'Startup Cafe')}
            </span>{' '}
            {renderFormattedText(settings?.founderSuffix !== undefined ? settings.founderSuffix : 'Matters')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg"
          >
            {renderFormattedText(settings?.founderDescription || 'Startup Cafe was born from a simple belief – that great ideas can come from anywhere, but they need the right environment to grow.')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-slate-400"
          >
            {renderFormattedText(settings?.founderSubtext || 'In this short message, our founder shares the vision, the mission, and why this space is built for dreamers, doers, and disruptors.')}
          </motion.p>

          {/* Highlights Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 my-4"
          >
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="p-3 rounded-full bg-white/5">
                  {h.icon}
                </div>
                <span className="text-white text-xs font-semibold leading-tight whitespace-pre-line">
                  {h.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 mt-2"
          >
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neon-blue/20"
            >
              Book a Seat Today
            </a>
            <span className="text-slate-500 font-medium">or</span>
            <a
              href="#contact"
              className="text-neon-blue hover:text-neon-pink transition-colors font-bold underline underline-offset-4 decoration-neon-blue/30 hover:decoration-neon-pink"
            >
              Schedule a Visit
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
