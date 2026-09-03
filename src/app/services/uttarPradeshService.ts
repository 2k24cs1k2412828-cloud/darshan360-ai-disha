import { 
  COMPREHENSIVE_UP_PLACES, 
  UP_CITY_COORDINATES, 
  calculateDynamicUPRoute 
} from '../../data/up-comprehensive-database';

export { UP_CITY_COORDINATES, calculateDynamicUPRoute };

export interface UPPlace {
  id: string;
  name: string;
  hindiName: string;
  city: string;
  hindiCity: string;
  category: 'temple' | 'heritage' | 'ghat' | 'buddhist' | 'food' | 'nature' | 'monument';
  categoryLabel: { en: string; hi: string };
  coordinates: [number, number]; // [lat, lng]
  description: { en: string; hi: string };
  travelCause: { en: string; hi: string }; // Why visit / Spiritual & Cultural significance
  deepHistory: { en: string; hi: string };
  architecture: { en: string; hi: string };
  bestTime: { en: string; hi: string };
  timings: { en: string; hi: string };
  entryFee: { en: string; hi: string };
  accessibilityRating: number; // 1-10
  accessibilityNotes: { en: string; hi: string };
  photographyTips: { en: string; hi: string };
  safetyTips: { en: string; hi: string };
  images: { url: string; title: { en: string; hi: string }; caption?: string }[];
  tags: string[];
}

export interface UPCityCrowdAdvisory {
  cityId: string;
  cityName: { en: string; hi: string };
  currentCrowdLevel: 'low' | 'moderate' | 'high' | 'extreme';
  crowdBadge: { en: string; hi: string };
  travelFeasibility: 'highly_recommended' | 'good_to_visit' | 'plan_with_caution' | 'heavy_rush_warning';
  feasibilityVerdict: { en: string; hi: string }; // "Jane layak hai ya nahi"
  detailedStatus: { en: string; hi: string };
  bestVisitingSlots: { en: string; hi: string };
  howToReach: { en: string; hi: string };
  latestHappening: { en: string; hi: string };
}

export interface UPNewsEvent {
  id: string;
  title: { en: string; hi: string };
  category: 'festival' | 'darshan_update' | 'infrastructure' | 'tourism_alert';
  date: string;
  city: string;
  summary: { en: string; hi: string };
  details: { en: string; hi: string };
  officialLink?: string;
  importantNote?: { en: string; hi: string };
}

export interface UPScamAdvisory {
  id: string;
  type: { en: string; hi: string };
  city: string;
  description: { en: string; hi: string };
  warningSigns: { en: string[]; hi: string[] };
  preventionTips: { en: string[]; hi: string[] };
  emergencyNumber: string;
}

export interface UPRoute {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  cities: string[];
  waypoints: [number, number][];
  distanceKm: number;
  recommendedDays: number;
}

const BASE_UP_PLACES: UPPlace[] = [
  {
    id: 'kashi_vishwanath',
    name: 'Shri Kashi Vishwanath Dham',
    hindiName: 'श्री काशी विश्वनाथ धाम',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'temple',
    categoryLabel: { en: 'Jyotirlinga Temple', hi: 'ज्योतिर्लिंग धाम' },
    coordinates: [25.3109, 83.0107],
    description: {
      en: 'One of the twelve supreme Jyotirlingas of Lord Shiva, connected to the sacred Ganga at Lalita Ghat via a grand 50,000 sq m heritage corridor.',
      hi: 'द्वादश ज्योतिर्लिंगों में प्रमुख भगवान शिव का पावन धाम, जो 50,000 वर्ग मीटर के विशाल गंगा कॉरिडोर से सीधे ललिता घाट से जुड़ा है।'
    },
    travelCause: {
      en: 'Supreme pilgrimage for liberation (Moksha), experiencing the divine energy of Mahadev, and witnessing the sacred Ganga corridor.',
      hi: 'मोक्ष की प्राप्ति, महादेव की असीम कृपा और गंगा तट से सीधे जुड़े भव्य कॉरिडोर की आध्यात्मिक अनुभूति।'
    },
    deepHistory: {
      en: 'Rebuilt by Maharani Ahilyabai Holkar in 1780; iconic gold spires donated by Maharaja Ranjit Singh in 1835.',
      hi: '1780 में महारानी अहिल्याबाई होल्कर द्वारा पुनर्निर्मित तथा 1835 में महाराजा रणजीत सिंह द्वारा स्वर्ण शिखर समर्पित।'
    },
    architecture: {
      en: 'Chunar pink-red sandstone corridor connecting riverfront directly to the ancient sanctum sanctorum.',
      hi: 'चुनार के बलुआ पत्थरों से बना भव्य कॉरिडोर।'
    },
    bestTime: { en: 'Early morning Mangala Aarti (3:00 AM) or Evening Shringar Aarti (9:00 PM)', hi: 'प्रातः मंगला आरती (3:00 बजे) या सांध्य शृंगार आरती' },
    timings: { en: '3:00 AM - 11:00 PM', hi: 'प्रातः 3:00 से रात 11:00 बजे तक' },
    entryFee: { en: 'Free general Darshan. Sugam Darshan pass: ₹300 via shrikashivishwanath.org', hi: 'सामान्य दर्शन निःशुल्क। सुगम दर्शन ₹300' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Escalators from Lalita Ghat, elevators, wheelchair ramps, and AC waiting lounges.', hi: 'एस्केलेटर, लिफ्ट, व्हीलचेयर रैंप और एसी प्रतीक्षालय उपलब्ध।' },
    photographyTips: { en: 'Mobiles/cameras deposited in lockers outside sanctum.', hi: 'सुरक्षा हेतु फोन लॉकर में जमा होते हैं।' },
    safetyTips: { en: 'Only use official temple trust counters. Beware of touts claiming instant entry in gallis.', hi: 'केवल ट्रस्ट के अधिकृत काउंटर का प्रयोग करें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', title: { en: 'Kashi Vishwanath Corridor', hi: 'काशी विश्वनाथ कॉरिडोर' } },
      { url: 'https://images.unsplash.com/photo-1635664979275-3e3f7dea97c7?w=800', title: { en: 'Golden Temple Spire', hi: 'स्वर्ण मंदिर शिखर' } }
    ],
    tags: ['varanasi', 'kashi', 'vishwanath', 'temple', 'shiva', 'jyotirlinga']
  },
  {
    id: 'dashashwamedh_ghat',
    name: 'Dashashwamedh Ghat (Maha Ganga Aarti)',
    hindiName: 'दशाश्वमेध घाट (महा गंगा आरती)',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'ghat',
    categoryLabel: { en: 'Grand Ghat & Aarti', hi: 'महा आरती घाट' },
    coordinates: [25.3076, 83.0103],
    description: {
      en: 'The most iconic ghat of Varanasi where the world-renowned evening Maha Ganga Aarti is performed daily with multi-tiered brass lamps.',
      hi: 'वाराणसी का सबसे प्रसिद्ध घाट जहां प्रतिदिन संध्याकाल में भव्य महा गंगा आरती संपन्न होती है।'
    },
    travelCause: {
      en: 'Witnessing the divine symphony of Vedic chants, conch blowing, and synchronized brass fire lamps worshiping Mother Ganga.',
      hi: 'शंखनाद, वैदिक मंत्रोच्चार और विशाल दीपों के साथ मां गंगा की अलौकिक आरती का दर्शन।'
    },
    deepHistory: {
      en: 'Lord Brahma performed ten Ashwamedha horse sacrifices here for King Divodasa.',
      hi: 'पौराणिक मान्यता के अनुसार भगवान ब्रह्मा ने यहां 10 अश्वमेध यज्ञ किए थे।'
    },
    architecture: {
      en: 'Grand stone stairways leading to the riverfront surrounded by ancient temples.',
      hi: 'गंगा तट पर उतरती विशाल पत्थर की सीढ़ियां।'
    },
    bestTime: { en: 'Evening 6:00 PM - 7:45 PM', hi: 'सायं 6:00 से 7:45 बजे' },
    timings: { en: 'Open 24 hours. Evening Aarti starts ~6:45 PM (Winter) / 7:15 PM (Summer)', hi: '24 घंटे खुला। आरती सायं 6:45 / 7:15 बजे' },
    entryFee: { en: 'Free on ghat steps; shared boat ₹150-250 per person', hi: 'घाट से निःशुल्क; नाव से ₹150-250 प्रति व्यक्ति' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Paved approach from Godowlia chowk (200m walk), rickshaws available.', hi: 'गोदौलिया से 200 मीटर की आसान पैदल दूरी।' },
    photographyTips: { en: 'Take a boat at twilight to capture glowing multi-tier lamp reflections in the Ganga.', hi: 'संध्याकाल में नाव से आरती की दीपमालाओं का अद्भुत दृश्य।' },
    safetyTips: { en: 'Negotiate boat price before boarding; ensure life jackets are provided.', hi: 'सवारी से पहले नाव का किराया तय करें और लाइफ जैकेट पहनें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', title: { en: 'Evening Maha Ganga Aarti', hi: 'भव्य सांध्य गंगा आरती' } }
    ],
    tags: ['varanasi', 'ghat', 'dashashwamedh', 'ganga aarti', 'riverfront']
  },
  {
    id: 'assi_ghat',
    name: 'Assi Ghat (Subah-e-Banaras)',
    hindiName: 'अस्सी घाट (सुबह-ए-बनारस)',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'ghat',
    categoryLabel: { en: 'Cultural Sunrise Ghat', hi: 'सांस्कृतिक सूर्योदय घाट' },
    coordinates: [25.2885, 83.0064],
    description: {
      en: 'The southern anchor of Banaras ghats, famous for sunrise yoga, classical Indian ragas, Vedic havan, and student-café culture.',
      hi: 'बनारस का दक्षिणी प्रमुख घाट, जो प्रातःकालीन योग, शास्त्रीय संगीत, वैदिक हवन और युवा संस्कृति हेतु विख्यात है।'
    },
    travelCause: {
      en: 'Experiencing the dawn spiritual program "Subah-e-Banaras", sunrise boat rides, and morning tea & poori-jalebi.',
      hi: '"सुबह-ए-बनारस" में सूर्योदय आरती, शास्त्रीय संगीत और प्रसिद्ध बनारसी चाय-कचौड़ी का आनंद।'
    },
    deepHistory: {
      en: 'Confluence of River Assi and Ganga. Tulsidas wrote Ramcharitmanas here.',
      hi: 'अस्सी और गंगा का संगम; गोस्वामी तुलसीदास जी की साधना स्थली।'
    },
    architecture: {
      en: 'Expansive stone ghat steps with cultural amphitheater and sacred peepal tree.',
      hi: 'चौड़े घाट और सांस्कृतिक मंच।'
    },
    bestTime: { en: '5:00 AM - 7:30 AM daily', hi: 'प्रातः 5:00 से 7:30 बजे' },
    timings: { en: 'Open 24 hours. Sunrise program at 5:30 AM', hi: '24 घंटे खुला। सुबह-ए-बनारस प्रातः 5:30 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Direct vehicle access to ghat entrance with minimal stairs.', hi: 'घाट के प्रवेश द्वार तक वाहन पहुंच मार्ग।' },
    photographyTips: { en: 'Golden morning light filtering through river mist with traditional wooden boats.', hi: 'सुबह की सुनहरी धूप में रंग-बिरंगी नावों के चित्र।' },
    safetyTips: { en: 'Clean and safe ghat for family and solo travelers.', hi: 'परिवार एवं पर्यटकों हेतु अत्यंत सुरक्षित घाट।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1664823711178-1a0db71930e6?w=800', title: { en: 'Sunrise Boats at Assi Ghat', hi: 'अस्सी घाट पर सूर्योदय' } }
    ],
    tags: ['varanasi', 'ghat', 'assi ghat', 'subah-e-banaras', 'sunrise', 'yoga']
  },
  {
    id: 'namo_ghat',
    name: 'Namo Ghat (Khidkiya Ghat)',
    hindiName: 'नमो घाट (खिड़किया घाट)',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'ghat',
    categoryLabel: { en: 'Modern Accessible Ghat', hi: 'आधुनिक सुगम घाट' },
    coordinates: [25.3340, 83.0365],
    description: {
      en: 'The most modern, fully accessible ghat of Varanasi featuring giant Namaste sculptures, electric boat charging, helicopter facility, and riverfront parks.',
      hi: 'विशाल नमस्ते प्रतिमाओं, ई-बोट चार्जिंग, हेलीपोर्ट और वॉकिंग प्लाजा से युक्त वाराणसी का सबसे आधुनिक एवं सुगम घाट।'
    },
    travelCause: {
      en: 'Zero-step entrance, wheelchair accessibility, water sports, open-air food courts, and boarding solar electric catamarans.',
      hi: 'पूर्णतः व्हीलचेयर सुलभ, आधुनिक ओपन-एयर कैफे और सोलर क्रूज की सवारी।'
    },
    deepHistory: {
      en: 'Redeveloped as India\'s state-of-the-art eco-ghat with zero-discharge sanitation and solar power.',
      hi: 'आधुनिक ईको-टूरिज्म मॉडल के तहत पुनर्विकसित नया घाट।'
    },
    architecture: {
      en: 'Striking 75-foot Namaste steel sculptures with landscaped gardens and paved walkways.',
      hi: '75 फीट ऊंची नमस्ते की कलाकृतियां और सुंदर पाथवे।'
    },
    bestTime: { en: 'Early morning or Evening 5:00 PM - 9:00 PM', hi: 'सुबह या शाम 5:00 से 9:00 बजे' },
    timings: { en: 'Open 24 hours', hi: '24 घंटे खुला' },
    entryFee: { en: 'Free entry. Parking ₹20-50', hi: 'प्रवेश निःशुल्क। पार्किंग ₹20-50' },
    accessibilityRating: 10,
    accessibilityNotes: { en: '10/10 Accessibility: Completely step-free, wide ramps, accessible restrooms, battery carts.', hi: '10/10 सुगमता: पूरी तरह सीढ़ी-मुक्त, चौड़े रैंप और ई-कार्ट।' },
    photographyTips: { en: 'Iconic wide-angle shot of Namaste sculptures against sunrise or night illumination.', hi: 'नमस्ते स्कल्पचर के साथ सूर्यास्त और नाइट लाइटिंग के फोटो।' },
    safetyTips: { en: 'Spacious and exceptionally well-guarded with tourist police outpost.', hi: 'अत्यंत स्वच्छ और सुरक्षित।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', title: { en: 'Namo Ghat Illuminated Plaza', hi: 'नमो घाट प्लाजा' } }
    ],
    tags: ['varanasi', 'ghat', 'namo ghat', 'accessible', 'modern']
  },
  {
    id: 'manikarnika_ghat',
    name: 'Manikarnika Ghat (Mahashamshan)',
    hindiName: 'मणिकर्णिका घाट (महाश्मशान)',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'ghat',
    categoryLabel: { en: 'Sacred Cremation Ghat', hi: 'महाश्मशान घाट' },
    coordinates: [25.3106, 83.0142],
    description: {
      en: 'The eternal cremation ghat of Kashi where the sacred fire has burned uninterrupted for thousands of years, granting direct Moksha.',
      hi: 'काशी का पावन महाश्मशान घाट जहां हजारों वर्षों से निरंतर प्रज्वलित अग्नि में देह त्याग के उपरांत सीधे मोक्ष मिलता है।'
    },
    travelCause: {
      en: 'Profound spiritual contemplation on the impermanence of life and Lord Shiva chanting the Tarak Mantra in the ears of the departed.',
      hi: 'जीवन की नश्वरता का आत्मबोध और भगवान शिव द्वारा तारक मंत्र से मोक्ष प्रदान करने की मान्यता।'
    },
    deepHistory: {
      en: 'Legend says Lord Shiva\'s jewel earring (Manikarnika) fell into the kund excavated by Lord Vishnu here.',
      hi: 'भगवान शिव का मणिकुंडल यहां विष्णु चक्रपुष्करिणी कुंड में गिरा था।'
    },
    architecture: {
      en: 'Tiered stone platforms, wood stacks, and ancient Shiva temples leaning into the river.',
      hi: 'प्राचीन पत्थरों के मंच और पवित्र चक्रपुष्करिणी कुंड।'
    },
    bestTime: { en: 'Viewed respectfully from a passing boat on the Ganga', hi: 'नाव से दूर से शांत भाव में दर्शन' },
    timings: { en: 'Open 24 hours', hi: '24 घंटे खुला' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 4,
    accessibilityNotes: { en: 'Narrow alleyways and wood stacks; best viewed quietly from river boats.', hi: 'संकरे रास्ते; नाव से दर्शन सबसे उपयुक्त।' },
    photographyTips: { en: 'Strictly NO photography of cremation pyres out of deep reverence for families.', hi: 'दाह संस्कार की फोटोग्राफी पूर्णतः वर्जित है।' },
    safetyTips: { en: 'Beware of touts asking for "wood donation" scams. Never pay money to unauthorized street agents.', hi: 'लकड़ी दान के नाम पर पैसे मांगने वाले दलालों से सावधान रहें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', title: { en: 'Manikarnika Ghat Riverfront', hi: 'मणिकर्णिका घाट' } }
    ],
    tags: ['varanasi', 'ghat', 'manikarnika', 'moksha', 'shiva']
  },

  // =================== AYODHYA GHATS & TEMPLES ===================
  {
    id: 'ram_janmabhoomi',
    name: 'Shri Ram Janmabhoomi Mandir',
    hindiName: 'श्री राम जन्मभूमि मंदिर',
    city: 'Ayodhya',
    hindiCity: 'अयोध्या',
    category: 'temple',
    categoryLabel: { en: 'Sacred Temple', hi: 'पवित्र मंदिर' },
    coordinates: [26.7956, 82.1943],
    description: {
      en: 'The grand temple dedicated to Bhagwan Shri Ram Lalla at his historic birthplace in Ayodhya, constructed in traditional Nagara style.',
      hi: 'अयोध्या में प्रभु श्री राम लला के जन्मस्थान पर नागर शैली में निर्मित भव्य एवं दिव्य मंदिर।'
    },
    travelCause: {
      en: 'Foremost pilgrimage for millions of Hindus worldwide, symbolizing dharma, devotion, and cultural rejuvenation.',
      hi: 'सनातन धर्म का सर्वोच्च तीर्थ स्थल, जो धर्म, मर्यादा, भक्ति और आध्यात्मिक शांति का प्रतीक है।'
    },
    deepHistory: {
      en: 'Consecrated during Pran Pratishtha on January 22, 2024. Built with pink Bansi Paharpur stone without iron reinforcement.',
      hi: '22 जनवरी 2024 को ऐतिहासिक प्राण प्रतिष्ठा। राजस्थान के बंसी पहाड़पुर पत्थरों से निर्मित।'
    },
    architecture: {
      en: 'Three-storied Nagara temple with 392 pillars, 44 teakwood doors, and a 161-foot golden Shikhara.',
      hi: '392 खंभों, 44 सागौन के दरवाजों और 161 फीट ऊंचे स्वर्ण शिखर से सुसज्जित तीन मंजिला वास्तुशिल्प।'
    },
    bestTime: { en: '6:30 AM - 11:30 AM & 2:00 PM - 9:30 PM', hi: 'सुबह 6:30 से 11:30 और दोपहर 2:00 से रात 9:30 बजे' },
    timings: { en: '6:30 AM - 12:00 PM & 2:00 PM - 10:00 PM', hi: 'सुबह 6:30 से 12:00 और 2:00 से 10:00 बजे' },
    entryFee: { en: 'Free general entry. Free pre-booked passes for Aarti on srjbtkshetra.org', hi: 'सामान्य प्रवेश निःशुल्क। आरती पास ट्रस्ट पोर्टल पर निःशुल्क।' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Wheelchair assistance, golf carts for seniors, ramps, covered corridors.', hi: 'वरिष्ठ नागरिकों हेतु व्हीलचेयर, ई-कार्ट, रैंप और ढके हुए रास्ते।' },
    photographyTips: { en: 'Phones/cameras stored in free Pilgrim Facilitation Centre lockers.', hi: 'फोन पीएफसी केंद्र के निशुल्क लॉकर में जमा होते हैं।' },
    safetyTips: { en: 'Book Aarti passes only via srjbtkshetra.org. Avoid fake VIP pass touts.', hi: 'आरती पास केवल ट्रस्ट की आधिकारिक वेबसाइट से लें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1707297055902-b0978ec1fcfb?w=800', title: { en: 'Ram Mandir Sanctum & Shikhara', hi: 'राम मंदिर गर्भगृह व शिखर' } }
    ],
    tags: ['ayodhya', 'ram mandir', 'temple', 'spiritual', 'ram lalla']
  },
  {
    id: 'ram_ki_paidi',
    name: 'Ram Ki Paidi & Saryu Ghats',
    hindiName: 'राम की पैड़ी एवं सरयू घाट',
    city: 'Ayodhya',
    hindiCity: 'अयोध्या',
    category: 'ghat',
    categoryLabel: { en: 'Holy Saryu Ghats', hi: 'पवित्र सरयू घाट' },
    coordinates: [26.8041, 82.2039],
    description: {
      en: 'A magnificent series of ghats along the sacred Saryu river where the world-record Guinness Deepotsav festival and evening Saryu Aarti take place.',
      hi: 'पवित्र सरयू नदी के तट पर स्थित घाटों की भव्य श्रृंखला, जहां विश्वप्रसिद्ध दीपोत्सव और संध्या महा आरती होती है।'
    },
    travelCause: {
      en: 'Holy dip in Saryu River, witnessing evening Saryu Maha Aarti, and relaxing at illuminated musical laser fountain shows.',
      hi: 'सरयू स्नान, दिव्य सांध्य महा आरती और संगीतमय लेजर फव्वारा शो का आनंद।'
    },
    deepHistory: {
      en: 'Mentioned in Ramayana as the celestial river where Lord Rama concluded his earthly avatar.',
      hi: 'रामायण कालीन पवित्र नदी जहां भगवान श्री राम ने अपनी लीलाएं कीं।'
    },
    architecture: {
      en: 'Paved stone ghats with ornamental lamps, laser sound systems, and landscaped parks.',
      hi: 'सुसज्जित पक्का घाट, फव्वारे और लेजर शो।'
    },
    bestTime: { en: 'Sunset (5:30 PM - 7:30 PM) for Saryu Aarti & musical fountains', hi: 'सांध्य काल 5:30 से 7:30 बजे सरयू आरती एवं फव्वारा शो' },
    timings: { en: 'Open 24 hours. Daily Aarti at 6:30 PM (Winter) / 7:00 PM (Summer)', hi: '24 घंटे खुला। दैनिक आरती सायं 6:30/7:00 बजे' },
    entryFee: { en: 'Free. Boating: ₹100-200 per person', hi: 'निःशुल्क। नौकायन ₹100-200' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Smooth pedestrian promenade, ramp access available.', hi: 'समतल पैदल मार्ग और रैंप सुविधा।' },
    photographyTips: { en: 'Sunset reflections on Saryu water and glowing diyas during evening aarti.', hi: 'सूर्यास्त के समय जल में दीपकों का सुनहरा प्रतिबिंब।' },
    safetyTips: { en: 'Only take official boats with life jackets.', hi: 'केवल लाइफ जैकेट वाली पंजीकृत नौकाओं का उपयोग करें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', title: { en: 'Ram Ki Paidi Ghat & Saryu Riverfront', hi: 'राम की पैड़ी सरयू घाट' } }
    ],
    tags: ['ayodhya', 'ghat', 'saryu', 'ram ki paidi', 'aarti', 'riverfront']
  },
  {
    id: 'guptar_ghat',
    name: 'Guptar Ghat (Ayodhya)',
    hindiName: 'गुप्तार घाट (अयोध्या)',
    city: 'Ayodhya',
    hindiCity: 'अयोध्या',
    category: 'ghat',
    categoryLabel: { en: 'Jal Samadhi Sacred Ghat', hi: 'जल समाधि पावन घाट' },
    coordinates: [26.7820, 82.1380],
    description: {
      en: 'The peaceful sacred ghat on the Saryu River where Bhagwan Shri Ram performed Jal Samadhi and ascended to his celestial abode Vaikuntha.',
      hi: 'सरयू नदी पर स्थित अत्यंत शांत पावन घाट जहां भगवान श्री राम ने जल समाधि लेकर साकेत धाम (वैकुंठ) प्रस्थान किया।'
    },
    travelCause: {
      en: 'Deep spiritual peace, boat rides through untouched nature, and darshan at the ancient Gupta Gopratara Temple.',
      hi: 'गहन आध्यात्मिक शांति, प्राकृतिक नौकायन और प्राचीन गुप्त गोप्रतार मंदिर के दर्शन।'
    },
    deepHistory: {
      en: 'Rebuilt by Raja Darshan Singh in early 19th century; beautifully landscaped with riverside parks and open-air food courts.',
      hi: '19वीं शताब्दी में राजा दर्शन सिंह द्वारा निर्मित, अब आधुनिक रिवरफ्रंट के रूप में विकसित।'
    },
    architecture: {
      en: 'Modern stepped promenade with gardens, open-air amphitheater, and solar-powered lights.',
      hi: 'सुंदर बगीचों और पाथवे से सुसज्जित रिवरफ्रंट।'
    },
    bestTime: { en: 'Sunrise (6:00 AM) or Sunset (5:30 PM)', hi: 'सूर्योदय अथवा सूर्यास्त' },
    timings: { en: 'Open 24 hours', hi: '24 घंटे खुला' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Vehicle accessible right to the promenade, zero steps, electric golf carts.', hi: 'गाड़ियों की सीधी पहुंच, सीढ़ी-मुक्त रैंप।' },
    photographyTips: { en: 'Peaceful river sunset with birds flying across the Saryu delta.', hi: 'सरयू के शांत जल में ढलते सूरज का अद्भुत दृश्य।' },
    safetyTips: { en: 'Family-friendly and peaceful.', hi: 'अत्यंत स्वच्छ और शांत।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', title: { en: 'Guptar Ghat Saryu Riverfront', hi: 'गुप्तार घाट सरयू तट' } }
    ],
    tags: ['ayodhya', 'ghat', 'guptar ghat', 'saryu', 'samadhi']
  },

  // =================== MATHURA & VRINDAVAN GHATS & TEMPLES ===================
  {
    id: 'vishram_ghat',
    name: 'Vishram Ghat (Mathura Yamuna Aarti)',
    hindiName: 'विश्राम घाट (मथुरा यमुना आरती)',
    city: 'Mathura',
    hindiCity: 'मथुरा',
    category: 'ghat',
    categoryLabel: { en: 'Sacred Yamuna Ghat', hi: 'पवित्र यमुना घाट' },
    coordinates: [27.5028, 77.6833],
    description: {
      en: 'The central and most sacred ghat of Mathura where Lord Krishna rested after slaying the tyrant king Kansa. Home to the daily evening Yamuna Maha Aarti.',
      hi: 'मथुरा का मुख्य एवं परम पवित्र घाट जहां कंस वध के उपरांत भगवान श्री कृष्ण ने विश्राम किया था। यहीं दैनिक सांध्य यमुना महारती होती है।'
    },
    travelCause: {
      en: 'Traditional Yamuna Snan, offering floating flower lamps, participating in evening Yamuna Aarti, and the starting point for 24-ghat Parikrama.',
      hi: 'यमुना स्नान, सांध्य दीपदान, दिव्य आरती दर्शन और 24 घाटों की परिक्रमा का प्रारंभ स्थल।'
    },
    deepHistory: {
      en: 'Central to all 24 holy ghats of Mathura (12 in north, 12 in south).',
      hi: 'मथुरा के सभी 24 घाटों का केंद्र बिंदु।'
    },
    architecture: {
      en: 'Historic sandstone steps lined with medieval temples, clock tower, and boat docks.',
      hi: 'ऐतिहासिक पत्थर के घाट और प्राचीन मंदिर।'
    },
    bestTime: { en: 'Morning 6:00 AM or Evening Yamuna Aarti at 7:00 PM', hi: 'सुबह 6:00 या शाम 7:00 बजे यमुना आरती' },
    timings: { en: 'Open 24 hours. Evening Aarti at 7:00 PM', hi: '24 घंटे खुला। आरती सायं 7:00 बजे' },
    entryFee: { en: 'Free. Boat ride across Yamuna: ₹50-100 per person', hi: 'निःशुल्क। नाव की सवारी ₹50-100' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'E-rickshaws reach close to ghat entrance; stone stairs lead to river.', hi: 'ई-रिक्शा सीधे घाट तक पहुंचते हैं।' },
    photographyTips: { en: 'Hundreds of floating oil lamps illuminating the river during evening aarti.', hi: 'शाम की आरती में जल पर तैरते दीपकों का मनमोहक दृश्य।' },
    safetyTips: { en: 'Beware of monkeys around the temple steps; keep spectacles safe.', hi: 'सीढ़ियों पर बंदरों से चश्मा व बैग संभालकर रखें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=800', title: { en: 'Vishram Ghat Yamuna Aarti Mathura', hi: 'विश्राम घाट यमुना आरती' } }
    ],
    tags: ['mathura', 'ghat', 'vishram ghat', 'yamuna', 'aarti', 'krishna']
  },
  {
    id: 'keshi_ghat',
    name: 'Keshi Ghat (Vrindavan)',
    hindiName: 'केशी घाट (वृंदावन)',
    city: 'Mathura',
    hindiCity: 'मथुरा (वृंदावन)',
    category: 'ghat',
    categoryLabel: { en: 'Heritage Riverfront', hi: 'विरासत यमुना घाट' },
    coordinates: [27.5855, 77.7058],
    description: {
      en: 'The most stunning architectural ghat of Vrindavan with ornate sandstone palaces where Lord Krishna bathed after defeating the Keshi horse demon.',
      hi: 'वृंदावन का सर्वाधिक सुंदर नक्काशीदार घाट जहां भगवान श्री कृष्ण ने केशी दैत्य का उद्धार कर स्नान किया था।'
    },
    travelCause: {
      en: 'Sunset boat rides, traditional Yamuna pooja, and marveling at the 17th-century Rajasthani-Mughal sandstone facades.',
      hi: 'सूर्यास्त के समय यमुना में नौकायन और भव्य राजस्थानी महलों की वास्तुकला के दर्शन।'
    },
    deepHistory: {
      en: 'Constructed by Queen Lakshmi Devi of Bharatpur in the 17th century with intricate jharokhas.',
      hi: 'भरतपुर की महारानी द्वारा 17वीं सदी में निर्मित सुंदर झरोखेदार घाट।'
    },
    architecture: {
      en: 'Elaborate red and yellow sandstone palace facades with arched pavilions and grand river stairways.',
      hi: 'लाल-पीले बलुआ पत्थरों के महल, मेहराब और नक्काशीदार छतरियां।'
    },
    bestTime: { en: 'Sunset 5:00 PM - 7:00 PM for golden hour lighting', hi: 'सूर्यास्त 5:00 से 7:00 बजे' },
    timings: { en: 'Open 24 hours. Evening Aarti at 6:30 PM', hi: '24 घंटे खुला। आरती सायं 6:30 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Approached through Vrindavan Parikrama marg; wooden steps on riverbank.', hi: 'परिक्रमा मार्ग से सीधी पहुंच।' },
    photographyTips: { en: 'Iconic reflection of the grand palace jharokhas in the Yamuna river at sunset.', hi: 'सूर्यास्त के समय यमुना जल में महलों के झरोखों का प्रतिबिंब।' },
    safetyTips: { en: 'Guard glasses and food from monkeys in the area.', hi: 'बंदरों से चश्मा सुरक्षित रखें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1609137144822-0a15320c2429?w=800', title: { en: 'Keshi Ghat Heritage Architecture', hi: 'केशी घाट वास्तुकला' } }
    ],
    tags: ['vrindavan', 'ghat', 'keshi ghat', 'yamuna', 'mathura', 'krishna']
  },
  {
    id: 'krishna_janmabhoomi',
    name: 'Shri Krishna Janmabhoomi',
    hindiName: 'श्री कृष्ण जन्मभूमि',
    city: 'Mathura',
    hindiCity: 'मथुरा',
    category: 'temple',
    categoryLabel: { en: 'Avatar Birthplace', hi: 'अवतार जन्मभूमि' },
    coordinates: [27.5055, 77.6698],
    description: {
      en: 'The sacred prison cell (Garbha Griha) where Lord Shri Krishna took birth in Dwapara Yuga.',
      hi: 'द्वापर युग में भगवान श्री कृष्ण का जिस कारागार में जन्म हुआ, वह परम पावन तीर्थ।'
    },
    travelCause: {
      en: 'Darshan at the sacred birthplace of Krishna, Gita Temple, Potra Kund, and experiencing Braj devotion.',
      hi: 'कान्हा की जन्मस्थली, गीता मंदिर और पोतरा कुंड के दर्शन।'
    },
    deepHistory: {
      en: 'First temple built by Krishna\'s great-grandson Vajranabha.',
      hi: 'श्री कृष्ण के प्रपौत्र वज्रनाभ द्वारा निर्मित।'
    },
    architecture: {
      en: 'Sculpted marble and red stone pavilions depicting Krishna Leela and Bhagavad Gita.',
      hi: 'संगमरमर व लाल पत्थरों पर कृष्ण लीला की नक्काशी।'
    },
    bestTime: { en: '5:30 AM - 12:00 PM & 4:00 PM - 9:30 PM', hi: 'सुबह 5:30-12:00 और शाम 4:00-9:30 बजे' },
    timings: { en: '5:00 AM - 12:00 PM & 4:00 PM - 9:30 PM', hi: 'सुबह 5:00 से रात 9:30 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Ramps available for main halls; electronic lockers at entrance.', hi: 'रैंप और प्रवेश द्वार पर लॉकर।' },
    photographyTips: { en: 'No electronic gadgets/phones permitted inside.', hi: 'सुरक्षा कारणों से फोन वर्जित है।' },
    safetyTips: { en: 'Store mobile phones in official cloakrooms.', hi: 'फोन आधिकारिक काउंटर पर जमा करें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=800', title: { en: 'Krishna Janmabhoomi Temple', hi: 'श्री कृष्ण जन्मभूमि' } }
    ],
    tags: ['mathura', 'temple', 'krishna janmabhoomi', 'braj']
  },
  {
    id: 'vrindavan_prem_mandir',
    name: 'Prem Mandir & Bankey Bihari',
    hindiName: 'प्रेम मंदिर एवं बांके बिहारी मंदिर',
    city: 'Mathura',
    hindiCity: 'मथुरा (वृंदावन)',
    category: 'temple',
    categoryLabel: { en: 'Divine Temple Complex', hi: 'दिव्य मंदिर संकुल' },
    coordinates: [27.5714, 77.6742],
    description: {
      en: 'Twin jewels of Vrindavan: miraculous Bankey Bihari temple and the stunning white Italian marble Prem Mandir with shifting rainbow musical fountains.',
      hi: 'वृंदावन के दो परम आकर्षण: बांके बिहारी मंदिर तथा इटैलियन श्वेत संगमरमर से बना प्रेम मंदिर।'
    },
    travelCause: {
      en: 'Devotional bliss of Radha-Krishna, Phoolon Ki Holi, 3D marble relief carvings, and illuminated musical water fountains.',
      hi: 'राधा-कृष्ण के दिव्य प्रेम का अनुभव और शाम की रंग-बिरंगी रोशनी में संगीतमय फव्वारा शो।'
    },
    deepHistory: {
      en: 'Prem Mandir crafted from 30,000 tons of Italian Carrara marble, inaugurated in 2012 by Jagadguru Kripalu Maharaj.',
      hi: '30,000 टन इटैलियन करारा संगमरमर से निर्मित।'
    },
    architecture: {
      en: 'Pure Italian Carrara marble with life-size tableaux of Krishna pastimes.',
      hi: 'करारा संगमरमर पर सजीव झांकियां।'
    },
    bestTime: { en: 'Evening 5:00 PM - 8:30 PM (Fountain show 7:30 PM)', hi: 'शाम 5:00 से 8:30 बजे (लाइट शो 7:30 बजे)' },
    timings: { en: 'Prem Mandir: 5:30 AM - 12:00 PM & 4:30 PM - 8:30 PM', hi: 'सुबह 5:30-12:00 व 4:30-8:30 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Spacious flat marble walkways, golf carts for seniors.', hi: 'समतल रास्ते, ई-रिक्शा और वरिष्ठ नागरिकों हेतु व्यवस्था।' },
    photographyTips: { en: 'Night lighting shifting colors across the marble facade.', hi: 'रात्रि में सतरंगी रोशनी में जगमगाता प्रेम मंदिर।' },
    safetyTips: { en: 'Expect heavy crowds on weekends and Ekadashi.', hi: 'सप्ताहांत और एकादशी पर भीड़ की संभावना।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1609137144822-0a15320c2429?w=800', title: { en: 'Prem Mandir Night Illumination', hi: 'प्रेम मंदिर की रात्रि लाइटिंग' } }
    ],
    tags: ['vrindavan', 'temple', 'prem mandir', 'bankey bihari', 'mathura']
  },

  // =================== PRAYAGRAJ GHATS & SANGAM ===================
  {
    id: 'triveni_sangam',
    name: 'Triveni Sangam & Kumbh Kshetra',
    hindiName: 'त्रिवेणी संगम एवं कुंभ क्षेत्र (प्रयागराज)',
    city: 'Prayagraj',
    hindiCity: 'प्रयागराज',
    category: 'ghat',
    categoryLabel: { en: 'Holy Confluence', hi: 'पवित्र महासंगम' },
    coordinates: [25.4265, 81.8848],
    description: {
      en: 'The sacred confluence of Ganga, Yamuna, and mystical Saraswati rivers, host to the world\'s largest human gathering—Maha Kumbh Mela.',
      hi: 'गंगा, यमुना और अदृश्य सरस्वती का पवित्र महासंगम तथा महाकुंभ का केंद्र।'
    },
    travelCause: {
      en: 'Holy Snan at the exact color-contrast junction where green Yamuna meets silted Ganga, feeding migratory seagulls, and visiting Akshayavat.',
      hi: 'संगम स्नान, साइबेरियन पक्षियों को दाना खिलाना और अक्षयवट व बड़े हनुमान जी के दर्शन।'
    },
    deepHistory: {
      en: 'Tirtharaj Prayag mentioned in Rigveda and Puranas as king of all pilgrimages.',
      hi: 'ऋग्वेद में वर्णित तीर्थराज प्रयाग।'
    },
    architecture: {
      en: 'Sprawling river delta, Akbar\'s Allahabad Fort, and floating boat platforms.',
      hi: 'अकबर का ऐतिहासिक किला और पक्के संगम घाट।'
    },
    bestTime: { en: 'Sunrise (6:00 AM - 8:30 AM) during winter for seagulls & calm water', hi: 'सुबह 6:00 से 8:30 बजे' },
    timings: { en: 'Open 24 hours. Boating from sunrise to sunset', hi: '24 घंटे खुला। नौकायन सूर्योदय से सूर्यास्त तक' },
    entryFee: { en: 'Free. Shared boat to Sangam: ₹100-200; Private boat: ₹800-1500', hi: 'निःशुल्क। नाव से संगम ₹100-200 प्रति व्यक्ति' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'E-rickshaws directly to Sangam boat nose; wooden boarding planks on boats.', hi: 'संगम तक ई-रिक्शा और नाव पर चढ़ने हेतु लकड़ी के रैंप।' },
    photographyTips: { en: 'Flocks of migratory Siberian seagulls soaring around wooden boats against the sunrise mist.', hi: 'सुबह के कोहरे में साइबेरियन पक्षियों और नावों के फोटो।' },
    safetyTips: { en: 'Board only registered boats with life vests; confirm return waiting time.', hi: 'केवल लाइफ जैकेट वाली पंजीकृत नावों का प्रयोग करें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800', title: { en: 'Triveni Sangam & Migratory Seagulls', hi: 'त्रिवेणी संगम व साइबेरियन पक्षी' } }
    ],
    tags: ['prayagraj', 'ghat', 'sangam', 'kumbh mela', 'ganga', 'yamuna']
  },

  // =================== AGRA MONUMENTS ===================
  {
    id: 'taj_mahal',
    name: 'Taj Mahal',
    hindiName: 'ताजमहल',
    city: 'Agra',
    hindiCity: 'आगरा',
    category: 'monument',
    categoryLabel: { en: 'Wonder of the World', hi: 'विश्व आश्चर्य' },
    coordinates: [27.1751, 78.0421],
    description: {
      en: 'UNESCO World Heritage Wonder of the World, ivory-white marble mausoleum on the Yamuna riverbank.',
      hi: 'यूनेस्को विश्व धरोहर और दुनिया के सात अजूबों में शुमार, यमुना तट पर श्वेत संगमरमर का अनुपम मकबरा।'
    },
    travelCause: {
      en: 'Marveling at the zenith of Mughal architectural symmetry, pietra dura gemstone marble inlay, and timeless beauty.',
      hi: 'मुगल वास्तुकला की पराकाष्ठा, अद्भुत पच्चीकारी और विश्वप्रसिद्ध सौंदर्य का साक्षात् दर्शन।'
    },
    deepHistory: {
      en: 'Commissioned by Shah Jahan in 1631 for Mumtaz Mahal; built by 20,000 artisans over 22 years.',
      hi: 'शाहजहां द्वारा मुमताज महल की स्मृति में 1631-1653 के मध्य निर्मित।'
    },
    architecture: {
      en: 'Flawless bilateral symmetry, central 73m dome, four minarets, and Persian Charbagh gardens.',
      hi: '73 मीटर ऊंचा मुख्य गुंबद, चार मीनारें और चारबाग शैली का बगीचा।'
    },
    bestTime: { en: 'Sunrise (6:00 AM) for soft pink light and minimal crowds', hi: 'सूर्योदय (सुबह 6:00 बजे)' },
    timings: { en: 'Sunrise to Sunset (Closed every Friday)', hi: 'सूर्योदय से सूर्यास्त तक (प्रत्येक शुक्रवार बंद)' },
    entryFee: { en: '₹50 for Indians (+₹200 main dome), ₹1100 for Foreigners', hi: 'भारतीय ₹50 (+₹200 मुख्य गुंबद), विदेशी ₹1100' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Electric golf carts from parking to gate; wheelchair ramps throughout.', hi: 'पार्किंग से गेट तक ई-कार्ट और पूरे परिसर में रैंप।' },
    photographyTips: { en: 'Reflections from central pool or view across Yamuna from Mehtab Bagh.', hi: 'तालाब में प्रतिबिंब और मेहताब बाग से सूर्यास्त का दृश्य।' },
    safetyTips: { en: 'Book tickets online via official ASI portal; avoid street touts outside gates.', hi: 'टिकट आधिकारिक ASI वेबसाइट से ही बुक करें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', title: { en: 'Taj Mahal Sunrise Reflection', hi: 'ताजमहल सूर्योदय' } }
    ],
    tags: ['agra', 'monument', 'taj mahal', 'unesco', 'wonder']
  },

  // =================== LUCKNOW HERITAGE ===================
  {
    id: 'bara_imambara',
    name: 'Bara Imambara & Rumi Darwaza',
    hindiName: 'बड़ा इमामबाड़ा एवं रूमी दरवाजा',
    city: 'Lucknow',
    hindiCity: 'लखनऊ',
    category: 'heritage',
    categoryLabel: { en: 'Nawabi Heritage', hi: 'नवाबी वास्तुकला' },
    coordinates: [26.8690, 80.9128],
    description: {
      en: 'The crown jewel of Lucknow with the world\'s largest unsupported arched hall, famous Bhool Bhulaiya labyrinth, and 60-ft Rumi Darwaza.',
      hi: 'बिना खंभे की छत वाला विशाल हॉल, विश्वप्रसिद्ध भूलभुलैया और 60 फीट ऊंचा रूमी दरवाजा।'
    },
    travelCause: {
      en: 'Navigating the intricate 489-doorway labyrinth of Bhool Bhulaiya with a guide, followed by authentic Awadhi culinary exploration in Chowk.',
      hi: 'रोमांचक भूलभुलैया का सफर और चौक में लखनवी कबाब व लस्सी का स्वाद।'
    },
    deepHistory: {
      en: 'Built in 1784 by Nawab Asaf-ud-Daula as a noble famine-relief project.',
      hi: '1784 में अकाल राहत कार्य के रूप में नवाब आसिफुद्दौला द्वारा निर्मित।'
    },
    architecture: {
      en: '50x16 meter arched vaulted hall without any pillar or iron girder.',
      hi: 'बिना किसी बीम या खंभे के 50x16 मीटर का विशाल मेहराबदार हॉल।'
    },
    bestTime: { en: '9:00 AM - 12:00 PM or 4:00 PM - 6:00 PM', hi: 'सुबह 9:00 से 12:00 या शाम 4:00 से 6:00 बजे' },
    timings: { en: '6:00 AM - 5:00 PM daily', hi: 'सुबह 6:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹50 for Indians, ₹500 for Foreigners', hi: 'भारतीय ₹50, विदेशी ₹500' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Main courtyards are flat; maze has narrow steep stairs.', hi: 'मुख्य प्रांगण समतल है; भूलभुलैया में संकरी सीढ़ियां हैं।' },
    photographyTips: { en: 'Majestic Rumi Darwaza framed against evening sky.', hi: 'रूमी दरवाजे की विशाल मेहराब की फोटोग्राफी।' },
    safetyTips: { en: 'Always explore Bhool Bhulaiya with an authorized guide.', hi: 'भूलभुलैया में अधिकृत गाइड के साथ ही जाएं।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800', title: { en: 'Rumi Darwaza & Asafi Mosque Facade', hi: 'रूमी दरवाजा' } }
    ],
    tags: ['lucknow', 'heritage', 'bara imambara', 'rumi darwaza', 'bhool bhulaiya']
  },

  // =================== CHITRAKOOT ===================
  {
    id: 'chitrakoot_ramghat',
    name: 'Chitrakoot Ramghat & Kamadgiri',
    hindiName: 'चित्रकूट रामघाट एवं कामदगिरि',
    city: 'Chitrakoot',
    hindiCity: 'चित्रकूट',
    category: 'ghat',
    categoryLabel: { en: 'Ramayana Forest Ghat', hi: 'रामायण तपोभूमि घाट' },
    coordinates: [25.1764, 80.8654],
    description: {
      en: 'The peaceful river ghat on Mandakini where Lord Rama, Sita, and Lakshmana lived during exile. Famous for Kamadgiri Parikrama and Gupt Godavari caves.',
      hi: 'मंदाकिनी नदी पर स्थित पावन घाट जहां भगवान राम, सीता और लक्ष्मण ने वनवास का समय बिताया।'
    },
    travelCause: {
      en: 'Peaceful boat rides on Mandakini River, Kamadgiri Parikrama, and natural spring caves at Gupt Godavari.',
      hi: 'मंदाकिनी में नौकायन, कामदगिरि परिक्रमा और गुप्त गोदावरी की प्राकृतिक गुफाएं।'
    },
    deepHistory: {
      en: 'Saint Tulsidas experienced the divine darshan of Lord Ram and Lakshman while making sandalwood paste here.',
      hi: 'यहीं रामघाट पर गोस्वामी तुलसीदास जी को भगवान राम के दर्शन हुए थे।'
    },
    architecture: {
      en: 'Serene stone river steps surrounded by Vindhya forest hills.',
      hi: 'विंध्य पर्वतमाला के बीच पावन मंदाकिनी के घाट।'
    },
    bestTime: { en: 'July to March', hi: 'जुलाई से मार्च' },
    timings: { en: 'Open 24 hours', hi: '24 घंटे खुला' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Easy road access to Ramghat.', hi: 'रामघाट तक आसान पहुंच।' },
    photographyTips: { en: 'Evening Mandakini Maha Aarti reflecting in the tranquil waters.', hi: 'मंदाकिनी के शांत जल में सांध्य आरती का दृश्य।' },
    safetyTips: { en: 'Wear non-slip footwear when entering Gupt Godavari caves.', hi: 'गुफाओं में पानी वाले पत्थरों पर संभलकर चलें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', title: { en: 'Ramghat on Mandakini River', hi: 'रामघाट चित्रकूट' } }
    ],
    tags: ['chitrakoot', 'ghat', 'ramghat', 'kamadgiri', 'ramayana']
  },

  // =================== BUDDHIST CIRCUIT ===================
  {
    id: 'sarnath_dhamek',
    name: 'Sarnath (Dhamek Stupa & Deer Park)',
    hindiName: 'सारनाथ (धमेक स्तूप एवं मृगदाव)',
    city: 'Varanasi',
    hindiCity: 'वाराणसी',
    category: 'buddhist',
    categoryLabel: { en: 'First Sermon Sacred Site', hi: 'प्रथम उपदेश पावन धाम' },
    coordinates: [25.3811, 83.0214],
    description: {
      en: 'The sacred deer park where Gautama Buddha delivered his first sermon (Dharmachakra Pravartana) after enlightenment.',
      hi: 'वह पावन स्थल जहां भगवान बुद्ध ने ज्ञान प्राप्ति के बाद प्रथम उपदेश (धर्मचक्र प्रवर्तन) दिया।'
    },
    travelCause: {
      en: 'One of the four holiest Buddhist pilgrimages worldwide, home to the 143-foot Dhamek Stupa, Ashoka Pillar, and ancient monasteries.',
      hi: 'विश्व के चार प्रमुख बौद्ध तीर्थों में से एक, 143 फीट ऊंचा धमेक स्तूप और अशोक की सिंह लाट।'
    },
    deepHistory: {
      en: 'Emperor Ashoka erected the Lion Capital here in 249 BCE, which became the National Emblem of India.',
      hi: 'मौर्य सम्राट अशोक द्वारा 249 ईसा पूर्व में स्थापित; भारत का राष्ट्रीय प्रतीक यहीं से लिया गया।'
    },
    architecture: {
      en: 'Massive cylindrical solid brick and stone stupa with Gupta-era geometric carvings.',
      hi: 'गुप्तकालीन नक्काशी से सुसज्जित विशाल बेलनाकार स्तूप।'
    },
    bestTime: { en: 'October to March; 8:00 AM - 11:00 AM', hi: 'अक्टूबर से मार्च; सुबह 8:00 से 11:00 बजे' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय ₹25, विदेशी ₹300' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Completely wheelchair friendly with paved flat lawns.', hi: 'समतल रास्ते, लॉन और पूर्णतः व्हीलचेयर अनुकूल।' },
    photographyTips: { en: 'Dhamek Stupa framed by ancient monastery ruins in morning sun.', hi: 'प्राचीन बौद्ध विहारों के बीच धमेक स्तूप का फोटो।' },
    safetyTips: { en: 'Hire certified ASI guides with badges.', hi: 'केवल अधिकृत ASI गाइड ही चुनें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1609137144822-0a15320c2429?w=800', title: { en: 'Dhamek Stupa at Sarnath', hi: 'धमेक स्तूप सारनाथ' } }
    ],
    tags: ['sarnath', 'buddhist', 'dhamek stupa', 'varanasi', 'buddha']
  },
  {
    id: 'kushinagar_parinirvana',
    name: 'Kushinagar (Mahaparinirvana Temple)',
    hindiName: 'कुशीनगर (महापरिनिर्वाण मंदिर एवं स्तूप)',
    city: 'Kushinagar',
    hindiCity: 'कुशीनगर',
    category: 'buddhist',
    categoryLabel: { en: 'Buddha Parinirvana Site', hi: 'महापरिनिर्वाण धाम' },
    coordinates: [26.7397, 83.8893],
    description: {
      en: 'The supreme Buddhist pilgrimage site where Lord Buddha entered Mahaparinirvana in 483 BCE, housing a 6.1m monolithic reclining Buddha statue.',
      hi: 'परम पावन बौद्ध तीर्थ जहां भगवान बुद्ध ने महापरिनिर्वाण प्राप्त किया; 6.1 मीटर लंबी शयन मुद्रा की दुर्लभ प्रतिमा।'
    },
    travelCause: {
      en: 'Paying homage at the final resting place of Lord Buddha and viewing the 5th-century red sandstone monolithic reclining statue.',
      hi: 'भगवान बुद्ध की अंतिम विश्राम स्थली पर नमन और 5वीं शताब्दी की अलौकिक शयन प्रतिमा के दर्शन।'
    },
    deepHistory: {
      en: 'Excavated in 1876; Ramabhar Stupa marks Buddha\'s cremation site.',
      hi: '1876 में कनिंघम द्वारा उत्खनित; रामाभार स्तूप पर अंतिम संस्कार हुआ।'
    },
    architecture: {
      en: 'White dome temple surrounded by meditative stupas and green Sal tree gardens.',
      hi: 'शांत धवल मंदिर और साल वृक्षों के बगीचे।'
    },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Step-free garden paths, ramps, accessible for seniors.', hi: 'सीढ़ी-मुक्त उद्यान, रैंप सुविधा।' },
    photographyTips: { en: 'Gentle lighting on the serene reclining Buddha statue.', hi: 'भगवान बुद्ध की शांत मुद्रा का फोटो।' },
    safetyTips: { en: 'Maintain silence inside the stupa hall.', hi: 'परिसर में शांति बनाए रखें।' },
    images: [
      { url: 'https://images.unsplash.com/photo-1609137144822-0a15320c2429?w=800', title: { en: 'Mahaparinirvana Temple Kushinagar', hi: 'महापरिनिर्वाण मंदिर' } }
    ],
    tags: ['kushinagar', 'buddhist', 'buddha', 'parinirvana']
  }
];

// REAL-TIME CROWD STATUS & TRAVEL FEASIBILITY ("Jane layak hai ya nahi")
export const UP_CROWD_ADVISORIES: Record<string, UPCityCrowdAdvisory> = {
  ayodhya: {
    cityId: 'ayodhya',
    cityName: { en: 'Ayodhya Dham', hi: 'अयोध्या धाम' },
    currentCrowdLevel: 'high',
    crowdBadge: { en: '🟡 High Devotee Footfall (1.5 - 2 Lakh daily)', hi: '🟡 मध्यम-उच्च भीड़ (1.5 - 2 लाख प्रतिदिन)' },
    travelFeasibility: 'good_to_visit',
    feasibilityVerdict: {
      en: '✅ Recommended to Visit with Planning: Darshan is very smooth and well-managed through organized queuing, but pre-book your Aarti pass online.',
      hi: '✅ जाने योग्य है (उचित योजना के साथ): राम मंदिर में दर्शन व्यवस्था अत्यंत सुव्यवस्थित है, पर आरती पास पहले से ऑनलाइन बुक कर लें।'
    },
    detailedStatus: {
      en: 'Average waiting time in normal lines is 45 to 75 minutes. Weekends (Saturday & Sunday) witness 30% higher rush. Lockers, drinking water, and golf carts are operating seamlessly.',
      hi: 'सामान्य कतार में दर्शन का समय 45 से 75 मिनट है। शनिवार और रविवार को भीड़ 30% अधिक रहती है। लॉकर और ई-कार्ट सुविधा सुचारू है।'
    },
    bestVisitingSlots: {
      en: 'Early morning (6:30 AM - 9:00 AM) or Afternoon (2:00 PM - 4:30 PM). Tuesdays & Weekends are busiest.',
      hi: 'सुबह 6:30 से 9:00 बजे अथवा दोपहर 2:00 से 4:30 बजे। मंगलवार व सप्ताहांत सबसे व्यस्त रहते हैं।'
    },
    howToReach: {
      en: 'Ayodhya Maharishi Valmiki International Airport (AYJ) has direct flights from Delhi, Mumbai, Ahmedabad, Bengaluru. Vande Bharat Express connects from Delhi & Lucknow. 4-lane Highway from Lucknow (2.5 hrs).',
      hi: 'महर्षि वाल्मीकि इंटरनेशनल एयरपोर्ट (AYJ) से सीधी उड़ानें। वंदे भारत एक्सप्रेस और लखनऊ-अयोध्या 4-लेन हाईवे (2.5 घंटे)।'
    },
    latestHappening: {
      en: 'Ram Darbar on first floor is now open for darshan. Free online passes available on srjbtkshetra.org.',
      hi: 'प्रथम तल पर राम दरबार के दर्शन प्रारंभ हो चुके हैं। srjbtkshetra.org पर निःशुल्क पास उपलब्ध।'
    }
  },
  varanasi: {
    cityId: 'varanasi',
    cityName: { en: 'Varanasi / Kashi', hi: 'वाराणसी / काशी' },
    currentCrowdLevel: 'high',
    crowdBadge: { en: '🟡 Heavy Devotee Footfall (Especially Mondays & Evenings)', hi: '🟡 उच्च भीड़ (सोमवार व सांध्य आरती पर)' },
    travelFeasibility: 'good_to_visit',
    feasibilityVerdict: {
      en: '✅ Highly Recommended: Excellent weather and grand river vistas. Book Sugam Darshan (₹300) on Mondays to avoid waiting.',
      hi: '✅ पूरी तरह जाने योग्य: मौसम उत्तम है, गंगा आरती व विश्वनाथ धाम के दर्शन हेतु सर्वोत्तम समय। सोमवार को सुगम दर्शन बुक करें।'
    },
    detailedStatus: {
      en: 'Kashi Vishwanath Corridor accommodates crowds easily; waiting time ~30-45 mins. Dashashwamedh Aarti gets full by 5:45 PM. Namo Ghat is spacious and uncrowded.',
      hi: 'काशी विश्वनाथ कॉरिडोर में 30-45 मिनट लगते हैं। दशाश्वमेध आरती हेतु 5:45 बजे पहुंचना उचित है। नमो घाट पर भीड़ कम और खुला स्थान है।'
    },
    bestVisitingSlots: {
      en: 'Mangala Aarti (3:00 AM) or 7:00 AM - 10:00 AM. Avoid Godowlia Chowk in private cars (pedestrian zone).',
      hi: 'प्रातः 7:00 से 10:00 बजे। गोदौलिया चौक में पैदल या ई-रिक्शा से जाएं।'
    },
    howToReach: {
      en: 'Lal Bahadur Shastri Airport (VNS) has pan-India connectivity. Vande Bharat Express runs from Delhi & Patna. Varanasi Cantt & Banaras Railway Stations connect all major lines.',
      hi: 'लाल बहादुर शास्त्री एयरपोर्ट (बाबतपुर), दिल्ली-वाराणसी वंदे भारत और कैंट रेलवे स्टेशन।'
    },
    latestHappening: {
      en: 'Urban Public Ropeway testing underway from Cantt Station to Godowlia. Electric solar catamarans active on ghats.',
      hi: 'कैंट स्टेशन से गोदौलिया तक अर्बन रोपवे का काम और गंगा में नए सोलर क्रूज संचालित।'
    }
  },
  mathura_vrindavan: {
    cityId: 'mathura_vrindavan',
    cityName: { en: 'Mathura & Vrindavan (Braj)', hi: 'मथुरा एवं वृंदावन' },
    currentCrowdLevel: 'extreme',
    crowdBadge: { en: '🔴 Very Heavy Crowd / Festival Rush (Bankey Bihari)', hi: '🔴 अत्यधिक भीड़ (बांके बिहारी व वीकेंड्स)' },
    travelFeasibility: 'plan_with_caution',
    feasibilityVerdict: {
      en: '⚠️ Plan with Caution on Weekends: Bankey Bihari gallis experience heavy congestion on Saturdays, Sundays & Ekadashis. Visit on weekdays (Tue-Thu) for peaceful darshan.',
      hi: '⚠️ सप्ताहांत पर सावधानी से जाएं: बांके बिहारी की गलियों में भारी भीड़ रहती है। मंगलवार से गुरुवार के बीच जाना सबसे सुखद रहेगा।'
    },
    detailedStatus: {
      en: 'Bankey Bihari temple line wait time is 1 to 2 hours on weekends. Prem Mandir is vast and accommodates crowds comfortably. Strict one-way pedestrian routes in Vrindavan.',
      hi: 'बांके बिहारी में सप्ताहांत 1-2 घंटे लग सकते हैं। प्रेम मंदिर खुला व सुगम है। वन-वे पैदल मार्ग लागू है।'
    },
    bestVisitingSlots: {
      en: 'Prem Mandir at 5:00 PM - 8:00 PM for light show. Krishna Janmabhoomi Mathura at 6:30 AM (very peaceful).',
      hi: 'प्रेम मंदिर शाम 5:00 से 8:00 बजे लाइटिंग शो हेतु। मथुरा जन्मभूमि सुबह 6:30 बजे अत्यंत शांत रहती है।'
    },
    howToReach: {
      en: 'Yamuna Expressway from Delhi/Noida (2.5 hrs). Mathura Junction is a major railway hub on Delhi-Mumbai line. Nearest airports: Agra (AGR, 55 km) and Delhi (DEL, 150 km).',
      hi: 'यमुना एक्सप्रेसवे से 2.5 घंटे (दिल्ली/नोएडा)। मथुरा जंक्शन प्रमुख रेलवे स्टेशन।'
    },
    latestHappening: {
      en: 'Braj Holi festival schedules announced with heavy security squads deployed for pilgrim assistance.',
      hi: 'ब्रज होली महोत्सव के विशेष प्रबंध और महिला सुरक्षा दल तैनात।'
    }
  },
  prayagraj: {
    cityId: 'prayagraj',
    cityName: { en: 'Prayagraj (Sangam)', hi: 'प्रयागराज (संगम)' },
    currentCrowdLevel: 'moderate',
    crowdBadge: { en: '🟢 Smooth & Welcoming (Maha Kumbh / Magh Mela)', hi: '🟢 सुव्यवस्थित एवं अनुकूल (माघ मेला / संगम)' },
    travelFeasibility: 'highly_recommended',
    feasibilityVerdict: {
      en: '✅ Highly Recommended to Visit: Ideal weather, clean riverbanks, and pleasant boating experience with migratory seagulls.',
      hi: '✅ अवश्य जाने योग्य: मौसम अत्यंत सुहावना है, संगम तट स्वच्छ है और साइबेरियन पक्षियों का अद्भुत नजारा है।'
    },
    detailedStatus: {
      en: 'Boat operations running smoothly at official rates (₹100-200 shared). Dedicated parking near Arail and Sangam nose with free e-bus shuttles.',
      hi: 'नाव संचालन सुचारू है, अरैल और संगम नोज पर पर्याप्त पार्किंग व शटल बसें उपलब्ध हैं।'
    },
    bestVisitingSlots: {
      en: 'Early morning (6:00 AM - 9:00 AM) for holy bath and feeding Siberian birds.',
      hi: 'सुबह 6:00 से 9:00 बजे संगम स्नान व पक्षियों के दर्शन हेतु।'
    },
    howToReach: {
      en: 'Prayagraj Airport (IXD) connects Delhi, Mumbai, Bengaluru. Prayagraj Junction (PRYJ) is on the main Delhi-Howrah route. Vande Bharat from Delhi & Varanasi.',
      hi: 'प्रयागराज एयरपोर्ट (IXD), प्रयागराज जंक्शन और वाराणसी-प्रयागराज हाईवे।'
    },
    latestHappening: {
      en: 'Luxury tent city and 24x7 control room helpline (1920) active.',
      hi: 'लक्जरी टेंट सिटी और 24x7 संगम हेल्पलाइन 1920 सक्रिय।'
    }
  },
  agra: {
    cityId: 'agra',
    cityName: { en: 'Agra (Taj Mahal & Fort)', hi: 'आगरा (ताजमहल व किला)' },
    currentCrowdLevel: 'moderate',
    crowdBadge: { en: '🟢 Normal to Moderate Tourist Flow', hi: '🟢 सामान्य एवं सुगम पर्यटक प्रवाह' },
    travelFeasibility: 'highly_recommended',
    feasibilityVerdict: {
      en: '✅ Highly Recommended: Excellent season for Taj Mahal. Enter at 6:00 AM sunrise gate for magical light and minimal lines.',
      hi: '✅ जाने हेतु सर्वोत्तम: सुबह 6:00 बजे सूर्योदय के समय प्रवेश करने पर बिना भीड़ के अद्भुत दर्शन और फोटोग्राफी होती है।'
    },
    detailedStatus: {
      en: 'Online ticketing via asi.payumoney.com has eliminated ticket counter lines. Electric golf carts operate seamlessly between parking and entrance gates.',
      hi: 'ऑनलाइन टिकट से कतारों की जरूरत नहीं। पार्किंग से गेट तक ई-कार्ट उपलब्ध।'
    },
    bestVisitingSlots: {
      en: 'Sunrise 6:00 AM - 8:30 AM or Sunset at Mehtab Bagh across Yamuna. Remember Taj is closed on Fridays!',
      hi: 'सुबह 6:00 से 8:30 बजे अथवा सूर्यास्त पर मेहताब बाग। शुक्रवार को ताजमहल बंद रहता है।'
    },
    howToReach: {
      en: 'Yamuna Expressway from Delhi/Noida (2 hrs), Taj Express & Gatimaan Express (1 hr 40 mins from Delhi Hazrat Nizamuddin), Agra Cantt Railway Station.',
      hi: 'गतिमान एक्सप्रेस (1 घंटा 40 मिनट), यमुना एक्सप्रेसवे और आगरा कैंट स्टेशन।'
    },
    latestHappening: {
      en: 'Night viewing slots active on 5 full-moon nights per month. Taj Mahotsav cultural events in full swing.',
      hi: 'पूर्णिमा के दिनों में रात्रि दर्शन की विशेष व्यवस्था और ताज महोत्सव।'
    }
  }
};

// NEWS EVENTS
export const UP_NEWS_UPDATES: UPNewsEvent[] = [
  {
    id: 'news-1',
    title: {
      en: 'Maha Kumbh & Magh Mela: Modern Tent City & AI Crowd Flow Control',
      hi: 'महाकुंभ एवं माघ मेला: आधुनिक टेंट सिटी व एआई क्राउड फ्लो कंट्रोल'
    },
    category: 'festival',
    date: 'Live Updates',
    city: 'Prayagraj',
    summary: {
      en: 'UP Tourism has deployed 25 luxury riverfront tent cities, free electric shuttle buses, and 24x7 pilgrim assistance helpline (1920).',
      hi: 'प्रयागराज में 25 लक्जरी टेंट सिटी, मुफ्त इलेक्ट्रिक शटल बस सेवा और 1920 हेल्पलाइन सक्रिय।'
    },
    details: {
      en: 'Dedicated bathing ghats with zero-discharge eco-sanitation and digital lockers operational for all pilgrims.',
      hi: 'शून्य-उत्सर्जन ईको-घाट, डिजिटल लॉकर और सुरक्षित स्नान व्यवस्था।'
    }
  },
  {
    id: 'news-2',
    title: {
      en: 'Ayodhya Ram Mandir: Online Aarti Pass System on srjbtkshetra.org',
      hi: 'अयोध्या राम मंदिर: ऑनलाइन आरती पास प्रणाली व प्रथम तल दर्शन'
    },
    category: 'darshan_update',
    date: 'Live Updates',
    city: 'Ayodhya',
    summary: {
      en: 'Shri Ram Janmabhoomi Teerth Kshetra has enabled free biometric online booking for Mangala, Shringar, and Shayan Aarti passes.',
      hi: 'ट्रस्ट द्वारा मंगला, शृंगार और शयन आरती हेतु निःशुल्क ऑनलाइन पास बुकिंग लाइव।'
    },
    details: {
      en: 'First floor Ram Darbar viewing is open. Devotees are advised to store phones at free Pilgrim Facilitation Centre (PFC) lockers.',
      hi: 'राम दरबार के दर्शन खुले हैं; फोन और स्मार्टवॉच निशुल्क लॉकर में जमा करें।'
    }
  },
  {
    id: 'news-3',
    title: {
      en: 'Kashi Vishwanath: Urban Public Ropeway & Electric Catamarans',
      hi: 'काशी विश्वनाथ: अर्बन पब्लिक रोपवे व इलेक्ट्रिक क्रूज संचालन'
    },
    category: 'infrastructure',
    date: 'Active',
    city: 'Varanasi',
    summary: {
      en: 'Varanasi Cantt Station to Godowlia ropeway reduces transit time to just 15 minutes. Solar boats connect Namo Ghat to Assi Ghat.',
      hi: 'कैंट स्टेशन से गोदौलिया तक 15 मिनट में रोपवे यात्रा और गंगा में सोलर क्रूज सुविधा।'
    },
    details: {
      en: 'Eco-friendly river transit enables peaceful sightseeing with onboard historical audio narration.',
      hi: 'प्रदूषण-मुक्त जल परिवहन और ऑडियो गाइड सुविधा।'
    }
  },
  {
    id: 'news-4',
    title: {
      en: 'Braj Holi & Bankey Bihari Darshan Timings Update',
      hi: 'ब्रज होली महोत्सव व बांके बिहारी दर्शन समय अपडेट'
    },
    category: 'festival',
    date: 'Festival Season',
    city: 'Mathura & Vrindavan',
    summary: {
      en: 'World-famous 10-day Braj Holi circuit with Barsana Lathmar, Nandgaon Laddu Holi, and Bankey Bihari Phoolon Ki Holi.',
      hi: 'बरसाना लठमार होली, नंदगांव की लड्डू होली और बांके बिहारी फूलों की होली की विशेष व्यवस्था।'
    },
    details: {
      en: 'Special AC electric buses connect Delhi/Agra to Vrindavan. Tourist police assistance desks deployed at key intersections.',
      hi: 'दिल्ली-आगरा से विशेष एसी बसें और चौराहों पर पुलिस सहायता केंद्र।'
    }
  }
];

// COMMON SCAM ADVISORIES
export const UP_SCAM_ADVISORIES: UPScamAdvisory[] = [
  {
    id: 'boat_overcharging_varanasi',
    type: { en: 'Boat Overcharging & Street Touts', hi: 'नाव का अधिक किराया व दलाली' },
    city: 'Varanasi & Ayodhya',
    description: {
      en: 'Touts in alleyways quoting 5x to 10x higher boat prices or claiming ghats are closed.',
      hi: 'गलियों में खड़े बिचौलिए पर्यटकों से 5 से 10 गुना अधिक किराया वसूलने का प्रयास करते हैं।'
    },
    warningSigns: {
      en: ['Quotes ₹2,000 - ₹5,000 for simple rowboat', 'Claims ghats are closed unless you take private boat'],
      hi: ['साधारण नाव के 2000-5000 रुपये मांगना', 'यह कहना कि आगे घाट बंद है']
    },
    preventionTips: {
      en: ['Walk directly to riverbank stairs to negotiate with boatmen', 'Standard rates: ₹100-250 shared, ₹1000-2000 private'],
      hi: ['सीधे घाट किनारे जाकर बात करें', 'साधारण नाव ₹100-250 प्रति व्यक्ति; निजी नाव ₹1000-2000']
    },
    emergencyNumber: '112 / Tourist Police: 0542-2200441'
  },
  {
    id: 'fake_vip_darshan_agents',
    type: { en: 'Fake VIP Darshan & Line Jumping', hi: 'फर्जी वीआईपी दर्शन दलाल' },
    city: 'Ayodhya, Varanasi, Mathura',
    description: {
      en: 'Unauthorized touts claiming instant sanctum entry for cash.',
      hi: 'मंदिर के बाहर बिना लाइन वीआईपी दर्शन का झूठा दावा करने वाले व्यक्ति।'
    },
    warningSigns: {
      en: ['Demands cash without official trust receipts', 'Tries to take you through private back alleys'],
      hi: ['बिना रसीद नकद रुपये मांगना', 'निजी संकरी गलियों से ले जाना']
    },
    preventionTips: {
      en: ['Only use official trust counters (srjbtkshetra.org, shrikashivishwanath.org)', 'Ask police desks for elder/wheelchair fast-track'],
      hi: ['केवल आधिकारिक ट्रस्ट काउंटर का प्रयोग करें', 'बुजुर्गों हेतु पुलिस सहायता केंद्र से संपर्क करें']
    },
    emergencyNumber: '112 / UP Tourism Toll-Free: 1800-180-5013'
  }
];

// RECOMMENDED TRAVEL ROUTES
export const UP_TRAVEL_ROUTES: UPRoute[] = [
  {
    id: 'ramayana_heritage_circuit',
    name: { en: 'Sacred Ramayana & Kashi Circuit (Ayodhya - Varanasi - Prayagraj)', hi: 'रामायण एवं काशी तीर्थ सर्किट (अयोध्या - वाराणसी - प्रयागराज)' },
    description: {
      en: 'The holiest journey connecting Shri Ram\'s birthplace in Ayodhya, the Moksha city of Kashi, and the holy confluence at Prayagraj.',
      hi: 'प्रभु श्री राम की जन्मभूमि अयोध्या, मोक्षदायिनी काशी और तीर्थराज प्रयागराज को जोड़ने वाला पवित्रतम मार्ग।'
    },
    cities: ['Ayodhya', 'Varanasi', 'Prayagraj', 'Chitrakoot'],
    waypoints: [
      [26.7956, 82.1943], // Ayodhya Ram Mandir
      [26.8041, 82.2039], // Saryu Ghat Ram Ki Paidi
      [26.7820, 82.1380], // Guptar Ghat
      [25.3109, 83.0107], // Kashi Vishwanath
      [25.3076, 83.0103], // Dashashwamedh Ghat
      [25.2885, 83.0064], // Assi Ghat
      [25.3811, 83.0214], // Sarnath
      [25.4265, 81.8848], // Triveni Sangam Prayagraj
      [25.1764, 80.8654]  // Chitrakoot Ramghat
    ],
    distanceKm: 420,
    recommendedDays: 4
  },
  {
    id: 'braj_mughal_triangle',
    name: { en: 'Braj & Mughal Heritage Circuit (Agra - Mathura - Vrindavan - Fatehpur Sikri)', hi: 'ब्रज एवं मुगल विरासत सर्किट (आगरा - मथुरा - वृंदावन - फतेहपुर सीकरी)' },
    description: {
      en: 'World wonder Taj Mahal paired with the divine Krishna temples and Yamuna ghats of Mathura and Vrindavan.',
      hi: 'ताजमहल की विश्वप्रसिद्ध भव्यता से लेकर मथुरा-वृंदावन के दिव्य कृष्ण मंदिरों व यमुना घाटों तक का सफर।'
    },
    cities: ['Agra', 'Fatehpur Sikri', 'Mathura', 'Vrindavan'],
    waypoints: [
      [27.1751, 78.0421], // Taj Mahal
      [27.1795, 78.0211], // Agra Fort
      [27.0945, 77.6679], // Fatehpur Sikri
      [27.5055, 77.6698], // Krishna Janmabhoomi Mathura
      [27.5028, 77.6833], // Vishram Ghat Mathura
      [27.5714, 77.6742], // Prem Mandir Vrindavan
      [27.5855, 77.7058]  // Keshi Ghat Vrindavan
    ],
    distanceKm: 160,
    recommendedDays: 3
  },
  {
    id: 'nawabi_buddhist_corridor',
    name: { en: 'Awadh & Buddhist Enlightenment Route (Lucknow - Sarnath - Kushinagar)', hi: 'अवध एवं बौद्ध ज्ञान मार्ग (लखनऊ - सारनाथ - कुशीनगर)' },
    description: {
      en: 'Refined Nawabi architectural splendor in Lucknow with profound Buddhist peace across Sarnath and Kushinagar.',
      hi: 'लखनऊ की नवाबी वास्तुकla के साथ सारनाथ और कुशीनगर की बौद्ध आध्यात्मिक शांति।'
    },
    cities: ['Lucknow', 'Ayodhya', 'Sarnath', 'Kushinagar'],
    waypoints: [
      [26.8690, 80.9128], // Bara Imambara Lucknow
      [26.7956, 82.1943], // Ayodhya Ram Mandir
      [25.3811, 83.0214], // Sarnath Dhamek
      [26.7397, 83.8893]  // Kushinagar Parinirvana
    ],
    distanceKm: 480,
    recommendedDays: 4
  }
];

// Combined full UP database
export const UP_PLACES: UPPlace[] = [
  ...BASE_UP_PLACES,
  ...COMPREHENSIVE_UP_PLACES.filter(cp => !BASE_UP_PLACES.some(bp => bp.id === cp.id))
];

// HELPERS
export function getAllUPPlaces(): UPPlace[] {
  return UP_PLACES;
}

export function getAllUPGhats(): UPPlace[] {
  return UP_PLACES.filter(p => p.category === 'ghat');
}

export function getUPPlaceById(id: string): UPPlace | undefined {
  return UP_PLACES.find(p => p.id === id || p.tags.includes(id.toLowerCase()));
}

export function getCrowdAdvisoryByCity(cityNameOrQuery: string): UPCityCrowdAdvisory | undefined {
  const q = cityNameOrQuery.toLowerCase().trim();
  if (q.includes('ayodhya') || q.includes('ram mandir') || q.includes('अयोध्या')) return UP_CROWD_ADVISORIES.ayodhya;
  if (q.includes('varanasi') || q.includes('kashi') || q.includes('banaras') || q.includes('काशी') || q.includes('बनारस') || q.includes('वाराणसी')) return UP_CROWD_ADVISORIES.varanasi;
  if (q.includes('mathura') || q.includes('vrindavan') || q.includes('bankey bihari') || q.includes('मथुरा') || q.includes('वृंदावन') || q.includes('braj') || q.includes('ब्रज')) return UP_CROWD_ADVISORIES.mathura_vrindavan;
  if (q.includes('prayagraj') || q.includes('sangam') || q.includes('kumbh') || q.includes('mela') || q.includes('प्रयागराज') || q.includes('संगम') || q.includes('allahabad')) return UP_CROWD_ADVISORIES.prayagraj;
  if (q.includes('agra') || q.includes('taj') || q.includes('आगरा') || q.includes('ताज')) return UP_CROWD_ADVISORIES.agra;
  return undefined;
}

export function searchUPPlaces(query: string): UPPlace[] {
  const q = query.toLowerCase().trim();
  if (!q) return UP_PLACES;

  // Special keyword: "ghat" / "ghats" / "घाट" -> return ALL ghats across UP!
  if (q === 'ghat' || q === 'ghats' || q.includes('all ghat') || q.includes('saare ghat') || q.includes('घाट') || q === 'ghat map') {
    return getAllUPGhats();
  }

  // Split query into significant tokens
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'in', 'and', 'or', 'to', 'for', 'about', 'me', 'tell', 'show', 'photo', 'photos', 'images', 'image', 'picture', 'pictures', 'bataiye', 'dikhao', 'dekhein', 'kya', 'hai', 'ka', 'ke', 'ki', 'ko', 'se', 'kripya', 'kitni', 'bheed', 'jane', 'layak']);
  const tokens = q
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !stopWords.has(t));

  return UP_PLACES.filter(p => {
    const pName = p.name.toLowerCase();
    const pHindi = p.hindiName;
    const pCity = p.city.toLowerCase();
    const pHindiCity = p.hindiCity;
    const pCategory = p.category.toLowerCase();

    // 1. Direct city or place match
    if (q.includes(pCity) || q.includes(pHindiCity)) return true;
    if (q.includes(pName) || pName.includes(q) || q.includes(pHindi) || pHindi.includes(q)) return true;
    if (p.tags.some(tag => q.includes(tag))) return true;

    // 2. Token match
    const matchCount = tokens.filter(token => 
      pName.includes(token) || 
      pCity.includes(token) || 
      pHindi.includes(token) || 
      pHindiCity.includes(token) ||
      pCategory.includes(token) ||
      p.tags.some(tag => tag.includes(token) || token.includes(tag))
    ).length;

    return matchCount > 0;
  });
}

export function getUPNews(): UPNewsEvent[] {
  return UP_NEWS_UPDATES;
}

export function getUPScams(): UPScamAdvisory[] {
  return UP_SCAM_ADVISORIES;
}

export function getUPRoutes(): UPRoute[] {
  return UP_TRAVEL_ROUTES;
}
