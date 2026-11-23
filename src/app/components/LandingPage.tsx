import React, { useState } from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  MessageSquare, 
  Scale, 
  ShieldAlert, 
  Newspaper, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Star, 
  Clock, 
  Navigation, 
  Flame, 
  User, 
  LogIn, 
  Sunrise, 
  Moon, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  Bus,
  Train,
  Car,
  Plane,
  Building,
  Search,
  MapPin,
  Mic,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import darshanLogo from '../../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';
import { type UserProfile } from '../services/firebaseAuthService';

interface LandingPageProps {
  onLaunchApp: (initialMode?: 'split' | 'fullchat' | 'fullmap' | 'news' | 'safety' | 'compare', prompt?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser: UserProfile | null;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  theme: 'morning' | 'evening';
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenAuth,
  currentUser,
  language,
  setLanguage,
  theme,
  toggleTheme,
}) => {
  const isHindi = language === 'hi';
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const keyStats = [
    {
      value: '75',
      suffix: '+',
      labelEn: 'UP Districts Covered',
      labelHi: 'उ.प्र. के जिले शामिल',
      subEn: 'All spiritual & heritage circuits',
      subHi: 'समस्त पावन तीर्थ व धरोहर'
    },
    {
      value: '84',
      suffix: '+',
      labelEn: 'Sacred Ghats Mapped',
      labelHi: 'पावन घाट एवं लाइव दृश्य',
      subEn: 'With live aarti countdowns',
      subHi: 'आरती समय एवं भीड़ जानकारी'
    },
    {
      value: '5',
      suffix: '',
      labelEn: 'Transit Modes Metasearch',
      labelHi: 'यात्रा साधन तुलना',
      subEn: 'Buses, Trains, Cabs, Flights, Stays',
      subHi: 'बस, ट्रेन, टैक्सी, फ्लाइट, होटल'
    },
    {
      value: '1090',
      suffix: '',
      labelEn: 'Mission Shakti SOS',
      labelHi: 'मिशन शक्ति 1090 सुरक्षा',
      subEn: 'Voice keyword emergency guard',
      subHi: 'आवाज़ द्वारा संकट अलर्ट'
    }
  ];

  const featuredDestinations = [
    {
      id: 'ayodhya',
      titleEn: 'Shri Ram Janmabhoomi & Saryu',
      titleHi: 'श्री राम जन्मभूमि व सरयू तट',
      city: 'Ayodhya',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
      tagEn: 'Grand Temple & Aarti',
      tagHi: 'भव्य मंदिर व आरती',
      distanceEn: '2.4 km from station',
      distanceHi: 'स्टेशन से 2.4 किमी',
      crowdEn: 'Smooth flow • 15m wait',
      crowdHi: 'सुगम दर्शन • 15 मि. प्रतीक्षा',
      coords: [26.7922, 82.1998] as [number, number]
    },
    {
      id: 'varanasi',
      titleEn: 'Kashi Vishwanath & Dashashwamedh',
      titleHi: 'काशी विश्वनाथ व दशाश्वमेध घाट',
      city: 'Varanasi',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
      tagEn: 'Maha Aarti & Ganga Ghats',
      tagHi: 'महा आरती व पावन गंगा',
      distanceEn: '4.8 km from Cantt',
      distanceHi: 'कैंट से 4.8 किमी',
      crowdEn: 'Moderate • Evening Aarti 6:45 PM',
      crowdHi: 'मध्यम • शाम 6:45 बजे आरती',
      coords: [25.3109, 83.0104] as [number, number]
    },
    {
      id: 'mathura',
      titleEn: 'Krishna Janmasthan & Banke Bihari',
      titleHi: 'श्री कृष्ण जन्मस्थान व बांके बिहारी',
      city: 'Mathura & Vrindavan',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80',
      tagEn: 'Brij Bhoomi Circuit',
      tagHi: 'बृजभूमि पावन परिक्रमा',
      distanceEn: '3.1 km from Junction',
      distanceHi: 'जंक्शन से 3.1 किमी',
      crowdEn: 'Normal • Open till 9:30 PM',
      crowdHi: 'सामान्य • रात 9:30 तक खुला',
      coords: [27.4924, 77.6737] as [number, number]
    },
    {
      id: 'lucknow',
      titleEn: 'Bara Imambara & Heritage Walk',
      titleHi: 'बड़ा इमामबाड़ा व नवाब धरोहर',
      city: 'Lucknow',
      image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=800&q=80',
      tagEn: 'Culinary & Architectural Trail',
      tagHi: 'शाही वास्तु व लखनवी स्वाद',
      distanceEn: '5.2 km from Charbagh',
      distanceHi: 'चारबाग से 5.2 किमी',
      crowdEn: 'Spacious • Ideal for Walks',
      crowdHi: 'खुला वातावरण • पैदल भ्रमण हेतु उत्तम',
      coords: [26.8687, 80.9129] as [number, number]
    }
  ];

  const quickLaunchRoutes = [
    {
      id: 'kashi-3h',
      icon: '⚡',
      badge: 'Time Capped',
      titleEn: '3-Hour Kashi Express (Station Return)',
      titleHi: '3-घंटे काशी एक्सप्रेस (स्टेशन वापसी)',
      promptEn: 'I have 3 hours in Varanasi near Cantt railway station and need to return in 3 hours. Plan an itinerary covering Kashi Vishwanath, ghats, and street food.',
      promptHi: 'मेरे पास 3 घंटे का समय है, कैंट रेलवे स्टेशन के पास हूँ और 3 घंटे में वापस पहुँचना है। काशी विश्वनाथ, घाट और स्ट्रीट फूड का स्मार्ट रूट प्लान बनाओ।'
    },
    {
      id: 'ayodhya-4h',
      icon: '🛕',
      badge: 'Temple Circuit',
      titleEn: '4-Hour Ayodhya Temple & Saryu Circuit',
      titleHi: '4-घंटे अयोध्या मंदिर व सरयू आरती',
      promptEn: 'I have 4 hours in Ayodhya. Plan a time-based route for Ram Mandir, Hanumangarhi, and Saryu Aarti.',
      promptHi: 'अयोध्या में 4 घंटे का समय है, राम मंदिर, हनुमान गढ़ी और सरयू आरती का टाइमलाइन रूट बनाएं।'
    },
    {
      id: 'compare-fares',
      icon: '⚖️',
      badge: 'Metasearch',
      isCompare: true,
      titleEn: 'Compare Lucknow to Varanasi Travel Fares',
      titleHi: 'लखनऊ से वाराणसी यात्रा किराये की तुलना',
      promptEn: 'Compare bus, train and cab prices from Lucknow to Varanasi.',
      promptHi: 'लखनऊ से वाराणसी के लिए बस, ट्रेन और कैब के किराये की तुलना करें।'
    },
    {
      id: 'lucknow-food',
      icon: '🍲',
      badge: 'Food & Walk',
      titleEn: '4-Hour Lucknow Food & Heritage Trail',
      titleHi: '4-घंटे लखनऊ स्वाद एवं धरोहर पदयात्रा',
      promptEn: 'Create a 4-hour Lucknow heritage and food trail from Charbagh station covering Imambara and Tunday Kababi.',
      promptHi: 'लखनऊ चारबाग स्टेशन से 4 घंटे की हेरिटेज और टुंडे कबाबी फूड ट्रिप का समयबद्ध रूट प्लान बनाएं।'
    }
  ];

  const faqs = [
    {
      qEn: 'What makes Darshan 360 unique compared to generic travel apps?',
      qHi: 'सामान्य यात्रा ऐप्स की तुलना में दर्शन 360 कैसे अलग और खास है?',
      aEn: 'Darshan 360 is built specifically for pilgrims and cultural explorers in Uttar Pradesh. It integrates high-fidelity interactive heritage maps with live ghat telemetry, real-time multimodal price comparison (comparing UPSRTC state buses, IRCTC trains, cabs, and hotels in one view), bilingual voice AI Copilot, and an integrated 1090 Mission Shakti safety network.',
      aHi: 'दर्शन 360 उत्तर प्रदेश के तीर्थयात्रियों व पर्यटकों के लिए विशेष रूप से निर्मित है। यह 360° पावन मानचित्र, लाइव आरती व भीड़ समय, विभिन्न कंपनियों (UPSRTC बस, IRCTC ट्रेन, कैब, होटल) के किराये की तुरंत तुलना, द्विभाषी दिशा AI व 1090 मिशन शक्ति सुरक्षा का एकीकृत मंच है।'
    },
    {
      qEn: 'How does the Multimodal Travel Price Comparison Engine work?',
      qHi: 'मल्टीमॉडल यात्रा मूल्य तुलना इंजन कैसे काम करता है?',
      aEn: 'The engine queries verified schedules and prices across bus operators (UPSRTC Janrath, Shatabdi, Volvo), Indian Railways (Vande Bharat, Superfast), intercity cabs (MakeMyTrip, Uber, Ola), and certified accommodations, allowing you to filter by lowest fare, fastest travel time, or highest rating without opening multiple apps.',
      aHi: 'यह इंजन बस (UPSRTC जनरथ, वोल्वो), भारतीय रेल (वंदे भारत, एक्सप्रेस), इंटरसिटी टैक्सी और प्रमाणित होटलों के वास्तविक समय के किराये को एक साथ दिखाता है, जिससे आप न्यूनतम किराया या सबसे तेज़ मार्ग तुरंत चुन सकते हैं।'
    },
    {
      qEn: 'How does the Voice SOS & Mission Shakti 1090 integration protect travelers?',
      qHi: 'वॉयस एसओएस और मिशन शक्ति 1090 तीर्थयात्रियों की सुरक्षा कैसे करती है?',
      aEn: 'When enabled, the app listens in real-time for voice emergency keywords like "I am in danger", "बचाओ", or "help me". Once triggered, it sounds a loud emergency siren, creates a 5-digit encrypted live tracking code, and instantly prepares emergency emails/messages dispatched to your guardian and UP Police authorities.',
      aHi: 'सक्रिय करने पर, यह आपातकालीन शब्दों ("बचाओ", "I am in danger") को पहचानते ही तेज़ अलार्म सायरन बजाता है, 5-अंकों का लाइव लोकेशन कोड बनाता है और तुरंत अभिभावक व यूपी पुलिस 1090 को अलर्ट भेजता है।'
    },
    {
      qEn: 'Do I need to sign up to use the app?',
      qHi: 'क्या ऐप का उपयोग करने के लिए साइन अप करना अनिवार्य है?',
      aEn: 'No! You can instantly click "Continue as Guest / Yatri" and explore all features immediately. Creating an account with Firebase lets you sync your custom itineraries, safety contacts, and preferences across devices.',
      aHi: 'बिल्कुल नहीं! आप बिना साइन अप किए भी "अतिथि यात्री" के रूप में सभी मानचित्र, चैट और तुलना सुविधाओं का मुफ्त उपयोग कर सकते हैं। फायरबेस खाते से आपकी यात्रा योजनाएं सुरक्षित रहती हैं।'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onLaunchApp('fullmap');
      return;
    }
    onLaunchApp('fullchat', `Tell me about ${searchQuery.trim()} and plan a trip there.`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col font-sans selection:bg-[var(--accent-primary)] selection:text-white">
      
      {/* 1. Header Navigation Bar - Harmonized with App Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl glass border-b border-[var(--glass-border)] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => onLaunchApp('split')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 shadow-sm flex-shrink-0 overflow-hidden border border-[var(--glass-border)]">
              <img 
                src={darshanLogo} 
                alt="Darshan 360 Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-[var(--text-primary)] font-display">
                  DARSHAN 360°
                </h1>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 uppercase">
                  UP Tourism
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-medium hidden sm:block tracking-normal">
                {isHindi ? 'उत्तर प्रदेश पर्यटन • आधिकारिक तीर्थ एवं धरोहर पोर्टल' : 'Official Pilgrimage & Multimodal Travel OS'}
              </p>
            </div>
          </div>

          {/* Center Navigation Shortcuts (Desktop) - Segmented Pill Container */}
          <div className="hidden lg:flex glass rounded-full p-1 items-center gap-1 shadow-sm border border-[var(--glass-border)]">
            <button 
              onClick={() => onLaunchApp('fullmap')} 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MapIcon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{isHindi ? 'पावन मानचित्र' : '360° Map'}</span>
            </button>
            <button 
              onClick={() => onLaunchApp('fullchat')} 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{isHindi ? 'दिशा AI' : 'Disha AI'}</span>
            </button>
            <button 
              onClick={() => onLaunchApp('compare')} 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-orange-500/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-orange-500" />
              <span>{isHindi ? 'किराया तुलना' : 'Price Compare'}</span>
            </button>
            <button 
              onClick={() => onLaunchApp('safety')} 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>{isHindi ? 'सुरक्षा 1090' : 'Safety 1090'}</span>
            </button>
            <button 
              onClick={() => onLaunchApp('news')} 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Newspaper className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{isHindi ? 'लाइव आरती' : 'Aarti & News'}</span>
            </button>
          </div>

          {/* Right Controls: Helpline, Lang, Theme, Auth, Launch App */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher */}
            <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)] shadow-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
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
              className="glass p-2 rounded-full shadow-xs hover:scale-105 transition-all text-xs border border-[var(--glass-border)] cursor-pointer text-[var(--text-primary)]"
              title={theme === 'morning' ? 'Switch to Evening Aarti Atmosphere' : 'Switch to Morning Atmosphere'}
            >
              {theme === 'morning' ? (
                <Sunrise className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              )}
            </button>

            {/* User Auth Action */}
            {currentUser ? (
              <button
                onClick={() => onOpenAuth('signin')}
                className="glass px-2.5 py-1 rounded-full shadow-xs hover:scale-105 transition-all text-xs border border-[var(--glass-border)] hover:border-amber-500 cursor-pointer flex items-center gap-1.5"
              >
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.displayName || 'Yatri')}`}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full border border-amber-500 object-cover"
                />
                <span className="hidden sm:inline font-bold text-xs text-[var(--text-primary)] max-w-[70px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Yatri'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                className="glass px-2.5 py-1.5 rounded-full shadow-xs hover:scale-105 transition-all text-xs border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold cursor-pointer flex items-center gap-1"
              >
                <LogIn className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">{isHindi ? 'लॉग इन' : 'Sign In'}</span>
              </button>
            )}

            {/* Primary Launch App CTA */}
            <button
              onClick={() => onLaunchApp('split')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isHindi ? 'ऐप खोलें' : 'Launch App'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Mobile-First Travel Concierge & Search */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-14 sm:pb-20 border-b border-[var(--glass-border)]">
        {/* Subtle Atmospheric Light Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-orange-500/8 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          
          {/* Subtle Heritage Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-[var(--glass-border)] text-xs font-semibold text-[var(--accent-primary)] shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-spin" style={{ animationDuration: '20s' }} />
            <span>
              {isHindi ? 'उत्तर प्रदेश तीर्थ एवं मल्टीमॉडल यात्रा OS' : 'Sacred Heritage & Multimodal Travel Super-App'}
            </span>
          </div>

          {/* Main Cinematic Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[var(--text-primary)] leading-[1.15]">
              {isHindi ? 'आपकी यात्रा यहाँ से शुरू होती है।' : 'Your Journey Starts Here.'}
            </h1>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
              {isHindi 
                ? 'पावन 360° मानचित्र, लाइव आरती समय, मल्टीमॉडल किराया तुलना और 24x7 1090 महिला सुरक्षा का एकीकृत अनुभव।' 
                : 'Plan your itinerary, compare bus, train & cab fares, and explore 75+ districts with Disha AI guidance.'}
            </p>
          </div>

          {/* Fast Search Bar (Mobile-First Touch Architecture) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="max-w-xl mx-auto relative glass rounded-2xl p-1.5 sm:p-2 border border-[var(--glass-border)] shadow-lg flex items-center gap-2"
          >
            <div className="pl-2.5 sm:pl-3 text-[var(--text-secondary)]">
              <Search className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "कहाँ जाना चाहते हैं? (उदा. अयोध्या, काशी, मथुरा...)" : "Where are you going? (e.g. Ayodhya, Varanasi...)"}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/70 focus:outline-none py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 sm:py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
            >
              <span>{isHindi ? 'खोजें' : 'Search'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Category Jump Chips (Mobile One-Hand Accessible) */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-1 max-w-2xl mx-auto">
            <button
              onClick={() => onLaunchApp('compare', 'bus')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-[var(--glass-border)] hover:border-orange-500/50 text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Bus className="w-3.5 h-3.5 text-orange-500" />
              <span>{isHindi ? 'बस किराया' : 'Buses'}</span>
            </button>
            <button
              onClick={() => onLaunchApp('compare', 'train')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-[var(--glass-border)] hover:border-blue-500/50 text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Train className="w-3.5 h-3.5 text-blue-500" />
              <span>{isHindi ? 'ट्रेनें' : 'Trains'}</span>
            </button>
            <button
              onClick={() => onLaunchApp('compare', 'cab')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-[var(--glass-border)] hover:border-amber-500/50 text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Car className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHindi ? 'टैक्सी' : 'Cabs'}</span>
            </button>
            <button
              onClick={() => onLaunchApp('compare', 'hotel')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-[var(--glass-border)] hover:border-emerald-500/50 text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Building className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isHindi ? 'होटल' : 'Hotels'}</span>
            </button>
            <button
              onClick={() => onLaunchApp('fullmap')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <MapIcon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{isHindi ? '360° मैप' : '360° Map'}</span>
            </button>
            <button
              onClick={() => onLaunchApp('safety')}
              className="touch-target px-3 py-1.5 rounded-xl glass border border-red-500/30 hover:border-red-500 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>{isHindi ? '1090 सुरक्षा' : '1090 SOS'}</span>
            </button>
          </div>

          {/* Real-Time Live Ticker (Context-Aware Glance) */}
          <div className="pt-2 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="p-2.5 rounded-xl glass border border-[var(--glass-border)]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>Varanasi Aarti</span>
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {isHindi ? 'शाम 6:45 बजे' : 'Tonight @ 6:45 PM'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl glass border border-[var(--glass-border)]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Ayodhya Darshan</span>
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {isHindi ? 'सुगम कतार • 15 मि.' : 'Smooth Flow • 15m'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl glass border border-[var(--glass-border)]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                <Scale className="w-3 h-3 text-blue-500" />
                <span>UPSRTC Janrath</span>
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {isHindi ? '₹450 से शुरू' : 'From ₹450 / seat'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl glass border border-red-500/20">
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse" />
                <span>Mission Shakti</span>
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {isHindi ? '1090 वॉयस सक्रिय' : 'Voice SOS Active'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Destinations (Editorial Heritage Cards) */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--accent-primary)]">
              {isHindi ? 'प्रमुख तीर्थ व धरोहर' : 'Sacred Destinations'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)] mt-0.5">
              {isHindi ? 'उत्तर प्रदेश के पावन स्थल' : 'Explore Uttar Pradesh'}
            </h2>
          </div>
          <button
            onClick={() => onLaunchApp('fullmap')}
            className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isHindi ? 'मानचित्र पर सभी 75 जिले देखें' : 'View all 75 Districts & Ghats'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onLaunchApp('fullmap')}
              className="editorial-card group relative rounded-2xl overflow-hidden glass border border-[var(--glass-border)] cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {dest.city}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <div className="text-[11px] text-amber-300 font-semibold truncate">
                      {isHindi ? dest.tagHi : dest.tagEn}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate font-display">
                      {isHindi ? dest.titleHi : dest.titleEn}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                      {isHindi ? dest.distanceHi : dest.distanceEn}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isHindi ? dest.crowdHi : dest.crowdEn}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-0 flex items-center justify-between border-t border-[var(--glass-border)]/50 mt-1">
                <span className="text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1">
                  <span>{isHindi ? 'दर्शन करें' : 'Explore on Map'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchApp('fullchat', `Tell me details and plan for ${dest.city} - ${dest.titleEn}`);
                  }}
                  className="px-2 py-1 rounded-lg glass text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {isHindi ? 'AI से पूछें' : 'Ask Disha'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Capabilities: Unified Travel Super-App Pillars */}
      <section className="py-10 sm:py-14 bg-[var(--bg-secondary)]/50 border-y border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--accent-primary)]">
              {isHindi ? 'पाँच प्रमुख स्तंभ' : 'The Travel Super-App Pillars'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)]">
              {isHindi ? 'यात्रा का हर कदम एक ही मंच पर' : 'Everything You Need While Travelling'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Metasearch Feature */}
            <div 
              onClick={() => onLaunchApp('compare')}
              className="editorial-card p-5 sm:p-6 rounded-2xl glass border border-[var(--glass-border)] cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-[var(--text-primary)] flex items-center justify-between">
                  <span>{isHindi ? 'यात्रा किराया तुलना' : 'Travel Price Comparison'}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isHindi 
                    ? 'UPSRTC बसें, IRCTC ट्रेनें (वंदे भारत), कैब और होटल के वास्तविक किराये की एक ही स्क्रीन पर तुलना। पारदर्शी टैक्स व रद्दीकरण नीतियाँ।' 
                    : 'Compare buses, trains, cabs, and hotels with Google Flights-grade speed and fintech-level fare transparency.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-bold text-[var(--accent-primary)]">
                <span>{isHindi ? 'किराया इंजन चलाएं' : 'Compare Fares Now'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Disha AI Concierge Feature */}
            <div 
              onClick={() => onLaunchApp('fullchat')}
              className="editorial-card p-5 sm:p-6 rounded-2xl glass border border-[var(--glass-border)] cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-[var(--text-primary)] flex items-center justify-between">
                  <span>{isHindi ? 'दिशा AI यात्रा सहचर' : 'Disha AI Travel Concierge'}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isHindi 
                    ? '3-घंटे स्टेशन वापसी समय सीमा, 20 मिनट लेट होने पर 1-टैप रीप्लानिंग और हिन्दी/अंग्रेजी वॉयस बातचीत।' 
                    : 'Time-capped station return plans, dynamic 20-minute late replanning, food walks, and bilingual voice advice.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-bold text-[var(--accent-primary)]">
                <span>{isHindi ? 'दिशा AI से बात करें' : 'Talk with Disha'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Mission Shakti 1090 Safety Feature */}
            <div 
              onClick={() => onLaunchApp('safety')}
              className="editorial-card p-5 sm:p-6 rounded-2xl glass border border-red-500/20 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-[var(--text-primary)] flex items-center justify-between">
                  <span>{isHindi ? 'मिशन शक्ति 1090 सुरक्षा' : 'Mission Shakti 1090 SOS'}</span>
                  <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isHindi 
                    ? '"बचाओ" या "I am in danger" बोलने पर स्वतः तेज़ सायरन, 5-अंकों का लाइव जीपीएस ट्रैकिंग कोड और पुलिस अलर्ट।' 
                    : 'Hands-free voice keyword distress trigger, emergency siren beacon, 5-digit encrypted code, and 1090 dispatch.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                <span>{isHindi ? 'सुरक्षा केंद्र खोलें' : 'Open Safety Console'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Quick Launch Routes (1-Click Station Return Itineraries) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--accent-primary)]">
              {isHindi ? 'त्वरित मार्ग' : 'Popular Station Routes'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              {isHindi ? '1-क्लिक में यात्रा शुरू करें' : 'One-Tap Curated Itineraries'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickLaunchRoutes.map((route) => (
            <div
              key={route.id}
              onClick={() => {
                if (route.isCompare) {
                  onLaunchApp('compare', isHindi ? route.promptHi : route.promptEn);
                } else {
                  onLaunchApp('fullchat', isHindi ? route.promptHi : route.promptEn);
                }
              }}
              className="editorial-card p-4 rounded-xl glass border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{route.icon}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    {route.badge}
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {isHindi ? route.titleHi : route.titleEn}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                  {isHindi ? route.promptHi : route.promptEn}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[var(--glass-border)]/50 flex items-center justify-between text-[11px] font-bold text-[var(--accent-primary)]">
                <span>{route.isCompare ? (isHindi ? 'किराया देखें' : 'Compare Rates') : (isHindi ? 'शुरू करें' : 'Launch Route')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="bg-[var(--bg-secondary)]/30 py-10 sm:py-14 border-t border-[var(--glass-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--accent-primary)]">
              {isHindi ? 'सहायता केंद्र' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              {isHindi ? 'दर्शन 360 के बारे में जानकारी' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--glass-border)] glass overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[var(--text-primary)] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{isHindi ? faq.qHi : faq.qEn}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-[var(--accent-primary)] transition-transform flex-shrink-0 ${
                      activeFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--glass-border)]/50">
                    {isHindi ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Travel CTA Banner */}
      <section className="py-10 sm:py-14 relative overflow-hidden bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight">
            {isHindi ? 'आज ही शुरू करें अपनी पावन उत्तर प्रदेश यात्रा' : 'Begin Your Sacred Journey Today'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto">
            {isHindi 
              ? 'एआई मार्गदर्शन, वास्तविक किराया बचत और 24x7 महिला सुरक्षा के साथ बिना किसी परेशानी के घूमें।' 
              : 'Experience divine destinations with AI-backed time safety, multimodal fare savings, and peace of mind.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onLaunchApp('split')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-orange-600 font-bold text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isHindi ? 'इंटरैक्टिव ऐप खोलें' : 'Launch Interactive App'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {!currentUser && (
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-black/25 hover:bg-black/40 text-white border border-white/30 font-semibold text-xs active:scale-95 transition cursor-pointer"
              >
                {isHindi ? 'फायरबेस खाता बनाएं' : 'Create Free Account'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-[var(--glass-border)] bg-[var(--surface-card)] py-8 text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={darshanLogo} 
                alt="Darshan 360" 
                className="h-8 w-auto object-contain" 
              />
              <span className="font-bold text-sm text-[var(--text-primary)] font-display">
                DARSHAN 360°
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">
                • EduFutura Technologies Pvt. Ltd.
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="text-red-600 dark:text-red-400">🚨 1090 Women Safety</span>
              <span>•</span>
              <span>112 Police</span>
              <span>•</span>
              <span>108 Ambulance</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)]/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
            <p>© {new Date().getFullYear()} Darshan 360. All rights reserved.</p>
            <p>Made with ❤️ for Pilgrims & Cultural Explorers of Uttar Pradesh</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
