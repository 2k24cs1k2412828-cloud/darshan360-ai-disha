// Madhya Pradesh Database Service
// Provides structured access to Madhya Pradesh tourism data including places, costs, scams, and safety information for Gwalior and Orchha

interface Place {
  id: string;
  name: string;
  category: 'fort' | 'palace' | 'temple' | 'food' | 'landmark' | 'museum' | 'waterfall' | 'monastery' | 'heritage';
  description: string;
  deep_history?: string;
  architecture?: string;
  mythological_significance?: string;
  cultural_significance?: string;
  cost_estimate: string;
  best_time: string;
  duration_minutes: number;
  internal_link: string;
  safety_rating: string;
  accessibility_rating?: number; // Out of 10
  accessibility_notes?: string;
  zone?: 'gwalior' | 'orchha' | 'nearby';
  exploration_level?: 'famous_explored' | 'hidden_gems' | 'must_visit_explored' | 'must_visit_unexplored';
  unique_features?: string[];
  nearby_attractions?: string[];
  photography_tips?: string;
}

interface Cost {
  [key: string]: any;
}

interface Scam {
  id: string;
  type: string;
  description: string;
  warning_signs: string[];
  what_to_do: string[];
  emergency_contact: string;
  internal_link: string;
}

interface BanaarasData {
  places: Place[];
  costs: {
    boat_rides: any;
    accommodation: any;
    food: any;
    transportation: any;
    activities: any;
  };
  scams: Scam[];
  itineraries: any[];
  safety_advisory: {
    emergency_numbers: Record<string, string>;
    common_risky_situations: any[];
  };
}

let banarasData: BanaarasData | null = null;

export async function loadBanaarasDatabase(): Promise<BanaarasData> {
  if (banarasData) {
    return banarasData;
  }

  try {
    // Create database from hardcoded data
    const data: BanaarasData = {
      places: [
        // GWALIOR FORT
        {
          id: "gwalior_fort",
          name: "Gwalior Fort",
          category: "fort",
          zone: "gwalior",
          exploration_level: "famous_explored",
          description: "One of the most impenetrable forts in India, built by Raja Suraj Sen in 6th century. Features palaces, temples, and offers panoramic views.",
          deep_history: "Built by Raja Suraj Sen in 6th century. Captured by various dynasties including Mughals and Marathas. Site of famous Gurjari Mahal and Man Singh Palace.",
          architecture: "Massive sandstone fort with 10 gates. Features Gujari Mahal, Man Singh Palace, and Sas Bahu Temple within the complex.",
          cultural_significance: "Symbol of Rajput valor and architectural brilliance. Houses some of the finest examples of medieval Indian architecture.",
          cost_estimate: "₹50 for Indians, ₹300 for foreigners",
          best_time: "Sunrise to sunset",
          duration_minutes: 180,
          internal_link: "#gwalior-fort-section",
          safety_rating: "High",
          accessibility_rating: 6,
          accessibility_notes: "Some areas have steep climbs; wheelchairs available at main entrance.",
          photography_tips: "Best shots at sunrise from the fort walls overlooking the city.",
          unique_features: ["10 massive gates", "Gurjari Mahal", "Man Singh Palace", "Sas Bahu Temple"]
        },
        {
          id: "sas_bahu_temple",
          name: "Sas Bahu Temple",
          category: "temple",
          zone: "gwalior",
          exploration_level: "must_visit_explored",
          description: "Beautiful 11th-century temple dedicated to Lord Vishnu, known for its intricate carvings and architecture.",
          deep_history: "Built in 1093 AD by King Mahipala. Features unique architecture with mother-in-law and daughter-in-law shrines.",
          architecture: "Nagara style with intricate carvings, toranas, and sculptures depicting various deities and scenes from mythology.",
          mythological_significance: "Dedicated to Lord Vishnu in his various forms. The temple complex includes shrines for Sas (mother-in-law) and Bahu (daughter-in-law).",
          cost_estimate: "₹50 for Indians, ₹300 for foreigners",
          best_time: "6:00 AM - 6:00 PM",
          duration_minutes: 60,
          internal_link: "#sas-bahu-temple-section",
          safety_rating: "High",
          accessibility_rating: 7,
          accessibility_notes: "Well-maintained paths with some steps.",
          unique_features: ["Intricate carvings", "Torana gateways", "Vishnu idols", "Mythological sculptures"]
        },
        {
          id: "jai_vilas_palace",
          name: "Jai Vilas Palace",
          category: "palace",
          zone: "gwalior",
          exploration_level: "famous_explored",
          description: "Opulent palace built by Maharaja Jayaji Rao Scindia, featuring Italian architecture and a museum with royal artifacts.",
          deep_history: "Built in 1874 by Maharaja Jayaji Rao Scindia. Features a unique blend of European and Indian architecture.",
          architecture: "Italian Renaissance style with Indian elements. Features Durbar Hall with crystal chandeliers and Venetian glass.",
          cultural_significance: "Showcases the opulence of Scindia dynasty. Houses a museum with royal artifacts, weapons, and memorabilia.",
          cost_estimate: "₹200 for Indians, ₹500 for foreigners",
          best_time: "10:00 AM - 5:00 PM",
          duration_minutes: 90,
          internal_link: "#jai-vilas-palace-section",
          safety_rating: "High",
          accessibility_rating: 8,
          accessibility_notes: "Wheelchair accessible with ramps and elevators.",
          unique_features: ["Crystal chandeliers", "Durbar Hall", "Royal artifacts", "Italian architecture"]
        },

        // ORCHHA PALACE COMPLEX
        {
          id: "orchha_palace",
          name: "Orchha Palace Complex",
          category: "palace",
          zone: "orchha",
          exploration_level: "famous_explored",
          description: "Magnificent 16th-century palace complex built by Bundela rulers, featuring Jahangir Mahal and Raj Mahal.",
          deep_history: "Built by Raja Rudra Pratap in 16th century. Served as the capital of Bundela kingdom. Features palaces that hosted Mughal emperor Jahangir.",
          architecture: "Blend of Rajput and Mughal styles. Features Jahangir Mahal, Raj Mahal, and Rai Praveen Mahal with intricate frescoes.",
          cultural_significance: "Showcases the grandeur of Bundela dynasty. The palaces reflect the cultural synthesis between Rajput and Mughal traditions.",
          cost_estimate: "₹200 for Indians, ₹500 for foreigners",
          best_time: "Sunrise to sunset",
          duration_minutes: 120,
          internal_link: "#orchha-palace-section",
          safety_rating: "High",
          accessibility_rating: 5,
          accessibility_notes: "Some areas have steep steps; guided tours available.",
          unique_features: ["Jahangir Mahal", "Raj Mahal", "Frescoes", "Bundela architecture"]
        },
        {
          id: "ram_raja_temple",
          name: "Ram Raja Temple",
          category: "temple",
          zone: "orchha",
          exploration_level: "must_visit_explored",
          description: "Unique temple where Lord Ram is worshipped as a king rather than a god, built within the palace complex.",
          deep_history: "Built in 1574 AD by Raja Madhukar Shah. Unique because Ram is worshipped as a king (Raja) rather than a deity.",
          architecture: "Blend of Rajput and Mughal styles. Features beautiful frescoes and a unique idol of Ram as a king.",
          mythological_significance: "Lord Ram is worshipped as a king who ruled Orchha. The temple follows unique rituals different from traditional Ram temples.",
          cost_estimate: "Free (donations welcome)",
          best_time: "6:00 AM - 8:00 PM",
          duration_minutes: 45,
          internal_link: "#ram-raja-temple-section",
          safety_rating: "High",
          accessibility_rating: 6,
          accessibility_notes: "Located within palace complex with some steps.",
          unique_features: ["Ram as King", "Royal worship", "Frescoes", "Unique rituals"]
        },
        {
          id: "chaturbhuj_temple",
          name: "Chaturbhuj Temple",
          category: "temple",
          zone: "orchha",
          exploration_level: "hidden_gems",
          description: "Ancient temple dedicated to Lord Vishnu, known for its four-armed idol and serene atmosphere.",
          deep_history: "One of the oldest temples in Orchha, dating back to 16th century. Features a four-armed Vishnu idol.",
          architecture: "Traditional temple architecture with beautiful carvings and a peaceful courtyard.",
          mythological_significance: "Dedicated to Lord Vishnu in his Chaturbhuj (four-armed) form. Represents the four aspects of divine power.",
          cost_estimate: "Free",
          best_time: "Early morning or evening",
          duration_minutes: 30,
          internal_link: "#chaturbhuj-temple-section",
          safety_rating: "High",
          accessibility_rating: 4,
          accessibility_notes: "Traditional temple with steps; assistance may be needed.",
          unique_features: ["Four-armed Vishnu", "Ancient idol", "Peaceful atmosphere", "Traditional architecture"]
        },

        // OTHER ATTRACTIONS
        {
          id: "gwalior_zoo",
          name: "Gwalior Zoo",
          category: "landmark",
          zone: "gwalior",
          exploration_level: "must_visit_unexplored",
          description: "One of the oldest zoos in India, home to various species including white tigers and rare birds.",
          deep_history: "Established in 1920s. Features historic structures and is known for its white tiger breeding program.",
          architecture: "Colonial-era buildings with modern enclosures. Features rock-cut caves and natural habitats.",
          cultural_significance: "Important center for wildlife conservation. Houses Madhya Pradesh's state animal, the white tiger.",
          cost_estimate: "₹50 for Indians, ₹200 for foreigners",
          best_time: "10:00 AM - 5:00 PM",
          duration_minutes: 90,
          internal_link: "#gwalior-zoo-section",
          safety_rating: "High",
          accessibility_rating: 7,
          accessibility_notes: "Well-maintained paths with some slopes.",
          unique_features: ["White tigers", "Rock-cut caves", "Historic structures", "Conservation center"]
        },
        {
          id: "datia_palace",
          name: "Datia Palace",
          category: "palace",
          zone: "nearby",
          exploration_level: "hidden_gems",
          description: "Beautiful palace near Orchha, known for its architecture and historical significance.",
          deep_history: "Built by Bundela rulers in 17th century. Features unique architecture blending Rajput and Mughal styles.",
          architecture: "Seven-storied palace with beautiful courtyards, fountains, and intricate carvings.",
          cultural_significance: "Showcases the architectural brilliance of Bundela dynasty. Features beautiful murals and frescoes.",
          cost_estimate: "₹100 for Indians, ₹300 for foreigners",
          best_time: "9:00 AM - 5:00 PM",
          duration_minutes: 60,
          internal_link: "#datia-palace-section",
          safety_rating: "High",
          accessibility_rating: 5,
          accessibility_notes: "Multi-level palace with stairs; guided tours available.",
          unique_features: ["Seven stories", "Beautiful courtyards", "Murals", "Fountains"]
        }
      ],
      costs: {
        boat_rides: {
          shared_sunrise: {
            price: "₹100-150",
            duration: "1-1.5 hours",
            warning: "Negotiate before boarding. Do not pay more than ₹150"
          },
          shared_evening: {
            price: "₹150-250",
            duration: "1-1.5 hours",
            warning: "During Aarti season, prices increase. Avoid peak times to get better rates"
          },
          private_boat: {
            price: "₹500-1500",
            duration: "1-2 hours",
            warning: "Rates depend on duration and boat size. Confirm before boarding"
          }
        },
        accommodation: {
          budget_hostel: "₹300-500 per night",
          budget_hotel: "₹500-1000 per night",
          mid_range: "₹1500-3000 per night",
          luxury: "₹3000+ per night"
        },
        food: {
          street_food: "₹20-50 per item",
          local_restaurant: "₹100-300 per meal",
          tourist_restaurant: "₹300-800 per meal"
        },
        transportation: {
          auto_rickshaw: "₹50-150 (negotiate)",
          e_rickshaw: "₹30-80",
          taxi: "₹200-400",
          bus: "₹10-50"
        },
        activities: {
          temple_entry: "₹0-100 (mostly free, small donation)",
          museum: "₹50-250",
          guided_tour: "₹200-1000",
          yoga_class: "₹200-500"
        }
      },
      scams: [
        {
          id: "fake_hotel_agent",
          type: "Fake Hotel Agent",
          description: "Unauthorized agent on street offering hotel at half price",
          warning_signs: [
            "Approaches you randomly on street",
            "Offers rooms at extremely low prices",
            "Wants payment upfront or in advance",
            "Cannot show hotel registration"
          ],
          what_to_do: [
            "Always verify hotel directly with reception",
            "Never pay full amount to street agents",
            "Book only through official channels or OTA",
            "Ask for hotel ID and registration"
          ],
          emergency_contact: "Tourist Police: 0542-2200441",
          internal_link: "#fake-agent-scam"
        },
        {
          id: "boat_overcharging",
          type: "Boat Overcharging",
          description: "Boat operators charging exorbitant prices or taking unwilling detours",
          warning_signs: [
            "Boatman quotes extremely high price",
            "Takes you to shops/temples for commission",
            "Refuses to go to requested location",
            "Changes price after boarding"
          ],
          what_to_do: [
            "Negotiate price BEFORE boarding",
            "Get written confirmation of route",
            "Confirm duration and cost upfront",
            "Use government-regulated boats if available"
          ],
          emergency_contact: "Varanasi Tourist Police",
          internal_link: "#boat-scam"
        },
        {
          id: "fake_donation_collector",
          type: "Fake Temple Donation Collector",
          description: "Imposter collecting donations on behalf of temple",
          warning_signs: [
            "No official ID or uniform",
            "Aggressive donation requests",
            "Claims donation is 'compulsory'",
            "Offers suspicious 'blessings' for payment"
          ],
          what_to_do: [
            "Donations are ALWAYS voluntary",
            "Donate only at official temple counters",
            "Ask for official receipt",
            "Ignore aggressive beggars/collectors"
          ],
          emergency_contact: "Temple authorities or nearest police",
          internal_link: "#donation-scam"
        },
        {
          id: "panda_exploitation",
          type: "Panda (Priest) Exploitation",
          description: "Local priests forcing rituals or demanding excessive donations",
          warning_signs: [
            "Panda insists on specific rituals",
            "Claims rituals are 'necessary'",
            "Demands large sums of money",
            "Refuses to disclose cost beforehand"
          ],
          what_to_do: [
            "Ask for written cost estimate",
            "Politely decline unwanted rituals",
            "Verify with temple authorities",
            "Book through official channels"
          ],
          emergency_contact: "Temple Management or Tourist Police",
          internal_link: "#panda-scam"
        },
        {
          id: "auto_overcharging",
          type: "Auto Rickshaw Overcharging",
          description: "Auto drivers charging 2-3x normal fare",
          warning_signs: [
            "Driver refuses meter",
            "Quotes extremely high price",
            "Takes longer route deliberately",
            "Demands extra payment at end"
          ],
          what_to_do: [
            "Always ask for meter/agreed price",
            "Use Uber/Ola for transparent pricing",
            "Know distance before boarding",
            "Report to traffic police if cheated"
          ],
          emergency_contact: "Varanasi Traffic Police: 0542-2200441",
          internal_link: "#auto-scam"
        },
        {
          id: "fake_tour_guide",
          type: "Fake/Unlicensed Tour Guide",
          description: "Unauthorized person posing as official guide",
          warning_signs: [
            "No official license or ID",
            "Approaches randomly on street",
            "Very cheap tour prices",
            "Vague about credentials"
          ],
          what_to_do: [
            "Hire guides from official tourist office",
            "Ask for license number and ID",
            "Verify with tourism department",
            "Book through hotels or recognized agencies"
          ],
          emergency_contact: "Varanasi Tourism Office: 0542-2206164",
          internal_link: "#fake-guide-scam"
        }
      ],
      itineraries: [],
      safety_advisory: {
        emergency_numbers: {
          "tourist_police": "0542-2200441",
          "ambulance": "102",
          "fire": "101",
          "general_police": "100",
          "tourism_helpline": "0542-2206164"
        },
        common_risky_situations: [
          {
            situation: "Someone forcing you to pay",
            response: "Remain calm. Don't give in to threats. Contact nearest police booth immediately.",
            helpline: "Call 100"
          },
          {
            situation: "Donation being forced as compulsory",
            response: "All donations are voluntary. You can refuse. Donations are NOT mandatory in any temple.",
            helpline: "Call Temple Management or 0542-2206164"
          },
          {
            situation: "Police asking for bribe or on-spot fine",
            response: "Ask for official receipt. Do not pay on street. Ask for police ID. Call helpline.",
            helpline: "Tourist Police: 0542-2200441"
          },
          {
            situation: "Being followed or harassed",
            response: "Go to crowded area. Approach shopkeeper or police. Stay calm.",
            helpline: "Call 100"
          },
          {
            situation: "Drink or food looks suspicious",
            response: "Do not consume. Move to another place. Inform shopkeeper if needed.",
            helpline: "Call 102 if medical help needed"
          }
        ]
      }
    };

    banarasData = data;
    return banarasData;
  } catch (error) {
    console.error('Failed to load Banaras database:', error);
    throw new Error('Could not load Banaras database');
  }
}

export function getPlaceById(placeId: string): Place | null {
  if (!banarasData) {
    console.warn('Banaras database not loaded. Call loadBanaarasDatabase() first');
    return null;
  }

  return banarasData.places.find(p => p.id === placeId) || null;
}

export function getPlacesByCategory(category: string): Place[] {
  if (!banarasData) return [];
  return banarasData.places.filter(p => p.category === category);
}

export function getAllPlaces(): Place[] {
  return banarasData?.places || [];
}

export function getScamById(scamId: string): Scam | null {
  if (!banarasData) return null;
  return banarasData.scams.find(s => s.id === scamId) || null;
}

export function getAllScams(): Scam[] {
  return banarasData?.scams || [];
}

export function getCostEstimate(category: string, type?: string): any {
  if (!banarasData) return null;
  
  if (type) {
    return (banarasData.costs as any)[category]?.[type];
  }
  return (banarasData.costs as any)[category];
}

export function getEmergencyNumbers(): Record<string, string> {
  return banarasData?.safety_advisory.emergency_numbers || {};
}

export function getItineraryByDuration(days: number): any {
  if (!banarasData) return null;
  
  const duration_key = `one_day_classic|two_day_explorer|three_day_immersion`.split('|');
  return banarasData.itineraries.find(i => i.duration_days === days);
}

export function getSafetyAdvisory(): any {
  return banarasData?.safety_advisory || null;
}

// Helper function to detect if user message mentions known scams
export function detectPotentialScams(userMessage: string): Scam[] {
  if (!banarasData) return [];

  const messageLower = userMessage.toLowerCase();
  const detectedScams: Scam[] = [];

  // Keywords associated with different scams
  const scamKeywords: Record<string, string[]> = {
    fake_hotel_agent: ['hotel', 'cheap room', 'agent', 'discounted', 'offer'],
    boat_overcharging: ['boat', 'price', 'charge', 'expensive', 'boat ride'],
    fake_donation_collector: ['donation', 'temple', 'money', 'priest'],
    panda_exploitation: ['ritual', 'puja', 'ceremony', 'charges', 'priest'],
    auto_overcharging: ['auto', 'rickshaw', 'taxi', 'fare', 'expensive'],
    fake_tour_guide: ['tour', 'guide', 'guide fee', 'show']
  };

  Object.entries(scamKeywords).forEach(([scamId, keywords]) => {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      const scam = getScamById(scamId);
      if (scam) detectedScams.push(scam);
    }
  });

  return detectedScams;
}

// New helper functions for rich data access
export function getPlacesByZone(zone: string): Place[] {
  if (!banarasData) return [];
  return banarasData.places.filter(p => p.zone === zone);
}

export function getPlacesByExplorationLevel(level: string): Place[] {
  if (!banarasData) return [];
  return banarasData.places.filter(p => p.exploration_level === level);
}

export function getAccessiblePlaces(): Place[] {
  if (!banarasData) return [];
  return banarasData.places
    .filter(p => p.accessibility_rating !== undefined && p.accessibility_rating >= 7)
    .sort((a, b) => (b.accessibility_rating || 0) - (a.accessibility_rating || 0));
}

export function searchPlacesByKeyword(keyword: string): Place[] {
  if (!banarasData) return [];
  const keywordLower = keyword.toLowerCase();
  return banarasData.places.filter(p => 
    p.name.toLowerCase().includes(keywordLower) ||
    p.description?.toLowerCase().includes(keywordLower) ||
    p.deep_history?.toLowerCase().includes(keywordLower) ||
    p.mythological_significance?.toLowerCase().includes(keywordLower) ||
    p.unique_features?.some(f => f.toLowerCase().includes(keywordLower))
  );
}

export function getHiddenGems(): Place[] {
  if (!banarasData) return [];
  return banarasData.places.filter(p => 
    p.exploration_level === 'hidden_gems' || 
    p.exploration_level === 'must_visit_unexplored'
  );
}

export function getCentralVaranasiPlaces(): Place[] {
  return getPlacesByZone('central_varanasi');
}

export function getSarnathPlaces(): Place[] {
  return getPlacesByZone('sarnath');
}

export function getOuterVaranasiPlaces(): Place[] {
  return getPlacesByZone('outer_varanasi');
}

// Initialize database on module load
loadBanaarasDatabase().catch(error => {
  console.warn('Banaras database will be loaded on first use:', error.message);
});
