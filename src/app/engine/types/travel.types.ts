// Universal Travel Engine Type Definitions
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

export type TravelServiceType = 'bus' | 'train' | 'cab' | 'hotel' | 'flight' | 'activity' | 'package';

export interface Location {
  name: string;
  city: string;
  state?: string;
  country: string;
  code?: string; // Station / Airport / City code (e.g., CNB, DEL, VNS)
  latitude?: number;
  longitude?: number;
}

export interface PassengerConfig {
  adults: number;
  children?: number;
  infants?: number;
}

export interface SearchPreferences {
  refundableOnly?: boolean;
  acOnly?: boolean;
  sleeperOnly?: boolean;
  breakfastIncluded?: boolean;
  cabinClass?: 'economy' | 'premium_economy' | 'business';
  maxBudget?: number;
  preferredProviders?: string[];
  sortBy?: 'cheapest' | 'fastest' | 'earliest' | 'rating' | 'recommended';
}

export interface SearchRequest {
  searchId?: string;
  serviceType: TravelServiceType;
  origin: Location;
  destination: Location;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  passengers: PassengerConfig;
  rooms?: number;
  preferences?: SearchPreferences;
  timestamp?: number;
}

export interface PriceBreakdown {
  basePrice: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency: 'INR' | string;
  originalCurrency?: string;
  originalAmount?: number;
}

export type FreshnessStatus = 'live' | 'recent' | 'cached' | 'stale';

export interface TravelOffer {
  id: string;
  searchId: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  serviceType: TravelServiceType;
  title: string;
  subtitle?: string;
  description?: string;

  // Normalized Financials
  basePrice: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency: 'INR' | string;
  originalCurrency?: string;
  originalAmount?: number;

  // Schedule & Logistics
  departureTime?: string; // ISO 8601 with timezone (e.g., 2026-10-10T21:00:00+05:30)
  arrivalTime?: string;
  durationMinutes?: number;
  departureStation?: string;
  arrivalStation?: string;

  // Rating & Service
  rating?: number;
  reviewCount?: number;
  availability: boolean;
  seatsRemaining?: number;
  refundable: boolean;
  cancellationPolicy: string;
  amenities: string[];

  // Mode Specific Attributes
  classOrType?: string; // e.g., "AC Sleeper (2+1)", "Executive 3A", "Deluxe King Room"
  baggageAllowance?: string;
  operatorName?: string;
  vehicleModel?: string; // For cabs
  etaMinutes?: number; // For cabs

  // Canonical Deduplication Key
  canonicalEntityId?: string;

  // Booking & Attribution
  bookingUrl: string;
  deepLinkType: 'direct_affiliate' | 'partner_api' | 'official_site';
  fetchedAt: string;
  expiresAt: string;
  freshnessStatus: FreshnessStatus;
  verificationHash: string;
}

export interface CanonicalTravelEntity {
  canonicalId: string;
  serviceType: TravelServiceType;
  title: string;
  operatorOrBrand: string;
  departureTime?: string;
  durationMinutes?: number;
  lowestPrice: number;
  highestPrice: number;
  currency: string;
  providerCount: number;
  offers: TravelOffer[];
}

export interface ProviderStatusInfo {
  providerId: string;
  providerName: string;
  status: 'pending' | 'success' | 'failed' | 'timeout';
  resultsCount: number;
  latencyMs: number;
  error?: string;
}

export interface SearchResponse {
  searchId: string;
  serviceType: TravelServiceType;
  status: 'complete' | 'partial' | 'cached' | 'failed';
  totalResults: number;
  origin: Location;
  destination: Location;
  departureDate: string;
  executedAt: string;
  cached: boolean;
  providers: ProviderStatusInfo[];
  results: TravelOffer[];
  canonicalEntities?: CanonicalTravelEntity[];
}

export interface VerifiedOfferResult {
  offerId: string;
  providerId: string;
  status: 'CONFIRMED' | 'PRICE_CHANGED' | 'UNAVAILABLE' | 'PROVIDER_ERROR';
  previousPrice: number;
  currentPrice: number;
  currency: string;
  priceShift: number; // positive = increased, negative = dropped
  availability: boolean;
  seatsRemaining?: number;
  bookingUrl: string;
  verifiedAt: string;
  notes?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  providerName: string;
}
