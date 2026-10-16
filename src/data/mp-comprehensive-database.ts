// Comprehensive Geo-Registry & Tourism Database for Madhya Pradesh
// Covers Chambal, Gwalior, Bundelkhand (Orchha, Datia), Malwa (Chanderi, Ujjain, Mandu),
// Central MP (Bhopal, Sanchi, Bhimbetka), Mahakoshal (Jabalpur/Bhedaghat), and Khajuraho.

export interface MPPlace {
  id: string;
  name: string;
  hindiName: string;
  city: string;
  hindiCity: string;
  category: 'temple' | 'heritage' | 'ghat' | 'buddhist' | 'food' | 'nature' | 'monument' | 'waterfall' | 'craft';
  categoryLabel: { en: string; hi: string };
  coordinates: [number, number]; // [lat, lng]
  description: { en: string; hi: string };
  travelCause: { en: string; hi: string };
  deepHistory: { en: string; hi: string };
  architecture: { en: string; hi: string };
  bestTime: { en: string; hi: string };
  timings: { en: string; hi: string };
  entryFee: { en: string; hi: string };
  accessibilityRating: number;
  accessibilityNotes: { en: string; hi: string };
  photographyTips: { en: string; hi: string };
  safetyTips: { en: string; hi: string };
  images: { url: string; title: { en: string; hi: string }; caption?: string }[];
  tags: string[];
}

export interface MPRoute {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  cities: string[];
  waypoints: [number, number][];
  distanceKm: number;
  recommendedDays: number;
}

// Coordinates registry for major MP tourist hubs for dynamic routing
export const MP_CITY_COORDINATES: Record<string, { name: string; hindi: string; coords: [number, number] }> = {
  gwalior: { name: 'Gwalior', hindi: 'ग्वालियर', coords: [26.2183, 78.1828] },
  morena: { name: 'Morena', hindi: 'मुरैना', coords: [26.4948, 77.9944] },
  orchha: { name: 'Orchha', hindi: 'ओरछा', coords: [25.3508, 78.6436] },
  datia: { name: 'Datia', hindi: 'दतिया', coords: [25.6653, 78.4609] },
  chanderi: { name: 'Chanderi', hindi: 'चंदेरी', coords: [24.7170, 78.1180] },
  khajuraho: { name: 'Khajuraho', hindi: 'खजुराहो', coords: [24.8530, 79.9197] },
  sanchi: { name: 'Sanchi', hindi: 'सांची', coords: [23.4873, 77.7394] },
  bhopal: { name: 'Bhopal', hindi: 'भोपाल', coords: [23.2599, 77.4126] },
  ujjain: { name: 'Ujjain', hindi: 'उज्जैन', coords: [23.1765, 75.7885] },
  indore: { name: 'Indore', hindi: 'इंदौर', coords: [22.7196, 75.8577] },
  jabalpur: { name: 'Jabalpur', hindi: 'जबलपुर', coords: [23.1815, 79.9864] },
  mandu: { name: 'Mandu', hindi: 'मांडू', coords: [22.3664, 75.3912] },
  pachmarhi: { name: 'Pachmarhi', hindi: 'पचमढ़ी', coords: [22.4674, 78.4346] },
  shivpuri: { name: 'Shivpuri', hindi: 'शिवपुरी', coords: [25.4243, 77.6598] },
  maheshwar: { name: 'Maheshwar', hindi: 'महेश्वर', coords: [22.1768, 75.5843] },
  omkareshwar: { name: 'Omkareshwar', hindi: 'ओंकारेश्वर', coords: [22.2435, 76.1506] }
};

// Common landmarks registry for direct destination routing
export const MP_LANDMARK_COORDINATES: Record<string, { name: string; hindi: string; coords: [number, number]; city: string }> = {
  'bateshwar': { name: 'Bateshwar Temples Complex', hindi: 'बटेश्वर मंदिर समूह', coords: [26.4258, 78.2045], city: 'Morena' },
  'mitawali': { name: 'Chausath Yogini Temple', hindi: 'चौसठ योगिनी मंदिर (मितावली)', coords: [26.4428, 78.2573], city: 'Morena' },
  'padhavali': { name: 'Garhi Padhavali Fortress', hindi: 'गढ़ी पढ़ावली', coords: [26.4319, 78.2255], city: 'Morena' },
  'kakanmath': { name: 'Kakanmath Shiva Temple', hindi: 'ककनमठ शिव मंदिर', coords: [26.5411, 78.2427], city: 'Morena' },
  'gwalior fort': { name: 'Gwalior Fort & Man Mandir', hindi: 'ग्वालियर दुर्ग व मान मंदिर', coords: [26.2295, 78.1691], city: 'Gwalior' },
  'sas bahu': { name: 'Sas Bahu Temples', hindi: 'सास-बहू मंदिर', coords: [26.2302, 78.1722], city: 'Gwalior' },
  'teli ka mandir': { name: 'Teli Ka Mandir', hindi: 'तेली का मंदिर', coords: [26.2268, 78.1685], city: 'Gwalior' },
  'jai vilas': { name: 'Jai Vilas Palace & Museum', hindi: 'जय विलास पैलेस', coords: [26.2048, 78.1666], city: 'Gwalior' },
  'tansen tomb': { name: 'Tansen Tomb & Memorial', hindi: 'तानसेन का मक़बरा', coords: [26.2238, 78.1884], city: 'Gwalior' },
  'orchha palace': { name: 'Orchha Palace & Jahangir Mahal', hindi: 'ओरछा राजमहल व जहाँगीर महल', coords: [25.3508, 78.6436], city: 'Orchha' },
  'ram raja': { name: 'Ram Raja Temple', hindi: 'श्री राम राजा मंदिर', coords: [25.3512, 78.6418], city: 'Orchha' },
  'chaturbhuj': { name: 'Chaturbhuj Temple', hindi: 'चतुर्भुज मंदिर', coords: [25.3524, 78.6430], city: 'Orchha' },
  'betwa chhatris': { name: 'Royal Chhatris on Betwa', hindi: 'शाही छतरियां (बेतवा तट)', coords: [25.3468, 78.6425], city: 'Orchha' },
  'datia palace': { name: 'Datia Bir Singh Dev Palace', hindi: 'दतिया महल (वीर सिंह देव)', coords: [25.6702, 78.4552], city: 'Datia' },
  'sonagiri': { name: 'Sonagiri Jain Temples', hindi: 'सोनागिरि दिगंबर जैन मंदिर', coords: [25.7144, 78.4069], city: 'Datia' },
  'koshak mahal': { name: 'Koshak Mahal Chanderi', hindi: 'कोषक महल चंदेरी', coords: [24.7170, 78.1180], city: 'Chanderi' },
  'chanderi fort': { name: 'Chanderi Kirti Durg Fort', hindi: 'चंदेरी कीर्ति दुर्ग किला', coords: [24.7235, 78.1384], city: 'Chanderi' },
  'khajuraho': { name: 'Khajuraho Western Temples', hindi: 'खजुराहो पश्चिमी मंदिर समूह', coords: [24.8530, 79.9197], city: 'Khajuraho' },
  'sanchi': { name: 'Great Sanchi Stupa', hindi: 'सांची का महान स्तूप', coords: [23.4873, 77.7394], city: 'Sanchi' },
  'bhimbetka': { name: 'Bhimbetka Prehistoric Caves', hindi: 'भीमबेटका शैलचित्र गुफाएं', coords: [22.9372, 77.6128], city: 'Raisen' },
  'mahakaleshwar': { name: 'Shri Mahakaleshwar Jyotirlinga', hindi: 'श्री महाकालेश्वर ज्योतिर्लिंग', coords: [23.1827, 75.7682], city: 'Ujjain' },
  'bhedaghat': { name: 'Bhedaghat & Dhuandhar Falls', hindi: 'भेड़ाघाट संगमरमर व धुआंधार', coords: [23.1314, 79.8006], city: 'Jabalpur' },
  'mandu': { name: 'Jahaz Mahal & Mandu Citadel', hindi: 'जहाज महल एवं मांडू दुर्ग', coords: [22.3664, 75.3912], city: 'Mandu' }
};

// Comprehensive Madhya Pradesh Places Database (Over 35 prime destinations)
export const MP_PLACES: MPPlace[] = [
  // --- CHAMBAL HERITAGE CORRIDOR (MORENA) ---
  {
    id: 'bateshwar_morena',
    name: 'Bateshwar Hindu Temples Complex',
    hindiName: 'बटेश्वर हिंदू मंदिर परिसर (200 मंदिर)',
    city: 'Morena',
    hindiCity: 'मुरैना (चंबल परिपथ)',
    category: 'heritage',
    categoryLabel: { en: 'ASI Heritage Complex', hi: 'ASI पुरातात्विक परिसर' },
    coordinates: [26.4258, 78.2045],
    description: {
      en: 'A resurrected valley of nearly 200 intricately carved sandstone temples dedicated to Shiva and Vishnu, dating from the 8th to 10th century Gurjara-Pratihara era.',
      hi: '8वीं से 10वीं शताब्दी के गुर्जर-प्रतिहार कालीन लगभग 200 बलुआ पत्थर के नक्काशीदार शिव व विष्णु मंदिरों का अद्भुत पुनरुद्धारित परिसर।'
    },
    travelCause: {
      en: 'Witness one of the most astonishing archaeological restoration miracles in human history spearheaded by ASI.',
      hi: 'खंडहरों और बीहड़ों से 200 मंदिरों को दोबारा खड़ा करने वाले पुरातात्विक चमत्कार का साक्षात दर्शन।'
    },
    deepHistory: {
      en: 'Constructed between 750 and 1000 CE by the Gurjara-Pratihara dynasty. Destroyed by an earthquake in the 13th century, then painstakingly reassembled stone by stone by archaeologist K.K. Muhammed.',
      hi: '750 से 1000 ईस्वी के मध्य गुर्जर-प्रतिहार शासकों द्वारा निर्मित। 13वीं सदी के भूकंप में ध्वस्त होने के बाद के.के. मुहम्मद के नेतृत्व में पत्थर-दर-पत्थर पुनः जोड़ा गया।'
    },
    architecture: {
      en: 'North Indian Nagara style miniature and large shrines with tiered curvilinear shikharas and elaborate friezes of Nataraja and Dashavatara.',
      hi: 'उत्तर भारतीय नागर शैली के मनोहारी शिखर, नटराज, नवग्रह और दशावतार की दुर्लभ प्रतिमाएं।'
    },
    bestTime: { en: 'October to March (Morning 7:00 AM – 11:00 AM for golden sunrise lighting)', hi: 'अक्टूबर से मार्च (सुबह 7:00 से 11:00 बजे स्वर्णिम सूर्यप्रकाश में)' },
    timings: { en: 'Sunrise to Sunset (6:00 AM - 6:00 PM)', hi: 'सूर्योदय से सूर्यास्त (प्रातः 6:00 से सायं 6:00)' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Paved stone pathways connect temple clusters; flat terrain around major shrines.', hi: 'मंदिरों के बीच पक्के पत्थर के रास्ते; समतल धरातल।' },
    photographyTips: { en: 'Capture wide angles looking through clustered shikharas against morning light.', hi: 'सुबह की कोमल धूप में शिखरों के बीच से विस्तृत कोण का छायाचित्र लें।' },
    safetyTips: { en: 'Paved rural roads from Gwalior (35 km). Day travel recommended; complete visit before sunset.', hi: 'ग्वालियर से 35 किमी की पक्की सड़क। दिन के समय भ्रमण करें और सूर्यास्त से पहले लौटें।' },
    images: [
      { url: '/images/places/bateshwar.jpg', title: { en: 'Bateshwar Valley Temples', hi: 'बटेश्वर मंदिर घाटी' } }
    ],
    tags: ['bateshwar', 'morena', 'heritage', 'pratihara', 'chambal', 'temple', 'asi']
  },
  {
    id: 'mitawali_chausath_yogini',
    name: 'Chausath Yogini Temple (Mitawali)',
    hindiName: 'चौसठ योगिनी मंदिर (मितावली)',
    city: 'Morena',
    hindiCity: 'मुरैना (चंबल परिपथ)',
    category: 'temple',
    categoryLabel: { en: 'Circular Hypaethral Temple', hi: 'वृत्ताकार योगिनी मंदिर' },
    coordinates: [26.4428, 78.2573],
    description: {
      en: 'Perched atop an isolated 100-foot hill, this 64-chambered circular temple inspired the architectural layout of the old Indian Parliament House (Sansad Bhavan).',
      hi: '100 फीट ऊंची पहाड़ी पर स्थित यह 64 कक्षों वाला गोलाकार मंदिर भारतीय संसद भवन (पुराना संसद भवन) के वास्तुशिल्प का मूल प्रेरणास्रोत है।'
    },
    travelCause: {
      en: 'Architectural wonder: 64 circular outer shrines enclosing a central open hypaethral Shiva sanctum with a 360-degree panorama of Chambal valley.',
      hi: 'संसद भवन जैसी अनूठी वास्तुकला, 64 शिवलिंग और चारों ओर चंबल घाटी का 360 डिग्री मनोरम विहंगम दृश्य।'
    },
    deepHistory: {
      en: 'Built in 1323 CE (Vikram Samvat 1380) by Maharaja Devapala of the Kachchhapaghata dynasty as a tantric learning academy.',
      hi: 'कच्छपघात राजवंश के महाराजा देवपाल द्वारा 1323 ईस्वी में तांत्रिक व खगोलीय शिक्षा केंद्र के रूप में निर्मित।'
    },
    architecture: {
      en: 'Circular colonnade of 101 pillars with 64 peripheral chapels, each housing a Shiva lingam, surrounding a circular central pavilion.',
      hi: '101 नक्काशीदार खंभों वाला वृत्ताकार बरामदा, जिसमें 64 छोटे देवालय और मध्य में खुला मुख्य मंडप है।'
    },
    bestTime: { en: 'October to February (Morning 8:00 AM or 4:30 PM for breathtaking sunset)', hi: 'अक्टूबर से फरवरी (सुबह 8:00 या सायं 4:30 सूर्यास्त हेतु)' },
    timings: { en: 'Sunrise to Sunset (6:00 AM - 6:00 PM)', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry (ASI Monument)', hi: 'निःशुल्क प्रवेश (ASI संरक्षित)' },
    accessibilityRating: 5,
    accessibilityNotes: { en: 'Approximately 100 stone steps to reach the hilltop temple; handrails installed.', hi: 'पहाड़ी शीर्ष तक लगभग 100 सीढ़ियां; रेलिंग की सुविधा उपलब्ध।' },
    photographyTips: { en: 'Stand at the central temple entrance and shoot symmetrical circular colonnades with dramatic sky.', hi: 'केंद्रीय मंडप के द्वार से गोलाकार खंभों की सममित तस्वीरें लें।' },
    safetyTips: { en: 'Carry drinking water. Easily covered along with Padhavali and Bateshwar in a 4-hour circuit from Gwalior.', hi: 'पीने का पानी साथ रखें। ग्वालियर से 4 घंटे में बटेश्वर व पढ़ावली के साथ घूमा जा सकता है।' },
    images: [
      { url: '/images/places/mitawali.jpg', title: { en: 'Mitawali Circular Temple', hi: 'मितावली चौसठ योगिनी' } }
    ],
    tags: ['mitawali', 'chausath yogini', 'morena', 'parliament', 'temple', 'gwalior', 'heritage']
  },
  {
    id: 'garhi_padhavali',
    name: 'Garhi Padhavali Fortress & Temple',
    hindiName: 'गढ़ी पढ़ावली (मिनी खजुराहो)',
    city: 'Morena',
    hindiCity: 'मुरैना (चंबल परिपथ)',
    category: 'heritage',
    categoryLabel: { en: 'Mini Khajuraho Mukhamandapa', hi: 'मिनी खजुराहो नक्काशी' },
    coordinates: [26.4319, 78.2255],
    description: {
      en: 'A 10th-century temple entrance hall so densely adorned with erotic and mythological relief carvings that it is known across the region as the Mini Khajuraho of Chambal.',
      hi: '10वीं सदी का ऐसा भव्य मंदिर मुखमंडप जिसकी छतों और खंभों पर इतनी सघन व बारीक नक्काशी है कि इसे "चंबल का मिनी खजुराहो" कहा जाता है।'
    },
    travelCause: {
      en: 'Exquisite ceiling and pillar carvings depicting the Mahabharata, Ramayana, Krishna Leela, and Shiva-Parvati wedding.',
      hi: 'महाभारत, रामायण, कृष्ण लीला और शिव-पार्वती विवाह की सजीव एवं सूक्ष्म पाषाण नक्काशी का दर्शन।'
    },
    deepHistory: {
      en: 'Originally a massive 10th-century Kachchhapaghata temple. In the 18th century, Jat Rulers of Gohad fortified it into a defensive garrison.',
      hi: 'मूलतः 10वीं सदी का कच्छपघात मंदिर। 18वीं सदी में गोहद के जाट राजाओं ने इसे एक सैन्य किले (गढ़ी) का रूप दिया।'
    },
    architecture: {
      en: 'High fortified masonry bastions entered via grand stone lions, opening into an intensely sculpted open pillared hypostyle mandapa.',
      hi: 'ऊंचे परकोटे वाले बुर्ज, दो विशाल पाषाण सिंह और भीतर अलंकृत खंभों वाला भव्य मंडप।'
    },
    bestTime: { en: 'Morning 8:00 AM – 1:00 PM for optimal natural light on ceilings', hi: 'प्रातः 8:00 से दोपहर 1:00 बजे तक छत की नक्काशी देखने हेतु' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry (ASI Protected)', hi: 'निःशुल्क (ASI संरक्षित)' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Short climb up ramped entrance; level ground inside the fortress courtyard.', hi: 'किले के प्रवेश द्वार पर ढलानदार रैंप; प्रांगण समतल है।' },
    photographyTips: { en: 'Look straight up! The ceiling panels hold the most astonishing high-relief sculptures.', hi: 'छत की ओर देखकर नक्काशी के बारीक क्लोज़-अप शॉट लें।' },
    safetyTips: { en: 'Located just 2 km from Bateshwar; combined taxi easily arranged from Gwalior station.', hi: 'बटेश्वर से मात्र 2 किमी की दूरी पर स्थित; ग्वालियर स्टेशन से सीधी टैक्सी उपलब्ध।' },
    images: [
      { url: '/images/places/padhavali.jpg', title: { en: 'Garhi Padhavali Carvings', hi: 'गढ़ी पढ़ावली की नक्काशी' } }
    ],
    tags: ['padhavali', 'garhi', 'morena', 'mini khajuraho', 'sculpture', 'chambal', 'heritage']
  },
  {
    id: 'kakanmath_temple',
    name: 'Kakanmath Shiva Temple (Suhania)',
    hindiName: 'ककनमठ शिव मंदिर (सुहानिया)',
    city: 'Morena',
    hindiCity: 'मुरैना (चंबल परिपथ)',
    category: 'temple',
    categoryLabel: { en: '115-ft Gravity-Defying Temple', hi: '115 फीट ऊंचा चमत्कारिक मंदिर' },
    coordinates: [26.5411, 78.2427],
    description: {
      en: 'A soaring 115-foot high stone spire standing completely without mortar or lime, balanced purely by gravity and interlocking dry stone masonry for over a millennium.',
      hi: 'बिना चूने या गारे के केवल पत्थरों के संतुलन पर खड़ा 115 फीट ऊंचा यह विशाल मंदिर 1000 वर्षों से गुरुत्वाकर्षण को चुनौती दे रहा है।'
    },
    travelCause: {
      en: 'An architectural marvel rising dramatically above surrounding mustard fields, said in local folklore to have been raised by ghosts in a single night.',
      hi: 'चारों ओर फैले खेतों के बीच खड़ा पाषाण शिल्प का चमत्कार, जिसके बारे में लोककथा है कि भूतों ने इसे एक रात में बनाया था।'
    },
    deepHistory: {
      en: 'Commissioned between 1015 and 1035 CE by King Kirttiraja of the Kachchhapaghata dynasty for his devout queen Kakanvati.',
      hi: 'कच्छपघात शासक कीर्तिराज द्वारा 1015-1035 ईस्वी में अपनी रानी ककनावती की शिवभक्ति हेतु निर्मित।'
    },
    architecture: {
      en: 'Multi-storey Nagara shikhara with damaged outer mandapas exposing the majestic skeleton and monumental core of dry-joint ashlar masonry.',
      hi: 'नागर शैली का गगनचुंबी शिखर, जिसके खुले पाषाण खंड मध्यकालीन इंजीनियरिंग की पराकाष्ठा दिखाते हैं।'
    },
    bestTime: { en: 'November to February (Morning 8:00 AM – 12:00 PM in bright sunlight)', hi: 'नवंबर से फरवरी (सुबह 8:00 से दोपहर 12:00 धूप में)' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry (ASI Protected)', hi: 'निःशुल्क प्रवेश' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Level plinth with a short flight of steps to sanctum.', hi: 'ऊंचे चबूतरे पर सीढ़ियों द्वारा प्रवेश।' },
    photographyTips: { en: 'Step back into the fields to frame the towering silhouette against open Chambal skies.', hi: 'खेतों से पीछे हटकर विशाल शिखर का विस्तृत आकाश के साथ फोटो लें।' },
    safetyTips: { en: 'Located 65 km north of Gwalior via Suhania. Hire private cab for full day circuit.', hi: 'ग्वालियर से 65 किमी उत्तर में स्थित। पूरे दिन की टैक्सी बुक करके जाना सुविधाजनक रहता है।' },
    images: [
      { url: '/images/places/kakanmath.jpg', title: { en: 'Kakanmath Temple Spire', hi: 'ककनमठ मंदिर शिखर' } }
    ],
    tags: ['kakanmath', 'suhania', 'morena', 'gravity-defying', 'shiva', 'heritage']
  },

  // --- GWALIOR CITADEL & ROYAL HERITAGE ---
  {
    id: 'gwalior_fort_complex',
    name: 'Gwalior Fort & Man Mandir Palace',
    hindiName: 'ग्वालियर दुर्ग एवं मान मंदिर महल',
    city: 'Gwalior',
    hindiCity: 'ग्वालियर',
    category: 'heritage',
    categoryLabel: { en: 'The Pearl of Fortresses', hi: 'हिंद के किलों का मोती' },
    coordinates: [26.2295, 78.1691],
    description: {
      en: 'Perched on a sheer 3-km sandstone ridge, Babur hailed it as "the pearl among gems of fortresses". Features turquoise glazed ceramic tilework and underground royal chambers.',
      hi: '3 किमी लंबी बलुआ पत्थर की पहाड़ी पर स्थित यह दुर्ग जिसे बाबर ने "हिंद के किलों का मोती" कहा था। नीली चमकीली टाइलों और मानसिंह तोमर के महलों हेतु प्रसिद्ध।'
    },
    travelCause: {
      en: 'Explore India\'s premier hill citadel, the birthplace of Dhrupad classical music, legendary battlefields of Rani Lakshmibai, and the nightly Sound & Light show.',
      hi: 'भारत के सबसे अभेद्य किलों में से एक, तानसेन की संगीत भूमि और वीरांगना लक्ष्मीबाई का अमर रणक्षेत्र।'
    },
    deepHistory: {
      en: 'Founded in the 6th century by Raja Suraj Sen. Reached its cultural golden age under Raja Man Singh Tomar (1486–1516), later passing through Mughals, Marathas, and Scindias.',
      hi: '6वीं सदी में राजा सूरज सेन द्वारा स्थापित। 15वीं सदी में राजा मानसिंह तोमर काल में इसका स्वर्ण युग रहा। बाद में मराठा व सिंधिया शासकों का केंद्र बना।'
    },
    architecture: {
      en: 'Early Rajput palace design featuring vibrant turquoise and yellow duck and elephant tile friezes, underground acoustic vaults, and ornate jharokhas.',
      hi: 'राजपूत स्थापत्य, नीली व पीली चमकीली टाइलों पर बत्तखों व हाथियों के चित्र और भूमिगत झूला घर।'
    },
    bestTime: { en: 'October to March (Morning 8:30 AM or Evening 4:30 PM for sunset over city)', hi: 'अक्टूबर से मार्च (सुबह 8:30 या शाम 4:30 सूर्यास्त व लाइट एंड साउंड शो हेतु)' },
    timings: { en: '6:00 AM - 6:30 PM (Palaces: 9:00 AM - 5:30 PM; Sound & Light: 7:30 PM)', hi: 'सुबह 6:00 से शाम 6:30 बजे तक (लाइट एंड साउंड शो: 7:30 बजे)' },
    entryFee: { en: '₹75 for Indians, ₹300 for Foreigners; Sound & Light Show: ₹100', hi: 'भारतीय: ₹75, विदेशी: ₹300; लाइट एंड साउंड: ₹100' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Vehicles can drive directly up to fort top via Urvai Gate road; ramps at palace entries.', hi: 'उरवाई गेट से वाहन सीधे किले के ऊपर पार्किंग तक जा सकते हैं।' },
    photographyTips: { en: 'Capture the famous blue-tiled exterior wall from outer lawn during morning hours.', hi: 'सुबह की धूप में मान मंदिर की बाहरी दीवार पर लगी नीली टाइलों का फोटो लें।' },
    safetyTips: { en: 'Centrally located in Gwalior city. Hire authorized MP Tourism guides at the ticketing counter.', hi: 'ग्वालियर शहर के मध्य स्थित। केवल अधिकृत गाइड ही लें।' },
    images: [
      { url: '/images/places/gwalior_fort.jpg', title: { en: 'Gwalior Fort Ramparts', hi: 'ग्वालियर दुर्ग परकोटा' } }
    ],
    tags: ['gwalior', 'fort', 'man mandir', 'heritage', 'tomar', 'scindia', 'palace']
  },
  {
    id: 'sas_bahu_temple_gwalior',
    name: 'Sas Bahu Temples (Sahastrabahu)',
    hindiName: 'सास-बहू मंदिर (सहस्रबाहु मंदिर)',
    city: 'Gwalior',
    hindiCity: 'ग्वालियर',
    category: 'temple',
    categoryLabel: { en: '11th-Century Nagara Temple', hi: '11वीं सदी का विष्णु धाम' },
    coordinates: [26.2302, 78.1722],
    description: {
      en: 'Twin 11th-century intricately carved stone temples dedicated to Lord Vishnu, perched dramatically on the eastern precipice of Gwalior Fort.',
      hi: 'ग्वालियर दुर्ग के पूर्वी छोर पर स्थित 11वीं सदी के दो भव्य पाषाण मंदिर, जो भगवान विष्णु (सहस्रबाहु) को समर्पित हैं।'
    },
    travelCause: {
      en: 'Remarkable multi-tiered open porches that let breeze and sun illuminate astonishing ceiling rosettes and multi-armed Vishnu reliefs.',
      hi: 'बहुमंजिला नक्काशीदार खंभे, अलंकृत मेहराब और पूरे ग्वालियर शहर का मनोहारी विहंगम दृश्य।'
    },
    deepHistory: {
      en: 'Built in 1093 CE by King Mahipala of the Kachchhapaghata dynasty. Originally named Sahastrabahu (thousand-armed Vishnu), corrupted by colloquial tongue to Sas-Bahu.',
      hi: 'कच्छपघात शासक महिपाल द्वारा 1093 ईस्वी में निर्मित। मूल नाम सहस्रबाहु (हजार भुजाओं वाले विष्णु) था, जो लोकवाणी में सास-बहू बन गया।'
    },
    architecture: {
      en: 'Sandstone pillared hall with cruciform ground plan, three open entrance porches, and three-tiered hypostyle ceiling.',
      hi: 'बलुआ पत्थर का क्रूसीफॉर्म मंडप, तीन दिशाओं में खुले बरामदे और तीन स्तरों वाली नक्काशीदार छत।'
    },
    bestTime: { en: 'Early morning 7:00 AM – 9:30 AM for sunrise filtering through open stone jaalis', hi: 'सुबह 7:00 से 9:30 बजे जब सूर्य की किरणें पत्थरों के बीच से छनकर आती हैं' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Included in Gwalior Fort Composite ASI Ticket', hi: 'ग्वालियर दुर्ग टिकट में सम्मिलित' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Short flight of stone steps from the fort ridge driveway.', hi: 'किले के मुख्य मार्ग से कुछ सीढ़ियां चढ़नी होती हैं।' },
    photographyTips: { en: 'Frame the city of Gwalior through the open pillared balcony of the larger temple.', hi: 'बड़े मंदिर के खुले झरोखे से नीचे फैले शहर का विहंगम दृश्य फ्रेम करें।' },
    safetyTips: { en: 'Walkway connects easily to Teli Ka Mandir in 5 minutes.', hi: 'यहाँ से तेली का मंदिर 5 मिनट की पैदल दूरी पर है।' },
    images: [
      { url: '/images/places/sas_bahu.jpg', title: { en: 'Sas Bahu Temple Gwalior', hi: 'सास-बहू मंदिर' } }
    ],
    tags: ['sas bahu', 'gwalior', 'temple', 'vishnu', 'kachchhapaghata', 'heritage']
  },
  {
    id: 'teli_ka_mandir_gwalior',
    name: 'Teli Ka Mandir',
    hindiName: 'तेली का मंदिर (100 फीट ऊंचा)',
    city: 'Gwalior',
    hindiCity: 'ग्वालियर',
    category: 'temple',
    categoryLabel: { en: 'Oldest & Tallest Fort Structure', hi: 'किले का सबसे प्राचीन व ऊंचा मंदिर' },
    coordinates: [26.2268, 78.1685],
    description: {
      en: 'The oldest monument on Gwalior Fort, rising to an imposing 100 feet with a unique Dravidian barrel-vaulted wagon roof merged with North Indian Nagara motifs.',
      hi: 'ग्वालियर दुर्ग की सबसे ऊंची (100 फीट) व प्राचीनतम इमारत, जिसकी छत दक्षिण भारतीय द्राविड़ शैली की और आधार नागर शैली का है।'
    },
    travelCause: {
      en: 'A fascinating architectural synthesis of South Indian Valabhi shikhara and Northern decorative artistry from the 8th century Pratihara period.',
      hi: 'उत्तर और दक्षिण भारतीय स्थापत्य का दुर्लभ संगम, 35 फीट ऊंचा अलंकृत प्रवेश द्वार और गरुड़ प्रतिमा।'
    },
    deepHistory: {
      en: 'Built in the mid-8th century CE during the reign of Pratihara Emperor Mihira Bhoja or Yashovarman, funded by oil merchant guilds (Telis).',
      hi: '8वीं सदी के मध्य प्रतिहार काल में तेल व्यापारियों (तेली समाज) के संघ द्वारा निर्मित।'
    },
    architecture: {
      en: 'Valabhi wagon-vaulted roof standing atop a soaring rectangular superstructure, with a gargantuan 35-foot doorframe featuring river goddesses Ganga and Yamuna.',
      hi: 'आयताकार गर्भगृह, वल्लभी ढलवां छत और 35 फीट ऊंचा प्रवेश द्वार जिस पर गंगा-यमुना व गरुड़ अंकित हैं।'
    },
    bestTime: { en: 'Late afternoon 4:00 PM – 5:30 PM for warm golden hour light on the massive stone facade', hi: 'सायं 4:00 से 5:30 बजे सुनहरी धूप में' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Included in Gwalior Fort Composite Ticket', hi: 'किले के टिकट में सम्मिलित' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Paved plaza surrounds the monument; wide low steps to the entrance.', hi: 'मंदिर के चारों ओर समतल चबूतरा।' },
    photographyTips: { en: 'Use an ultra-wide angle from the stone courtyard to capture the monumental vertical scale.', hi: 'अल्ट्रा-वाइड लेंस से 100 फीट ऊंचे शिखर का भव्य कोण लें।' },
    safetyTips: { en: 'Comfortable footwear recommended for walking around the fort plateau.', hi: 'किले की पठार पर टहलने हेतु आरामदायक जूते पहनें।' },
    images: [
      { url: '/images/places/gwalior_fort.jpg', title: { en: 'Teli Ka Mandir Elevation', hi: 'तेली का मंदिर शिखर' } }
    ],
    tags: ['teli ka mandir', 'gwalior', 'dravidian', 'heritage', 'pratihara']
  },
  {
    id: 'jai_vilas_palace_gwalior',
    name: 'Jai Vilas Palace & Scindia Royal Museum',
    hindiName: 'जय विलास पैलेस एवं सिंधिया संग्रहालय',
    city: 'Gwalior',
    hindiCity: 'ग्वालियर',
    category: 'monument',
    categoryLabel: { en: 'Grand European-Indian Palace', hi: 'शाही महल एवं संग्रहालय' },
    coordinates: [26.2048, 78.1666],
    description: {
      en: 'A 19th-century Italianate palace featuring the world\'s heaviest crystal chandeliers (3.5 tonnes each) in the Durbar Hall and a silver miniature train carrying royal banquet liqueurs.',
      hi: '19वीं सदी का भव्य यूरोपीय महल, जिसमें दरबार हॉल में 3.5 टन के दुनिया के सबसे भारी क्रिस्टल झूमर और डाइनिंग टेबल पर चलने वाली चांदी की ट्रेन है।'
    },
    travelCause: {
      en: 'Experience the astonishing opulence of the Scindia dynasty, weapon galleries including swords of Aurangzeb and Shah Jahan, and historic royal carriage displays.',
      hi: 'सिंधिया राजवंश की राजसी भव्यता, ऐतिहासिक शस्त्र संग्रह और अनोखी चांदी की ट्रेन का दीदार।'
    },
    deepHistory: {
      en: 'Built in 1874 by Maharaja Jayajirao Scindia to welcome the Prince of Wales (King Edward VII), designed by British architect Sir Michael Filose.',
      hi: '1874 में महाराजा जयाजीराव सिंधिया द्वारा प्रिंस ऑफ वेल्स के स्वागत हेतु निर्मित।'
    },
    architecture: {
      en: 'Three-tiered European neoclassical design: Tuscan first tier, Italian Doric second, and Corinthian third, combined with royal Indian courtyards.',
      hi: 'टस्कन, डोरिक व कोरिंथियन यूरोपीय शैलियों का अनूठा सम्मिश्रण।'
    },
    bestTime: { en: '10:00 AM – 4:00 PM (Museum closes on Wednesdays)', hi: 'सुबह 10:00 से शाम 4:00 (बुधवार अवकाश)' },
    timings: { en: '10:00 AM - 5:00 PM (Closed Wednesdays)', hi: 'सुबह 10:00 से शाम 5:00 बजे (बुधवार बंद)' },
    entryFee: { en: '₹300 for Indians, ₹1,000 for Foreigners (Museum entry)', hi: 'भारतीय: ₹300, विदेशी: ₹1,000' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Wheelchair ramps and smooth ground-floor galleries available.', hi: 'भूतल पर व्हीलचेयर रैंप और सुगम गैलरी।' },
    photographyTips: { en: 'Camera ticket required inside Durbar Hall; crystal chandeliers create dazzling reflections.', hi: 'दरबार हॉल में कैमरा टिकट लेकर झूमरों की भव्य तस्वीरें लें।' },
    safetyTips: { en: 'Allocate at least 2 hours to comfortably tour the 35 museum rooms.', hi: 'संग्रहालय के 35 कमरों को देखने हेतु कम से कम 2 घंटे का समय रखें।' },
    images: [
      { url: '/images/places/gwalior_fort.jpg', title: { en: 'Jai Vilas Palace Durbar', hi: 'जय विलास पैलेस' } }
    ],
    tags: ['jai vilas', 'palace', 'gwalior', 'scindia', 'museum', 'silver train']
  },
  {
    id: 'tansen_tomb_gwalior',
    name: 'Tomb of Tansen & Mohammad Ghaus',
    hindiName: 'तानसेन एवं मुहम्मद गौस का मक़बरा',
    city: 'Gwalior',
    hindiCity: 'ग्वालियर',
    category: 'monument',
    categoryLabel: { en: 'Cradle of Classical Music', hi: 'भारतीय शास्त्रीय संगीत का तीर्थ' },
    coordinates: [26.2238, 78.1884],
    description: {
      en: 'The final resting place of Mian Tansen, the legendary music maestro of Emperor Akbar\'s Navratnas, set within serene Mughal gardens beside his Sufi mentor Mohammad Ghaus.',
      hi: 'अकबर के नवरत्नों में से एक महान संगीत सम्राट तानसेन और उनके सूफी गुरु हज़रत मुहम्मद गौस का ऐतिहासिक मक़बरा परिसर।'
    },
    travelCause: {
      en: 'Pilgrimage site for musicians world over; site of the world-famous Tansen Samaroh classical music festival held every December.',
      hi: 'संगीत साधकों का विश्व तीर्थ; प्रतिवर्ष दिसंबर में आयोजित होने वाले विश्वविख्यात तानसेन संगीत समारोह का केंद्र।'
    },
    deepHistory: {
      en: 'Constructed in early 17th century Mughal style. Tradition says chewing the leaves of the ancient tamarind tree over Tansen\'s tomb blesses singers with melodic sweetness.',
      hi: '17वीं सदी का मुगल स्थापत्य। मान्यता है कि मक़बरे पर लगी इमली की पत्तियां खाने से आवाज़ सुरीली होती है।'
    },
    architecture: {
      en: 'Elaborate perforated stone jaalis in hexagonal chambers, with open pavilions and shaded garden courtyards.',
      hi: 'षट्कोणीय कक्ष, बारीक पत्थर की जालियां और शांत हरियाली भरा उद्यान।'
    },
    bestTime: { en: 'Morning 8:00 AM – 11:00 AM or December during the Tansen Music Festival', hi: 'सुबह 8:00 से 11:00 या दिसंबर में संगीत समारोह के समय' },
    timings: { en: '7:00 AM - 6:00 PM', hi: 'सुबह 7:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क प्रवेश' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Flat gardens with paved walkways throughout.', hi: 'समतल बगीचा और पक्के रास्ते।' },
    photographyTips: { en: 'Capture the intricate shadow patterns cast through the perforated stone lattice screens.', hi: 'पत्थर की जालीदार खिड़कियों से बनने वाली सुंदर छाया का छायाचित्र लें।' },
    safetyTips: { en: 'Located 3 km east of Gwalior Railway Station; accessible by auto-rickshaw in 10 minutes.', hi: 'ग्वालियर रेलवे स्टेशन से 3 किमी; ऑटो से 10 मिनट में पहुंचें।' },
    images: [
      { url: '/images/places/gwalior_fort.jpg', title: { en: 'Tansen Memorial Garden', hi: 'तानसेन स्मारक' } }
    ],
    tags: ['tansen', 'gwalior', 'music', 'mughal', 'heritage', 'monument']
  },

  // --- BUNDELKHAND (ORCHHA & DATIA) ---
  {
    id: 'orchha_fort_complex',
    name: 'Orchha Palace Complex & Jahangir Mahal',
    hindiName: 'ओरछा राजमहल एवं जहाँगीर महल',
    city: 'Orchha',
    hindiCity: 'ओरछा (बुंदेलखंड)',
    category: 'heritage',
    categoryLabel: { en: 'Island Citadel on Betwa River', hi: 'बेतवा तट का अमर राजप्रासाद' },
    coordinates: [25.3508, 78.6436],
    description: {
      en: 'A poetic 16th-century Bundela citadel island on the Betwa river, encompassing Jahangir Mahal, Raj Mahal with vibrant mythological frescoes, and Rai Praveen Mahal.',
      hi: 'बेतवा नदी के सुरम्य द्वीप पर स्थित 16वीं सदी का स्वप्निल बुंदेला दुर्ग, जिसमें जहाँगीर महल और पौराणिक भित्तिचित्रों वाला राजमहल शामिल हैं।'
    },
    travelCause: {
      en: 'A timeless architectural masterpiece of Bundela Rajput design with ornate chhatris, hanging balconies, and river vistas.',
      hi: 'बुंदेला स्थापत्य का उत्कृष्ट नमूना, अलंकृत झरोखे, छतरियां और बेतवा नदी के शांत जल का मनोरम दृश्य।'
    },
    deepHistory: {
      en: 'Founded in 1501 by Bundela King Rudra Pratap Singh. Raja Bir Singh Dev built Jahangir Mahal in 1605 to commemorate Mughal Emperor Jahangir\'s friendship.',
      hi: '1501 में राजा रुद्र प्रताप सिंह द्वारा स्थापित। 1605 में राजा वीर सिंह देव ने सम्राट जहाँगीर के स्वागत हेतु जहाँगीर महल बनवाया।'
    },
    architecture: {
      en: 'Synthesis of Rajput and Mughal styles: multi-tiered stone jaalis, domed chhatris, central quadrangles, and vibrant mineral-pigment frescoes.',
      hi: 'राजपूत और मुगल शैली का बेजोड़ संगम, अलंकृत पत्थर की जालियां और प्राकृतिक रंगों से बने भित्तिचित्र।'
    },
    bestTime: { en: 'October to March (Morning 9:00 AM or Late Afternoon 4:00 PM for sunset over river)', hi: 'अक्टूबर से मार्च (सुबह 9:00 या दोपहर 4:00 सूर्यास्त हेतु)' },
    timings: { en: '9:00 AM - 5:30 PM (Sound & Light Show: 7:45 PM)', hi: 'सुबह 9:00 से शाम 5:30 बजे (लाइट एंड साउंड शो: 7:45 बजे)' },
    entryFee: { en: '₹50 for Indians, ₹400 for Foreigners (Composite Orchha Monuments Ticket)', hi: 'भारतीय: ₹50, विदेशी: ₹400 (ओरछा समग्र टिकट)' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Courtyards accessible; upper palace storeys involve steep medieval stone steps.', hi: 'मुख्य प्रांगण सुगम; ऊपर के कमरों में पुरानी सीढ़ियां हैं।' },
    photographyTips: { en: 'Climb to the rooftop pavilions of Jahangir Mahal to frame Chaturbhuj Temple against sunset.', hi: 'जहाँगीर महल की छत से चतुर्भुज मंदिर और सूर्यास्त का सबसे प्रसिद्ध शॉट लें।' },
    safetyTips: { en: 'Located 18 km from Jhansi Railway Station and 120 km south of Gwalior via NH44.', hi: 'झांसी रेलवे स्टेशन से 18 किमी और ग्वालियर से 120 किमी (NH44 द्वारा 2 घंटे)।' },
    images: [
      { url: '/images/places/orchha_palace.jpg', title: { en: 'Jahangir Mahal Orchha', hi: 'जहाँगीर महल ओरछा' } }
    ],
    tags: ['orchha', 'jahangir mahal', 'bundela', 'palace', 'heritage', 'betwa']
  },
  {
    id: 'ram_raja_temple_orchha',
    name: 'Shri Ram Raja Temple',
    hindiName: 'श्री राम राजा मंदिर (ओरछा)',
    city: 'Orchha',
    hindiCity: 'ओरछा (बुंदेलखंड)',
    category: 'temple',
    categoryLabel: { en: 'Unique Royal Temple of India', hi: 'जहाँ प्रभु राम को राजा के रूप में गार्ड ऑफ ऑनर दिया जाता है' },
    coordinates: [25.3512, 78.6418],
    description: {
      en: 'The only temple in the world where Lord Rama is worshipped not as a hermit or divinity, but as a living King and Head of State, honored with a daily police Guard of Honor.',
      hi: 'विश्व का एकमात्र मंदिर जहां भगवान राम की पूजा भगवान के रूप में नहीं, बल्कि ओरछा के अधिपति "राजा" के रूप में होती है और मध्य प्रदेश पुलिस द्वारा प्रतिदिन सशस्त्र सलामी (गार्ड ऑफ ऑनर) दी जाती है।'
    },
    travelCause: {
      en: 'Witness the royal Sandhya Aarti and state police ceremonial salutation, a living tradition unbroken for over 400 years.',
      hi: '400 वर्षों से चली आ रही सांध्य आरती और मध्य प्रदेश पुलिस की राजकीय सलामी का अलौकिक अनुभव।'
    },
    deepHistory: {
      en: 'Brought from Ayodhya by Queen Ganeshi Kunti in the 16th century under the divine condition that the deity would reside wherever first placed on the ground.',
      hi: '16वीं सदी में महारानी गणेशी कुंवरि द्वारा अयोध्या से लाया गया। शर्त के अनुसार प्रभु जहां पहली बार विराजे, वही राजमहल मंदिर बन गया।'
    },
    architecture: {
      en: 'Originally a royal palace pavilion converted into sanctum with marble courtyards and domed arches.',
      hi: 'राजमहल स्थापत्य, संगमरमर का प्रांगण और पारंपरिक गुंबददार मेहराब।'
    },
    bestTime: { en: 'Evening Aarti at 7:00 PM (Summer 8:00 PM) to witness the Guard of Honor', hi: 'शाम 7:00 बजे सांध्य आरती व पुलिस सलामी के समय' },
    timings: { en: '8:00 AM - 12:30 PM & 5:00 PM - 10:00 PM', hi: 'सुबह 8:00 से 12:30 व शाम 5:00 से रात 10:00 बजे तक' },
    entryFee: { en: 'Free Darshan for all devotees', hi: 'दर्शन पूर्णतः निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Flat bazaar approach; wheelchair accessible courtyard.', hi: 'समतल बाजार मार्ग, प्रांगण में व्हीलचेयर सुलभ।' },
    photographyTips: { en: 'Photography strictly prohibited inside the inner sanctum; capture the illuminated royal gateway from outer chowk.', hi: 'गर्भगृह में कैमरा वर्जित; बाहर चौक से रोशनी से सजे द्वार का फोटो लें।' },
    safetyTips: { en: 'Large crowds during Ram Navami and Vivah Panchami. Deposit footwear at official stalls.', hi: 'त्योहारों पर भारी भीड़ होती है। जूते अधिकृत स्टैंड पर ही जमा करें।' },
    images: [
      { url: '/images/places/orchha_palace.jpg', title: { en: 'Ram Raja Temple Orchha', hi: 'श्री राम राजा मंदिर' } }
    ],
    tags: ['ram raja', 'orchha', 'temple', 'guard of honor', 'spiritual', 'bundelkhand']
  },
  {
    id: 'chaturbhuj_temple_orchha',
    name: 'Chaturbhuj Temple',
    hindiName: 'चतुर्भुज मंदिर (विशाल शिखर)',
    city: 'Orchha',
    hindiCity: 'ओरछा (बुंदेलखंड)',
    category: 'temple',
    categoryLabel: { en: 'Monumental 344-ft Tall Temple', hi: '344 फीट ऊंचा विशाल पाषाण मंदिर' },
    coordinates: [25.3524, 78.6430],
    description: {
      en: 'A soaring cathedral-like temple raised on a 15-meter stone plinth with one of the tallest sanctum spires in Central India, dominating the Orchha skyline.',
      hi: '15 मीटर ऊंचे पाषाण चबूतरे पर बना यह विशाल मंदिर मध्य भारत के सबसे ऊंचे शिखरों में से एक है, जो ओरछा के आकाश में दूर से ही दिखाई देता है।'
    },
    travelCause: {
      en: 'Breathtaking cross-shaped interior hall with cavernous stone vaults and rooftop vantage points looking across Betwa river.',
      hi: 'विशाल खंभों वाला कैथेड्रल जैसा हॉल और छत से ओरछा के महलों का अविस्मरणीय 360 डिग्री दृश्य।'
    },
    deepHistory: {
      en: 'Constructed by Raja Madhukar Shah (1554–1592) specifically to house the Rama idol from Ayodhya before the deity chose the palace instead.',
      hi: 'राजा मधुकर शाह द्वारा भगवान राम के विग्रह हेतु निर्मित, किंतु प्रभु के महल में विराजने के कारण बाद में यहाँ चतुर्भुज विष्णु स्थापित हुए।'
    },
    architecture: {
      en: 'Sanctuary rising over multi-tiered cross-vaulted galleries resembling a blend of medieval European cathedral and Bundela palace-temple design.',
      hi: 'क्रूसीफॉर्म योजना, आकाश छूते शिखर और भारी पाषाण मेहराब।'
    },
    bestTime: { en: 'Morning 8:00 AM – 11:00 AM or 4:30 PM for sunset glow on temple stones', hi: 'सुबह 8:00 से 11:00 या शाम 4:30 सूर्यास्त की लालिमा में' },
    timings: { en: '6:00 AM - 6:30 PM', hi: 'सुबह 6:00 से शाम 6:30 बजे' },
    entryFee: { en: 'Free entry (Roof access ₹20)', hi: 'निःशुल्क प्रवेश (छत पर जाने का मामूली शुल्क)' },
    accessibilityRating: 5,
    accessibilityNotes: { en: 'Steep flight of stone stairs to ascend the 15-meter base plinth.', hi: 'ऊंचे चबूतरे पर चढ़ने हेतु सीढ़ियां हैं।' },
    photographyTips: { en: 'Shoot from the courtyard of Ram Raja Temple to capture the monumental vertical contrast.', hi: 'राम राजा मंदिर के चौक से इसके विशाल शिखर की तुलनात्मक तस्वीर लें।' },
    safetyTips: { en: 'Careful when climbing steep stairs to the roof; watch your step on narrow walkways.', hi: 'छत पर जाते समय संकरी सीढ़ियों पर सावधानी रखें।' },
    images: [
      { url: '/images/places/orchha_palace.jpg', title: { en: 'Chaturbhuj Temple Spire', hi: 'चतुर्भुज मंदिर ओरछा' } }
    ],
    tags: ['chaturbhuj', 'orchha', 'temple', 'nagara', 'bundelkhand', 'vishnu']
  },
  {
    id: 'betwa_chhatris_orchha',
    name: 'Royal Chhatris on Betwa Riverfront',
    hindiName: 'शाही छतरियां (बेतवा नदी तट)',
    city: 'Orchha',
    hindiCity: 'ओरछा (बुंदेलखंड)',
    category: 'heritage',
    categoryLabel: { en: 'Cenotaphs on River Banks', hi: 'बेतवा तट पर 14 बुंदेला छतरियां' },
    coordinates: [25.3468, 78.6425],
    description: {
      en: 'Fourteen monumental cenotaphs of Bundela rulers lining Kanchana Ghat on the tranquil banks of the Betwa river, creating one of India\'s most picturesque riverfront silhouettes.',
      hi: 'बेतवा नदी के कंचना घाट पर पंक्तिबद्ध खड़ी 14 भव्य बुंदेला शासकों की शाही छतरियां, जो सूर्यास्त के समय जल में स्वर्णिम प्रतिबिंब बनाती हैं।'
    },
    travelCause: {
      en: 'Serene sunset walks along the Betwa river, river kayaking, and viewing the majestic reflection of cenotaph spires in crystal-clear waters.',
      hi: 'बेतवा नदी के किनारे शांत सूर्यास्त, नौकायन और पानी में छतरियों का अद्भुत परावर्तन देखना।'
    },
    deepHistory: {
      en: 'Erected between the 17th and 18th centuries as royal memorials for Orchha kings, including Bir Singh Dev, Madhukar Shah, and Jaswant Singh.',
      hi: '17वीं और 18वीं सदी में वीर सिंह देव, मधुकर शाह और यशवंत सिंह जैसे ओरछा के प्रतापी राजाओं की स्मृति में निर्मित।'
    },
    architecture: {
      en: 'Multi-tiered pyramidal shrines set on high riverside stone plinths with domed chhatris and open arcades.',
      hi: 'ऊंचे चबूतरों पर बने बहुमंजिला पिरामिडनुमा देवालय और अलंकृत गुंबद।'
    },
    bestTime: { en: 'Sunset (5:00 PM – 6:30 PM) across the Betwa boulder bridge', hi: 'सूर्यास्त के समय (सायं 5:00 से 6:30) बेतवा के पुल से' },
    timings: { en: '7:00 AM - 6:00 PM', hi: 'सुबह 7:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Included in Orchha Composite Ticket', hi: 'ओरछा समग्र टिकट में सम्मिलित' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Pleasant stone garden walkway along the riverbank.', hi: 'नदी किनारे सुगम पाषाण मार्ग।' },
    photographyTips: { en: 'Cross the low concrete bridge to the opposite bank for the postcard reflection shot at dusk.', hi: 'नदी के उस पार जाकर शाम के समय जल में छतरियों के प्रतिबिंब का क्लासिक फोटो लें।' },
    safetyTips: { en: 'Respect river currents; swimming in the deep Betwa ravines is prohibited.', hi: 'नदी के तेज बहाव से सावधान रहें; गहरे पानी में न उतरें।' },
    images: [
      { url: '/images/places/orchha_palace.jpg', title: { en: 'Betwa Chhatris Sunset', hi: 'बेतवा नदी पर छतरियां' } }
    ],
    tags: ['chhatris', 'orchha', 'betwa', 'cenotaph', 'sunset', 'river', 'bundelkhand']
  },
  {
    id: 'datia_palace',
    name: 'Datia Palace (Bir Singh Dev Mahal)',
    hindiName: 'दतिया महल (वीर सिंह देव राजप्रासाद)',
    city: 'Datia',
    hindiCity: 'दतिया (बुंदेलखंड)',
    category: 'heritage',
    categoryLabel: { en: 'Seven-Storey Architectural Wonder', hi: '7 मंजिला बिना लकड़ी-लोहे का महल' },
    coordinates: [25.6702, 78.4552],
    description: {
      en: 'A colossal 7-storey palace built purely of stone and mortar with zero wood or iron, cited by Sir Edwin Lutyens as one of the finest architectural designs in the world.',
      hi: 'बिना लकड़ी या लोहे के केवल पत्थर और गारे से बना 7 मंजिला यह विशाल महल सर एडविन लुटियंस द्वारा दुनिया के श्रेष्ठतम स्थापत्यों में गिना गया था।'
    },
    travelCause: {
      en: 'Admire the astonishing symmetry of 440 rooms, hanging balconies, and Bundela wall murals that remained uninhabited for centuries.',
      hi: '440 कमरों की अदभुत सममिति, झरोखे, और बुंदेला शैली के भित्तिचित्र जो सदियों से अछूते हैं।'
    },
    deepHistory: {
      en: 'Commissioned in 1614 CE by Raja Bir Singh Dev of Orchha to host Mughal Emperor Jahangir. Jahangir only stayed here a single night, and the palace was never permanently inhabited.',
      hi: '1614 ईस्वी में राजा वीर सिंह देव द्वारा सम्राट जहाँगीर के स्वागत में बनवाया गया। जहाँगीर केवल एक रात रुका और यह महल कभी आबाद नहीं हुआ।'
    },
    architecture: {
      en: 'Swastika cross ground-plan, central 5-storey bridge-linked pavilion, 52 domed cupolas, and exquisite floral wall murals.',
      hi: 'स्वास्तिक योजना, मध्य में 5 मंजिला केंद्रीय महल, 52 गुंबद और बारीक बुंदेली चित्रकारी।'
    },
    bestTime: { en: 'Morning 9:00 AM – 1:00 PM for viewing interior fresco colors', hi: 'सुबह 9:00 से दोपहर 1:00 बजे' },
    timings: { en: '8:00 AM - 5:00 PM', hi: 'सुबह 8:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Ground courtyard accessible; upper levels via stone staircases.', hi: 'भूतल सुगम; ऊपरी मंजिलों पर पुरानी सीढ़ियां।' },
    photographyTips: { en: 'Capture the central courtyards looking upwards to appreciate the floating bridge architecture.', hi: 'प्रांगण के केंद्र से ऊपर देखकर तैरते हुए पाषाण पुलों की सममित तस्वीर लें।' },
    safetyTips: { en: 'Located 30 km from Jhansi on the Gwalior-Jhansi highway; easily visited en route to Orchha.', hi: 'ग्वालियर-झांसी हाईवे पर स्थित; ओरछा जाते समय रास्ते में आसानी से घूमें।' },
    images: [
      { url: '/images/places/orchha_palace.jpg', title: { en: 'Datia Palace Elevation', hi: 'दतिया वीर सिंह देव महल' } }
    ],
    tags: ['datia', 'palace', 'bir singh dev', 'bundelkhand', 'lutyens', 'heritage']
  },

  // --- MALWA (CHANDERI) ---
  {
    id: 'koshak_mahal_chanderi',
    name: 'Koshak Mahal',
    hindiName: 'कोषक महल (चंदेरी)',
    city: 'Chanderi',
    hindiCity: 'चंदेरी (मालवा)',
    category: 'heritage',
    categoryLabel: { en: '15th-Century Malwa Palace', hi: '15वीं सदी का मालवा स्थापत्य' },
    coordinates: [24.7170, 78.1180],
    description: {
      en: 'A stately square monument commissioned in 1445 CE by the Sultan of Malwa, featuring four grand vaulted wings pierced by exquisite Islamic arched windows and balconies.',
      hi: '1445 ईस्वी में मालवा के सुल्तान महमूद खिलजी द्वारा निर्मित चौकोर महल, जिसके चार भव्य मेहराबदार पंख चंदेरी की स्थापत्य कला का शिखर हैं।'
    },
    travelCause: {
      en: 'Explore the grand arched corridors and learn the fascinating chronicle recorded by Emperor Babur in the Baburnama during his 1528 siege.',
      hi: 'विशाल मेहराबदार गलियारों का दीदार और बाबरनामा में दर्ज चंदेरी के ऐतिहासिक विवरणों का साक्षात दर्शन।'
    },
    deepHistory: {
      en: 'Ordered by Sultan Mahmud Khilji of Malwa in 1445 CE as a seven-storey victory mansion; three storeys survived the ravages of medieval sieges.',
      hi: '1445 में मालवा के सुल्तान महमूद खिलजी द्वारा कालपी की विजय स्मृति में 7 मंजिला बनवाना तय हुआ था, जिसमें से 3 मंजिलें आज भी सुरक्षित हैं।'
    },
    architecture: {
      en: 'Local white and yellow sandstone ashlar masonry divided into four equal quadrants connected by overhead corridors and barrel-vaulted ceiling bays.',
      hi: 'सफेद व पीले बलुआ पत्थर से बने चार बराबर खंड जो ऊपर पाषाण गलियारों से जुड़े हैं।'
    },
    bestTime: { en: 'Morning 8:00 AM – 11:30 AM (Soft sunlight highlighting yellow sandstone)', hi: 'सुबह 8:00 से 11:30 बजे पीले पत्थरों की चमक देखने हेतु' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Beautiful landscaped ASI garden with flat paved walkways all around.', hi: 'चारों ओर सुंदर हरा-भरा ASI बगीचा और समतल रास्ते।' },
    photographyTips: { en: 'Position yourself at the intersection of the four cross-corridors for incredible symmetrical arch photography.', hi: 'चारों गलियारों के केंद्र में खड़े होकर मेहराबों की सममित तस्वीरें लें।' },
    safetyTips: { en: 'Combine with Chanderi Fort, Badal Mahal Gate, and handloom saree weaver clusters in a 1-day itinerary.', hi: 'चंदेरी किला, बादल महल और चंदेरी साड़ी बुनकरों के साथ 1 दिन में घूमें।' },
    images: [
      { url: '/images/places/koshak_mahal.jpg', title: { en: 'Koshak Mahal Chanderi', hi: 'कोषक महल चंदेरी' } }
    ],
    tags: ['koshak mahal', 'chanderi', 'malwa', 'sultanate', 'heritage', 'architecture']
  },
  {
    id: 'chanderi_fort_kirti_durg',
    name: 'Chanderi Fort (Kirti Durg)',
    hindiName: 'चंदेरी किला (कीर्ति दुर्ग)',
    city: 'Chanderi',
    hindiCity: 'चंदेरी (मालवा)',
    category: 'heritage',
    categoryLabel: { en: 'Hilltop Malwa Fortress', hi: 'पहाड़ी पर स्थित ऐतिहासिक दुर्ग' },
    coordinates: [24.7235, 78.1384],
    description: {
      en: 'Dominating a 200-meter hill above the medieval town of Chanderi, featuring the solemn Jauhar Smarak, the monumental Hawa Mahal, and panoramic views of lakes and valleys.',
      hi: 'चंदेरी शहर से 200 मीटर ऊंची पहाड़ी पर स्थित यह दुर्ग जौहर स्मारक, हवा महल और प्राकृतिक झीलों के विहंगम दृश्यों हेतु प्रसिद्ध है।'
    },
    travelCause: {
      en: 'Historic site of Medini Rai\'s valiant defense against Babur in 1528 and the memorial to Rajput queens who performed Jauhar.',
      hi: '1528 में बाबर के आक्रमण के विरुद्ध मेदिनी राय के शौर्य और राजपूत वीरांगनाओं के पावन जौहर का साक्षी।'
    },
    deepHistory: {
      en: 'Built in the 11th century by Pratihara King Kirtipal. Mentioned in the Mahabharata as Chedi kingdom ruled by King Shishupala.',
      hi: '11वीं सदी में प्रतिहार राजा कीर्तिपाल द्वारा निर्मित। महाभारत कालीन चेदि राज्य की राजधानी।'
    },
    architecture: {
      en: '5-kilometer-long stone rampart pierced by Khooni Darwaza (Gate of Blood) and crowned with open chhatris.',
      hi: '5 किमी लंबा पाषाण परकोटा, खूनी दरवाजा और हवा महल की छतरियां।'
    },
    bestTime: { en: 'Late afternoon 4:00 PM – 6:00 PM for sunset over Chanderi lake', hi: 'सायं 4:00 से 6:00 बजे झीलों पर सूर्यास्त देखने हेतु' },
    timings: { en: '6:30 AM - 6:00 PM', hi: 'सुबह 6:30 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Metalled road leads up to fort entrance gate; uneven walking terrain inside.', hi: 'किले के द्वार तक पक्की सड़क जाती है।' },
    photographyTips: { en: 'Frame the town of Chanderi and its historic stepwells from the high ramparts near Hawa Mahal.', hi: 'हवा महल के पास से प्राचीन चंदेरी शहर और बावडियों का विस्तृत दृश्य लें।' },
    safetyTips: { en: 'Hire local MP Tourism certified guide to discover the hidden stepwells and step-tanks.', hi: 'स्थानीय गाइड लेकर प्राचीन बावडियों का इतिहास समझें।' },
    images: [
      { url: '/images/places/chanderi_fort.jpg', title: { en: 'Chanderi Fort Ramparts', hi: 'चंदेरी दुर्ग' } }
    ],
    tags: ['chanderi', 'fort', 'kirti durg', 'jauhar', 'malwa', 'babur', 'heritage']
  },
  {
    id: 'pranpur_handloom_village',
    name: 'Pranpur Handloom Craft Village',
    hindiName: 'प्रानपुर हैंडलूम शिल्प ग्राम (चंदेरी साड़ी)',
    city: 'Chanderi',
    hindiCity: 'चंदेरी (मालवा)',
    category: 'craft',
    categoryLabel: { en: 'Traditional GI Craft Hub', hi: 'पारंपरिक चंदेरी बुनकर ग्राम' },
    coordinates: [24.7300, 78.1500],
    description: {
      en: 'India\'s first craft tourism village where nearly every home operates pit looms weaving world-renowned Chanderi silk, cotton, and zari sarees with GI certification.',
      hi: 'भारत का पहला शिल्प पर्यटन ग्राम, जहाँ घर-घर में हथकरघे पर विश्वप्रसिद्ध जीआई टैग प्राप्त चंदेरी सिल्क, कॉटन और ज़री की साड़ियां बुनी जाती हैं।'
    },
    travelCause: {
      en: 'Interact directly with Master Weavers, watch the intricate throwing shuttle and warp-weft zari artistry, and purchase authentic sarees directly from artisans.',
      hi: 'मास्टर बुनकरों से सीधा संवाद, हथकरघा बुनाई की कला देखना और प्रामाणिक चंदेरी साड़ियों की सीधी खरीदारी।'
    },
    deepHistory: {
      en: 'Weaving in Chanderi dates back to the 2nd century BCE, patronized extensively by Scindia and Mughal royals.',
      hi: 'चंदेरी बुनाई का इतिहास 2री सदी ईसा पूर्व से है, जिसे बाद में सिंधिया व मुगल राजघरानों का विशेष संरक्षण मिला।'
    },
    architecture: {
      en: 'Rustic stone cottages with dedicated loom pits and open courtyards designed for stretching fine silk yarn.',
      hi: 'पारंपरिक पत्थर के मकान जिनमें हथकरघे और धागा सुखाने के खुले आंगन हैं।'
    },
    bestTime: { en: '10:00 AM – 5:00 PM on weekdays when looms are actively humming', hi: 'सुबह 10:00 से शाम 5:00 बजे जब करघे चल रहे होते हैं' },
    timings: { en: '9:00 AM - 6:00 PM', hi: 'सुबह 9:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry to craft village', hi: 'गाँव में प्रवेश निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Narrow village lanes; walking is the best way to explore.', hi: 'गाँव की गलियों में पैदल चलना सबसे अच्छा है।' },
    photographyTips: { en: 'Photograph colorful spools of silk thread and close-ups of delicate gold zari motifs on the loom.', hi: 'रंग-बिरंगे रेशम के धागों और ज़री की बुनाई के मैक्रो शॉट लें।' },
    safetyTips: { en: 'Ensure authenticity by checking the official Handloom Mark and Silk Mark tags.', hi: 'साड़ी खरीदते समय हैंडलूम मार्क और सिल्क मार्क अवश्य देखें।' },
    images: [
      { url: '/images/places/koshak_mahal.jpg', title: { en: 'Chanderi Saree Weaving', hi: 'चंदेरी साड़ी बुनाई' } }
    ],
    tags: ['chanderi', 'saree', 'pranpur', 'craft', 'handloom', 'artisan', 'malwa']
  },

  // --- UNESCO WORLD HERITAGE & ICONIC MP SITES ---
  {
    id: 'khajuraho_western_temples',
    name: 'Khajuraho Western Group of Temples',
    hindiName: 'खजुराहो पश्चिमी मंदिर समूह (यूनेस्को)',
    city: 'Khajuraho',
    hindiCity: 'खजुराहो (छतरपुर)',
    category: 'heritage',
    categoryLabel: { en: 'UNESCO World Heritage', hi: 'यूनेस्को विश्व धरोहर' },
    coordinates: [24.8530, 79.9197],
    description: {
      en: 'A UNESCO World Heritage marvel featuring Kandariya Mahadeva and Lakshmana temples, celebrated globally for exquisite stone carvings celebrating human life, devotion, and cosmic balance.',
      hi: 'यूनेस्को विश्व धरोहर स्थल, जिसमें कंदारिया महादेव और लक्ष्मण मंदिर शामिल हैं। अपनी अद्वितीय पाषाण नक्काशी, सौंदर्यशास्त्र और नागर स्थापत्य हेतु विश्वविख्यात।'
    },
    travelCause: {
      en: 'Witness the pinnacle of medieval Indian stone sculpture: soaring spire temples rising like mountain peaks covered in tens of thousands of relief statues.',
      hi: 'मध्यकालीन भारतीय मूर्तिकला का सर्वोच्च शिखर, कंदारिया महादेव का गगनचुंबी शिखर और वार्षिक खजुराहो नृत्य समारोह।'
    },
    deepHistory: {
      en: 'Built between 950 and 1050 CE by the Chandela Rajput dynasty. Preserved by dense forests after the fall of the Chandelas until rediscovered in 1838.',
      hi: '950 से 1050 ईस्वी के मध्य चंदेल राजपूत राजाओं द्वारा निर्मित। जंगलों में छिपे रहने के कारण सदियों तक सुरक्षित रहे।'
    },
    architecture: {
      en: 'Panchayatana Nagara architecture on high stone jagati terraces with saptaratha layout and soaring mountain-like shikhara spires.',
      hi: 'ऊंचे चबूतरे पर नागर पंचायतन शैली, सप्तरथ विन्यास और पर्वत सदृश शिखर।'
    },
    bestTime: { en: 'October to March (February during the Khajuraho Dance Festival)', hi: 'अक्टूबर से मार्च (फरवरी में खजुराहो नृत्य समारोह)' },
    timings: { en: 'Sunrise to Sunset (6:00 AM - 6:00 PM)', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹40 for Indians, ₹600 for Foreigners', hi: 'भारतीय: ₹40, विदेशी: ₹600' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Extensive manicured gardens with smooth pathways; ramps at museum.', hi: 'सुंदर बगीचे और सुगम रास्ते; संग्रहालय में रैंप।' },
    photographyTips: { en: 'Sunrise illuminates the east-facing relief statues with radiant warm light.', hi: 'सूर्योदय के समय पूर्व दिशा की मूर्तियों पर स्वर्णिम प्रकाश पड़ता है।' },
    safetyTips: { en: 'Connected via Khajuraho Airport (HJR) and Vande Bharat train directly from Delhi & Bhopal.', hi: 'खजुराहो हवाई अड्डे और वंदे भारत ट्रेन से सीधा जुड़ाव।' },
    images: [
      { url: '/images/places/khajuraho.jpg', title: { en: 'Kandariya Mahadeva Khajuraho', hi: 'कंदारिया महादेव खजुराहो' } }
    ],
    tags: ['khajuraho', 'unesco', 'temple', 'chandela', 'heritage', 'kandariya']
  },
  {
    id: 'sanchi_great_stupa',
    name: 'The Great Stupa of Sanchi',
    hindiName: 'सांची का महान स्तूप (यूनेस्को)',
    city: 'Sanchi',
    hindiCity: 'सांची (रायसेन)',
    category: 'buddhist',
    categoryLabel: { en: 'UNESCO Buddhist Sanctuary', hi: 'यूनेस्को बौद्ध महातीर्थ' },
    coordinates: [23.4873, 77.7394],
    description: {
      en: 'The oldest stone structure in India, commissioned by Emperor Ashoka the Great in the 3rd century BCE, adorned with four monumental torana gateways narrating the life of Buddha.',
      hi: 'भारत की सबसे प्राचीन पाषाण संरचना, 3री सदी ईसा पूर्व में सम्राट अशोक महान द्वारा निर्मित। चार भव्य तोरण द्वार भगवान बुद्ध के जातक कथाओं को दर्शाते हैं।'
    },
    travelCause: {
      en: 'A sanctuary of deep spiritual peace and profound ancient Buddhist art that influenced architecture across the entire Asian continent.',
      hi: 'गहरे आध्यात्मिक शांति का केंद्र, अशोक के चार सिंहों वाला स्तंभ और प्राचीन बौद्ध कला का उद्गम।'
    },
    deepHistory: {
      en: 'Commissioned by Emperor Ashoka over the relics of the Buddha. Later embellished by the Shungas and Satavahanas with exquisite stone railings and toranas.',
      hi: 'सम्राट अशोक द्वारा बुद्ध के अवशेषों पर निर्मित, शुंग व सातवाहन काल में तोरण द्वारों से सुसज्जित।'
    },
    architecture: {
      en: 'Monumental hemispherical sandstone dome with circular pradakshina path, crowned by a stone chhatravali umbrella and four carved torana gateways.',
      hi: 'अर्धगोलाकार बलुआ पत्थर का महास्तूप, प्रदक्षिणा पथ और चार अलंकृत तोरण द्वार।'
    },
    bestTime: { en: 'October to March (Morning 8:00 AM – 11:00 AM for tranquil meditation and quiet exploration)', hi: 'अक्टूबर से मार्च (सुबह 8:00 से 11:00 बजे शांत वातावरण में)' },
    timings: { en: '6:30 AM - 6:30 PM', hi: 'सुबह 6:30 से शाम 6:30 बजे' },
    entryFee: { en: '₹40 for Indians, ₹600 for Foreigners', hi: 'भारतीय: ₹40, विदेशी: ₹600' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'ASI paved pathways around the hill and stupa terraces.', hi: 'पहाड़ी और स्तूप के चारों ओर पक्के रास्ते।' },
    photographyTips: { en: 'Capture the intricate relief carvings of the Southern and Northern gateways in morning light.', hi: 'सुबह की धूप में उत्तरी और दक्षिणी तोरण द्वारों की बारीक नक्काशी का फोटो लें।' },
    safetyTips: { en: 'Located 46 km northeast of Bhopal; easily visited in a half-day trip by road or local train.', hi: 'भोपाल से मात्र 46 किमी उत्तर-पूर्व; सड़क या ट्रेन से 1 घंटे में पहुंचें।' },
    images: [
      { url: '/images/places/sanchi.jpg', title: { en: 'Sanchi Great Stupa', hi: 'सांची का स्तूप' } }
    ],
    tags: ['sanchi', 'stupa', 'buddhist', 'ashoka', 'unesco', 'heritage']
  },
  {
    id: 'bhimbetka_rock_shelters',
    name: 'Bhimbetka Prehistoric Rock Shelters',
    hindiName: 'भीमबेटका शैलचित्र गुफाएं (यूनेस्को)',
    city: 'Bhopal',
    hindiCity: 'रायसेन (भोपाल के निकट)',
    category: 'heritage',
    categoryLabel: { en: '30,000-Year-Old Rock Art', hi: '30,000 वर्ष प्राचीन पाषाण चित्र' },
    coordinates: [22.9372, 77.6128],
    description: {
      en: 'A UNESCO World Heritage site exhibiting prehistoric rock paintings spanning over 30,000 years, documenting human civilization\'s earliest artistic expressions in natural red and white pigments.',
      hi: 'यूनेस्को विश्व धरोहर, जहाँ 30,000 वर्ष पुराने प्रागैतिहासिक शैलचित्र मानव सभ्यता के सबसे प्राचीन कलात्मक प्रमाण प्रस्तुत करते हैं।'
    },
    travelCause: {
      en: 'Walk through colossal sandstone crags to see ancient paintings of hunting scenes, dancing, horses, and elephants painted by Ice Age hunters.',
      hi: 'हिमयुग के आदिमानव द्वारा बनाए गए शिकार, नृत्य और वन्यजीवों के सजीव प्राकृतिक चित्रों का साक्षात दर्शन।'
    },
    deepHistory: {
      en: 'Inhabited from the Paleolithic to Mesolithic periods. Discovered in 1957 by eminent Indian archaeologist Dr. V.S. Wakankar.',
      hi: 'पुरापाषाण काल से मध्यपाषाण काल तक आबाद। 1957 में प्रसिद्ध पुरातत्वविद् डॉ. विष्णु श्रीधर वाकणकर द्वारा खोजा गया।'
    },
    architecture: {
      en: 'Naturally weathered massive sandstone overhangs and labyrinthine rock caves surrounded by dense teak forest in the Vindhyan range.',
      hi: 'विंध्याचल पर्वत श्रृंखला में प्राकृतिक बलुआ पत्थर की गुफाएं और बीहड़ वन।'
    },
    bestTime: { en: 'October to March (Morning 9:00 AM – 1:00 PM)', hi: 'अक्टूबर से मार्च (सुबह 9:00 से दोपहर 1:00)' },
    timings: { en: '7:00 AM - 6:00 PM', hi: 'सुबह 7:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Elevated wooden and stone boardwalk connects all 15 major open shelters.', hi: '15 प्रमुख गुफाओं को जोड़ने वाला पक्का वॉकवे।' },
    photographyTips: { en: 'Flash photography strictly prohibited to preserve pigments; use higher ISO in natural light.', hi: 'रंगों की सुरक्षा हेतु फ्लैश वर्जित; प्राकृतिक प्रकाश में फोटो लें।' },
    safetyTips: { en: 'Located 45 km south of Bhopal on the Hoshangabad highway. Combine with Bhojpur Shiva Temple.', hi: 'भोपाल से 45 किमी दक्षिण। रास्ते में भोजपुर के विशाल शिव मंदिर के साथ घूमें।' },
    images: [
      { url: '/images/places/sanchi.jpg', title: { en: 'Bhimbetka Cave Shelters', hi: 'भीमबेटका गुफाएं' } }
    ],
    tags: ['bhimbetka', 'rock art', 'prehistoric', 'unesco', 'bhopal', 'heritage']
  },
  {
    id: 'ujjain_mahakaleshwar',
    name: 'Shri Mahakaleshwar Jyotirlinga & Mahakal Lok',
    hindiName: 'श्री महाकालेश्वर ज्योतिर्लिंग एवं महाकाल लोक',
    city: 'Ujjain',
    hindiCity: 'उज्जैन (मालवा)',
    category: 'temple',
    categoryLabel: { en: 'Dakshinmukhi Jyotirlinga', hi: 'दक्षिणमुखी महाकाल ज्योतिर्लिंग' },
    coordinates: [23.1827, 75.7682],
    description: {
      en: 'One of the twelve supreme Jyotirlingas of Lord Shiva and the only one that faces south (Dakshinmukhi), famous for its sacred early morning Bhasma Aarti and the grand 900-meter Mahakal Lok Corridor.',
      hi: 'द्वादश ज्योतिर्लिंगों में एकमात्र दक्षिणमुखी महाकाल, जिनकी विश्वविख्यात भस्म आरती और 900 मीटर लंबा भव्य महाकाल लोक कॉरिडोर पूरे देश के श्रद्धालुओं को आकर्षित करता है।'
    },
    travelCause: {
      en: 'Witness the divine Bhasma Aarti, walk through the 900-meter Shiva lore corridor with 108 sculpted pillars, and bathe at Ram Ghat on the holy Shipra river.',
      hi: 'अलौकिक भस्म आरती के दर्शन, 108 स्तंभों वाले महाकाल लोक में शिव कथाओं का दर्शन और शिप्रा नदी के रामघाट पर पावन स्नान।'
    },
    deepHistory: {
      en: 'Ancient reference in the Puranas and Kalidasa\'s Meghaduta. Reconstructed in the 18th century by Maratha general Ranoji Shinde.',
      hi: 'पुराणों और महाकवि कालिदास के मेघदूत में वर्णित। 18वीं सदी में मराठा सेनापति राणोजी शिंदे द्वारा जीर्णोद्धार।'
    },
    architecture: {
      en: 'Three-tiered temple complex with subterranean sanctum (Garbhagriha), Omkareshwar sanctum above, and Nagchandreshwar on top tier.',
      hi: 'तीन मंजिला मंदिर परिसर: भूतल पर महाकाल, प्रथम तल पर ओंकारेश्वर और शीर्ष पर नागचंद्रेश्वर।'
    },
    bestTime: { en: 'Early morning Bhasma Aarti (4:00 AM) or evening illuminated Mahakal Lok corridor', hi: 'प्रातः 4:00 बजे भस्म आरती अथवा सायं रोशनी में महाकाल लोक' },
    timings: { en: '4:00 AM - 11:00 PM', hi: 'प्रातः 4:00 से रात 11:00 बजे तक' },
    entryFee: { en: 'Free general Darshan. Special VIP/Bhasma Aarti passes online via mahakaleshwar.nic.in', hi: 'सामान्य दर्शन निःशुल्क। भस्म आरती ऑनलाइन अग्रिम बुकिंग।' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Battery cars, elevators, smooth ramps, and air-conditioned waiting halls in Mahakal Lok.', hi: 'महाकाल लोक में बैटरी कार, लिफ्ट और एसी प्रतीक्षालय।' },
    photographyTips: { en: 'Cameras allowed in Mahakal Lok corridor; inner sanctum photography restricted.', hi: 'महाकाल लोक में सुंदर मूर्तियां व रोशनी का फोटो लिया जा सकता है।' },
    safetyTips: { en: 'Book Bhasma Aarti tickets at least 15 days in advance via official temple portal.', hi: 'भस्म आरती दर्शन हेतु 15 दिन पूर्व आधिकारिक पोर्टल से अनुमति लें।' },
    images: [
      { url: '/images/places/mitawali.jpg', title: { en: 'Mahakaleshwar Ujjain', hi: 'श्री महाकालेश्वर उज्जैन' } }
    ],
    tags: ['ujjain', 'mahakal', 'jyotirlinga', 'shiva', 'mahakal lok', 'shipra']
  },
  {
    id: 'bhedaghat_dhuandhar_falls',
    name: 'Bhedaghat Marble Rocks & Dhuandhar Falls',
    hindiName: 'भेड़ाघाट संगमरमर की चट्टानें व धुआंधार जलप्रपात',
    city: 'Jabalpur',
    hindiCity: 'जबलपुर (महाकौशल)',
    category: 'waterfall',
    categoryLabel: { en: 'Marble Canyon on Narmada', hi: 'नर्मदा पर संगमरमरी घाटी' },
    coordinates: [23.1314, 79.8006],
    description: {
      en: 'A stunning 100-foot gorge carved through pure white magnesium marble by the holy Narmada River, culminating in the roaring mist-shrouded Dhuandhar Falls.',
      hi: 'पवित्र नर्मदा नदी द्वारा दूधिया संगमरमर की चट्टानों को चीरकर बनाई गई 100 फीट गहरी विहंगम घाटी और गरजता हुआ धुआंधार जलप्रपात।'
    },
    travelCause: {
      en: 'Take a boat ride between towering sheer marble cliffs (especially unforgettable on full moon nights) and take the ropeway across Dhuandhar Falls.',
      hi: 'संगमरमर की चट्टानों के बीच शांत नौकायन (विशेष रूप से शरद पूर्णिमा की रात) और रोपवे से धुआंधार का विहंगम दर्शन।'
    },
    deepHistory: {
      en: 'Ancient site described in the Narmada Khand of the Skanda Purana; flanked by the 10th-century Chausath Yogini temple of the Kalachuri dynasty.',
      hi: 'स्कंद पुराण के नर्मदा खंड में वर्णित; पहाड़ी पर 10वीं सदी का कलचुरि कालीन चौसठ योगिनी मंदिर स्थित है।'
    },
    architecture: {
      en: 'Natural geological wonder carved by river erosion over millions of years, bordered by stone bathing ghats.',
      hi: 'लाखों वर्षों के जल-प्रवाह से तराशी गई संगमरमर की प्राकृतिक घाटी।'
    },
    bestTime: { en: 'October to April (Boating is magical during full moon nights; closed during monsoon)', hi: 'अक्टूबर से अप्रैल (पूर्णिमा की रात नौकायन हेतु सर्वोत्तम; मानसून में बंद)' },
    timings: { en: '6:00 AM - 7:00 PM (Ropeway: 10:00 AM - 6:00 PM)', hi: 'सुबह 6:00 से शाम 7:00 बजे (रोपवे: 10:00 से 6:00)' },
    entryFee: { en: 'Free entry to ghats; Boating: ₹100–₹500; Cable Car: ₹100', hi: 'घाट निःशुल्क; नौकायन: ₹100-500; रोपवे: ₹100' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Cable car connects both river banks; steps lead to boating docks.', hi: 'रोपवे द्वारा दोनों किनारों का जुड़ाव; नौका घाट तक सीढ़ियां।' },
    photographyTips: { en: 'Capture the mist rising like smoke (dhuan) over the roaring falls with rainbow refractions.', hi: 'धुआंधार प्रपात के ऊपर उड़ती धुंध में बनने वाले इंद्रधनुष का फोटो लें।' },
    safetyTips: { en: 'Wear life jackets on boat rides; stay strictly behind protective railings at the falls.', hi: 'नाव पर लाइफ जैकेट अवश्य पहनें; झरने के किनारे रेलिंग के पीछे रहें।' },
    images: [
      { url: '/images/places/bateshwar.jpg', title: { en: 'Dhuandhar Falls Bhedaghat', hi: 'धुआंधार जलप्रपात' } }
    ],
    tags: ['bhedaghat', 'dhuandhar', 'narmada', 'jabalpur', 'waterfall', 'nature', 'marble']
  },
  {
    id: 'mandu_jahaz_mahal',
    name: 'Jahaz Mahal & Mandu Medieval Citadel',
    hindiName: 'जहाज महल एवं मांडू दुर्ग (सिटी ऑफ जॉय)',
    city: 'Mandu',
    hindiCity: 'मांडू (धार)',
    category: 'heritage',
    categoryLabel: { en: 'City of Joy on Malwa Plateau', hi: 'आनंद नगरी (सिटी ऑफ जॉय)' },
    coordinates: [22.3664, 75.3912],
    description: {
      en: 'Known as the City of Joy, Mandu perches on an isolated plateau boasting Jahaz Mahal (Ship Palace) floating between two artificial lakes, Hindola Mahal, and Rani Roopmati\'s Pavilion.',
      hi: 'मालवा की विंध्य पहाड़ियों पर स्थित "सिटी ऑफ जॉय", जहाँ दो झीलों के बीच तैरते जहाज जैसा जहाज महल, हिंडोला महल और रानी रूपमती का मंडप है।'
    },
    travelCause: {
      en: 'Experience the legendary romance of Baz Bahadur and Rani Roopmati, medieval Afghan architecture, and breathtaking monsoon greenery.',
      hi: 'बाज बहादुर और रानी रूपमती की अमर प्रेम गाथा, मध्यकालीन अफगान वास्तुकला और मानसून में हरी-भरी वादियों का सौंदर्य।'
    },
    deepHistory: {
      en: 'Flourished in the 15th century under the Sultans of Malwa (Ghiyas-ud-din Khilji). Later praised by Mughal Emperor Jahangir as the most delightful place in Hindustan.',
      hi: '15वीं सदी में मालवा के सुल्तानों का वैभवशाली केंद्र। जहाँगीर ने अपनी आत्मकथा में मांडू के सौंदर्य की भूरि-भूरि प्रशंसा की थी।'
    },
    architecture: {
      en: 'Afghan architectural genius: slender pavilions, expansive water engineering channels, horseshoe arches, and acoustic domes.',
      hi: 'अफगान स्थापत्य, दो झीलों (कपूर व मुंज तालाब) के बीच तैरता दोमंजिला जहाज महल और ढलवां दीवारों वाला हिंडोला महल।'
    },
    bestTime: { en: 'July to March (Peak glory during the lush Monsoon and winter seasons)', hi: 'जुलाई से मार्च (मानसून में मांडू का सौंदर्य चरम पर होता है)' },
    timings: { en: 'Sunrise to Sunset (6:00 AM - 6:30 PM)', hi: 'सुबह 6:00 से शाम 6:30 बजे' },
    entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Sprawling monuments spread across 20 sq km; hire e-bikes or travel by private vehicle.', hi: 'स्मारक बड़े क्षेत्र में फैले हैं; ई-बाइक या निजी वाहन से घूमें।' },
    photographyTips: { en: 'Photograph the reflection of Jahaz Mahal across Kapur Talao with morning mist.', hi: 'कपूर तालाब के शांत जल में जहाज महल के पूर्ण प्रतिबिंब का फोटो लें।' },
    safetyTips: { en: 'Located 95 km from Indore Airport; full day needed to cover all monument groups.', hi: 'इंदौर हवाई अड्डे से 95 किमी; पूरा दिन भ्रमण हेतु रखें।' },
    images: [
      { url: '/images/places/koshak_mahal.jpg', title: { en: 'Jahaz Mahal Mandu', hi: 'जहाज महल मांडू' } }
    ],
    tags: ['mandu', 'jahaz mahal', 'city of joy', 'malwa', 'heritage', 'roopmati']
  }
];

// Pre-built Madhya Pradesh Curated Travel Circuits
export const MP_TRAVEL_ROUTES: MPRoute[] = [
  {
    id: 'chambal_heritage_circuit',
    name: {
      en: 'Chambal Heritage Corridor (Mitawali - Padhavali - Bateshwar - Kakanmath)',
      hi: 'चंबल हेरिटेज सर्किट (मितावली - पढ़ावली - बटेश्वर - ककनमठ)'
    },
    description: {
      en: 'The ultimate 4 to 6-hour archaeological expedition from Gwalior covering the Parliament-inspiring circular temple, Mini Khajuraho carvings, 200 restored Bateshwar shrines, and gravity-defying Kakanmath.',
      hi: 'ग्वालियर से 4 से 6 घंटे का विश्वस्तरीय पुरातात्विक परिपथ: संसद भवन की प्रेरणा मितावली, मिनी खजुराहो पढ़ावली, 200 मंदिरों का बटेश्वर और 115 फीट ऊंचा ककनमठ।'
    },
    cities: ['Gwalior', 'Morena'],
    waypoints: [
      [26.2183, 78.1828], // Gwalior start
      [26.4428, 78.2573], // Mitawali Chausath Yogini
      [26.4319, 78.2255], // Garhi Padhavali
      [26.4258, 78.2045], // Bateshwar Temples
      [26.5411, 78.2427], // Kakanmath Temple
      [26.2183, 78.1828]  // Return to Gwalior
    ],
    distanceKm: 85,
    recommendedDays: 1
  },
  {
    id: 'gwalior_citadel_trail',
    name: {
      en: 'Gwalior Royal Heritage Citadel Trail',
      hi: 'ग्वालियर दुर्ग एवं राजसी विरासत ट्रेल'
    },
    description: {
      en: 'Explore the 3-km cliff fortress with Man Mandir Palace, Sas Bahu temples, 100-ft Teli Ka Mandir, Jai Vilas Palace, and Tansen Tomb.',
      hi: 'मान मंदिर महल, सास-बहू मंदिर, 100 फीट ऊंचे तेली का मंदिर, जय विलास पैलेस और तानसेन मक़बरे का सम्पूर्ण एक दिवसीय भ्रमण।'
    },
    cities: ['Gwalior'],
    waypoints: [
      [26.2295, 78.1691], // Gwalior Fort & Man Mandir
      [26.2302, 78.1722], // Sas Bahu
      [26.2268, 78.1685], // Teli Ka Mandir
      [26.2048, 78.1666], // Jai Vilas Palace
      [26.2238, 78.1884]  // Tansen Tomb
    ],
    distanceKm: 18,
    recommendedDays: 1
  },
  {
    id: 'bundelkhand_royal_corridor',
    name: {
      en: 'Bundelkhand Royal Corridor (Gwalior - Datia - Orchha)',
      hi: 'बुंदेलखंड शाही परिपथ (ग्वालियर - दतिया - ओरछा)'
    },
    description: {
      en: 'From the Gwalior citadel through the 7-storey Bir Singh Dev Palace in Datia to the enchanting Betwa riverfront palaces and Ram Raja Temple of Orchha.',
      hi: 'ग्वालियर से दतिया के 7 मंजिला महल होते हुए ओरछा के जहाँगीर महल, राम राजा मंदिर और बेतवा तट की शाही छतरियों का 2 दिवसीय भ्रमण।'
    },
    cities: ['Gwalior', 'Datia', 'Orchha'],
    waypoints: [
      [26.2183, 78.1828], // Gwalior
      [25.6702, 78.4552], // Datia Palace
      [25.3508, 78.6436], // Orchha Palace
      [25.3512, 78.6418], // Ram Raja Temple
      [25.3468, 78.6425]  // Betwa Chhatris
    ],
    distanceKm: 130,
    recommendedDays: 2
  },
  {
    id: 'chanderi_heritage_handloom',
    name: {
      en: 'Chanderi Medieval Fort & Handloom Weaver Trail',
      hi: 'चंदेरी मध्यकालीन दुर्ग एवं हथकरघा बुनकर ट्रेल'
    },
    description: {
      en: 'Journey south into medieval Malwa to explore 15th-century Koshak Mahal, hilltop Kirti Durg Fort, and meet master weavers in Pranpur craft village.',
      hi: '15वीं सदी के कोषक महल, पहाड़ी कीर्ति दुर्ग, जौहर स्मारक और प्रानपुर हैंडलूम ग्राम में चंदेरी साड़ियों की बुनाई का प्रामाणिक अनुभव।'
    },
    cities: ['Orchha', 'Datia', 'Chanderi'],
    waypoints: [
      [25.3508, 78.6436], // Orchha
      [25.6702, 78.4552], // Datia
      [24.7170, 78.1180], // Koshak Mahal
      [24.7235, 78.1384], // Chanderi Fort
      [24.7300, 78.1500]  // Pranpur Weavers
    ],
    distanceKm: 145,
    recommendedDays: 2
  },
  {
    id: 'mp_golden_heritage_circuit',
    name: {
      en: 'Madhya Pradesh Golden Heritage Circuit (Gwalior - Orchha - Khajuraho)',
      hi: 'मध्य प्रदेश स्वर्णिम धरोहर परिपथ (ग्वालियर - ओरछा - खजुराहो)'
    },
    description: {
      en: 'The crown jewel tourist route of Central India connecting Rajput fortresses in Gwalior, poetic Bundela river palaces in Orchha, and UNESCO temple spires in Khajuraho.',
      hi: 'मध्य भारत का सबसे प्रतिष्ठित पर्यटन मार्ग: ग्वालियर के अभेद्य किले, ओरछा का बेतवा रिवरफ्रंट और खजुराहो के यूनेस्को विश्व धरोहर मंदिर।'
    },
    cities: ['Gwalior', 'Orchha', 'Khajuraho'],
    waypoints: [
      [26.2183, 78.1828], // Gwalior
      [25.3508, 78.6436], // Orchha
      [24.8530, 79.9197]  // Khajuraho
    ],
    distanceKm: 285,
    recommendedDays: 3
  }
];

// Dynamic route calculation between any two MP cities/landmarks
export function calculateDynamicMPRoute(fromCityName: string, toCityName: string) {
  const normalize = (s: string) => s.toLowerCase().trim();
  const fromKey = Object.keys(MP_CITY_COORDINATES).find(k => normalize(k) === normalize(fromCityName) || normalize(MP_CITY_COORDINATES[k].name) === normalize(fromCityName));
  const toKey = Object.keys(MP_CITY_COORDINATES).find(k => normalize(k) === normalize(toCityName) || normalize(MP_CITY_COORDINATES[k].name) === normalize(toCityName));

  if (!fromKey || !toKey) {
    return null;
  }

  const fromCity = MP_CITY_COORDINATES[fromKey];
  const toCity = MP_CITY_COORDINATES[toKey];

  // Great-circle Haversine formula
  const R = 6371; // km
  const dLat = (toCity.coords[0] - fromCity.coords[0]) * Math.PI / 180;
  const dLon = (toCity.coords[1] - fromCity.coords[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromCity.coords[0] * Math.PI / 180) * Math.cos(toCity.coords[0] * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // Road factor typically 1.25x for Madhya Pradesh highways
  const roadDistance = Math.round(straightDistance * 1.25);
  const travelHours = (roadDistance / 55).toFixed(1);

  // Generate intermediate road waypoints for polyline
  const steps = 6;
  const waypoints: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const lat = fromCity.coords[0] + (toCity.coords[0] - fromCity.coords[0]) * fraction;
    const lng = fromCity.coords[1] + (toCity.coords[1] - fromCity.coords[1]) * fraction;
    waypoints.push([lat, lng]);
  }

  return {
    from: fromCity,
    to: toCity,
    distanceKm: roadDistance,
    estimatedDuration: `${travelHours} hrs via Highway`,
    estimatedDrivingTime: `${travelHours} hours (${roadDistance} km)`,
    waypoints,
    recommendedHighway: 'NH44 / MP State Highway',
    highwayName: { 
      en: 'NH-44 / MP State Heritage Highway', 
      hi: 'एनएच-44 / म.प्र. राजकीय धरोहर हाईवे' 
    },
    name: {
      en: `${fromCity.name} to ${toCity.name} Highway Route`,
      hi: `${fromCity.hindi} से ${toCity.hindi} सड़क मार्ग`
    },
    recommendedStops: [
      'MP Tourism Midway Motel & Cafe (Clean restrooms & dining)',
      'Verified Highway Fuel Station & EV Charging Point',
      'Panoramic Heritage Lookout & Local Refreshments'
    ],
    roadCondition: 'Paved multi-lane expressway & state highway network with MP Tourism way-amenities.'
  };
}
