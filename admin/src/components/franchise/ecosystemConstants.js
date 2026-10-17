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

export const LOGO_PRESETS = [
  { id: 'logo1', name: 'Ministry of Commerce & Industry', src: logo1 },
  { id: 'logo8', name: 'YourStory Media', src: logo8 },
  { id: 'logo2', name: 'IIT Kanpur (SIIC)', src: logo2 },
  { id: 'logo12', name: 'KPMG India', src: logo12 },
  { id: 'logo3', name: 'Make in India', src: logo3 },
  { id: 'logo9', name: 'Inc42 Media', src: logo9 },
  { id: 'logo5', name: 'Startup India', src: logo5 },
  { id: 'logo6', name: 'NITI Aayog', src: logo6 },
  { id: 'logo10', name: 'News Corp', src: logo10 },
  { id: 'logo7', name: 'Jagriti Yatra', src: logo7 },
  { id: 'logo11', name: 'CII India', src: logo11 },
  { id: 'logo13', name: 'IIM Lucknow', src: logo13 },
];

export const LOGO_PRESETS_MAP = LOGO_PRESETS.reduce((acc, curr) => {
  acc[curr.id] = curr.src;
  return acc;
}, {});

export const DEFAULT_ECOSYSTEM_PARTNERS = [
  { id: 'partner-1', logoKey: 'logo1', imageUrl: '', name: 'Ministry of Commerce & Industry', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-2', logoKey: 'logo8', imageUrl: '', name: 'YourStory Media', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-3', logoKey: 'logo2', imageUrl: '', name: 'IIT Kanpur (SIIC)', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-4', logoKey: 'logo12', imageUrl: '', name: 'KPMG India', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-5', logoKey: 'logo3', imageUrl: '', name: 'Make in India', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-6', logoKey: 'logo9', imageUrl: '', name: 'Inc42 Media', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-7', logoKey: 'logo5', imageUrl: '', name: 'Startup India', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-8', logoKey: 'logo6', imageUrl: '', name: 'NITI Aayog', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-9', logoKey: 'logo10', imageUrl: '', name: 'News Corp', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-10', logoKey: 'logo7', imageUrl: '', name: 'Jagriti Yatra', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-11', logoKey: 'logo11', imageUrl: '', name: 'CII India', isGov: true, badge: 'Acknowledged by' },
  { id: 'partner-12', logoKey: 'logo13', imageUrl: '', name: 'IIM Lucknow', isGov: true, badge: 'Acknowledged by' },
];

export function getPartnerLogoSrc(partner) {
  if (!partner) return logo1;
  if (partner.imageUrl && typeof partner.imageUrl === 'string' && partner.imageUrl.trim()) {
    return partner.imageUrl.trim();
  }
  if (partner.image && typeof partner.image === 'string' && partner.image.trim()) {
    return partner.image.trim();
  }
  if (partner.logoKey && LOGO_PRESETS_MAP[partner.logoKey]) {
    return LOGO_PRESETS_MAP[partner.logoKey];
  }
  return logo1;
}
