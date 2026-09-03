import { useState, useEffect } from 'react';
import { MapPanel } from './components/MapPanel';
import { ChatPanel } from './components/ChatPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sunrise, 
  Moon, 
  Sparkles, 
  Map as MapIcon, 
  MessageSquare, 
  Columns2, 
  Languages, 
  Compass, 
  Share2 
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import darshanLogo from '../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';

export default function App() {
  const [theme, setTheme] = useState<'morning' | 'evening'>('morning');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [layoutMode, setLayoutMode] = useState<'split' | 'fullchat' | 'fullmap'>('split');
  const [isLoading, setIsLoading] = useState(true);

  // Synchronized state between Map & Chat
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<[number, number] | null>(null);
  const [activeRouteWaypoints, setActiveRouteWaypoints] = useState<[number, number][] | null>(null);
  const [externalChatPrompt, setExternalChatPrompt] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Initial loading splash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'morning' ? 'evening' : 'morning'));
  };

  // Switch to Map and focus on coordinates
  const handleFocusMapLocation = (coords: [number, number], routeWaypoints?: [number, number][]) => {
    setSelectedMapCoordinates(coords);
    if (routeWaypoints) {
      setActiveRouteWaypoints(routeWaypoints);
    }
  };

  // Send prompt from Map Popup to Chat
  const handleSelectPlaceForChat = (prompt: string) => {
    setExternalChatPrompt(prompt);
    if (layoutMode === 'fullmap') {
      setLayoutMode('split');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-500 flex flex-col font-sans">
      <Toaster position="top-right" richColors />

      {/* Top Main Navigation Bar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full z-50 glass glass-dimmed border-b border-[var(--glass-border)] backdrop-blur-md flex-shrink-0"
      >
        <div className="w-full px-3 py-2 flex items-center justify-between gap-2 md:px-6">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/95 p-1 shadow-md flex-shrink-0 overflow-hidden border border-orange-500/20">
              <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base md:text-lg font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
                  Darshan 360
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                  UP Tourism
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
                {language === 'hi' ? 'उत्तर प्रदेश का एआई आध्यात्मिक एवं सांस्कृतिक साथी' : "Uttar Pradesh's AI Spiritual & Heritage Companion"}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher (Split / Full Chat / Full Map) */}
          <div className="glass rounded-full p-1 flex items-center gap-1 shadow-md border border-[var(--glass-border)]">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'split'
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'विभाजित दृश्य (मैप + चैट)' : 'Split View (Map + Chat)'}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'विभाजित' : 'Split'}</span>
            </button>

            <button
              onClick={() => setLayoutMode('fullchat')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'fullchat'
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'दिशा एआई चैट' : 'Disha AI Chat'}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'दिशा AI' : 'Disha AI'}</span>
            </button>

            <button
              onClick={() => setLayoutMode('fullmap')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'fullmap'
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'यूपी मानचित्र' : 'UP Map'}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'मानचित्र' : 'UP Map'}</span>
            </button>
          </div>

          {/* Right Controls: Language & Theme */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)] shadow-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="glass p-2 rounded-full shadow-md hover:scale-105 transition-all text-xs border border-[var(--glass-border)]"
              title={theme === 'morning' ? 'Switch to Evening Aarti Theme' : 'Switch to Morning Theme'}
            >
              {theme === 'morning' ? (
                <Sunrise className="w-4 h-4 text-[var(--accent-primary)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Dual-Pillar Content Layout */}
      <main className="flex-1 w-full min-h-0 relative overflow-hidden">
        {layoutMode === 'split' && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Left Pillar: Interactive Uttar Pradesh Map */}
            <div className="h-full lg:col-span-6 xl:col-span-7 relative min-h-0 border-r border-[var(--glass-border)]">
              <MapPanel
                theme={theme}
                language={language}
                onSelectPlaceForChat={handleSelectPlaceForChat}
                selectedCoordinates={selectedMapCoordinates}
                activeRouteWaypoints={activeRouteWaypoints}
                isFullScreen={false}
                onToggleFullScreen={() => setLayoutMode('fullmap')}
              />
            </div>

            {/* Right Pillar: Disha AI Chatbot */}
            <div className="h-full lg:col-span-6 xl:col-span-5 relative min-h-0 flex flex-col">
              <ChatPanel
                theme={theme}
                language={language}
                onLanguageChange={setLanguage}
                onFocusMapLocation={handleFocusMapLocation}
                layoutMode="split"
                onSwitchToMap={() => setLayoutMode('fullmap')}
                externalPrompt={externalChatPrompt}
                onClearExternalPrompt={() => setExternalChatPrompt(null)}
              />
            </div>
          </div>
        )}

        {layoutMode === 'fullchat' && (
          <div className="w-full h-full max-w-5xl mx-auto min-h-0 flex flex-col p-2 md:p-4">
            <div className="w-full h-full glass rounded-2xl overflow-hidden shadow-2xl border border-[var(--glass-border)] flex flex-col min-h-0">
              <ChatPanel
                theme={theme}
                language={language}
                onLanguageChange={setLanguage}
                onFocusMapLocation={handleFocusMapLocation}
                layoutMode="fullchat"
                onSwitchToMap={() => setLayoutMode('fullmap')}
                externalPrompt={externalChatPrompt}
                onClearExternalPrompt={() => setExternalChatPrompt(null)}
              />
            </div>
          </div>
        )}

        {layoutMode === 'fullmap' && (
          <div className="w-full h-full relative min-h-0">
            <MapPanel
              theme={theme}
              language={language}
              onSelectPlaceForChat={handleSelectPlaceForChat}
              selectedCoordinates={selectedMapCoordinates}
              activeRouteWaypoints={activeRouteWaypoints}
              isFullScreen={true}
              onToggleFullScreen={() => setLayoutMode('split')}
            />
          </div>
        )}
      </main>

      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--accent-primary), transparent)`,
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--accent-secondary), transparent)`,
          }}
        />
      </div>
    </div>
  );
}