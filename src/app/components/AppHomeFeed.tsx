import React, { useState } from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  MessageSquare, 
  Scale, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Star, 
  Clock, 
  MapPin, 
  Search, 
  Mic, 
  Bus, 
  Train, 
  Car, 
  Hotel, 
  Plane, 
  ShieldCheck, 
  ChevronRight, 
  Bell, 
  Sunrise, 
  Moon, 
  Globe, 
  User, 
  LogIn, 
  Zap, 
  Navigation, 
  Route, 
  TrendingUp, 
  Volume2,
  VolumeX
} from 'lucide-react';
import darshanLogo from '../../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';
import { type UserProfile } from '../services/firebaseAuthService';

interface AppHomeFeedProps {
  onNavigateTab: (tab: 'home' | 'map' | 'compare' | 'chat' | 'safety' | 'copilot', prompt?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser: UserProfile | null;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  theme: 'morning' | 'evening';
  toggleTheme: () => void;
  onSelectPlaceForChat?: (prompt: string) => void;
  onFocusMapLocation?: (coords: [number, number]) => void;
}

export const AppHomeFeed: React.FC<AppHomeFeedProps> = ({
  onNavigateTab,
  onOpenAuth,
  currentUser,
  language,
  setLanguage,
  theme,
  toggleTheme,
  onSelectPlaceForChat,
  onFocusMapLocation,
}) => {
  const isHindi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [quickOrigin, setQuickOrigin] = useState('Kanpur');
  const [quickDest, setQuickDest] = useState('Varanasi');
  const [isPlayingChant, setIsPlayingChant] = useState(false);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const playBellStroke = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      [520, 1040, 1560].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        const initialVol = 0.12 / (i + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.2);
      });
    } catch {
      // Audio context safety
    }
  };

  const toggleTempleChant = () => {
    if (isPlayingChant) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlayingChant(false);
    } else {
      playBellStroke();
      intervalRef.current = window.setInterval(playBellStroke, 3200);
      setIsPlayingChant(true);
    }
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const popularDestinations = [
    {
      id: 'ayodhya',
      nameEn: 'Ayodhya Dham',
      nameHi: 'अयोध्या धाम',
      subtitleEn: 'Ram Janmabhoomi & Saryu',
      subtitleHi: 'श्री राम जन्मभूमि व सरयू',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
      crowdEn: 'Smooth • 15m wait',
      crowdHi: 'सुगम • 15 मि. प्रतीक्षा',
      tag: 'Grand Temple',
      badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      coordinates: [26.7922, 82.1998] as [number, number]
    },
    {
      id: 'varanasi',
      nameEn: 'Kashi Vishwanath',
      nameHi: 'काशी विश्वनाथ',
      subtitleEn: 'Dashashwamedh Maha Aarti',
      subtitleHi: 'दशाश्वमेध महा आरती',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
      crowdEn: 'Moderate • Aarti 6:45 PM',
      crowdHi: 'मध्यम • आरती 6:45 शाम',
      tag: 'Sacred Ghats',
      badgeColor: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      coordinates: [25.3109, 83.0104] as [number, number]
    },
    {
      id: 'mathura',
      nameEn: 'Mathura & Vrindavan',
      nameHi: 'मथुरा व वृंदावन',
      subtitleEn: 'Banke Bihari & Janmasthan',
      subtitleHi: 'बांके बिहारी व जन्मस्थान',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&q=80',
      crowdEn: 'Normal • Open till 9:30 PM',
      crowdHi: 'सामान्य • रात 9:30 तक',
      tag: 'Brij Bhoomi',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      coordinates: [27.5050, 77.6830] as [number, number]
    },
    {
      id: 'lucknow',
      nameEn: 'Lucknow Heritage',
      nameHi: 'लखनऊ हेरिटेज',
      subtitleEn: 'Bara Imambara & Tunday',
      subtitleHi: 'बड़ा इमामबाड़ा व स्वाद',
      image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=600&q=80',
      crowdEn: 'Comfortable • Food Trail',
      crowdHi: 'सुखद • स्ट्रीट फूड वॉक',
      tag: 'Culture',
      badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      coordinates: [26.8690, 80.9130] as [number, number]
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onNavigateTab('map');
      return;
    }
    onNavigateTab('chat', `Tell me about ${searchQuery.trim()} and plan a trip.`);
  };

  return (
    <div className="w-full min-h-full pb-28 pt-2 px-3 sm:px-5 space-y-4 max-w-2xl mx-auto font-sans select-none animate-in fade-in duration-200">
      
      {/* 1. App Native Top Bar (Location, Profile, Atmosphere) */}
      <div className="flex items-center justify-between gap-2 pt-1 pb-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-white p-1 shadow-sm border border-[var(--glass-border)] flex-shrink-0 flex items-center justify-center">
            <img src={darshanLogo} alt="D360 Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)] flex-shrink-0" />
              <span className="text-xs font-black text-[var(--text-primary)] truncate">
                {isHindi ? 'उत्तर प्रदेश तीर्थ • लाइव' : 'Uttar Pradesh • Live'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] truncate">
              {currentUser ? `${isHindi ? 'नमस्ते' : 'Namaste'}, ${currentUser.displayName?.split(' ')[0]}` : (isHindi ? 'अतिथि यात्री सत्र' : 'Pilgrim Guest Mode')}
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-2 py-1 rounded-xl glass border border-[var(--glass-border)] text-[10px] font-bold text-[var(--text-primary)] active:scale-95 transition cursor-pointer"
          >
            {language === 'en' ? 'हिन्दी' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-primary)] active:scale-95 transition cursor-pointer"
            title={theme === 'morning' ? 'Evening Mode' : 'Morning Mode'}
          >
            {theme === 'morning' ? <Sunrise className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <button
              onClick={() => onOpenAuth('signin')}
              className="w-8 h-8 rounded-full border-2 border-amber-500 overflow-hidden shadow-xs cursor-pointer active:scale-95 transition"
            >
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.displayName || 'Yatri')}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-2.5 py-1 rounded-xl bg-[var(--accent-primary)] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>{isHindi ? 'लॉग इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Panchang & Muhurat Ticker Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-[var(--glass-border)] flex-shrink-0">
          <Sunrise className="w-3 h-3 text-amber-500" />
          <span>{isHindi ? 'काशी: 28°C सुहावना' : 'Kashi: 28°C Pleasant'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-[var(--glass-border)] flex-shrink-0">
          <Flame className="w-3 h-3 text-orange-500" />
          <span>{isHindi ? 'संध्या आरती: 18:45 IST' : 'Sunset Aarti: 18:45 IST'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-[var(--glass-border)] flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">
          <Sparkles className="w-3 h-3" />
          <span>{isHindi ? 'अमृत काल मुहूर्त' : 'Amrit Kaal Muhurat'}</span>
        </div>
      </div>

      {/* Sacred Ambient Sound Mini-Player */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl glass border border-[var(--glass-border)]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTempleChant}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isPlayingChant ? 'bg-amber-500 text-white shadow-md animate-pulse' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
            title={isPlayingChant ? 'Pause Aarti Bell' : 'Play Aarti Bell'}
          >
            {isPlayingChant ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{isHindi ? 'पवित्र मंदिर ध्वनि तरंग' : 'Temple Aarti Bell Ambience'}</span>
              {isPlayingChant && (
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-amber-500 animate-bounce rounded-full" />
                  <span className="w-1 h-2 bg-amber-500 animate-bounce [animation-delay:0.15s] rounded-full" />
                  <span className="w-1 h-4 bg-amber-500 animate-bounce [animation-delay:0.3s] rounded-full" />
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {isPlayingChant ? (isHindi ? 'प्रशांत ध्यान ध्वनि बज रही है' : 'Peaceful meditative bell active') : (isHindi ? 'टैप करके मंदिर घंटियों की ध्वनि सुनें' : 'Tap to play meditative sacred bells')}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('copilot')}
          className="text-[10px] font-bold text-[var(--accent-primary)] hover:underline cursor-pointer flex-shrink-0"
        >
          {isHindi ? 'आरती शेड्यूल' : 'Aarti Times'}
        </button>
      </div>

      {/* 2. Instant Search Bar (Native App Style with Mic) */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl glass border border-[var(--glass-border)] shadow-sm px-3.5 py-2.5 focus-within:border-[var(--accent-primary)] transition">
          <Search className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'मंदिर, घाट, ट्रेन, बस या शहर खोजें...' : 'Search temples, ghats, buses, trains...'}
            className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onNavigateTab('chat', 'I want to ask something using voice.')}
            className="p-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--accent-primary)] cursor-pointer"
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* 3. Native App 6-Service Action Grid (Touch-First 48px+) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        
        {/* Service 1: 360 Map */}
        <button
          onClick={() => onNavigateTab('map')}
          className="editorial-card p-3 rounded-2xl glass border border-[var(--glass-border)] flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <MapIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {isHindi ? '360° मैप' : '360° Map'}
          </span>
          <span className="text-[9px] text-[var(--text-secondary)] -mt-1">
            {isHindi ? 'घाट व मंदिर' : 'Sacred Ghats'}
          </span>
        </button>

        {/* Service 2: Travel Metasearch */}
        <button
          onClick={() => onNavigateTab('compare')}
          className="editorial-card p-3 rounded-2xl glass border border-[var(--glass-border)] flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {isHindi ? 'किराया तुलना' : 'Fare Compare'}
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold -mt-1">
            {isHindi ? 'बस • ट्रेन • कैब' : 'Bus, Train, Cab'}
          </span>
        </button>

        {/* Service 3: Disha AI Concierge */}
        <button
          onClick={() => onNavigateTab('chat')}
          className="editorial-card p-3 rounded-2xl glass border border-[var(--glass-border)] flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {isHindi ? 'दिशा AI' : 'Disha AI'}
          </span>
          <span className="text-[9px] text-[var(--text-secondary)] -mt-1">
            {isHindi ? 'तीर्थ सहचर' : 'Voice Assistant'}
          </span>
        </button>

        {/* Service 4: Women Safety 1090 */}
        <button
          onClick={() => onNavigateTab('safety')}
          className="editorial-card p-3 rounded-2xl glass border border-red-500/25 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform relative">
            <ShieldAlert className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
            {isHindi ? 'सुरक्षा 1090' : 'Safety 1090'}
          </span>
          <span className="text-[9px] text-[var(--text-secondary)] -mt-1">
            {isHindi ? 'वॉयस एसओएस' : 'Voice Beacon'}
          </span>
        </button>

        {/* Service 5: Trip Copilot Timeline */}
        <button
          onClick={() => onNavigateTab('copilot')}
          className="editorial-card p-3 rounded-2xl glass border border-[var(--glass-border)] flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Route className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {isHindi ? 'कोपायलट' : 'Trip Plan'}
          </span>
          <span className="text-[9px] text-[var(--text-secondary)] -mt-1">
            {isHindi ? 'स्टेशन वापसी' : 'Timeline Guard'}
          </span>
        </button>

        {/* Service 6: Live Aarti & News */}
        <button
          onClick={() => onNavigateTab('home', 'news')}
          className="editorial-card p-3 rounded-2xl glass border border-[var(--glass-border)] flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition group"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {isHindi ? 'लाइव आरती' : 'Live Aarti'}
          </span>
          <span className="text-[9px] text-[var(--text-secondary)] -mt-1">
            {isHindi ? 'भीड़ टेलीमेट्री' : 'Ghat Timings'}
          </span>
        </button>
      </div>

      {/* 4. Live Sacred Telemetry Card (Like Airline Boarding Pass / Live Activity) */}
      <div 
        onClick={() => onNavigateTab('map')}
        className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg shadow-orange-600/20 cursor-pointer active:scale-[0.99] transition relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-amber-200 animate-bounce" />
            <span>{isHindi ? 'लाइव आरती अलर्ट' : 'Live Aarti Broadcast'}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-100 font-bold">
            18:45 IST
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black font-display leading-tight">
              {isHindi ? 'दशाश्वमेध घाट • गंगा महा आरती' : 'Dashashwamedh Ghat • Ganga Aarti'}
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              {isHindi ? 'कतार प्रतीक्षा: 15 मिनट • नाव बुकिंग उपलब्ध' : 'Queue wait: 15 mins • Boat rides available'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* 5. Instant Travel Compare Strip (Bus vs Train vs Cab) */}
      <div className="p-4 rounded-2xl glass border border-[var(--glass-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
              {isHindi ? 'तुरंत किराया तुलना' : 'Compare Fares'}
            </span>
          </div>
          <button 
            onClick={() => onNavigateTab('compare')}
            className="text-[11px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{isHindi ? 'विस्तार से देखें' : 'View All'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
            <span className="text-[10px] text-[var(--text-secondary)] block">{isHindi ? 'कहाँ से' : 'From'}</span>
            <span className="font-bold text-[var(--text-primary)]">Kanpur Central</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
            <span className="text-[10px] text-[var(--text-secondary)] block">{isHindi ? 'कहाँ तक' : 'To'}</span>
            <span className="font-bold text-[var(--text-primary)]">Varanasi Cantt</span>
          </div>
        </div>

        {/* Live Provider Price Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div 
            onClick={() => onNavigateTab('compare', 'bus')}
            className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 cursor-pointer active:scale-95 transition"
          >
            <span className="text-[10px] text-orange-700 dark:text-orange-300 font-bold block">UPSRTC Bus</span>
            <span className="text-xs font-black text-[var(--text-primary)]">₹450</span>
          </div>
          <div 
            onClick={() => onNavigateTab('compare', 'train')}
            className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 cursor-pointer active:scale-95 transition"
          >
            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block">IRCTC Train</span>
            <span className="text-xs font-black text-[var(--text-primary)]">₹620</span>
          </div>
          <div 
            onClick={() => onNavigateTab('compare', 'cab')}
            className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer active:scale-95 transition"
          >
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">Direct Cab</span>
            <span className="text-xs font-black text-[var(--text-primary)]">₹1,850</span>
          </div>
        </div>
      </div>

      {/* 6. Popular Destinations Swipe Carousel */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
            {isHindi ? 'लोकप्रिय तीर्थ स्थल' : 'Popular Destinations'}
          </span>
          <button 
            onClick={() => onNavigateTab('map')}
            className="text-[11px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{isHindi ? 'सभी 75 जिले' : 'View All'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                if (onFocusMapLocation && dest.coordinates) {
                  onFocusMapLocation(dest.coordinates);
                } else {
                  onNavigateTab('map');
                }
              }}
              className="editorial-card rounded-2xl overflow-hidden glass border border-[var(--glass-border)] cursor-pointer group active:scale-98 transition flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={dest.image} alt={dest.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold ${dest.badgeColor} backdrop-blur-md`}>
                  {dest.tag}
                </span>
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <h4 className="font-bold text-xs truncate font-display">
                    {isHindi ? dest.nameHi : dest.nameEn}
                  </h4>
                  <p className="text-[10px] text-amber-200 truncate">
                    {dest.crowdEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Quick 1-Click Itinerary Curations (Station Return) */}
      <div className="p-4 rounded-2xl glass border border-[var(--glass-border)] space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
            {isHindi ? '1-क्लिक स्टेशन वापसी प्लान' : '1-Click Station Itineraries'}
          </span>
        </div>

        <div className="space-y-2">
          <div
            onClick={() => onNavigateTab('chat', 'I have 3 hours in Varanasi near Cantt railway station and need to return in 3 hours. Plan an itinerary covering Kashi Vishwanath, ghats, and street food.')}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex items-center justify-between cursor-pointer hover:border-[var(--accent-primary)] active:scale-98 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <h5 className="font-bold text-xs text-[var(--text-primary)]">
                  {isHindi ? '3-घंटे काशी एक्सप्रेस' : '3-Hour Kashi Express'}
                </h5>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {isHindi ? 'कैंट स्टेशन वापसी गारंटी' : 'Station return deadline guard'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </div>

          <div
            onClick={() => onNavigateTab('chat', 'I have 4 hours in Ayodhya. Plan a time-based route for Ram Mandir, Hanumangarhi, and Saryu Aarti.')}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex items-center justify-between cursor-pointer hover:border-[var(--accent-primary)] active:scale-98 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🛕</span>
              <div>
                <h5 className="font-bold text-xs text-[var(--text-primary)]">
                  {isHindi ? '4-घंटे अयोध्या दर्शन' : '4-Hour Ayodhya Circuit'}
                </h5>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {isHindi ? 'राम मंदिर, हनुमानगढ़ी व सरयू' : 'Ram Mandir, Hanumangarhi & Saryu'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </div>
        </div>
      </div>

    </div>
  );
};
