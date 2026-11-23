// Canonical Entity Deduplication Engine
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelOffer, CanonicalTravelEntity } from '../types/travel.types';

export class DeduplicationEngine {
  /**
   * Identifies identical trips or properties across different providers
   * and aggregates them into unified canonical groups.
   */
  public static groupIntoCanonicalEntities(offers: TravelOffer[]): CanonicalTravelEntity[] {
    const groups = new Map<string, TravelOffer[]>();

    offers.forEach((offer) => {
      const key = offer.canonicalEntityId || this.deriveFallbackKey(offer);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(offer);
    });

    const canonicalList: CanonicalTravelEntity[] = [];

    groups.forEach((groupedOffers, key) => {
      // Sort offers by total price ascending (cheapest provider first)
      groupedOffers.sort((a, b) => a.totalPrice - b.totalPrice);

      const lowest = groupedOffers[0].totalPrice;
      const highest = groupedOffers[groupedOffers.length - 1].totalPrice;
      const prime = groupedOffers[0];

      canonicalList.push({
        canonicalId: key,
        serviceType: prime.serviceType,
        title: prime.title,
        operatorOrBrand: prime.operatorName || prime.title,
        departureTime: prime.departureTime,
        durationMinutes: prime.durationMinutes,
        lowestPrice: lowest,
        highestPrice: highest,
        currency: prime.currency,
        providerCount: groupedOffers.length,
        offers: groupedOffers
      });
    });

    return canonicalList;
  }

  /**
   * Generates a deterministic fallback deduplication key based on title & time.
   */
  private static deriveFallbackKey(offer: TravelOffer): string {
    const cleanTitle = offer.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 24);
    const timeKey = offer.departureTime ? offer.departureTime.slice(11, 16).replace(':', '') : 'notime';
    return `canon_${offer.serviceType}_${cleanTitle}_${timeKey}`;
  }
}
