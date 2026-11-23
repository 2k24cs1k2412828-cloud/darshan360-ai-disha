// Central Search Orchestrator
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelProvider } from '../types/provider.types';
import { SearchRequest, SearchResponse, TravelOffer, ProviderStatusInfo } from '../types/travel.types';
import { travelCacheService } from '../cache/travelCacheService';
import { DeduplicationEngine } from './deduplicationEngine';
import { ComparisonEngine } from './comparisonEngine';

// Provider Adapters
import { RedBusAdapter } from '../adapters/bus/redbus.adapter';
import { AbhiBusAdapter } from '../adapters/bus/abhibus.adapter';
import { UPSRTCAdapter } from '../adapters/bus/upsrtc.adapter';
import { AgodaHotelAdapter } from '../adapters/hotels/agoda.adapter';
import { MakeMyTripHotelAdapter } from '../adapters/hotels/makemytrip.adapter';
import { OYOHotelAdapter } from '../adapters/hotels/oyo.adapter';
import { OlaCabAdapter } from '../adapters/cabs/ola.adapter';
import { UberCabAdapter } from '../adapters/cabs/uber.adapter';
import { IRCTCTrainAdapter } from '../adapters/trains/irctc.adapter';
import { IndiGoFlightAdapter } from '../adapters/flights/indigo.adapter';

export class SearchOrchestrator {
  private providers: Map<string, TravelProvider> = new Map();

  constructor() {
    this.registerDefaultAdapters();
  }

  private registerDefaultAdapters() {
    const list: TravelProvider[] = [
      new RedBusAdapter(),
      new AbhiBusAdapter(),
      new UPSRTCAdapter(),
      new AgodaHotelAdapter(),
      new MakeMyTripHotelAdapter(),
      new OYOHotelAdapter(),
      new OlaCabAdapter(),
      new UberCabAdapter(),
      new IRCTCTrainAdapter(),
      new IndiGoFlightAdapter()
    ];

    list.forEach((p) => this.providers.set(p.id, p));
  }

  public getRegisteredProviders(): TravelProvider[] {
    return Array.from(this.providers.values());
  }

  public getProviderById(id: string): TravelProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Executes multi-provider search concurrently with cache check and failure isolation.
   */
  public async executeSearch(request: SearchRequest, forceRefresh = false): Promise<SearchResponse> {
    const searchId = request.searchId || `search_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const normalizedRequest: SearchRequest = { ...request, searchId };

    const cacheKey = travelCacheService.generateSearchKey(normalizedRequest);

    // 1. Cache lookup
    if (!forceRefresh) {
      const cached = travelCacheService.get<SearchResponse>(cacheKey);
      if (cached && !cached.isExpired) {
        console.info(`[SearchOrchestrator] Cache HIT for key: ${cacheKey}`);
        return {
          ...cached.data,
          cached: true,
          status: 'cached'
        };
      }
    }

    console.info(`[SearchOrchestrator] Cache MISS. Executing concurrent search across providers for "${normalizedRequest.serviceType}".`);

    // 2. Select eligible enabled providers for the requested service
    const matchingProviders = Array.from(this.providers.values()).filter(
      (p) => p.config.isEnabled && p.supportedServices.includes(normalizedRequest.serviceType)
    );

    if (matchingProviders.length === 0) {
      return {
        searchId,
        serviceType: normalizedRequest.serviceType,
        status: 'failed',
        totalResults: 0,
        origin: normalizedRequest.origin,
        destination: normalizedRequest.destination,
        departureDate: normalizedRequest.departureDate,
        executedAt: new Date().toISOString(),
        cached: false,
        providers: [],
        results: []
      };
    }

    // 3. Concurrent Execution with Promise.allSettled
    const providerStatuses: ProviderStatusInfo[] = [];
    const collectedOffers: TravelOffer[] = [];

    const searchPromises = matchingProviders.map(async (provider) => {
      const start = Date.now();
      try {
        const offers = await provider.search(normalizedRequest);
        const latency = Date.now() - start;

        providerStatuses.push({
          providerId: provider.id,
          providerName: provider.name,
          status: 'success',
          resultsCount: offers.length,
          latencyMs: latency
        });

        return offers;
      } catch (err: any) {
        const latency = Date.now() - start;
        providerStatuses.push({
          providerId: provider.id,
          providerName: provider.name,
          status: 'failed',
          resultsCount: 0,
          latencyMs: latency,
          error: err?.message || 'Network exception'
        });
        return [];
      }
    });

    const settled = await Promise.allSettled(searchPromises);

    settled.forEach((res) => {
      if (res.status === 'fulfilled') {
        collectedOffers.push(...res.value);
      }
    });

    // 4. Deterministic Filtering and Sorting
    const filteredOffers = ComparisonEngine.filterOffers(collectedOffers, normalizedRequest.preferences);
    const sortedOffers = ComparisonEngine.sortOffers(filteredOffers, normalizedRequest.preferences?.sortBy || 'recommended');

    // 5. Group into canonical deduplicated entities
    const canonicalEntities = DeduplicationEngine.groupIntoCanonicalEntities(sortedOffers);

    const hasFailures = providerStatuses.some((p) => p.status === 'failed' || p.status === 'timeout');
    const finalStatus: SearchResponse['status'] = hasFailures && sortedOffers.length > 0
      ? 'partial'
      : sortedOffers.length > 0
      ? 'complete'
      : 'failed';

    const response: SearchResponse = {
      searchId,
      serviceType: normalizedRequest.serviceType,
      status: finalStatus,
      totalResults: sortedOffers.length,
      origin: normalizedRequest.origin,
      destination: normalizedRequest.destination,
      departureDate: normalizedRequest.departureDate,
      executedAt: new Date().toISOString(),
      cached: false,
      providers: providerStatuses,
      results: sortedOffers,
      canonicalEntities
    };

    // 6. Cache valid non-empty responses
    if (sortedOffers.length > 0) {
      travelCacheService.set(cacheKey, response, normalizedRequest.serviceType);
    }

    return response;
  }
}

export const searchOrchestrator = new SearchOrchestrator();
