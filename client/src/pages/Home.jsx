import { useState } from 'react';
import Hero from '../components/sections/Hero';
import PartnerLogos from '../components/sections/PartnerLogos';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Amenities from '../components/sections/Amenities';
import PressCoverage from '../components/sections/PressCoverage';
import Pricing from '../components/sections/Pricing';
import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import { useSettings } from '../context/SettingsContext';

export default function Home() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { settings } = useSettings();

  const handleBookingSelect = (bookingInfo) => {
    setSelectedBooking(bookingInfo);
  };

  return (
    <div className="pt-0">
      <Hero />
      {settings?.showAcknowledgedOnHome !== false && <PartnerLogos hasBorder={true} />}
      <About />
      <Services />
      {/* Amenities hidden by default from website, fully manageable and toggleable from Admin Panel */}
      {settings?.showAmenities === true && <Amenities />}
      <PressCoverage />
      <Pricing onSelectBooking={handleBookingSelect} />
      <Gallery />
      <Testimonials />
      <Contact selectedBooking={selectedBooking} />
      <PartnerLogos />
    </div>
  );
}
