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
import {
  getDistrictCrowdMetrics,
  SCRAPED_NEWS_DATABASE,
  type DistrictCrowdStatus,
  type ScrapedNewsItem
} from './newsScraperService';
import {
  parseNaturalLanguageTripQuery,
  generateTimeBasedItinerary,
  replanDelay,
  getPresetItineraries,
  type TripItinerary,
  type ItineraryStop
} from './copilotService';

// In-memory query response cache for sub-50ms repeat query responses
const responseCache = new Map<string, GeminiResponse>();

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
  districtCrowdStatus?: DistrictCrowdStatus;
  scrapedNews?: ScrapedNewsItem[];
  scamAlerts?: UPScamAdvisory[];
  copilotItinerary?: TripItinerary;
}

export async function getGeminiResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  currentLang: 'en' | 'hi' = 'en'
): Promise<GeminiResponse> {
  const upPlaces = getAllUPPlaces();
  const upGhats = getAllUPGhats();
  const upNews = getUPNews();
  const upScams = getUPScams();
  const upRoutes = getUPRoutes();

  // Robust Language Determination:
  // 1. Devanagari script is explicitly Hindi (e.g. "झांसी", "नमस्ते", "मार्ग बताएं")
  const hasDevanagari = /[\u0900-\u097F]/.test(userMessage);

  // 2. Clear English structural words (e.g. "plan a trip", "tell me", "how to", "what is", "ticket price")
  const hasEnglishTokens = /\b(plan|trip|itinerary|how|what|where|when|why|tell|show|price|ticket|timings|visiting|guide|hours|route|distance|history|safety|explore|recommend|flight|train|hotel|best|top|visit)\b/i.test(userMessage);

  // 3. Distinctive Hindi grammar/phrasing (DO NOT include city names or common loan words like mandir/ghat)
  const hasHindiTokens = /\b(kripya|bataiye|batao|kaise|kaha|kidhar|chahiye|jana|gaye|ghumna|kitna|kitni|bheed|rasta|suvidha|hoga|hogi)\b/i.test(userMessage);

  let activeLang: 'en' | 'hi';
  if (hasDevanagari) {
    activeLang = 'hi';
  } else if (hasEnglishTokens && !hasHindiTokens) {
    activeLang = 'en';
  } else if (hasHindiTokens && !hasEnglishTokens) {
    activeLang = 'hi';
  } else {
    // Adhere strictly to the user's selected language toggle in the UI
    activeLang = currentLang;
  }

  // Return cached result for identical direct queries
  const cacheKey = `${activeLang}:${userMessage.trim().toLowerCase()}`;
  if (conversationHistory.length <= 1 && responseCache.has(cacheKey)) {
    return JSON.parse(JSON.stringify(responseCache.get(cacheKey)!));
  }

  // Check for delay replanning intent (e.g. "running 20m late", "20 minute late hoon", "delay")
  const delayMatch = userMessage.match(/\b(?:running\s+)?(\d{1,3})\s*(?:m|min|mins|minutes|minute|मिनट)\s*(?:late|delay|विलंब|देरी|लेट)\b/i) ||
                     userMessage.match(/\b(?:late|delay|विलंब|देरी|लेट)\s*(?:by\s*)?(\d{1,3})\s*(?:m|min|mins|minutes|minute|मिनट)\b/i);

  if (delayMatch) {
    const delayMinutes = parseInt(delayMatch[1], 10);
    const baseItin = getPresetItineraries()[0];
    const replanned = replanDelay(baseItin, delayMinutes);

    const replannedMapData: InChatMapData = {
      title: activeLang === 'hi' ? replanned.titleHi : replanned.title,
      center: replanned.stops[0].coordinates,
      zoom: 12,
      markers: replanned.stops.map(s => ({
        position: s.coordinates,
        title: `${s.stopNumber}. ${activeLang === 'hi' ? s.hindiName : s.name} (${s.startTime} - ${s.endTime})`,
        description: `${activeLang === 'hi' ? s.activityHi : s.activity} | Stay: ${s.durationMinutes}m | ${activeLang === 'hi' ? s.whyThisPlaceHi : s.whyThisPlace}`
      })),
      routePath: replanned.stops.map(s => s.coordinates),
      distanceKm: replanned.totalDistanceKm
    };

    const text = activeLang === 'hi'
      ? `### ⏱️ यात्रा समय रीशेड्यूल: ${delayMinutes} मिनट विलंब का समायोजन

**चिंता न करें! आपकी वापसी समयसीमा (Return Deadline) पूरी तरह सुरक्षित है।**
• **सुरक्षा बफर समय:** **${replanned.safetyBufferMinutes} मिनट शेष**
• **समय समायोजन:** आगे के सभी पड़ावों का आगमन और प्रस्थान समय स्वतः आगे बढ़ा दिया गया है ताकि आपकी ट्रेन/फ्लाइट न छूटे।

**🗺️ रीशेड्यूल्ड टाइमलाइन:**
${replanned.stops.map(s => `• **${s.startTime} – ${s.endTime}:** ${s.hindiName} (${s.durationMinutes} मिनट विश्राम)`).join('\n')}

_कोपायलट टाइमलाइन और मैप पर नया शेड्यूल तुरंत अपडेट कर दिया गया है!_`
      : `### ⏱️ Trip Schedule Adjusted: ${delayMinutes} Minutes Delay Handled

**No need to worry! Your return deadline remains protected.**
• **Safety Buffer Remaining:** **${replanned.safetyBufferMinutes} minutes buffer**
• **Schedule Adjustments:** Timings for upcoming stops have been automatically recalibrated to prevent missed connections.

**🗺️ Recalibrated Timeline:**
${replanned.stops.map(s => `• **${s.startTime} – ${s.endTime}:** ${s.name} (${s.durationMinutes} mins stay)`).join('\n')}

_Your Copilot Timeline Drawer and interactive map track have been updated automatically!_`;

    const res: GeminiResponse = {
      text,
      language: activeLang,
      hasMap: true,
      mapData: replannedMapData,
      copilotItinerary: replanned
    };
    responseCache.set(cacheKey, res);
    return res;
  }

  // Check for crowd inquiries (e.g. "how much crowd is there in mathura now", "kitni bheed hai")
  const isCrowdQuery = 
    /\b(crowd|rush|bheed|bhid|line|queue|wait|waiting|wait time|footfall|bhari bheed|jane layak|kitna time|kitna samay|abhi kitni|traffic)\b/i.test(userMessage);

  // Match specific district crowd status
  const districtCrowd = getDistrictCrowdMetrics(userMessage);

  // Check for scraped district news matches
  const matchingScrapedNews = SCRAPED_NEWS_DATABASE.filter(n => 
    userMessage.toLowerCase().includes(n.district.toLowerCase()) || 
    userMessage.toLowerCase().includes(n.hindiDistrict.toLowerCase()) ||
    (n.placeName && userMessage.toLowerCase().includes(n.placeName.toLowerCase()))
  );

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

  // Dedicated identity & capabilities query detector (e.g. "who are you", "tum kaun ho", "what is disha")
  const isIdentityQuery = 
    /\b(who are you|who r you|who are u|tum kaun ho|aap kaun ho|aap kaun hain|what are you|what can you do|who is disha|what is disha|who is ghumo|what is ghumo|ghumo ai|ghumo india|about you|about yourself|introduce yourself|apna parichay|apne baare mein|who made you|what is darshan 360|who created you|kya kar sakti ho)\b/i.test(userMessage.trim());

  if (isIdentityQuery) {
    const identityText = activeLang === 'hi'
      ? `### 🙏 नमस्ते! मैं घूमो AI (Ghumo AI) हूँ

मैं **घूमो इंडिया (Ghumo India)** की आपकी आधिकारिक **एआई यात्रा साथी एवं डिजिटल मार्गदर्शक** हूँ — **टीम सृजन (Team Srajan)** द्वारा **AI Synergy Hackathon Problem 4 (Tourism Track - Beyond the Fort)** के लिए विकसित।

मैं आपकी मध्य प्रदेश व भारतीय धरोहर यात्रा, तीर्थाटन एवं सांस्कृतिक दर्शन को सुगम व ज्ञानवर्धक बनाने के लिए निम्नलिखित सेवाएं प्रदान करती हूँ:

• **🏛️ बियॉन्ड द फोर्ट (Beyond the Fort):** मध्य प्रदेश के अनदेखे पुरातात्विक रत्नों (बटेश्वर 200 मंदिर परिसर, मितावली चौसठ योगिनी, गढ़ी पढ़ावली, ककनमठ सुहानिया, कोषकमहल चंदेरी) की प्रामाणिक ऐतिहासिक व पुरातात्विक जानकारी (ASI स्रोतों से पुष्ट)।
• **🧭 स्मार्ट यात्रा कोपायलट (Trip Copilot):** आप मुझे अपना उपलब्ध समय बताएं (उदा. *"ग्वालियर से 4 घंटे का बटेश्वर-मितावली हेरिटेज रूट"*), और मैं सुरक्षा बफर समय व मानचित्र रूट सहित संपूर्ण समयबद्ध टाइमलाइन तैयार कर दूँगी।
• **📊 लाइव भीड़ टेलीमेट्री एवं दर्शन परामर्श:** प्रमुख धामों व पर्यटन केंद्रों में कतार प्रतीक्षा समय, दर्शन नियम और *"क्या अभी जाने लायक है या नहीं"* का सटीक विश्लेषण।
• **🚗 हाईवे, सड़क व हेरिटेज कॉरिडोर मार्ग:** मुरैना-चंबल कॉरिडोर, ग्वालियर-ओरछा, बुंदेलखंड व राष्ट्रीय राजमार्गों के बीच सटीक ड्राइविंग दूरी व रास्ते के स्टॉप्स।
• **🛕 धरोहर व तीर्थों का ऐतिहासिक व आध्यात्मिक उद्देश्य (Travel Cause):** केवल स्थल ही नहीं, बल्कि उस पावन तीर्थ अथवा ऐतिहासिक स्मारक के निर्माण, स्थापत्य व संस्कृति का गहरा अध्ययन।
• **🛡️ यात्री सुरक्षा व सतर्कता:** जमीनी कनेक्टिविटी, परिवहन साधन, आधिकारिक किराया और आपातकालीन परामर्श।
• **🎙️ बोलकर पूछें एवं सुनें:** आप मुझसे हिन्दी अथवा अंग्रेज़ी में बोलकर संवाद कर सकते हैं।

_आप मध्य प्रदेश अथवा देश के किस धरोहर स्थल या यात्रा मार्ग की जानकारी चाहते हैं?_`
      : `### 🙏 Namaste! I am Ghumo AI (घूमो AI)

I am your official **AI Travel Companion & Heritage Concierge** for **Ghumo India**, created by **Team Srajan** for **AI Synergy Hackathon Problem 4 Track Tourism (Beyond the Fort)**.

Here is how I assist your exploration of Madhya Pradesh and India's heritage wonders:

• **🏛️ Beyond the Fort Discovery**: Grounded, source-backed intelligence on Madhya Pradesh's lesser-known archaeological wonders—such as the 200 restored Gurjara-Pratihara temples of **Bateshwar**, the circular **Chausath Yogini Temple at Mitawali**, the intricate friezes of **Garhi Padhavali**, the mortarless **Kakanmath Shiva Temple**, and **Koshak Mahal Chanderi**.
• **🧭 Smart Time-Aware Trip Copilot**: Tell me your available duration (e.g., *"4-hour heritage circuit from Gwalior station to Bateshwar & Mitawali"*), and I will generate an interactive time-based itinerary with safety return deadlines and sequential route markers.
• **📊 Live Crowd Telemetry & Travel Feasibility**: Real-time road status, queue wait times, darshan pass rules, and feasibility guidance.
• **🚗 Heritage Corridors & Highways**: Verified road routes across the Chambal Heritage Corridor, Gwalior Fort circuits, Bundelkhand royal circuits, and inter-state highways.
• **🛕 Architectural & Cultural Significance (Travel Cause)**: Authentic Vedic, Rajput, Kachchhapaghata, and ASI-documented histories, photography guidance, and accessibility ratings.
• **🛡️ Safe Travel Advisory**: Transparent local transportation advice, fair taxi rates, and traveler assistance.
• **🎙️ Bilingual Voice Interaction**: Type or speak in Hindi or English, and listen to responses with voice synthesis.

_How may I help you discover India's magnificent heritage today?_`;

    const res: GeminiResponse = {
      text: identityText,
      language: activeLang,
      hasImage: false,
      hasMap: false
    };
    responseCache.set(cacheKey, res);
    return res;
  }

  // Dedicated greeting detector: prevent "hi", "namaste", "hello" from triggering Kashi or random routes
  const isPureGreeting = 
    /^(hi|hello|hey|namaste|namaskar|pranam|pranaam|radhe radhe|jai shri ram|jai shree ram|salaam|good morning|good evening|namaste ji|hello ji|hey there|hi disha|hello disha)[!.,? ]*$/i.test(userMessage.trim()) ||
    (/^(hi|hello|hey|namaste|namaskar|pranam|radhe radhe|jai shri ram)\b/i.test(userMessage.trim()) && 
     userMessage.trim().split(/\s+/).length <= 4 && 
     !/\b(kaha|kaise|timing|aarti|hotel|bheed|route|rasta|mandir|ghat|distance|darshan|tour|map|pass|rules|entry|guide|photo)\b/i.test(userMessage));

  if (isPureGreeting) {
    const welcomeText = activeLang === 'hi'
      ? `### 🙏 नमस्ते! दर्शन 360° में आपका स्वागत है

मैं **दिशा AI** हूँ — उत्तर प्रदेश पर्यटन की आपकी आधिकारिक डिजिटल साथी एवं मार्गदर्शक।

मैं आपकी यात्रा को सुगम और अविस्मरणीय बनाने हेतु निम्नलिखित सेवाएं प्रदान करती हूँ:

• **🛕 दर्शन एवं आरती पास:** अयोध्या राम मंदिर, काशी विश्वनाथ, बांके बिहारी मंदिर के दर्शन समय, वीआईपी पास व ड्रेस कोड नियम।
• **🚗 हाईवे मार्ग व दूरी कैलकुलेटर:** यूपी के किन्हीं भी दो शहरों या धामों के बीच सीधी दूरी, एक्सप्रेसवे और अनुमानित यात्रा समय (उदा. *"कानपुर से प्रयागराज"* या *"लखनऊ से अयोध्या"* पूछें)।
• **🌊 पावन घाट व गंगा आरती:** वाराणसी, अयोध्या, मथुरा और प्रयागराज के पवित्र घाटों की सांध्य व प्रातःकालीन आरती का समय।
• **👥 लाइव भीड़ स्थिति सूचकांक:** किस धाम में आज कितनी प्रतीक्षा है और यात्रा हेतु सबसे उपयुक्त समय।
• **🛡️ सुरक्षा व धोखाधड़ी से बचाव:** आधिकारिक बोट किराया, दर्शन पास की सत्यता और 24x7 हेल्पलाइन (**1800-180-5145**)।

आप उत्तर प्रदेश के किस पावन धाम, घाट या ऐतिहासिक धरोहर की यात्रा की योजना बना रहे हैं?`
      : `### 🙏 Namaste! Welcome to Ghumo India

I am **Ghumo AI** — your official spiritual, cultural, and heritage companion for tourism and heritage exploration.

Here is how I can assist your travels and pilgrimage:

• **🛕 Darshan & Aarti Pass Guidelines:** Ram Mandir Ayodhya, Kashi Vishwanath, Bankey Bihari timings, dress code, and official portal bookings.
• **🚗 Highway Directions & Distance Calculator:** Point-to-point road distances, expressway corridors (Agra-Lucknow, Purvanchal, Yamuna, Bundelkhand), and driving times (e.g., try asking *"Kanpur to Prayagraj route"* or *"Lucknow to Ayodhya"*).
• **🌊 Sacred River Ghats:** Aarti schedules, boat guidelines, and accessibility across Varanasi, Ayodhya, Mathura, Prayagraj, and Bithoor.
• **👥 Live Pilgrim Crowd Index:** Real-time rush levels, temple wait times, and recommended peaceful visiting slots.
• **🛡️ Scam & Safety Advisory:** Official ticket verification, standard boat fares, and emergency helplines (**1800-180-5145**).

Which sacred destination, circuit, or city in Uttar Pradesh would you like to explore today?`;

    return {
      text: welcomeText,
      language: activeLang,
      hasImage: false,
      hasMap: false
    };
  }

  // Check for Copilot / Itinerary planning intent
  const isItineraryQuery = 
    /\b(i have|hours|hour|hrs|hr|itinerary|plan a trip|trip plan|plan my trip|back by|flight at|train at|half day|full day|ghante|ghanta|yatra yojana|afternoon|sunset experience|peaceful place|romantic|photography spots|culture|2 days|3 days)\b/i.test(userMessage) &&
    !userMessage.match(/\b(pass rules|dress code|fake pass|helpline)\b/i);

  if (isItineraryQuery) {
    const parsed = parseNaturalLanguageTripQuery(userMessage);
    const itinerary = generateTimeBasedItinerary(parsed);

    const itineraryMapData: InChatMapData = {
      title: activeLang === 'hi' ? itinerary.titleHi : itinerary.title,
      center: itinerary.stops[0].coordinates,
      zoom: 12,
      markers: itinerary.stops.map(s => ({
        position: s.coordinates,
        title: `${s.stopNumber}. ${activeLang === 'hi' ? s.hindiName : s.name} (${s.startTime} - ${s.endTime})`,
        description: `${activeLang === 'hi' ? s.activityHi : s.activity} | Stay: ${s.durationMinutes}m | ${activeLang === 'hi' ? s.whyThisPlaceHi : s.whyThisPlace}`
      })),
      routePath: itinerary.stops.map(s => s.coordinates),
      distanceKm: itinerary.totalDistanceKm
    };

    const itineraryImages: InChatImage[] = itinerary.stops
      .filter(s => s.imageUrl)
      .slice(0, 4)
      .map(s => ({
        url: s.imageUrl!,
        title: activeLang === 'hi' ? s.hindiName : s.name,
        caption: `Stop ${s.stopNumber}: ${activeLang === 'hi' ? s.hindiName : s.name} (${s.startTime})`
      }));

    const text = activeLang === 'hi'
      ? `### 🧭 ${itinerary.titleHi}

**🎯 आपकी आवश्यकता अनुसार अनुकूलित यात्रा योजना:**
• **कुल उपलब्ध समय:** ${itinerary.targetHours} घंटे (प्रारंभ: ${itinerary.startTime})
${itinerary.deadlineTime ? `• **वापसी समयसीमा:** **${itinerary.deadlineTime}** (${itinerary.deadlineLabel || 'स्टेशन/प्रस्थान'})\n• **🛡️ सुरक्षा बफर समय:** **${itinerary.safetyBufferMinutes} मिनट** (बिना किसी भागदौड़ सुरक्षित वापसी)` : ''}
• **कुल यात्रा दूरी:** ~${itinerary.totalDistanceKm} किमी
• **अनुमानित व्यय:** ${itinerary.totalCostEstimate}

---

**🗺️ चरण-दर-चरण समयबद्ध यात्रा मार्ग (Timeline):**

${itinerary.stops.map(s => `
**${s.startTime} – ${s.endTime}** (पड़ाव ${s.stopNumber})
📍 **${s.hindiName}** (${s.durationMinutes} मिनट विश्राम/दर्शन)
• **गतिविधि:** ${s.activityHi}
• **💡 चयन का कारण (Why This Place):** ${s.whyThisPlaceHi}
${s.travelTimeToNextMinutes ? `↳ 🛺 *अगले पड़ाव हेतु यात्रा:* ~${s.travelTimeToNextMinutes} मिनट (${s.transportModeToNext === 'walk' ? 'पैदल' : s.transportModeToNext === 'taxi' ? 'टैक्सी' : 'ऑटो'} • ${s.travelDistanceToNextKm} किमी)` : ''}
`).join('\n')}

${itinerary.suggestedHotel ? `\n🏨 **अनुशंसित होटल क्षेत्र:** **${itinerary.suggestedHotel.name}** (${itinerary.suggestedHotel.area})\n_${itinerary.suggestedHotel.rationale}_` : ''}

_मानचित्र पर सभी पड़ाव (1, 2, 3...) और रूट ट्रैक लाइव प्लॉट कर दिए गए हैं। आप कोपायलट टाइमलाइन से किसी भी समय इसे संपादित (Edit/Optimize) कर सकते हैं!_`
      : `### 🧭 ${itinerary.title}

**🎯 Practical Time-Aware Itinerary Generated:**
• **Available Time:** ${itinerary.targetHours} Hours (Starting: ${itinerary.startTime})
${itinerary.deadlineTime ? `• **Return Deadline:** **${itinerary.deadlineTime}** (${itinerary.deadlineLabel || 'Departure'})\n• **🛡️ Smart Deadline Protection Buffer:** **${itinerary.safetyBufferMinutes} Minutes** (Ensures timely return without rush)` : ''}
• **Total Route Transit:** ~${itinerary.totalDistanceKm} km
• **Estimated Budget:** ${itinerary.totalCostEstimate}

---

**🗺️ Step-by-Step Time-Based Timeline:**

${itinerary.stops.map(s => `
**${s.startTime} – ${s.endTime}** (Stop ${s.stopNumber})
📍 **${s.name}** (${s.durationMinutes} min stay)
• **Activity:** ${s.activity}
• **💡 Why This Place:** ${s.whyThisPlace}
${s.travelTimeToNextMinutes ? `↳ 🛺 *Transit to next stop:* ~${s.travelTimeToNextMinutes} mins via ${s.transportModeToNext} (~${s.travelDistanceToNextKm} km)` : ''}
`).join('\n')}

${itinerary.suggestedHotel ? `\n🏨 **Smart Hotel Location Suggestion:** **${itinerary.suggestedHotel.name}** (${itinerary.suggestedHotel.area})\n_${itinerary.suggestedHotel.rationale}_` : ''}

_All numbered stops and connecting route lines are plotted on your interactive map. You can edit, skip, extend (+15m), or optimize this trip anytime from the Copilot Drawer!_`;

    return {
      text,
      language: activeLang,
      hasImage: itineraryImages.length > 0,
      images: itineraryImages,
      hasMap: true,
      mapData: itineraryMapData,
      copilotItinerary: itinerary
    };
  }

  // Check for dynamic point-to-point route query (e.g., "kanpur to prayag", "lucknow to ayodhya", "jhansi to chitrakoot")
  const routeMatch = userMessage.match(/\b([a-zA-Z\u0900-\u097F]{3,})\s+(?:to|se|se lekar|tak)\s+([a-zA-Z\u0900-\u097F]{3,})\b/i);
  let computedDynamicRoute: ReturnType<typeof calculateDynamicUPRoute> = null;
  if (routeMatch) {
    computedDynamicRoute = calculateDynamicUPRoute(routeMatch[1], routeMatch[2]);
  }

  // Match referenced places & city crowd advisories
  let matchedPlaces = searchUPPlaces(userMessage);

  // Multi-Turn Chat Memory Recall:
  // If user asks a follow-up (e.g., "what is the ticket price?", "how to reach there?", "timings?", "photos?", "hotel nearby?"),
  // look up the most recent place discussed in conversationHistory so Disha AI answers for that exact destination!
  if (matchedPlaces.length === 0 && conversationHistory && conversationHistory.length > 0) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const prevMsg = conversationHistory[i];
      if (prevMsg.role === 'user') {
        const prevMatched = searchUPPlaces(prevMsg.content);
        if (prevMatched.length > 0) {
          matchedPlaces = prevMatched;
          break;
        }
      }
    }
  }

  const matchedCrowdAdvisory = getCrowdAdvisoryByCity(userMessage) || (matchedPlaces.length > 0 ? getCrowdAdvisoryByCity(matchedPlaces[0].city) : null);

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
    const isExplicitMultiRoute = /\b(route|circuit|itinerary|plan|safarnama|yatra marg|yatra|tour|parikrama)\b/i.test(userMessage) &&
      (userMessage.toLowerCase().includes('from') || userMessage.toLowerCase().includes('to') || userMessage.toLowerCase().includes('se') || userMessage.toLowerCase().includes('tak') || userMessage.toLowerCase().includes('circuit'));

    mapData = {
      title: activeLang === 'hi' 
        ? (isExplicitMultiRoute ? `${matchedPlaces[0].hindiCity} से ${matchedPlaces[matchedPlaces.length - 1].hindiCity} यात्रा मार्ग` : `${matchedPlaces[0].hindiCity} क्षेत्र के प्रमुख स्थल`)
        : (isExplicitMultiRoute ? `${matchedPlaces[0].city} to ${matchedPlaces[matchedPlaces.length - 1].city} Route` : `Key Places in ${matchedPlaces[0].city} Region`),
      center: matchedPlaces[0].coordinates,
      zoom: 8,
      markers: matchedPlaces.map(p => ({
        position: p.coordinates,
        title: activeLang === 'hi' ? p.hindiName : p.name,
        description: activeLang === 'hi' ? p.description.hi : p.description.en
      })),
      ...(isExplicitMultiRoute ? {
        routePath: matchedPlaces.map(p => p.coordinates),
        distanceKm: 240
      } : {})
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

  // Dynamic District Crowd Telemetry
  const districtCrowdPromptSection = districtCrowd ? `
*** LIVE TELEMETRY FOR ${districtCrowd.district.toUpperCase()} (${districtCrowd.hindiDistrict}) ***
Primary Hub: ${districtCrowd.primaryHub}
Crowd Level: ${districtCrowd.crowdLevel.toUpperCase()} (${districtCrowd.crowdLevelText.en})
Queue Wait Time: ${districtCrowd.waitTimeFormatted.en} / ${districtCrowd.waitTimeFormatted.hi}
Feasibility Verdict ("Jane Layak Hai Ya Nahi"): ${districtCrowd.feasibilityVerdict.en}
Peak Rush Hours: ${districtCrowd.peakHours.en}
Recommended Best Slot: ${districtCrowd.bestSlot.en}
Police & Traffic Advisory: ${districtCrowd.policeAdvisory.en}
Key Temple Queue Breakdown: ${districtCrowd.keySpots.map(s => `${s.name} (${s.waitMinutes} mins wait)`).join(', ')}
Provide this EXACT numerical queue time and advice clearly to the user!
` : '';

  const systemPrompt = `You are Ghumo AI (घूमो एआई), the official, intelligent and highly informed travel companion for Ghumo India (Team Srajan).
Your knowledge covers all 75 districts of Uttar Pradesh including Jhansi, Kanpur, Ayodhya, Varanasi, Mathura, Vrindavan, Prayagraj, Agra, Lucknow, Chitrakoot, Gorakhpur, Mirzapur, etc.

Language Guidelines:
- The user's active language is **${activeLang === 'hi' ? 'HINDI (हिन्दी)' : 'ENGLISH'}**.
- If the user writes in Hindi or asks in Hindi, write in pure, articulate, and culturally respectful Hindi (शुद्ध एवं सुरुचिपूर्ण हिन्दी).
- If the user writes in English, respond in articulate, structured, and informative English.

Core Responsibilities:
1. **Accurate City-Specific Responses**:
   - If asked about Jhansi, focus exclusively on Jhansi (Jhansi Fort, Rani Laxmi Bai, Rani Mahal, 1857 freedom struggle history, transport, and photos). Never substitute Agra or other cities.
   - If asked about Kanpur, focus on JK Temple, Bithoor Brahmavarta Ghat, Valmiki Ashram, and Allen Forest Zoo.
   - If asked about Mathura / Vrindavan crowd, state current queue time (~1.5 to 2.5 hours at Bankey Bihari), entry gates, and best slot.
2. **Accurate Route & Highway Guidance**:
   - If asked for routes (e.g. Kanpur to Prayagraj, Lucknow to Ayodhya, Jhansi to Chitrakoot), provide highway numbers, distance in km, driving times, and train connectivity.
3. **Answer "Jane Layak Hai Ya Nahi" & Live Crowd Status**:
   - Give clear feasibility verdicts, current queue wait times, and the best hours to visit.
4. **Explain the "Travel Cause"**:
   - Always clearly explain *why* a place or pilgrimage is visited.
5. **Formatting**:
   - Use Markdown headers (###), bold bullet points, and helpful emojis (🛕, 🏰, 🌊, 🛣️, ⏰, ♿, 💡).

${districtCrowdPromptSection}

REAL-TIME CROWD & FEASIBILITY ADVISORIES:
${crowdSummary}

DESTINATIONS & GHATS HIGHLIGHTS:
${placesInfo}
`;

  // Execute Gemini API call
  try {
    if (!genAI) throw new Error('Gemini API client not initialized');

    const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let responseText = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        });

        const safeHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
        const contents = [
          ...safeHistory.slice(-4).map(msg => ({
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

    const cloudResponse: GeminiResponse = {
      text: responseText,
      language: activeLang,
      hasImage: responseImages.length > 0,
      images: responseImages.length > 0 ? responseImages : undefined,
      hasMap: !!mapData,
      mapData,
      crowdAdvisory: matchedCrowdAdvisory,
      districtCrowdStatus: districtCrowd,
      scrapedNews: matchingScrapedNews.length > 0 ? matchingScrapedNews.slice(0, 3) : undefined,
      newsItems: isNewsRequest ? upNews : undefined
    };

    responseCache.set(cacheKey, cloudResponse);
    return cloudResponse;

  } catch (apiError: any) {
    console.warn('Gemini API fallback triggered:', apiError);

    // High quality offline fallback generator
    const offlineRes = generateSmartOfflineResponse(
      userMessage, 
      activeLang, 
      matchedPlaces, 
      mapData, 
      responseImages, 
      matchedCrowdAdvisory, 
      computedDynamicRoute, 
      upNews, 
      isGhatsQuery, 
      upGhats,
      districtCrowd,
      matchingScrapedNews,
      isCrowdQuery
    );

    responseCache.set(cacheKey, offlineRes);
    return offlineRes;
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
  upGhats?: UPPlace[],
  districtCrowd?: DistrictCrowdStatus,
  scrapedNews?: ScrapedNewsItem[],
  isCrowdQuery?: boolean
): GeminiResponse {
  // If user is ONLY querying general crowd without a specific place match
  if (matchedPlaces.length === 0 && districtCrowd && (isCrowdQuery || userMessage.toLowerCase().includes('crowd') || userMessage.toLowerCase().includes('bheed') || userMessage.toLowerCase().includes('kitni') || userMessage.toLowerCase().includes('rush') || userMessage.toLowerCase().includes('line'))) {
    const text = lang === 'hi'
      ? `### 👥 ${districtCrowd.hindiDistrict} — लाइव भीड़ एवं दर्शन स्थिति रिपोर्ट

**🔴 वर्तमान भीड़ स्तर:** **${districtCrowd.crowdLevelText.hi}**
• **कतार में प्रतीक्षा समय:** **${districtCrowd.waitTimeFormatted.hi}**
• **प्रमुख केंद्र:** ${districtCrowd.primaryHub}
• **अंतिम अपडेट:** ${districtCrowd.lastUpdated}

**🧭 क्या जाने लायक है या नहीं (Feasibility Verdict):**
${districtCrowd.feasibilityVerdict.hi}

**⏰ प्रमुख मंदिरों में कतार स्थिति:**
${districtCrowd.keySpots.map(s => `• **${s.hindiName}:** ${s.waitMinutes > 0 ? `~${s.waitMinutes} मिनट प्रतीक्षा` : 'सामान्य/सुगम प्रवाह'} (${s.status === 'heavy_rush' ? 'भारी दबाव ⚠️' : s.status === 'moderate' ? 'मध्यम ⏳' : 'सुगम ✅'})`).join('\n')}

**💡 सर्वश्रेष्ठ दर्शन समय (Best Time to Visit):**
• **अनुकूल स्लॉट:** ${districtCrowd.bestSlot.hi}
• **अधिक भीड़ का समय (Peak Hours):** ${districtCrowd.peakHours.hi}

**🚓 पुलिस एवं यातायात परामर्श:**
• ${districtCrowd.policeAdvisory.hi}

_आप न्यूज़ पेज (News Tab) पर जाकर इस जिले के लाइव समाचार व विस्तृत एडवाइजरी भी देख सकते हैं!_`
      : `### 👥 ${districtCrowd.district} — Live Crowd & Darshan Status Report

**🔴 Current Crowd Level:** **${districtCrowd.crowdLevelText.en}**
• **Estimated Queue Wait:** **${districtCrowd.waitTimeFormatted.en}**
• **Primary Hub:** ${districtCrowd.primaryHub}
• **Last Updated:** ${districtCrowd.lastUpdated}

**🧭 Feasibility Verdict ("Jane Layak Hai Ya Nahi"):**
${districtCrowd.feasibilityVerdict.en}

**⏰ Key Spots & Temple Queue Breakdown:**
${districtCrowd.keySpots.map(s => `• **${s.name}:** ${s.waitMinutes > 0 ? `~${s.waitMinutes} mins wait` : 'Zero/Fast Line'} (${s.status === 'heavy_rush' ? 'Heavy Rush ⚠️' : s.status === 'moderate' ? 'Moderate ⏳' : 'Smooth ✅'})`).join('\n')}

**💡 Recommended Darshan Slots:**
• **Best Time:** ${districtCrowd.bestSlot.en}
• **Peak Rush Hours:** ${districtCrowd.peakHours.en}

**🚓 Police & Traffic Advisory:**
• ${districtCrowd.policeAdvisory.en}

_Visit our dedicated News Page to view live web-scraped district bulletins and alerts!_`;

    return {
      text,
      language: lang,
      hasImage: (images && images.length > 0) || false,
      images,
      hasMap: !!mapData,
      mapData,
      districtCrowdStatus: districtCrowd,
      scrapedNews: scrapedNews && scrapedNews.length > 0 ? scrapedNews.slice(0, 3) : undefined
    };
  }

  // If point-to-point route computed
  if (dynamicRoute) {
    const text = lang === 'hi'
      ? `### 🛣️ ${dynamicRoute.name.hi} (मार्ग एवं दूरी विवरण)

**📍 दूरी एवं अनुमानित समय:**
• **कुल दूरी:** ~${dynamicRoute.distanceKm} किमी
• **सड़क मार्ग समय:** ${dynamicRoute.estimatedDrivingTime}
• **प्रमुख एक्सप्रेसवे / हाईवे:** ${dynamicRoute.highwayName?.hi || 'राष्ट्रीय राजमार्ग (NH)'}

**🚗 यात्रा एवं पड़ाव योजना (Itinerary):**
• **प्रारंभ स्थल:** ${dynamicRoute.recommendedStops[0]}
• **मध्य मार्ग पड़ाव:** ${dynamicRoute.recommendedStops[1]}
• **गंतव्य:** ${dynamicRoute.recommendedStops[2]}

**🚆 प्रमुख ट्रेन विकल्प:**
• वंदे भारत एक्सप्रेस, प्रयागराज एक्सप्रेस, श्रम शक्ति एक्सप्रेस एवं नियमित सुपरफास्ट ट्रेनें।

_मैप में पूरा रूट ट्रैक और वेपॉइंट्स मार्क कर दिए गए हैं!_`
      : `### 🛣️ ${dynamicRoute.name.en} (Route & Highway Overview)

**📍 Distance & Travel Duration:**
• **Total Distance:** ~${dynamicRoute.distanceKm} km
• **Driving Time:** ${dynamicRoute.estimatedDrivingTime}
• **Primary Highway / Expressway:** ${dynamicRoute.highwayName?.en || 'National Highway Corridor'}

**🚗 Recommended Journey Milestones:**
• **Origin:** ${dynamicRoute.recommendedStops[0]}
• **Midway Pitstop:** ${dynamicRoute.recommendedStops[1]}
• **Arrival:** ${dynamicRoute.recommendedStops[2]}

**🚆 Train Options:**
• Vande Bharat Express, Prayagraj Express, Shram Shakti Express, and frequent superfast connectivity.

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
      const isDetailedQuery = /\b(detailed|detail|details|history|cause|causes|significance|about|parichay|itihas|mahatva|poori jankari|sab kuch|katha)\b/i.test(userMessage);
      const isFeeQuery = !isDetailedQuery && (/\b(ticket|price|fee|entry fee|cost|charge|shulk|paisa|kiraya)\b/i.test(userMessage) ||
        /(टिकट|शुल्क|प्रवेश शुल्क|खर्चा|फीस|किराया|पैसे|रेट)/i.test(userMessage));
      const isTimingQuery = !isDetailedQuery && (/\b(timing|timings|open|close|hours|samay|khulta|band)\b/i.test(userMessage) ||
        /(समय|टाइमिंग|टाइम|कब खुलता|कब बंद|घंटे)/i.test(userMessage));

      if (lang === 'hi') {
        if (isFeeQuery) {
          output += `### 🎟️ ${p.hindiName} — प्रवेश शुल्क एवं टिकट विवरण

• **प्रवेश शुल्क (Entry Fee):** **${p.entryFee.hi}**
• **दर्शन व भ्रमण समय (Timings):** ${p.timings.hi}
• **सुगमता एवं सुविधाएं:** ${p.accessibilityNotes.hi}
• **यात्रा सुझाव:** ${p.safetyTips.hi}

`;
        } else if (isTimingQuery) {
          output += `### ⏰ ${p.hindiName} — दर्शन एवं भ्रमण समय

• **दर्शन / भ्रमण समय:** **${p.timings.hi}**
• **प्रवेश शुल्क:** ${p.entryFee.hi}
• **फोटोग्राफी सुझाव:** ${p.photographyTips.hi}
• **यात्रा सुरक्षा:** ${p.safetyTips.hi}

`;
        } else {
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
        }
      } else {
        if (isFeeQuery) {
          output += `### 🎟️ ${p.name} — Entry Fee & Tickets

• **Entry Fee:** **${p.entryFee.en}**
• **Visiting Hours:** ${p.timings.en}
• **Accessibility:** ${p.accessibilityNotes.en}
• **Pro Tip:** ${p.safetyTips.en}

`;
        } else if (isTimingQuery) {
          output += `### ⏰ ${p.name} — Timings & Visiting Hours

• **Visiting Hours:** **${p.timings.en}**
• **Entry Fee:** ${p.entryFee.en}
• **Photography:** ${p.photographyTips.en}
• **Safety Tip:** ${p.safetyTips.en}

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
      }
    });

    const primaryPlace = matchedPlaces[0];
    const cityCrowd = districtCrowd || getDistrictCrowdMetrics(primaryPlace.city);
    const relatedScams = getUPScams().filter(s => s.city.toLowerCase() === primaryPlace.city.toLowerCase());

    if (cityCrowd && (isCrowdQuery || userMessage.toLowerCase().includes('crowd') || userMessage.toLowerCase().includes('bheed') || userMessage.toLowerCase().includes('status'))) {
      if (lang === 'hi') {
        output += `### 👥 लाइव भीड़ एवं दर्शन स्थिति (${cityCrowd.hindiDistrict})\n• **भीड़ स्तर:** ${cityCrowd.crowdLevelText.hi}\n• **अनुमानित प्रतीक्षा समय:** ${cityCrowd.waitTimeFormatted.hi}\n• **सर्वश्रेष्ठ दर्शन स्लॉट:** ${cityCrowd.bestSlot.hi}\n• **व्यवस्था स्थिति:** ${cityCrowd.feasibilityVerdict.hi}\n\n`;
      } else {
        output += `### 👥 Live Crowd & Darshan Status (${cityCrowd.district})\n• **Crowd Level:** ${cityCrowd.crowdLevelText.en}\n• **Estimated Queue Wait:** ${cityCrowd.waitTimeFormatted.en}\n• **Recommended Darshan Slot:** ${cityCrowd.bestSlot.en}\n• **Status Verdict:** ${cityCrowd.feasibilityVerdict.en}\n\n`;
      }
    }

    return {
      text: output.trim(),
      language: lang,
      hasImage: (images && images.length > 0) || false,
      images,
      hasMap: !!mapData,
      mapData,
      districtCrowdStatus: cityCrowd || undefined,
      scrapedNews: scrapedNews && scrapedNews.length > 0 ? scrapedNews.slice(0, 3) : undefined,
      scamAlerts: relatedScams.length > 0 ? relatedScams : undefined
    };
  }

  // Default rich overview
  const generalText = lang === 'hi'
    ? `### 🙏 नमस्ते! मैं घूमो इंडिया (Ghumo India — Team Srajan) की एआई साथी घूमो AI (Ghumo AI) हूँ।

मैं मध्य प्रदेश के अनदेखे ऐतिहासिक स्थलों (बटेश्वर, मितावली, गढ़ी पढ़ावली, ककनमठ, ग्वालियर किला, ओरछा, चंदेरी) तथा देश के सभी प्रमुख पर्यटन सर्किट की संपूर्ण यात्रा योजना, रूट, फोटो और प्रमाणिक जानकारी प्रदान कर सकती हूँ!`
    : `### 🙏 Namaste! I am Ghumo AI, your travel and heritage companion for Ghumo India (Team Srajan — AI Synergy Hackathon Problem 4 Track Tourism).

I provide verified itineraries, route maps, historical context, and photos for Madhya Pradesh's hidden heritage (Bateshwar, Mitawali, Padhavali, Kakanmath, Gwalior Fort, Orchha) and premier travel destinations across India!`;

  return {
    text: generalText,
    language: lang,
    hasImage: (images && images.length > 0) || false,
    images,
    hasMap: !!mapData,
    mapData
  };
}
