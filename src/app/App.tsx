import { useState, useEffect } from 'react';
import { MapPanel } from './components/MapPanel';
import { ChatPanel } from './components/ChatPanel';
import { NewsPanel } from './components/NewsPanel';
import { CopilotTimeline } from './components/CopilotTimeline';
import { LoadingScreen } from './components/LoadingScreen';
import { MPSitesShowcase } from './components/MPSitesShowcase';
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
  Shrink,
  ShieldAlert,
  AlertTriangle,
  Mic,
  MicOff,
  Mail,
  MessageCircle,
  Volume2,
  VolumeX,
  Scale,
  Home,
  User as UserIcon,
  LogIn,
  Globe
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import darshanLogo from '../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';
import { MPSitesShowcase } from './components/MPSitesShowcase';
import { 
  type TripItinerary, 
  insertPlaceIntoItinerary, 
  createItineraryFromSinglePlace,
  getPresetItineraries 
} from './services/copilotService';
import { type UttarPradeshDestination } from '../data/up-comprehensive-database';
import { Capacitor } from '@capacitor/core';
import { AndroidAppShell } from './components/android/AndroidAppShell';
import { WomenSafetyPanel } from './components/WomenSafetyPanel';
import { TravelComparisonPanel } from './components/TravelComparisonPanel';
import { LandingPage } from './components/LandingPage';
import { AppHomeFeed } from './components/AppHomeFeed';
import { AuthModal } from './components/AuthModal';
import { firebaseAuthService, type UserProfile } from './services/firebaseAuthService';
import { 
  getSavedGuardianSettings, 
  startVoiceSosListening, 
  stopVoiceSosListening, 
  isVoiceSosListening, 
  subscribeSosAlert, 
  subscribeListeningState,
  openEmailSos,
  openGmailSos,
  openWhatsAppSos,
  DEFAULT_GUARDIAN_EMAIL,
  type SosAlertPayload 
} from './services/voiceSosService';
import {
  playEmergencySiren,
  stopEmergencySiren,
  subscribeEmergencySiren,
  isEmergencySirenPlaying
} from './services/safetyService';

export default function App() {
  const [theme, setTheme] = useState<'morning' | 'evening'>('morning');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [layoutMode, setLayoutMode] = useState<'home' | 'split' | 'fullchat' | 'fullmap' | 'news' | 'mpsites' | 'safety' | 'compare'>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Landing Page & Firebase Auth State
  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('landing') === 'true') return true;
      if (params.get('landing') === 'false' || params.get('app') === 'true' || params.get('mode') || params.get('safety_code')) {
        return false;
      }
      return false; // Show app directly with instant toggle to Landing Page, or default to false so app loads smoothly
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => firebaseAuthService.getCurrentUser());

  useEffect(() => {
    const unsub = firebaseAuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // Synchronized state between Map, Chat & Copilot
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<[number, number] | null>(null);
  const [activeRouteWaypoints, setActiveRouteWaypoints] = useState<[number, number][] | null>(null);
  const [externalChatPrompt, setExternalChatPrompt] = useState<string | null>(null);
  const [activeItinerary, setActiveItinerary] = useState<TripItinerary | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'map' | 'copilot' | 'news' | 'safety'>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isWindowFullScreen, setIsWindowFullScreen] = useState(false);

  // Women Safety Page Code State
  const [safetyInitialCode, setSafetyInitialCode] = useState('');
  const [safetyInitialTab, setSafetyInitialTab] = useState<'share' | 'access'>('share');

  // Voice SOS Alert State
  const [isVoiceSosActive, setIsVoiceSosActive] = useState<boolean>(false);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [globalSosAlert, setGlobalSosAlert] = useState<SosAlertPayload | null>(null);

  // Global Voice SOS Subscription
  useEffect(() => {
    const settings = getSavedGuardianSettings();
    if (settings.isVoiceSosActive) {
      startVoiceSosListening();
    }
    const unsubState = subscribeListeningState((active) => {
      setIsVoiceSosActive(active);
    });
    const unsubSiren = subscribeEmergencySiren((active) => {
      setIsSirenActive(active);
    });
    const unsubAlert = subscribeSosAlert((payload) => {
      setGlobalSosAlert(payload);
      toast.error(
        language === 'hi'
          ? `🚨 आपातकालीन संकट कीवर्ड "${payload.keywordTriggered}" ट्रिगर हुआ!`
          : `🚨 Emergency Voice Distress Keyword "${payload.keywordTriggered}" Triggered!`,
        { duration: 10000 }
      );
    });
    return () => {
      unsubState();
      unsubSiren();
      unsubAlert();
    };
  }, [language]);

  // Deep-link query param listener: e.g. ?safety_code=77645 or ?sos=77645
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('safety_code') || params.get('sos') || params.get('code');
      if (code) {
        setSafetyInitialCode(code);
        setSafetyInitialTab('access');
        setLayoutMode('safety');
        setMobileTab('safety');
      }
      const mode = params.get('mode') || params.get('tab');
      if (mode === 'compare' || mode === 'fares' || mode === 'travel' || mode === 'price') {
        setLayoutMode('compare');
      }
    } catch {}
  }, []);

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
    { id: 1, icon: '🏛️', label: 'Bateshwar & Mitawali Circuit', query: 'ग्वालियर से बटेश्वर और मितावली चौसठ योगिनी मंदिर का 4 घंटे का हेरिटेज रूट और इतिहास बताएं।' },
    { id: 2, icon: '⏱️', label: 'Running 20m Late, Replan', query: 'मैं 20 मिनट लेट चल रहा हूँ, कृपया मेरी यात्रा का समय रीशेड्यूल करें और वापसी का ध्यान रखें।' },
    { id: 3, icon: '🏰', label: 'Gwalior Fort & Padhavali Trail', query: 'ग्वालियर किला और गढ़ी पढ़ावली के मध्ययुगीन स्थापत्य व नक्काशी का विस्तृत रूट व टाइमलाइन प्लान बनाएं।' },
    { id: 4, icon: '🛕', label: 'Kakanmath (Suhania) Architecture', query: 'ककनमठ शिव मंदिर सुहानिया (मुरैना) की बिना गारे की वास्तुकला, पहुंचने का मार्ग और सुरक्षा सलाह बताएं।' },
    { id: 5, icon: '📊', label: 'MP Heritage Telemetry & Feasibility', query: 'मुरैना और चंबल हेरिटेज सर्किट में अभी भ्रमण के लिए सड़क मार्ग, समय और सुरक्षा स्थिति कैसी है?' },
    { id: 6, icon: '🌿', label: 'Lesser-Known MP Heritage Gems', query: 'मध्य प्रदेश की अनदेखी ऐतिहासिक धरोहरें जैसे कोषकमहल (चंदेरी), दुबकुंड और बटेश्वर की सूची व विवरण दें।' },
    { id: 7, icon: '👑', label: 'Orchha Palaces & Ram Raja Temple', query: 'ओरछा के राजमहल, जहाँगीर महल और राम राजा मंदिर का एक दिवसीय संपूर्ण यात्रा प्लान बनाएं।' }
  ] : [
    { id: 1, icon: '🏛️', label: 'Bateshwar & Mitawali Circuit', query: 'Plan a 4-hour heritage circuit from Gwalior covering Bateshwar (200 temples) and Mitawali Chausath Yogini.' },
    { id: 2, icon: '⏱️', label: 'Running 20m Late, Replan', query: 'I am running 20 minutes late, please replan my itinerary to protect my return deadline.' },
    { id: 3, icon: '🏰', label: 'Gwalior Fort & Padhavali Trail', query: 'Create a curated trail from Gwalior Fort to Garhi Padhavali covering medieval architecture and friezes.' },
    { id: 4, icon: '🛕', label: 'Kakanmath (Suhania) Architecture', query: 'Tell me about Kakanmath Shiva Temple in Morena, its mortarless dry masonry, route access, and timings.' },
    { id: 5, icon: '📊', label: 'MP Heritage Telemetry & Feasibility', query: 'What is the current travel feasibility, road connectivity, and visiting advice for Morena heritage clusters?' },
    { id: 6, icon: '🌿', label: 'Lesser-Known MP Heritage Gems', query: 'Show me lesser-known heritage wonders of Madhya Pradesh including Koshak Mahal Chanderi and Bateshwar.' },
    { id: 7, icon: '👑', label: 'Orchha Palaces & Ram Raja Temple', query: 'Plan a day itinerary for Orchha covering Orchha Palace Complex, Chaturbhuj Temple, and Ram Raja Temple.' }
  ];

  // Full Landing Page Experience (can be opened anytime via Home button or ?landing=true)
  if (showLandingPage) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LandingPage
          onLaunchApp={(initialMode = 'split', prompt) => {
            setShowLandingPage(false);
            if (initialMode) {
              setLayoutMode(initialMode);
              if (initialMode === 'fullmap') setMobileTab('map');
              if (initialMode === 'fullchat') setMobileTab('chat');
              if (initialMode === 'news') setMobileTab('news');
              if (initialMode === 'safety') setMobileTab('safety');
            }
            if (prompt) {
              setExternalChatPrompt(prompt);
            }
          }}
          onOpenAuth={(mode = 'signin') => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
          currentUser={currentUser}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
          initialMode={authModalMode}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      </>
    );
  }

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

      {/* Global Voice SOS Alert Modal Overlay */}
      {globalSosAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-lg p-4 rounded-2xl bg-red-600 text-white shadow-2xl border-2 border-white/40 animate-in slide-in-from-top-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 font-bold text-sm">
              <AlertTriangle className="w-6 h-6 text-amber-300 animate-bounce flex-shrink-0" />
              <div>
                <div className="text-base tracking-wide font-black">🚨 EMERGENCY SOS ACTIVATED</div>
                <div className="text-xs text-red-100 font-normal">
                  Distress voice keyword detected: <strong>"{globalSosAlert.keywordTriggered}"</strong>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setGlobalSosAlert(null);
                stopEmergencySiren();
              }}
              className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 text-xs font-semibold cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="text-xs bg-black/20 p-2.5 rounded-xl space-y-1 font-mono">
            <div>📍 {globalSosAlert.address}</div>
            <div className="text-amber-200 truncate">Maps: {globalSosAlert.googleMapsUrl}</div>
            <div className="text-white/90">Guardian: {globalSosAlert.guardianEmail || DEFAULT_GUARDIAN_EMAIL}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => openGmailSos(globalSosAlert, true)}
              className="px-4 py-2 rounded-xl bg-white text-red-600 hover:bg-stone-100 text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 animate-pulse"
            >
              <Mail className="w-4 h-4 text-red-600" />
              <span>Open Gmail ({globalSosAlert.guardianEmail || DEFAULT_GUARDIAN_EMAIL})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSirenActive) {
                  stopEmergencySiren();
                } else {
                  playEmergencySiren();
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 ${
                isSirenActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-800 hover:bg-red-700'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSirenActive ? 'Stop Siren' : 'Sound Siren'}</span>
            </button>

            <button
              type="button"
              onClick={() => openWhatsAppSos(globalSosAlert)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Alert</span>
            </button>
            <a
              href="tel:112"
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112</span>
            </a>
          </div>
        </div>
      )}

      {/* Top Main Navigation Bar - Visible on all pages EXCEPT desktop fullchat */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full z-[100] glass border-b border-[var(--glass-border)] backdrop-blur-md flex-shrink-0 ${
          layoutMode === 'fullchat' ? 'lg:hidden' : ''
        }`}
      >
        <div className="w-full px-3 py-2.5 flex items-center justify-between gap-3 md:px-7">
          {/* Brand Identity - Tapping returns to App Home */}
          <div 
            onClick={() => setLayoutMode('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm flex-shrink-0 overflow-hidden border border-[var(--glass-border)] group-hover:scale-105 transition-transform">
              <img src={darshanLogo} alt="Darshan 360 logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-bold tracking-tight text-[var(--text-primary)] font-display">
                  DARSHAN 360°
                </h1>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 uppercase">
                  Madhya Pradesh
                </span>
              </div>
              <p className="text-[11px] font-medium text-[var(--text-secondary)] hidden sm:block tracking-normal">
                {language === 'hi' ? 'मध्य प्रदेश पर्यटन एवं सांस्कृतिक धरोहर अन्वेषक' : 'Madhya Pradesh Tourism & Heritage Portal'}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher - Modern Segmented Travel Navigation (Desktop Only) */}
          <div className="hidden lg:flex glass rounded-full p-1 items-center gap-1 shadow-sm border border-[var(--glass-border)]">
            {/* MP Heritage Sites Page */}
            <button
              onClick={() => setLayoutMode('home')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'home'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'मुख्य पृष्ठ' : 'Home Feed'}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'होम' : 'Home'}</span>
            </button>
            <button
              onClick={() => setLayoutMode('mpsites')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'mpsites'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'मध्य प्रदेश की धरोहर, संस्कृति और पर्यटन स्थल' : 'Madhya Pradesh Heritage Sites & Culture'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'धरोहर' : 'MP Sites'}</span>
            </button>
            <button
              onClick={() => setLayoutMode('news')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'news'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'मध्य प्रदेश की धरोहर, संस्कृति और पर्यटन स्थल' : 'Madhya Pradesh Heritage Sites & Culture'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'धरोहर स्थल' : 'Heritage Sites'}</span>
            </button>

            {/* Interactive Map */}
            <button
              onClick={() => setLayoutMode('fullmap')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'fullmap'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'मध्य प्रदेश इंटरैक्टिव मानचित्र' : 'Madhya Pradesh Interactive Map'}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'मानचित्र' : 'Explore Map'}</span>
            </button>

            {/* Split Planner */}
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'split'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'द्वैत यात्रा प्लानर (मानचित्र + परामर्श)' : 'Trip Planner (Map + Guide)'}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'टूर प्लानर' : 'Trip Planner'}</span>
            </button>

            {/* Travel Bulletins */}
            <button
              onClick={() => setLayoutMode('news')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'news'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'मध्य प्रदेश ताज़ा यात्रा बुलेटिन व स्थिति' : 'Live MP Travel Bulletins & Crowd Advisory'}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'यात्रा बुलेटिन' : 'Travel Updates'}</span>
            </button>

            {/* Travel Concierge / AI Guide */}
            <button
              onClick={() => setLayoutMode('fullchat')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'fullchat'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'दिशा AI यात्रा मार्गदर्शक' : 'AI Travel Guide'}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'hi' ? 'दिशा AI गाइड' : 'Travel Guide'}</span>
            </button>

            {/* Women Safety Page Navigation Button */}
            <button
              onClick={() => setLayoutMode('safety')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'safety'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'महिला सुरक्षा एवं 1090 आपातकालीन लोकेशन शेयरिंग पोर्टल' : 'Women Safety & Emergency 1090 Portal'}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'महिला सुरक्षा' : 'Safety 1090'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </button>

            {/* Travel Price Comparison Navigation Button */}
            <button
              onClick={() => setLayoutMode('compare')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                layoutMode === 'compare'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={language === 'hi' ? 'यात्रा किराया तुलना एवं बुकिंग पोर्टल' : 'D360 Travel Price Comparison & Booking'}
            >
              <Scale className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'hi' ? 'किराया तुलना' : 'Price Compare'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Global Voice SOS Active Indicator */}
            {isVoiceSosActive && (
              <button
                type="button"
                onClick={() => setLayoutMode('safety')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 animate-pulse cursor-pointer shadow-2xs"
                title="Voice SOS Active: Listening for 'I am in danger'"
              >
                <Mic className="w-3 h-3 text-red-500 animate-bounce" />
                <span>Voice SOS</span>
              </button>
            )}

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

          {/* Right Controls: Helpline, Language & Theme (Clean Original Layout) */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Landing Page Home Button */}
            <button
              onClick={() => setShowLandingPage(true)}
              className="glass p-2 rounded-full shadow-sm hover:scale-105 transition-all text-xs border border-[var(--glass-border)] cursor-pointer text-[var(--accent-primary)] hover:border-[var(--accent-primary)]"
              title={language === 'hi' ? 'मुख्य लैंडिंग पृष्ठ' : 'Go to Landing Page'}
            >
              <Home className="w-4 h-4" />
            </button>

            {/* User Profile / Firebase Auth Button */}
            {currentUser ? (
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="glass px-2.5 py-1 rounded-full shadow-sm hover:scale-105 transition-all text-xs border border-[var(--glass-border)] hover:border-amber-500 cursor-pointer flex items-center gap-1.5"
                title={currentUser.displayName || 'User Profile'}
              >
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.displayName || 'User')}`}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full border border-amber-500 object-cover"
                />
                <span className="hidden md:inline font-bold text-xs text-[var(--text-primary)] max-w-[80px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Yatri'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="glass px-2.5 py-1 rounded-full shadow-sm hover:scale-105 transition-all text-xs border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold cursor-pointer flex items-center gap-1.5"
                title={language === 'hi' ? 'साइन इन या पंजीकरण करें' : 'Sign In or Register'}
              >
                <LogIn className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden md:inline">{language === 'hi' ? 'लॉग इन' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Phone Helpline Button */}
            <a
              href="tel:18002330303"
              className="lg:hidden glass p-1.5 rounded-full shadow-sm text-xs border border-[var(--glass-border)] text-[var(--accent-primary)] flex items-center justify-center cursor-pointer"
              title="MP Tourism 24x7 Toll-Free Helpline: 1800-233-0303"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>

            {/* Official Toll-Free Helpline Badge (Desktop) */}
            <a
              href="tel:18002330303"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] glass border border-[var(--glass-border)] transition-colors"
              title="MP Tourism 24x7 Toll-Free Helpline: 1800-233-0303"
            >
              <PhoneCall className="w-3 h-3 text-[var(--accent-primary)]" />
              <span>1800-233-0303</span>
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
                <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm flex-shrink-0 overflow-hidden border border-[var(--glass-border)] flex items-center justify-center">
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
                      Beyond The Fort
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
                title={language === 'hi' ? 'यात्रा बुलेटिन' : 'Travel Dispatch'}
              >
                <Newspaper className="w-3.5 h-3.5 text-amber-500" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'बुलेटिन' : 'Dispatch'}</span>}
              </button>

              <button
                onClick={() => setLayoutMode('mpsites')}
                className={`col-span-2 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold hover:bg-orange-500/10 hover:border-orange-500/30 text-[var(--text-primary)] border transition-all cursor-pointer ${
                  layoutMode === 'mpsites' ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'glass border-[var(--glass-border)]'
                }`}
                title={language === 'hi' ? 'म.प्र. धरोहर स्थल' : 'MP Heritage Sites'}
              >
                <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'म.प्र. धरोहर स्थल' : 'MP Heritage Sites'}</span>}
              </button>

              <button
                onClick={() => setLayoutMode('compare')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold glass hover:bg-orange-500/15 hover:border-orange-500/40 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all cursor-pointer"
                title={language === 'hi' ? 'किराया तुलना' : 'Price Compare'}
              >
                <Scale className="w-3.5 h-3.5 text-orange-500" />
                {!isSidebarCollapsed && <span>{language === 'hi' ? 'किराया तुलना' : 'Price Compare'}</span>}
              </button>
            </div>

            {/* Curated Heritage Circuits Section */}
            <div className="flex flex-col min-h-0 flex-1 overflow-hidden mt-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] px-1 mb-1.5 flex items-center justify-between flex-shrink-0">
                  <span>{language === 'hi' ? 'प्रमुख पर्यटन परिपथ' : 'Featured Heritage Routes'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-500/10 text-orange-600 font-semibold">
                    MP Tourism
                  </span>
                </div>
              )}

              {/* Scrollable List of Curated Trails in Left Sidebar */}
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-500/20 flex-1 min-h-0">
                {sidebarQuickPrompts.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      setExternalChatPrompt(action.query);
                      if (layoutMode === 'mpsites') setLayoutMode('split');
                    }}
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
              href="tel:18002330303"
              className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] glass border border-[var(--glass-border)] transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title="MP Tourism 24x7 Toll-Free Helpline: 1800-233-0303"
            >
              <PhoneCall className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-[9px] text-[var(--text-secondary)] leading-tight">MP Tourism Helpline</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-none">1800-233-0303</p>
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
                <span className="truncate">MP Tourism Verified Intelligence</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Dual-Pillar Content Layout */}
      <main className="flex-1 w-full min-h-0 relative overflow-hidden">
        {layoutMode === 'home' && (
          <div className="w-full h-full overflow-y-auto min-h-0 flex flex-col pb-24 lg:pb-8">
            <AppHomeFeed
              onNavigateTab={(tab, prompt) => {
                if (tab === 'home') {
                  if (prompt === 'news') {
                    setLayoutMode('news');
                  } else {
                    setLayoutMode('home');
                  }
                } else if (tab === 'map') {
                  setLayoutMode('fullmap');
                  setMobileTab('map');
                } else if (tab === 'compare') {
                  setLayoutMode('compare');
                } else if (tab === 'chat') {
                  if (prompt) setExternalChatPrompt(prompt);
                  setLayoutMode('fullchat');
                  setMobileTab('chat');
                } else if (tab === 'safety') {
                  setLayoutMode('safety');
                  setMobileTab('safety');
                } else if (tab === 'copilot') {
                  setIsCopilotOpen(true);
                }
              }}
              onOpenAuth={(mode) => {
                setAuthModalMode(mode || 'signin');
                setIsAuthModalOpen(true);
              }}
              currentUser={currentUser}
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              toggleTheme={toggleTheme}
              onSelectPlaceForChat={(prompt) => {
                setExternalChatPrompt(prompt);
                setLayoutMode('fullchat');
                setMobileTab('chat');
              }}
              onFocusMapLocation={(coords) => {
                handleFocusMapLocation(coords);
                setLayoutMode('fullmap');
                setMobileTab('map');
              }}
            />
          </div>
        )}

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

        {layoutMode === 'mpsites' && (
          <div className="w-full h-full min-h-0 overflow-hidden pb-16 lg:pb-0">
            <MPSitesShowcase
              theme={theme}
              language={language}
              onFocusMapLocation={(coords) => {
                setSelectedMapCoordinates(coords);
                setMobileTab('map');
                setLayoutMode('split');
              }}
              onAskAI={(prompt) => {
                setExternalChatPrompt(prompt);
                setMobileTab('chat');
                setLayoutMode('split');
              }}
              onAddPlaceToItinerary={handleAddPlaceToItinerary}
            />
          </div>
        )}

        {layoutMode === 'safety' && (
          <div className="w-full h-full max-w-7xl mx-auto min-h-0 flex flex-col pb-16 lg:pb-0">
            <WomenSafetyPanel
              theme={theme}
              language={language}
              onAskAI={(prompt) => {
                setExternalChatPrompt(prompt);
                setMobileTab('chat');
                setLayoutMode('split');
              }}
              initialCode={safetyInitialCode}
              initialTab={safetyInitialTab}
              onOpenMap={() => setLayoutMode('map')}
            />
          </div>
        )}

        {layoutMode === 'compare' && (
          <div className="w-full h-full max-w-7xl mx-auto min-h-0 flex flex-col pb-16 lg:pb-0">
            <TravelComparisonPanel
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

      {/* Floating Disha AI Concierge Action (Mobile Only, Bottom-Right) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-[95]">
        <button
          onClick={() => {
            setLayoutMode('fullchat');
            setMobileTab('chat');
          }}
          className="touch-target px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:opacity-95 text-white shadow-xl shadow-amber-600/30 flex items-center gap-2 border border-white/20 active:scale-95 transition-all cursor-pointer"
          title={language === 'hi' ? 'दिशा AI से बात करें' : 'Talk to Disha AI'}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold font-sans tracking-wide">
            {language === 'hi' ? 'दिशा AI' : 'Disha AI'}
          </span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed, Safe-Area Aware, 48px+ Targets) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[90] glass border-t border-[var(--glass-border)] backdrop-blur-xl px-2 py-1 flex items-center justify-around shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        
        {/* 1. Home Feed */}
        <button
          onClick={() => setLayoutMode('home')}
          className={`touch-target flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer ${
            layoutMode === 'home'
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
          title="Home"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'होम' : 'Home'}</span>
          {layoutMode === 'home' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>

        {/* 2. Interactive Map */}
        <button
          onClick={() => {
            setLayoutMode('fullmap');
            setMobileTab('map');
          }}
          className={`touch-target flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer ${
            layoutMode === 'fullmap' || (layoutMode === 'split' && mobileTab === 'map')
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
          title="Explore Map"
        >
          <MapIcon className="w-4 h-4" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'मानचित्र' : 'Explore'}</span>
          {(layoutMode === 'fullmap' || (layoutMode === 'split' && mobileTab === 'map')) && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>

        {/* 3. MP Heritage Sites */}
        <button
          onClick={() => {
            setLayoutMode('mpsites');
            setMobileTab('news');
          }}
          className={`touch-target flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer relative ${
            layoutMode === 'mpsites'
              ? 'text-[var(--accent-primary)] font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
          title="MP Sites"
        >
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'धरोहर' : 'MP Sites'}</span>
          {layoutMode === 'mpsites' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          )}
        </button>

        {/* 4. Compare Metasearch */}
        <button
          onClick={() => {
            setLayoutMode('compare');
          }}
          className={`touch-target flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer ${
            layoutMode === 'compare'
              ? 'text-orange-600 font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]'
          }`}
          title="Compare Fares"
        >
          <Scale className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-medium">{language === 'hi' ? 'किराया' : 'Compare'}</span>
          {layoutMode === 'compare' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-orange-600" />
          )}
        </button>

        {/* 5. Safety 1090 SOS */}
        <button
          onClick={() => {
            setLayoutMode('safety');
            setMobileTab('safety');
          }}
          className={`touch-target flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer ${
            layoutMode === 'safety'
              ? 'text-red-600 font-bold'
              : 'text-[var(--text-secondary)] font-medium hover:text-red-500'
          }`}
          title="Women Safety 1090"
        >
          <div className="relative">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-[10px] font-medium">{language === 'hi' ? 'सुरक्षा' : 'Safety'}</span>
          {layoutMode === 'safety' && (
            <motion.div layoutId="activeMobileIndicator" className="w-1.5 h-1.5 rounded-full bg-red-600" />
          )}
        </button>
      </nav>

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

    </div>
  );
}