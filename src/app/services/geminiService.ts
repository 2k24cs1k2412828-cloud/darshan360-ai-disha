import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  getAllUPPlaces, 
  getAllUPGhats,
  getUPNews, 
  getUPScams, 
  getUPRoutes, 
  searchUPPlaces, 
  getCrowdAdvisoryByCity,
  calculateDynamicUPRoute,
  UP_CROWD_ADVISORIES,
  type UPPlace,
  type UPNewsEvent,
  type UPRoute,
  type UPScamAdvisory,
  type UPCityCrowdAdvisory
} from './uttarPradeshService';

// Get API key from environment or fallback
const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) ||
               'AIzaSyCsrRVFsKKQbVQDeoPeODlKF5KTfs_mMi0';

let genAI: GoogleGenerativeAI | null = null;
try {
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

export interface InChatMapData {
  title: string;
  hindiTitle?: string;
  center: [number, number];
  zoom?: number;
  markers: Array<{
    position: [number, number];
    title: string;
    description: string;
  }>;
  routePath?: [number, number][];
  distanceKm?: number;
}

export interface InChatImage {
  url: string;
  title: string;
  caption?: string;
}

export interface GeminiResponse {
  text: string;
  language: 'en' | 'hi';
  hasImage?: boolean;
  images?: InChatImage[];
  hasMap?: boolean;
  mapData?: InChatMapData;
  newsItems?: UPNewsEvent[];
  crowdAdvisory?: UPCityCrowdAdvisory;
  scamAlerts?: UPScamAdvisory[];
}

export async function getGeminiResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  currentLang: 'en' | 'hi' = 'en'
): Promise<GeminiResponse> {
  const upPlaces = getAllUPPlaces();
  const upGhats = getAllUPGhats();
  const upNews = getUPNews();
  const upScams = getUPScams();
  const upRoutes = getUPRoutes();

  // Detect Hindi language in message or current toggle
  const isHindi = 
    currentLang === 'hi' ||
    /[\u0900-\u097F]/.test(userMessage) || 
    /\b(namaste|kripya|bataiye|mandir|aarti|yatra|kaise|kaha|rasta|kya|darshan|samay|chahiye|bheed|jana|layak|ghat|kanpur|jhansi|prayag)\b/i.test(userMessage);

  const activeLang: 'en' | 'hi' = isHindi ? 'hi' : 'en';

  // Check for image request intent
  const isImageRequest = 
    /\b(image|images|photo|photos|picture|pictures|pic|pics|dikhao|dekhein|tasveer|tasveerein|photo dikhao|tasveer dikhao|gallery)\b/i.test(userMessage);

  // Check for map / route / track intent
  const isMapRouteRequest = 
    /\b(map|route|rasta|track|direction|directions|kaha hai|location|distance|duriyan|dur|kaise pahuche|circuit|waypoints|itinerary|plan)\b/i.test(userMessage);

  // Check for all ghats request
  const isGhatsQuery = 
    /\b(ghat|ghats|saare ghat|all ghats|riverfront|ganga aarti|saryu ghat|yamuna ghat|घाट)\b/i.test(userMessage);

  // Check for latest news intent
  const isNewsRequest = 
    /\b(news|latest|update|updates|samachar|kya chal raha|kumbh|mela|aarti pass|rules|tarikh|timing update|what is happening)\b/i.test(userMessage);

  // Check for dynamic point-to-point route query (e.g., "kanpur to prayag", "lucknow to ayodhya", "jhansi to chitrakoot")
  const routeMatch = userMessage.match(/\b([a-zA-Z\u0900-\u097F]{3,})\s+(?:to|se|se lekar|tak)\s+([a-zA-Z\u0900-\u097F]{3,})\b/i);
  let computedDynamicRoute: ReturnType<typeof calculateDynamicUPRoute> = null;
  if (routeMatch) {
    computedDynamicRoute = calculateDynamicUPRoute(routeMatch[1], routeMatch[2]);
  }

  // Match referenced places & city crowd advisories
  const matchedPlaces = searchUPPlaces(userMessage);
  const matchedCrowdAdvisory = getCrowdAdvisoryByCity(userMessage);

  // Extract images strictly corresponding to the matched place and NEVER substitute wrong cities
  let responseImages: InChatImage[] = [];
  
  if (matchedPlaces.length > 0) {
    // Only return images for the places actually matched in the query!
    matchedPlaces.slice(0, 4).forEach(place => {
      place.images.forEach(img => {
        responseImages.push({
          url: img.url,
          title: activeLang === 'hi' ? img.title.hi : img.title.en,
          caption: activeLang === 'hi' ? `${place.hindiName} (${place.hindiCity})` : `${place.name} (${place.city})`
        });
      });
    });
  } else if (isGhatsQuery) {
    // Only return distinct images from ghats
    upGhats.slice(0, 6).forEach(g => {
      if (g.images.length > 0) {
        responseImages.push({
          url: g.images[0].url,
          title: activeLang === 'hi' ? g.hindiName : g.name,
          caption: activeLang === 'hi' ? `${g.hindiName} (${g.hindiCity})` : `${g.name} (${g.city})`
        });
      }
    });
  } else if (isImageRequest) {
    // General photo request: give 1 representative photo across varied circuits (Ayodhya, Varanasi, Mathura, Jhansi)
    const diversePlaces = [
      upPlaces.find(p => p.city.toLowerCase() === 'ayodhya'),
      upPlaces.find(p => p.city.toLowerCase() === 'varanasi'),
      upPlaces.find(p => p.city.toLowerCase() === 'mathura'),
      upPlaces.find(p => p.city.toLowerCase() === 'jhansi')
    ].filter(Boolean) as UPPlace[];

    diversePlaces.forEach(place => {
      if (place.images.length > 0) {
        responseImages.push({
          url: place.images[0].url,
          title: activeLang === 'hi' ? place.hindiName : place.name,
          caption: activeLang === 'hi' ? place.hindiName : place.name
        });
      }
    });
  }

  // Extract Map / Route Data
  let mapData: InChatMapData | undefined = undefined;

  if (computedDynamicRoute) {
    mapData = {
      title: activeLang === 'hi' ? computedDynamicRoute.name.hi : computedDynamicRoute.name.en,
      center: computedDynamicRoute.waypoints[0],
      zoom: 8,
      markers: computedDynamicRoute.waypoints.map((w, idx) => ({
        position: w,
        title: idx === 0 
          ? (activeLang === 'hi' ? `प्रारंभिक स्थल: ${routeMatch![1]}` : `Start: ${routeMatch![1]}`)
          : idx === computedDynamicRoute!.waypoints.length - 1 
            ? (activeLang === 'hi' ? `गंतव्य: ${routeMatch![2]}` : `Destination: ${routeMatch![2]}`)
            : (activeLang === 'hi' ? `मार्ग पड़ाव ${idx}` : `Highway Waypoint ${idx}`),
        description: `Distance: ~${computedDynamicRoute!.distanceKm} km | ${computedDynamicRoute!.estimatedDrivingTime}`
      })),
      routePath: computedDynamicRoute.waypoints,
      distanceKm: computedDynamicRoute.distanceKm
    };
  } else if (isGhatsQuery) {
    mapData = {
      title: activeLang === 'hi' ? 'उत्तर प्रदेश के सभी प्रमुख पावन घाट' : 'All Sacred Ghats of Uttar Pradesh',
      center: [25.3076, 83.0103],
      zoom: 8,
      markers: upGhats.map(g => ({
        position: g.coordinates,
        title: activeLang === 'hi' ? `${g.hindiName} (${g.hindiCity})` : `${g.name} (${g.city})`,
        description: activeLang === 'hi' ? g.description.hi : g.description.en
      }))
    };
  } else if (matchedPlaces.length >= 2) {
    mapData = {
      title: activeLang === 'hi' ? `${matchedPlaces[0].hindiCity} से ${matchedPlaces[matchedPlaces.length - 1].hindiCity} यात्रा मार्ग` : `${matchedPlaces[0].city} to ${matchedPlaces[matchedPlaces.length - 1].city} Route`,
      center: matchedPlaces[0].coordinates,
      zoom: 8,
      markers: matchedPlaces.map(p => ({
        position: p.coordinates,
        title: activeLang === 'hi' ? p.hindiName : p.name,
        description: activeLang === 'hi' ? p.description.hi : p.description.en
      })),
      routePath: matchedPlaces.map(p => p.coordinates),
      distanceKm: 240
    };
  } else if (matchedPlaces.length === 1) {
    const place = matchedPlaces[0];
    mapData = {
      title: activeLang === 'hi' ? place.hindiName : place.name,
      center: place.coordinates,
      zoom: 14,
      markers: [{
        position: place.coordinates,
        title: activeLang === 'hi' ? place.hindiName : place.name,
        description: activeLang === 'hi' ? place.description.hi : place.description.en
      }]
    };
  } else if (isMapRouteRequest) {
    const defaultRoute = upRoutes[0];
    mapData = {
      title: activeLang === 'hi' ? defaultRoute.name.hi : defaultRoute.name.en,
      center: [26.7956, 82.1943],
      zoom: 8,
      markers: upPlaces.slice(0, 6).map(p => ({
        position: p.coordinates,
        title: activeLang === 'hi' ? p.hindiName : p.name,
        description: activeLang === 'hi' ? p.description.hi : p.description.en
      })),
      routePath: defaultRoute.waypoints,
      distanceKm: defaultRoute.distanceKm
    };
  }

  // System Prompt with Real-time Crowd Status & Travel Causes
  const crowdSummary = Object.values(UP_CROWD_ADVISORIES).map(c => `
[CITY CROWD & FEASIBILITY STATUS - ${c.cityName.en}]:
Crowd Level: ${c.currentCrowdLevel.toUpperCase()} (${c.crowdBadge.en})
Travel Feasibility ("Jane layak hai ya nahi"): ${c.feasibilityVerdict.en}
Detailed Status: ${c.detailedStatus.en}
Best Visiting Hours: ${c.bestVisitingSlots.en}
How to Reach: ${c.howToReach.en}
Recent Happenings: ${c.latestHappening.en}
`).join('\n---\n');

  const placesInfo = upPlaces.slice(0, 35).map(p => `
Place: ${p.name} (${p.hindiName}) | City: ${p.city} (${p.hindiCity}) | Category: ${p.category}
Travel Cause: ${p.travelCause.en} / ${p.travelCause.hi}
History: ${p.deepHistory.en}
Timings & Fees: ${p.timings.en} | ${p.entryFee.en}
Accessibility: ${p.accessibilityRating}/10 (${p.accessibilityNotes.en})
`).join('\n');

  const systemPrompt = `You are Disha AI (दिशा एआई), the official, intelligent and highly informed travel companion for Uttar Pradesh Tourism (Darshan 360).
Your knowledge covers all 75 districts of Uttar Pradesh including Jhansi, Kanpur, Ayodhya, Varanasi, Mathura, Vrindavan, Prayagraj, Agra, Lucknow, Chitrakoot, Gorakhpur, Mirzapur, etc.

Language Guidelines:
- The user's active language is **${activeLang === 'hi' ? 'HINDI (हिन्दी)' : 'ENGLISH'}**.
- If the user writes in Hindi or asks in Hindi, write in pure, articulate, and culturally respectful Hindi (शुद्ध एवं सुरुचिपूर्ण हिन्दी).
- If the user writes in English, respond in articulate, structured, and informative English.

Core Responsibilities:
1. **Accurate City-Specific Responses**:
   - If asked about Jhansi, focus exclusively on Jhansi (Jhansi Fort, Rani Laxmi Bai, Rani Mahal, 1857 freedom struggle history, transport, and photos). Never substitute Agra or other cities.
   - If asked about Kanpur, focus on JK Temple, Bithoor Brahmavarta Ghat, Valmiki Ashram, and Allen Forest Zoo.
2. **Accurate Route & Highway Guidance**:
   - If asked for routes (e.g. Kanpur to Prayagraj, Lucknow to Ayodhya, Jhansi to Chitrakoot), provide highway numbers, distance in km, driving times, and train connectivity.
3. **Answer "Jane Layak Hai Ya Nahi" & Live Crowd Status**:
   - Give clear feasibility verdicts, current queue wait times, and the best hours to visit.
4. **Explain the "Travel Cause"**:
   - Always clearly explain *why* a place or pilgrimage is visited.
5. **Formatting**:
   - Use Markdown headers (###), bold bullet points, and helpful emojis (🛕, 🏰, 🌊, 🛣️, ⏰, ♿, 💡).

REAL-TIME CROWD & FEASIBILITY ADVISORIES:
${crowdSummary}

DESTINATIONS & GHATS HIGHLIGHTS:
${placesInfo}
`;

  // Execute Gemini API call
  try {
    if (!genAI) throw new Error('Gemini API client not initialized');

    const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];
    let responseText = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        });

        const contents = [
          ...conversationHistory.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ];

        const result = await model.generateContent({ contents });
        responseText = result.response.text();
        if (responseText) break;
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} error:`, modelErr?.message);
      }
    }

    if (!responseText) throw new Error('No text returned from models');

    return {
      text: responseText,
      language: activeLang,
      hasImage: responseImages.length > 0,
      images: responseImages.length > 0 ? responseImages : undefined,
      hasMap: !!mapData,
      mapData,
      crowdAdvisory: matchedCrowdAdvisory,
      newsItems: isNewsRequest ? upNews : undefined
    };

  } catch (apiError: any) {
    console.warn('Gemini API fallback triggered:', apiError);

    // High quality offline fallback generator
    return generateSmartOfflineResponse(userMessage, activeLang, matchedPlaces, mapData, responseImages, matchedCrowdAdvisory, computedDynamicRoute, upNews, isGhatsQuery, upGhats);
  }
}

// Comprehensive intelligent offline response generator
function generateSmartOfflineResponse(
  userMessage: string,
  lang: 'en' | 'hi',
  matchedPlaces: UPPlace[],
  mapData?: InChatMapData,
  images?: InChatImage[],
  crowdAdvisory?: UPCityCrowdAdvisory,
  dynamicRoute?: ReturnType<typeof calculateDynamicUPRoute>,
  news?: UPNewsEvent[],
  isGhatsQuery?: boolean,
  upGhats?: UPPlace[]
): GeminiResponse {
  // If point-to-point route computed
  if (dynamicRoute) {
    const text = lang === 'hi'
      ? `### 🛣️ ${dynamicRoute.name.hi} (मार्ग एवं दूरी विवरण)

**📍 दूरी एवं अनुमानित समय:**
• **कुल दूरी:** ~${dynamicRoute.distanceKm} किमी
• **सड़क मार्ग समय:** ${dynamicRoute.estimatedDrivingTime}
• **प्रमुख राष्ट्रीय राजमार्ग:** NH-19 (जीटी रोड) / फोर लेन हाईवे

**🚗 यात्रा एवं पड़ाव योजना (Itinerary):**
• **प्रारंभ:** ${dynamicRoute.recommendedStops[0]}
• **मध्य मार्ग पड़ाव:** ${dynamicRoute.recommendedStops[1]}
• **गंतव्य:** ${dynamicRoute.recommendedStops[2]}

**🚆 प्रमुख ट्रेन विकल्प:**
• वंदे भारत एक्सप्रेस, प्रयागराज एक्सप्रेस, श्रम शक्ति एक्सप्रेस एवं नियमित सुपरफास्ट ट्रेनें (समय: 2.5 से 3.5 घंटे)।

_मैप में पूरा रूट ट्रैक और वेपॉइंट्स मार्क कर दिए गए हैं!_`
      : `### 🛣️ ${dynamicRoute.name.en} (Route & Highway Overview)

**📍 Distance & Travel Duration:**
• **Total Distance:** ~${dynamicRoute.distanceKm} km
• **Driving Time:** ${dynamicRoute.estimatedDrivingTime}
• **Primary Highway:** NH-19 (Grand Trunk Corridor) / 4-Lane Highway

**🚗 Recommended Journey Milestones:**
• **Origin:** ${dynamicRoute.recommendedStops[0]}
• **Midway Pitstop:** ${dynamicRoute.recommendedStops[1]}
• **Arrival:** ${dynamicRoute.recommendedStops[2]}

**🚆 Train Options:**
• Vande Bharat Express, Prayagraj Express, Shram Shakti Express, and frequent superfast connectivity (2.5 to 3.5 hrs).

_The interactive highway track has been plotted on your map!_`;

    return {
      text,
      language: lang,
      hasImage: false,
      hasMap: !!mapData,
      mapData
    };
  }

  // If user asked about Ghats specifically
  if (isGhatsQuery && upGhats) {
    const text = lang === 'hi'
      ? `### 🌊 उत्तर प्रदेश के प्रमुख पावन घाट दर्शन एवं विवरण

1. **दशाश्वमेध घाट (वाराणसी):** विश्वविख्यात सांध्य महा गंगा आरती (सायं 6:45 बजे)।
2. **अस्सी घाट (वाराणसी):** "सुबह-ए-बनारस" - प्रातःकालीन योग, शास्त्रीय राग एवं सूर्योदय आरती।
3. **नमो घाट (वाराणसी):** 75 फीट ऊंचे नमस्ते स्कल्पचर, पूर्णतः व्हीलचेयर सुलभ।
4. **ब्रह्मावर्त घाट (बिठूर, कानपुर):** भगवान ब्रह्मा द्वारा सृष्टि रचना स्थली एवं पवित्र गंगा स्नान।
5. **राम की पैड़ी एवं सरयू घाट (अयोध्या):** दिव्य दीपोत्सव स्थल एवं सांध्य सरयू महा आरती।
6. **गुप्तार घाट (अयोध्या):** भगवान श्री राम की पावन जल समाधि स्थली।
7. **विश्राम घाट (मथुरा):** कंस वध के उपरांत विश्राम स्थल व सांध्य यमुना महारती।
8. **केशी घाट (वृंदावन):** 17वीं सदी के झरोखेदार महलों से सुसज्जित यमुना तट।
9. **त्रिवेणी संगम (प्रयागराज):** गंगा, यमुना और सरस्वती का पवित्र महासंगम।
10. **रामघाट (चित्रकूट):** मंदाकिनी नदी का पावन तट।

_मैप पर सभी प्रमुख घाटों की लोकेशन मार्क कर दी गई है!_`
      : `### 🌊 Sacred Ghats of Uttar Pradesh: Complete Riverfront Guide

1. **Dashashwamedh Ghat (Varanasi):** World-famous evening Maha Ganga Aarti (~6:45 PM).
2. **Assi Ghat (Varanasi):** "Subah-e-Banaras" dawn program with Vedic havan & yoga (5:30 AM).
3. **Namo Ghat (Varanasi):** 75-ft Namaste sculptures, 100% wheelchair-accessible plaza.
4. **Brahmavarta Ghat (Bithoor, Kanpur):** Site where Lord Brahma performed Ashwamedha sacrifice.
5. **Ram Ki Paidi & Saryu Ghat (Ayodhya):** Historic Deepotsav riverfront & evening Saryu Aarti.
6. **Guptar Ghat (Ayodhya):** Peaceful sanctuary of Lord Rama\'s Jal Samadhi.
7. **Vishram Ghat (Mathura):** Lord Krishna rested after slaying Kansa; Yamuna Aarti (7:00 PM).
8. **Keshi Ghat (Vrindavan):** 17th-century ornate Rajasthani sandstone pavilions on Yamuna.
9. **Triveni Sangam (Prayagraj):** Sacred confluence of Ganga, Yamuna, and Saraswati.
10. **Ramghat (Chitrakoot):** Mandakini riverfront where Saint Tulsidas received divine darshan.

_All ghat markers have been highlighted on your interactive map!_`;

    return {
      text,
      language: lang,
      hasImage: (images && images.length > 0) || false,
      images,
      hasMap: !!mapData,
      mapData
    };
  }

  // Matched places guide
  if (matchedPlaces.length > 0) {
    let output = '';

    matchedPlaces.slice(0, 2).forEach(p => {
      if (lang === 'hi') {
        output += `### 🛕 ${p.hindiName} (${p.hindiCity})

**✨ यात्रा का उद्देश्य एवं ऐतिहासिक महत्व (Travel Cause):**
${p.travelCause.hi}

**📜 ऐतिहासिक एवं वास्तुकला परिचय:**
${p.deepHistory.hi}

**⏰ दर्शन / भ्रमण समय एवं प्रवेश शुल्क:**
• **समय:** ${p.timings.hi}
• **प्रवेश शुल्क:** ${p.entryFee.hi}

**♿ सुगमता एवं सुविधाएं (Accessibility):**
• **रेटिंग:** ${p.accessibilityRating}/10 (${p.accessibilityNotes.hi})

**💡 यात्रा व फोटोग्राफी सुझाव:**
• ${p.safetyTips.hi}
• **फोटोग्राफी:** ${p.photographyTips.hi}

`;
      } else {
        output += `### 🛕 ${p.name} (${p.city}, Uttar Pradesh)

**✨ Travel Purpose & Significance (Travel Cause):**
${p.travelCause.en}

**📜 Historical Context:**
${p.deepHistory.en}

**⏰ Timings & Entry Details:**
• **Timings:** ${p.timings.en}
• **Entry Fee:** ${p.entryFee.en}

**♿ Accessibility & Facilities:**
• **Rating:** ${p.accessibilityRating}/10 (${p.accessibilityNotes.en})

**💡 Pro Travel Tips & Safety:**
• ${p.safetyTips.en}
• **Photography:** ${p.photographyTips.en}

`;
      }
    });

    return {
      text: output.trim(),
      language: lang,
      hasImage: (images && images.length > 0) || false,
      images,
      hasMap: !!mapData,
      mapData
    };
  }

  // Default rich overview
  const generalText = lang === 'hi'
    ? `### 🙏 नमस्ते! मैं उत्तर प्रदेश पर्यटन (Darshan 360) का एआई साथी हूँ।

मैं उत्तर प्रदेश के सभी 75 जिलों (झांसी, कानपुर, अयोध्या, काशी, मथुरा, प्रयागराज, आगरा, लखनऊ, चित्रकूट आदि) की संपूर्ण यात्रा योजना, रूट, फोटो और ताज़ा अपडेट्स प्रदान कर सकता हूँ!`
    : `### 🙏 Namaste! I am your Uttar Pradesh Tourism AI Companion (Darshan 360).

I can provide comprehensive travel causes, live crowd status, routes (e.g. Kanpur to Prayagraj, Jhansi Fort), and photos for all 75 districts of Uttar Pradesh!`;

  return {
    text: generalText,
    language: lang,
    hasImage: (images && images.length > 0) || false,
    images,
    hasMap: !!mapData,
    mapData
  };
}
