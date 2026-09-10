import { UPPlace } from '../app/services/uttarPradeshService';

export const SUPPLEMENTARY_UP_PLACES: UPPlace[] = [
  // ==================== 1. ICONIC HERITAGE & MAJOR CITIES ====================
  {
    id: 'noida_urban_hub',
    name: 'Noida (Cyber & Entertainment Hub)',
    hindiName: 'नोएडा (आधुनिक शहरी एवं मनोरंजन हब)',
    city: 'Noida',
    hindiCity: 'नोएडा',
    category: 'monument',
    categoryLabel: { en: 'Modern Urban Hub', hi: 'आधुनिक शहरी केंद्र' },
    coordinates: [28.5355, 77.3910],
    description: {
      en: 'A premier well-planned metropolis of Uttar Pradesh known for the Okhla Bird Sanctuary, world-class entertainment plazas, DLF Mall of India, and futuristic urban expressways.',
      hi: 'उत्तर प्रदेश का प्रमुख आधुनिक महानगर, जो ओखला पक्षी विहार, विश्वस्तरीय मॉल, अत्याधुनिक एक्सप्रेसवे और मनोरंजन पार्कों के लिए विख्यात है।'
    },
    travelCause: {
      en: 'Experiencing Uttar Pradesh\'s futuristic commercial prowess, premier shopping arcades, snow world attractions, and the Okhla Yamuna wetland.',
      hi: 'उत्तर प्रदेश के अत्याधुनिक विकास, अंतरराष्ट्रीय शॉपिंग मॉल और ओखला वेटलैंड में पक्षी दर्शन का अनुभव।'
    },
    deepHistory: {
      en: 'Established under the UP Industrial Area Development Act in 1976 as New Okhla Industrial Development Authority (NOIDA).',
      hi: '1976 में यूपी औद्योगिक क्षेत्र विकास अधिनियम के अंतर्गत योजनाबद्ध तरीके से स्थापित।'
    },
    architecture: { en: 'Modern high-rise glass towers and wide green boulevards', hi: 'आधुनिक गगनचुंबी इमारतें व चौड़े हरित मार्ग' },
    bestTime: { en: 'October to March; Evening leisure hours', hi: 'अक्टूबर से मार्च; सांध्य भ्रमण' },
    timings: { en: 'Open 24 hours; Malls 10:30 AM - 10:30 PM', hi: '24 घंटे; मॉल 10:30 से 10:30 बजे' },
    entryFee: { en: 'Free general access', hi: 'सामान्य प्रवेश निःशुल्क' },
    accessibilityRating: 10,
    accessibilityNotes: { en: '100% barrier-free with metro elevators, tactile paving, and ramps.', hi: 'मेट्रो, लिफ्ट और रैंप सहित पूर्णतः सुगम।' },
    photographyTips: { en: 'Futuristic night skyline illumination along the Noida-Greater Noida expressway.', hi: 'एक्सप्रेसवे और मॉल की रात्रि लाइटिंग।' },
    safetyTips: { en: 'Use registered app cabs or Delhi/Noida Metro for safe transit.', hi: 'सफर हेतु मेट्रो या पंजीकृत कैब का प्रयोग करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Noida Cityscape & Architecture', hi: 'नोएडा शहर एवं आधुनिक परिवेश' } }],
    tags: ['noida', 'gautam buddha nagar', 'delhi ncr', 'mall of india', 'okhla', 'monument', 'नोएडा']
  },
  {
    id: 'meerut_1857_memorial',
    name: 'Meerut (1857 Mutiny Memorial & Augharnath)',
    hindiName: 'मेरठ (1857 क्रांति स्मारक एवं औघड़नाथ मंदिर)',
    city: 'Meerut',
    hindiCity: 'मेरठ',
    category: 'monument',
    categoryLabel: { en: 'Historical Freedom Memorial', hi: 'क्रांति तीर्थ एवं ऐतिहासिक केंद्र' },
    coordinates: [28.9845, 77.7064],
    description: {
      en: 'The historic cradle of India\'s 1857 First War of Independence where sepoy soldiers rebelled at the sacred Kali Paltan Mandir (Augharnath Temple).',
      hi: '1857 के प्रथम स्वतंत्रता संग्राम की उद्गम स्थली, जहां ऐतिहासिक काली पलटन मंदिर (औघड़नाथ) से क्रांति की ज्वाला जली थी।'
    },
    travelCause: {
      en: 'Honoring the 1857 freedom martyrs at the Shahid Smarak museum, viewing the eternal revolutionary flame, and worshiping the Swayambhu Shiva Lingam.',
      hi: 'शहीद स्मारक पर 1857 के अमर बलिदानियों को नमन और स्वयंभू औघड़नाथ शिवलिंग के दर्शन।'
    },
    deepHistory: {
      en: 'On May 10, 1857, Indian sepoys led the historic rebellion against the British East India Company here.',
      hi: '10 मई 1857 को भारतीय सैनिकों ने कंपनी शासन के विरुद्ध ऐतिहासिक विद्रोह का शंखनाद किया था।'
    },
    architecture: { en: 'Colonial brick cantonment memorials and ancient Hindu temple spires', hi: 'ऐतिहासिक स्मारक एवं प्राचीन मंदिर शिखर' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 9:00 PM', hi: 'सुबह 6:00 से रात 9:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Flat cantonment pathways and temple courtyard ramps.', hi: 'समतल रास्ते व रैंप सुविधा उपलब्ध।' },
    photographyTips: { en: 'The 1857 Amar Jawan Jyoti pillar and archival gallery exhibits.', hi: 'अमर जवान ज्योति स्तंभ और ऐतिहासिक प्रदर्शनी।' },
    safetyTips: { en: 'Maintain solemnity inside the war memorial and museum grounds.', hi: 'शहीद स्मारक परिसर में गरिमा बनाए रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Meerut 1857 Freedom Memorial', hi: 'मेरठ 1857 क्रांति स्मारक' } }],
    tags: ['meerut', 'augharnath', 'shahid smarak', '1857', 'freedom', 'kali paltan', 'मेरठ']
  },
  {
    id: 'bareilly_cultural_hub',
    name: 'Bareilly (Zari Zardozi & Nath Nagari)',
    hindiName: 'बरेली (नाथ नगरी एवं ज़री-ज़रदोज़ी शिल्प केंद्र)',
    city: 'Bareilly',
    hindiCity: 'बरेली',
    category: 'craft',
    categoryLabel: { en: 'Cultural & Craft Capital', hi: 'शिल्प व सांस्कृतिक केंद्र' },
    coordinates: [28.3670, 79.4304],
    description: {
      en: 'Famous as "Nath Nagari" guarded by seven ancient Shiva temples, and world-renowned for exquisite GI-tagged Zari-Zardozi gold embroidery craft and Manjha.',
      hi: 'सात प्राचीन शिव मंदिरों से सुरक्षित "नाथ नगरी" और विश्वप्रसिद्ध जीआई-टैग ज़री-ज़रदोज़ी कशीदाकारी शिल्प की नगरी।'
    },
    travelCause: {
      en: 'Spiritual parikrama of the sacred Sapta Nath temples (Alakhnath, Trivatinath, Madhinath) and shopping authentic gold thread Zari textiles.',
      hi: 'सप्त नाथ मंदिरों (अलखनाथ, त्रिवटीनाथ आदि) के दिव्य दर्शन एवं प्रामाणिक ज़री-ज़रदोज़ी परिधानों की खरीदारी।'
    },
    deepHistory: {
      en: 'Founded in 1537 by Mughal chieftain Jagat Singh Katehriya and later named after his sons Bansaldev and Baraldev.',
      hi: '1537 में स्थापित ऐतिहासिक रुहेलखंड का प्रमुख सांस्कृतिक व व्यापारिक केंद्र।'
    },
    architecture: { en: 'Ancient temple mandapas and bustling heritage textile bazaars', hi: 'प्राचीन मंदिर मंडप व पारंपरिक कपड़ा बाज़ार' },
    bestTime: { en: 'October to February', hi: 'अक्टूबर से फरवरी' },
    timings: { en: 'Temples 5:00 AM - 10:00 PM; Bazaars 11:00 AM - 9:00 PM', hi: 'मंदिर प्रातः 5:00 से रात 10:00; बाज़ार 11:00 से 9:00' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved temple courtyards with easy auto-rickshaw drop-offs.', hi: 'मंदिरों तक सुगम वाहन पहुंच।' },
    photographyTips: { en: 'Artisans hand-weaving delicate gold Zari motifs on wooden adda frames.', hi: 'लकड़ी के अड्डों पर ज़री बुनते शिल्पकारों के चित्र।' },
    safetyTips: { en: 'Purchase genuine GI-tagged handloom Zardozi from authorized artisan cooperatives.', hi: 'अधिकृत बुनकर केंद्रों से ही प्रामाणिक वस्त्र खरीदें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', title: { en: 'Bareilly Zari Zardozi Art', hi: 'बरेली ज़री ज़रदोज़ी शिल्प' } }],
    tags: ['bareilly', 'nath nagari', 'zari', 'alakhnath', 'ruhelkhand', 'craft', 'बरेली']
  },
  {
    id: 'aligarh_amu_heritage',
    name: 'Aligarh (Historic AMU & Lock Craft City)',
    hindiName: 'अलीगढ़ (ऐतिहासिक एएमयू एवं ताला नगरी)',
    city: 'Aligarh',
    hindiCity: 'अलीगढ़',
    category: 'heritage',
    categoryLabel: { en: 'Academic Heritage & Craft', hi: 'शैक्षणिक विरासत एवं शिल्प केंद्र' },
    coordinates: [27.8974, 78.0880],
    description: {
      en: 'Home to the magnificent Indo-Saracenic campus of Aligarh Muslim University (AMU), the historic Aligarh Fort (Kot), and India\'s century-old brass lock foundry tradition.',
      hi: 'इंडो-सारासेनिक वास्तुकला से सुसज्जित अलीगढ़ मुस्लिम विश्वविद्यालय, ऐतिहासिक अलीगढ़ दुर्ग और पीतल ताला उद्योग का विश्वविख्यात केंद्र।'
    },
    travelCause: {
      en: 'Exploring Sir Syed Hall, Strachey Hall\'s British-Mughal arches, Maulana Azad Library (rare manuscripts), and buying legendary handcrafted brass locks.',
      hi: 'स्ट्रेची हॉल की भव्य मेहराबों, मौलाना आज़ाद लाइब्रेरी की पांडुलिपियों के दर्शन व पारंपरिक पीतल के तालों की खरीदारी।'
    },
    deepHistory: {
      en: 'Founded by Sir Syed Ahmad Khan in 1875 as Muhammadan Anglo-Oriental College, becoming a premier central university in 1920.',
      hi: '1875 में सर सैयद अहमद खान द्वारा स्थापित ऐतिहासिक विश्वविद्यालय।'
    },
    architecture: { en: 'Splendid Indo-Saracenic red-brick domes, gothic lancets, and Mughal arches', hi: 'इंडो-सारासेनिक लाल ईंट गुंबद व मेहराब' },
    bestTime: { en: 'November to February', hi: 'नवंबर से फरवरी' },
    timings: { en: '9:00 AM - 5:00 PM (University Campus)', hi: 'सुबह 9:00 से सायं 5:00 बजे' },
    entryFee: { en: 'Free entry (Visitors pass for library)', hi: 'सामान्य प्रवेश निःशुल्क' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Wide paved university walkways and wheelchair ramps across all halls.', hi: 'चौड़े पक्के मार्ग और रैंप सुलभता।' },
    photographyTips: { en: 'Strachey Hall facade during morning golden sunlight.', hi: 'सुबह की धूप में स्ट्रेची हॉल का विहंगम दृश्य।' },
    safetyTips: { en: 'Carry photo ID for campus and library visitor access.', hi: 'कैंपस में प्रवेश हेतु पहचान पत्र साथ रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'AMU Indo-Saracenic Heritage', hi: 'एएमयू ऐतिहासिक वास्तुकला' } }],
    tags: ['aligarh', 'amu', 'locks', 'strachey hall', 'heritage', 'sir syed', 'अलीगढ़']
  },
  {
    id: 'aligarh_fort_kot',
    name: 'Aligarh Fort (Bona Chhur Fort)',
    hindiName: 'अलीगढ़ का किला (बौना छुर दुर्ग)',
    city: 'Aligarh',
    hindiCity: 'अलीगढ़',
    category: 'heritage',
    categoryLabel: { en: 'Historic Hilltop Fortress', hi: 'ऐतिहासिक प्राचीन दुर्ग' },
    coordinates: [27.9175, 78.0658],
    description: {
      en: 'One of the strongest medieval mud-and-stone bastions in India, originally built in 1524 by Muhammad Uz-Zubair and fortified by French military engineers for the Marathas.',
      hi: 'भारत के सबसे मजबूत मध्यकालीन किलों में से एक, जिसका पुनर्निर्माण 18वीं सदी में मराठों और फ्रांसीसी इंजीनियरों द्वारा कराया गया था।'
    },
    travelCause: {
      en: 'Walking along the deep polygon moat, massive corner bastions, and viewing panoramic views over the Aligarh countryside.',
      hi: 'गहरी खाई (moat), विशाल बुर्जों और ऐतिहासिक सैन्य वास्तुकला का अवलोकन।'
    },
    deepHistory: {
      en: 'Captured by the British East India Company under Lord Lake in the fierce Battle of Ally Ghur on September 4, 1803.',
      hi: '1803 में ब्रिटिश सेना और मराठों के बीच हुए प्रसिद्ध अलीगढ़ युद्ध का साक्षी।'
    },
    architecture: { en: 'Hexagonal polygonal bastion with deep subterranean moat', hi: 'षट्कोणीय बुर्ज और गहरी जल-खाई' },
    bestTime: { en: 'October to March; Morning hours', hi: 'अक्टूबर से मार्च; प्रातःकाल' },
    timings: { en: '9:00 AM - 5:30 PM', hi: 'सुबह 9:00 से शाम 5:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Approached via stone ramparts; uneven terrain in inner quarters.', hi: 'पत्थरों के रास्ते; भीतरी भाग में सावधानी रखें।' },
    photographyTips: { en: 'Wide-angle shots of the outer moat and imposing gate arches.', hi: 'बाहरी खाई और विशाल प्रवेश द्वार के चित्र।' },
    safetyTips: { en: 'Avoid isolated overgrown ramparts during dusk.', hi: 'शाम के समय एकांत कोनों में न जाएं।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Aligarh Fort Ramparts', hi: 'अलीगढ़ किले के विशाल परकोटे' } }],
    tags: ['aligarh fort', 'kot', 'maratha', '1803', 'heritage', 'किला', 'अलीगढ़']
  },
  {
    id: 'fatehpur_sikri_unesco',
    name: 'Fatehpur Sikri (Buland Darwaza & Chishti Dargah)',
    hindiName: 'फतेहपुर सीकरी (बुलंद दरवाज़ा व सलीम चिश्ती दरगाह)',
    city: 'Agra',
    hindiCity: 'आगरा',
    category: 'heritage',
    categoryLabel: { en: 'UNESCO World Heritage City', hi: 'यूनेस्को विश्व धरोहर नगरी' },
    coordinates: [27.0944, 77.6678],
    description: {
      en: 'The legendary 16th-century red sandstone imperial capital built by Mughal Emperor Akbar, featuring the towering 54m Buland Darwaza and white marble shrine of Sheikh Salim Chishti.',
      hi: 'सम्राट अकबर द्वारा 16वीं शताब्दी में बसाई गई लाल बलुआ पत्थर की भव्य राजधानी, जिसमें 54 मीटर ऊंचा बुलंद दरवाज़ा और हज़रत सलीम चिश्ती की श्वेत संगमरमर दरगाह है।'
    },
    travelCause: {
      en: 'Walking under the world\'s highest gateway (Buland Darwaza), tying sacred vow threads (mannat) on the marble jali screens of Chishti Dargah, and exploring Panch Mahal.',
      hi: 'विश्व के सबसे ऊंचे प्रवेश द्वार के दर्शन, चिश्ती दरगाह की संगमरमर जालियों पर मन्नत का धागा बांधना और पंचमहल की वास्तुकला देखना।'
    },
    deepHistory: {
      en: 'Served as the capital of the Mughal Empire from 1571 to 1585, constructed to honor the Sufi saint who prophesied the birth of Prince Salim (Jahangir).',
      hi: '1571 से 1585 तक मुग़ल साम्राज्य की राजधानी रही; यूनेस्को द्वारा विश्व धरोहर घोषित।'
    },
    architecture: { en: 'Finest synthesis of Hindu Rajput and Mughal red sandstone architecture', hi: 'राजपूत एवं मुग़ल वास्तुकला का अनुपम संगम' },
    bestTime: { en: 'Sunrise to Sunset; October to March', hi: 'सूर्योदय से सूर्यास्त; अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 6:30 PM (Daily)', hi: 'सुबह 6:00 से शाम 6:30 बजे' },
    entryFee: { en: '₹50 Indians, ₹650 Foreigners (Online ASI discount: ₹35)', hi: '₹50 भारतीय, ₹650 विदेशी' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Golf carts available from car parking to Buland Darwaza; ramps at Jama Masjid.', hi: 'पार्किंग से ई-कार्ट सुविधा और रैंप उपलब्ध।' },
    photographyTips: { en: 'Framing the white marble Chishti tomb through the red sandstone archways.', hi: 'लाल बलुआ पत्थर की मेहराबों से संगमरमर दरगाह का फ्रेम।' },
    safetyTips: { en: 'Avoid unauthorized local guide touts; book official ASI audio guides at the counter.', hi: 'अनधिकृत गाइडों से बचें; केवल अधिकृत काउंटर का प्रयोग करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Buland Darwaza, Fatehpur Sikri', hi: 'बुलंद दरवाज़ा, फतेहपुर सीकरी' } }],
    tags: ['fatehpur sikri', 'buland darwaza', 'salim chishti', 'unesco', 'agra', 'heritage', 'फतेहपुर सीकरी']
  },
  {
    id: 'agra_fort_mughal',
    name: 'Agra Fort (Red Sandstone Citadel)',
    hindiName: 'आगरा का किला (शाही लाल दुर्ग)',
    city: 'Agra',
    hindiCity: 'आगरा',
    category: 'heritage',
    categoryLabel: { en: 'UNESCO World Heritage Citadel', hi: 'यूनेस्को विश्व धरोहर दुर्ग' },
    coordinates: [27.1795, 78.0211],
    description: {
      en: 'The sprawling 94-acre red sandstone royal citadel of the Mughal Emperors, home to Jahangiri Mahal, Diwan-i-Khas, and the marble Musamman Burj overlooking the Taj Mahal.',
      hi: '94 एकड़ में फैला मुग़ल सम्राटों का मुख्य राजप्रासाद, जहां जहांगीरी महल, शीश महल और मुसम्मन बुर्ज से यमुना पार ताजमहल का मनोहारी दृश्य दिखता है।'
    },
    travelCause: {
      en: 'Standing on the Musamman Burj balcony where Shah Jahan gazed at the Taj Mahal, touching Akbar\'s massive stone royal bowl, and viewing royal riverfront courtyards.',
      hi: 'मुसम्मन बुर्ज से ताजमहल के अलौकिक दर्शन और अकबर-शाहजहां के शाही महलों की भव्यता का अनुभव।'
    },
    deepHistory: {
      en: 'Built by Emperor Akbar in 1565 on the foundations of the older Badalgarh brick fort; expanded with white marble palaces by Shah Jahan.',
      hi: '1565 में सम्राट अकबर द्वारा निर्मित और शाहजहां द्वारा संगमरमरी महलों से सज्जित।'
    },
    architecture: { en: 'Double-walled red sandstone fortification with intricate marble inlay pavilions', hi: 'लाल बलुआ पत्थर का दोहरा परकोटा व संगमरमर पच्चीकारी' },
    bestTime: { en: 'Early Morning 6:30 AM or Late Afternoon 4:00 PM', hi: 'प्रातःकाल 6:30 अथवा सायं 4:00 बजे' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹50 Indians, ₹650 Foreigners (Combined with Taj ticket savings)', hi: '₹50 भारतीय, ₹650 विदेशी' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Paved ramps throughout Amar Singh Gate and principal courtyards; wheelchair accessible.', hi: 'अमर सिंह द्वार से मुख्य महलों तक पक्के रैंप।' },
    photographyTips: { en: 'View of the Taj Mahal framed through the marble jharokha of Musamman Burj.', hi: 'मुसम्मन बुर्ज के झरोखों से ताजमहल का फ्रेम फोटो।' },
    safetyTips: { en: 'Only enter through Amar Singh Gate; Delhi Gate is under military jurisdiction.', hi: 'केवल अमर सिंह गेट से प्रवेश करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800', title: { en: 'Agra Fort Diwan-i-Khas', hi: 'आगरा किला दीवान-ए-खास' } }],
    tags: ['agra fort', 'agra', 'red fort', 'shah jahan', 'musamman burj', 'unesco', 'आगरा का किला']
  },

  // ==================== 2. SACRED & PILGRIMAGE DESTINATIONS ====================
  {
    id: 'naimisharanya_sitapur',
    name: 'Naimisharanya (Chakra Teerth & Lalita Devi)',
    hindiName: 'नैमिषारण्य (चक्र तीर्थ एवं माँ ललिता देवी)',
    city: 'Sitapur',
    hindiCity: 'सीतापुर',
    category: 'temple',
    categoryLabel: { en: 'Ancient Vedic Forest Shrine', hi: 'वैदिक तपोभूमि एवं तीर्थ' },
    coordinates: [27.3467, 80.4855],
    description: {
      en: 'The supreme Vedic penance grove on the Gomti river where Lord Brahma\'s Manomaya Chakra struck the earth, creating the mystical circular water pool Chakra Teerth.',
      hi: 'गोमती नदी के तट पर स्थित 88,000 ऋषियों की पावन तपोभूमि, जहां भगवान ब्रह्मा का मनोमय चक्र गिरा था और पवित्र चक्र तीर्थ का प्राकट्य हुआ।'
    },
    travelCause: {
      en: 'Taking a holy dip in the circular Chakra Teerth, worshiping at the ancient Shaktipeeth of Maa Lalita Devi, and seeking blessings at Maharshi Vyas Gaddi.',
      hi: 'चक्र तीर्थ में स्नान, माँ ललिता देवी शक्तिपीठ में पूजन एवं महर्षि वेद व्यास गद्दी के दर्शन।'
    },
    deepHistory: {
      en: 'Maharshi Ved Vyas divided the four Vedas and recited the 18 Puranas and Mahabharata to 88,000 sages here.',
      hi: 'महर्षि वेद व्यास द्वारा चारों वेदों के विभाजन और 18 पुराणों के वाचन की अमर स्थली।'
    },
    architecture: { en: 'Ancient circular stone spring pool, tiered temple ghats, and sacred banyan trees', hi: 'गोलाकार कुंड, प्राचीन मंदिर एवं वटवृक्ष' },
    bestTime: { en: 'October to March; Somvati Amavasya & Kartik Purnima', hi: 'अक्टूबर से मार्च; सोमवती अमावस्या' },
    timings: { en: '5:00 AM - 9:00 PM', hi: 'सुबह 5:00 से रात 9:00 बजे' },
    entryFee: { en: 'Free general entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved walkways around Chakra Teerth; clean changing facilities.', hi: 'कुंड के चारों ओर पक्के रास्ते व स्नान कक्ष उपलब्ध।' },
    photographyTips: { en: 'Morning mist rising from the holy waters of Chakra Teerth.', hi: 'प्रातःकाल चक्र तीर्थ के जल पर उठता पवित्र कोहरा।' },
    safetyTips: { en: 'Take holy dip only within designated iron safety railings in the pool.', hi: 'कुंड में सुरक्षा रेलिंग के भीतर ही स्नान करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800', title: { en: 'Naimisharanya Chakra Teerth', hi: 'नैमिषारण्य पावन चक्र तीर्थ' } }],
    tags: ['naimisharanya', 'sitapur', 'chakra teerth', 'vyas gaddi', 'lalita devi', 'vedas', 'नैमिषारण्य']
  },
  {
    id: 'vindhyachal_mirzapur',
    name: 'Vindhyachal (Maa Vindhyavasini Shaktipeeth)',
    hindiName: 'विंध्याचल (माँ विंध्यवासिनी धाम)',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'temple',
    categoryLabel: { en: 'Grand Shaktipeeth & Trikona', hi: 'महाशक्तिपीठ एवं त्रिकोण परिक्रमा' },
    coordinates: [25.1633, 82.5020],
    description: {
      en: 'The sacred riverfront Shaktipeeth on the holy Ganga where Mother Goddess Mahishasuramardini permanently resides, completing the divine Trikona Yatra with Kali Khoh and Ashtabhuja.',
      hi: 'गंगा तट पर स्थित जागृत महाशक्तिपीठ, जहां देवी विंध्यवासिनी सदैव वास करती हैं। काली खोह व अष्टभुजा सहित प्रसिद्ध त्रिकोण परिक्रमा का केंद्र।'
    },
    travelCause: {
      en: 'Darshan of Maa Vindhyavasini adorned in gold and silver, walking the grand newly built Vindhya Corridor, and completing the 14-km sacred Trikona Parikrama in the hills.',
      hi: 'माँ विंध्यवासिनी के दिव्य दर्शन, नव-निर्मित विंध्य कॉरिडोर का अवलोकन और त्रिकोण परिक्रमा।'
    },
    deepHistory: {
      en: 'Revered in Markandeya Purana and Durga Saptashati as the supreme sanctuary where Goddess Durga appeared after slaying Mahishasura.',
      hi: 'दुर्गा सप्तशती में वर्णित देवी का प्रत्यक्ष निवास स्थान; मान्यता है कि यहां दर्शन से सभी मनोरथ सिद्ध होते हैं।'
    },
    architecture: { en: 'Grand 50-ft wide pink Chunar sandstone corridor with parikrama verandas', hi: 'चुनार के गुलाबी पत्थरों से बना भव्य विंध्य कॉरिडोर' },
    bestTime: { en: 'Chaitra and Sharad Navratri; October to March', hi: 'चैत्र व शारदीय नवरात्रि; अक्टूबर से मार्च' },
    timings: { en: '4:00 AM - 12:00 Midnight (Closed briefly during Bhog Aarti)', hi: 'प्रातः 4:00 से रात्रि 12:00 बजे' },
    entryFee: { en: 'Free general Darshan; VIP Sugam passes via vindhyavasini.up.gov.in', hi: 'सामान्य दर्शन निःशुल्क' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Spacious flat corridor plaza, queue managers, and escalators to rooftop verandas.', hi: 'विशाल कॉरिडोर, लिफ्ट और सुगम दर्शन कतार व्यवस्था।' },
    photographyTips: { en: 'Corridor carved sandstone pillars and Ganga riverfront view from Pakka Ghat.', hi: 'कॉरिडोर के नक्काशीदार खंभे व पक्का घाट से गंगा दर्शन।' },
    safetyTips: { en: 'Only purchase Prasad and pooja offerings from authorized temple trust stalls.', hi: 'प्रसाद केवल अधिकृत काउंटरों से लें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800', title: { en: 'Maa Vindhyavasini Temple Corridor', hi: 'माँ विंध्यवासिनी मंदिर कॉरिडोर' } }],
    tags: ['vindhyachal', 'mirzapur', 'shaktipeeth', 'trikona', 'kali khoh', 'ashtabhuja', 'विंध्याचल']
  },
  {
    id: 'devgarh_dashavatara',
    name: 'Devgarh (Gupta Dashavatara & Jain Temples)',
    hindiName: 'देवगढ़ (गुप्तकालीन दशावतार एवं जैन मंदिर)',
    city: 'Lalitpur',
    hindiCity: 'ललितपुर',
    category: 'temple',
    categoryLabel: { en: 'Gupta Classical Art & Heritage', hi: 'गुप्तकालीन कला एवं तीर्थ' },
    coordinates: [24.5244, 78.2435],
    description: {
      en: 'An extraordinary 5th-century Gupta-era archaeological wonder perched on a rocky cliff over the Betwa River, home to the earliest panchayatana stone temple dedicated to Lord Vishnu.',
      hi: 'बेतवा नदी की सुरम्य घाटी में स्थित 5वीं सदी का गुप्तकालीन दशावतार मंदिर और 31 प्राचीन दिगंबर जैन मंदिरों का अनुपम पुरातात्विक केंद्र।'
    },
    travelCause: {
      en: 'Marveling at the iconic high-relief Sheshashayi Vishnu sculpture (Lord Vishnu reclining on Ananta Shesha), Gajendra Moksha panels, and 9th-century Jain Tirthankara icons.',
      hi: 'अनंत शेषनाग पर शयन करते भगवान विष्णु के दुर्लभ पाषाण शिल्प और बेतवा नदी के विहंगम दृश्यों का अवलोकन।'
    },
    deepHistory: {
      en: 'Built in the early 6th century during the Gupta Golden Age; pioneering example of North Indian Shikhara temple architecture.',
      hi: 'गुप्त साम्राज्य के स्वर्णकाल में 500 ईस्वी में निर्मित; शिखर मंदिर वास्तुकला का प्राचीनतम उदाहरण।'
    },
    architecture: { en: 'Classical Gupta stone carvings, ornate doorway lintels depicting Ganga-Yamuna', hi: 'शास्त्रीय गुप्त नक्काशी और गंगा-यमुना द्वारपाल प्रतिमाएं' },
    bestTime: { en: 'October to February', hi: 'अक्टूबर से फरवरी' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 Indians, ₹300 Foreigners', hi: '₹25 भारतीय, ₹300 विदेशी' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Paved garden paths around ASI monument; hillside stairs down to Betwa river.', hi: 'स्मारक परिसर में रास्ते सुगम हैं।' },
    photographyTips: { en: 'Intricate sandstone reliefs of Sheshashayi Vishnu under morning directional sunlight.', hi: 'सुबह की धूप में शेषशायी विष्णु शिल्प का क्लोज़-अप।' },
    safetyTips: { en: 'Carry drinking water; tranquil forested site located 33 km from Lalitpur city.', hi: 'ललितपुर से 33 किमी दूर शांत प्राकृतिक स्थल, पेयजल साथ रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Devgarh Dashavatara Temple', hi: 'देवगढ़ दशावतार मंदिर' } }],
    tags: ['devgarh', 'lalitpur', 'gupta', 'dashavatara', 'vishnu', 'betwa', 'jain', 'देवगढ़']
  },
  {
    id: 'bateshwar_temples_agra',
    name: 'Bateshwar (101 Shiva Temples Crescent)',
    hindiName: 'बटेश्वर (101 शिव मंदिर श्रृंखला एवं यमुना तट)',
    city: 'Agra',
    hindiCity: 'आगरा',
    category: 'temple',
    categoryLabel: { en: 'Historic Riverfront Shiva Complex', hi: 'प्राचीन शिव मंदिर श्रृंखला' },
    coordinates: [26.9363, 78.5367],
    description: {
      en: 'An awe-inspiring amphitheater of 101 historical white stone Shiva temples curving along the sacred crescent bend of the Yamuna River, also the ancestral village of Shri Atal Bihari Vajpayee.',
      hi: 'यमुना नदी के अर्धचंद्राकार मोड़ पर स्थित 101 ऐतिहासिक शिव मंदिरों की भव्य श्रृंखला; पूर्व प्रधानमंत्री श्री अटल बिहारी वाजपेयी का पैतृक गांव।'
    },
    travelCause: {
      en: 'Walking along the unbroken line of 101 riverfront temples, ringing brass bells at Bateshwar Nath Mahadev, and experiencing the grand annual animal & cultural fair.',
      hi: 'यमुना तट पर 101 मंदिरों की परिक्रमा, बटेश्वर नाथ के दर्शन और प्राचीन कार्तिक मेले का अनुभव।'
    },
    deepHistory: {
      en: 'Mentioned in Matsya Purana as Bateshwar; temples commissioned in the 17th century by Bhadauria kings.',
      hi: 'भदावर के राजाओं द्वारा 17वीं शताब्दी में निर्मित ऐतिहासिक धाम; मत्स्य पुराण में वर्णित।'
    },
    architecture: { en: 'Row of conical stone spires and riverfront ghat steps reflecting in the Yamuna', hi: 'यमुना जल में प्रतिबिंबित होते 101 मंदिर शिखर' },
    bestTime: { en: 'Kartik Purnima (Bateshwar Mela); October to March', hi: 'कार्तिक पूर्णिमा; अक्टूबर से मार्च' },
    timings: { en: '5:00 AM - 8:30 PM', hi: 'सुबह 5:00 से रात 8:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Continuous paved promenade connecting all riverfront temples.', hi: 'सभी मंदिरों को जोड़ता पक्का तट मार्ग।' },
    photographyTips: { en: 'Sunset panorama capturing the entire crescent curve of 101 white temple spires.', hi: 'सूर्यास्त के समय यमुना में 101 शिखरों का प्रतिबिंब।' },
    safetyTips: { en: 'Be mindful on ghat steps during monsoon river levels.', hi: 'वर्षाकाल में घाट की सीढ़ियों पर सावधानी रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800', title: { en: 'Bateshwar 101 Shiva Temples', hi: 'बटेश्वर 101 शिव मंदिर' } }],
    tags: ['bateshwar', 'agra', 'shiva', '101 temples', 'yamuna', 'atal bihari', 'बटेश्वर']
  },
  {
    id: 'gokul_raman_reti',
    name: 'Gokul (Raman Reti & Nand Bhavan)',
    hindiName: 'गोकुल (रमण रेती एवं नंद भवन)',
    city: 'Mathura',
    hindiCity: 'मथुरा',
    category: 'temple',
    categoryLabel: { en: 'Krishna Childhood Sacred Grove', hi: 'श्रीकृष्ण बाललीला स्थली' },
    coordinates: [27.4419, 77.7214],
    description: {
      en: 'The idyllic town where Lord Krishna was raised secretly by Yashoda and Nanda Baba, centered around Raman Reti where devotees roll in the sacred sands of Krishna\'s childhood pastimes.',
      hi: 'यशोदा नंदन भगवान श्रीकृष्ण की बाल्यकाल की पावन लीलास्थली, जहां रमण रेती की पवित्र बालू में भक्तगण रज-वंदना करते हैं।'
    },
    travelCause: {
      en: 'Rolling in the sacred micro-soft white sand of Raman Reti, visiting the ancient 84-pillared Chaurasi Khamba temple, and viewing deer sanctuaries.',
      hi: 'रमण रेती की पवित्र रज में लोटना, 84 खंभा मंदिर के दर्शन और हिरण उद्यान का भ्रमण।'
    },
    deepHistory: {
      en: 'Revered in Srimad Bhagavatam as the safe sanctuary of Gokul Mahavan where Bal Gopal performed Putana Moksha and Kaliya Daman pastimes.',
      hi: 'श्रीमद्भागवत में वर्णित वह स्थल जहां कान्हा ने अपनी बाल सुलभ लीलाएं कीं।'
    },
    architecture: { en: 'Ancient carved stone pavilions, shady Kadamba groves, and open white sand grounds', hi: 'कदंब के बगीचे, नक्काशीदार खंभे व रेत का प्रांगण' },
    bestTime: { en: 'September to March; Janmashtami & Holi', hi: 'सितंबर से मार्च; जन्माष्टमी' },
    timings: { en: '5:00 AM - 12:00 PM & 4:00 PM - 8:30 PM', hi: 'सुबह 5:00-12:00 व 4:00-8:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Shaded paved paths lead directly to sand enclosure; accessible benches.', hi: 'रेत प्रांगण तक पक्के रास्ते और छायादार व्यवस्था।' },
    photographyTips: { en: 'Peacocks roaming freely under Kadamba trees in Raman Reti gardens.', hi: 'कदंब के पेड़ों के नीचे विचरण करते मोरों के चित्र।' },
    safetyTips: { en: 'Shoes must be deposited outside before entering the sacred sand arena.', hi: 'रेत प्रांगण में प्रवेश से पूर्व जूते बाहर जमा करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800', title: { en: 'Gokul Raman Reti Sacred Sand', hi: 'गोकुल रमण रेती' } }],
    tags: ['gokul', 'raman reti', 'nand bhavan', 'chaurasi khamba', 'mathura', 'krishna', 'गोकुल']
  },
  {
    id: 'barsana_radha_rani_dham',
    name: 'Barsana (Shri Radha Rani Temple & Lathmar Holi)',
    hindiName: 'बरसाना (श्री लाड़िली जी राधा रानी मंदिर)',
    city: 'Mathura',
    hindiCity: 'मथुरा',
    category: 'temple',
    categoryLabel: { en: 'Supreme Radha Shrine & Holi Hub', hi: 'राधा रानी धाम व लठमार होली' },
    coordinates: [27.6475, 77.3789],
    description: {
      en: 'The divine birthplace of Shri Radha Rani perched atop Bhanugarh hill, world-renowned for the magnificent Ladli Ji Mandir and the historic Lathmar Holi festival.',
      hi: 'भानुगढ़ पर्वत के शिखर पर विराजमान श्री राधा रानी (लाड़िली जी) का पावन जन्म स्थान, जो विश्वप्रसिद्ध लठमार होली के लिए जाना जाता है।'
    },
    travelCause: {
      en: 'Climbing the sacred Bhanugarh stone stairway, participating in joyous Radhe-Radhe chants, gazing at sweeping Braj countryside, and experiencing Prem Sarovar.',
      hi: 'भानुगढ़ पहाड़ी पर लाड़िली जी के दर्शन, "राधे-राधे" संकीर्तन और प्रेम सरोवर की परिक्रमा।'
    },
    deepHistory: {
      en: 'Revered in Padma Purana as the palace of King Vrishabhanu where Radhika grew up in divine love.',
      hi: 'पद्म पुराण में वर्णित राजा वृषभानु का निवास और श्री राधा का पावन बाल्य धाम।'
    },
    architecture: { en: 'Grand Rajasthani red sandstone arched domes and battlements perched high on the cliff', hi: 'पहाड़ी पर लाल बलुआ पत्थर के भव्य गुंबद व झरोखे' },
    bestTime: { en: 'Lathmar Holi (Phalguna month); October to March', hi: 'लठमार होली; अक्टूबर से मार्च' },
    timings: { en: '5:00 AM - 12:00 PM & 4:30 PM - 9:00 PM', hi: 'सुबह 5:00-12:00 व 4:30-9:00 बजे' },
    entryFee: { en: 'Free entry; Ropeway ticket ₹100 round-trip', hi: 'सामान्य प्रवेश निःशुल्क; रोपवे ₹100' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Modern passenger ropeway transports seniors and children to the hilltop temple in 3 minutes.', hi: 'पहाड़ी मंदिर तक 3 मिनट में पहुंचाने वाला आधुनिक रोपवे उपलब्ध।' },
    photographyTips: { en: 'Explosions of organic Gulal colors over the temple courtyard during Braj Holi.', hi: 'बरसाना होली के दौरान मंदिर प्रांगण में उड़ते रंगों के दृश्य।' },
    safetyTips: { en: 'Use the official ropeway to avoid climbing 250 steep stairs in peak heat.', hi: 'बुजुर्गों हेतु रोपवे का उपयोग करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800', title: { en: 'Barsana Radha Rani Mandir', hi: 'बरसाना राधा रानी मंदिर' } }],
    tags: ['barsana', 'radha rani', 'ladli ji', 'lathmar holi', 'mathura', 'ropeway', 'बरसाना']
  },
  {
    id: 'govardhan_hill_parikrama',
    name: 'Govardhan (Giriraj Hill & Daan Ghati)',
    hindiName: 'गोवर्धन (श्री गिरिराज पर्वत एवं दानघाटी)',
    city: 'Mathura',
    hindiCity: 'मथुरा',
    category: 'temple',
    categoryLabel: { en: 'Sacred Hill of Divine Protection', hi: 'श्री गिरिराज जी एवं परिक्रमा' },
    coordinates: [27.4986, 77.4658],
    description: {
      en: 'The sacred 21-km hill that Lord Krishna lifted on his little finger for seven days to protect the people of Braj from the torrential wrath of Indra.',
      hi: '21 किलोमीटर लंबा पावन गिरिराज पर्वत, जिसे भगवान कृष्ण ने देवराज इंद्र के प्रकोप से ब्रजवासियों की रक्षा हेतु कनिष्ठिका उंगली पर उठाया था।'
    },
    travelCause: {
      en: 'Undertaking the 21-km holy circumambulation (Govardhan Parikrama), offering milk abhishekam at Daan Ghati Mandir, and meditating at sacred Mansi Ganga and Radha Kund.',
      hi: '21 किमी गिरिराज परिक्रमा, दानघाटी पर दुग्धाभिषेक, मानसी गंगा स्नान और राधा कुंड के दर्शन।'
    },
    deepHistory: {
      en: 'Described in Srimad Bhagavatam as non-different from Lord Krishna himself; blessed that worshiping Govardhan equals worshiping Supreme Divinity.',
      hi: 'श्रीमद्भागवत के अनुसार गिरिराज साक्षात श्रीकृष्ण स्वरूप हैं।'
    },
    architecture: { en: 'Ancient natural red sandstone rock formation, ornate Chhatris (Kusum Sarovar), and temples', hi: 'प्राकृतिक पाषाण पर्वत, कुसुम सरोवर की राजस्थानी छतरियां' },
    bestTime: { en: 'Govardhan Puja & Guru Purnima; October to March', hi: 'गोवर्धन पूजा; अक्टूबर से मार्च' },
    timings: { en: 'Open 24 hours (Parikrama path); Temples 5:00 AM - 10:00 PM', hi: 'परिक्रमा मार्ग 24 घंटे खुला' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved, shaded, illuminated parikrama corridor with battery e-rickshaws available for seniors.', hi: 'ई-रिक्शा और समतल छायादार परिक्रमा मार्ग।' },
    photographyTips: { en: 'Intricate Rajasthani sandstone carvings of Kusum Sarovar reflecting in green waters.', hi: 'कुसुम सरोवर की छतरियों का जल में प्रतिबिंब।' },
    safetyTips: { en: 'Start parikrama in early morning or evening to avoid mid-day heat.', hi: 'परिक्रमा प्रातः अथवा सांध्य काल में करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800', title: { en: 'Govardhan Kusum Sarovar', hi: 'गोवर्धन कुसुम सरोवर' } }],
    tags: ['govardhan', 'giriraj', 'parikrama', 'kusum sarovar', 'mathura', 'krishna', 'गोवर्धन']
  },
  {
    id: 'hastinapur_heritage_town',
    name: 'Hastinapur (Mahabharata Capital & Jain Tirth)',
    hindiName: 'हस्तिनापुर (महाभारत कालीन राजधानी एवं जैन महातीर्थ)',
    city: 'Meerut',
    hindiCity: 'मेरठ',
    category: 'temple',
    categoryLabel: { en: 'Epic Mahabharata Capital', hi: 'महाभारत राजधानी व जैन तीर्थ' },
    coordinates: [29.1717, 77.9942],
    description: {
      en: 'The fabled imperial capital of the Kauravas and Pandavas of the epic Mahabharata, and a supreme Jain pilgrimage center where three Tirthankaras were born.',
      hi: 'महाभारत काल की कुरु साम्राज्य की ऐतिहासिक राजधानी और जैन धर्म के तीन तीर्थंकरों (शांतिनाथ, कुंथुनाथ, अरहनाथ) की पावन जन्मभूमि।'
    },
    travelCause: {
      en: 'Viewing Ulta Kheda archaeological mound where B.B. Lal excavated Painted Grey Ware, worshiping at Pandeshwar Mahadev, and visiting the colossal Jambudweep Jain complex.',
      hi: 'महाभारत कालीन उल्टे खेड़ा टीले के दर्शन, पांडेश्वर महादेव पूजन और जम्बूद्वीप ज्ञानतीर्थ का अवलोकन।'
    },
    deepHistory: {
      en: 'Excavated by the Archaeological Survey of India in 1950-52, confirming continuous habitation from before 1000 BCE.',
      hi: '1950 में एएसआई द्वारा उत्खनित; महाभारत कालीन सभ्यता के प्रमाण मिले।'
    },
    architecture: { en: 'Monumental white marble temples and the unique 101-ft high circular architectural model of Jambudweep', hi: 'जम्बूद्वीप की गोलाकार वास्तुकला व संगमरमरी मंदिर' },
    bestTime: { en: 'October to March; Kartik Mela', hi: 'अक्टूबर से मार्च; कार्तिक मेला' },
    timings: { en: '6:00 AM - 8:30 PM', hi: 'सुबह 6:00 से रात 8:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Flat campus paths across Bada Digambar Jain temple and Jambudweep.', hi: 'समतल रास्ते और सुगम तीर्थ परिसर।' },
    photographyTips: { en: 'The towering Mount Meru structure rising above the lotus lakes of Jambudweep.', hi: 'जम्बूद्वीप के सुमेरु पर्वत मॉडल का विहंगम दृश्य।' },
    safetyTips: { en: 'Follow traditional barefoot dress code inside temple sanctums.', hi: 'मंदिर गर्भगृह में पारम्परिक नियमों का पालन करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800', title: { en: 'Hastinapur Jambudweep Complex', hi: 'हस्तिनापुर जम्बूद्वीप तीर्थ' } }],
    tags: ['hastinapur', 'meerut', 'mahabharata', 'pandavas', 'jambudweep', 'jain', 'हस्तिनापुर']
  },
  {
    id: 'shravasti_jetavana_buddhist',
    name: 'Shravasti (Jetavana Monastery & Anathapindika Stupa)',
    hindiName: 'श्रावस्ती (जेतवन महाविहार एवं अनाथपिंडक स्तूप)',
    city: 'Shravasti',
    hindiCity: 'श्रावस्ती',
    category: 'buddhist',
    categoryLabel: { en: 'Major Buddhist Pilgrimage Site', hi: 'प्रमुख बौद्ध तीर्थ धाम' },
    coordinates: [27.5186, 82.0294],
    description: {
      en: 'One of the most sacred Buddhist pilgrimage hubs in the world where Gautama Buddha spent 24 rainy seasons (Vassa) and performed the Twin Miracle (Yamaka-Patihariya).',
      hi: 'विश्व का प्रमुख बौद्ध तीर्थ धाम जहां भगवान बुद्ध ने अपने 24 वर्षावास (चातुर्मास) बिताए और महाचमत्कार प्रकट किया था।'
    },
    travelCause: {
      en: 'Meditating under the sacred Anandabodhi tree, visiting Buddha\'s Gandhakuti (perfumed chamber), viewing Angulimala\'s stupa, and visiting international monasteries.',
      hi: 'आनंदबोधि वृक्ष की छांव में ध्यान, भगवान बुद्ध की गंधकुटी और डाकू अंगुलिमाल के स्तूप के दर्शन।'
    },
    deepHistory: {
      en: 'Capital of ancient Kosala Kingdom ruled by King Prasenajit; wealthy merchant Anathapindika bought Jetavana by covering ground with gold coins.',
      hi: 'प्राचीन कोशल राज्य की राजधानी; श्रेष्ठि अनाथपिंडक द्वारा सोने के सिक्कों से खरीदी गई भूमि पर निर्मित विहार।'
    },
    architecture: { en: 'Ancient Mauryan and Kushan brick monastery layouts surrounded by quiet landscaped parks', hi: 'मौर्य एवं कुषाण कालीन ईंटों के बौद्ध स्तूप' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 Indians, ₹300 Foreigners', hi: '₹25 भारतीय, ₹300 विदेशी' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Paved, step-free garden pathways designed specifically for senior international pilgrims.', hi: 'अंतरराष्ट्रीय तीर्थयात्रियों हेतु सीढ़ी-मुक्त सुगम रास्ते।' },
    photographyTips: { en: 'Monks in saffron robes meditating beneath the sprawling Anandabodhi tree.', hi: 'आनंदबोधि वृक्ष तले ध्यानमग्न बौद्ध भिक्षुओं के चित्र।' },
    safetyTips: { en: 'Maintain absolute silence in the Gandhakuti sanctum.', hi: 'गंधकुटी क्षेत्र में पूर्ण शांति बनाए रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Jetavana Monastery Shravasti', hi: 'जेतवन महाविहार श्रावस्ती' } }],
    tags: ['shravasti', 'jetavana', 'buddha', 'buddhist', 'angulimala', 'anathapindika', 'श्रावस्ती']
  },
  {
    id: 'kapilavastu_piprahwa_relics',
    name: 'Kapilavastu (Piprahwa Buddha Relic Stupa)',
    hindiName: 'कपिलवस्तु / पिपरहवा (शाक्य राजधानी व धातु स्तूप)',
    city: 'Siddharthnagar',
    hindiCity: 'सिद्धार्थनगर',
    category: 'buddhist',
    categoryLabel: { en: 'Early Life of Buddha Site', hi: 'भगवान बुद्ध की बाल्य स्थली' },
    coordinates: [27.4390, 83.0850],
    description: {
      en: 'The ancient capital of the Shakya clan where Prince Siddhartha (Gautama Buddha) spent his first 29 years, famous for the Piprahwa Stupa that yielded authentic bone relics of Buddha.',
      hi: 'शाक्य गणराज्य की प्राचीन राजधानी जहां राजकुमार सिद्धार्थ ने जीवन के पहले 29 वर्ष व्यतीत किए; पिपरहवा स्तूप से भगवान बुद्ध की मूल अस्थियां प्राप्त हुईं।'
    },
    travelCause: {
      en: 'Standing at the grand stupa where Shakya relatives enshrined their one-eighth share of Buddha\'s cremation ashes, and touring King Shuddhodana\'s palace ruins.',
      hi: 'भगवान बुद्ध के पावन अस्थि अवशेष स्तूप और राजा शुद्धोदन के महल के पुरातात्विक अवशेषों का दर्शन।'
    },
    deepHistory: {
      en: 'William Peppé discovered the inscribed reliquary urns in 1898, confirmed in 1970s excavations by K.M. Srivastava showing seals inscribed "Kapilavastu".',
      hi: '1898 व 1971 के उत्खनन में "कपिलवस्तु" मुहरबंद कलश और मूल अस्थियां प्राप्त हुईं।'
    },
    architecture: { en: 'Ancient brick stupa foundations and royal palace multi-chamber excavations', hi: 'प्राचीन ईंटों के स्तूप व राजमहल के कक्ष' },
    bestTime: { en: 'November to February', hi: 'नवंबर से फरवरी' },
    timings: { en: '6:00 AM - 5:30 PM', hi: 'सुबह 6:00 से शाम 5:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Serene grassy walking circuits with paved access around the main stupa.', hi: 'स्तूप के चारों ओर सुगम पक्के रास्ते।' },
    photographyTips: { en: 'The massive circular brick stupa against the morning eastern sunrise.', hi: 'सूर्योदय के समय विशाल गोल ईंट स्तूप का दृश्य।' },
    safetyTips: { en: 'Rural countryside setting; ensure pre-arranged transport from Naugarh/Gorakhpur.', hi: 'नौगढ़/गोरखपुर से वाहन की पूर्व व्यवस्था रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Kapilavastu Piprahwa Stupa', hi: 'कपिलवस्तु पिपरहवा स्तूप' } }],
    tags: ['kapilavastu', 'piprahwa', 'siddharthnagar', 'buddha', 'shakya', 'relics', 'कपिलवस्तु']
  },
  {
    id: 'garhmukteshwar_brijghat',
    name: 'Garhmukteshwar & Brijghat (Holy Ganga Fairs)',
    hindiName: 'गढ़मुक्तेश्वर एवं ब्रजघाट (पावन गंगा मेला तीर्थ)',
    city: 'Hapur',
    hindiCity: 'हापुड़',
    category: 'ghat',
    categoryLabel: { en: 'Sacred Ganga Riverfront & Fair', hi: 'पवित्र गंगा घाट व कार्तिक मेला' },
    coordinates: [28.7900, 78.0933],
    description: {
      en: 'A venerable riverfront pilgrimage site known as the "Mini Haridwar of UP", where the sacred Ganga emerges onto the plains, hosting the gigantic Kartik Purnima fair.',
      hi: 'उत्तर प्रदेश का "छोटा हरिद्वार", जहां गंगा मैदानी भाग में प्रवेश करती है। पौराणिक मुक्तेश्वर महादेव मंदिर और विशाल कार्तिक गंगा स्नान मेले का प्रमुख केंद्र।'
    },
    travelCause: {
      en: 'Taking a cleansing holy dip at Brijghat, offering lamps at evening Ganga Aarti, and seeking salvation at the Mahabharata-era Mukteshwar Mahadev shrine.',
      hi: 'ब्रजघाट पर गंगा स्नान, सांध्य महा आरती और महाभारत कालीन मुक्तेश्वर महादेव के दर्शन।'
    },
    deepHistory: {
      en: 'Mentioned in the Bhagavata Purana; King Yudhishthira and the Pandavas performed tarpana rituals here for the departed warriors of the Mahabharata war.',
      hi: 'महाभारत युद्ध के उपरांत धर्मराज युधिष्ठिर द्वारा वीर शहीदों के तर्पण की पावन स्थली।'
    },
    architecture: { en: 'Extensive stone bathing ghats, decorated chhatris, and ancient temple spires', hi: 'पक्के गंगा घाट, छतरियां और प्राचीन मंदिर' },
    bestTime: { en: 'Kartik Purnima Ganga Snan; October to March', hi: 'कार्तिक पूर्णिमा; अक्टूबर से मार्च' },
    timings: { en: 'Open 24 hours (Ghats); Ganga Aarti 6:30 PM', hi: 'घाट 24 घंटे; सांध्य आरती 6:30 बजे' },
    entryFee: { en: 'Free', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved walkways and direct vehicle drop-off at Brijghat waterfront.', hi: 'तट तक वाहनों की सुगम पहुंच और पक्के घाट।' },
    photographyTips: { en: 'Thousands of floating brass deepaks illuminating the broad Ganga at dusk.', hi: 'संध्याकाल गंगा में तैरते हजारों दीपों का दृश्य।' },
    safetyTips: { en: 'Only bathe within marked safety chained zones on the riverbank.', hi: 'सुरक्षा जंजीरों के घेरे में ही स्नान करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800', title: { en: 'Brijghat Ganga Riverfront', hi: 'ब्रजघाट गंगा तट' } }],
    tags: ['garhmukteshwar', 'brijghat', 'hapur', 'ganga', 'snan', 'kartik mela', 'गढ़मुक्तेश्वर']
  },
  {
    id: 'sankissa_elephant_capital',
    name: 'Sankissa (Heavenly Descent Stupa & Ashoka Pillar)',
    hindiName: 'संकिसा (स्वर्गावतरण स्तूप एवं अशोक हाथी स्तंभ)',
    city: 'Farrukhabad',
    hindiCity: 'फर्रुखाबाद',
    category: 'buddhist',
    categoryLabel: { en: 'Sacred Buddhist Descent Site', hi: 'बौद्ध स्वर्गावतरण तीर्थ' },
    coordinates: [27.3375, 79.3300],
    description: {
      en: 'The momentous Buddhist pilgrimage place where Gautama Buddha is venerated to have descended back to earth from Trayastrimsa heaven on a triple jewel ladder after preaching to his mother Queen Maya.',
      hi: 'परम पावन बौद्ध तीर्थ जहां भगवान बुद्ध अपनी माता माया देवी को अभिधम्म उपदेश देकर स्वर्ग से पृथ्वी पर अवतरित हुए थे; ऐतिहासिक अशोक हाथी स्तंभ सुरक्षित है।'
    },
    travelCause: {
      en: 'Viewing the 3rd-century BCE Ashokan carved Elephant Capital sheltered under an ancient canopy and meditating on the massive Bisari Devi archaeological stupa mound.',
      hi: 'तीसरी सदी ईसा पूर्व के दुर्लभ अशोक हाथी स्तंभ के दर्शन और ऐतिहासिक स्तूप टीले पर ध्यान।'
    },
    deepHistory: {
      en: 'Visited and chronicled extensively by Chinese pilgrim monks Faxian (5th century) and Xuanzang (7th century).',
      hi: 'चीनी यात्री फाह्यान और ह्वेनसांग द्वारा अपनी यात्रा वृतांतों में वर्णित।'
    },
    architecture: { en: 'Polished Mauryan sandstone elephant capital with lotus abacus and ancient stupa brick core', hi: 'मौर्यकालीन चुनार बलुआ पत्थर का हाथी शीर्ष' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Paved approach to the Ashokan elephant pavilion; rural dirt path to outer mounds.', hi: 'मुख्य स्मारक तक पक्का मार्ग उपलब्ध।' },
    photographyTips: { en: 'Detailed carvings of the Mauryan elephant capital and stone lotus base.', hi: 'अशोक स्तंभ के नक्काशीदार हाथी का क्लोज़-अप।' },
    safetyTips: { en: 'Tranquil offbeat rural shrine; travel during daylight hours from Farrukhabad.', hi: 'फर्रुखाबाद से दिन के समय यात्रा की योजना बनाएं।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Sankissa Ashokan Elephant Capital', hi: 'संकिसा अशोक हाथी स्तंभ' } }],
    tags: ['sankissa', 'farrukhabad', 'buddha', 'ashoka', 'elephant capital', 'buddhist', 'संकिसा']
  },
  {
    id: 'kampil_panchala_capital',
    name: 'Kampil (Mahabharata Panchala Capital & Draupadi)',
    hindiName: 'कंपिल (महाभारत कालीन पांचाल राजधानी व द्रौपदी जन्मस्थली)',
    city: 'Farrukhabad',
    hindiCity: 'फर्रुखाबाद',
    category: 'temple',
    categoryLabel: { en: 'Epic Vedic Heritage Town', hi: 'महाभारत कालीन पांचाल नगरी' },
    coordinates: [27.6186, 79.2817],
    description: {
      en: 'The celebrated ancient capital of the Southern Panchala Kingdom ruled by King Drupada, sacred birthplace of Queen Draupadi, and birthplace of the 13th Jain Tirthankara Bhagwan Vimalnath.',
      hi: 'महाभारत कालीन राजा द्रुपद की राजधानी, महारानी द्रौपदी की जन्मस्थली (द्रौपदी कुंड) और 13वें जैन तीर्थंकर भगवान विमलनाथ का जन्म धाम।'
    },
    travelCause: {
      en: 'Visiting the ancient Draupadi Kund where Yagya was performed, Kapil Muni\'s Vedic hermitage, Rameshwar Nath Mahadev Temple, and Swetambar & Digambar Jain shrines.',
      hi: 'द्रौपदी कुंड (यज्ञवेदी), कपिल मुनि आश्रम, रामेश्वर नाथ महादेव और प्राचीन जैन मंदिरों के दर्शन।'
    },
    deepHistory: {
      en: 'Mentioned in Mahabharata as Kampilya; site of the historic Draupadi Swayamvara where Arjuna pierced the fish eye.',
      hi: 'अर्जुन द्वारा मत्स्य-भेद कर द्रौपदी स्वयंवर जीतने की ऐतिहासिक पावन स्थली।'
    },
    architecture: { en: 'Vedic brick yajna kunds, medieval Shiva shrines, and grand white marble Jain temples', hi: 'प्राचीन कुंड, शिव मंदिर व संगमरमरी जैन जिनालय' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '5:30 AM - 8:30 PM', hi: 'सुबह 5:30 से रात 8:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Level roads in town; temple steps have side railings.', hi: 'मंदिरों में रेलिंग और समतल रास्ते।' },
    photographyTips: { en: 'The sacred Draupadi Kund and sandstone shikhara of Rameshwar Nath Mandir.', hi: 'द्रौपदी कुंड और रामेश्वर नाथ मंदिर के चित्र।' },
    safetyTips: { en: 'Respect spiritual traditions at Jain shrines and Vedic ashrams.', hi: 'जैन मंदिरों व आश्रमों के नियमों का सम्मान करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800', title: { en: 'Kampil Rameshwar Nath Temple', hi: 'कंपिल रामेश्वर नाथ मंदिर' } }],
    tags: ['kampil', 'farrukhabad', 'panchala', 'draupadi', 'vimalnath', 'jain', 'mahabharata', 'कंपिल']
  },
  {
    id: 'bhitargaon_brick_temple',
    name: 'Bhitargaon (5th-Century Gupta Terracotta Temple)',
    hindiName: 'भीतरगांव (5वीं सदी का गुप्तकालीन ईंट मंदिर)',
    city: 'Kanpur',
    hindiCity: 'कानपुर',
    category: 'temple',
    categoryLabel: { en: 'Oldest Survived Brick Temple', hi: 'प्राचीनतम ईंट निर्मित शिखर मंदिर' },
    coordinates: [26.2081, 80.2981],
    description: {
      en: 'The oldest surviving terracotta brick temple in India featuring a tall curvilinear shikhara, built during the classical Gupta period in the 5th century CE.',
      hi: 'भारत का प्राचीनतम सुरक्षित ईंट निर्मित शिखर मंदिर, जो 5वीं शताब्दी में गुप्त साम्राज्य के काल में अद्भुत टेराकोटा कला से बनाया गया था।'
    },
    travelCause: {
      en: 'Viewing 1,500-year-old terracotta panels depicting Shiva, Parvati, Vishnu, and Ganesha, and marveling at the ancient Indian use of the true arch (vaulted roof).',
      hi: '1500 वर्ष पुराने दुर्लभ टेराकोटा शिल्प पट्टों और भारत में मेहराबदार छत (true arch) के प्राचीनतम प्रयोग का अवलोकन।'
    },
    deepHistory: {
      en: 'Excavated and safeguarded by Alexander Cunningham in the 1870s as a landmark milestone in world architectural evolution.',
      hi: '1870 के दशक में अलेक्जेंडर कनिंघम द्वारा खोजा गया भारतीय वास्तुकला का अमूल्य रत्न।'
    },
    architecture: { en: 'Fired terracotta bricks with stepped shikhara tower, vaulted ceilings, and decorative friezes', hi: 'पकी हुई ईंटों का शिखर, मेहराबदार छत व पक्की मिट्टी के शिल्प' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry (ASI protected)', hi: 'निःशुल्क (एएसआई संरक्षित)' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Landscaped grassy lawns surrounding the temple with low stone plinth steps.', hi: 'चारों ओर सुंदर लॉन और सुगम पहुंच।' },
    photographyTips: { en: 'Intricate decorative relief motifs of aquatic sea-monsters (Makara) and floral vines on bricks.', hi: 'ईंटों पर उकेरे गए मकर और लता-पत्रावली के चित्र।' },
    safetyTips: { en: 'Touching or defacing ancient 1,500-year-old terracotta reliefs is strictly prohibited.', hi: 'प्राचीन ईंटों और मूर्तियों को छूना वर्जित है।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Bhitargaon Gupta Brick Temple', hi: 'भीतरगांव गुप्तकालीन ईंट मंदिर' } }],
    tags: ['bhitargaon', 'kanpur', 'gupta', 'brick temple', 'terracotta', 'asi', 'भीतरगांव']
  },
  {
    id: 'shringverpur_dham',
    name: 'Shringverpur (Ramayana Nishadraj Guha Site)',
    hindiName: 'शृंगवेरपुर (रामायण कालीन निषादराज गुह्य धाम)',
    city: 'Prayagraj',
    hindiCity: 'प्रयागराज',
    category: 'temple',
    categoryLabel: { en: 'Epic Ramayana Pilgrimage', hi: 'रामायण कालीन पावन तट' },
    coordinates: [25.5900, 81.6500],
    description: {
      en: 'The legendary Ramayana riverside kingdom of Nishadraj Guha on the Ganges where Lord Rama, Sita, and Lakshmana spent their first exile night, and boatman Kevat washed Lord Rama\'s feet.',
      hi: 'गंगा तट पर स्थित निषादराज गुह्य की ऐतिहासिक राजधानी, जहां वनगमन के समय भगवान राम, सीता और लक्ष्मण ने प्रथम रात्रि विश्राम किया था और केवट ने प्रभु के चरण धोए थे।'
    },
    travelCause: {
      en: 'Visiting the sacred Ramchaura Ghat where Rama boarded Kevat\'s boat, seeking blessings at the Nishadraj Guha temple, and viewing ancient hydraulic brick water tanks.',
      hi: 'रामचौरा घाट पर चरण रज वंदन, केवट मिलन स्थली और 2000 वर्ष पुराने जल शोधन कुंड (Hydraulic Tank) के दर्शन।'
    },
    deepHistory: {
      en: 'Extensive excavations by Prof. B.B. Lal revealed a massive 1st-century BCE brick water reservoir with siltation chambers, proving advanced ancient hydraulic engineering.',
      hi: 'प्रो. बी.बी. लाल द्वारा उत्खनित प्राचीन भारत का सबसे बड़ा जल प्रबंधन टैंक।'
    },
    architecture: { en: 'Elaborate Kushan-era brick channels, desilting chambers, and stone riverfront ghats', hi: 'प्राचीन ईंटों का विशाल जलाशय व गंगा घाट' },
    bestTime: { en: 'October to March; Ram Navami', hi: 'अक्टूबर से मार्च; रामनवमी' },
    timings: { en: '5:00 AM - 8:30 PM', hi: 'सुबह 5:00 से रात 8:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved riverfront promenade with vehicle parking right next to Ramchaura Ghat.', hi: 'रामचौरा घाट तक वाहनों की सीधी पहुंच।' },
    photographyTips: { en: 'Boat crossing reflections over the serene broad Ganga at sunrise.', hi: 'सूर्योदय के समय शांत गंगा में नाव के प्रतिबिंब।' },
    safetyTips: { en: 'Wear life jackets if taking wooden boat excursions across the Ganges.', hi: 'नाव यात्रा के दौरान सुरक्षा जैकेट पहनें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800', title: { en: 'Shringverpur Ramchaura Ghat', hi: 'शृंगवेरपुर रामचौरा घाट' } }],
    tags: ['shringverpur', 'prayagraj', 'ramayana', 'kevat', 'nishadraj', 'ramchaura', 'शृंगवेरपुर']
  },
  {
    id: 'ashtabhuja_temple_mirzapur',
    name: 'Ashtabhuja Temple & Kali Khoh',
    hindiName: 'अष्टभुजा मंदिर एवं काली खोह गुफा',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'temple',
    categoryLabel: { en: 'Forested Hillside Shrine', hi: 'पहाड़ी शक्तिपीठ एवं गुफा' },
    coordinates: [25.1550, 82.4900],
    description: {
      en: 'A scenic hilltop cave temple dedicated to eight-armed Goddess Ashtabhuja (sister of Krishna) situated amidst Vindhyan forest hills, completing the second leg of the sacred Trikona Yatra.',
      hi: 'विंध्य पर्वतमाला के घने जंगलों के बीच गुफा में स्थित आठ भुजाओं वाली देवी अष्टभुजा का पावन मंदिर; त्रिकोण परिक्रमा का अत्यंत रमणीय पड़ाव।'
    },
    travelCause: {
      en: 'Cave worship of Goddess Mahasaraswati, walking to the deep natural ravine shrine of Kali Khoh (Goddess Mahakali), and enjoying panoramic views of Mirzapur valleys.',
      hi: 'गुफा में महासरस्वती व काली खोह में महाकाली के दर्शन और विंध्य घाटी के सुंदर दृश्यों का आनंद।'
    },
    deepHistory: {
      en: 'The Goddess incarnated as Yogamaya, escaped Kansa\'s clutches in Mathura, and established herself on these sacred Vindhya ridges.',
      hi: 'कंस के हाथों से आकाश में अंतर्धान होकर विंध्याचल में स्थापित योगमाया का प्रत्यक्ष स्थान।'
    },
    architecture: { en: 'Rock-cut sanctum inside natural hillside limestone caverns', hi: 'प्राकृतिक पहाड़ी गुफा में बना पवित्र गर्भगृह' },
    bestTime: { en: 'Navratri; October to March', hi: 'नवरात्रि; अक्टूबर से मार्च' },
    timings: { en: '5:00 AM - 9:30 PM', hi: 'सुबह 5:00 से रात 9:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Road accessible up to hilltop; stone stairways lead into cave sanctum.', hi: 'पहाड़ी तक सड़क मार्ग; गुफा में सीढ़ियां उपलब्ध।' },
    photographyTips: { en: 'Overlooking lush Vindhyan hills and winding highways from the temple viewpoint.', hi: 'मंदिर व्यू-पॉइंट से विंध्य घाटी का मनोरम दृश्य।' },
    safetyTips: { en: 'Watch out for local monkeys on temple stairs; keep pooja bags secure.', hi: 'सीढ़ियों पर बंदरों से प्रसाद व चश्मा सुरक्षित रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800', title: { en: 'Ashtabhuja Hilltop Shrine', hi: 'अष्टभुजा पहाड़ी शक्तिपीठ' } }],
    tags: ['ashtabhuja', 'mirzapur', 'kali khoh', 'trikona', 'vindhyachal', 'cave', 'अष्टभुजा']
  },

  // ==================== 3. HISTORIC FORTS & PALACES ====================
  {
    id: 'kalinjar_fort_banda',
    name: 'Kalinjar Fort (Neelkanth Mahadev & Hilltop Bastion)',
    hindiName: 'कालिंजर दुर्ग (नीलकंठ महादेव एवं अजेय पहाड़ी किला)',
    city: 'Banda',
    hindiCity: 'बांदा',
    category: 'heritage',
    categoryLabel: { en: 'Impregnable Mountain Fortress', hi: 'अजेय ऐतिहासिक पहाड़ी दुर्ग' },
    coordinates: [25.0189, 80.4855],
    description: {
      en: 'One of the most formidable and legendary hill fortresses in Indian history, rising 800 feet above the Bundelkhand plains, famous for the rock-cut Neelkanth Mahadev shrine.',
      hi: 'बुंदेलखंड के मैदानों से 800 फीट ऊंचा अजेय ऐतिहासिक पहाड़ी किला, जो समय को जीतने वाले नीलकंठ महादेव मंदिर और 7 विशाल द्वारों के लिए प्रसिद्ध है।'
    },
    travelCause: {
      en: 'Worshiping at the rock-cut 18-armed colossal Bhairava and Neelkanth Shiva cave temple, touching the subterranean perennial spring water, and viewing seven defensive gates.',
      hi: 'गुफा में नीलकंठ महादेव शिवलिंग और 18-भुजा भैरव प्रतिमा के दर्शन, पाताल गंगा और कोटि तीर्थ कुंड का अवलोकन।'
    },
    deepHistory: {
      en: 'Revered since the Vedic period; held by Chandela rulers for centuries. Sher Shah Suri met his death while besieging this fort in 1545.',
      hi: 'चंदेल राजाओं का अभेद्य दुर्ग; 1545 में इसी किले को जीतने के प्रयास में शेरशाह सूरी की मृत्यु हुई थी।'
    },
    architecture: { en: 'Monumental stone ramparts, subterranean rock-cut cisterns, and ornate Chandela sculptures', hi: 'चंदेल पाषाण वास्तुकला और अभेद्य परकोटे' },
    bestTime: { en: 'October to March; Winter mornings', hi: 'अक्टूबर से मार्च; शीतकालीन सुबह' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: '₹25 Indians, ₹300 Foreigners', hi: '₹25 भारतीय, ₹300 विदेशी' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Vehicles drive up to top gate; walking requires navigating ancient stone staircases.', hi: 'शीर्ष द्वार तक वाहन पहुंच; किले में पैदल सीढ़ियां हैं।' },
    photographyTips: { en: 'Intricate Chandela friezes of dancing deities carved directly into the living granite cliff face.', hi: 'चट्टान पर उकेरे गए नीलकंठ महादेव और चंदेल शिल्पों के चित्र।' },
    safetyTips: { en: 'Wear sturdy walking shoes for stone steps; explore with local ASI certified guides.', hi: 'सीढ़ियों हेतु आरामदायक जूते पहनें और पेयजल साथ रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Kalinjar Fort Ramparts & Neelkanth', hi: 'कालिंजर दुर्ग नीलकंठ मंदिर' } }],
    tags: ['kalinjar', 'banda', 'chandela', 'neelkanth', 'sher shah suri', 'heritage', 'कालिंजर']
  },
  {
    id: 'chunar_fort_mirzapur',
    name: 'Chunar Fort (Ganges Cliff Fortress)',
    hindiName: 'चुनार का किला (गंगा तट का प्राचीन दुर्ग)',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'heritage',
    categoryLabel: { en: 'Legendary Ganges Riverfront Citadel', hi: 'गंगा किनारे का प्राचीन दुर्ग' },
    coordinates: [25.1278, 82.8753],
    description: {
      en: 'Perched on a rocky promontory overlooking a dramatic bend of the River Ganges, this 2,500-year-old fortress is steeped in legends of King Vikramaditya, Bhartrihari, and Sher Shah Suri.',
      hi: 'गंगा नदी के सुरम्य मोड़ पर ऊंची पहाड़ी पर स्थित 2500 वर्ष पुराना ऐतिहासिक किला, जो राजा विक्रमादित्य, योगी भर्तृहरि की समाधि और शेरशाह सूरी के इतिहास से जुड़ा है।'
    },
    travelCause: {
      en: 'Standing on the cliff ramparts with a 270-degree view of Mother Ganga, exploring the mystical underground dungeon of Raja Bhartrihari, and viewing the Sun Dial.',
      hi: 'किले की प्राचीर से गंगा के विहंगम 270-डिग्री दर्शन, भर्तृहरि गुफा और ऐतिहासिक धूप घड़ी का अवलोकन।'
    },
    deepHistory: {
      en: 'Built in the 6th century BCE; renovated by Ujjain\'s King Vikramaditya for his ascetic brother Bhartrihari; fiercely contested by Babur, Humayun, Sher Shah, and Warren Hastings.',
      hi: 'उज्जैन के राजा विक्रमादित्य द्वारा निर्मित; बाबर, हुमायूं और वारेन हेस्टिंग्स का ऐतिहासिक रणनीतिक केंद्र।'
    },
    architecture: { en: 'Chunar buff and pink sandstone ramparts, Mughal hanging balconies, and British governor pavilions', hi: 'चुनार बलुआ पत्थर के विशाल बुर्ज व झरोखे' },
    bestTime: { en: 'October to March; Early morning or sunset', hi: 'अक्टूबर से मार्च; सूर्योदय व सूर्यास्त' },
    timings: { en: '9:00 AM - 5:00 PM', hi: 'सुबह 9:00 से सायं 5:00 बजे' },
    entryFee: { en: 'Free entry (Managed by local administration)', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Road connects directly to the outer gate; rampart walks have level stone pavers.', hi: 'बाहरी गेट तक सड़क मार्ग उपलब्ध।' },
    photographyTips: { en: 'Sweeping golden-hour vistas of the Ganges flowing directly beneath the fort sheer cliff.', hi: 'किले की प्राचीर के ठीक नीचे बहती गंगा का विहंगम दृश्य।' },
    safetyTips: { en: 'Do not lean over unguarded sheer cliff parapets facing the river.', hi: 'नदी की ओर खुली प्राचीर पर झुकने से बचें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Chunar Fort Overlooking Ganges', hi: 'चुनार किला और गंगा नदी' } }],
    tags: ['chunar', 'mirzapur', 'fort', 'vikramaditya', 'bhartrihari', 'ganga', 'चुनार किला']
  },
  {
    id: 'charkhari_fort_mahoba',
    name: 'Charkhari Fort (Mangalgarh & Seven Lakes)',
    hindiName: 'चरखारी दुर्ग (मंगल गढ़ एवं सप्त सरोवर नगरी)',
    city: 'Mahoba',
    hindiCity: 'महोबा',
    category: 'heritage',
    categoryLabel: { en: 'Kashmir of Bundelkhand', hi: 'बुंदेलखंड का कश्मीर' },
    coordinates: [25.3953, 79.7547],
    description: {
      en: 'Affectionately celebrated as the "Kashmir of Bundelkhand", Charkhari is an enchanting royal hillfort town ringed by seven sprawling historical lakes and the majestic Mangalgarh Fort.',
      hi: '"बुंदेलखंड का कश्मीर" नाम से प्रसिद्ध सुरम्य रियासती शहर, जो सात विशाल झीलों और पहाड़ी पर स्थित मंगल गढ़ किले से सुशोभित है।'
    },
    travelCause: {
      en: 'Boat rides across Jay Sagar and Ratan Sagar lakes, trekking to Mangalgarh Fort for 360-degree lake panoramas, and visiting the historic 108 Krishna temple shrines.',
      hi: 'जय सागर झील में नौकायन, मंगल गढ़ पहाड़ी से सातों झीलों का विहंगम दृश्य और 108 कृष्ण मंदिरों के दर्शन।'
    },
    deepHistory: {
      en: 'Founded by Bundela king Khuman Singh in 1765; famed for standing undefeated with British artillery alliances in the 1857 resistance.',
      hi: '1765 में बुंदेला शासक खुमान सिंह द्वारा स्थापित ऐतिहासिक रियासत।'
    },
    architecture: { en: 'Bundela Rajput hilltop fortresses with arched pavilions overlooking natural water reservoirs', hi: 'झीलों के किनारे बुंदेला छतरियां व पहाड़ी दुर्ग' },
    bestTime: { en: 'Post-monsoon and Winter (August to February)', hi: 'मानसून के बाद व शीतकाल (अगस्त से फरवरी)' },
    timings: { en: '6:00 AM - 6:30 PM', hi: 'सुबह 6:00 से शाम 6:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Lakeside roads are fully motorable; mild hill climb up to Mangalgarh ramparts.', hi: 'झील किनारे पक्के मार्ग; किले पर हल्की चढ़ाई।' },
    photographyTips: { en: 'Reflections of Mangalgarh fort ramparts in the mirror-like waters of Jay Sagar.', hi: 'जय सागर के जल में किले के परकोटे का अद्भुत प्रतिबिंब।' },
    safetyTips: { en: 'Enjoy lake perimeters with caution; hire local fishermen boats with life jackets.', hi: 'झीलों के किनारे सावधानी रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Charkhari Seven Lakes Fort', hi: 'चरखारी झील एवं दुर्ग' } }],
    tags: ['charkhari', 'mahoba', 'kashmir of bundelkhand', 'mangalgarh', 'lakes', 'चरखारी']
  },
  {
    id: 'talbehat_fort_lalitpur',
    name: 'Talbehat Fort & Mansagar Lake',
    hindiName: 'तालबेहट दुर्ग एवं मानसागर झील',
    city: 'Lalitpur',
    hindiCity: 'ललितपुर',
    category: 'heritage',
    categoryLabel: { en: 'Lakeside Bundela Fortress', hi: 'झील किनारे का बुंदेला दुर्ग' },
    coordinates: [25.0442, 78.4319],
    description: {
      en: 'A stunning lakeside medieval fortress built in 1618 by Raja Bharat Shah of Bar, standing proudly on the edge of the sprawling Mansagar Lake, containing the revered Narsingh Temple.',
      hi: '1618 में राजा भरत शाह द्वारा मानसागर झील के तट पर निर्मित भव्य किला, जिसके भीतर प्रसिद्ध भगवान नृसिंह का ऐतिहासिक मंदिर है।'
    },
    travelCause: {
      en: 'Strolling through high lakeside watchtowers, seeking blessings at the historic Narsingh Temple, and enjoying tranquil sunsets over Mansagar Lake waters.',
      hi: 'मानसागर झील के किनारे बुर्जों पर सैर, नृसिंह भगवान के दर्शन और मनोहारी सूर्यास्त का आनंद।'
    },
    deepHistory: {
      en: 'Later fortified and ruled by the Bundela king Mardan Singh of Banpur, who played a heroic role in the 1857 liberation war.',
      hi: '1857 के अमर स्वतंत्रता सेनानी राजा मर्दन सिंह की ऐतिहासिक कर्मभूमि।'
    },
    architecture: { en: 'High Bundela defensive stone walls merging directly into deep lake waters', hi: 'झील के जल से सटा हुआ मजबूत बुंदेला परकोटा' },
    bestTime: { en: 'September to March; Evening sunset', hi: 'सितंबर से मार्च; सांध्य काल' },
    timings: { en: '7:00 AM - 6:00 PM', hi: 'सुबह 7:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Vehicle accessible right to the lake gate; level walking within temple courtyard.', hi: 'झील के मुख्य द्वार तक वाहनों की पहुंच।' },
    photographyTips: { en: 'Golden sunset rays reflecting between fort turrets and Mansagar Lake ripples.', hi: 'किले के बुर्जों और मानसागर झील पर ढलते सूरज की किरणें।' },
    safetyTips: { en: 'Stay within marked ramparts near deep water edges.', hi: 'झील के गहरे जल के निकट सावधानी रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Talbehat Fort Lakeside Bastion', hi: 'तालबेहट किला एवं मानसागर' } }],
    tags: ['talbehat', 'lalitpur', 'mansagar', 'narsingh mandir', 'mardan singh', 'तालबेहट']
  },
  {
    id: 'barua_sagar_fort_jhansi',
    name: 'Barua Sagar Fort & Lake',
    hindiName: 'बरुआ सागर दुर्ग एवं ऐतिहासिक झील',
    city: 'Jhansi',
    hindiCity: 'झांसी',
    category: 'heritage',
    categoryLabel: { en: 'Historic Lake Fortress', hi: 'ऐतिहासिक सरोवर दुर्ग' },
    coordinates: [25.3678, 78.7350],
    description: {
      en: 'A picturesque 18th-century sandstone fortress built by Bundela ruler Raja Udit Singh overlooking the vast Barua Sagar Tal lake, and site of the historic Battle of Barwa Sagar (1744).',
      hi: 'झांसी के निकट 18वीं शताब्दी में राजा उदित सिंह द्वारा निर्मित सुरम्य किला, जो विशाल बरुआ सागर झील के तट पर स्थित है।'
    },
    travelCause: {
      en: 'Ascending fort roof terraces for lake panoramic views, visiting the 9th-century granite temple Jarai-ka-Math, and peaceful sunset picnics.',
      hi: 'किले की छत से झील का 360-डिग्री दृश्य और 9वीं सदी के प्रतिहार कालीन जरई का मठ मंदिर का दर्शन।'
    },
    deepHistory: {
      en: 'The fierce battle between the Maratha Peshwas and Bundelas was fought on these very shores in 1744; near the dam built with stone masonry.',
      hi: '1744 में मराठों और बुंदेलों के बीच हुए ऐतिहासिक युद्ध की रणभूमि।'
    },
    architecture: { en: 'Multi-tiered Bundela balconies, masonry lake embankments, and Pratihara carved shrines', hi: 'मल्टी-टियर बुंदेला छतरियां और प्रतिहार शैली का जरई मठ' },
    bestTime: { en: 'October to February; 4:00 PM - 6:00 PM', hi: 'अक्टूबर से फरवरी; शाम 4:00 से 6:00' },
    timings: { en: '6:00 AM - 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Approach road connects directly from Jhansi-Khajuraho national highway (20 km from Jhansi).', hi: 'झांसी-खजुराहो हाईवे से सीधी पक्की सड़क (20 किमी)।' },
    photographyTips: { en: 'The unique curvilinear stone spires of Jarai-ka-Math against dramatic sky clouds.', hi: 'जरई का मठ मंदिर के नक्काशीदार पत्थरों का फोटो।' },
    safetyTips: { en: 'Follow embankment safety norms along the deep lake reservoir.', hi: 'झील के बांध पर संभलकर चलें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Barua Sagar Fort Overview', hi: 'बरुआ सागर दुर्ग विहंगम दृश्य' } }],
    tags: ['barua sagar', 'jhansi', 'jarai ka math', 'bundela', 'lake', 'बरुआ सागर']
  },
  {
    id: 'kalpi_vir_singh_palace',
    name: 'Kalpi (Raja Vir Singh Palace & Vyas Teela)',
    hindiName: 'कालपी (राजा वीर सिंह देव महल एवं व्यास टीला)',
    city: 'Jalaun',
    hindiCity: 'जालौन',
    category: 'heritage',
    categoryLabel: { en: 'Ancient Yamuna Bluff Heritage', hi: 'यमुना तट की ऐतिहासिक नगरी' },
    coordinates: [26.1214, 79.7431],
    description: {
      en: 'A historic riverside town situated atop clay bluffs on the River Yamuna, revered as the birthplace of Sage Ved Vyas and Birbal, boasting the 16th-century palace of Orchha\'s King Vir Singh Dev.',
      hi: 'यमुना के ऊंचे बीहड़ों पर स्थित प्राचीन ऐतिहासिक नगरी, जिसे महर्षि वेदव्यास और बीरबल की जन्मस्थली माना जाता है; ओरछा नरेश वीर सिंह देव का महल दर्शनीय है।'
    },
    travelCause: {
      en: 'Exploring the massive Chaurasi Gumbad (84-domed tomb), praying at Vyas Teela high above the Yamuna, and visiting traditional handmade paper mills.',
      hi: '84 गुंबद का स्थापत्य, व्यास टीले से यमुना का विहंगम दर्शन और विश्वप्रसिद्ध हस्तनिर्मित कागज़ (Handmade Paper) का निर्माण देखना।'
    },
    deepHistory: {
      en: 'Fought over intensely during the 1857 War of Independence where Rani Laxmi Bai retreated and rallied forces with Rao Sahib and Tatya Tope.',
      hi: '1857 में रानी लक्ष्मीबाई, तात्या टोपे और राव साहिब के ऐतिहासिक युद्ध और रणनीतिक मोर्चा की स्थली।'
    },
    architecture: { en: 'Lodi-era 84-domed vaulted ceilings and Bundela stone riverfront palace arches', hi: 'लोदी कालीन 84 गुंबद व बुंदेला महल' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '8:00 AM - 6:00 PM', hi: 'सुबह 8:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Main monuments on paved district roads; river bluffs require guided navigation.', hi: 'स्मारकों तक पक्के रास्ते उपलब्ध।' },
    photographyTips: { en: 'Architectural symmetry under the 84 arched domes of Chaurasi Gumbad.', hi: 'चौरासी गुंबद की अद्भुत ज्यामितीय वास्तुकला।' },
    safetyTips: { en: 'Yamuna bluff drop-offs are steep; keep children close.', hi: 'यमुना बीहड़ के किनारों पर संभलकर चलें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Kalpi Chaurasi Gumbad', hi: 'कालपी 84 गुंबद एवं यमुना तट' } }],
    tags: ['kalpi', 'jalaun', 'chaurasi gumbad', 'vir singh', 'birbal', 'vyas', 'कालपी']
  },

  // ==================== 4. WILDLIFE, NATURE & ECO-TOURISM ====================
  {
    id: 'chambal_sanctuary_etawah',
    name: 'National Chambal Sanctuary (Gharial & River Dolphin)',
    hindiName: 'राष्ट्रीय चंबल अभयारण्य (घड़ियाल एवं डॉल्फिन सफारी)',
    city: 'Etawah',
    hindiCity: 'इटावा',
    category: 'nature',
    categoryLabel: { en: 'Clean River & Wildlife Safari', hi: 'स्वच्छ नदी एवं जलजीव सफारी' },
    coordinates: [26.8378, 79.0278],
    description: {
      en: 'India\'s cleanest river sanctuary dedicated to saving critically endangered Gharials, red-crowned roof turtles, Indian Skimmers, and playful freshwater Gangetic dolphins.',
      hi: 'भारत की सबसे स्वच्छ नदी का अभयारण्य, जो दुर्लभ घड़ियालों, गांगेय डॉल्फिनों, मगरमच्छों और प्रवासी पक्षियों की प्राकृतिक शरणस्थली है।'
    },
    travelCause: {
      en: 'Silent motorboat river safaris along the crystal-clear Chambal River, spotting basking gharials with long snouts, and catching views of surfacing river dolphins.',
      hi: 'शांत मोटरबोट से चंबल नदी की सफारी, धूप सेंकते घड़ियालों और पानी में छलांग लगाती डॉल्फिनों का विहंगम दर्शन।'
    },
    deepHistory: {
      en: 'Created under the Wildlife Protection Act in 1979 across a 400-km stretch covering Uttar Pradesh, Madhya Pradesh, and Rajasthan.',
      hi: '1979 में भारत सरकार द्वारा चंबल नदी के जलजीवों के संरक्षण हेतु अधिसूचित।'
    },
    architecture: { en: 'Pristine clay ravines (Chambal badlands) flanking crystal turquoise-blue waters', hi: 'प्राकृतिक बीहड़ घाटियां और स्वच्छ जल प्रवाह' },
    bestTime: { en: 'November to March (Peak sighting season)', hi: 'नवंबर से मार्च (सर्वोत्तम दर्शन समय)' },
    timings: { en: '6:30 AM - 5:30 PM (Boat safaris operate in daylight batches)', hi: 'सुबह 6:30 से शाम 5:30 बजे' },
    entryFee: { en: 'Sanctuary Permit ₹100; Forest Dept Boat Safari ₹400 - ₹800 per person', hi: 'प्रवेश ₹100; बोट सफारी ₹400 - ₹800' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Motorboat embarkation points have supportive timber ramps; life jackets mandatory.', hi: 'बोटिंग प्वाइंट पर सुरक्षा रैंप; लाइफ जैकेट अनिवार्य।' },
    photographyTips: { en: 'Long zoom lens (300mm+) to capture Indian Skimmers skimming the water surface.', hi: 'लंबी ज़ूम लेंस से घड़ियाल और स्किमर पक्षियों के चित्र।' },
    safetyTips: { en: 'Strictly follow Forest Department boating protocols; no swimming in the river.', hi: 'नदी में तैरना पूर्णतः प्रतिबंधित है।' },
    images: [{ url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800', title: { en: 'National Chambal River Safari', hi: 'चंबल नदी अभयारण्य सफारी' } }],
    tags: ['chambal', 'etawah', 'gharial', 'dolphin', 'sanctuary', 'safari', 'nature', 'चंबल']
  },
  {
    id: 'sohagi_barwa_sanctuary',
    name: 'Sohagi Barwa Wildlife Sanctuary',
    hindiName: 'सोहागी बरवा वन्यजीव अभयारण्य',
    city: 'Maharajganj',
    hindiCity: 'महराजगंज',
    category: 'nature',
    categoryLabel: { en: 'Indo-Nepal Tiger & Wetland Reserve', hi: 'भारत-नेपाल तराई वन्यजीव अभयारण्य' },
    coordinates: [27.2344, 83.6933],
    description: {
      en: 'A lush 428-sq-km Terai biodiversity corridor along the Nepal border and Gandak River, home to Royal Bengal Tigers, leopards, sloth bears, pythons, and migratory waterbirds.',
      hi: 'नेपाल सीमा और गंडक नदी से सटा 428 वर्ग किमी का हरा-भरा तराई अभयारण्य, जो बाघों, तेंदुओं, भालू और प्रवासी पक्षियों का प्राकृतिक बसेरा है।'
    },
    travelCause: {
      en: 'Exploring dense Sal forest tracks, visiting historical Madhubani and Lachhmipur ranges, and viewing wetland oxbow lakes teeming with waterbirds.',
      hi: 'घने साल के जंगलों में जीप सफारी, गंडक नदी तट पर जलजीव दर्शन और शांत प्रकृति का अनुभव।'
    },
    deepHistory: {
      en: 'Notified as a sanctuary in 1987 to protect the critical international wildlife migration corridor connecting to Nepal\'s Chitwan landscape.',
      hi: '1987 में नेपाल के चितवन राष्ट्रीय उद्यान से जुड़े कॉरिडोर के संरक्षण हेतु अधिसूचित।'
    },
    architecture: { en: 'Towering tropical moist Sal canopies and expansive reed marshes', hi: 'घने साल वृक्षों का छत्र और प्राकृतिक दलदल' },
    bestTime: { en: 'November to April', hi: 'नवंबर से अप्रैल' },
    timings: { en: '6:00 AM - 5:00 PM', hi: 'सुबह 6:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹50 Indians, ₹300 Foreigners; Jeep Safari permit extra', hi: '₹50 भारतीय, ₹300 विदेशी' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Forest Rest Houses available at Nichlaul and Lachhmipur with road approach.', hi: 'निचलौल व लछमीपुर वन विश्राम गृह में सुगम पहुंच।' },
    photographyTips: { en: 'Filter sunlight streaming through the cathedral-like tall Sal tree trunks.', hi: 'साल के ऊंचे पेड़ों के बीच छनती सुबह की धूप के चित्र।' },
    safetyTips: { en: 'Take an authorized forest tracker on all nature trails.', hi: 'वन विभाग के अधिकृत गाइड के साथ ही जंगल में प्रवेश करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800', title: { en: 'Sohagi Barwa Sal Forests', hi: 'सोहागी बरवा के साल वन' } }],
    tags: ['sohagi barwa', 'maharajganj', 'wildlife', 'tiger', 'sal forest', 'nature', 'सोहागी बरवा']
  },
  {
    id: 'kaimoor_wildlife_sanctuary',
    name: 'Kaimoor Wildlife Sanctuary & Rock Art',
    hindiName: 'कैमूर वन्यजीव अभयारण्य एवं शैलचित्र',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'nature',
    categoryLabel: { en: 'Prehistoric Rock Art & Gorge Haven', hi: 'प्रागैतिहासिक शैलचित्र व वन्य अभयारण्य' },
    coordinates: [24.5833, 83.0500],
    description: {
      en: 'A dramatic 500-sq-km landscape of rugged sandstone tablelands, deep river gorges, and prehistoric cave shelters adorned with Mesolithic rock paintings, home to leopards and blackbucks.',
      hi: '500 वर्ग किमी में फैला बलुआ पत्थर के पठारों, गहरी घाटियों और प्रागैतिहासिक शैलचित्रों (Rock Art) से समृद्ध अद्भुत अभयारण्य।'
    },
    travelCause: {
      en: 'Viewing 10,000-year-old ochre cave paintings of hunting scenes, trekking down gorge waterfalls, and observing wild blackbucks in open grasslands.',
      hi: '10,000 वर्ष पुराने गुफा शैलचित्रों के दर्शन, झरने और घास के मैदानों में कृष्णमृग (Blackbuck) का अवलोकन।'
    },
    deepHistory: {
      en: 'Contains some of the earliest documented cave paintings in North India, discovered by A.C.L. Carlleyle in 1880.',
      hi: '1880 में खोजी गई मध्य पाषाण काल की दुर्लभ शैलचित्र गुफाएं।'
    },
    architecture: { en: 'Natural overhang sandstone rock shelters and deep river gorges', hi: 'प्राकृतिक बलुआ पत्थर की गुफाएं व गहरी घाटियां' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '7:00 AM - 5:00 PM', hi: 'सुबह 7:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹50 Indians, ₹300 Foreigners', hi: '₹50 भारतीय, ₹300 विदेशी' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Forest tracks require high-clearance SUV; cave shelters reached via moderate rocky trails.', hi: 'गुफाओं तक मध्यम पथरीला पैदल मार्ग।' },
    photographyTips: { en: 'Ancient ochre red cave drawings of elephants, archers, and sun motifs.', hi: 'गुफा की दीवारों पर लाल गेरुए रंग के प्राचीन चित्र।' },
    safetyTips: { en: 'Never deface or touch prehistoric rock art pigments; carry ample water.', hi: 'शैलचित्रों को छूना पूर्णतः वर्जित है।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Kaimoor Gorges & Wilderness', hi: 'कैमूर वन्य क्षेत्र' } }],
    tags: ['kaimoor', 'mirzapur', 'sonbhadra', 'rock art', 'blackbuck', 'canyon', 'nature', 'कैमूर']
  },
  {
    id: 'bakhira_bird_sanctuary',
    name: 'Bakhira Bird Sanctuary (Ramsar Wetland)',
    hindiName: 'बखीरा पक्षी विहार (रामसर आर्द्रभूमि)',
    city: 'Sant Kabir Nagar',
    hindiCity: 'संत कबीर नगर',
    category: 'nature',
    categoryLabel: { en: 'Ramsar Freshwater Wetland', hi: 'विशाल प्राकृतिक मीठे पानी की झील' },
    coordinates: [26.9069, 83.1417],
    description: {
      en: 'The largest natural freshwater floodplain wetland in eastern Uttar Pradesh, designated as an international Ramsar site, hosting over 45,000 migratory waterfowl in winter.',
      hi: 'पूर्वी उत्तर प्रदेश की सबसे बड़ी प्राकृतिक मीठे पानी की झील व अंतरराष्ट्रीय रामसर वेटलैंड, जहां सर्दियों में 45,000 से अधिक प्रवासी पक्षी आते हैं।'
    },
    travelCause: {
      en: 'Climbing elevated watchtowers to spot Greylag geese, Pintails, and purple swamphens, taking eco-friendly guided rowboats across lotus fields.',
      hi: 'वॉच-टॉवर से दुर्लभ प्रवासी पक्षियों का दीदार, कमल के फूलों से सजी झील में नौकायन और शांत प्रकृति का आनंद।'
    },
    deepHistory: {
      en: 'Designated as a wildlife sanctuary in 1990 and declared a Ramsar Wetland of International Importance on World Wetlands Day 2022.',
      hi: '2022 में अंतरराष्ट्रीय महत्व की रामसर साइट घोषित।'
    },
    architecture: { en: 'Sprawling natural reed-covered lake with elevated timber bird-observation towers', hi: 'कमल व सरकंडों से ढकी झील व लकड़ी के वॉच टॉवर' },
    bestTime: { en: 'November to February (Peak migratory birds)', hi: 'नवंबर से फरवरी (प्रवासी पक्षी आगमन)' },
    timings: { en: '6:00 AM - 5:30 PM', hi: 'सुबह 6:00 से शाम 5:30 बजे' },
    entryFee: { en: '₹30 Indians, ₹200 Foreigners', hi: '₹30 भारतीय, ₹200 विदेशी' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Main jetty and lakeside trail are paved with easy wheelchair access to viewing deck.', hi: 'मुख्य जेटी और वॉच-डेक तक पक्का सुगम मार्ग।' },
    photographyTips: { en: 'Vast flocks of whistling ducks lifting off simultaneously at dawn.', hi: 'सुबह के समय झील से एक साथ उड़ान भरते पक्षियों के झुंड।' },
    safetyTips: { en: 'Use silent hand-rowed boats to avoid disturbing resting bird colonies.', hi: 'पक्षियों को शांत नौकायन से ही देखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Bakhira Wetland Birdlife', hi: 'बखीरा पक्षी विहार' } }],
    tags: ['bakhira', 'sant kabir nagar', 'ramsar', 'wetland', 'bird sanctuary', 'nature', 'बखीरा']
  },
  {
    id: 'okhla_bird_sanctuary',
    name: 'Okhla Bird Sanctuary & Wetlands',
    hindiName: 'ओखला पक्षी विहार (यमुना आर्द्रभूमि)',
    city: 'Noida',
    hindiCity: 'नोएडा',
    category: 'nature',
    categoryLabel: { en: 'Urban River Wetland Oasis', hi: 'यमुना तट पक्षी अभयारण्य' },
    coordinates: [28.5633, 77.3092],
    description: {
      en: 'A 4-sq-km tranquil wetland sanctuary situated where the River Yamuna enters Uttar Pradesh, home to over 300 bird species including thorny-tailed flamingos and grey-headed fish eagles.',
      hi: 'यमुना नदी पर स्थित 4 वर्ग किमी का शांत हरित वेटलैंड, जहां 300 से अधिक देशी व प्रवासी पक्षी प्रजातियां पाई जाती हैं।'
    },
    travelCause: {
      en: 'Walking the 3.5-km shaded nature trail along the Yamuna barrage, spotting waterbirds from hide shelters, and peaceful morning birdwatching just minutes from metro stations.',
      hi: 'यमुना बैराज किनारे 3.5 किमी नेचर वॉक, बर्ड हाइड्स से दुर्लभ पक्षी दर्शन और शांत वातावरण का आनंद।'
    },
    deepHistory: {
      en: 'Created in 1990 after the completion of the Okhla Barrage created rich shallow water reed beds beloved by migratory waterfowl.',
      hi: '1990 में उत्तर प्रदेश सरकार द्वारा पक्षी विहार अधिसूचित।'
    },
    architecture: { en: 'Natural river marshes, bamboo observation blinds, and elevated watchtowers', hi: 'बांस के बर्ड-हाइड और वॉच टॉवर' },
    bestTime: { en: 'November to March; 6:30 AM - 10:30 AM', hi: 'नवंबर से मार्च; सुबह 6:30 से 10:30 बजे' },
    timings: { en: '7:00 AM - 5:30 PM (Winter: 7:00 AM - 5:00 PM)', hi: 'सुबह 7:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹30 Indians, ₹350 Foreigners', hi: '₹30 भारतीय, ₹350 विदेशी' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Paved, flat lakeside paths throughout; located right opposite Okhla Bird Sanctuary Metro Station.', hi: 'मेट्रो स्टेशन के ठीक सामने; समतल सुगम पक्के रास्ते।' },
    photographyTips: { en: 'Reflections of waterbirds with the Noida high-rise skyline in the distant morning haze.', hi: 'नोएडा के आधुनिक स्काईलाइन की पृष्ठभूमि में पक्षियों के चित्र।' },
    safetyTips: { en: 'Carry binoculars; maintain quiet along the walking paths.', hi: 'दूरबीन साथ रखें और पदयात्रा मार्ग पर शांति बनाए रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Okhla Bird Sanctuary Wetlands', hi: 'ओखला पक्षी विहार वेटलैंड' } }],
    tags: ['okhla', 'noida', 'bird sanctuary', 'yamuna', 'wetland', 'metro', 'nature', 'ओखला']
  },
  {
    id: 'suraha_tal_sanctuary',
    name: 'Suraha Tal Bird Sanctuary (Jai Prakash Narayan)',
    hindiName: 'सुरहा ताल पक्षी विहार (जयप्रकाश नारायण)',
    city: 'Ballia',
    hindiCity: 'बलिया',
    category: 'nature',
    categoryLabel: { en: 'Historic Oxbow Lake Sanctuary', hi: 'प्राकृतिक गोखुर झील व पक्षी विहार' },
    coordinates: [25.8206, 84.1856],
    description: {
      en: 'A massive 34-sq-km natural oxbow lake formed by the meandering Ganga River in Ballia, celebrated for massive flocks of migratory Siberian cranes and bar-headed geese.',
      hi: 'गंगा नदी द्वारा निर्मित 34 वर्ग किमी की विशाल प्राकृतिक गोखुर झील, जो साइबेरियन क्रेन और बार-हेडेड गीज़ जैसे हजारों विदेशी पक्षियों का शीतकालीन घर है।'
    },
    travelCause: {
      en: 'Eco-boat safaris across the wide open blue waters, bird photography from lakeside watchtowers, and touring Loknayak Jayprakash Narayan\'s ancestral heritage nearby.',
      hi: 'विशाल नीले जल में नौकायन, बर्ड वॉचिंग और लोकनायक जयप्रकाश नारायण की पावन धरती का दर्शन।'
    },
    deepHistory: {
      en: 'Notified as a sanctuary in 1991 and named in honor of freedom fighter Loknayak Jai Prakash Narayan.',
      hi: '1991 में पक्षी विहार घोषित; लोकनायक जयप्रकाश नारायण को समर्पित।'
    },
    architecture: { en: 'Sprawling natural lake perimeter fringed by yellow mustard fields and fishing boats', hi: 'सरसों के खेतों और मछुआरों की नौकाओं से घिरा सुरम्य सरोवर' },
    bestTime: { en: 'December to February', hi: 'दिसंबर से फरवरी' },
    timings: { en: '6:00 AM - 5:30 PM', hi: 'सुबह 6:00 से शाम 5:30 बजे' },
    entryFee: { en: '₹30', hi: '₹30' },
    accessibilityRating: 7,
    accessibilityNotes: { en: 'Village roads connect directly to the main watchtower and boat ghat.', hi: 'मुख्य वॉच टॉवर तक सड़क मार्ग उपलब्ध।' },
    photographyTips: { en: 'Flocks of bar-headed geese taking flight against the morning winter mist.', hi: 'कुहासे के बीच उड़ान भरते प्रवासी पक्षी।' },
    safetyTips: { en: 'Ensure boat operators provide life jackets before venturing into deep lake waters.', hi: 'झील के गहरे पानी में जाते समय लाइफ जैकेट अवश्य लें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Suraha Tal Lake Ballia', hi: 'सुरहा ताल बलिया' } }],
    tags: ['suraha tal', 'ballia', 'bird sanctuary', 'jai prakash narayan', 'nature', 'सुरहा ताल']
  },
  {
    id: 'lakh_bahosi_sanctuary',
    name: 'Lakh Bahosi Bird Sanctuary',
    hindiName: 'लाख बहोसी पक्षी विहार',
    city: 'Kannauj',
    hindiCity: 'कन्नौज',
    category: 'nature',
    categoryLabel: { en: 'Twin Lakes Waterfowl Haven', hi: 'विशाल दोहरी झील पक्षी विहार' },
    coordinates: [26.9142, 79.6450],
    description: {
      en: 'One of the largest bird sanctuaries in Uttar Pradesh covering two interconnected freshwater lakes (Lakh and Bahosi) spanning 80 sq km, hosting over 100,000 birds from 49 species.',
      hi: 'उत्तर प्रदेश के सबसे बड़े पक्षी अभयारण्यों में से एक, जो 80 वर्ग किमी में फैली लाख और बहोसी नामक दो झीलों पर 1 लाख से अधिक प्रवासी पक्षियों को आश्रय देता है।'
    },
    travelCause: {
      en: 'Watching massive flotillas of Greylag geese, Northern pintails, and flamingos, combining nature touring with Kannauj\'s world-famous traditional attar perfume distilleries.',
      hi: 'हजारों प्रवासी पक्षियों के अद्भुत नजारे देखना और कन्नौज के विश्वप्रसिद्ध इत्र कारखानों का भ्रमण।'
    },
    deepHistory: {
      en: 'Protected as a wildlife sanctuary in 1988 to conserve the premier wetland feeding grounds along the central Indo-Gangetic flyway.',
      hi: '1988 में स्थापित उत्तर भारत का प्रमुख वेटलैंड।'
    },
    architecture: { en: 'Expansive water expanses with watchtowers and earthen embankments', hi: 'विशाल झीलें और वन विभाग के वॉच टॉवर' },
    bestTime: { en: 'November to February (Maximum bird density)', hi: 'नवंबर से फरवरी (पक्षियों का चरम समय)' },
    timings: { en: '6:00 AM - 5:30 PM', hi: 'सुबह 6:00 से शाम 5:30 बजे' },
    entryFee: { en: '₹30 Indians, ₹200 Foreigners', hi: '₹30 भारतीय, ₹200 विदेशी' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Well-maintained forest interpretation center and paved dyke paths for walking.', hi: 'सूचना केंद्र और बांध पर पक्के पैदल मार्ग।' },
    photographyTips: { en: 'Telephoto captures of flamingos feeding in the shallow waters of Bahosi lake.', hi: 'बहोसी झील के उथले पानी में फ्लेमिंगो के चित्र।' },
    safetyTips: { en: 'Do not use drones or loud horns in sanctuary zone.', hi: 'अभयारण्य क्षेत्र में ड्रोन व हॉर्न का प्रयोग न करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Lakh Bahosi Wetland Birds', hi: 'लाख बहोसी पक्षी विहार' } }],
    tags: ['lakh bahosi', 'kannauj', 'bird sanctuary', 'wetland', 'perfume', 'nature', 'लाख बहोसी']
  },
  {
    id: 'patna_bird_sanctuary',
    name: 'Patna Bird Sanctuary',
    hindiName: 'पटना पक्षी विहार',
    city: 'Etah',
    hindiCity: 'एटा',
    category: 'nature',
    categoryLabel: { en: 'Compact Wetland & Date Palm Oasis', hi: 'प्राकृतिक वेटलैंड एवं खजूर वन' },
    coordinates: [27.5342, 78.6811],
    description: {
      en: 'A picturesque 1-sq-km natural oxbow wetland surrounded by scenic date palm groves, known for hosting over 200,000 birds of 180 species in peak winter.',
      hi: 'खजूर के पेड़ों से घिरा 1 वर्ग किमी का सुरम्य वेटलैंड, जहां सर्दियों में 2 लाख से अधिक देशी-विदेशी पक्षी डेरा डालते हैं।'
    },
    travelCause: {
      en: 'Intimate birdwatching from shaded lakeside hides, viewing comb ducks, mallards, and purple herons, and relaxing in a tranquil pastoral setting.',
      hi: 'पेड़ों की छांव में पक्षी दर्शन, मल्लार्ड और बतखों की अठखेलियां देखना।'
    },
    deepHistory: {
      en: 'Notified as a sanctuary in 1991, celebrated for its unique dense canopy of wild date trees (Phoenix sylvestris).',
      hi: '1991 में पक्षी विहार अधिसूचित; खजूर के घने पेड़ों के लिए प्रसिद्ध।'
    },
    architecture: { en: 'Dense date palm groves encircling a shallow aquatic weed lake', hi: 'खजूर के बगीचे और जलकुंभी से सजी झील' },
    bestTime: { en: 'November to February', hi: 'नवंबर से फरवरी' },
    timings: { en: '6:30 AM - 5:00 PM', hi: 'सुबह 6:30 से शाम 5:00 बजे' },
    entryFee: { en: '₹30', hi: '₹30' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Level perimeter walking paths; easy road access from Jalesar town.', hi: 'जलेसर मार्ग से सुगम पहुंच और समतल रास्ते।' },
    photographyTips: { en: 'Silhouettes of migratory ducks against the golden evening sky framed by palm fronds.', hi: 'खजूर के पत्तों के बीच से ढलते सूरज में पक्षियों के चित्र।' },
    safetyTips: { en: 'Wear insect repellent during late afternoon wetland walks.', hi: 'शाम के समय कीट-रोधी क्रीम का प्रयोग करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Patna Bird Sanctuary Etah', hi: 'पटना पक्षी विहार एटा' } }],
    tags: ['patna bird sanctuary', 'etah', 'jalesar', 'wetland', 'nature', 'पटना पक्षी विहार']
  },

  // ==================== 5. WATERFALLS & GEOLOGICAL WONDERS ====================
  {
    id: 'rajdari_devdari_waterfalls',
    name: 'Rajdari & Devdari Waterfalls (Chandraprabha)',
    hindiName: 'राजदरी एवं देवदरी जलप्रपात (चंद्रप्रभा)',
    city: 'Chandauli',
    hindiCity: 'चंदौली',
    category: 'waterfall',
    categoryLabel: { en: 'Tiered Step Cascades & Canyons', hi: 'भव्य सीढ़ीदार जलप्रपात एवं घाटी' },
    coordinates: [25.0133, 83.2389],
    description: {
      en: 'Spectacular tiered step cascades tumbling 65 meters through jagged sandstone cliffs inside the lush Chandraprabha Wildlife Sanctuary, accompanied by the dramatic Devdari canyon waterfall.',
      hi: 'चंद्रप्रभा वन्यजीव अभयारण्य की वादियों में 65 मीटर की ऊंचाई से सीढ़ीदार चट्टानों पर गिरता मनोहारी राजदरी झरना और उसके निकट गहरी घाटी में गिरता देवदरी प्रपात।'
    },
    travelCause: {
      en: 'Standing at the mist-soaked viewing deck of Rajdari, feeling the roaring spray of stepped cascades, and hiking to the dizzying precipice of Devdari canyon.',
      hi: 'राजदरी की ठंडी फुहारों का आनंद, सीढ़ीदार जलप्रपात के चित्र लेना और देवदरी घाटी की प्राकृतिक सुंदरता देखना।'
    },
    deepHistory: {
      en: 'Historically served as the private royal hunting reserve of the Kashi Naresh rulers of Varanasi before becoming a sanctuary in 1957.',
      hi: 'काशी नरेश का ऐतिहासिक शाही शिकारगाह; 1957 में वन्यजीव अभयारण्य बना।'
    },
    architecture: { en: 'Natural tiered sandstone bedrock terraces carved by the Chandraprabha River', hi: 'चंद्रप्रभा नदी द्वारा तराशी गई प्राकृतिक सीढ़ीदार चट्टानें' },
    bestTime: { en: 'Post-Monsoon (August to January; peak roaring flow August-October)', hi: 'मानसून व उसके उपरांत (अगस्त से जनवरी)' },
    timings: { en: '8:00 AM - 5:00 PM', hi: 'सुबह 8:00 से शाम 5:00 बजे' },
    entryFee: { en: 'Sanctuary Entry ₹50 Indians, ₹300 Foreigners; Vehicle Entry ₹100', hi: 'प्रवेश ₹50; वाहन ₹100' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved road directly connects parking to the Rajdari waterfall viewing pavilion and park.', hi: 'झरने के मुख्य व्यू-डेक तक पक्की सड़क।' },
    photographyTips: { en: 'Long-exposure waterfall shots from the central platform showing the creamy white stepped cascades.', hi: 'लॉन्ग एक्सपोज़र से सीढ़ीदार सफेद दूधिया जलप्रपात का फोटो।' },
    safetyTips: { en: 'Strictly prohibited to climb slippery rocks or swim near the deep waterfall plunge pool.', hi: 'फिसलन भरी चट्टानों और गहरे कुंड में न उतरें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Rajdari Step Waterfall', hi: 'राजदरी सीढ़ीदार जलप्रपात' } }],
    tags: ['rajdari', 'devdari', 'chandauli', 'waterfall', 'chandraprabha', 'cascades', 'राजदरी']
  },
  {
    id: 'lakhania_dari_waterfall',
    name: 'Lakhania Dari Waterfall & Canyon',
    hindiName: 'लखनिया दरी जलप्रपात एवं घाटी',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'waterfall',
    categoryLabel: { en: 'Hidden Forest Gorge Waterfall', hi: 'प्राकृतिक घाटी जलप्रपात' },
    coordinates: [25.0450, 82.9150],
    description: {
      en: 'A hidden canyon waterfall tucked away in the deep rocky ravines of the Vindhyan hills, cascading 100 meters down into a crystal-clear turquoise natural pool surrounded by monolithic boulders.',
      hi: 'विंध्य पर्वतमाला की गहरी घाटियों में छिपा 100 मीटर ऊंचा अद्भुत झरना, जो विशाल पत्थरों और शांत हरे पानी के प्राकृतिक कुंड से घिरा है।'
    },
    travelCause: {
      en: 'Trekking through natural boulder-strewn canyon trails, cooling off in pristine forest spray, and discovering ancient prehistoric rock shelters along the gorge.',
      hi: 'प्राकृतिक चट्टानी रास्तों पर ट्रैकिंग, झरने की फुहारों का आनंद और आदिमानव के प्राचीन शैलचित्रों की खोज।'
    },
    deepHistory: {
      en: 'Surrounding cliffs contain ancient rock shelters and pre-historic rock art paintings created by early hunter-gatherers.',
      hi: 'घाटी की चट्टानों में आदिमानव द्वारा बनाए गए प्राचीन शैलचित्र सुरक्षित हैं।'
    },
    architecture: { en: 'Deep vertical sandstone canyon walls dropping into a mountain stream pool', hi: 'बलुआ पत्थर की लंबवत घाटियां व प्राकृतिक कुंड' },
    bestTime: { en: 'August to December', hi: 'अगस्त से दिसंबर' },
    timings: { en: '7:00 AM - 5:00 PM (Entry stops at 4:00 PM)', hi: 'सुबह 7:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹50 per person', hi: '₹50 प्रति व्यक्ति' },
    accessibilityRating: 6,
    accessibilityNotes: { en: 'Requires a moderate 1.5-km trek over riverbed rocks from parking lot.', hi: 'पार्किंग से 1.5 किमी का पथरीला पैदल ट्रैक।' },
    photographyTips: { en: 'Sunbeams piercing the narrow canyon opening onto the roaring waterfall spray.', hi: 'घाटी के बीच से झरने पर पड़ती सूर्य की किरणों का दृश्य।' },
    safetyTips: { en: 'Do not dive into unverified deep water zones; leave canyon before dusk.', hi: 'अंधेरा होने से पहले घाटी से बाहर आ जाएं।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Lakhania Dari Waterfall Gorge', hi: 'लखनिया दरी जलप्रपात' } }],
    tags: ['lakhania dari', 'mirzapur', 'waterfall', 'trekking', 'canyon', 'gorge', 'लखनिया दरी']
  },
  {
    id: 'windham_tanda_waterfalls',
    name: 'Windham & Tanda Waterfalls',
    hindiName: 'विंडम एवं टांडा जलप्रपात',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'waterfall',
    categoryLabel: { en: 'Woodland Cascades & Reservoir', hi: 'शांत वन प्रपात एवं जलाशय' },
    coordinates: [25.1050, 82.5350],
    description: {
      en: 'Charming woodland cascades on the Khajuri River named after British collector Windham, complemented by the vast scenic Tanda reservoir and cascading rocky rapids.',
      hi: 'खजुरी नदी पर घने जंगलों के बीच गिरता सुरम्य विंडम झरना और समीप स्थित टांडा जलाशय, जो पिकनिक और प्राकृतिक विश्राम के लिए प्रसिद्ध है।'
    },
    travelCause: {
      en: 'Relaxing amidst cool forested rock pools, strolling the dam promenade, and enjoying family eco-tourism away from urban crowds.',
      hi: 'जंगल के बीच चट्टानी जलप्रपात में स्नान, बांध पर सैर और शांत प्राकृतिक वातावरण का आनंद।'
    },
    deepHistory: {
      en: 'Developed in the late 19th century as a hill retreat for administrators and local royalty seeking respite in the cooler Vindhya uplands.',
      hi: '19वीं सदी में विकसित विंध्य पहाड़ी का ऐतिहासिक पिकनिक स्थल।'
    },
    architecture: { en: 'Tiered stone rapids over flat sandstone platforms', hi: 'समतल चट्टानों पर बहती जलधाराएं' },
    bestTime: { en: 'August to February', hi: 'अगस्त से फरवरी' },
    timings: { en: '8:00 AM - 5:30 PM', hi: 'सुबह 8:00 से शाम 5:30 बजे' },
    entryFee: { en: 'Free general access (Nominal parking fee)', hi: 'सामान्य प्रवेश निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved paths and picnic benches directly along the upper stream banks.', hi: 'झरने के किनारे पक्के रास्ते व विश्राम बेंच।' },
    photographyTips: { en: 'Wide cascades flowing over layered rock shelves with lush green monsoon foliage.', hi: 'चट्टानी सीढ़ियों पर बहते पानी का फोटो।' },
    safetyTips: { en: 'Avoid slippery moss-covered rocks in the waterfall stream.', hi: 'काई जमी फिसलन भरी चट्टानों पर सावधानी बरतें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Windham Falls Mirzapur', hi: 'विंडम जलप्रपात मिर्ज़ापुर' } }],
    tags: ['windham', 'tanda', 'mirzapur', 'waterfall', 'khajuri', 'nature', 'विंडम']
  },
  {
    id: 'salkhan_fossil_park',
    name: 'Salkhan Fossil Park (Sonbhadra)',
    hindiName: 'सलखन जीवाश्म पार्क (सोनभद्र)',
    city: 'Sonbhadra',
    hindiCity: 'सोनभद्र',
    category: 'waterfall',
    categoryLabel: { en: '1.4 Billion Year Old Fossil Wonder', hi: '1.4 अरब वर्ष पुराना जीवाश्म पार्क' },
    coordinates: [24.5833, 83.0833],
    description: {
      en: 'A globally significant geological marvel spreading across 25 hectares, preserving fossilized Stromatolite algae formations dating back 1.4 billion years—vastly older than the first dinosaurs!',
      hi: '25 हेक्टेयर में फैला विश्वस्तरीय भूवैज्ञानिक अजूबा, जहां 1.4 अरब (140 करोड़) वर्ष पुराने स्ट्रोमेटोलाइट शैवाल जीवाश्म सुरक्षित हैं—जो डायनासोर से भी सैकड़ों करोड़ वर्ष पुराने हैं!'
    },
    travelCause: {
      en: 'Touching concentric ring-shaped Stromatolite fossils that represent the earliest life on planet Earth, walking the open-air geological park, and learning prebiotic evolution.',
      hi: 'पृथ्वी पर जीवन के सबसे आरंभिक प्रमाण स्ट्रोमेटोलाइट जीवाश्मों को छूना और 140 करोड़ साल पुराने इतिहास का साक्षात्कार।'
    },
    deepHistory: {
      en: 'Believed by international geologists to be three times larger and more intact than the Yellowstone National Park fossil beds in the USA.',
      hi: 'अंतरराष्ट्रीय भूवैज्ञानिकों के अनुसार अमेरिका के येलोस्टोन पार्क से भी बड़ा और संरक्षित जीवाश्म क्षेत्र।'
    },
    architecture: { en: 'Exposed limestone and sandstone beds with circular tree-trunk-like algal fossil rings', hi: 'पेड़ों के तने जैसी गोलाकार वलयाकार जीवाश्म चट्टानें' },
    bestTime: { en: 'October to March; Morning or late afternoon', hi: 'अक्टूबर से मार्च; सुबह अथवा शाम' },
    timings: { en: '7:00 AM - 5:30 PM', hi: 'सुबह 7:00 से शाम 5:30 बजे' },
    entryFee: { en: 'Free entry (State protected heritage)', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved walkways and protective stone paths around major fossil beds right off State Highway 5.', hi: 'स्टेट हाईवे से सीधे पक्के रास्ते और वॉकिंग ट्रैक।' },
    photographyTips: { en: 'Macro shots of the concentric circular fossil rings showing ancient algal layers.', hi: 'गोलाकार जीवाश्म छल्लों की क्लोज़-अप मैक्रो फोटोग्राफी।' },
    safetyTips: { en: 'Hammering, scratching, or removing fossilized rock samples is strictly prohibited by law.', hi: 'जीवाश्म चट्टानों को तोड़ना या ले जाना कानूनी अपराध है।' },
    images: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', title: { en: 'Salkhan Fossil Park Stromatolites', hi: 'सलखन जीवाश्म पार्क' } }],
    tags: ['salkhan', 'fossil park', 'sonbhadra', 'stromatolites', 'geology', 'ancient', 'सलखन']
  },

  // ==================== 6. CRAFT, CULTURE & RURAL HIDEAWAYS ====================
  {
    id: 'bhadohi_carpet_city',
    name: 'Bhadohi (Global Carpet City & Weaving)',
    hindiName: 'भदोही (कालीन नगरी एवं हस्तशिल्प केंद्र)',
    city: 'Bhadohi',
    hindiCity: 'भदोही',
    category: 'craft',
    categoryLabel: { en: 'World Capital of Hand-Knotted Rugs', hi: 'विश्व की कालीन नगरी' },
    coordinates: [25.4200, 82.5700],
    description: {
      en: 'Known worldwide as the "Carpet City of India", producing over half of the country\'s hand-knotted woolen and silk carpets exported across the globe.',
      hi: 'भारत की "कालीन नगरी" के रूप में विख्यात, जहां हाथ से बुने हुए उत्कृष्ट रेशमी व ऊनी कालीन तैयार होकर विश्वभर में निर्यात होते हैं।'
    },
    travelCause: {
      en: 'Touring artisan weaving looms, watching master weavers knot intricate Persian and Mughal patterns at 400 knots per square inch, and buying certified rugs directly.',
      hi: 'पारंपरिक करघों पर बुनकरों की कला देखना, 400 गांठ प्रति इंच वाले बारीक डिजाइनों की बुनाई और सीधे कालीन खरीदना।'
    },
    deepHistory: {
      en: 'Tradition traces back to the 16th century when Persian master weavers traveled through under Emperor Akbar\'s royal patronage.',
      hi: '16वीं सदी में सम्राट अकबर के काल से शुरू हुई हाथ से बुने कालीनों की समृद्ध विरासत।'
    },
    architecture: { en: 'Traditional rural weaving courtyards and grand international carpet expo centers', hi: 'पारंपरिक बुनकर घर और आधुनिक कारपेट एक्सपो मार्ट' },
    bestTime: { en: 'October to March; International Carpet Expo dates', hi: 'अक्टूबर से मार्च; कारपेट एक्सपो' },
    timings: { en: 'Weaving workshops: 9:00 AM - 6:00 PM', hi: 'सुबह 9:00 से शाम 6:00 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Town is well connected by National Highway 19 and Bhadohi railway station.', hi: 'हाईवे और रेलवे स्टेशन से सुगम संपर्क।' },
    photographyTips: { en: 'Artisans shearing and washing brightly colored dyed wool rugs in courtyards.', hi: 'रंग-बिरंगे ऊन के धागों और बुनाई करते बुनकरों के चित्र।' },
    safetyTips: { en: 'Verify GI-tag certification for authentic 100% hand-knotted Bhadohi carpets.', hi: 'जीआई टैग प्रमाणित कालीन ही खरीदें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', title: { en: 'Bhadohi Hand-Knotted Carpet Art', hi: 'भदोही कालीन हस्तशिल्प' } }],
    tags: ['bhadohi', 'carpet', 'rugs', 'weaving', 'craft', 'handloom', 'भदोही']
  },
  {
    id: 'mirzapur_heritage_city',
    name: 'Mirzapur (Vindhya Heritage, Brass & Waterfalls)',
    hindiName: 'मिर्ज़ापुर (विंध्य धरोहर, पीतल उद्योग व जलप्रपात)',
    city: 'Mirzapur',
    hindiCity: 'मिर्ज़ापुर',
    category: 'craft',
    categoryLabel: { en: 'Riverfront Heritage & Brass Hub', hi: 'गंगा धरोहर एवं पीतल नगरी' },
    coordinates: [25.1500, 82.5800],
    description: {
      en: 'A scenic district stretching between the Ganga and the Vindhya mountains, famous for Pakka Ghat, centuries-old hand-beaten brassware utensils, and rugged waterfall gorges.',
      hi: 'गंगा और विंध्याचल की पहाड़ियों के बीच बसा ऐतिहासिक शहर, जो पक्का घाट, पारंपरिक पीतल बर्तनों और मनोहारी जलप्रपातों के लिए प्रसिद्ध है।'
    },
    travelCause: {
      en: 'Walking along the grand carved sandstone riverfront of Pakka Ghat, watching brass smiths hammer traditional vessels, and tasting famous Mirzapur sweets.',
      hi: 'पक्का घाट पर गंगा दर्शन, पीतल शिल्पकारों की कार्यशालाओं का भ्रमण और विंध्य जलप्रपातों की सैर।'
    },
    deepHistory: {
      en: 'Established as an important river trading post by the British East India Company in 1735, handling cotton, brass, and Vindhyan sandstone.',
      hi: '18वीं सदी का प्रमुख व्यापारिक केंद्र और गंगा का ऐतिहासिक बंदरगाह।'
    },
    architecture: { en: 'Stone riverfront ghats with chhatris and colonial stone clocktower', hi: 'नक्काशीदार गंगा घाट, छतरियां व क्लॉक टावर' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: 'Open 24 hours (Ghats); Bazaars 10:00 AM - 8:30 PM', hi: 'घाट 24 घंटे; बाज़ार 10:00 से 8:30' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Paved streets throughout riverfront and central bazaars.', hi: 'मुख्य बाजार और घाट तक पक्के रास्ते।' },
    photographyTips: { en: 'Intricate sandstone pavilions of Pakka Ghat overlooking the tranquil Ganges river.', hi: 'पक्का घाट की छतरियों से गंगा का विहंगम दृश्य।' },
    safetyTips: { en: 'Enjoy the riverfront safely; adhere to marked bathing ghat safety guidelines.', hi: 'घाटों पर सुरक्षा नियमों का पालन करें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', title: { en: 'Mirzapur Pakka Ghat on Ganga', hi: 'मिर्ज़ापुर पक्का घाट' } }],
    tags: ['mirzapur', 'pakka ghat', 'brass', 'ganga', 'vindhyachal', 'heritage', 'मिर्ज़ापुर']
  },
  {
    id: 'nagina_woodcraft_bijnor',
    name: 'Nagina (Ebony & Rosewood Carving Village)',
    hindiName: 'नगीना (काष्ठ नक्काशी एवं शीशम शिल्प नगरी)',
    city: 'Bijnor',
    hindiCity: 'बिजनौर',
    category: 'craft',
    categoryLabel: { en: 'Intricate Woodcraft Hub', hi: 'विश्वविख्यात काष्ठ नक्काशी केंद्र' },
    coordinates: [29.4442, 78.4331],
    description: {
      en: 'Globally celebrated for delicate hand-carved ebony, rosewood (Sheesham), and bone-inlay decorative items, chess sets, jewelry boxes, and screen partitions.',
      hi: 'शीशम की लकड़ी पर बारीक हाथ की नक्काशी, हाथीदांत-शैली की इनले और सजावटी डिब्बों के लिए विश्वभर में प्रसिद्ध शिल्प नगरी।'
    },
    travelCause: {
      en: 'Watching master artisans chisel intricate floral jaali motifs into dark rosewood using fine handheld iron gouges, and purchasing export-quality wooden artifacts.',
      hi: 'शिल्पकारों को शीशम पर बारीक जालीदार नक्काशी उकेरते देखना और सुंदर कलाकृतियों की खरीदारी।'
    },
    deepHistory: {
      en: 'Flourished under Mughal royal patronage from the 16th century when master carvers crafted imperial walking sticks, combs, and Quran boxes.',
      hi: 'मुगल काल से चली आ रही नक्काशी की समृद्ध कला परंपरा।'
    },
    architecture: { en: 'Traditional open-air artisan workshops buzzing with woodworking chisels', hi: 'पारंपरिक काष्ठ शिल्प कार्यशालाएं' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: '9:30 AM - 6:30 PM (Daily)', hi: 'सुबह 9:30 से शाम 6:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Easy road connectivity from Bijnor and Najibabad; workshops accessible from main bazaar.', hi: 'मुख्य बाजार से कार्यशालाओं तक सुगम मार्ग।' },
    photographyTips: { en: 'Close-ups of master woodcarvers hand-chiseling intricate wooden jewelry boxes.', hi: 'लकड़ी पर बारीक नक्काशी करते शिल्पकारों के क्लोज़-अप चित्र।' },
    safetyTips: { en: 'Buy directly from certified woodcraft artisan clusters for authentic seasoned Sheesham.', hi: 'प्रमाणित कारीगरों से ही असली शीशम की वस्तुएं खरीदें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', title: { en: 'Nagina Hand-Carved Woodwork', hi: 'नगीना काष्ठ नक्काशी शिल्प' } }],
    tags: ['nagina', 'bijnor', 'woodcraft', 'sheesham', 'carving', 'handicrafts', 'नगीना']
  },
  {
    id: 'sardhana_church_meerut',
    name: 'Sardhana (Basilica of Our Lady of Graces)',
    hindiName: 'सरधना (अवर लेडी ऑफ ग्रेस बेसिलिका / बेगम समरू चर्च)',
    city: 'Meerut',
    hindiCity: 'मेरठ',
    category: 'heritage',
    categoryLabel: { en: 'Neoclassical Roman Catholic Basilica', hi: 'ऐतिहासिक रोमन कैथोलिक बेसिलिका' },
    coordinates: [29.1500, 77.6200],
    description: {
      en: 'A breathtaking 1822 neoclassical Roman Catholic basilica built by the extraordinary female ruler Begum Samru, featuring Italian marble statuary by Adamo Tadolini.',
      hi: '1822 में बेगम समरू द्वारा निर्मित उत्तर भारत का सबसे बड़ा और भव्य रोमन कैथोलिक चर्च (बेसिलिका), जिसमें इतालवी संगमरमर की अद्भुत मूर्तियां हैं।'
    },
    travelCause: {
      en: 'Gazing at the soaring neoclassical twin steeples, admiring the 18-ft marble tomb of Begum Samru sculpted in Italy, and attending the annual historic Marian pilgrimage in November.',
      hi: 'इटली के मूर्तिकार तडोलिनी द्वारा निर्मित बेगम समरू की 18 फीट ऊंची संगमरमरी समाधि और चर्च की वास्तुकला के दर्शन।'
    },
    deepHistory: {
      en: 'Commissioned by Begum Samru, who converted to Catholicism and ruled the independent principality of Sardhana with her mercenary army.',
      hi: 'बेगम समरू द्वारा निर्मित; 1961 में पोप जॉन तेईसवें ने इसे बेसिलिका का दर्जा दिया।'
    },
    architecture: { en: 'Grand neoclassical facade with semi-circular Doric colonnades, octagonal domes, and twin spires', hi: 'भव्य डोरिक स्तंभ, संगमरमरी वेदी और दोहरे शिखर' },
    bestTime: { en: 'November (Feast of Our Lady of Graces); October to March', hi: 'नवंबर (वार्षिक मेला); अक्टूबर से मार्च' },
    timings: { en: '6:30 AM - 6:30 PM', hi: 'सुबह 6:30 से शाम 6:30 बजे' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Flat paved lawns, ramp access into the nave, and ample parking outside church gates.', hi: 'चर्च परिसर में समतल रास्ते और रैंप उपलब्ध।' },
    photographyTips: { en: 'The twin steeples framed against clear blue morning skies through the colonnade arches.', hi: 'स्तंभों के बीच से चर्च के गगनचुंबी शिखरों का फोटो।' },
    safetyTips: { en: 'Maintain reverent quietness inside the active church sanctuary.', hi: 'चर्च परिसर में शांति बनाए रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800', title: { en: 'Sardhana Basilica Facade', hi: 'सरधना बेसिलिका चर्च' } }],
    tags: ['sardhana', 'meerut', 'church', 'begum samru', 'basilica', 'heritage', 'सरधना']
  },
  {
    id: 'etawah_lion_safari',
    name: 'Etawah Safari Park & Chambal Ravines',
    hindiName: 'इटावा सफारी पार्क एवं बीहड़ ट्रेल्स',
    city: 'Etawah',
    hindiCity: 'इटावा',
    category: 'nature',
    categoryLabel: { en: 'Premier Wildlife Safari Park', hi: 'विशाल वन्यजीव सफारी पार्क' },
    coordinates: [26.7850, 79.0350],
    description: {
      en: 'One of the largest wildlife drive-through safari parks in Asia spanning 350 hectares of rugged Chambal ravines, featuring Lion, Tiger, Leopard, Bear, and Deer Safaris.',
      hi: 'एशिया के सबसे बड़े ड्राइव-थ्रू सफारी पार्कों में से एक, जो 350 हेक्टेयर में फैला है और जहां बब्बर शेर, बाघ, तेंदुआ, भालू व हिरण सफारी का रोमांचक अनुभव मिलता है।'
    },
    travelCause: {
      en: 'Experiencing open-range Asiatic lion sightings from secure safari buses, touring the 4D environmental theater, and walking the scenic Chambal ravine nature trails.',
      hi: 'सुरक्षित सफारी बस से खुले में घूमते एशियाई बब्बर शेरों के दर्शन और 4D थियेटर का अनुभव।'
    },
    deepHistory: {
      en: 'Developed to promote Asiatic lion breeding and ecological restoration of the degraded Chambal badlands.',
      hi: 'एशियाई शेरों के संरक्षण और बीहड़ के पुनर्जीवन हेतु विकसित अत्याधुनिक सफारी पार्क।'
    },
    architecture: { en: 'Acacia-wooded ravine ridges, high-security safari moats, and modern visitor plazas', hi: 'चंबल बीहड़ के टीले और आधुनिक आगंतुक केंद्र' },
    bestTime: { en: 'October to March (Closed on Mondays)', hi: 'अक्टूबर से मार्च (सोमवार को बंद)' },
    timings: { en: '9:00 AM - 5:00 PM (Last safari ticket 3:30 PM)', hi: 'सुबह 9:00 से शाम 5:00 बजे' },
    entryFee: { en: '₹200 adults (includes Safari Bus & 4D theater entry)', hi: '₹200 प्रति व्यक्ति (सफारी बस सहित)' },
    accessibilityRating: 9,
    accessibilityNotes: { en: 'Specially fitted wheelchair accessible safari buses and smooth reception terminal ramps.', hi: 'व्हीलचेयर सुलभ सफारी बसें और रिसेप्शन रैंप।' },
    photographyTips: { en: 'Asiatic lion pride resting atop the green grassy hillocks in the morning.', hi: 'सुबह के समय टीलों पर बैठे बब्बर शेरों के चित्र।' },
    safetyTips: { en: 'Keep all bus windows securely locked during the lion and predator safaris.', hi: 'सफारी के दौरान बस की खिड़कियां बंद रखें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800', title: { en: 'Etawah Lion Safari Park', hi: 'इटावा लॉयन सफारी' } }],
    tags: ['etawah', 'lion safari', 'safari park', 'chambal', 'wildlife', 'nature', 'इटावा सफारी']
  },
  {
    id: 'kakori_heritage_lucknow',
    name: 'Kakori (1925 Freedom Action & Kebabs)',
    hindiName: 'काकोरी (1925 क्रांति तीर्थ एवं कबाब नगरी)',
    city: 'Lucknow',
    hindiCity: 'लखनऊ',
    category: 'craft',
    categoryLabel: { en: 'Freedom Heritage & Culinary Town', hi: 'क्रांति तीर्थ एवं नवाबी ज़ायका' },
    coordinates: [26.8833, 80.8000],
    description: {
      en: 'The immortal town of the historic 1925 Kakori Train Action led by Ram Prasad Bismil and Ashfaqulla Khan, celebrated for the Shahid Smarak memorial, mango orchards, and melt-in-mouth Kakori Seekh Kebabs.',
      hi: '1925 के ऐतिहासिक काकोरी ट्रेन एक्शन की अमर क्रांति स्थली (रामप्रसाद बिस्मिल व अशफाकउल्ला खां), जो शहीद स्मारक, दशहरी आमों और विश्वप्रसिद्ध काकोरी कबाब के लिए जानी जाती है।'
    },
    travelCause: {
      en: 'Paying tribute at the Kakori Shaheed Smarak memorial pillar, touring historic Sufi shrines of Shah Kazim Qalandar, and relishing authentic tender Kakori Seekh Kebabs.',
      hi: 'काकोरी शहीद स्मारक पर अमर बलिदानियों को नमन, ऐतिहासिक सूफी दरगाह और प्रामाणिक काकोरी कबाब का स्वाद।'
    },
    deepHistory: {
      en: 'On August 9, 1925, revolutionaries of the Hindustan Republican Association stopped the No. 8 Down Train here to fund the Indian freedom struggle.',
      hi: '9 अगस्त 1925 को हिंदुस्तान रिपब्लिकन एसोसिएशन के क्रांतिकारियों द्वारा काकोरी एक्शन संपन्न हुआ।'
    },
    architecture: { en: 'Colonial railway station heritage, marble memorial obelisk, and Nawabi brick mansions', hi: 'शहीद स्मारक स्तंभ और नवाबी हवेलियां' },
    bestTime: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    timings: { en: 'Memorial: 6:00 AM - 7:00 PM; Food stalls: 4:00 PM - 10:30 PM', hi: 'स्मारक सुबह 6:00 से 7:00; फूड स्टॉल शाम 4:00 से 10:30' },
    entryFee: { en: 'Free entry', hi: 'निःशुल्क' },
    accessibilityRating: 8,
    accessibilityNotes: { en: 'Just 14 km west of Lucknow city on the Hardoi road; fully motorable.', hi: 'लखनऊ से मात्र 14 किमी दूर हरदोई मार्ग पर सुगम पहुंच।' },
    photographyTips: { en: 'The historic Kakori Shaheed Smarak memorial stone and rural mango groves.', hi: 'काकोरी शहीद स्मारक और दशहरी आम के बागों के चित्र।' },
    safetyTips: { en: 'Sample authentic Kakori kebabs from traditional century-old Awadhi recipes in the town center.', hi: 'कस्बे के प्रामाणिक कारीगरों से ही कबाब का स्वाद लें।' },
    images: [{ url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', title: { en: 'Kakori Heritage & Cuisine', hi: 'काकोरी धरोहर एवं ज़ायका' } }],
    tags: ['kakori', 'lucknow', 'bismil', 'ashfaqulla', '1925', 'kebab', 'freedom', 'काकोरी']
  }
];
