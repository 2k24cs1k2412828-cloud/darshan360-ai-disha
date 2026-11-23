// Deterministic Comparison & Sorting Engine
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelOffer, SearchPreferences } from '../types/travel.types';

export class ComparisonEngine {
  /**
   * Sorts offers deterministically based on verified objective parameters.
   */
  public static sortOffers(
    offers: TravelOffer[],
    sortBy: 'cheapest' | 'fastest' | 'earliest' | 'rating' | 'recommended' = 'recommended'
  ): TravelOffer[] {
    const list = [...offers];

    switch (sortBy) {
      case 'cheapest':
        return list.sort((a, b) => a.totalPrice - b.totalPrice);

      case 'fastest':
        return list.sort((a, b) => (a.durationMinutes || 9999) - (b.durationMinutes || 9999));

      case 'earliest':
        return list.sort((a, b) => {
          const timeA = a.departureTime ? new Date(a.departureTime).getTime() : Infinity;
          const timeB = b.departureTime ? new Date(b.departureTime).getTime() : Infinity;
          return timeA - timeB;
        });

      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case 'recommended':
      default:
        return list.sort((a, b) => {
          // Transparent Value Score: Balances price, duration, rating, and cancellation policy
          const scoreA = this.calculateValueScore(a, offers);
          const scoreB = this.calculateValueScore(b, offers);
          return scoreB - scoreA;
        });
    }
  }

  /**
   * Filters offers by user-specified preference dimensions.
   */
  public static filterOffers(offers: TravelOffer[], prefs?: SearchPreferences): TravelOffer[] {
    if (!prefs) return offers;

    return offers.filter((offer) => {
      // 1. Refundable only
      if (prefs.refundableOnly && !offer.refundable) return false;

      // 2. AC only
      if (prefs.acOnly) {
        const text = `${offer.title} ${offer.classOrType || ''} ${offer.amenities.join(' ')}`.toLowerCase();
        if (!text.includes('ac') && !text.includes('air conditioning')) return false;
      }

      // 3. Sleeper only
      if (prefs.sleeperOnly) {
        const text = `${offer.title} ${offer.classOrType || ''}`.toLowerCase();
        if (!text.includes('sleeper')) return false;
      }

      // 4. Breakfast included
      if (prefs.breakfastIncluded) {
        const text = `${offer.amenities.join(' ')} ${offer.description || ''}`.toLowerCase();
        if (!text.includes('breakfast included')) return false;
      }

      // 5. Max budget limit
      if (prefs.maxBudget && prefs.maxBudget > 0) {
        if (offer.totalPrice > prefs.maxBudget) return false;
      }

      // 6. Preferred providers filter
      if (prefs.preferredProviders && prefs.preferredProviders.length > 0) {
        if (!prefs.preferredProviders.includes(offer.providerId)) return false;
      }

      return true;
    });
  }

  /**
   * Transparent, non-AI mathematical Value Score formula:
   * Considers Normalized Price (40%), Duration Saved (25%), Rating (25%), and Refundability (10%).
   */
  public static calculateValueScore(offer: TravelOffer, allOffers: TravelOffer[]): number {
    if (allOffers.length === 0) return 50;

    const prices = allOffers.map((o) => o.totalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Price Score: 100 for cheapest, scales down
    const priceRange = maxPrice - minPrice || 1;
    const priceScore = Math.max(0, 100 - ((offer.totalPrice - minPrice) / priceRange) * 100);

    // Rating Score: 100 for 5.0 rating
    const ratingScore = ((offer.rating || 3.5) / 5) * 100;

    // Refundability Score
    const refundScore = offer.refundable ? 100 : 30;

    // Duration Score
    const durations = allOffers.map((o) => o.durationMinutes || 480);
    const minDur = Math.min(...durations);
    const maxDur = Math.max(...durations);
    const durRange = maxDur - minDur || 1;
    const durScore = Math.max(0, 100 - (((offer.durationMinutes || 480) - minDur) / durRange) * 100);

    return Math.round(priceScore * 0.4 + durScore * 0.25 + ratingScore * 0.25 + refundScore * 0.1);
  }
}
