import { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  SkipForward, 
  ChevronRight, 
  Car, 
  Footprints, 
  Navigation, 
  UtensilsCrossed, 
  X,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  type TripItinerary, 
  type ItineraryStop,
  replanDelay,
  removeStopFromItinerary,
  advanceItineraryProgress,
  extendStayAtCurrentStop,
  optimizeItineraryOrder,
  getPresetItineraries
} from '../services/copilotService';

interface CopilotTimelineProps {
  itinerary: TripItinerary | null;
  language: 'en' | 'hi';
  onUpdateItinerary: (updated: TripItinerary) => void;
  onFocusStop: (coordinates: [number, number], stopId: string) => void;
  onAskAIAboutStop: (prompt: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function CopilotTimeline({
  itinerary,
  language,
  onUpdateItinerary,
  onFocusStop,
  onAskAIAboutStop,
  onClose,
  isOpen,
  onToggleOpen
}: CopilotTimelineProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const presets = getPresetItineraries();

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onToggleOpen}
        className="fixed bottom-20 left-4 z-[1050] glass px-3.5 py-2.5 rounded-full shadow-2xl border border-[var(--accent-primary)]/40 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] hover:scale-105 transition-all cursor-pointer bg-white/90 dark:bg-black/80"
        title="Open AI Travel Copilot Itinerary"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
        <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
        <span>{language === 'hi' ? 'यात्रा कोपायलट' : 'AI Copilot'}</span>
        {itinerary && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-white font-bold">
            {itinerary.stops.length}
          </span>
        )}
      </motion.button>
    );
  }

  // Handle preset selection when no itinerary active
  const handleLoadPreset = (preset: TripItinerary) => {
    onUpdateItinerary(preset);
  };

  // One-tap actions
  const handleExtendStay = (extraMinutes: number = 15) => {
    if (!itinerary) return;
    const updated = extendStayAtCurrentStop(itinerary, extraMinutes);
    onUpdateItinerary(updated);
  };

  const handleAdvanceStop = () => {
    if (!itinerary) return;
    const nextIdx = Math.min(itinerary.currentStopIndex + 1, itinerary.stops.length - 1);
    const updated = advanceItineraryProgress(itinerary, nextIdx);
    onUpdateItinerary(updated);
    if (updated.stops[nextIdx]) {
      onFocusStop(updated.stops[nextIdx].coordinates, updated.stops[nextIdx].id);
    }
  };

  const handleRemoveStop = (stopId: string) => {
    if (!itinerary) return;
    const updated = removeStopFromItinerary(itinerary, stopId);
    onUpdateItinerary(updated);
  };

  const handleOptimizeTrip = () => {
    if (!itinerary) return;
    const updated = optimizeItineraryOrder(itinerary);
    onUpdateItinerary(updated);
  };

  const handleRunningLate = (minutes: number = 20) => {
    if (!itinerary) return;
    const updated = replanDelay(itinerary, minutes);
    onUpdateItinerary(updated);
  };

  return (
    <motion.aside
      initial={{ x: -350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -350, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="fixed top-14 sm:top-16 bottom-20 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-auto z-[1150] max-w-[calc(100vw-16px)] sm:w-96 glass rounded-2xl shadow-2xl border border-[var(--glass-border)] backdrop-blur-xl flex flex-col overflow-hidden bg-white/95 dark:bg-neutral-900/95"
    >
      {/* Header Bar */}
      <div className="p-3.5 border-b border-[var(--glass-border)] flex items-center justify-between gap-2 flex-shrink-0 bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center flex-shrink-0">
            <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] truncate font-display">
                {language === 'hi' ? 'AI यात्रा कोपायलट' : 'AI Travel Copilot'}
              </h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Live
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] truncate">
              {itinerary ? (language === 'hi' ? itinerary.titleHi : itinerary.title) : (language === 'hi' ? 'समय-आधारित यात्रा मार्गदर्शक' : 'Time-Aware Itinerary Engine')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {itinerary && (
            <button
              onClick={handleOptimizeTrip}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--accent-primary)] text-white hover:opacity-90 flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              title="Optimize order to reduce travel time"
            >
              <Sparkles className="w-3 h-3" />
              <span>{language === 'hi' ? 'अनुकूलन' : 'Optimize'}</span>
            </button>
          )}

          <button
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {itinerary ? (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Smart Deadline Protection Banner */}
          {itinerary.deadlineTime && (
            <div className="px-3.5 py-2 border-b border-[var(--glass-border)] bg-orange-500/10 dark:bg-orange-500/15 flex items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {itinerary.safetyBufferMinutes >= 20 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-bounce" />
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                    {itinerary.deadlineLabel || (language === 'hi' ? 'वापसी समयसीमा' : 'Return Deadline')}: {itinerary.deadlineTime}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {language === 'hi' 
                      ? `सुरक्षा बफर: ${itinerary.safetyBufferMinutes} मिनट शेष` 
                      : `Safety buffer: ${itinerary.safetyBufferMinutes} mins reserved`}
                  </p>
                </div>
              </div>

              {/* Check-in / Next Stop Button */}
              <button
                onClick={handleAdvanceStop}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/80 dark:bg-neutral-800 text-[var(--accent-primary)] hover:bg-white dark:hover:bg-neutral-700 border border-[var(--glass-border)] flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer"
                title="Mark current stop done and proceed to next"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{language === 'hi' ? 'अगला पड़ाव' : 'Next Stop'}</span>
              </button>
            </div>
          )}

          {/* Quick Replanning Control Chips */}
          <div className="px-3 py-1.5 border-b border-[var(--glass-border)] flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0 bg-black/5 dark:bg-white/5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex-shrink-0">
              {language === 'hi' ? 'त्वरित बदलाव:' : 'Quick Replan:'}
            </span>

            <button
              onClick={() => handleRunningLate(20)}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
            >
              ⏱️ {language === 'hi' ? '+20 मिनट देरी' : 'Running 20m Late'}
            </button>

            <button
              onClick={() => handleExtendStay(15)}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors cursor-pointer"
            >
              ⏳ {language === 'hi' ? '+15 मिनट विश्राम' : '+15m Stay'}
            </button>

            <button
              onClick={() => {
                const p = language === 'hi'
                  ? `मेरे वर्तमान यात्रा मार्ग (${itinerary.city}) के पास एक अच्छा भोजनालय या कैफे जोड़ें।`
                  : `Add a famous local food stop or café along my current route in ${itinerary.city}.`;
                onAskAIAboutStop(p);
              }}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap bg-orange-500/15 text-orange-700 dark:text-orange-300 hover:bg-orange-500/25 transition-colors cursor-pointer"
            >
              🍲 {language === 'hi' ? 'खानपान जोड़ें' : 'Add Food'}
            </button>

            <button
              onClick={() => {
                const p = language === 'hi'
                  ? `कृपया मेरी यात्रा को कम पैदल चलने और अधिक ऑटो/टैक्सी का उपयोग करने हेतु पुनर्गठित करें।`
                  : `Please replan my trip with minimal walking and more cab/auto transit.`;
                onAskAIAboutStop(p);
              }}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 transition-colors cursor-pointer"
            >
              🚖 {language === 'hi' ? 'कम पैदल चलें' : 'Walk Less'}
            </button>
          </div>

          {/* Timeline Scrollable Stops List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
            {itinerary.stops.map((stop, idx) => {
              const isCurrent = stop.status === 'current';
              const isCompleted = stop.status === 'completed';
              const isUpcoming = stop.status === 'upcoming';
              const isLast = idx === itinerary.stops.length - 1;

              return (
                <div key={stop.id} className="relative">
                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onFocusStop(stop.coordinates, stop.id)}
                    className={`rounded-xl p-3 border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-md'
                        : isCompleted
                          ? 'bg-black/5 dark:bg-white/5 border-[var(--glass-border)] opacity-75'
                          : 'bg-white/70 dark:bg-neutral-800/70 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50'
                    }`}
                  >
                    {/* Top Row: Number, Time, Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Numbered Marker Badge */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                                ? 'bg-[var(--accent-primary)] text-white ring-4 ring-orange-500/20'
                                : 'bg-neutral-200 dark:bg-neutral-700 text-[var(--text-primary)]'
                          }`}
                        >
                          {isCompleted ? '✓' : stop.stopNumber}
                        </div>

                        <div>
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {stop.startTime} – {stop.endTime}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)] ml-1.5">
                            ({stop.durationMinutes}m)
                          </span>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : isCurrent
                              ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                              : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)]'
                        }`}
                      >
                        {isCompleted
                          ? (language === 'hi' ? 'पूर्ण ✓' : 'Done ✓')
                          : isCurrent
                            ? (language === 'hi' ? 'वर्तमान पड़ाव 📍' : 'Current 📍')
                            : (language === 'hi' ? 'आगामी →' : 'Upcoming')}
                      </span>
                    </div>

                    {/* Place Name & Category */}
                    <div className="mt-2 flex items-start gap-2.5">
                      {stop.imageUrl && (
                        <img
                          src={stop.imageUrl}
                          alt={stop.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[var(--glass-border)]"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-extrabold text-[var(--text-primary)] leading-snug truncate">
                          {language === 'hi' ? stop.hindiName : stop.name}
                        </h3>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                          {language === 'hi' ? stop.activityHi : stop.activity}
                        </p>
                      </div>
                    </div>

                    {/* "Why This Place?" Rationale Box */}
                    <div className="mt-2.5 p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-[10px] text-[var(--text-primary)] flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[var(--accent-primary)] block uppercase text-[9px]">
                          {language === 'hi' ? '✨ चयन का कारण (Why This Place)' : '✨ Why This Place?'}
                        </span>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                          {language === 'hi' ? stop.whyThisPlaceHi : stop.whyThisPlace}
                        </p>
                      </div>
                    </div>

                    {/* One-Tap Action Buttons */}
                    <div className="mt-2.5 pt-2 border-t border-[var(--glass-border)] flex items-center justify-between gap-1.5 text-[10px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const prompt = language === 'hi'
                            ? `मुझे ${stop.hindiName} के बारे में और बताएं और क्या यह मेरी वर्तमान यात्रा में आवश्यक है?`
                            : `Tell me more about ${stop.name} and why it fits my current itinerary.`;
                          onAskAIAboutStop(prompt);
                        }}
                        className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[var(--text-primary)] font-bold transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'AI से पूछें' : 'Ask AI'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExtendStay(15);
                          }}
                          className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[var(--text-primary)] font-bold transition-colors cursor-pointer"
                          title="Add 15 minutes stay"
                        >
                          +15m
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStop(stop.id);
                          }}
                          className="p-1 rounded-md text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer"
                          title="Remove this stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Transit Segment Indicator to next stop */}
                  {!isLast && stop.travelTimeToNextMinutes && (
                    <div className="my-1.5 ml-5 pl-4 border-l-2 border-dashed border-[var(--accent-primary)]/40 flex items-center gap-2 py-1 text-[10px] text-[var(--text-secondary)] font-medium">
                      <span className="p-1 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                        {stop.transportModeToNext === 'walk' ? (
                          <Footprints className="w-3 h-3" />
                        ) : (
                          <Car className="w-3 h-3" />
                        )}
                      </span>
                      <span>
                        {language === 'hi'
                          ? `अगले पड़ाव हेतु ~${stop.travelTimeToNextMinutes} मिनट (${stop.transportModeToNext === 'walk' ? 'पैदल' : 'ऑटो/टैक्सी'} • ${stop.travelDistanceToNextKm} किमी)`
                          : `Transit ~${stop.travelTimeToNextMinutes} mins via ${stop.transportModeToNext} (~${stop.travelDistanceToNextKm} km)`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Smart Hotel Location (Multi-Day) */}
            {itinerary.suggestedHotel && (
              <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-500/15 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Compass className="w-4 h-4" />
                  <span>{language === 'hi' ? 'अनुशंसित होटल क्षेत्र' : 'Smart Hotel Recommendation'}</span>
                </div>
                <p className="font-extrabold text-[var(--text-primary)]">
                  🏨 {itinerary.suggestedHotel.name}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  📍 {itinerary.suggestedHotel.area} • {itinerary.suggestedHotel.priceRange}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] italic pt-1 border-t border-indigo-500/20">
                  "{itinerary.suggestedHotel.rationale}"
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State: Quick Presets */
        <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4 text-[var(--text-primary)]">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <h3 className="text-sm font-extrabold font-display">
              {language === 'hi' ? 'अपनी यात्रा कोपायलट शुरू करें' : 'Start Your AI Copilot'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === 'hi'
                ? 'चैट में बस इतना कहें: "मेरे पास 3 घंटे हैं, मुझे 7 बजे तक स्टेशन वापस जाना है, घाट और खाना पसंद है" — AI तुरंत समयबद्ध नक्शा तैयार करेगा।'
                : 'Simply tell the AI: "I have 3 hours near the station, need to return by 7 PM, like ghats and local food" — Disha AI will create, time, and plot your entire trip.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
              {language === 'hi' ? 'या तुरंत तैयार यात्रा चुनें:' : 'Or Select an Instant Preset:'}
            </span>

            {presets.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="w-full text-left p-2.5 rounded-xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5 hover:border-[var(--accent-primary)] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {language === 'hi' ? preset.titleHi : preset.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold">
                    {preset.targetHours}h
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1 truncate">
                  📍 {preset.stops.map(s => s.name).join(' → ')}
                </p>
              </button>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-[10px] text-[var(--text-secondary)] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'मानचित्र पर किसी भी स्थान पर क्लिक करके उसे सीधे अपनी यात्रा में जोड़ सकते हैं।'
                : 'Click any place on the map to add it directly to your live trip itinerary.'}
            </span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
