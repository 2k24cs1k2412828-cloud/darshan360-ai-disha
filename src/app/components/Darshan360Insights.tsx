import { motion, AnimatePresence } from 'motion/react';
import { Camera, Compass, MapPin, ShieldCheck, Sparkles, X, ArrowRight, Route, CircleAlert } from 'lucide-react';

interface Darshan360InsightsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'morning' | 'evening';
}

const ecosystemPillars = [
  {
    title: 'AI Travel Companion',
    description: 'Personalized recommendations, itinerary planning, multilingual guidance, and adaptive responses shaped around traveler interests and budgets.',
  },
  {
    title: 'Heritage Discovery Engine',
    description: 'Uncovers lesser-known spiritual, historic, and cultural destinations that standard tourism platforms often miss.',
  },
  {
    title: 'Cultural Storytelling System',
    description: 'Brings legends, historical context, traditions, and local significance to every place so travel feels educational and immersive.',
  },
  {
    title: 'Regional Exploration Framework',
    description: 'Organizes journeys by region, circuit, cultural theme, and heritage routes to enable richer travel planning.',
  },
  {
    title: 'Community Tourism Network',
    description: 'Connects travelers to local guides, artisans, storytellers, homestays, and cultural entrepreneurs for authentic experiences.',
  },
];

const technologyPillars = [
  {
    title: 'Smart Recommendation Engine',
    description: 'Uses preference signals and travel behavior to suggest destinations, activities and routes that match the traveler.',
  },
  {
    title: 'Knowledge & Discovery Layer',
    description: 'Combines structured tourism data with heritage knowledge to support accurate, culturally relevant guidance.',
  },
  {
    title: 'Future-ready Scale',
    description: 'Designed for expansion across Uttar Pradesh, Bundelkhand, Madhya Pradesh and beyond as a pan-India tourism ecosystem.',
  },
];

const socialImpact = [
  {
    title: 'Heritage Preservation',
    description: 'Helps make cultural places more visible, understood and appreciated by travelers.',
  },
  {
    title: 'Local Opportunity',
    description: 'Supports guides, performers, artisans, homestay owners and small tourism businesses through direct discovery.',
  },
  {
    title: 'Sustainable Tourism',
    description: 'Encourages responsible travel while preserving cultural identity and regional development.',
  },
];

const accessibilityHighlights = [
  {
    name: 'Namo Ghat',
    rating: '10/10',
    note: 'Fully paved, direct vehicle access, zero-step entry for easier movement.',
  },
  {
    name: 'Dhamek Stupa',
    rating: '9/10',
    note: 'Smooth approach and plenty of rest points for a relaxed visit.',
  },
  {
    name: 'Sarnath Museum',
    rating: '9/10',
    note: 'Accessible interiors with lifts and wider pathways for comfort.',
  },
];

const hiddenGems = [
  {
    name: 'Sarnath Secret Monasteries',
    note: 'Quiet Tibetan, Korean and Chinese monasteries tucked away from crowded routes.',
  },
  {
    name: 'Rajdari & Devdari Waterfalls',
    note: 'A scenic monsoon-side escape for nature lovers and photographers.',
  },
  {
    name: 'Lolark Kund',
    note: 'An ancient stepwell with rich mythological and historical depth.',
  },
];

const photographyTips = [
  {
    title: 'Dashashwamedh Ghat',
    tip: 'Arrive 15 minutes before the evening aarti for the best golden light and river reflections.',
  },
  {
    title: 'Kashi Vishwanath Temple',
    tip: 'Capture the ornate spire early in the day when the lighting is soft and calm.',
  },
  {
    title: 'Sarnath Stupas',
    tip: 'Use a wider lens to frame the silence, symmetry and architectural detail.',
  },
];

const scamAlerts = [
  {
    title: 'Boat Ride Overcharging',
    detail: 'Always use official rates and confirm fares before boarding.',
  },
  {
    title: 'Fake Guides',
    detail: 'Choose licensed operators and verify recommendations through trusted channels.',
  },
  {
    title: 'Compulsory Donations',
    detail: 'Temple donations are voluntary; avoid any pressure to pay extra fees.',
  },
];

const itineraryIdeas = [
  {
    title: 'Central Varanasi Day',
    description: 'Temple visits, ghat walks, sunrise or sunset views and local cultural stops.',
  },
  {
    title: 'Accessible Sarnath Day',
    description: 'An easy-paced day focused on museum visits, stupa exploration and calm surroundings.',
  },
  {
    title: 'Hidden Gems Adventure',
    description: 'A more exploratory day with waterfalls, monasteries and lesser-known heritage spaces.',
  },
];

export function Darshan360Insights({ isOpen, onClose, theme }: Darshan360InsightsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 z-[9999] w-full max-w-xl overflow-y-auto border-l border-[var(--glass-border)] bg-[var(--bg-primary)]/95 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                  Darshan 360 Ecosystem
                </p>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  From Destination to Experience
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-2 text-[var(--text-primary)] shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <section className="rounded-2xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                  Built by Edufutura Technologies Pvt. Ltd.
                </p>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  An AI-powered heritage, spiritual and cultural tourism ecosystem.
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Darshan 360 combines cultural storytelling, personalized planning, hidden heritage discovery, and community-led experiences in one intelligent travel experience.
                </p>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Core ecosystem pillars</h3>
                </div>
                <div className="space-y-2">
                  {ecosystemPillars.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 font-medium text-[var(--text-primary)]">{item.title}</div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <Route className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Technology and scale</h3>
                </div>
                <div className="space-y-2">
                  {technologyPillars.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 font-medium text-[var(--text-primary)]">{item.title}</div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <ShieldCheck className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Social impact</h3>
                </div>
                <div className="space-y-2">
                  {socialImpact.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 font-medium text-[var(--text-primary)]">{item.title}</div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <Compass className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Accessibility highlights</h3>
                </div>
                <div className="space-y-2">
                  {accessibilityHighlights.map(item => (
                    <div key={item.name} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                        <span className="rounded-full bg-[var(--accent-primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--accent-primary)]">
                          {item.rating}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <MapPin className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Hidden gems to explore</h3>
                </div>
                <div className="space-y-2">
                  {hiddenGems.map(item => (
                    <div key={item.name} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <Camera className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Photography tips</h3>
                </div>
                <div className="space-y-2">
                  {photographyTips.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 font-medium text-[var(--text-primary)]">{item.title}</div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <ShieldCheck className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Scam awareness</h3>
                </div>
                <div className="space-y-2">
                  {scamAlerts.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 flex items-center gap-2 font-medium text-[var(--text-primary)]">
                        <CircleAlert className="h-4 w-4 text-[var(--accent-primary)]" />
                        {item.title}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--accent-primary)]">
                  <Route className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Suggested itineraries</h3>
                </div>
                <div className="space-y-2">
                  {itineraryIdeas.map(item => (
                    <div key={item.title} className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-medium text-[var(--text-primary)]">{item.title}</span>
                        <ArrowRight className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
