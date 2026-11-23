// Deterministic Cache & Freshness Management Service
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { SearchRequest, TravelOffer, FreshnessStatus, TravelServiceType } from '../types/travel.types';

export interface CacheEntry<T> {
  key: string;
  data: T;
  storedAt: number; // Epoch timestamp ms
  expiresAt: number; // Epoch timestamp ms
  serviceType: TravelServiceType;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keysCount: number;
}

// Configurable TTLs in Milliseconds
export const SERVICE_CACHE_TTLS: Record<TravelServiceType, number> = {
  cab: 45 * 1000,         // 45 seconds (dynamic surge pricing)
  bus: 5 * 60 * 1000,     // 5 minutes
  train: 10 * 60 * 1000,  // 10 minutes
  hotel: 15 * 60 * 1000,  // 15 minutes
  flight: 10 * 60 * 1000, // 10 minutes
  activity: 60 * 60 * 1000, // 1 hour
  package: 60 * 60 * 1000  // 1 hour
};

class TravelCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = { hits: 0, misses: 0, keysCount: 0 };

  /**
   * Generates a deterministic, canonical search key from a SearchRequest.
   */
  public generateSearchKey(req: SearchRequest): string {
    const originSlug = (req.origin.code || req.origin.city || req.origin.name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
    const destSlug = (req.destination.code || req.destination.city || req.destination.name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
    const passHash = `${req.passengers.adults || 1}a-${req.passengers.children || 0}c`;
    const rooms = req.rooms ? `-${req.rooms}r` : '';
    const prefs = req.preferences?.acOnly ? '-ac' : '';

    return `d360:travel:${req.serviceType}:${originSlug}:${destSlug}:${req.departureDate}:${passHash}${rooms}${prefs}`;
  }

  /**
   * Retrieves an item from cache if not expired.
   */
  public get<T>(key: string): { data: T; isExpired: boolean; ageMs: number } | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    const ageMs = now - entry.storedAt;
    const isExpired = now >= entry.expiresAt;

    if (isExpired) {
      this.stats.misses++;
      // Clean up lazily
      this.cache.delete(key);
      this.stats.keysCount = this.cache.size;
      return null;
    }

    this.stats.hits++;
    return { data: entry.data as T, isExpired: false, ageMs };
  }

  /**
   * Stores an item with service-specific TTL.
   */
  public set<T>(key: string, data: T, serviceType: TravelServiceType, customTtlMs?: number): void {
    const ttl = customTtlMs || SERVICE_CACHE_TTLS[serviceType] || 5 * 60 * 1000;
    const now = Date.now();

    this.cache.set(key, {
      key,
      data,
      storedAt: now,
      expiresAt: now + ttl,
      serviceType
    });

    this.stats.keysCount = this.cache.size;
  }

  /**
   * Calculates the exact human and technical freshness status of an offer based on fetchedAt.
   */
  public calculateFreshness(fetchedAtIso: string): FreshnessStatus {
    const ageMs = Date.now() - new Date(fetchedAtIso).getTime();

    if (ageMs < 45 * 1000) return 'live';       // Under 45 seconds
    if (ageMs < 4 * 60 * 1000) return 'recent'; // Under 4 minutes
    if (ageMs < 20 * 60 * 1000) return 'cached'; // Under 20 minutes
    return 'stale';
  }

  /**
   * Formats human-readable freshness label (e.g. "Checked 14s ago", "Updated 3m ago").
   */
  public formatFreshnessLabel(fetchedAtIso: string, language: 'en' | 'hi' = 'en'): string {
    const seconds = Math.floor((Date.now() - new Date(fetchedAtIso).getTime()) / 1000);

    if (seconds < 10) {
      return language === 'hi' ? '🟢 लाइव — अभी जाँचा गया' : '🟢 Live — verified just now';
    }
    if (seconds < 60) {
      return language === 'hi' ? `🟢 लाइव — ${seconds} सेकंड पहले` : `🟢 Live — checked ${seconds}s ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return language === 'hi' ? `🟡 ${minutes} मिनट पहले अपडेटेड` : `🟡 Updated ${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    return language === 'hi' ? `⚪ ${hours} घंटे पुराना` : `⚪ Cached ${hours}h ago`;
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, keysCount: 0 };
  }
}

export const travelCacheService = new TravelCacheService();
