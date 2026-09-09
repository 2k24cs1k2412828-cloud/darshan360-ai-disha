import { useState, useEffect } from 'react';
import { MapPanel } from './components/MapPanel';
import { ChatPanel } from './components/ChatPanel';
import { NewsPanel } from './components/NewsPanel';
import { CopilotTimeline } from './components/CopilotTimeline';
import { LoadingScreen } from './components/LoadingScreen';
import { motion } from 'motion/react';
import { 
  Sunrise, 
  Moon, 
  Map as MapIcon, 
  MessageSquare, 
  Columns2, 
  Newspaper,
  PhoneCall,
  ShieldCheck,
  Route
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import darshanLogo from '../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';
import { 
  type TripItinerary, 
  insertPlaceIntoItinerary, 
  getPresetItineraries 
} from './services/copilotService';
import { type UttarPradeshDestination } from '../data/up-comprehensive-database';

export default function App() {
  const [theme, setTheme] = useState<'morning' | 'evening'>('morning');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [layoutMode, setLayoutMode] = useState<'split' | 'fullchat' | 'fullmap' | 'news'>('split');
  const [isLoading, setIsLoading] = useState(true);

  // Synchronized state between Map, Chat & Copilot
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<[number, number] | null>(null);
  const [activeRouteWaypoints, setActiveRouteWaypoints] = useState<[number, number][] | null>(null);
  const [externalChatPrompt, setExternalChatPrompt] = useState<string | null>(null);
  const [activeItinerary, setActiveItinerary] = useState<TripItinerary | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'map' | 'copilot' | 'news'>('chat');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Initial loading splash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

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
    setMobileTab('map');
  };

  // Send prompt from Map Popup to Chat
  const handleSelectPlaceForChat = (prompt: string) => {
    setExternalChatPrompt(prompt);
    setMobileTab('chat');
    if (layoutMode === 'fullmap') {
      setLayoutMode('split');
    }
  };

  // Add place from Map to Copilot Trip
  const handleAddPlaceToItinerary = (place: UttarPradeshDestination) => {
    const base = activeItinerary || getPresetItineraries()[0];
    const updated = insertPlaceIntoItinerary(base, place);
    setActiveItinerary(updated);
    setIsCopilotOpen(true);
    toast.success(
      language === 'hi'
        ? `${place.name.hi} को यात्रा में जोड़ा गया!`
        : `Added ${place.name.en} to your trip plan!`
    );
  };

  // Update itinerary state from Copilot or Chat
  const handleUpdateItinerary = (itinerary: TripItinerary) => {
    setActiveItinerary(itinerary);
    setIsCopilotOpen(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-[var(--bg-primary)] transition-all duration-300 flex flex-col font-sans">
      <Toaster position="top-right" richColors />

      {/* Top Main Navigation Bar - Prestige Travel Portal Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full z-50 glass border-b border-[var(--glass-border)] backdrop-blur-md flex-shrink-0"
      >
        <div className="w-full px-3 py-2.5 flex items-center justify-between gap-3 md:px-7">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm flex-shrink-0 overflow-hidden border border-[var(--glass-border)]">
              <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-bold tracking-tight text-[var(--text-primary)] font-display">
                  DARSHAN 360°
                </h1>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 uppercase">
                  UP Tourism
                </span>
              </div>
              <p className="text-[11px] font-medium text-[var(--text-secondary)] hidden sm:block tracking-normal">
                {language === 'hi' ? 'उत्तर प्रदेश पर्यटन • आधिकारिक तीर्थ एवं धरोहर पोर्टल' : 'Uttar Pradesh Tourism • Official Heritage & Pilgrimage Portal'}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher - Modern Segmented Travel Navigation (Desktop Only) */}
          <div className="hidden lg:flex glass rounded-full p-1 items-center gap-1 shadow-sm border border-[var(--glass-border)]">
            <button
              onClick={() => setLayoutMode('news')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'news'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'उत्तर प्रदेश ताज़ा यात्रा बुलेटिन व भीड़ स्थिति' : 'Live Travel Bulletins & Crowd Advisory'}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'यात्रा बुलेटिन' : 'Travel Dispatch'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'split'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'द्वैत दृश्य (मानचित्र + परामर्श)' : 'Dual Explorer (Map + Concierge)'}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'द्वैत दृश्य' : 'Explorer'}</span>
            </button>

            <button
              onClick={() => setLayoutMode('fullmap')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'fullmap'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'इंटरैक्टिव यूपी मानचित्र' : 'Interactive Map'}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'मानचित्र' : 'Map'}</span>
            </button>

            <button
              onClick={() => setLayoutMode('fullchat')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'fullchat'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'यात्रा परामर्श साथी' : 'Travel Concierge'}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'मार्गदर्शक' : 'Concierge'}</span>
            </button>

            {/* AI Travel Copilot Timeline Drawer Toggle */}
            <button
              onClick={() => {
                if (!activeItinerary) {
                  setActiveItinerary(getPresetItineraries()[0]);
                }
                setIsCopilotOpen(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                isCopilotOpen
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'एआई यात्रा कोपायलट टाइमलाइन' : 'AI Trip Copilot Timeline'}
            >
              <Route className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">{language === 'hi' ? 'कोपायलट' : 'Copilot'}</span>
              {activeItinerary && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Right Controls: Helpline, Language & Theme */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Phone Helpline Button */}
            <a
              href="tel:18001805145"
              className="lg:hidden glass p-1.5 rounded-full shadow-sm text-xs border border-[var(--glass-border)] text-[var(--accent-primary)] flex items-center justify-center cursor-pointer"
              title="UP Tourism 24x7 Toll-Free Helpline: 1800-180-5145"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>

            {/* Official Toll-Free Helpline Badge (Desktop) */}
            <a
              href="tel:18001805145"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] glass border border-[var(--glass-border)] transition-colors"
              title="UP Tourism 24x7 Toll-Free Helpline: 1800-180-5145"
            >
              <PhoneCall className="w-3 h-3 text-[var(--accent-primary)]" />
              <span>1800-180-5145</span>
            </a>

            {/* Language Switcher */}
            <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)] shadow-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="glass p-2 rounded-full shadow-sm hover:scale-105 transition-all text-xs border border-[var(--glass-border)] cursor-pointer text-[var(--text-primary)]"
              title={theme === 'morning' ? 'Switch to Evening Aarti Atmosphere' : 'Switch to Morning Atmosphere'}
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
          <div className="w-full h-full lg:grid lg:grid-cols-12 min-h-0 relative flex flex-col">
            {/* Left Pillar: Interactive Uttar Pradesh Map */}
            <div className={`h-full lg:col-span-6 xl:col-span-7 relative min-h-0 border-r border-[var(--glass-border)] ${
              mobileTab === 'map' ? 'flex flex-col flex-1' : 'hidden lg:block'
            }`}>
              <MapPanel
                theme={theme}
                language={language}
                onSelectPlaceForChat={handleSelectPlaceForChat}
                selectedCoordinates={selectedMapCoordinates}
                activeRouteWaypoints={activeRouteWaypoints}
                onClearActiveRoute={() => setActiveRouteWaypoints(null)}
                isFullScreen={false}
                onToggleFullScreen={() => setLayoutMode('fullmap')}
                activeItinerary={activeItinerary}
                onAddPlaceToItinerary={handleAddPlaceToItinerary}
              />
            </div>

            {/* Right Pillar: Disha AI Chatbot */}
            <div className={`h-full lg:col-span-6 xl:col-span-5 relative min-h-0 flex flex-col ${
              mobileTab === 'chat' ? 'flex flex-col flex-1' : 'hidden lg:flex'
            }`}>
              <ChatPanel
                theme={theme}
                language={language}
                onLanguageChange={setLanguage}
                onFocusMapLocation={handleFocusMapLocation}
                layoutMode="split"
                onSwitchToMap={() => {
                  setMobileTab('map');
                  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                    setLayoutMode('fullmap');
                  }
                }}
                externalPrompt={externalChatPrompt}
                onClearExternalPrompt={() => setExternalChatPrompt(null)}
                activeItinerary={activeItinerary}
                onUpdateItinerary={handleUpdateItinerary}
                onToggleCopilotDrawer={() => setIsCopilotOpen(prev => !prev)}
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
                onSwitchToMap={() => {
                  setMobileTab('map');
                  setLayoutMode('fullmap');
                }}
                externalPrompt={externalChatPrompt}
                onClearExternalPrompt={() => setExternalChatPrompt(null)}
                activeItinerary={activeItinerary}
                onUpdateItinerary={handleUpdateItinerary}
                onToggleCopilotDrawer={() => setIsCopilotOpen(prev => !prev)}
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
              onClearActiveRoute={() => setActiveRouteWaypoints(null)}
              isFullScreen={true}
              onToggleFullScreen={() => setLayoutMode('split')}
              activeItinerary={activeItinerary}
              onAddPlaceToItinerary={handleAddPlaceToItinerary}
            />
          </div>
        )}

        {layoutMode === 'news' && (
          <div className="w-full h-full max-w-7xl mx-auto min-h-0 flex flex-col pb-16 lg:pb-0">
            <NewsPanel
              theme={theme}
              language={language}
              onAskAI={(prompt) => {
                setExternalChatPrompt(prompt);
                setMobileTab('chat');
                setLayoutMode('split');
              }}
            />
          </div>
        )}

        {/* Interactive AI Travel Copilot Timeline Drawer */}
        <CopilotTimeline
          itinerary={activeItinerary}
          isOpen={isCopilotOpen}
          onToggleOpen={() => setIsCopilotOpen(prev => !prev)}
          onUpdateItinerary={handleUpdateItinerary}
          onFocusStop={(coords) => {
            setSelectedMapCoordinates(coords);
            setMobileTab('map');
            if (layoutMode === 'news') {
              setLayoutMode('split');
            }
          }}
          onAskAIAboutStop={(prompt) => {
            setExternalChatPrompt(prompt);
            setMobileTab('chat');
            if (layoutMode === 'fullmap' || layoutMode === 'news') {
              setLayoutMode('split');
            }
          }}
          language={language}
        />
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop >= 1024px) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass glass-dimmed border-t border-[var(--glass-border)] backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl bg-white/95 dark:bg-neutral-900/95 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {/* 1. Disha AI Chat */}
        <button
          onClick={() => {
            setMobileTab('chat');
            if (layoutMode === 'news') setLayoutMode('split');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'chat' && layoutMode !== 'news'
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'दिशा AI' : 'Disha AI'}</span>
          {mobileTab === 'chat' && layoutMode !== 'news' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>

        {/* 2. Interactive Map */}
        <button
          onClick={() => {
            setMobileTab('map');
            if (layoutMode === 'news') setLayoutMode('split');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'map' && layoutMode !== 'news'
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'मानचित्र' : 'Map'}</span>
          {mobileTab === 'map' && layoutMode !== 'news' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>

        {/* 3. AI Copilot Timeline */}
        <button
          onClick={() => {
            if (!activeItinerary) {
              setActiveItinerary(getPresetItineraries()[0]);
            }
            setIsCopilotOpen(prev => !prev);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            isCopilotOpen
              ? 'text-orange-600 font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
        >
          <Route className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'कोपायलट' : 'Copilot'}</span>
          {activeItinerary && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-2.5 animate-pulse" />
          )}
        </button>

        {/* 4. Travel Bulletins / News */}
        <button
          onClick={() => {
            setLayoutMode('news');
            setMobileTab('news');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            layoutMode === 'news'
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative">
            <Newspaper className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-[10px] font-medium">{language === 'hi' ? 'बुलेटिन' : 'News'}</span>
          {layoutMode === 'news' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>
      </nav>

    </div>
  );
}