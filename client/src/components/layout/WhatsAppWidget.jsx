import { motion } from 'framer-motion';
import WhatsAppIcon from './WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';

export default function WhatsAppWidget({ 
  phoneNumber, 
  message 
}) {
  const { settings } = useSettings();
  const activePhone = phoneNumber || settings?.contactWhatsappNumber || "919670111167";
  const activeMessage = message || settings?.contactWhatsappInquiryMessage || "Hello Startup Cafe! I'm reaching out from your website to make an inquiry.";
  const cleanPhone = activePhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(activeMessage)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: 0.5 
      }}
      className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center select-none"
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.12, rotate: 3 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.7)] transition-shadow duration-300"
      >
        {/* Subtle pulsing background glow ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-pulse group-hover:opacity-50 transition-opacity" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 relative z-10 drop-shadow-md" />

        {/* Red Notification Badge */}
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.8 }}
          className="absolute -top-1 -right-1 z-20 flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-md border-2 border-[#0B0F17]"
        >
          {/* Animated ping ring behind red badge */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
          <span className="relative">1</span>
        </motion.span>

        {/* Tooltip on hover */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-medium whitespace-nowrap backdrop-blur-md border border-slate-700/50 shadow-xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </motion.a>
    </motion.div>
  );
}
