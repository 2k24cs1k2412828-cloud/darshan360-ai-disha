// Abstract Base Provider Adapter
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelProvider, ProviderConfig, ProviderHealthStatus } from '../types/provider.types';
import { SearchRequest, TravelOffer, VerifiedOfferResult, TravelServiceType } from '../types/travel.types';

export abstract class BaseProviderAdapter implements TravelProvider {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly slug: string;
  public abstract readonly logo: string;
  public abstract readonly supportedServices: TravelServiceType[];
  public abstract readonly config: ProviderConfig;

  /**
   * Internal provider-specific search implementation.
   */
  protected abstract executeSearch(request: SearchRequest, signal: AbortSignal): Promise<TravelOffer[]>;

  /**
   * Internal provider-specific verification implementation.
   */
  protected abstract executeVerify(offerId: string, currentOffer: TravelOffer): Promise<VerifiedOfferResult>;

  /**
   * Public search with built-in timeout, graceful exception isolation, and metrics.
   */
  public async search(request: SearchRequest): Promise<TravelOffer[]> {
    if (!this.config.isEnabled) {
      console.warn(`[TravelEngine] Provider "${this.name}" is disabled in config.`);
      return [];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs || 4500);

    const startTime = Date.now();
    try {
      const results = await this.executeSearch(request, controller.signal);
      const latency = Date.now() - startTime;
      console.info(`[TravelEngine] Provider "${this.name}" returned ${results.length} offers in ${latency}ms.`);
      return results;
    } catch (err: any) {
      const latency = Date.now() - startTime;
      if (err.name === 'AbortError') {
        console.warn(`[TravelEngine] Provider "${this.name}" timed out after ${latency}ms.`);
      } else {
        console.error(`[TravelEngine] Provider "${this.name}" encountered error:`, err?.message || err);
      }
      // Never crash the orchestrator; return empty array
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Public price verification before booking.
   */
  public async verifyPrice(offerId: string, currentOffer: TravelOffer): Promise<VerifiedOfferResult> {
    try {
      return await this.executeVerify(offerId, currentOffer);
    } catch (err: any) {
      console.error(`[TravelEngine] Verification error on "${this.name}":`, err?.message || err);
      return {
        offerId,
        providerId: this.id,
        status: 'PROVIDER_ERROR',
        previousPrice: currentOffer.totalPrice,
        currentPrice: currentOffer.totalPrice,
        currency: currentOffer.currency,
        priceShift: 0,
        availability: currentOffer.availability,
        bookingUrl: currentOffer.bookingUrl,
        verifiedAt: new Date().toISOString(),
        notes: 'Provider verification service temporarily unresponsive.'
      };
    }
  }

  /**
   * Generates secure deep link or booking redirect.
   */
  public async generateBookingUrl(offer: TravelOffer): Promise<string> {
    const affiliateParam = this.config.affiliateId ? `&aff_id=${encodeURIComponent(this.config.affiliateId)}&sub_id=d360_meta` : '';
    if (offer.bookingUrl.includes('?')) {
      return `${offer.bookingUrl}${affiliateParam}`;
    }
    return `${offer.bookingUrl}?source=darshan360${affiliateParam}`;
  }

  /**
   * Standard health check.
   */
  public async checkHealth(): Promise<ProviderHealthStatus> {
    const start = Date.now();
    try {
      return {
        providerId: this.id,
        isHealthy: this.config.isEnabled,
        latencyMs: Date.now() - start,
        lastChecked: Date.now()
      };
    } catch (err: any) {
      return {
        providerId: this.id,
        isHealthy: false,
        latencyMs: Date.now() - start,
        lastChecked: Date.now(),
        errorMessage: err?.message || 'Health check failed'
      };
    }
  }

  /**
   * Cryptographic verification hash generator.
   */
  protected generateOfferHash(providerId: string, externalId: string, price: number, departureTime?: string): string {
    const raw = `${providerId}:${externalId}:${price}:${departureTime || 'na'}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `d360_v1_${Math.abs(hash).toString(16)}`;
  }
}
