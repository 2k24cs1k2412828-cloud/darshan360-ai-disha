// Image Resolver Service
// Seamlessly maps places and keywords to local files in /public/images/places/ or authentic verified fallbacks

import customPlaceImages from '../../data/place-images.json';

export interface PlaceImageEntry {
  id: string;
  name: string;
  keywords: string[];
  imagePath: string;
  fallbackUrl?: string;
  caption?: string;
}

const registry: PlaceImageEntry[] = customPlaceImages as PlaceImageEntry[];

/**
 * Resolves the best available image URL for a place.
 * 1. Matches by exact place ID
 * 2. Matches by keywords or name tokens
 * 3. Falls back to original provided URL if not in registry
 */
export function getResolvedImageForPlace(placeId: string, defaultUrl?: string): string {
  const lowerId = (placeId || '').toLowerCase().trim();
  
  const found = registry.find(p => 
    p.id.toLowerCase() === lowerId ||
    lowerId.includes(p.id.toLowerCase()) ||
    p.keywords.some(k => lowerId.includes(k.toLowerCase()))
  );

  if (found) {
    // If user has placed the image in public/images/places/, imagePath will be used.
    // In dev and prod, Vite statically serves anything in public/ directly from root.
    return found.imagePath || found.fallbackUrl || defaultUrl || '';
  }

  return defaultUrl || '';
}

/**
 * Find image by matching keywords from a user prompt or text
 */
export function findImageByKeyword(text: string): { url: string; caption?: string } | null {
  const lowerText = text.toLowerCase();
  for (const entry of registry) {
    if (entry.keywords.some(k => lowerText.includes(k.toLowerCase())) || lowerText.includes(entry.name.toLowerCase())) {
      return {
        url: entry.imagePath || entry.fallbackUrl || '',
        caption: entry.caption || entry.name
      };
    }
  }
  return null;
}
