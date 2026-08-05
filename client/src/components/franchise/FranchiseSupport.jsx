import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Palette, Megaphone, Cpu, GraduationCap, Download, X, User, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const supportItems = [
  { icon: MapPin, title: "Location Selection", desc: "Expert guidance in finding the perfect building with high visibility and accessibility." },
  { icon: Palette, title: "Interior Design", desc: "Standardized high-end architectural plans and interior themes that scream 'Startups'." },
  { icon: Megaphone, title: "Digital Marketing", desc: "Listing optimizations, social media handling, and lead generation ad campaigns." },
  { icon: Cpu, title: "Tech Stack", desc: "Custom booking software, automated billing, and high-speed network management apps." },
  { icon: GraduationCap, title: "Staff Training", desc: "Comprehensive training on hospitality, sales, and community management for your team." },
];

export default function FranchiseSupport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("कृपया अपना नाम भरें (Please enter your name)");
      return;
    }
    if (formData.phone.trim().length !== 10) {
      alert("कृपया 10 अंकों का मान्य मोबाइल नंबर भरें (Please enter a valid 10-digit phone number)");
      return;
    }
    if (!formData.email.trim()) {
      alert("कृपया अपना ईमेल भरें (Please enter your email)");
      return;
    }

    setLoading(true);

    try {
      // Post details to dedicated brochure download API endpoint
      const response = await fetch(`${API_BASE_URL}/api/brochure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("⚠️ Backend submission warning:", errorData);
      }
    } catch (err) {
      console.error("⚠️ Connection error while saving lead to backend:", err);
    } finally {
      // Trigger PDF Download
      const link = document.createElement('a');
      link.href = '/StartUp%20Cafe%20Brochure.pdf';
      link.download = 'StartUp Cafe Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
      setSubmitted(true);

      // Close modal after 2.5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', email: '' });
      }, 2500);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitted(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <section id="support" className="py-20 md:py-24 px-6 md:px-12 bg-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Unmatched <span className="text-neon-purple">Support</span></h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            You are never alone on your journey. Our expert teams are with you from day one to ensure your cafe is a massive success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 md:p-8 rounded-3xl bg-dark-bg/60 border border-white/5 hover:border-neon-purple/50 transition-all group"
            >
              <div className="mb-6 p-3 md:p-4 bg-neon-purple/10 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-neon-purple group-hover:text-black transition-all">
                <item.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                {item.desc}
              </p>
            </motion.div>
          ))}
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-neon-blue to-neon-purple flex flex-col justify-center items-center text-center shadow-xl min-h-[250px]"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Ready to Lead?</h3>
            <p className="text-white/80 mb-6 text-xs md:text-sm">Download our complete franchise brochure to see the full list of support services.</p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform text-sm md:text-base cursor-pointer shadow-lg hover:bg-slate-100"
            >
              <Download className="w-4 h-4" />
              Download Brochure
            </button>
          </motion.div>
        </div>
      </div>

      {/* Download Brochure Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl overflow-hidden text-white"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Your details have been recorded and your PDF brochure is downloading automatically.
                  </p>
                  <p className="text-xs text-neon-purple font-medium">धन्यवाद! ब्रोशर डाउनलोड हो रहा है...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-neon-purple/20 text-neon-purple rounded-2xl">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Download Brochure</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Please fill details to download PDF</p>
                    </div>
                  </div>

                  <form onSubmit={handleBrochureSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Name / नाम <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone Number / फोन नंबर <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email / ईमेल <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neon-purple/20 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Submit & Download PDF</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
