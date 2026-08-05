import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ZoomIn, X, ChevronDown } from 'lucide-react';

// Vite magic: Automatically find all images in this folder at build time
// Credibility-based priority order for sorting
const credibilityOrder = [
  'N1',   // Govt - Startup India / Ministry (Suresh Prabhu tweet)
  'N3',   // Govt - Make In India Verified
  '48239714_1845855142190096_7959491405070467072_n',   // Hindustan Times national
  '78821966_10157696495700242_4296974321332518912_n',  // Dainik Jagran Chandigarh - Jagran Vishesh
  '78832274_10157696496070242_791024386265055232_n',   // Dainik Jagran Lucknow - Shree Ram edition
  '79385687_10157696495505242_1293711211174559744_n',  // Dainik Jagran New Delhi - National edition
  '79675676_10157696495450242_2565340908853657600_n',  // Dainik Jagran Gorakhpur edition
  'N2',   // Navbharat Times Sunday - Front Page story
  '117325628_3043734575735474_4426712789553836837_n',  // iNext Topline - International Youth Day Special
  '513904826_9828982527210611_4516023911331616550_n',  // VCCircle - premium financial media
  '511196241_9828982580543939_6497561737373136845_n',  // YourStory
  '512489809_9834385283337002_6705041643710896110_n',  // Dainik Jagran Lucknow - different article
  '514106810_9828982607210603_8884827876088428322_n',  // Daily News Network
  '511319697_9828982587210605_8408103758538641615_n',  // Rajasthan Patrika News Network
  '514414400_9834501546658709_5389555445225039589_n',  // Amar Ujala - Metro cities
  '514340471_9831097290332468_1208462266478007682_n',  // Amar Ujala - Industrial Policy
  '514371032_9828982643877266_2867878972913581948_n',  // Amar Ujala - Prabhu ne saraha
  '511148711_9828983690543828_1849157987430120083_n',  // iNext - Startup ko Cafe dega Raftar
  '511276149_9828982633877267_7415711151241731843_n',  // Newspaper - Hunarmandon ka Corporate Thikana
  '514323365_9828982520543945_7847505910217033037_n',  // Hindustan Times - First co-working space Gkp
  '513677509_9828982597210604_847588708771159933_n',   // Dainik Bhaskar online
  '511154936_9829038743871656_1167919058874365971_n',  // StartupMeet online
  '513933764_9829038337205030_1572199667439423908_n',  // Dailyhunt/YourStory
  '513863871_9829038570538340_3927020416893395257_n',  // UpToday UP
  '514050048_9829038370538360_3106129957928587771_n',  // Startup Stories
  '511273250_9829038607205003_4707701543895724071_n',  // GFR FinalReport social
  '513849652_9829038610538336_6971725309319097137_n',  // Patrika Gorakhpur FB
  '511316979_9829038367205027_7980695819423604436_n',  // PurvanchalLive
  '511269952_9829038590538338_3984337312992608587_n',  // NYooz Gorakhpur FB
  '511194923_9829038780538319_1138943843174704645_n',  // Mera Gorakhpur FB
  '513876583_9829038733871657_9055544073417046542_n',  // Gorakhpur Times FB
  '514042905_9826827987426065_7400867662913067041_n',  // Suresh Prabhu tweet screenshot
];

const importedMedia = import.meta.glob('../../assets/press/*.{jpg,jpeg,png,webp}', { eager: true });
const mediaItems = Object.entries(importedMedia).map(([path, module]) => ({
  url: module.default,
  fileName: path.split('/').pop().split('.')[0]
})).sort((a, b) => {
  const aOrder = credibilityOrder.indexOf(a.fileName);
  const bOrder = credibilityOrder.indexOf(b.fileName);
  // If in credibility list, use that order; otherwise push to end
  const aRank = aOrder === -1 ? 9999 : aOrder;
  const bRank = bOrder === -1 ? 9999 : bOrder;
  return aRank - bRank;
});

const displayItems = mediaItems;

// Accurate headings and captions based on actual image content
const knownImageDescriptions = {
  // --- GOVERNMENT / MINISTRY ---
  "N1": {
    title: "Startup India: Minister's Tweet of Appreciation",
    publisher: "Startup India, Govt. of India",
    excerpt: "Union Commerce and Industry Minister Shri Suresh Prabhu tweeted in appreciation of Startup Cafe as Eastern UP's first co-working space."
  },
  "N3": {
    title: "Make In India: Official Government Verification",
    publisher: "Make in India, Govt. of India",
    excerpt: "Make In India's official handle recognized Startup Cafe. Eastern UP gets its first co-working space, StartUp Cafe, in Gorakhpur."
  },
  "48239714_1845855142190096_7959491405070467072_n": {
    title: "Hindustan Times: Co-working Goes Cross-Country",
    publisher: "Hindustan Times",
    excerpt: "As start-ups sprout in non-metro cities, Hindustan Times features Startup Cafe, Gorakhpur as a pioneering example of co-working beyond metros."
  },
  "78821966_10157696495700242_4296974321332518912_n": {
    title: "Dainik Jagran: Co-working Cafe Shows New Path to Small Cities",
    publisher: "Dainik Jagran",
    excerpt: "Jagran Vishesh: Startup Cafe becomes a model for enabling business from home city, instead of migrating out for work due to lack of resources."
  },
  "78832274_10157696496070242_791024386265055232_n": {
    title: "Dainik Jagran Lucknow: Co-working Cafe Leads the Way",
    publisher: "Dainik Jagran",
    excerpt: "Jagran Vishesh: Eastern UP's first co-working space - Startup Cafe - by Arunn Guptaa, setting a benchmark for self-employment."
  },
  "79385687_10157696495505242_1293711211174559744_n": {
    title: "Dainik Jagran Delhi: Gorakhpur Cafe Puts Eastern UP on National Map",
    publisher: "Dainik Jagran",
    excerpt: "Jagran Vishesh (New Delhi Edition): Eastern UP's first co-working space gains recognition across the country for its innovative model."
  },
  "79675676_10157696495450242_2565340908853657600_n": {
    title: "Dainik Jagran Gorakhpur: Business Made Easy From Own City",
    publisher: "Dainik Jagran",
    excerpt: "Jagran Vishesh: Professionals who once had to migrate for work now launch businesses from their hometown, thanks to Startup Cafe."
  },
  "N2": {
    title: "Navbharat Times: A Corporate Home for Talented Professionals",
    publisher: "Navbharat Times (Sunday)",
    excerpt: "Gorakhpur's unique cafe offers businesses an affordable office space, air-conditioned corporate cabin at just Rs. 5,000 per month, all-inclusive."
  },
  "512489809_9834385283337002_6705041643710896110_n": {
    title: "Dainik Jagran: Fulfilled His Dream, Now Fuelling Others' Too",
    publisher: "Dainik Jagran",
    excerpt: "Youngbaz feature: How Arunn Guptaa built Startup Cafe from scratch and now helps young businessmen grow through the co-working platform."
  },
  "514340471_9831097290332468_1208462266478007682_n": {
    title: "Amar Ujala: Entrepreneur Arunn Invited to Shape Industrial Policy",
    publisher: "Amar Ujala",
    excerpt: "Startup Cafe founder Arunn Kumar was invited to the Stakeholder Consultation on Industrial Policy - his co-working model gained national attention."
  },
  "513904826_9828982527210611_4516023911331616550_n": {
    title: "VCCircle: Starting Up in Gorakhpur? Eastern UP's First Co-Working Space",
    publisher: "VCCircle (News Corp)",
    excerpt: "Arunn Guptaa launched the 50-seater StartUp Cafe at Vijay Chowk, drawing praise from ministers, tycoons, and media honchos alike."
  },
  "511196241_9828982580543939_6497561737373136845_n": {
    title: "YourStory: Co-working Gives Entrepreneurs the Freedom to Work",
    publisher: "YourStory",
    excerpt: "Arunn Guptaa, Founder of StartUp Cafe: 'It lets people work at their own pace. It gives you freedom within a work set-up.'"
  },
  "117325628_3043734575735474_4426712789553836837_n": {
    title: "iNext: Found a Career Path by Empowering Others",
    publisher: "iNext (International Youth Day Special)",
    excerpt: "Young Businessman's Platform: Arunn Guptaa understood employment gaps and built Startup Cafe as a new platform for Gorakhpur's youth."
  },
  "511148711_9828983690543828_1849157987430120083_n": {
    title: "iNext: Cafe to Accelerate New Business Startups in the Region",
    publisher: "iNext Gorakhpur",
    excerpt: "New entrepreneurs won't need to spend on basic infrastructure. Minister Suresh Prabhu acknowledged this as a game-changer for the region."
  },
  "511276149_9828982633877267_7415711151241731843_n": {
    title: "Newspaper: Affordable Corporate Hub for Skilled Professionals",
    publisher: "Newspaper (Pahal, Front Page)",
    excerpt: "Gorakhpur's unique cafeteria gives businesses a cheap office space. Praise pouring in from across India and abroad for the concept."
  },
  "511319697_9828982587210605_8408103758538641615_n": {
    title: "Rajasthan Patrika: Minister Impressed by Gorakhpur's Youth Startup",
    publisher: "Rajasthan Patrika",
    excerpt: "Two youth from Gorakhpur providing co-working space for professionals across eastern UP. Commerce Minister Suresh Prabhu praised the initiative."
  },
  "514414400_9834501546658709_5389555445225039589_n": {
    title: "Amar Ujala: Metro Entrepreneurs Shifting Business to Gorakhpur",
    publisher: "Amar Ujala",
    excerpt: "A young entrepreneur's initiative pays off. After the co-working space opened, two BPOs shifted from Delhi and Chennai to Gorakhpur."
  },
  "514371032_9828982643877266_2867878972913581948_n": {
    title: "Amar Ujala: Union Minister Suresh Prabhu Praises Arunn's Idea",
    publisher: "Amar Ujala",
    excerpt: "Gorakhpur youth opened Startup Cafe and Union Minister Suresh Prabhu shared the story on Twitter, bringing national spotlight to the venture."
  },
  "514106810_9828982607210603_8884827876088428322_n": {
    title: "Daily News: StartUp Cafe Officially Established in Gorakhpur",
    publisher: "Daily News Network",
    excerpt: "Union Minister Suresh Prabhu praised the young entrepreneur behind this initiative. Rs. 400 million investment is projected over five years."
  },
  "514323365_9828982520543945_7847505910217033037_n": {
    title: "Hindustan Times Lucknow: First Co-Working Space Opens in Gorakhpur",
    publisher: "Hindustan Times",
    excerpt: "StartUp Cafe, first of its kind in Eastern UP, has drawn plaudits from ministers, tycoons and media honchos for enabling startup culture."
  },
  "513677509_9828982597210604_847588708771159933_n": {
    title: "Dainik Bhaskar: First Co-Working Space Opens in CM's City",
    publisher: "Dainik Bhaskar Online",
    excerpt: "Startup Cafe is built for those who want to work but cannot because they don't have their own office. Affordable and fully equipped."
  },
  "511154936_9829038743871656_1167919058874365971_n": {
    title: "StartupMeet: Affordable Workspace for Gorakhpur Entrepreneurs",
    publisher: "StartupMeet",
    excerpt: "Arunn Guptaa launched StartUp Cafe, Eastern UP's first co-working space, offering workspace at an affordable Rs. 4,999 per month plan."
  },
  "513933764_9829038337205030_1572199667439423908_n": {
    title: "Dailyhunt: Two Friends Launch Eastern UP's First Co-Working Hub",
    publisher: "Dailyhunt",
    excerpt: "To boost the startup ecosystem in Eastern UP, Arunn and Vibhore launched the first co-working space. Industry estimates \ annual investment potential."
  },
  "513863871_9829038570538340_3927020416893395257_n": {
    title: "UpToday: Co-working Spaces Emerging as Startup Growth Hubs in UP",
    publisher: "UpToday",
    excerpt: "With the startup boom, co-working spaces are soon emerging as the growth hub of the startup ecosystem across eastern Uttar Pradesh."
  },
  "514050048_9829038370538360_3106129957928587771_n": {
    title: "Startup Stories: From India's Chicago to Co-Working Pioneer",
    publisher: "Startup Stories",
    excerpt: "Gorakhpur, once dubbed India's Chicago, turns a new corner as StartUp Cafe opens its first-ever co-working space in the city."
  },
  "511273250_9829038607205003_4707701543895724071_n": {
    title: "Gorakhpur Final Report: Minister's Tweet Puts Startup Cafe on the Map",
    publisher: "Gorakhpur Final Report",
    excerpt: "Union Minister Suresh Prabhu tweeted about Startup Cafe, bringing it national fame, while Make in India also recognised the initiative."
  },
  "513849652_9829038610538336_6971725309319097137_n": {
    title: "Patrika Gorakhpur: Youth Startup Wins Over Multiple Ministers",
    publisher: "Patrika Gorakhpur",
    excerpt: "Two Gorakhpur youth providing co-working space for professionals across eastern UP. Appreciated by Minister Suresh Prabhu and several others."
  },
  "511316979_9829038367205027_7980695819423604436_n": {
    title: "Purvanchal Live: Modi's Minister Approves the Co-Working Idea",
    publisher: "Purvanchal Live",
    excerpt: "Arunn Guptaa established Eastern UP's first co-working space in Gorakhpur, with the idea receiving appreciation from Union Minister Suresh Prabhu."
  },
  "511269952_9829038590538338_3984337312992608587_n": {
    title: "NYooz Gorakhpur: UP's First Co-Working Cafe Opens in CM Yogi's City",
    publisher: "NYooz Gorakhpur",
    excerpt: "Startup Cafe provides all essentials under one roof, things that professionals couldn't find elsewhere even at a much higher price."
  },
  "511194923_9829038780538319_1138943843174704645_n": {
    title: "Mera Gorakhpur: Startup Cafe Goes National, Country Takes Notice",
    publisher: "Mera Gorakhpur",
    excerpt: "Gorakhpur's first co-working space gains national attention after Suresh Prabhu's endorsement. 775 reactions in just the first few days."
  },
  "513876583_9829038733871657_9055544073417046542_n": {
    title: "Gorakhpur Times: Vijay Chowk Startup Cafe, A Blessing for Regional Youth",
    publisher: "Gorakhpur Times",
    excerpt: "The Vijay Chowk startup will be a boon for energetic youth across Gorakhpur, Deoria, and Kushinagar. Over 1.9K reactions on Facebook."
  },
  "514042905_9826827987426065_7400867662913067041_n": {
    title: "Twitter: Commerce Minister Shares Startup Cafe's Inspiring Story",
    publisher: "Twitter / @sureshpprabhu",
    excerpt: "Eastern UP gets its first co-working space, Startup Cafe, in Gorakhpur, tweeted by Commerce and Industry Minister Suresh Prabhu."
  },
};

// Helper to extract a nice title from the image file name
const extractInfoFromFileName = (fileName) => {
  try {
    
    // If we have a custom description for this file, use it!
    if (knownImageDescriptions[fileName]) {
      return knownImageDescriptions[fileName];
    }

    const cleanTitle = fileName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
      
    const isAutoGenerated = /\d{5,}/.test(fileName);
      
    // Return formatted data fallback
    return {
      title: isAutoGenerated ? "Media Highlight" : (cleanTitle || "Media Highlight"),
      publisher: "Startup Cafe Feature",
      excerpt: "A glimpse of our journey, community buzz, and media coverage across various platforms.",
    };
  } catch {
    return { title: "Media Highlight", publisher: "Feature", excerpt: "Special feature in our highlight reel." };
  }
};

export default function PressCoverage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Determine how many images to show
  const visibleImages = showAll ? displayItems : displayItems.slice(0, 8);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSelectedImage(null);
  };

  return (
    <section id="press" className="py-24 px-6 md:px-12 relative z-10 overflow-hidden bg-dark-bg/50" onKeyDown={handleKeyDown}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Newspaper className="text-neon-pink w-6 h-6" />
            <span className="text-neon-pink font-semibold tracking-wider uppercase text-sm">Media & Highlights</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            In The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Spotlight</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg"
          >
            See what leading newspapers, media outlets, and the community are saying about our revolutionary co-working space.
          </motion.p>
        </div>

        {/* Card Layout matching the original design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {visibleImages.map((item, index) => {
              const meta = extractInfoFromFileName(item.fileName);
              
              return (
                <motion.div
                  key={item.url + index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(item.url)}
                  className={`glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group cursor-pointer flex-col ${!showAll && index >= 4 ? 'hidden md:flex' : 'flex'}`}
                >
                  <div className="h-44 overflow-hidden relative bg-white/5">
                    <div className="absolute inset-0 bg-dark-bg/20 z-10 group-hover:bg-transparent transition-colors duration-300"></div>
                    <img 
                      src={item.url} 
                      alt={meta.title} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 relative z-0 opacity-90 group-hover:opacity-100"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    
                    {/* Overlay Zoom Icon */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-bg/40 backdrop-blur-sm">
                      <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
                    </div>
                    
                    <div className="absolute bottom-3 left-3 z-30">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10">
                        {meta.publisher}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors line-clamp-2">
                      {meta.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mt-auto">
                      {meta.excerpt}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {displayItems.length > 8 && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-pink text-white transition-all font-medium group"
            >
              {showAll ? 'Show Less' : `View All (${displayItems.length} Highlights)`}
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-neon-pink group-hover:translate-y-1 ${showAll ? 'rotate-180 group-hover:-translate-y-1' : ''}`} />
            </button>
          </div>
        )}
      </div>

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
              alt="Full Page Highlight"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative z-40"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
