// Normalization & Validation Engine
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelOffer, PriceBreakdown } from '../types/travel.types';

export class NormalizationEngine {
  // Exchange rates normalized to INR
  private static readonly CURRENCY_RATES_TO_INR: Record<string, number> = {
    INR: 1.0,
    USD: 87.5,
    EUR: 94.2,
    GBP: 110.5,
    AED: 23.8
  };

  /**
   * Normalizes arbitrary provider financial values into standard INR base, taxes, fees, and total.
   */
  public static normalizePrice(
    base: number,
    taxes: number = 0,
    fees: number = 0,
    currency: string = 'INR'
  ): PriceBreakdown {
    const currUpper = (currency || 'INR').toUpperCase();
    const rate = this.CURRENCY_RATES_TO_INR[currUpper] || 1.0;

    const baseInr = Math.round(base * rate);
    const taxesInr = Math.round(taxes * rate);
    const feesInr = Math.round(fees * rate);
    const totalInr = baseInr + taxesInr + feesInr;

    return {
      basePrice: baseInr,
      taxes: taxesInr,
      fees: feesInr,
      totalPrice: totalInr,
      currency: 'INR',
      originalCurrency: currUpper !== 'INR' ? currUpper : undefined,
      originalAmount: currUpper !== 'INR' ? base + taxes + fees : undefined
    };
  }

  /**
   * Harmonizes time format into consistent ISO 8601 string with IST +05:30 offset.
   */
  public static normalizeTime(dateStr?: string, timeStr?: string): string | undefined {
    if (!dateStr) return undefined;
    if (dateStr.includes('T')) return dateStr; // already ISO

    const cleanTime = (timeStr || '12:00').trim();
    return `${dateStr}T${cleanTime}:00+05:30`;
  }

  /**
   * Cleans and dedupes amenity tags into unified presentation tags.
   */
  public static normalizeAmenities(rawAmenities: string[] = []): string[] {
    const dict: Record<string, string> = {
      'wifi': 'Free High-Speed Wi-Fi',
      'free wifi': 'Free High-Speed Wi-Fi',
      'ac': 'Air Conditioning',
      'air conditioning': 'Air Conditioning',
      'breakfast': 'Breakfast Included',
      'free breakfast': 'Breakfast Included',
      'charging': 'Charging Socket',
      'charging point': 'Charging Socket',
      'blanket': 'Sanitized Blankets',
      'blankets': 'Sanitized Blankets',
      'tracking': 'Live GPS Tracking',
      'live tracking': 'Live GPS Tracking'
    };

    const seen = new Set<string>();
    const normalized: string[] = [];

    rawAmenities.forEach((item) => {
      const lower = item.toLowerCase().trim();
      const standard = dict[lower] || item.trim();
      if (!seen.has(standard.toLowerCase()) && standard.length > 0) {
        seen.add(standard.toLowerCase());
        normalized.push(standard);
      }
    });

    return normalized;
  }

  /**
   * Validates and verifies required fields on an offer.
   */
  public static validateOffer(offer: TravelOffer): boolean {
    if (!offer.id || !offer.providerId || !offer.title) return false;
    if (typeof offer.totalPrice !== 'number' || offer.totalPrice <= 0) return false;
    if (!offer.bookingUrl || !offer.fetchedAt) return false;
    return true;
  }
}
