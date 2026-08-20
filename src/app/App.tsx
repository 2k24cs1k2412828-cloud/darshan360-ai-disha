import { useState, useEffect } from 'react';
import { MapPanel } from './components/MapPanel';
import { ChatPanel } from './components/ChatPanel';
import { BoatBookingModal } from './components/BoatBookingModal';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { HelpGuide } from './components/HelpGuide';
import { LoadingScreen } from './components/LoadingScreen';
import { HeritageGallery } from './components/HeritageGallery';
import { Darshan360Insights } from './components/Darshan360Insights';
import { motion, AnimatePresence } from 'motion/react';
import { Sunrise, Moon, Menu, X, Sparkles, Map, Image as ImageIcon, Maximize2, Minimize2, Compass } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import darshanLogo from '../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';

export default function App() {
  const [theme, setTheme] = useState<'morning' | 'evening'>('morning');
  const [isBoatModalOpen, setIsBoatModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'images'>('map');
  const [layoutMode, setLayoutMode] = useState<'split' | 'fullchat'>('split');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'morning' ? 'evening' : 'morning'));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-500">
      <Toaster position="top-right" />

      {/* Top Navigation Bar - hidden in fullchat mode (sidebar replaces it) */}
      {layoutMode !== 'fullchat' && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 z-50 glass glass-dimmed border-b border-[var(--glass-border)] backdrop-blur-sm"
        >
          <div className="w-full px-3 py-2 flex items-center justify-between gap-2 md:px-6 md:py-2">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/90 p-1 shadow-lg flex-shrink-0 overflow-hidden md:w-10 md:h-10 md:rounded-xl">
                <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[var(--text-primary)] md:text-xl">
                  Darshan 360
                </h1>
                <p className="text-xs text-[var(--text-secondary)]">
                  India&apos;s first AI travel companion
                </p>
              </div>
            </div>

            {/* Book Services, Help, Layout Toggle & Theme Toggle */}
            <div className="flex items-center gap-1 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsServiceModalOpen(true)}
                className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold text-xs md:px-4 md:gap-2 md:text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Book</span>
              </motion.button>
              <HelpGuide />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayoutMode(prev => prev === 'split' ? 'fullchat' : 'split')}
                className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-lg hover:shadow-xl transition-all text-xs md:px-4 md:gap-2 md:text-sm"
                title={layoutMode === 'split' ? 'Switch to Disha AI Chat' : 'Switch to Map View'}
              >
                {layoutMode === 'split' ? (
                  <>
                    <Maximize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="hidden md:inline font-medium text-[var(--text-primary)]">
                      Disha AI
                    </span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="hidden md:inline font-medium text-[var(--text-primary)]">
                      Map View
                    </span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-lg hover:shadow-xl transition-all text-xs md:px-4 md:gap-2 md:text-sm"
              >
                {theme === 'morning' ? (
                  <>
                    <Sunrise className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="hidden md:inline font-medium text-[var(--text-primary)]">
                      Morning
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="hidden md:inline font-medium text-[var(--text-primary)]">
                      Evening
                    </span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInsights(true)}
                className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-lg hover:shadow-xl transition-all text-xs md:px-4 md:gap-2 md:text-sm"
              >
                <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="hidden md:inline font-medium text-[var(--text-primary)]">
                  Ecosystem
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area - Full-screen Map and Full-screen Chat modes */}
      <div 
        className={`w-full h-full ${layoutMode === 'fullchat' ? 'pt-0' : 'pt-[62px] md:pt-[72px]'} pb-0 px-0 flex items-center justify-center overflow-hidden`}
      >
        {layoutMode === 'split' ? (
          <div className="w-full h-full relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full h-full relative"
            >
              <div className="h-full glass rounded-none overflow-hidden shadow-none border-0 md:rounded-none">
                <AnimatePresence mode="wait">
                  {viewMode === 'map' ? (
                    <motion.div
                      key="left-map"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full"
                    >
                      <MapPanel theme={theme} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="left-images"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full"
                    >
                      <HeritageGallery theme={theme} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col relative min-h-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full h-full glass rounded-none overflow-hidden shadow-none border-0 md:rounded-none"
            >
              <ChatPanel theme={theme} onBookBoat={() => setIsBoatModalOpen(true)} layoutMode="fullchat" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Full Chat Sidebar Toggle (visible only in fullchat mode) */}
      {layoutMode === 'fullchat' && (
        <>
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-3 z-50 glass p-2 rounded-lg shadow-lg hover:shadow-xl md:top-24 md:left-6"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-[var(--accent-primary)]" />
          </button>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-20 left-6 bottom-6 w-72 z-50 glass rounded-xl overflow-auto border border-[var(--glass-border)] shadow-2xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/90 p-1 shadow-lg overflow-hidden">
                      <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">Menu</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Quick actions</p>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md glass">
                    <X className="w-4 h-4 text-[var(--text-primary)]" />
                  </button>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setIsServiceModalOpen(true)}
                    className="w-full glass rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--text-primary)]">Book Services</span>
                  </motion.button>

                  <HelpGuide />

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setLayoutMode(prev => prev === 'split' ? 'fullchat' : 'split')}
                    className="w-full glass rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <Minimize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--text-primary)]">Map View</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setTheme(prev => prev === 'morning' ? 'evening' : 'morning')}
                    className="w-full glass rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    {theme === 'morning' ? (
                      <>
                        <Sunrise className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm text-[var(--text-primary)]">Morning Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm text-[var(--text-primary)]">Evening Aarti</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowInsights(true)}
        className="fixed bottom-4 right-4 z-40 glass rounded-full p-3 shadow-xl hover:shadow-2xl"
        title="Open Darshan 360 Ecosystem"
      >
        <Compass className="w-5 h-5 text-[var(--accent-primary)]" />
      </motion.button>

      <BoatBookingModal
        isOpen={isBoatModalOpen}
        onClose={() => setIsBoatModalOpen(false)}
      />
      <ServiceBookingModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} />
      <Darshan360Insights isOpen={showInsights} onClose={() => setShowInsights(false)} theme={theme} />

      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--accent-primary), transparent)`,
            opacity: 0.2,
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--accent-secondary), transparent)`,
            opacity: 0.15,
          }}
        />
      </div>
    </div>
  );
}