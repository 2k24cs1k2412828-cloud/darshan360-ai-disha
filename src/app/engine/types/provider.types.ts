// Provider Adapter Contracts and Metadata
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { SearchRequest, TravelOffer, VerifiedOfferResult, TravelServiceType } from './travel.types';

export interface ProviderHealthStatus {
  providerId: string;
  isHealthy: boolean;
  latencyMs: number;
  lastChecked: number;
  errorMessage?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  slug: string;
  logo: string;
  supportedServices: TravelServiceType[];
  isEnabled: boolean;
  timeoutMs: number;
  rateLimitRpm: number;
  cacheTtlMinutes: number;
  affiliateId?: string;
}

export interface TravelProvider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  supportedServices: TravelServiceType[];
  config: ProviderConfig;

  /**
   * Primary search execution. Must return normalized TravelOffer objects.
   * Never throws - handles internal errors gracefully and returns empty array or partial array.
   */
  search(request: SearchRequest): Promise<TravelOffer[]>;

  /**
   * Mandatory real-time pre-booking price and availability verification.
   */
  verifyPrice(offerId: string, currentOffer: TravelOffer): Promise<VerifiedOfferResult>;

  /**
   * Generates secure affiliate-tracked deep-link or direct checkout redirect URL.
   */
  generateBookingUrl(offer: TravelOffer): Promise<string>;

  /**
   * Provider health and connectivity check.
   */
  checkHealth(): Promise<ProviderHealthStatus>;
}
