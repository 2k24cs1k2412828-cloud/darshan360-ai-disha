import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadBanaarasDatabase, getAllPlaces, getScamById, getAllScams, getEmergencyNumbers } from './madhyaPradeshService';
import { generateItinerary, formatItineraryForDisplay, type PreferenceType, type ItineraryDuration } from './itineraryService';
import { detectScamsInMessage, formatMultipleAlerts, getSafetyTips } from './scamDetectionService';

// Get API key from environment - Vite exposes it as import.meta.env.VITE_*
const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) ||
               'AIzaSyC3g6dAg2njQYU60AqtcAiPsn6g5-me4d4'; // Fallback for testing

console.log('Gemini API Key Status:', apiKey ? 'Loaded' : 'Not loaded');

let genAI: GoogleGenerativeAI | null = null;

try {
  if (apiKey && apiKey !== 'AIzaSyC3g6dAg2njQYU60AqtcAiPsn6g5-me4d4') {
    genAI = new GoogleGenerativeAI(apiKey);
  } else if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Using Gemini API with provided key');
  }
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

interface GeminiResponse {
  text: string;
  hasImage?: boolean;
  imageUrl?: string;
  hasMapHighlight?: boolean;
  hasLink?: boolean;
  linkText?: string;
  needsItinerary?: boolean;
  needsSafetyAlert?: boolean;
}

export async function getGeminiResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }>): Promise<GeminiResponse> {
  if (!genAI) {
    console.error('Gemini API not initialized');
    return getErrorResponse('API not initialized');
  }

  try {
    // Load Banaras database for domain-aware responses
    await loadBanaarasDatabase();
    
    // Check for scam patterns in user message
    const scamAlerts = detectScamsInMessage(userMessage);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Build comprehensive domain-aware system prompt with Darshan360 research
    const banaarasPlaces = getAllPlaces();
    
    // Organize places by zone
    const gwalior = banaarasPlaces.filter(p => p.zone === 'gwalior');
    const orchha = banaarasPlaces.filter(p => p.zone === 'orchha');
    const nearby = banaarasPlaces.filter(p => p.zone === 'nearby');

    // Build zone-specific location info with deep history
    const gwaliorInfo = gwalior.map(p => `• **${p.name}** (${p.category}): ${p.description}${p.deep_history ? ` - History: ${p.deep_history.substring(0, 120)}...` : ''} [Access: ${p.accessibility_rating}/10]`).join('\n');
    const orchhaInfo = orchha.map(p => `• **${p.name}**: ${p.description} [Access: ${p.accessibility_rating}/10]`).join('\n');
    const nearbyInfo = nearby.map(p => `• **${p.name}**: ${p.description}`).join('\n');

    // Get accessibility statistics
    const accessiblePlaces = banaarasPlaces.filter(p => (p.accessibility_rating || 0) >= 7);
    const hiddenGems = banaarasPlaces.filter(p => p.exploration_level === 'hidden_gems');

    const systemPrompt = `You are **Darshan 360**, an expert AI travel companion for all of India. You help travelers discover heritage, spiritual, cultural, nature, wildlife, beach, hill, desert, food, city, family, luxury, and adventure experiences across the country.

**POWERED BY DARSHAN360 RESEARCH:**
You have access to curated knowledge about heritage destinations including Varanasi, Gwalior, Orchha, and other important Indian travel circuits. Use that knowledge as a strong reference, but do not limit yourself to one state or region.

**YOUR TRAVEL EXPERTISE INCLUDES:**
1. **Pan-India Destination Guidance**: Rajasthan, Kerala, Goa, Himachal Pradesh, Uttarakhand, Tamil Nadu, Karnataka, Maharashtra, Gujarat, Uttar Pradesh, Delhi, Odisha, West Bengal, Northeast India, and more.
2. **Cultural & Spiritual Tourism**: Temples, ghats, monasteries, palaces, forts, museums, heritage walks, festivals, and rituals.
3. **Nature & Adventure**: Hill stations, beaches, national parks, waterfalls, trekking routes, wildlife safaris, and scenic road trips.
4. **Food & Local Experiences**: Regional cuisines, markets, street food, homestays, local guides, artisan experiences, and community-led travel.
5. **Practical Trip Planning**: Best seasons, budgets, transport options, local etiquette, safety tips, scams to avoid, and itinerary planning.
6. **Accessibility & Comfort**: Recommendations for differently-abled travelers, family travel, senior travelers, and comfortable pacing.
7. **Photography & Storytelling**: Best photo spots, timing, and cultural context for memorable experiences.
8. **Hidden Gems & Local Secrets**: Lesser-known destinations and authentic experiences beyond major tourist crowds.

**RESPONSE STYLE:**
- Answer as a knowledgeable India travel guide, not just a city or state-specific assistant.
- Personalize recommendations to budget, season, duration, interests, and travel style.
- Use a friendly, helpful, and inspiring tone.
- If a place is outside your reference set, still provide useful general travel guidance and mention that details may vary by season or local conditions.
- Suggest itineraries when users ask about trip planning.
- Include practical tips, cultural sensitivity, and safety guidance whenever relevant.

**IMPORTANT:**
- You are not limited to Madhya Pradesh, Gwalior, or Orchha.
- You can help with all-India travel planning, regional circuits, pilgrimages, cultural escapes, family holidays, honeymoon ideas, weekend trips, and long tours.
- If asked about a specific place, provide useful insights, nearby attractions, best time to visit, travel tips, and how to make the trip more meaningful.

Start responses with relevant emoji: 🏰 for forts, 🛕 for temples, 🌊 for beaches, 🏔️ for hills, 🍽️ for food, 📸 for photography, etc.`;

    // Prepare messages for the model
    const fullHistory = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am Darshan 360, your expert spiritual travel assistant. I will provide accurate information about heritage sites, costs, safety tips, and help you plan amazing cultural journeys while warning you about common scams.' }],
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    ];

    // Create chat session and send message
    const chat = model.startChat({
      history: fullHistory.slice(0, -1),
    });

    console.log('Sending message to Gemini API:', userMessage);
    const result = await chat.sendMessage(userMessage);
    let responseText = result.response.text();
    
    console.log('Received response from Gemini API');

    // Determine if response should have special formatting
    const hasMapHighlight = 
      userMessage.toLowerCase().includes('map') || 
      userMessage.toLowerCase().includes('location') ||
      userMessage.toLowerCase().includes('ghat') ||
      userMessage.toLowerCase().includes('where') ||
      userMessage.toLowerCase().includes('show') ||
      responseText.toLowerCase().includes('ghat') ||
      responseText.toLowerCase().includes('location');

    const hasLink = 
      responseText.includes('http://') || 
      responseText.includes('https://');

    // Check if we should suggest showing an image
    const hasImage = 
      userMessage.toLowerCase().includes('image') ||
      userMessage.toLowerCase().includes('photo') ||
      userMessage.toLowerCase().includes('see') ||
      userMessage.toLowerCase().includes('show') ||
      responseText.toLowerCase().includes('🏞️') ||
      responseText.toLowerCase().includes('📷') ||
      userMessage.toLowerCase().includes('boat') ||
      userMessage.toLowerCase().includes('ghat') ||
      userMessage.toLowerCase().includes('temple');

    // Add safety alerts if scams detected
    let needsSafetyAlert = false;
    if (scamAlerts.length > 0) {
      needsSafetyAlert = true;
      const alertText = formatMultipleAlerts(scamAlerts);
      responseText = alertText + '\n\n' + responseText;
    }

    // Check if itinerary generation is needed
    let needsItinerary = false;
    const itineraryKeywords = ['plan', 'itinerary', '1 day', '2 day', '3 day', 'trip', 'schedule', 'tour'];
    if (itineraryKeywords.some(kw => userMessage.toLowerCase().includes(kw))) {
      // Try to extract preferences and duration from message
      const durationMatch = userMessage.match(/(\d)\s*day/i);
      const duration = durationMatch ? parseInt(durationMatch[1]) as ItineraryDuration : 1;
      
      const preferenceKeywords: PreferenceType[] = ['boat', 'café', 'spiritual', 'budget', 'luxury', 'photography', 'adventure', 'cultural'];
      const detectedPreferences = preferenceKeywords.filter(pref => 
        userMessage.toLowerCase().includes(pref)
      );

      if (detectedPreferences.length > 0 || duration) {
        try {
          needsItinerary = true;
          const itinerary = await generateItinerary(
            duration,
            detectedPreferences.length > 0 ? detectedPreferences : ['spiritual', 'boat', 'cultural'],
            'moderate'
          );
          const itineraryText = formatItineraryForDisplay(itinerary);
          responseText = responseText + '\n\n' + itineraryText;
        } catch (error) {
          console.warn('Could not generate itinerary:', error);
        }
      }
    }

    const response: GeminiResponse = {
      text: responseText,
      hasMapHighlight,
      hasLink,
      hasImage,
      needsSafetyAlert,
      needsItinerary,
    };

    // Add image URL for certain topics
    if (hasImage) {
      if (userMessage.toLowerCase().includes('boat') || userMessage.toLowerCase().includes('ghat') || responseText.toLowerCase().includes('boat')) {
        response.imageUrl = 'https://images.unsplash.com/photo-1664823711178-1a0db71930e6?w=600';
      } else if (userMessage.toLowerCase().includes('food') || userMessage.toLowerCase().includes('lassi') || responseText.toLowerCase().includes('food')) {
        response.imageUrl = 'https://images.unsplash.com/photo-1762868821182-b8ef39a33a49?w=400';
      } else if (userMessage.toLowerCase().includes('temple') || responseText.toLowerCase().includes('temple')) {
        response.imageUrl = 'https://images.unsplash.com/photo-1635664979275-3e3f7dea97c7?w=400';
      } else {
        response.imageUrl = 'https://images.unsplash.com/photo-1768844335653-7593a132c203?w=600';
      }
    }

    return response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return getErrorResponse((error as Error)?.message || 'Unknown error');
  }
}

function getErrorResponse(errorMsg: string): GeminiResponse {
  console.error('Returning error response:', errorMsg);
  return {
    text: `I'm experiencing a connectivity issue: ${errorMsg}. Please try again. I'm Darshan 360, and I'm here to help with information about heritage sites, fort tours, palace visits, and travel tips for Gwalior and Orchha!`,
    hasImage: false,
    hasMapHighlight: false,
    hasLink: false,
  };
}
