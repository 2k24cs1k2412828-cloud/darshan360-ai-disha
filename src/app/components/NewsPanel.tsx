import { useState, useEffect } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  scrapeLiveUPNews, 
  filterScrapedNews, 
  ALL_UP_DISTRICTS, 
  DISTRICT_CROWD_REGISTRY, 
  type ScrapedNewsItem, 
  type DistrictCrowdStatus 
} from '../services/newsScraperService';

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
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  const [activeExpandedNewsId, setActiveExpandedNewsId] = useState<string | null>(null);

  // Initial news fetch
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const items = await scrapeLiveUPNews();
      setNewsItems(items);
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error loading travel dispatches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const items = await scrapeLiveUPNews();
      setNewsItems(items);
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error refreshing travel dispatches:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const filteredItems = filterScrapedNews(newsItems, selectedDistrict, selectedCategory, searchQuery);

  // Pick lead editorial story (breaking or top item)
  const heroStory = newsItems.find(item => item.isBreaking) || newsItems[0];
  const secondaryStories = filteredItems.filter(item => item.id !== heroStory?.id || selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery !== '');
  const storiesToDisplay = (selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery.trim() !== '') ? filteredItems : secondaryStories;

  const categories = [
    { id: 'all', name: { en: 'All Dispatches', hi: 'समस्त बुलेटिन' }, icon: Newspaper },
    { id: 'crowd_darshan', name: { en: 'Temple Queues & Darshan', hi: 'दर्शन व कतार स्थिति' }, icon: Flame },
    { id: 'festival_mela', name: { en: 'Festivals & Sacred Melas', hi: 'पर्व व पावन मेले' }, icon: Sparkles },
    { id: 'infrastructure', name: { en: 'Transit & Highways', hi: 'परिवहन व रोपवे मार्ग' }, icon: TrendingUp },
    { id: 'safety_alert', name: { en: 'Traveler Advisories', hi: 'प्रशासनिक एडवाइजरी' }, icon: ShieldAlert }
  ];

  // Selected district crowd advisory card if a specific district is picked
  const activeDistrictTelemetry: DistrictCrowdStatus | undefined = 
    selectedDistrict !== 'all' ? DISTRICT_CROWD_REGISTRY[selectedDistrict.toLowerCase()] : undefined;

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col p-4 md:p-8 space-y-6 scrollbar-thin">
      {/* Editorial Masthead */}
      <header className="border-b border-[var(--glass-border)] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              {language === 'hi' ? 'मध्य प्रदेश पर्यटन ग्राउंड इंटेलिजेंस' : 'Madhya Pradesh Tourism Ground Intelligence'}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              • {language === 'hi' ? 'अपडेट:' : 'Updated:'} {lastUpdatedTime}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-editorial">
            {language === 'hi' 
              ? 'तीर्थ एवं जिला यात्रा बुलेटिन' 
              : 'Pilgrimage & District Travel Dispatches'}
          </h2>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'मुरैना, ग्वालियर, ओरछा, चंदेरी व प्रमुख म.प्र. पर्यटन केंद्रों की प्रामाणिक कतार स्थिति, दर्शन परामर्श, और आधिकारिक यात्रा सूचनाएं।'
              : 'Verified ground telemetry, monument hours, heritage advisories, and transit bulletins curated across key tourist corridors of Madhya Pradesh.'}
          </p>
        </div>

        {/* Action & Verification Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--glass-border)] shadow-sm hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="Refresh verified reports"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
            <span>{language === 'hi' ? 'ताज़ा बुलेटिन प्राप्त करें' : 'Refresh Dispatches'}</span>
          </button>
        </div>
      </header>

      {/* Official Urgent Travel Advisory Strip */}
      <div className="editorial-card rounded-xl p-3 md:p-3.5 border-l-4 border-l-[var(--accent-primary)] flex items-center gap-3 overflow-hidden">
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-white flex items-center gap-1.5 flex-shrink-0">
          <AlertCircle className="w-3.5 h-3.5" />
          {language === 'hi' ? 'यात्रा सूचना' : 'Official Advisory'}
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee text-xs font-medium text-[var(--text-primary)]">
            {language === 'hi'
              ? 'मथुरा-वृन्दावन: सप्ताहांत पर बांके बिहारी मंदिर में सामान्य कतार समय 1.5 से 2 घंटे • अयोध्या: राम पथ व सुग्रीव किला से राम मंदिर गर्भगृह 45 मिनट में सुगम निकास • वाराणसी: कैंट से गोदौलिया रोपवे का सुरक्षा ट्रायल पूरा, गंगा आरती पर नौका दरें निर्धारित • प्रयागराज: त्रिवेणी संगम स्नान हेतु 25 ईको-टेंट सिटी सक्रिय'
              : 'Mathura-Vrindavan: Bankey Bihari queue wait times recording ~1.5 to 2 hrs on weekends • Ayodhya: Ram Mandir smooth exit under 45 mins via Ram Path shaded corridors • Varanasi: Cantt to Godowlia ropeway trials complete; fixed boat tariffs notified • Prayagraj: 25 Eco-Tent cities operational for holy Sangam dip'}
          </div>
        </div>
      </div>

      {/* Live Pilgrim Flow & Crowd Index Strip */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'hi' ? 'तीर्थ प्रवाह व प्रतीक्षा सूचकांक' : 'Live Pilgrim & Devotee Flow Index'}
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {language === 'hi' ? 'जिले पर क्लिक करके विस्तृत रिपोर्ट देखें' : 'Click card to filter destination'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {Object.entries(DISTRICT_CROWD_REGISTRY).map(([key, data]) => {
            const isSelected = selectedDistrict === key;
            const isHigh = data.crowdLevel === 'high' || data.crowdLevel === 'extreme';
            const isModerate = data.crowdLevel === 'moderate';

            return (
              <button
                key={key}
                onClick={() => setSelectedDistrict(isSelected ? 'all' : key)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-sm'
                    : 'editorial-card hover:border-[var(--accent-primary)]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {language === 'hi' ? data.hindiDistrict.split(' ')[0] : data.district}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    data.crowdLevel === 'extreme' ? 'bg-red-500' :
                    data.crowdLevel === 'high' ? 'bg-amber-600' :
                    data.crowdLevel === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                </div>
                
                <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                  {data.estimatedWaitMinutes > 0 ? `~${data.estimatedWaitMinutes}m wait` : 'Serene Flow'}
                </div>

                <div className={`text-[10px] font-semibold mt-2 px-1.5 py-0.5 rounded text-center truncate ${
                  isHigh ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200' :
                  isModerate ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' :
                  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {data.crowdLevel === 'extreme' ? 'Peak Rush' :
                   data.crowdLevel === 'high' ? 'Heavy Flow' :
                   data.crowdLevel === 'moderate' ? 'Moderate' : 'Serene'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected District Telemetry Spotlight (Expanded Dossier) */}
      <AnimatePresence>
        {activeDistrictTelemetry && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="editorial-card rounded-2xl p-5 md:p-6 border-l-4 border-l-[var(--accent-primary)] relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] font-editorial">
                    📍 {language === 'hi' ? activeDistrictTelemetry.hindiDistrict : activeDistrictTelemetry.district} — {language === 'hi' ? 'दर्शन व मार्ग परामर्श' : 'Pilgrimage Dossier'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeDistrictTelemetry.crowdLevel === 'extreme' ? 'bg-red-600 text-white' :
                    activeDistrictTelemetry.crowdLevel === 'high' ? 'bg-amber-600 text-white' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {activeDistrictTelemetry.crowdLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
                  {language === 'hi' ? activeDistrictTelemetry.feasibilityVerdict.hi : activeDistrictTelemetry.feasibilityVerdict.en}
                </p>
              </div>

              {/* Ask Concierge Quick Prompt */}
              <button
                onClick={() => onAskAI(
                  language === 'hi' 
                    ? `${activeDistrictTelemetry.hindiDistrict} में अभी कितनी भीड़ है और दर्शन का सही समय क्या है?`
                    : `How much crowd is there in ${activeDistrictTelemetry.district} right now and what is the recommended time for darshan?`
                )}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'यात्रा परामर्श से पूछें' : 'Consult Travel Concierge'}</span>
              </button>
            </div>

            {/* Travel Insights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'पीक घंटे (अत्यधिक भीड़):' : 'Peak Rush Hours:'}
                </span>
                <span className="text-xs font-medium text-[var(--text-primary)] leading-tight block">
                  {language === 'hi' ? activeDistrictTelemetry.peakHours.hi : activeDistrictTelemetry.peakHours.en}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'सुगम दर्शन हेतु श्रेष्ठ समय:' : 'Recommended Peaceful Slot:'}
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 leading-tight block">
                  {language === 'hi' ? activeDistrictTelemetry.bestSlot.hi : activeDistrictTelemetry.bestSlot.en}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  {language === 'hi' ? 'यातायात व पुलिस निर्देश:' : 'Police & Traffic Advisory:'}
                </span>
                <span className="text-xs font-medium text-[var(--text-primary)] leading-tight block">
                  {language === 'hi' ? activeDistrictTelemetry.policeAdvisory.hi : activeDistrictTelemetry.policeAdvisory.en}
                </span>
              </div>
            </div>

            {/* Key Temple Spot Wait Times */}
            <div className="mt-4 pt-3.5 border-t border-[var(--glass-border)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                {language === 'hi' ? 'प्रमुख मंदिरों में कतार प्रतीक्षा समय:' : 'Key Shrine Queue Telemetry:'}
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
        <section className="editorial-card rounded-2xl overflow-hidden border border-[var(--glass-border)]">
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
                  {language === 'hi' ? 'प्रमुख विशेष बुलेटिन' : 'Lead Editorial Dispatch'}
                </span>
                {heroStory.crowdLevel && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900 text-white">
                    {heroStory.crowdLevel === 'high' ? 'High Devotee Volume' : 'Smooth Inflow'}
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
            placeholder={language === 'hi' ? 'तीर्थ, जिला, दर्शन कतार अथवा मार्ग खोजें...' : 'Search shrines, districts, queues, or transit bulletins...'}
            className="w-full pl-10 pr-8 py-2 rounded-xl text-xs bg-[var(--bg-secondary)]/60 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* District Selector */}
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
              <span>{language === 'hi' ? cat.name.hi : cat.name.en}</span>
            </button>
          );
        })}
      </div>

      {/* Dispatches Magazine Grid */}
      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-[var(--accent-primary)]" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            {language === 'hi' ? 'उत्तर प्रदेश तीर्थ एवं जिला बुलेटिन प्राप्त किए जा रहे हैं...' : 'Retrieving real-time pilgrimage & travel bulletins...'}
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
                className="editorial-card rounded-2xl overflow-hidden flex flex-col group justify-between"
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
                        <span>{language === 'hi' ? item.queueStatus.hi : item.queueStatus.en}</span>
                      </div>
                    )}

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {language === 'hi' ? item.summary.hi : item.summary.en}
                    </p>

                    {/* Expanded Field Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)] space-y-2"
                      >
                        <p className="leading-relaxed">
                          {language === 'hi' ? item.details.hi : item.details.en}
                        </p>
                        {item.feasibilityBadge && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{language === 'hi' ? item.feasibilityBadge.hi : item.feasibilityBadge.en}</span>
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
                ? 'यह बुलेटिन मध्य प्रदेश पर्यटन (MP Tourism), भारतीय पुरातत्व सर्वेक्षण (ASI) एवं जिला प्रशासन द्वारा सत्यापित डेटा पर आधारित है। सप्ताहांत व त्योहारों पर समय सारणी में परिवर्तन संभव है।'
                : 'All telemetry is aggregated from Madhya Pradesh Tourism, ASI, District Administration, and Shrine Boards. Travelers are advised to check peak time forecasts before departure.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
