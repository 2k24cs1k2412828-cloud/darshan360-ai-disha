// AI Travel Assistant & Factual Comparison Explainer
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.
// Rule: Operates strictly upon verified structured provider offers. NEVER invents pricing or schedules.

import { TravelOffer, SearchResponse } from '../types/travel.types';

export interface TravelComparisonAdvice {
  summary: string;
  cheapestOption?: { provider: string; title: string; price: number };
  fastestOption?: { provider: string; title: string; duration: string };
  bestValueOption?: { provider: string; title: string; price: number; reason: string };
  keyTradeoffs: string[];
}

export class TravelAssistantAdvisor {
  /**
   * Generates a truthful, verified structured comparison analysis based solely on real offers.
   */
  public static generateFactualAdvice(
    response: SearchResponse,
    language: 'en' | 'hi' = 'en'
  ): TravelComparisonAdvice {
    const { results, origin, destination, serviceType } = response;

    if (results.length === 0) {
      return {
        summary: language === 'hi' 
          ? `${origin.city} से ${destination.city} के लिए कोई सत्यापित विकल्प उपलब्ध नहीं हैं।`
          : `No verified travel offers were found for ${origin.city} to ${destination.city}.`,
        keyTradeoffs: []
      };
    }

    // 1. Determine Objective Extremes
    const sortedByPrice = [...results].sort((a, b) => a.totalPrice - b.totalPrice);
    const sortedByDuration = [...results].sort((a, b) => (a.durationMinutes || 9999) - (b.durationMinutes || 9999));
    const sortedByRating = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const cheapest = sortedByPrice[0];
    const fastest = sortedByDuration[0];
    const highestRated = sortedByRating[0];

    // 2. Best Value (Balanced)
    const bestValue = results[0]; // First in recommended order from ComparisonEngine

    // 3. Trade-off Synthesis
    const tradeoffs: string[] = [];

    if (cheapest.id !== fastest.id && cheapest.durationMinutes && fastest.durationMinutes) {
      const priceDiff = fastest.totalPrice - cheapest.totalPrice;
      const timeSavedMins = cheapest.durationMinutes - fastest.durationMinutes;
      const hoursSaved = (timeSavedMins / 60).toFixed(1);

      if (priceDiff > 0 && timeSavedMins > 20) {
        tradeoffs.push(
          language === 'hi'
            ? `⚡ ${fastest.providerName} (${fastest.title}) यात्रा में लगभग ${hoursSaved} घंटे बचाता है, जिसके लिए ₹${priceDiff} अतिरिक्त लगते हैं।`
            : `⚡ ${fastest.providerName} (${fastest.title}) saves ~${hoursSaved} hours of travel time for an extra ₹${priceDiff} over ${cheapest.providerName}.`
        );
      }
    }

    if (highestRated.id !== cheapest.id) {
      tradeoffs.push(
        language === 'hi'
          ? `⭐ ${highestRated.providerName} को यात्रियों द्वारा सर्वोच्च रेटिंग (${highestRated.rating}/5, ${highestRated.reviewCount} समीक्षाएँ) दी गई है।`
          : `⭐ Highest customer rating: ${highestRated.providerName} (${highestRated.rating}/5 from ${highestRated.reviewCount?.toLocaleString()} reviews).`
      );
    }

    // Cancellation flexibility check
    const refundableCount = results.filter((o) => o.refundable).length;
    if (refundableCount > 0) {
      tradeoffs.push(
        language === 'hi'
          ? `🛡️ ${results.length} में से ${refundableCount} विकल्पों में मुफ्त रद्दीकरण एवं लचीली धनवापसी नीति शामिल है।`
          : `🛡️ ${refundableCount} of ${results.length} offers provide flexible cancellation and refund options.`
      );
    }

    const formatDuration = (mins?: number) => {
      if (!mins) return 'N/A';
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const summary = language === 'hi'
      ? `हमने ${results.length} सत्यापित ${serviceType} विकल्पों का विश्लेषण किया। सबसे किफायती दर ₹${cheapest.totalPrice} (${cheapest.providerName}) से शुरू होती है।`
      : `Verified ${results.length} real-time ${serviceType} options. Lowest fare starts at ₹${cheapest.totalPrice.toLocaleString('en-IN')} via ${cheapest.providerName}.`;

    return {
      summary,
      cheapestOption: {
        provider: cheapest.providerName,
        title: cheapest.title,
        price: cheapest.totalPrice
      },
      fastestOption: {
        provider: fastest.providerName,
        title: fastest.title,
        duration: formatDuration(fastest.durationMinutes)
      },
      bestValueOption: {
        provider: bestValue.providerName,
        title: bestValue.title,
        price: bestValue.totalPrice,
        reason: language === 'hi' 
          ? `किफायती मूल्य, यात्रा अवधि और सेवा रेटिंग का संतुलित संयोजन` 
          : `Optimal balance of fare, journey duration, and traveler rating`
      },
      keyTradeoffs: tradeoffs
    };
  }
}
