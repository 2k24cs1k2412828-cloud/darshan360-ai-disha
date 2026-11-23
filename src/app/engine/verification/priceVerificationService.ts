// Pre-Booking Price & Availability Verification Service
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { TravelOffer, VerifiedOfferResult } from '../types/travel.types';
import { searchOrchestrator } from '../orchestrator/searchOrchestrator';

export class PriceVerificationService {
  /**
   * Performs mandatory live pre-booking verification directly with the provider.
   */
  public static async verifyOffer(offer: TravelOffer): Promise<VerifiedOfferResult> {
    const provider = searchOrchestrator.getProviderById(offer.providerId);

    if (!provider) {
      console.warn(`[VerificationService] Unknown provider "${offer.providerId}" for offer "${offer.id}".`);
      return {
        offerId: offer.id,
        providerId: offer.providerId,
        status: 'PROVIDER_ERROR',
        previousPrice: offer.totalPrice,
        currentPrice: offer.totalPrice,
        currency: offer.currency,
        priceShift: 0,
        availability: false,
        bookingUrl: offer.bookingUrl,
        verifiedAt: new Date().toISOString(),
        notes: 'Provider adapter is currently unmapped.'
      };
    }

    console.info(`[VerificationService] Initiating live verification with ${provider.name} for offer "${offer.id}"...`);
    const verified = await provider.verifyPrice(offer.id, offer);

    // If confirmed or shifted, also generate the authenticated tracking deep link
    if (verified.status === 'CONFIRMED' || verified.status === 'PRICE_CHANGED') {
      verified.bookingUrl = await provider.generateBookingUrl(offer);
    }

    console.info(`[VerificationService] Verification outcome: ${verified.status}, Price: ${verified.currentPrice} ${verified.currency} (Shift: ${verified.priceShift})`);
    return verified;
  }
}
