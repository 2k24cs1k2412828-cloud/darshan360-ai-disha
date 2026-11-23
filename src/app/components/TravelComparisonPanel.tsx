// D360 Travel Price Comparison & Aggregation Engine UI
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bus, 
  Train, 
  Car, 
  Hotel, 
  Plane, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  Users, 
  RefreshCw, 
  SlidersHorizontal, 
  ArrowRight, 
  Star, 
  Scale, 
  Info, 
  X, 
  Zap, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { 
  SearchRequest, 
  TravelOffer, 
  SearchResponse, 
  TravelServiceType, 
  VerifiedOfferResult, 
  CanonicalTravelEntity 
} from '../engine/types/travel.types';
import { searchOrchestrator } from '../engine/orchestrator/searchOrchestrator';
import { travelCacheService } from '../engine/cache/travelCacheService';
import { PriceVerificationService } from '../engine/verification/priceVerificationService';
import { TravelAssistantAdvisor, TravelComparisonAdvice } from '../engine/ai/travelAssistantAdvisor';

interface TravelComparisonPanelProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onAskAI?: (prompt: string) => void;
  defaultService?: TravelServiceType;
}

const UP_CITY_HUBS = [
  { name: 'Kanpur Central', city: 'Kanpur', code: 'CNB', state: 'Uttar Pradesh', country: 'India' },
  { name: 'New Delhi', city: 'Delhi', code: 'NDLS', state: 'Delhi', country: 'India' },
  { name: 'Varanasi Cantt / Ghats', city: 'Varanasi', code: 'BSB', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Ayodhya Dham', city: 'Ayodhya', code: 'AY', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Lucknow Charbagh', city: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Prayagraj Sangam', city: 'Prayagraj', code: 'PRYJ', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Agra Cantt / Taj Mahal', city: 'Agra', code: 'AGC', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Mathura Junction', city: 'Mathura', code: 'MTJ', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Jhansi Heritage', city: 'Jhansi', code: 'VGLJ', state: 'Uttar Pradesh', country: 'India' },
  { name: 'Gorakhpur Junction', city: 'Gorakhpur', code: 'GKP', state: 'Uttar Pradesh', country: 'India' }
];

export function TravelComparisonPanel({
  theme,
  language,
  onAskAI,
  defaultService = 'bus'
}: TravelComparisonPanelProps) {
  // Service Category Tabs
  const [activeService, setActiveService] = useState<TravelServiceType>(defaultService);

  // Search Input States
  const [originCity, setOriginCity] = useState('Kanpur');
  const [destCity, setDestCity] = useState('Delhi');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [rooms, setRooms] = useState(1);

  // Preference Filters
  const [acOnly, setAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'cheapest' | 'fastest' | 'earliest' | 'rating'>('recommended');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(10000);

  // Search Results & Orchestrator State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [aiAdvice, setAiAdvice] = useState<TravelComparisonAdvice | null>(null);
  const [selectedOfferForCompare, setSelectedOfferForCompare] = useState<TravelOffer[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Verification & Booking Modal State
  const [verifyingOffer, setVerifyingOffer] = useState<TravelOffer | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerifiedOfferResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Freshness tick for auto-updating "checked Xs ago" labels
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  // Execute initial search on mount or category change
  useEffect(() => {
    executeSearch();
  }, [activeService]);

  const executeSearch = async (forceRefresh = false) => {
    setIsSearching(true);
    setSelectedOfferForCompare([]);

    const originHub = UP_CITY_HUBS.find((h) => h.city.toLowerCase() === originCity.toLowerCase()) || {
      name: originCity,
      city: originCity,
      country: 'India'
    };
    const destHub = UP_CITY_HUBS.find((h) => h.city.toLowerCase() === destCity.toLowerCase()) || {
      name: destCity,
      city: destCity,
      country: 'India'
    };

    const request: SearchRequest = {
      serviceType: activeService,
      origin: originHub,
      destination: destHub,
      departureDate,
      passengers: { adults: passengers },
      rooms: activeService === 'hotel' ? rooms : undefined,
      preferences: {
        acOnly,
        sleeperOnly,
        refundableOnly,
        breakfastIncluded: breakfastOnly,
        sortBy
      }
    };

    try {
      const response = await searchOrchestrator.executeSearch(request, forceRefresh);
      setSearchResponse(response);

      // Generate Factual Structured AI Advice
      const advice = TravelAssistantAdvisor.generateFactualAdvice(response, language);
      setAiAdvice(advice);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Filtered and Sorted Offers
  const displayedOffers = useMemo(() => {
    if (!searchResponse) return [];
    return searchResponse.results.filter((o) => o.totalPrice <= maxPriceFilter);
  }, [searchResponse, maxPriceFilter]);

  // Handle Offer Verification & Booking Flow
  const handleInitiateBooking = async (offer: TravelOffer) => {
    setVerifyingOffer(offer);
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await PriceVerificationService.verifyOffer(offer);
      setVerificationResult(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleCompareSelection = (offer: TravelOffer) => {
    setSelectedOfferForCompare((prev) => {
      const exists = prev.find((o) => o.id === offer.id);
      if (exists) {
        return prev.filter((o) => o.id !== offer.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), offer];
      }
      return [...prev, offer];
    });
  };

  const formatDuration = (mins?: number) => {
    if (!mins) return 'N/A';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Engine Banner */}
      <div className="p-4 sm:p-6 border-b border-[var(--glass-border)] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-1">
            <Scale className="w-4 h-4 text-orange-600" />
            <span>EduFutura Travel Metasearch • D360 Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
              Deterministic Aggregation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            {language === 'hi' ? 'स्मार्ट यात्रा मूल्य तुलना एवं बुकिंग' : 'Smart Travel Price Comparison & Aggregation'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {language === 'hi' 
              ? 'बस, ट्रेन, कैब, होटल और उड़ानों के सत्यापित किराए, समय और नीतियों की वास्तविक तुलना।'
              : 'Compare transparent prices, timings, ratings, and policies across authorized Indian travel providers.'}
          </p>
        </div>

        {/* Multi-Service Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-[var(--glass-border)] overflow-x-auto">
          <button
            onClick={() => setActiveService('bus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeService === 'bus'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'बस' : 'Bus'}</span>
          </button>
          <button
            onClick={() => setActiveService('train')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeService === 'train'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'ट्रेन' : 'Train'}</span>
          </button>
          <button
            onClick={() => setActiveService('cab')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeService === 'cab'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कैब / टैक्सी' : 'Cab'}</span>
          </button>
          <button
            onClick={() => setActiveService('hotel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeService === 'hotel'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'होटल' : 'Hotel'}</span>
          </button>
          <button
            onClick={() => setActiveService('flight')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeService === 'flight'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'फ्लाइट' : 'Flight'}</span>
          </button>
        </div>
      </div>

      {/* Main Search Controls Form */}
      <div className="p-4 sm:p-6 border-b border-[var(--glass-border)] bg-[var(--card-bg)]/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Origin */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {activeService === 'hotel' ? (language === 'hi' ? 'गंतव्य शहर' : 'Destination City') : (language === 'hi' ? 'कहाँ से (From)' : 'Origin City')}
            </label>
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-orange-500 shadow-xs"
            >
              {UP_CITY_HUBS.map((h) => (
                <option key={h.city} value={h.city}>
                  {h.city} ({h.code || h.state})
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {activeService === 'hotel' ? (language === 'hi' ? 'लैंडमार्क / क्षेत्र' : 'Landmark / Area') : (language === 'hi' ? 'कहाँ तक (To)' : 'Destination City')}
            </label>
            <select
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-orange-500 shadow-xs"
            >
              {UP_CITY_HUBS.filter((h) => h.city !== originCity).map((h) => (
                <option key={h.city} value={h.city}>
                  {h.city} ({h.code || h.state})
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-orange-500" />
              <span>{activeService === 'hotel' ? 'Check-in Date' : 'Travel Date'}</span>
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>

          {/* Passengers / Rooms */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-orange-500" />
              <span>{activeService === 'hotel' ? 'Rooms & Guests' : 'Passengers'}</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-orange-500 shadow-xs"
              >
                <option value={1}>1 Traveler</option>
                <option value={2}>2 Travelers</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers</option>
                <option value={6}>6 Travelers (Family / Group)</option>
              </select>
            </div>
          </div>

          {/* Search CTA */}
          <div className="flex items-end">
            <button
              onClick={() => executeSearch(true)}
              disabled={isSearching}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
              <span>{isSearching ? (language === 'hi' ? 'खोज जारी...' : 'Searching...') : (language === 'hi' ? 'कीमतें तुलना करें' : 'Compare Fares')}</span>
            </button>
          </div>
        </div>

        {/* Quick Attribute Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] mr-1">
            {language === 'hi' ? 'प्राथमिकताएं:' : 'Preferences:'}
          </span>
          <button
            onClick={() => { setRefundableOnly(!refundableOnly); }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              refundableOnly
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ✓ {language === 'hi' ? 'मुफ्त रद्दीकरण (Refundable)' : 'Free Cancellation'}
          </button>

          {(activeService === 'bus' || activeService === 'train') && (
            <>
              <button
                onClick={() => { setAcOnly(!acOnly); }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  acOnly
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-400'
                    : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ❄️ AC Only
              </button>
              <button
                onClick={() => { setSleeperOnly(!sleeperOnly); }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  sleeperOnly
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-400'
                    : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                🛌 Sleeper Class Only
              </button>
            </>
          )}

          {activeService === 'hotel' && (
            <button
              onClick={() => { setBreakfastOnly(!breakfastOnly); }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                breakfastOnly
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              ☕ Breakfast Included
            </button>
          )}

          {/* Compare Counter Badge */}
          {selectedOfferForCompare.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="ml-auto px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Selected ({selectedOfferForCompare.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Progressive Provider Status Bar */}
      {searchResponse && (
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--glass-border)] bg-[var(--card-bg)]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[var(--text-secondary)]">
              {language === 'hi' ? 'सत्यापित प्रदाता स्टेटस:' : 'Queried Providers:'}
            </span>
            {searchResponse.providers.map((p) => (
              <span
                key={p.providerId}
                className="px-2 py-0.5 rounded-lg bg-[var(--card-bg)] border border-[var(--glass-border)] text-[11px] font-mono flex items-center gap-1 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-[var(--text-primary)]">{p.providerName}:</span>
                <span className="text-[var(--accent-primary)] font-bold">{p.resultsCount}</span>
                <span className="text-[9px] text-[var(--text-secondary)]">({p.latencyMs}ms)</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              {searchResponse.cached ? '⚡ Served from D360 Deterministic Cache' : '🟢 Live Search Orchestration Complete'}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 p-4 sm:p-6 space-y-5">
        {/* Factual AI Travel Advisor Callout */}
        {aiAdvice && searchResponse && searchResponse.results.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300">
                <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                <span>{language === 'hi' ? 'दिशा एआई • तथ्यपरक यात्रा तुलना विश्लेषण' : 'Disha AI • Factual Trade-off Analysis'}</span>
              </div>
              <span className="text-[10px] font-mono bg-orange-500/15 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                Strict Verified Data Only
              </span>
            </div>

            <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
              {aiAdvice.summary}
            </p>

            {/* Structured Insights Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {aiAdvice.cheapestOption && (
                <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">💰 Lowest Fare</div>
                  <div className="font-bold text-[var(--text-primary)] truncate">{aiAdvice.cheapestOption.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">₹{aiAdvice.cheapestOption.price.toLocaleString('en-IN')} via {aiAdvice.cheapestOption.provider}</div>
                </div>
              )}

              {aiAdvice.fastestOption && (
                <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">⚡ Shortest Travel Time</div>
                  <div className="font-bold text-[var(--text-primary)] truncate">{aiAdvice.fastestOption.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{aiAdvice.fastestOption.duration} via {aiAdvice.fastestOption.provider}</div>
                </div>
              )}

              {aiAdvice.bestValueOption && (
                <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs">
                  <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">🏆 Best Overall Value</div>
                  <div className="font-bold text-[var(--text-primary)] truncate">{aiAdvice.bestValueOption.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">₹{aiAdvice.bestValueOption.price.toLocaleString('en-IN')} • {aiAdvice.bestValueOption.reason}</div>
                </div>
              )}
            </div>

            {/* Specific Tradeoffs */}
            {aiAdvice.keyTradeoffs.length > 0 && (
              <div className="pt-1 space-y-1">
                {aiAdvice.keyTradeoffs.map((t, idx) => (
                  <div key={idx} className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Toolbar: Count, Sorting, and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {displayedOffers.length} {language === 'hi' ? 'विकल्प उपलब्ध' : 'Verified Offers Available'}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              ({originCity} → {destCity})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'क्रमबद्ध:' : 'Sort By:'}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value as any;
                setSortBy(val);
                if (searchResponse) {
                  const sorted = [...searchResponse.results];
                  searchOrchestrator.executeSearch({
                    serviceType: activeService,
                    origin: searchResponse.origin,
                    destination: searchResponse.destination,
                    departureDate,
                    passengers: { adults: passengers },
                    preferences: { sortBy: val }
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-orange-500 shadow-2xs"
            >
              <option value="recommended">⭐ Recommended (Best Value)</option>
              <option value="cheapest">💰 Price: Low to High</option>
              <option value="fastest">⚡ Duration: Fastest First</option>
              <option value="earliest">⏰ Departure: Earliest</option>
              <option value="rating">🌟 Guest Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* Offer Cards List */}
        {displayedOffers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass border border-[var(--glass-border)] space-y-3">
            <AlertCircle className="w-10 h-10 text-orange-500 mx-auto" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {language === 'hi' ? 'कोई यात्रा विकल्प नहीं मिला' : 'No Travel Offers Match Current Filters'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया अपनी फिल्टर प्राथमिकताएँ ढीली करें या दूसरी तारीख चुनकर दोबारा प्रयास करें।'
                : 'Try adjusting your filters, budget slider, or selecting another travel date.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOffers.map((offer, idx) => {
              const isSelectedForCompare = selectedOfferForCompare.some((o) => o.id === offer.id);
              const freshnessText = travelCacheService.formatFreshnessLabel(offer.fetchedAt, language);

              return (
                <div
                  key={offer.id}
                  className={`p-4 sm:p-5 rounded-2xl glass border transition-all hover:shadow-md relative ${
                    idx === 0 && sortBy === 'recommended'
                      ? 'border-orange-500/50 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent'
                      : 'border-[var(--glass-border)] hover:border-orange-500/30'
                  }`}
                >
                  {/* Recommended Ribbon */}
                  {idx === 0 && sortBy === 'recommended' && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      <span>Best Value Choice</span>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Provider & Operator Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 shadow-2xs">
                          {offer.providerLogo ? (
                            <img
                              src={offer.providerLogo}
                              alt={offer.providerName}
                              className="h-3.5 max-w-[65px] object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : null}
                          <span>{offer.providerName}</span>
                        </span>

                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <span>{freshnessText}</span>
                        </span>

                        {offer.refundable && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                            Refundable
                          </span>
                        )}

                        {offer.rating && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{offer.rating.toFixed(1)}</span>
                            {offer.reviewCount && <span className="text-[9px] font-normal opacity-80">({offer.reviewCount})</span>}
                          </span>
                        )}
                      </div>

                      {/* Title & Route Subtitle */}
                      <div>
                        <h4 className="text-base font-extrabold text-[var(--text-primary)] leading-snug">
                          {offer.title}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                          {offer.subtitle || offer.description}
                        </p>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {offer.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--card-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Middle: Timing, Duration, Stations */}
                    {offer.departureTime && (
                      <div className="flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-xl bg-[var(--card-bg)]/50 border border-[var(--glass-border)] flex-shrink-0 text-center">
                        <div>
                          <div className="text-base font-black text-[var(--text-primary)] font-mono">
                            {offer.departureTime.slice(11, 16)}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] truncate max-w-[90px]">
                            {offer.departureStation?.split(' ')[0] || originCity}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono text-[var(--text-secondary)] font-semibold">
                            {formatDuration(offer.durationMinutes)}
                          </span>
                          <div className="w-16 h-0.5 bg-orange-500/40 relative my-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 absolute right-0 top-1/2 -translate-y-1/2" />
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold uppercase">Direct</span>
                        </div>

                        <div>
                          <div className="text-base font-black text-[var(--text-primary)] font-mono">
                            {offer.arrivalTime ? offer.arrivalTime.slice(11, 16) : 'Arrive'}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] truncate max-w-[90px]">
                            {offer.arrivalStation?.split(' ')[0] || destCity}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Right: Transparent Price & CTA Buttons */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--glass-border)]">
                      <div className="text-left lg:text-right">
                        <div className="text-2xl font-black text-[var(--text-primary)] font-mono leading-none tracking-tight">
                          ₹{offer.totalPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] mt-1">
                          Base: ₹{offer.basePrice} + Tax/Fee: ₹{offer.taxes + offer.fees}
                        </div>
                        <div className="text-[9px] text-emerald-600 font-semibold">
                          Total Transparent Fare
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleCompareSelection(offer)}
                          className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelectedForCompare
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-orange-500/30'
                          }`}
                          title="Select to compare side-by-side"
                        >
                          <Scale className="w-4 h-4" />
                        </button>

                        {/* Booking Button with Pre-Verification */}
                        <button
                          onClick={() => handleInitiateBooking(offer)}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 transition-all active:scale-98"
                        >
                          <span>{language === 'hi' ? 'सत्यापित करें एवं बुक करें' : 'Verify & Book'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && selectedOfferForCompare.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[var(--card-bg)] rounded-3xl border border-[var(--glass-border)] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  Side-by-Side Comparison Matrix ({selectedOfferForCompare.length} Providers)
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto overflow-y-auto space-y-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--glass-border)]">
                    <th className="p-3 font-bold text-[var(--text-secondary)] w-36">Parameter</th>
                    {selectedOfferForCompare.map((o) => (
                      <th key={o.id} className="p-3 font-black text-sm text-[var(--text-primary)]">
                        {o.providerName}
                        <div className="text-[11px] font-normal text-[var(--text-secondary)]">{o.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)] font-medium">
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Total Price</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3 text-base font-black font-mono text-[var(--accent-primary)]">
                        ₹{o.totalPrice.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Base + Taxes</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3 text-[11px] text-[var(--text-secondary)]">
                        Base ₹{o.basePrice} | Tax/Fee ₹{o.taxes + o.fees}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Departure</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3 font-mono font-bold">
                        {o.departureTime ? o.departureTime.slice(11, 16) : 'N/A'}
                        <div className="text-[10px] font-normal text-[var(--text-secondary)]">{o.departureStation}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Duration</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3 font-bold">
                        {formatDuration(o.durationMinutes)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Cancellation Policy</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3 text-[11px] leading-relaxed">
                        {o.cancellationPolicy}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Guest Rating</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3">
                        ⭐ {o.rating?.toFixed(1) || 'N/A'} ({o.reviewCount || 0} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[var(--text-secondary)]">Action</td>
                    {selectedOfferForCompare.map((o) => (
                      <td key={o.id} className="p-3">
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            handleInitiateBooking(o);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-500 cursor-pointer"
                        >
                          Book via {o.providerName}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Pre-Booking Price Verification Modal */}
      {verifyingOffer && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-[var(--card-bg)] rounded-3xl border border-[var(--glass-border)] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-[var(--text-primary)]">
                  Live Pre-Booking Price Verification
                </h3>
              </div>
              {!isVerifying && (
                <button
                  onClick={() => setVerifyingOffer(null)}
                  className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isVerifying ? (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-10 h-10 text-orange-600 animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Verifying Live Seat & Fare with {verifyingOffer.providerName}...
                </h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                  Querying the provider reservation gateway to guarantee current seat availability and zero hidden charges.
                </p>
              </div>
            ) : verificationResult ? (
              <div className="space-y-4">
                {verificationResult.status === 'CONFIRMED' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300">
                        Fare Strictly Confirmed: ₹{verificationResult.currentPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {verificationResult.notes}
                      </div>
                    </div>
                  </div>
                )}

                {verificationResult.status === 'PRICE_CHANGED' && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-amber-800 dark:text-amber-300">
                        Dynamic Price Shift Detected (+₹{verificationResult.priceShift})
                      </div>
                      <div className="text-amber-700 dark:text-amber-400 mt-0.5">
                        Previous quote: ₹{verificationResult.previousPrice} → Current live price: ₹{verificationResult.currentPrice}.
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--glass-border)] text-xs space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">{verifyingOffer.title}</div>
                  <div className="text-[var(--text-secondary)]">Provider: {verifyingOffer.providerName}</div>
                  <div className="text-[var(--text-secondary)]">Departure: {verifyingOffer.departureTime?.slice(11, 16)} • {verifyingOffer.departureStation}</div>
                  <div className="text-[11px] font-mono text-[var(--accent-primary)] font-bold">
                    Total Due: ₹{verificationResult.currentPrice.toLocaleString('en-IN')} (incl. all taxes)
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setVerifyingOffer(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-border)] cursor-pointer"
                  >
                    Go Back
                  </button>
                  <a
                    href={verificationResult.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to {verifyingOffer.providerName} Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
