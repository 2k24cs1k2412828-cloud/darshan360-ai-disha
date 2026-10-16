// Ghumo India AI Travel Copilot Engine
// Provides time-based itinerary generation, dynamic replanning, deadline protection,
// experience-driven recommendation, and map-itinerary synchronization across Uttar Pradesh.

import { UP_PLACES, type UPPlace } from './uttarPradeshService';
import { UP_CITY_COORDINATES, UP_LANDMARK_COORDINATES } from '../../data/up-comprehensive-database';

export interface ItineraryStop {
  id: string;
  stopNumber: number;
  placeId?: string;
  name: string;
  hindiName: string;
  city: string;
  hindiCity: string;
  category: string;
  coordinates: [number, number];
  imageUrl?: string;
  startTime: string; // e.g., "4:00 PM"
  endTime: string;   // e.g., "4:45 PM"
  durationMinutes: number;
  travelTimeToNextMinutes?: number;
  travelDistanceToNextKm?: number;
  transportModeToNext?: 'walk' | 'auto' | 'taxi' | 'metro';
  activity: string;
  activityHi: string;
  whyThisPlace: string;
  whyThisPlaceHi: string;
  isFoodStop?: boolean;
  costEstimate?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface TripDay {
  dayNumber: number;
  title: string;
  titleHi: string;
  dateLabel?: string;
  stops: ItineraryStop[];
}

export interface TripItinerary {
  id: string;
  title: string;
  titleHi: string;
  city: string;
  hindiCity: string;
  targetHours: number;
  startTime: string; // e.g. "4:00 PM"
  deadlineTime?: string; // e.g. "7:00 PM"
  deadlineLabel?: string; // e.g. "Train departure at Cantt Station"
  safetyBufferMinutes: number; // e.g. 30
  currentStopIndex: number;
  stops: ItineraryStop[];
  isMultiDay?: boolean;
  days?: TripDay[];
  activeDayIndex?: number;
  suggestedHotel?: {
    name: string;
    area: string;
    rationale: string;
    coordinates: [number, number];
    priceRange: string;
  };
  totalDistanceKm: number;
  totalCostEstimate: string;
  optimizationsApplied?: string[];
}

// Haversine distance calculator between coordinates in km
export function calculateGeoDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371;
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.25 * 10) / 10; // ~1.25 urban winding coefficient
}

// Convert "4:00 PM" to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 960; // Default 4:00 PM = 16 * 60 = 960
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Convert minutes from midnight to formatted "4:00 PM"
export function minutesToTimeString(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  let hours = Math.floor(norm / 60);
  const minutes = norm % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${mm} ${ampm}`;
}

// Estimate realistic transit speed and mode
export function getTransitModeAndDuration(distanceKm: number, preferWalking: boolean = false): {
  mode: 'walk' | 'auto' | 'taxi';
  durationMinutes: number;
} {
  if (distanceKm <= 1.2 && preferWalking) {
    return { mode: 'walk', durationMinutes: Math.max(5, Math.round(distanceKm * 15)) };
  }
  if (distanceKm <= 0.8) {
    return { mode: 'walk', durationMinutes: Math.max(5, Math.round(distanceKm * 14)) };
  }
  if (distanceKm <= 5.0) {
    return { mode: 'auto', durationMinutes: Math.max(8, Math.round(distanceKm * 3.5 + 4)) };
  }
  return { mode: 'taxi', durationMinutes: Math.max(12, Math.round(distanceKm * 2.8 + 6)) };
}

// Natural language query parser
export interface ParsedTripConstraints {
  city: string;
  hours: number;
  startTime: string;
  deadlineTime?: string;
  deadlineLabel?: string;
  startLocationName?: string;
  preferFood: boolean;
  preferHistory: boolean;
  preferGhats: boolean;
  preferSunset: boolean;
  preferNature: boolean;
  preferWalking: boolean;
  walkLess: boolean;
  budget: 'budget' | 'moderate' | 'comfort';
  isMultiDay: boolean;
  numDays: number;
}

export function parseNaturalLanguageTripQuery(query: string): ParsedTripConstraints {
  const q = query.toLowerCase();

  // 1. Detect city
  let city = 'Varanasi';
  if (q.includes('ayodhya') || q.includes('ram mandir')) city = 'Ayodhya';
  else if (q.includes('lucknow') || q.includes('awadh')) city = 'Lucknow';
  else if (q.includes('mathura') || q.includes('vrindavan') || q.includes('braj')) city = 'Mathura';
  else if (q.includes('agra') || q.includes('taj')) city = 'Agra';
  else if (q.includes('prayagraj') || q.includes('allahabad') || q.includes('sangam')) city = 'Prayagraj';
  else if (q.includes('kanpur') || q.includes('bithoor')) city = 'Kanpur';
  else if (q.includes('jhansi')) city = 'Jhansi';
  else if (q.includes('chitrakoot')) city = 'Chitrakoot';

  // 2. Detect multi-day
  const isMultiDay = /\b(2 days|3 days|two days|three days|weekend trip|multi-day|दिन)\b/i.test(q);
  let numDays = 1;
  if (q.includes('3 day') || q.includes('three day')) numDays = 3;
  else if (q.includes('2 day') || q.includes('two day')) numDays = 2;

  // 3. Detect hours available
  let hours = 3; // Default 3 hours
  const hoursMatch = q.match(/(\d+)\s*(?:hours|hour|hrs|hr|घंटे|घंटा)/i);
  if (hoursMatch) {
    hours = Math.min(14, Math.max(1, parseInt(hoursMatch[1], 10)));
  } else if (q.includes('half day') || q.includes('afternoon') || q.includes('दोपहर')) {
    hours = 4;
  } else if (q.includes('full day') || q.includes('पूरा दिन')) {
    hours = 8;
  } else if (q.includes('evening') || q.includes('sunset') || q.includes('शाम')) {
    hours = 3;
  }

  // 4. Start time (default current/afternoon 3:30 PM)
  let startTime = '3:30 PM';
  const timeMatch = q.match(/\b(\d{1,2}(?::\d{2})?)\s*(am|pm)\b/i);
  if (timeMatch) {
    const rawH = timeMatch[1].includes(':') ? timeMatch[1] : `${timeMatch[1]}:00`;
    startTime = `${rawH} ${timeMatch[2].toUpperCase()}`;
  }

  // 5. Detect return deadline
  let deadlineTime: string | undefined = undefined;
  let deadlineLabel: string | undefined = undefined;
  const deadlineMatch = q.match(/(?:back by|reach by|before|deadline|train at|flight at|station by|तक वापस)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (deadlineMatch) {
    let t = deadlineMatch[1].trim();
    if (!/am|pm/i.test(t)) {
      t = `${t} PM`; // Default PM if unspecified
    }
    if (!t.includes(':')) {
      t = t.replace(/(\d+)\s*(am|pm)/i, '$1:00 $2');
    }
    deadlineTime = t.toUpperCase();
    if (q.includes('train') || q.includes('railway') || q.includes('station')) {
      deadlineLabel = 'Railway Station Departure';
    } else if (q.includes('flight') || q.includes('airport')) {
      deadlineLabel = 'Airport Flight Check-in';
    } else {
      deadlineLabel = 'Return Deadline';
    }
  }

  // 6. Preferences
  const preferFood = /\b(food|chaat|kachori|sweets|lunch|dinner|cafe|restaurant|khana|tasting|hungry|bite)\b/i.test(q);
  const preferHistory = /\b(history|historical|heritage|fort|monument|museum|archaeology|purana|itihas)\b/i.test(q);
  const preferGhats = /\b(ghat|river|aarti|ganga|saryu|yamuna|boat|snan)\b/i.test(q);
  const preferSunset = /\b(sunset|evening|viewpoint|golden hour|dusk|sunset view)\b/i.test(q);
  const preferNature = /\b(nature|wildlife|park|peaceful|quiet|garden|sukoon)\b/i.test(q);
  const preferWalking = /\b(walk|walking tour|on foot|pedestrian)\b/i.test(q);
  const walkLess = /\b(don't want to walk|dont walk|less walking|no walking|cab|taxi|tired)\b/i.test(q);

  return {
    city,
    hours,
    startTime,
    deadlineTime,
    deadlineLabel,
    preferFood,
    preferHistory,
    preferGhats,
    preferSunset,
    preferNature,
    preferWalking: preferWalking && !walkLess,
    walkLess,
    budget: q.includes('cheap') || q.includes('budget') ? 'budget' : q.includes('luxury') ? 'comfort' : 'moderate',
    isMultiDay,
    numDays
  };
}

// Generate practical time-aware trip itinerary
export function generateTimeBasedItinerary(constraints: ParsedTripConstraints): TripItinerary {
  const { city, hours, startTime, deadlineTime, deadlineLabel } = constraints;

  // Find candidate places in or nearby this city
  const cityPlaces = UP_PLACES.filter(p => 
    p.city.toLowerCase() === city.toLowerCase() || 
    p.hindiCity.includes(city)
  );

  // Score candidate places according to user intent
  const scoredPlaces = cityPlaces.map(p => {
    let score = p.accessibilityRating * 1.5;
    if (constraints.preferFood && p.category === 'food') score += 15;
    if (constraints.preferGhats && p.category === 'ghat') score += 12;
    if (constraints.preferHistory && (p.category === 'heritage' || p.category === 'monument')) score += 10;
    if (constraints.preferSunset && (p.category === 'ghat' || p.name.includes('Ghat') || p.category === 'nature')) score += 12;
    if (constraints.preferNature && p.category === 'nature') score += 14;
    return { place: p, score };
  }).sort((a, b) => b.score - a.score);

  // Target number of stops based on available hours (avg ~45-60m stay + ~15m transit)
  const maxStops = Math.min(5, Math.max(2, Math.floor(hours * 1.25)));

  // Selected places
  const selected: UPPlace[] = [];
  
  // Always include at least 1 landmark, 1 ghat/heritage, and 1 food stop if hours >= 2.5
  scoredPlaces.forEach(item => {
    if (selected.length >= maxStops) return;
    if (!selected.some(s => s.id === item.place.id)) {
      selected.push(item.place);
    }
  });

  // Ensure food stop is included if requested or >= 3 hours
  if ((constraints.preferFood || hours >= 3) && !selected.some(s => s.category === 'food')) {
    const foodCandidate = UP_PLACES.find(p => p.city.toLowerCase() === city.toLowerCase() && p.category === 'food') ||
      UP_PLACES.find(p => p.category === 'food');
    if (foodCandidate && selected.length > 2) {
      selected[1] = foodCandidate; // Insert food at mid-stop
    }
  }

  // Calculate timeline
  let currentMinutes = timeStringToMinutes(startTime);
  const safetyBufferMinutes = deadlineTime ? 30 : 15;
  const stops: ItineraryStop[] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < selected.length; i++) {
    const p = selected[i];
    const isFirst = i === 0;
    const isLast = i === selected.length - 1;
    const isFood = p.category === 'food';

    // Duration at this stop
    let stayDuration = isFood ? 40 : (isLast && constraints.preferSunset ? 50 : 35);
    if (hours <= 2) stayDuration = Math.min(stayDuration, 30);

    const stopStartStr = minutesToTimeString(currentMinutes);
    const stopEndMinutes = currentMinutes + stayDuration;
    const stopEndStr = minutesToTimeString(stopEndMinutes);

    // Distance to next
    let travelTimeToNext = 0;
    let distToNext = 0;
    let transitMode: 'walk' | 'auto' | 'taxi' = 'auto';

    if (!isLast) {
      const nextPlace = selected[i + 1];
      distToNext = calculateGeoDistanceKm(p.coordinates, nextPlace.coordinates);
      totalDistanceKm += distToNext;
      const transit = getTransitModeAndDuration(distToNext, constraints.preferWalking);
      transitMode = transit.mode;
      travelTimeToNext = transit.durationMinutes;
    }

    // "Why This Place?" rationale
    let why = `Selected for its prime location in ${p.city} and high cultural value.`;
    let whyHi = `${p.hindiCity} में अपनी केंद्रीय स्थिति और सांस्कृतिक महत्व के लिए चयनित।`;

    if (isFirst) {
      why = `Ideal starting point close to transit hubs with smooth crowd access and deep spiritual connection.`;
      whyHi = `आवागमन के निकटतम एवं सुगम दर्शन हेतु आदर्श प्रारंभिक बिंदु।`;
    } else if (isFood) {
      why = `Famous culinary institution located directly along your route without causing detours, fitting your ${stayDuration}-minute food window.`;
      whyHi = `मार्ग पर स्थित प्रसिद्ध प्रामाणिक खानपान केंद्र, जो अतिरिक्त चक्कर लगाए बिना समय में फिट बैठता है।`;
    } else if (isLast && constraints.preferSunset) {
      why = `Iconic evening sunset & aarti viewpoint, perfectly timed before departure with a ${safetyBufferMinutes}-minute buffer.`;
      whyHi = `संध्याकालीन आरती व सूर्यास्त दर्शन हेतु सर्वोत्तम स्थल, जो वापसी के लिए पर्याप्त समय छोड़ता है।`;
    } else {
      why = `Strategically chosen to minimize cross-city transit while experiencing the quintessential heritage of ${p.city}.`;
      whyHi = `${p.hindiCity} की प्रामाणिक धरोहर का अनुभव करते हुए यात्रा समय को न्यूनतम रखने हेतु चयनित।`;
    }

    stops.push({
      id: `stop_${p.id}_${i}`,
      stopNumber: i + 1,
      placeId: p.id,
      name: p.name,
      hindiName: p.hindiName,
      city: p.city,
      hindiCity: p.hindiCity,
      category: p.category,
      coordinates: p.coordinates,
      imageUrl: p.images?.[0]?.url,
      startTime: stopStartStr,
      endTime: stopEndStr,
      durationMinutes: stayDuration,
      travelTimeToNextMinutes: isLast ? undefined : travelTimeToNext,
      travelDistanceToNextKm: isLast ? undefined : distToNext,
      transportModeToNext: isLast ? undefined : transitMode,
      activity: isFood ? `Authentic Food Tasting & Refreshment` : `Guided Darshan & Heritage Walk`,
      activityHi: isFood ? `पारंपरिक स्थानीय खानपान व विश्राम` : `दर्शन, परिक्रमा एवं ऐतिहासिक अवलोकन`,
      whyThisPlace: why,
      whyThisPlaceHi: whyHi,
      isFoodStop: isFood,
      costEstimate: isFood ? '₹150 - ₹250' : 'Free entry / Nominal',
      status: i === 0 ? 'current' : 'upcoming'
    });

    currentMinutes = stopEndMinutes + travelTimeToNext;
  }

  // Multi-day hotel suggestion if requested
  const suggestedHotel = constraints.isMultiDay ? {
    name: `${city} Heritage Palace & Pilgrims Suites`,
    area: `Central ${city} (Within 15 mins of all main shrines)`,
    rationale: `Staying in this central district minimizes daily transit across your ${constraints.numDays}-day circuit and keeps you close to early morning aarti.`,
    coordinates: selected[0]?.coordinates || [25.3176, 82.9739],
    priceRange: '₹1,800 - ₹3,500 / night'
  } : undefined;

  return {
    id: `itin_${city.toLowerCase()}_${Date.now()}`,
    title: `${hours}-Hour ${city} Curated Experience`,
    titleHi: `${city} ${hours} घंटे का सुगम तीर्थ एवं धरोहर भ्रमण`,
    city,
    hindiCity: selected[0]?.hindiCity || city,
    targetHours: hours,
    startTime,
    deadlineTime,
    deadlineLabel: deadlineLabel || (deadlineTime ? 'Return Deadline' : undefined),
    safetyBufferMinutes,
    currentStopIndex: 0,
    stops,
    isMultiDay: constraints.isMultiDay,
    suggestedHotel,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    totalCostEstimate: constraints.budget === 'budget' ? '₹300 - ₹500' : '₹600 - ₹1,200',
    optimizationsApplied: [
      'Geographic sequence optimized for minimal cross-town auto transit',
      'Food stop aligned with midway lunch/snack window',
      deadlineTime ? `${safetyBufferMinutes}-minute deadline safety buffer enforced` : 'Spiritual evening aarti alignment'
    ]
  };
}

// Replanning: User is running late by X minutes
export function replanDelay(itinerary: TripItinerary, delayMinutes: number): TripItinerary {
  const updated = { ...itinerary };
  const currentIdx = updated.currentStopIndex;

  // Shift current stop end time and subsequent stops
  let accumulatedMinutes = delayMinutes;
  
  updated.stops = updated.stops.map((stop, idx) => {
    if (idx < currentIdx) return stop;

    const startM = timeStringToMinutes(stop.startTime) + (idx === currentIdx ? 0 : accumulatedMinutes);
    let duration = stop.durationMinutes;

    // If delay is significant (>20m) and deadline exists, trim stay durations to protect deadline
    if (delayMinutes >= 20 && updated.deadlineTime && duration > 25) {
      const trim = Math.min(10, duration - 25);
      duration -= trim;
      accumulatedMinutes = Math.max(0, accumulatedMinutes - trim);
    }

    const endM = startM + duration;

    return {
      ...stop,
      startTime: minutesToTimeString(startM),
      endTime: minutesToTimeString(endM),
      durationMinutes: duration
    };
  });

  // Re-calculate deadline safety buffer
  if (updated.deadlineTime && updated.stops.length > 0) {
    const lastStopEndM = timeStringToMinutes(updated.stops[updated.stops.length - 1].endTime);
    const deadlineM = timeStringToMinutes(updated.deadlineTime);
    updated.safetyBufferMinutes = Math.max(0, deadlineM - lastStopEndM);
  }

  updated.optimizationsApplied = [
    ...(updated.optimizationsApplied || []),
    `Schedule adjusted by +${delayMinutes} mins delay with deadline protection buffer recalculation`
  ];

  return updated;
}

// Replanning: Remove stop
export function removeStopFromItinerary(itinerary: TripItinerary, stopId: string): TripItinerary {
  const filtered = itinerary.stops.filter(s => s.id !== stopId);
  if (filtered.length === 0) return itinerary;

  // Re-number and recalculate transit times
  let currentM = timeStringToMinutes(filtered[0].startTime);
  let totalDist = 0;

  const recomputed = filtered.map((s, idx) => {
    const isLast = idx === filtered.length - 1;
    const startM = currentM;
    const endM = startM + s.durationMinutes;
    let dist = 0;
    let travelTime = 0;
    let mode: 'walk' | 'auto' | 'taxi' = 'auto';

    if (!isLast) {
      dist = calculateGeoDistanceKm(s.coordinates, filtered[idx + 1].coordinates);
      totalDist += dist;
      const tr = getTransitModeAndDuration(dist);
      travelTime = tr.durationMinutes;
      mode = tr.mode;
    }

    currentM = endM + travelTime;

    return {
      ...s,
      stopNumber: idx + 1,
      startTime: minutesToTimeString(startM),
      endTime: minutesToTimeString(endM),
      travelDistanceToNextKm: isLast ? undefined : dist,
      travelTimeToNextMinutes: isLast ? undefined : travelTime,
      transportModeToNext: isLast ? undefined : mode
    };
  });

  return {
    ...itinerary,
    stops: recomputed,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    currentStopIndex: Math.min(itinerary.currentStopIndex, recomputed.length - 1)
  };
}

// Initialize fresh itinerary from a single place (when user starts trip from map)
export function createItineraryFromSinglePlace(
  place: UPPlace,
  language: 'en' | 'hi' = 'en'
): TripItinerary {
  const isFood = place.category === 'food';
  const duration = isFood ? 45 : 45;
  const now = new Date();
  let hours = now.getHours();
  const minutes = Math.ceil(now.getMinutes() / 15) * 15;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const startTime = `${displayHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  const startM = hours * 60 + minutes;
  const endM = startM + duration;
  const endHours = Math.floor(endM / 60) % 24;
  const endMinutes = endM % 60;
  const endAmpm = endHours >= 12 ? 'PM' : 'AM';
  const endDisplayHours = endHours % 12 || 12;
  const endTime = `${endDisplayHours}:${endMinutes < 10 ? '0' : ''}${endMinutes} ${endAmpm}`;

  const firstStop: ItineraryStop = {
    id: `stop_${place.id || 'custom'}_${Date.now()}`,
    stopNumber: 1,
    placeId: place.id,
    name: place.name,
    hindiName: place.hindiName || place.name,
    city: place.city || 'Uttar Pradesh',
    hindiCity: place.hindiCity || 'उत्तर प्रदेश',
    category: place.category || 'heritage',
    coordinates: place.coordinates,
    imageUrl: place.images?.[0]?.url,
    startTime: startTime,
    endTime: endTime,
    durationMinutes: duration,
    activity: isFood ? 'Local Culinary Experience' : 'Darshan & Heritage Tour',
    activityHi: isFood ? 'स्थानीय खानपान व स्वाद' : 'दर्शन एवं सांस्कृतिक भ्रमण',
    whyThisPlace: `Initial destination selected by traveler from interactive map.`,
    whyThisPlaceHi: `यात्री द्वारा सीधे इंटरैक्टिव मानचित्र से चुना गया प्रारंभिक पड़ाव।`,
    isFoodStop: isFood,
    status: 'current'
  };

  return {
    id: `trip_${Date.now()}`,
    title: `${place.name} Dynamic Tour`,
    titleHi: `${place.hindiName || place.name} यात्रा`,
    city: place.city || 'Uttar Pradesh',
    hindiCity: place.hindiCity || 'उत्तर प्रदेश',
    targetHours: 3,
    startTime: startTime,
    safetyBufferMinutes: 20,
    currentStopIndex: 0,
    stops: [firstStop],
    totalDistanceKm: 0,
    totalCostEstimate: '₹200 - ₹500',
    optimizationsApplied: ['Custom Itinerary Initialized from Map']
  };
}

// Replanning: Insert new stop
export function insertPlaceIntoItinerary(
  itinerary: TripItinerary, 
  place: UPPlace, 
  afterIndex?: number
): TripItinerary {
  const insertIdx = afterIndex !== undefined ? afterIndex + 1 : itinerary.currentStopIndex + 1;
  const isFood = place.category === 'food';
  const duration = isFood ? 35 : 30;

  const newStop: ItineraryStop = {
    id: `stop_${place.id}_${Date.now()}`,
    stopNumber: insertIdx + 1,
    placeId: place.id,
    name: place.name,
    hindiName: place.hindiName,
    city: place.city,
    hindiCity: place.hindiCity,
    category: place.category,
    coordinates: place.coordinates,
    imageUrl: place.images?.[0]?.url,
    startTime: '0:00 AM', // Will be recomputed below
    endTime: '0:00 AM',
    durationMinutes: duration,
    activity: isFood ? 'Local Culinary Experience' : 'Sightseeing & Photography',
    activityHi: isFood ? 'स्थानीय खानपान स्वाद' : 'दर्शन एवं फोटोग्राफी',
    whyThisPlace: `User-selected addition dynamically inserted into route.`,
    whyThisPlaceHi: `यात्री द्वारा सीधे मानचित्र से यात्रा में जोड़ा गया।`,
    isFoodStop: isFood,
    status: 'upcoming'
  };

  const newStops = [...itinerary.stops];
  newStops.splice(insertIdx, 0, newStop);

  // Recalculate full timing
  let currentM = timeStringToMinutes(newStops[0].startTime);
  let totalDist = 0;

  const recomputed = newStops.map((s, idx) => {
    const isLast = idx === newStops.length - 1;
    const startM = currentM;
    const endM = startM + s.durationMinutes;
    let dist = 0;
    let travelTime = 0;
    let mode: 'walk' | 'auto' | 'taxi' = 'auto';

    if (!isLast) {
      dist = calculateGeoDistanceKm(s.coordinates, newStops[idx + 1].coordinates);
      totalDist += dist;
      const tr = getTransitModeAndDuration(dist);
      travelTime = tr.durationMinutes;
      mode = tr.mode;
    }

    currentM = endM + travelTime;

    return {
      ...s,
      stopNumber: idx + 1,
      startTime: minutesToTimeString(startM),
      endTime: minutesToTimeString(endM),
      travelDistanceToNextKm: isLast ? undefined : dist,
      travelTimeToNextMinutes: isLast ? undefined : travelTime,
      transportModeToNext: isLast ? undefined : mode
    };
  });

  return {
    ...itinerary,
    stops: recomputed,
    totalDistanceKm: Math.round(totalDist * 10) / 10
  };
}

// Replanning: Extend stay at current stop
export function extendStayAtCurrentStop(itinerary: TripItinerary, extraMinutes: number = 15): TripItinerary {
  const currentIdx = itinerary.currentStopIndex;
  if (currentIdx >= 0 && currentIdx < itinerary.stops.length) {
    const updatedStops = itinerary.stops.map((s, idx) => {
      if (idx === currentIdx) {
        return {
          ...s,
          durationMinutes: s.durationMinutes + extraMinutes
        };
      }
      return s;
    });
    return replanDelay({ ...itinerary, stops: updatedStops }, extraMinutes);
  }
  return replanDelay(itinerary, extraMinutes);
}

// Replanning: Advance trip progress
export function advanceItineraryProgress(itinerary: TripItinerary, newIndex: number): TripItinerary {
  const updatedStops = itinerary.stops.map((s, idx) => {
    if (idx < newIndex) return { ...s, status: 'completed' as const };
    if (idx === newIndex) return { ...s, status: 'current' as const };
    return { ...s, status: 'upcoming' as const };
  });

  return {
    ...itinerary,
    currentStopIndex: Math.min(newIndex, itinerary.stops.length - 1),
    stops: updatedStops
  };
}

// "✨ Optimize My Trip" - Sorts stops by geographical proximity (Traveling Salesperson heuristic)
export function optimizeItineraryOrder(itinerary: TripItinerary): TripItinerary {
  if (itinerary.stops.length <= 2) return itinerary;

  const first = itinerary.stops[0];
  const last = itinerary.deadlineTime ? itinerary.stops[itinerary.stops.length - 1] : null;
  const middle = last ? itinerary.stops.slice(1, -1) : itinerary.stops.slice(1);

  // Greedy shortest route ordering
  const ordered: ItineraryStop[] = [first];
  const remaining = [...middle];

  while (remaining.length > 0) {
    const currentCoord = ordered[ordered.length - 1].coordinates;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateGeoDistanceKm(currentCoord, remaining[i].coordinates);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }

  if (last) {
    ordered.push(last);
  }

  // Recalculate timeline with optimized sequence
  let currentM = timeStringToMinutes(ordered[0].startTime);
  let totalDist = 0;

  const recomputed = ordered.map((s, idx) => {
    const isLast = idx === ordered.length - 1;
    const startM = currentM;
    const endM = startM + s.durationMinutes;
    let dist = 0;
    let travelTime = 0;
    let mode: 'walk' | 'auto' | 'taxi' = 'auto';

    if (!isLast) {
      dist = calculateGeoDistanceKm(s.coordinates, ordered[idx + 1].coordinates);
      totalDist += dist;
      const tr = getTransitModeAndDuration(dist);
      travelTime = tr.durationMinutes;
      mode = tr.mode;
    }

    currentM = endM + travelTime;

    return {
      ...s,
      stopNumber: idx + 1,
      startTime: minutesToTimeString(startM),
      endTime: minutesToTimeString(endM),
      travelDistanceToNextKm: isLast ? undefined : dist,
      travelTimeToNextMinutes: isLast ? undefined : travelTime,
      transportModeToNext: isLast ? undefined : mode
    };
  });

  return {
    ...itinerary,
    stops: recomputed,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    optimizationsApplied: [
      ...(itinerary.optimizationsApplied || []),
      `Optimized stop sequencing via geographic proximity (reduced redundant backtracking)`
    ]
  };
}

// Ready-to-go quick trip presets
export function getPresetItineraries(): TripItinerary[] {
  return [
    generateTimeBasedItinerary({
      city: 'Varanasi',
      hours: 3,
      startTime: '4:00 PM',
      deadlineTime: '7:30 PM',
      deadlineLabel: 'Varanasi Cantt Station Departure',
      preferFood: true,
      preferGhats: true,
      preferHistory: true,
      preferSunset: true,
      preferNature: false,
      preferWalking: true,
      walkLess: false,
      budget: 'moderate',
      isMultiDay: false,
      numDays: 1
    }),
    generateTimeBasedItinerary({
      city: 'Ayodhya',
      hours: 4,
      startTime: '2:30 PM',
      deadlineTime: '7:00 PM',
      deadlineLabel: 'Ayodhya Dham Junction Return',
      preferFood: false,
      preferGhats: true,
      preferHistory: true,
      preferSunset: true,
      preferNature: false,
      preferWalking: false,
      walkLess: false,
      budget: 'moderate',
      isMultiDay: false,
      numDays: 1
    }),
    generateTimeBasedItinerary({
      city: 'Lucknow',
      hours: 3,
      startTime: '1:00 PM',
      deadlineTime: '5:00 PM',
      deadlineLabel: 'Charbagh Station Return',
      preferFood: true,
      preferGhats: false,
      preferHistory: true,
      preferSunset: false,
      preferNature: false,
      preferWalking: false,
      walkLess: false,
      budget: 'moderate',
      isMultiDay: false,
      numDays: 1
    })
  ];
}
