import { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Flame,
  ChevronRight,
  Info,
  Compass,
  PhoneCall,
  Calendar,
  Eye,
  Building2,
  Bookmark,
  Share2,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Radio,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  scrapeLiveUPNews, 
  filterScrapedNews, 
  ALL_UP_DISTRICTS, 
  DISTRICT_CROWD_REGISTRY, 
  computeLiveDistrictTelemetry,
  type ScrapedNewsItem, 
  type DistrictCrowdStatus 
} from '../services/newsScraperService';
import { speakMessage, stopSpeaking, isSpeechSynthesisSupported } from '../services/speechService';

interface NewsPanelProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onAskAI: (prompt: string) => void;
}

export function NewsPanel({ theme, language, onAskAI }: NewsPanelProps) {
  const [newsItems, setNewsItems] = useState<ScrapedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExpandedNewsId, setActiveExpandedNewsId] = useState<string | null>(null);

  // Live real-time clock & auto-refresh state
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(45);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveJitterTicker, setLiveJitterTicker] = useState<number>(0);

  // Real-time IST clock timer (ticks every second)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      setCurrentTimeStr(
        istDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Auto-refresh countdown loop (every 45s updates dynamic queues & news)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          silentRefresh();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initial news fetch
  useEffect(() => {
    loadNews();
  }, []);

  // Stop speech if unmounting
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const items = await scrapeLiveUPNews();
      setNewsItems(items);
      setLiveJitterTicker(prev => prev + 1);
    } catch (err) {
      console.error('Error loading live UP dispatches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const silentRefresh = async () => {
    try {
      const items = await scrapeLiveUPNews();
      setNewsItems(items);
      setLiveJitterTicker(prev => prev + 1);
    } catch (err) {
      console.error('Error silently refreshing dispatches:', err);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const items = await scrapeLiveUPNews();
      setNewsItems(items);
      setLiveJitterTicker(prev => prev + 1);
      setCountdown(45);
    } catch (err) {
      console.error('Error refreshing travel dispatches:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Audio Broadcast: Disha AI reads the live bulletin
  const toggleAudioBroadcast = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const leadStory = newsItems[0];
    const mathura = DISTRICT_CROWD_REGISTRY.mathura;
    const ayodhya = DISTRICT_CROWD_REGISTRY.ayodhya;
    const varanasi = DISTRICT_CROWD_REGISTRY.varanasi;
    const prayagraj = DISTRICT_CROWD_REGISTRY.prayagraj;

    let broadcastText = '';
    if (language === 'hi') {
      broadcastText = `यह उत्तर प्रदेश पर्यटन ग्राउंड इंटेलिजेंस का लाइव यात्रा बुलेटिन है। वर्तमान समय ${currentTimeStr}। मथुरा वृन्दावन में लाइव कतार समय ${mathura.estimatedWaitMinutes} मिनट। अयोध्या राम मंदिर में ${ayodhya.estimatedWaitMinutes} मिनट। काशी विश्वनाथ में ${varanasi.estimatedWaitMinutes} मिनट, और प्रयागराज संगम पर ${prayagraj.estimatedWaitMinutes} मिनट की प्रतीक्षा है। मुख्य समाचार: ${leadStory ? leadStory.title.hi : 'समस्त तीर्थों में दर्शन व्यवस्था सुचारू है।'}`;
    } else {
      broadcastText = `This is the live Uttar Pradesh Tourism Ground Dispatch. Current time is ${currentTimeStr}. Live queue wait times: Mathura Vrindavan recording approximately ${mathura.estimatedWaitMinutes} minutes, Ayodhya Ram Mandir ${ayodhya.estimatedWaitMinutes} minutes, Kashi Vishwanath ${varanasi.estimatedWaitMinutes} minutes, and Prayagraj Sangam ${prayagraj.estimatedWaitMinutes} minutes. Top headline: ${leadStory ? leadStory.title.en : 'All major shrine corridors are operating smoothly.'}`;
    }

    setIsPlayingAudio(true);
    speakMessage({
      text: broadcastText,
      language,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const filteredItems = filterScrapedNews(newsItems, selectedDistrict, selectedCategory, searchQuery);

  // Pick lead editorial story
  const heroStory = newsItems.find(item => item.isBreaking) || newsItems[0];
  const secondaryStories = filteredItems.filter(item => item.id !== heroStory?.id || selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery !== '');
  const storiesToDisplay = (selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery.trim() !== '') ? filteredItems : secondaryStories;

  const categories = [
    { id: 'all', name: { en: 'All Dispatches', hi: 'समस्त बुलेटिन' }, icon: Newspaper },
    { id: 'crowd_darshan', name: { en: 'Temple Queues & Darshan', hi: 'दर्शन व कतार स्थिति' }, icon: Flame },
    { id: 'festival_mela', name: { en: 'Festivals & Sacred Melas', hi: 'पर्व व पावन मेले' }, icon: Sparkles },
    { id: 'infrastructure', name: { en: 'Transit & Corridors', hi: 'परिवहन व कॉरिडोर' }, icon: TrendingUp },
    { id: 'safety_alert', name: { en: 'Traveler Advisories', hi: 'प्रशासनिक एडवाइजरी' }, icon: ShieldAlert }
  ];

  // Active district crowd dossier if selected
  const activeDistrictTelemetry: DistrictCrowdStatus | undefined = 
    selectedDistrict !== 'all' ? computeLiveDistrictTelemetry(selectedDistrict) : undefined;

  // Real-time ticker text computed dynamically
  const mathuraStatus = computeLiveDistrictTelemetry('mathura');
  const ayodhyaStatus = computeLiveDistrictTelemetry('ayodhya');
  const varanasiStatus = computeLiveDistrictTelemetry('varanasi');
  const prayagrajStatus = computeLiveDistrictTelemetry('prayagraj');
  const mirzapurStatus = computeLiveDistrictTelemetry('mirzapur');
  const chitrakootStatus = computeLiveDistrictTelemetry('chitrakoot');

  const dynamicTickerText = language === 'hi'
    ? `🔴 लाइव कतार टेलीमेट्री (${currentTimeStr}): मथुरा-वृन्दावन: ${mathuraStatus.waitTimeFormatted.hi} • अयोध्या: ${ayodhyaStatus.waitTimeFormatted.hi} • काशी विश्वनाथ: ${varanasiStatus.waitTimeFormatted.hi} • प्रयागराज संगम: ${prayagrajStatus.waitTimeFormatted.hi} • विंध्याचल: ${mirzapurStatus.waitTimeFormatted.hi} • चित्रकूट: ${chitrakootStatus.waitTimeFormatted.hi} • सरकारी अधिकृत दर चार्ट देखें • आपातकालीन सहायता 112`
    : `🔴 LIVE QUEUE TELEMETRY (${currentTimeStr}): Mathura-Vrindavan: ${mathuraStatus.waitTimeFormatted.en} • Ayodhya: ${ayodhyaStatus.waitTimeFormatted.en} • Kashi Vishwanath: ${varanasiStatus.waitTimeFormatted.en} • Prayagraj Sangam: ${prayagrajStatus.waitTimeFormatted.en} • Vindhyachal: ${mirzapurStatus.waitTimeFormatted.en} • Chitrakoot: ${chitrakootStatus.waitTimeFormatted.en} • Official pre-booking passes only • Tourist Helpline 112`;

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col p-4 md:p-8 space-y-6 scrollbar-thin">
      {/* Editorial Masthead with Live Telemetry Pulse */}
      <header className="border-b border-[var(--glass-border)] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Live Status Indicators */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>{language === 'hi' ? 'लाइव ग्राउंड टेलीमेट्री सक्रिय' : 'LIVE GROUND TELEMETRY ACTIVE'}</span>
            </span>

            <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-primary)]/25 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {currentTimeStr || 'IST Live'}
            </span>

            <span className="text-[11px] text-[var(--text-secondary)] font-medium">
              • {language === 'hi' ? `स्वतः रिफ्रेश: ${countdown}s` : `Auto-sync in ${countdown}s`}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-editorial flex items-center gap-3">
            <span>{language === 'hi' ? 'उत्तर प्रदेश यात्रा बुलेटिन व लाइव टेलीमेट्री' : 'Uttar Pradesh Live Travel Dispatches'}</span>
          </h2>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? '25 से अधिक जनपदों व तीर्थों की वास्तविक समय कतार स्थिति, दर्शन परामर्श, आरती समय और सत्यापित प्रशासनिक समाचार।'
              : 'Real-time queue wait times, time-of-day devotee footfall, official advisories, and live transit reports across 25+ districts of Uttar Pradesh.'}
          </p>
        </div>

        {/* Action Controls: Audio Broadcast & Manual Refresh */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
          {/* Listen to Live Dispatch */}
          {isSpeechSynthesisSupported() && (
            <button
              onClick={toggleAudioBroadcast}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-stone-900 border-amber-400 shadow-md animate-pulse'
                  : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--glass-border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] shadow-sm'
              }`}
              title={isPlayingAudio ? 'Stop audio dispatch' : 'Listen to live audio bulletin'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-900" />
                  <span>{language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>{language === 'hi' ? 'बुलेटिन सुनें' : 'Listen Live'}</span>
                </>
              )}
            </button>
          )}

          {/* Instant Sync */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="Refresh verified reports"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? 'लाइव सिंक' : 'Sync Live'}</span>
          </button>
        </div>
      </header>

      {/* Dynamic Urgent Travel Advisory Ticker */}
      <div className="editorial-card rounded-xl p-3 md:p-3.5 border-l-4 border-l-[var(--accent-primary)] flex items-center gap-3 overflow-hidden shadow-sm">
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-white flex items-center gap-1.5 flex-shrink-0">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          {language === 'hi' ? 'लाइव एडवाइजरी' : 'Live Advisory'}
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee text-xs font-medium text-[var(--text-primary)]">
            {dynamicTickerText}
          </div>
        </div>
      </div>

      {/* Live Pilgrim Flow & Queue Telemetry Index across 25+ Districts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {language === 'hi' ? '25+ जनपदों की लाइव कतार व दर्शन स्थिति' : 'Live Pilgrim Flow & Queue Index (25+ Districts)'}
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {language === 'hi' ? 'जिले पर क्लिक करके विस्तृत रिपोर्ट देखें' : 'Click any district for full live dossier'}
          </span>
        </div>

        {/* Scrollable & Filterable District Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
          {ALL_UP_DISTRICTS.filter(d => d.id !== 'all').map((d) => {
            const data = computeLiveDistrictTelemetry(d.id);
            const isSelected = selectedDistrict === d.id;
            const isExtreme = data.crowdLevel === 'extreme';
            const isHigh = data.crowdLevel === 'high';
            const isModerate = data.crowdLevel === 'moderate';

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(isSelected ? 'all' : d.id)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 shadow-md ring-1 ring-[var(--accent-primary)]'
                    : 'editorial-card hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-secondary)]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate" title={d.name}>
                    {language === 'hi' ? d.hindi.split(' ')[0] : d.name.split(' ')[0]}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isExtreme ? 'bg-red-500 animate-ping' :
                    isHigh ? 'bg-amber-600' :
                    isModerate ? 'bg-amber-400' : 'bg-emerald-500'
                  }`} />
                </div>
                
                <div className="text-[11px] font-semibold text-[var(--accent-primary)] truncate">
                  {data.estimatedWaitMinutes > 0 ? `~${data.estimatedWaitMinutes}m wait` : 'Serene Flow'}
                </div>

                <div className={`text-[9px] font-semibold mt-1.5 px-1.5 py-0.5 rounded text-center truncate ${
                  isExtreme ? 'bg-red-500/15 text-red-700 dark:text-red-300' :
                  isHigh ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200' :
                  isModerate ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' :
                  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {isExtreme ? 'Peak Rush' :
                   isHigh ? 'Heavy Rush' :
                   isModerate ? 'Moderate' : 'Serene'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected District Real-Time Telemetry Spotlight (Deep-Dive Dossier) */}
      <AnimatePresence>
        {activeDistrictTelemetry && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="editorial-card rounded-2xl p-5 md:p-6 border-l-4 border-l-[var(--accent-primary)] shadow-lg relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] font-editorial">
                    📍 {language === 'hi' ? activeDistrictTelemetry.hindiDistrict : activeDistrictTelemetry.district} — {language === 'hi' ? 'लाइव दर्शन व मार्ग परामर्श' : 'Live Pilgrimage Telemetry'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeDistrictTelemetry.crowdLevel === 'extreme' ? 'bg-red-600 text-white' :
                    activeDistrictTelemetry.crowdLevel === 'high' ? 'bg-amber-600 text-white' :
                    activeDistrictTelemetry.crowdLevel === 'moderate' ? 'bg-amber-500 text-stone-900' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {activeDistrictTelemetry.crowdLevelText[language]}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
                  {activeDistrictTelemetry.feasibilityVerdict[language]}
                </p>
              </div>

              {/* Ask Concierge Quick Prompt */}
              <button
                onClick={() => onAskAI(
                  language === 'hi' 
                    ? `${activeDistrictTelemetry.hindiDistrict} में वर्तमान में ${activeDistrictTelemetry.waitTimeFormatted.hi} है। दर्शन का सही समय और सुगम मार्ग क्या रहेगा?`
                    : `In ${activeDistrictTelemetry.district}, live queue wait is currently ${activeDistrictTelemetry.waitTimeFormatted.en}. What is the recommended arrival slot and route?`
                )}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto flex-shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'दिशा एआई से सलाह लें' : 'Consult Disha AI'}</span>
              </button>
            </div>

            {/* Travel Insights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'पीक घंटे (अत्यधिक भीड़):' : 'Peak Rush Hours:'}
                </span>
                <span className="text-xs font-medium text-[var(--text-primary)] leading-tight block">
                  {activeDistrictTelemetry.peakHours[language]}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'सुगम दर्शन हेतु श्रेष्ठ समय:' : 'Recommended Peaceful Slot:'}
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 leading-tight block">
                  {activeDistrictTelemetry.bestSlot[language]}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'यातायात व पुलिस निर्देश:' : 'Police & Traffic Advisory:'}
                </span>
                <span className="text-xs font-medium text-[var(--text-primary)] leading-tight block">
                  {activeDistrictTelemetry.policeAdvisory[language]}
                </span>
              </div>
            </div>

            {/* Key Temple Spot Wait Times */}
            <div className="mt-4 pt-3.5 border-t border-[var(--glass-border)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                {language === 'hi' ? 'प्रमुख मंदिरों में लाइव कतार स्थिति:' : 'Key Shrine Live Queue Status:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeDistrictTelemetry.keySpots.map((spot, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--card-bg)]">
                    <span className="text-xs font-semibold text-[var(--text-primary)] block truncate">
                      {language === 'hi' ? spot.hindiName : spot.name}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--accent-primary)] mt-0.5 block">
                      ⏱️ {spot.waitMinutes > 0 ? `~${spot.waitMinutes} mins` : 'Smooth Flow'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Featured Lead Editorial Dispatch (When no narrow filter is applied) */}
      {heroStory && selectedCategory === 'all' && selectedDistrict === 'all' && !searchQuery && (
        <section className="editorial-card rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Lead Image */}
            <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-stone-200 dark:bg-stone-900">
              <img
                src={heroStory.imageUrl || 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&q=85'}
                alt={heroStory.title.en}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--accent-primary)] text-white shadow-sm">
                  {language === 'hi' ? 'प्रमुख विशेष बुलेटिन' : 'Lead Ground Dispatch'}
                </span>
                {heroStory.crowdLevel && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900/90 text-white backdrop-blur-sm">
                    {heroStory.crowdLevel === 'extreme' ? 'Peak Crowd' :
                     heroStory.crowdLevel === 'high' ? 'Heavy Devotee Volume' : 'Smooth Flow'}
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-stone-900/85 px-4 py-3 text-white flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'hi' ? heroStory.hindiDistrict : heroStory.district}
                </span>
                <span className="text-[11px] opacity-90 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {heroStory.publishedAt}
                </span>
              </div>
            </div>

            {/* Lead Story Content */}
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2">
                  {language === 'hi' ? heroStory.categoryLabel.hi : heroStory.categoryLabel.en} • {heroStory.source}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] font-editorial leading-snug">
                  {language === 'hi' ? heroStory.title.hi : heroStory.title.en}
                </h3>

                <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
                  {language === 'hi' ? heroStory.summary.hi : heroStory.summary.en}
                </p>

                {heroStory.queueStatus && (
                  <div className="mt-4 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {language === 'hi' ? heroStory.queueStatus.hi : heroStory.queueStatus.en}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between gap-3">
                <button
                  onClick={() => onAskAI(
                    language === 'hi'
                      ? `मुझे "${heroStory.title.hi}" के बारे में संपूर्ण यात्रा योजना और दर्शन नियम बताएं।`
                      : `Tell me detailed travel planning guidance and darshan rules regarding "${heroStory.title.en}".`
                  )}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'यात्रा परामर्श से पूछें' : 'Plan with Concierge'}</span>
                </button>

                {heroStory.sourceUrl && (
                  <a
                    href={heroStory.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-1.5"
                  >
                    <span>{language === 'hi' ? 'आधिकारिक स्रोत' : 'Source'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Navigation Bar */}
      <section className="editorial-card rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'तीर्थ, 25+ जिले, दर्शन कतार अथवा मार्ग खोजें...' : 'Search 25+ UP shrines, districts, queues, or transit bulletins...'}
            className="w-full pl-10 pr-8 py-2 rounded-xl text-xs bg-[var(--bg-secondary)]/60 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* District Selector (25+ Districts) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <MapPin className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-secondary)]/80 border border-[var(--glass-border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
          >
            {ALL_UP_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                {language === 'hi' ? d.hindi : d.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'editorial-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name[language]}</span>
            </button>
          );
        })}
      </div>

      {/* Dispatches Magazine Grid */}
      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-[var(--accent-primary)]" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            {language === 'hi' ? 'उत्तर प्रदेश तीर्थ एवं जिला लाइव बुलेटिन प्राप्त किए जा रहे हैं...' : 'Retrieving real-time pilgrimage & travel bulletins...'}
          </p>
        </div>
      ) : storiesToDisplay.length === 0 ? (
        <div className="w-full py-16 editorial-card rounded-2xl p-6 text-center">
          <AlertCircle className="w-9 h-9 mx-auto text-[var(--accent-primary)] mb-2" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] font-editorial">
            {language === 'hi' ? 'कोई बुलेटिन नहीं मिला' : 'No Travel Dispatches Found'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {language === 'hi' ? 'कृपया अन्य जिला या फ़िल्टर का चयन करें।' : 'Try selecting another destination or resetting search filters.'}
          </p>
          <button
            onClick={() => { setSelectedDistrict('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white cursor-pointer"
          >
            {language === 'hi' ? 'समस्त फ़िल्टर हटाएं' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storiesToDisplay.map((item) => {
            const isExpanded = activeExpandedNewsId === item.id;

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="editorial-card rounded-2xl overflow-hidden flex flex-col group justify-between shadow-sm"
              >
                <div>
                  {/* Photo Header */}
                  {item.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-stone-900/85 px-3 py-2 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {language === 'hi' ? item.hindiDistrict : item.district}
                        </span>
                        <span className="text-[10px] opacity-90 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.publishedAt}
                        </span>
                      </div>

                      {/* Crowd Status Pill */}
                      {item.crowdLevel && (
                        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md ${
                          item.crowdLevel === 'extreme' ? 'bg-red-600/90 text-white' :
                          item.crowdLevel === 'high' ? 'bg-amber-600/90 text-white' :
                          item.crowdLevel === 'moderate' ? 'bg-amber-500/90 text-stone-900' :
                          'bg-emerald-600/90 text-white'
                        }`}>
                          {item.crowdLevel === 'extreme' ? 'Peak Crowd' :
                           item.crowdLevel === 'high' ? 'High Footfall' :
                           item.crowdLevel === 'moderate' ? 'Moderate' : 'Serene'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Editorial Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-primary)] font-bold uppercase tracking-wider text-[10px]">
                        {language === 'hi' ? item.categoryLabel.hi : item.categoryLabel.en}
                      </span>
                      <span className="truncate max-w-[130px] opacity-80">
                        {item.source}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[var(--text-primary)] font-editorial leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                      {language === 'hi' ? item.title.hi : item.title.en}
                    </h4>

                    {/* Wait status note if present */}
                    {item.queueStatus && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)]">
                        <Clock className="w-3 h-3 text-[var(--accent-primary)] flex-shrink-0" />
                        <span>{item.queueStatus[language]}</span>
                      </div>
                    )}

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {item.summary[language]}
                    </p>

                    {/* Expanded Field Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)] space-y-2"
                      >
                        <p className="leading-relaxed">
                          {item.details[language]}
                        </p>
                        {item.feasibilityBadge && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{item.feasibilityBadge[language]}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="px-5 pb-5 pt-2 border-t border-[var(--glass-border)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onAskAI(
                      language === 'hi'
                        ? `मुझे "${item.title.hi}" के बारे में विस्तार से बताएं और दर्शन व यात्रा सुझाव दें।`
                        : `Please provide practical travel guidelines and darshan advice regarding "${item.title.en}".`
                    )}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 flex items-center gap-1.5 transition-all cursor-pointer"
                    title={language === 'hi' ? 'यात्रा परामर्श से पूछें' : 'Consult Travel Concierge'}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'परामर्श लें' : 'Consult Concierge'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveExpandedNewsId(isExpanded ? null : item.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
                    >
                      {isExpanded ? (language === 'hi' ? 'संक्षेप' : 'Less') : (language === 'hi' ? 'विस्तार' : 'Details')}
                    </button>

                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
                        title="View Official Source"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Official Traveler Resources & Shrine Links Footer */}
      <footer className="editorial-card rounded-2xl p-6 md:p-8 mt-8 border border-[var(--glass-border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Helplines */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-2">
              {language === 'hi' ? '24x7 आधिकारिक सहायता हेल्पलाइन' : '24x7 Official Tourist Helplines'}
            </span>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center justify-between py-1 border-b border-[var(--glass-border)]">
                <span>{language === 'hi' ? 'उत्तर प्रदेश पर्यटन टोल फ्री:' : 'UP Tourism Toll-Free:'}</span>
                <a href="tel:18001805145" className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)]">1800-180-5145</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-[var(--glass-border)]">
                <span>{language === 'hi' ? 'आपातकालीन पुलिस सेवा:' : 'Emergency Police Assistance:'}</span>
                <a href="tel:112" className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)]">112</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-[var(--glass-border)]">
                <span>{language === 'hi' ? 'महिला सुरक्षा हेल्पलाइन:' : 'Women Power Line:'}</span>
                <a href="tel:1090" className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)]">1090</a>
              </li>
            </ul>
          </div>

          {/* Official Shrine Portals */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-2">
              {language === 'hi' ? 'आधिकारिक दर्शन व ट्रस्ट पोर्टल' : 'Official Shrine Booking Portals'}
            </span>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <li>
                <a 
                  href="https://srjbtkshetra.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between py-1 border-b border-[var(--glass-border)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <span>{language === 'hi' ? 'श्री राम जन्मभूमि तीर्थ क्षेत्र (अयोध्या)' : 'Shri Ram Janmabhoomi (Ayodhya)'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://shrikashivishwanath.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between py-1 border-b border-[var(--glass-border)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <span>{language === 'hi' ? 'काशी विश्वनाथ सुगम दर्शन (वाराणसी)' : 'Kashi Vishwanath Corridor (Varanasi)'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://asi.payumoney.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between py-1 border-b border-[var(--glass-border)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <span>{language === 'hi' ? 'एएसआई स्मारक ई-टिकट (ताजमहल / आगरा)' : 'ASI Monuments E-Ticket (Taj Mahal)'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Editorial Disclaimer & Verification Note */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-2">
              {language === 'hi' ? 'सूचना प्रमाणिकता' : 'Ground Telemetry Notice'}
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === 'hi'
                ? 'यह बुलेटिन उत्तर प्रदेश पर्यटन, जिला प्रशासन, पुलिस नियंत्रण कक्ष एवं संबंधित मंदिर ट्रस्टों द्वारा सत्यापित डेटा पर आधारित है। सप्ताहांत व त्योहारों पर कतार समय में परिवर्तन संभव है।'
                : 'All telemetry is aggregated from Uttar Pradesh Tourism, District Control Rooms, and Shrine Administration Boards. Devotees are advised to check peak time forecasts before departure.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
