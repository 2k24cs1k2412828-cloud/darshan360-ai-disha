import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapacitorApp } from '@capacitor/app';
import { 
  Map as MapIcon, 
  MessageSquare, 
  Route, 
  Newspaper, 
  PhoneCall, 
  Sunrise, 
  Moon, 
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import ghumoIndiaLogo from '../../../images/ghumo-india-logo.png';
import { MapPanel } from '../MapPanel';
import { ChatPanel } from '../ChatPanel';
import { NewsPanel } from '../NewsPanel';
import { CopilotTimeline } from '../CopilotTimeline';
import type { TripItinerary } from '../../services/copilotService';
import type { UttarPradeshDestination } from '../../../data/up-comprehensive-database';

interface AndroidAppShellProps {
  theme: 'morning' | 'evening';
  toggleTheme: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  activeItinerary: TripItinerary | null;
  onUpdateItinerary: (itinerary: TripItinerary) => void;
  selectedMapCoordinates: [number, number] | null;
  activeRouteWaypoints: [number, number][] | null;
  onClearActiveRoute: () => void;
  externalChatPrompt: string | null;
  onClearExternalPrompt: () => void;
  onFocusMapLocation: (coords: [number, number], routeWaypoints?: [number, number][]) => void;
  onSelectPlaceForChat: (prompt: string) => void;
  onAddPlaceToItinerary: (place: any) => void;
}

export function AndroidAppShell({
  theme,
  toggleTheme,
  language,
  setLanguage,
  activeItinerary,
  onUpdateItinerary,
  selectedMapCoordinates,
  activeRouteWaypoints,
  onClearActiveRoute,
  externalChatPrompt,
  onClearExternalPrompt,
  onFocusMapLocation,
  onSelectPlaceForChat,
  onAddPlaceToItinerary
}: AndroidAppShellProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'chat' | 'copilot' | 'news'>('map');
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState(false);
  const lastBackPressRef = useRef<number>(0);

  // Native Android Hardware & Gesture Back Button Handling
  useEffect(() => {
    const backHandler = CapacitorApp.addListener('backButton', () => {
      // 1. If Copilot drawer is open, close it
      if (isCopilotDrawerOpen) {
        setIsCopilotDrawerOpen(false);
        return;
      }

      // 2. If on a sub-tab (Chat, Copilot, News), navigate back to the primary Map tab
      if (activeTab !== 'map') {
        setActiveTab('map');
        return;
      }

      // 3. Double-tap back on home screen to exit app safely
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        CapacitorApp.exitApp();
      } else {
        lastBackPressRef.current = now;
        toast.info(
          language === 'hi' 
            ? 'बाहर निकलने के लिए फिर से बैक दबाएँ' 
            : 'Press back again to exit',
          { duration: 1800 }
        );
      }
    });

    return () => {
      backHandler.then(h => h.remove()).catch(() => {});
    };
  }, [activeTab, isCopilotDrawerOpen, language]);

  // Tab configuration
  const tabs = [
    {
      id: 'map' as const,
      labelEn: 'Explore',
      labelHi: 'दर्शन',
      icon: MapIcon,
      badge: null
    },
    {
      id: 'chat' as const,
      labelEn: 'Ghumo AI',
      labelHi: 'घूमो AI',
      icon: MessageSquare,
      badge: 'AI'
    },
    {
      id: 'copilot' as const,
      labelEn: 'Copilot',
      labelHi: 'कोपायलट',
      icon: Route,
      badge: activeItinerary ? `${activeItinerary.places.length}` : null
    },
    {
      id: 'news' as const,
      labelEn: 'Bulletins',
      labelHi: 'बुलेटिन',
      icon: Newspaper,
      badge: 'Live'
    }
  ];

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[var(--bg-primary)] overflow-hidden font-sans select-none">
      {/* Material 3 Android Status Bar & Top App Bar */}
      <header className="w-full flex-shrink-0 z-40 bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-[var(--glass-border)] pt-[max(0.6rem,env(safe-area-inset-top))] px-3.5 pb-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Identity & MP Tourism Crest */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-xs flex-shrink-0 overflow-hidden border border-[var(--glass-border)] flex items-center justify-center">
              <img src={ghumoIndiaLogo} alt="Ghumo India logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] font-display truncate">
                  GHUMO INDIA
                </h1>
                <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 uppercase">
                  MP
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate">
                  {language === 'hi' ? 'घूमो इंडिया • टीम सृजन (प्रॉब्लम 4)' : 'Ghumo India • Team Srajan'}
                </p>
              </div>
            </div>
          </div>

          {/* Android Action Chips: Helpline, Bilingual & Atmosphere */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Toll-Free Helpline Quick Dial Intent */}
            <a
              href="tel:18001805145"
              className="p-1.5 rounded-full glass border border-[var(--glass-border)] text-[var(--accent-primary)] shadow-xs flex items-center justify-center active:scale-95 transition-transform"
              title="UP Tourism 24x7 Toll-Free: 1800-180-5145"
              aria-label="Call Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>

            {/* Bilingual Quick Toggle */}
            <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)] shadow-2xs">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all text-[var(--accent-primary)] active:scale-95 cursor-pointer"
              >
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </button>
            </div>

            {/* Atmosphere (Sunrise / Evening Aarti) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full glass border border-[var(--glass-border)] text-[var(--text-primary)] shadow-xs flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              title={theme === 'morning' ? 'Evening Atmosphere' : 'Morning Atmosphere'}
              aria-label="Toggle Theme"
            >
              {theme === 'morning' ? (
                <Sunrise className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Android Content Viewport */}
      <main className="flex-1 w-full min-h-0 relative overflow-hidden">
        {/* Tab 1: Interactive Map View */}
        <div className={`w-full h-full absolute inset-0 ${activeTab === 'map' ? 'block' : 'hidden'}`}>
          <MapPanel
            theme={theme}
            language={language}
            onSelectPlaceForChat={(prompt) => {
              onSelectPlaceForChat(prompt);
              setActiveTab('chat');
            }}
            selectedCoordinates={selectedMapCoordinates}
            activeRouteWaypoints={activeRouteWaypoints}
            onClearActiveRoute={onClearActiveRoute}
            isFullScreen={false}
            activeItinerary={activeItinerary}
            onAddPlaceToItinerary={onAddPlaceToItinerary}
          />
        </div>

        {/* Tab 2: Disha AI Concierge View */}
        <div className={`w-full h-full absolute inset-0 flex flex-col ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
          <ChatPanel
            theme={theme}
            language={language}
            onLanguageChange={setLanguage}
            onFocusMapLocation={(coords, routeWaypoints) => {
              onFocusMapLocation(coords, routeWaypoints);
              setActiveTab('map');
            }}
            layoutMode="fullchat"
            onSwitchToMap={() => setActiveTab('map')}
            externalPrompt={externalChatPrompt}
            onClearExternalPrompt={onClearExternalPrompt}
            activeItinerary={activeItinerary}
            onUpdateItinerary={onUpdateItinerary}
            onToggleCopilotDrawer={() => setIsCopilotDrawerOpen(prev => !prev)}
          />
        </div>

        {/* Tab 3: Trip Copilot Timeline View */}
        <div className={`w-full h-full absolute inset-0 overflow-y-auto ${activeTab === 'copilot' ? 'block' : 'hidden'} p-3 pb-24`}>
          <div className="max-w-xl mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] font-display">
                  {language === 'hi' ? 'एआई यात्रा कोपायलट' : 'AI Trip Copilot'}
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {language === 'hi' ? 'समयबद्ध यात्रा मार्ग व वापसी सुरक्षा' : 'Smart time-aware route with return protection'}
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
                Live
              </span>
            </div>

            {activeItinerary ? (
              <div className="flex flex-col gap-2.5">
                <CopilotTimeline
                  itinerary={activeItinerary}
                  isOpen={true}
                  onToggleOpen={() => {}}
                  onUpdateItinerary={onUpdateItinerary}
                  language={language}
                  onFocusPlace={(coords) => {
                    onFocusMapLocation(coords);
                    setActiveTab('map');
                  }}
                  onAskDishaAI={(prompt) => {
                    onSelectPlaceForChat(prompt);
                    setActiveTab('chat');
                  }}
                />
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-center border border-[var(--glass-border)] flex flex-col items-center gap-3 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Route className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {language === 'hi' ? 'कोई सक्रिय यात्रा मार्ग नहीं है' : 'No Active Itinerary Yet'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                    {language === 'hi'
                      ? 'घूमो AI से कहें: "4 घंटे का बटेश्वर-मितावली हेरिटेज रूट बनाओ" या मानचित्र से स्थान जोड़ें।'
                      : 'Ask Ghumo AI: "Plan a 4-hour Bateshwar & Mitawali trip" or tap any place card to begin.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectPlaceForChat(
                      language === 'hi'
                        ? 'कृपया मेरे लिए मध्य प्रदेश का एक बेहतरीन 4 घंटे का यात्रा प्लान बनाएं।'
                        : 'Please plan a curated 4-hour heritage trip for me.'
                    );
                    setActiveTab('chat');
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                >
                  {language === 'hi' ? 'घूमो AI से प्लान बनवाएं' : 'Ask Ghumo AI to Plan'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab 4: Live Travel Bulletins & Crowd Advisory */}
        <div className={`w-full h-full absolute inset-0 overflow-hidden ${activeTab === 'news' ? 'block' : 'hidden'} pb-20`}>
          <NewsPanel
            theme={theme}
            language={language}
            onAskAI={(prompt) => {
              onSelectPlaceForChat(prompt);
              setActiveTab('chat');
            }}
          />
        </div>
      </main>

      {/* Material 3 Native Android Bottom Navigation Bar */}
      <nav className="w-full flex-shrink-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--glass-border)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="grid grid-cols-4 items-center justify-around gap-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer active:scale-90 ${
                  isActive
                    ? 'text-[var(--accent-primary)] font-bold'
                    : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
                }`}
              >
                {/* Active Indicator Pill */}
                <div
                  className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--accent-primary)]/15 shadow-2xs'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2]' : 'scale-100'}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 min-w-[14px] text-[8px] font-extrabold rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs leading-none">
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Label */}
                <span className="text-[10px] mt-0.5 tracking-tight leading-tight truncate max-w-[70px]">
                  {language === 'hi' ? tab.labelHi : tab.labelEn}
                </span>

                {/* Active Underline Dot */}
                {isActive && (
                  <motion.div
                    layoutId="android-active-tab-dot"
                    className="w-1 h-1 rounded-full bg-[var(--accent-primary)] mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
