import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import WhatsAppWidget from './components/layout/WhatsAppWidget';
import Home from './pages/Home';
import Franchise from './pages/Franchise';
import Footer from './components/layout/Footer';


function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <AdminAuthProvider>
          <Router>
            <div className="min-h-screen relative selection:bg-neon-pink selection:text-white">
              {/* Global Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-dark-bg">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-neon-blue/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
              </div>

              <Navbar />
              <ScrollToTop />
              <WhatsAppWidget />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/franchise" element={<Franchise />} />

                  {/* Catch-all fallback to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AdminAuthProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
export default App;
