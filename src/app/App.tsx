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
  Route,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  Fullscreen,
  Shrink
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import darshanLogo from '../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';
import { 
  type TripItinerary, 
  insertPlaceIntoItinerary, 
  createItineraryFromSinglePlace,
  getPresetItineraries 
} from './services/copilotService';
import { type UttarPradeshDestination } from '../data/up-comprehensive-database';
import { Capacitor } from '@capacitor/core';
import { AndroidAppShell } from './components/android/AndroidAppShell';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isWindowFullScreen, setIsWindowFullScreen] = useState(false);

  // Synchronize browser native full-screen state and Escape key handling
  useEffect(() => {
    const handleFullScreenChange = () => {
      const doc = document as any;
      setIsWindowFullScreen(Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const doc = document as any;
        const isFs = Boolean(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        );

        if (isFs) {
          const exitFs =
            doc.exitFullscreen ||
            doc.webkitExitFullscreen ||
            doc.mozCancelFullScreen ||
            doc.msExitFullscreen;
          if (exitFs) {
            exitFs.call(doc).catch(() => {});
          }
        } else if (layoutMode === 'fullchat' || layoutMode === 'fullmap') {
          // Esc returns expanded single view back to dual split explorer
          setLayoutMode('split');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [layoutMode]);

  const toggleWindowFullScreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    const isFs = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isFs) {
      const requestFs =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (requestFs) {
        requestFs.call(docEl).then(() => {
          toast.success(
            language === 'hi'
              ? 'पूर्ण स्क्रीन मोड चालू (बाहर निकलने के लिए Esc दबाएँ)'
              : 'Full screen window active (Press Esc to exit)',
            { duration: 2500 }
          );
        }).catch((err: any) => {
          console.warn('Fullscreen request failed:', err);
        });
      }
    } else {
      const exitFs =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;

      if (exitFs) {
        exitFs.call(doc).then(() => {
          toast.info(
            language === 'hi' ? 'पूर्ण स्क्रीन से बाहर आ गए' : 'Exited full screen window',
            { duration: 2000 }
          );
        }).catch((err: any) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  };

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
    let updated: TripItinerary;
    if (!activeItinerary || !activeItinerary.stops || activeItinerary.stops.length === 0) {
      updated = createItineraryFromSinglePlace(place as any, language);
    } else {
      updated = insertPlaceIntoItinerary(activeItinerary, place as any);
    }
    setActiveItinerary(updated);
    setSelectedMapCoordinates(place.coordinates);
    setIsCopilotOpen(true);
    toast.success(
      language === 'hi'
        ? `${place.name.hi} को यात्रा में जोड़ा गया!`
        : `Added ${place.name.en} to your trip plan!`
    );
  };

  // Clear/Reset Itinerary back to clean state
  const handleClearItinerary = () => {
    setActiveItinerary(null);
    setActiveRouteWaypoints(null);
    toast.info(
      language === 'hi'
        ? 'यात्रा योजना रीसेट की गई। मानचित्र से नए स्थान जोड़ें!'
        : 'Trip cleared. Pick destinations on the map or ask AI to start a new route!'
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

  const sidebarQuickPrompts = language === 'hi' ? [
    { id: 1, icon: '⚡', label: '3-Hour Kashi Express (Station Return)', query: 'मेरे पास 3 घंटे का समय है, कैंट रेलवे स्टेशन के पास हूँ और 3 घंटे में वापस पहुँचना है। काशी विश्वनाथ, घाट और स्ट्रीट फूड का स्मार्ट रूट प्लान बनाओ।' },
    { id: 2, icon: '⏱️', label: 'Running 20m Late, Replan', query: 'मैं 20 मिनट लेट चल रहा हूँ, कृपया मेरी यात्रा का समय रीशेड्यूल करें और वापसी का ध्यान रखें।' },
    { id: 3, icon: '🍲', label: '4h Lucknow Food & Heritage Walk', query: 'लखनऊ चारबाग स्टेशन से 4 घंटे की हेरिटेज और टुंडे कबाबी फूड ट्रिप का समयबद्ध रूट प्लान बनाएं।' },
    { id: 4, icon: '🛕', label: '4h Ayodhya Temple Circuit', query: 'अयोध्या में 4 घंटे का समय है, राम मंदिर, हनुमान गढ़ी और सरयू आरती का टाइमलाइन रूट बनाएं।' },
    { id: 5, icon: '📊', label: 'Mathura-Vrindavan Telemetry', query: 'मथुरा और वृंदावन में अभी कितनी भीड़ है? क्या अभी जाने लायक है या नहीं और कैसे जाएं?' },
    { id: 6, icon: '🌊', label: 'All Sacred Ghats of UP', query: 'उत्तर प्रदेश के सभी प्रमुख पावन घाट दिखाएं और उनकी सूची मैप सहित दें।' },
    { id: 7, icon: '🏰', label: '3-Hour Jhansi Fort & Rani Mahal', query: 'झांसी का 3 घंटे का सुगम तीर्थ एवं धरोहर भ्रमण प्लान करें।' }
  ] : [
    { id: 1, icon: '⚡', label: '3-Hour Kashi Express (Station Return)', query: 'I have 3 hours in Varanasi near Cantt railway station and need to return in 3 hours. Plan an itinerary covering Kashi Vishwanath, ghats, and street food.' },
    { id: 2, icon: '⏱️', label: 'Running 20m Late, Replan', query: 'I am running 20 minutes late, please replan my itinerary to protect my return deadline.' },
    { id: 3, icon: '🍲', label: '4h Lucknow Food & Heritage Walk', query: 'Create a 4-hour Lucknow heritage and food trail from Charbagh station covering Imambara and Tunday Kababi.' },
    { id: 4, icon: '🛕', label: '4h Ayodhya Temple Circuit', query: 'I have 4 hours in Ayodhya. Plan a time-based route for Ram Mandir, Hanumangarhi, and Saryu Aarti.' },
    { id: 5, icon: '📊', label: 'Mathura-Vrindavan Telemetry', query: 'How is the crowd in Mathura & Vrindavan right now? Is it recommended to visit now and how to reach?' },
    { id: 6, icon: '🌊', label: 'All Sacred Ghats of UP', query: 'Show me all prominent sacred river ghats in Uttar Pradesh with map markers and photos.' },
    { id: 7, icon: '🏰', label: '3-Hour Jhansi Fort & Rani Mahal', query: 'Plan a 3-hour curated heritage and temple trip in Jhansi covering Jhansi Fort and Rani Mahal.' }
  ];

  // Dedicated Native Android Experience Detection
  const isNativeAndroid = Capacitor.getPlatform() === 'android';

  if (isNativeAndroid) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <AndroidAppShell
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          setLanguage={setLanguage}
          activeItinerary={activeItinerary}
          onUpdateItinerary={handleUpdateItinerary}
          selectedMapCoordinates={selectedMapCoordinates}
          activeRouteWaypoints={activeRouteWaypoints}
          onClearActiveRoute={() => setActiveRouteWaypoints(null)}
          externalChatPrompt={externalChatPrompt}
          onClearExternalPrompt={() => setExternalChatPrompt(null)}
          onFocusMapLocation={handleFocusMapLocation}
          onSelectPlaceForChat={handleSelectPlaceForChat}
          onAddPlaceToItinerary={handleAddPlaceToItinerary}
        />
      </>
    );
  }

  return (
    <div className={`w-full h-screen overflow-hidden bg-[var(--bg-primary)] transition-all duration-300 flex ${
      layoutMode === 'fullchat' ? 'flex-col lg:flex-row' : 'flex-col'
    } font-sans`}>
      <Toaster position="top-right" richColors />

      {/* Top Main Navigation Bar - Visible on all pages EXCEPT desktop fullchat */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full z-50 glass border-b border-[var(--glass-border)] backdrop-blur-md flex-shrink-0 ${
          layoutMode === 'fullchat' ? 'lg:hidden' : ''
        }`}
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

            {/* Full Screen Window Button */}
            <button
              onClick={toggleWindowFullScreen}
              className={`glass p-2 rounded-full shadow-sm hover:scale-105 transition-all text-xs border cursor-pointer ${
                isWindowFullScreen
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-sm'
                  : 'border-[var(--glass-border)] text-[var(--text-primary)]'
              }`}
              title={
                isWindowFullScreen
                  ? (language === 'hi' ? 'पूर्ण स्क्रीन विंडो से बाहर निकलें (Esc)' : 'Exit Full Screen Window (Esc)')
                  : (language === 'hi' ? 'पूर्ण स्क्रीन विंडो (Esc से बाहर निकलें)' : 'Full Screen Window (Press Esc to exit)')
              }
              aria-label={isWindowFullScreen ? 'Exit Full Screen Window' : 'Full Screen Window'}
            >
              {isWindowFullScreen ? (
                <Shrink className="w-4 h-4 text-[var(--accent-primary)]" />
              ) : (
                <Fullscreen className="w-4 h-4 text-[var(--accent-primary)]" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Left Sidebar - Displayed ONLY in Full-Screen Chatbot Mode on Desktop */}
      {layoutMode === 'fullchat' && (
        <aside
          className={`hidden lg:flex flex-col h-full flex-shrink-0 glass border-r border-[var(--glass-border)] z-40 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
          } justify-between p-3.5 select-none overflow-hidden`}
        >
          {/* Top: Brand Header & Collapse Trigger */}
          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-sm flex-shrink-0 overflow-hidden border border-[var(--glass-border)] flex items-center justify-center">
                  <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] font-display truncate">
                        DARSHAN 360°
                      </h1>
                    </div>
                    <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 uppercase">
                      UP Tourism
                    </span>
                  </div>
                )}
              </div>

              {/* Sidebar Collapse/Expand Toggle */}
              <button
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                className="p-1.5 rounded-lg glass text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer flex-shrink-0"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Switchers Back to Other Views */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[var(--glass-border)] flex-shrink-0">
              <button
                onClick={() => setLayoutMode('split')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold glass hover:bg-orange-500/10 hover:border-orange-500/30 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all cursor-pointer"
                title={language === 'hi' ? 'द्वैत दृश्य' : 'Split Explorer'}
              >
                <Columns2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'द्वैत दृश्य' : 'Explorer'}</span>}
              </button>

              <button
                onClick={() => setLayoutMode('fullmap')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold glass hover:bg-orange-500/10 hover:border-orange-500/30 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all cursor-pointer"
                title={language === 'hi' ? 'मानचित्र' : 'Interactive Map'}
              >
                <MapIcon className="w-3.5 h-3.5 text-blue-500" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'मानचित्र' : 'Map'}</span>}
              </button>

              <button
                onClick={() => {
                  setIsCopilotOpen(prev => !prev);
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold glass hover:bg-orange-500/10 hover:border-orange-500/30 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all cursor-pointer ${
                  isCopilotOpen ? 'border-orange-500 bg-orange-500/10' : ''
                }`}
                title={language === 'hi' ? 'कोपायलट' : 'Trip Copilot'}
              >
                <Route className="w-3.5 h-3.5 text-orange-500" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'कोपायलट' : 'Copilot'}</span>}
              </button>

              <button
                onClick={() => setLayoutMode('news')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold glass hover:bg-orange-500/10 hover:border-orange-500/30 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all cursor-pointer"
                title={language === 'hi' ? 'समाचार' : 'Travel News'}
              >
                <Newspaper className="w-3.5 h-3.5 text-amber-500" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'समाचार' : 'News'}</span>}
              </button>
            </div>

            {/* Quick Action Prompt Trails from user screenshot */}
            <div className="flex flex-col min-h-0 flex-1 overflow-hidden mt-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] px-1 mb-1.5 flex items-center justify-between flex-shrink-0">
                  <span>{language === 'hi' ? 'त्वरित यात्रा विकल्प' : 'Quick Prompt Trails'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-500/10 text-orange-600 font-semibold">
                    Live
                  </span>
                </div>
              )}

              {/* Scrollable List of Quick Chips in Left Sidebar */}
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-500/20 flex-1 min-h-0">
                {sidebarQuickPrompts.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => setExternalChatPrompt(action.query)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-medium glass hover:bg-orange-500/15 hover:border-orange-500/40 text-[var(--text-primary)] transition-all border border-[var(--glass-border)] shadow-xs flex items-center gap-2 cursor-pointer group flex-shrink-0 ${
                      isSidebarCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                    title={action.label}
                  >
                    <span className="text-sm flex-shrink-0 group-hover:scale-115 transition-transform">{action.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1 text-[11px] leading-tight font-medium">
                        {action.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section in Left Sidebar */}
          <div className="flex flex-col gap-2.5 pt-2.5 border-t border-[var(--glass-border)] flex-shrink-0">
            {/* Toll-free Helpline */}
            <a
              href="tel:18001805145"
              className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] glass border border-[var(--glass-border)] transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title="UP Tourism 24x7 Toll-Free Helpline: 1800-180-5145"
            >
              <PhoneCall className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-[9px] text-[var(--text-secondary)] leading-tight">24x7 Helpline</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-none">1800-180-5145</p>
                </div>
              )}
            </a>

            {/* Language and Theme Controls */}
            <div className={`flex items-center gap-1.5 ${isSidebarCollapsed ? 'flex-col' : 'justify-between'}`}>
              {/* Bilingual Switcher */}
              <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)] shadow-xs">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Atmosphere Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="glass p-1.5 rounded-full shadow-xs hover:scale-105 transition-all text-xs border border-[var(--glass-border)] cursor-pointer text-[var(--text-primary)]"
                title={theme === 'morning' ? 'Switch to Evening Aarti Atmosphere' : 'Switch to Morning Atmosphere'}
              >
                {theme === 'morning' ? (
                  <Sunrise className="w-4 h-4 text-[var(--accent-primary)]" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
                )}
              </button>

              {/* Full Screen Window Button */}
              <button
                onClick={toggleWindowFullScreen}
                className={`glass p-1.5 rounded-full shadow-xs hover:scale-105 transition-all text-xs border cursor-pointer ${
                  isWindowFullScreen
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-xs'
                    : 'border-[var(--glass-border)] text-[var(--text-primary)]'
                }`}
                title={
                  isWindowFullScreen
                    ? (language === 'hi' ? 'पूर्ण स्क्रीन विंडो से बाहर निकलें (Esc)' : 'Exit Full Screen Window (Esc)')
                    : (language === 'hi' ? 'पूर्ण स्क्रीन विंडो (Esc से बाहर निकलें)' : 'Full Screen Window (Press Esc to exit)')
                }
                aria-label={isWindowFullScreen ? 'Exit Full Screen Window' : 'Full Screen Window'}
              >
                {isWindowFullScreen ? (
                  <Shrink className="w-4 h-4 text-[var(--accent-primary)]" />
                ) : (
                  <Fullscreen className="w-4 h-4 text-[var(--accent-primary)]" />
                )}
              </button>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] px-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="truncate">UP Tourism Verified Intelligence</span>
              </div>
            )}
          </div>
        </aside>
      )}

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
                isWindowFullScreen={isWindowFullScreen}
                onToggleWindowFullScreen={toggleWindowFullScreen}
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
                onToggleFullScreen={() => setLayoutMode('fullchat')}
                isWindowFullScreen={isWindowFullScreen}
                onToggleWindowFullScreen={toggleWindowFullScreen}
              />
            </div>
          </div>
        )}

        {layoutMode === 'fullchat' && (
          <div className="w-full h-full min-h-0 flex flex-col relative">
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
              onToggleFullScreen={() => setLayoutMode('split')}
              isWindowFullScreen={isWindowFullScreen}
              onToggleWindowFullScreen={toggleWindowFullScreen}
              externalPrompt={externalChatPrompt}
              onClearExternalPrompt={() => setExternalChatPrompt(null)}
              activeItinerary={activeItinerary}
              onUpdateItinerary={handleUpdateItinerary}
              onToggleCopilotDrawer={() => setIsCopilotOpen(prev => !prev)}
            />
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
              isWindowFullScreen={isWindowFullScreen}
              onToggleWindowFullScreen={toggleWindowFullScreen}
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
          onClearItinerary={handleClearItinerary}
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