import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Compass, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Navigation, 
  ArrowRight, 
  Search, 
  Car, 
  Train, 
  Layers, 
  Info, 
  X, 
  ExternalLink,
  BookOpen,
  Landmark,
  Share2,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Route,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export interface MPSiteDetail {
  id: string;
  name: { en: string; hi: string };
  tagline: { en: string; hi: string };
  badge: { en: string; hi: string };
  district: { en: string; hi: string };
  zone: 'chambal' | 'gwalior' | 'bundelkhand' | 'malwa';
  category: 'asi_heritage' | 'ancient_temple' | 'fort_palace';
  coordinates: [number, number];
  heroImage: string;
  gallery: { url: string; caption: { en: string; hi: string } }[];
  history: {
    dynasty: { en: string; hi: string };
    period: { en: string; hi: string };
    chronicle: { en: string; hi: string };
    asiSignificance: { en: string; hi: string };
  };
  culture: {
    significance: { en: string; hi: string };
    mythology: { en: string; hi: string };
    livingTradition: { en: string; hi: string };
  };
  architecture: {
    style: { en: string; hi: string };
    engineeringHighlights: { en: string[]; hi: string[] };
    architecturalNotes: { en: string; hi: string };
  };
  howToReach: {
    fromHub: { en: string; hi: string };
    nearestRail: { en: string; hi: string };
    nearestAir: { en: string; hi: string };
    roadCondition: { en: string; hi: string };
    taxiEstimate: { en: string; hi: string };
    returnFeasibility: { en: string; hi: string };
  };
  practicalInfo: {
    timings: { en: string; hi: string };
    entryFee: { en: string; hi: string };
    bestSlot: { en: string; hi: string };
    accessibilityScore: number;
    accessibilityNotes: { en: string; hi: string };
    photographyTips: { en: string; hi: string };
    safetyAdvisory: { en: string; hi: string };
  };
  evidenceSources: { title: string; url: string; type: string }[];
}

export const MP_HERITAGE_SITES: MPSiteDetail[] = [
  {
    id: 'bateshwar_morena_mp',
    name: {
      en: 'Bateshwar Hindu Temples Complex',
      hi: 'बटेश्वर हिंदू मंदिर परिसर'
    },
    tagline: {
      en: '200 Restored Gurjara-Pratihara Temples Resurrected from Ravines',
      hi: 'खंडहरों से पुनर्जीवित 200 गुर्जर-प्रतिहार कालीन शिव व विष्णु मंदिर'
    },
    badge: {
      en: 'ASI Miracle • 200 Temples Restored',
      hi: 'ASI का चमत्कार • 200 मंदिर पुनर्जीवित'
    },
    district: { en: 'Morena, Madhya Pradesh', hi: 'मुरैना, मध्य प्रदेश' },
    zone: 'chambal',
    category: 'asi_heritage',
    coordinates: [26.4258, 78.2045],
    heroImage: '/images/places/bateshwar.jpg',
    gallery: [
      {
        url: '/images/places/bateshwar.jpg',
        caption: { en: 'Panoramic view across clusters of miniature and large shikhara shrines', hi: 'सैकड़ों लघु व विशाल शिखर मंदिरों का मनोरम दृश्य' }
      },
      {
        url: '/images/places/mitawali.jpg',
        caption: { en: 'Ornate sandstone doorways depicting River Goddesses Ganga & Yamuna', hi: 'द्वारशाखाओं पर उत्कीर्ण गंगा व यमुना देवियों की प्राचीन प्रतिमाएं' }
      },
      {
        url: '/images/places/kakanmath.jpg',
        caption: { en: 'Curvilinear Nagara spires carefully reassembled block-by-block', hi: 'पत्थर-दर-पत्थर पुनः संयोजित नागर शैली के शिखर' }
      }
    ],
    history: {
      dynasty: { en: 'Gurjara-Pratihara Dynasty', hi: 'गुर्जर-प्रतिहार राजवंश' },
      period: { en: '8th to 10th Century CE (750–1000 CE)', hi: '8वीं से 10वीं शताब्दी ईस्वी' },
      chronicle: {
        en: 'The Bateshwar temple cluster spans over 25 acres in the secluded ravines of the Chambal valley. Built between the 8th and 10th centuries by the imperial Gurjara-Pratihara kings, the complex suffered catastrophic collapse during a powerful 13th-century earthquake, reducing over 200 shrines to fragmented heaps of sandstone.',
        hi: 'बटेश्वर मंदिर समूह चंबल घाटी की बीहड़ों में 25 एकड़ में फैला है। 8वीं से 10वीं शताब्दी में गुर्जर-प्रतिहार सम्राटों द्वारा निर्मित यह परिसर 13वीं सदी के विनाशकारी भूकंप में मलबे में तब्दील हो गया था।'
      },
      asiSignificance: {
        en: 'Between 2005 and 2012, under the legendary leadership of ASI Superintending Archaeologist K.K. Muhammed, the Archaeological Survey of India undertook an audacious anastylosis restoration. Over 80 fallen temples have been painstakingly reassembled piece-by-piece with zero modern mortar, making it one of the proudest heritage conservation triumphs in global archaeology.',
        hi: '2005 से 2012 के मध्य ASI के तत्कालीन निदेशक के.के. मुहम्मद के नेतृत्व में 80 से अधिक मंदिरों को मूल पत्थरों को जोड़कर पुनर्जीवित किया गया, जो वैश्विक पुरातत्व का अनुपम कीर्तिमान है।'
      }
    },
    culture: {
      significance: {
        en: 'Bateshwar represents the zenith of post-Gupta devotional art where Shaivism, Vaishnavism, and Shakti traditions coexisted in serene harmony.',
        hi: 'बटेश्वर गुप्तोत्तर काल की भक्ति कला का शिखर है जहाँ शैव, वैष्णव और शाक्त परंपराएं एक साथ फली-फूलीं।'
      },
      mythology: {
        en: 'Dedicated predominantly to Lord Shiva (Bateshwar Mahadev), with shrines honoring Vishnu avatars, Nataraja, and Lakulisha, symbolizing cosmic regeneration.',
        hi: 'मुख्यतः भगवान बटेश्वर महादेव को समर्पित, साथ ही दशावतार, नटराज और लकुलीश की दुर्लभ प्रतिमाएं।'
      },
      livingTradition: {
        en: 'Local villagers and pilgrims gather during Maha Shivratri and Kartik Purnima to offer sacred Bilva leaves and jalabhisheka at the restored sanctums.',
        hi: 'महाशिवरात्रि और कार्तिक पूर्णिमा पर स्थानीय ग्रामीण व श्रद्धालु प्राचीन गर्भगृहों में जलाभिषेक करते हैं।'
      }
    },
    architecture: {
      style: { en: 'Early Classical Nagara / Pratihara Style', hi: 'प्रारंभिक नागर / प्रतिहार शैली' },
      engineeringHighlights: {
        en: [
          'Curvilinear Latina Shikhara spires tapering towards amalaka and kalasha crowns',
          'Interlocking sandstone dry-masonry constructed entirely without binding mortar',
          'Intricate river goddess panels (Ganga on Makara, Yamuna on Kurma) on door jambs',
          'Step-well (Baoli) engineered with natural runoff water collection channels'
        ],
        hi: [
          'आमलक और कलश से सुसज्जित नागर शैली के वक्राकार शिखर',
          'बिना चूने या गारे के आपस में फंसे बलुआ पत्थर के विशाल शिलाखंड',
          'द्वारशाखाओं पर मकरवाहिनी गंगा और कूर्मवाहिनी यमुना की नक्काशी',
          'जल संचयन हेतु पत्थर की प्राचीन बावड़ी और नालियां'
        ]
      },
      architecturalNotes: {
        en: 'Each temple features a square garbhagriha fronted by a pillared mukhamandapa. The stones feature master-carver guild marks proving pre-fabrication assembly.',
        hi: 'प्रत्येक मंदिर में वर्गाकार गर्भगृह और नक्काशीदार मुखमंडप है। पत्थरों पर शिल्पकारों के विशेष चिह्न अंकित हैं।'
      }
    },
    howToReach: {
      fromHub: { en: '35 km north-east of Gwalior City (~45 mins drive via SH-2)', hi: 'ग्वालियर शहर से 35 किमी उत्तर-पूर्व (SH-2 से ~45 मिनट)' },
      nearestRail: { en: 'Gwalior Junction (GWL) — 36 km; Morena Railway Station (MRA) — 30 km', hi: 'ग्वालियर जंक्शन (GWL) — 36 किमी; मुरैना स्टेशन (MRA) — 30 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL / Rajmata Vijaya Raje Scindia Airport) — 32 km', hi: 'ग्वालियर हवाई अड्डा — 32 किमी' },
      roadCondition: { en: 'Smooth 2-lane paved tarmac road directly leading to the ASI ticket gate', hi: 'ASI प्रवेश द्वार तक पक्की दो लेन की डामर सड़क' },
      taxiEstimate: { en: 'Round-trip private cab from Gwalior covering Bateshwar, Mitawali & Padhavali: ₹1,600 – ₹2,200', hi: 'ग्वालियर से तीनों स्थलों का राउंड ट्रिप कैब किराया: ₹1,600 – ₹2,200' },
      returnFeasibility: { en: 'High Feasibility — Easy half-day circuit. Conclude by 4:30 PM to safely return to Gwalior well before sunset.', hi: 'अत्यंत सुगम — आधा दिन का भ्रमण। सूर्यास्त से पूर्व ग्वालियर वापसी सुनिश्चित करें।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:00 PM (Open 7 Days a week)', hi: 'सुबह 6:00 से शाम 6:00 बजे (सातों दिन)' },
      entryFee: { en: '₹25 for Indians, ₹300 for Foreigners (ASI standard ticket)', hi: 'भारतीय: ₹25, विदेशी नागरिक: ₹300' },
      bestSlot: { en: 'Morning 7:30 AM – 10:30 AM (magnificent low golden sunlight)', hi: 'प्रातः 7:30 से 10:30 बजे (सुनहरी धूप व हल्की हवा)' },
      accessibilityScore: 7,
      accessibilityNotes: { en: 'Paved flat entry; walking between temples involves gravel and low stone steps.', hi: 'मुख्य द्वार तक समतल मार्ग; मंदिरों के बीच कंकड़ व पत्थर की नीची सीढ़ियां।' },
      photographyTips: { en: 'Use 24-70mm lens to capture the dense forest of shikhara spires with soft morning rim light.', hi: 'शिखरों के समूह का परिप्रेक्ष्य दर्शाने के लिए वाइड अथवा 50mm लेंस का प्रयोग करें।' },
      safetyAdvisory: { en: 'Carry personal water bottles and hats. No commercial food stalls at site; snacks available on main highway.', hi: 'पीने का पानी व धूप से बचाव का सामान साथ रखें।' }
    },
    evidenceSources: [
      { title: 'Archaeological Survey of India Bhopal Circle (Official)', url: 'https://asibhopal.nic.in/bateshwar.html', type: 'Official ASI Source' },
      { title: 'Madhya Pradesh Tourism Board Official Portal', url: 'https://www.mptourism.com/destination-morena.php', type: 'Official Tourism Board' }
    ]
  },
  {
    id: 'mitawali_chausath_yogini',
    name: {
      en: 'Chausath Yogini Temple (Mitawali)',
      hi: 'चौसठ योगिनी मंदिर (मितावली)'
    },
    tagline: {
      en: 'Circular Hypaethral Wonder that Inspired India’s Parliament House',
      hi: 'भारतीय संसद भवन के वास्तु की प्रेरणा — 64 कक्षीय गोलाकार तंत्र पीठ'
    },
    badge: {
      en: 'Parliament Prototype • 100-ft Hilltop',
      hi: 'संसद भवन का मूल प्रारूप • 100 फीट पहाड़ी'
    },
    district: { en: 'Morena, Madhya Pradesh', hi: 'मुरैना, मध्य प्रदेश' },
    zone: 'chambal',
    category: 'asi_heritage',
    coordinates: [26.4428, 78.2573],
    heroImage: '/images/places/mitawali.jpg',
    gallery: [
      {
        url: '/images/places/mitawali.jpg',
        caption: { en: 'Circular colonnade of 64 peripheral pillared cells with central Shiva shrine', hi: '64 खंभेदार योगिनी कक्षों से घिरा भव्य गोलाकार प्रांगण' }
      },
      {
        url: '/images/places/bateshwar.jpg',
        caption: { en: 'View from the 100-ft hilltop plateau looking down over fertile Chambal valleys', hi: '100 फीट ऊंची पहाड़ी से चंबल के हरे-भरे खेतों का विहंगम दृश्य' }
      }
    ],
    history: {
      dynasty: { en: 'Kachchhapaghata Dynasty', hi: 'कच्छपघात राजवंश' },
      period: { en: '1323 CE (Vikram Samvat 1383)', hi: '1323 ईस्वी (विक्रम संवत 1383)' },
      chronicle: {
        en: 'According to a Sanskrit inscription dated Vikram Samvat 1383 found on site, this majestic hilltop monument was commissioned by King Devapala of the Kachchhapaghata dynasty. It served as a premier center of advanced astronomical learning, stellar observation, and esoteric Tantric philosophy.',
        hi: 'मंदिर में प्राप्त विक्रम संवत 1383 के संस्कृत शिलालेख के अनुसार इसे कच्छपघात राजा देवपाल ने बनवाया था। यह खगोल विज्ञान, ग्रह-नक्षत्र गणना और तंत्र साधना का प्रमुख केंद्र था।'
      },
      asiSignificance: {
        en: 'Popularly known as the Ekattarso Mahadeva Temple, its striking circular architectural footprint (170 ft diameter) is widely acknowledged by architectural historians to have directly inspired British architects Edwin Lutyens and Herbert Baker when designing the iconic circular Indian Parliament House (Sansad Bhavan) in New Delhi.',
        hi: '170 फीट व्यास वाला यह गोलाकार मंदिर नई दिल्ली के पुराने संसद भवन (एडविन लुटियंस व हर्बर्ट बेकर द्वारा निर्मित) की मूल प्रेरणा माना जाता है।'
      }
    },
    culture: {
      significance: {
        en: 'One of the exceptionally rare surviving circular hypaethral (roofless) Yogini temples in India, celebrating feminine cosmic energies and astral deities.',
        hi: 'भारत के गिने-चुने जीवित गोलाकार छतरहित योगिनी मंदिरों में से एक, जो ब्रह्मांडीय शक्ति व खगोल देवियों को समर्पित है।'
      },
      mythology: {
        en: 'Each of the 64 perimeter cells housed an idol of a Yogini dedicated to specific astral constellations, with the central circular pavilion enshrining a Shivalinga.',
        hi: 'परिधि के 64 कक्षों में योगिनियों की मूर्तियां और केंद्र में विशाल शिवलिंग स्थापित है।'
      },
      livingTradition: {
        en: 'Revered as a place of immense cosmic calm; visitors often experience extraordinary acoustic reverberations in the central pillared court.',
        hi: 'केंद्रीय प्रांगण में विशेष ध्वनि गूंज का अनुभव होता है; शांति व ध्यान हेतु अत्यंत पावन।'
      }
    },
    architecture: {
      style: { en: 'Circular Hypaethral Mandapa Architecture', hi: 'गोलाकार छतरहित मंडप स्थापत्य' },
      engineeringHighlights: {
        en: [
          'External diameter of 170 feet with radial symmetry aligned precisely to solstice axes',
          'Perimeter formed by 64 small chambers, each with an ornamental pillar-supported facade',
          'Central circular sanctum with perforated stone roof for rainwater drainage and sunlight',
          'Seismic-resistant interlocking dry masonry that withstood earthquakes for 700+ years'
        ],
        hi: [
          '170 फीट व्यास का सममित गोलाकार वास्तु जो खगोलीय संक्रांति से संरेखित है',
          '64 नक्काशीदार खंभेदार कक्षों की परिधि',
          'केंद्रीय मुख्य मंडप जिसमें वर्षा जल निकासी की वैज्ञानिक व्यवस्था है',
          'भूकंप-रोधी पाषाण जोड़ जिन्होंने 700 वर्षों से मंदिर को सुरक्षित रखा'
        ]
      },
      architecturalNotes: {
        en: 'The open sky courtyard functions as an ancient astronomical observatory tracking planetary transits against the 64 pillared openings.',
        hi: 'खुला प्रांगण 64 स्तंभों के माध्यम से ग्रहों और नक्षत्रों की गति नापने की वेधशाला का कार्य करता था।'
      }
    },
    howToReach: {
      fromHub: { en: '38 km from Gwalior; 8 km from Padhavali', hi: 'ग्वालियर से 38 किमी; पढ़ावली से मात्र 8 किमी' },
      nearestRail: { en: 'Gwalior Junction (GWL) — 38 km; Malanpur Railway Station — 14 km', hi: 'ग्वालियर जंक्शन — 38 किमी; मालनपुर स्टेशन — 14 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 30 km', hi: 'ग्वालियर हवाई अड्डा — 30 किमी' },
      roadCondition: { en: 'Paved road directly reaches the base parking lot at the foot of the hillock', hi: 'पहाड़ी की तलहटी तक पक्की सड़क' },
      taxiEstimate: { en: 'Conveniently covered in the Gwalior-Mitawali-Padhavali-Bateshwar cab circuit (~₹1,800)', hi: 'ग्वालियर हेरिटेज सर्किट कैब में शामिल (~₹1,800)' },
      returnFeasibility: { en: 'Seamless — Easily combined with Padhavali (15 mins away) and Bateshwar (25 mins away).', hi: 'अत्यंत सुगम — पढ़ावली (15 मिनट) व बटेश्वर (25 मिनट) के साथ सीधा जुड़ाव।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
      entryFee: { en: 'Free entry (Protected National Monument)', hi: 'निःशुल्क प्रवेश (राष्ट्रीय संरक्षित स्मारक)' },
      bestSlot: { en: 'Late afternoon 4:00 PM – 5:30 PM (spectacular sunset over Chambal plains)', hi: 'सायं 4:00 से 5:30 बजे (मनोरम सूर्यास्त)' },
      accessibilityScore: 5,
      accessibilityNotes: { en: 'Requires climbing ~100 stone steps with sturdy handrail. Moderately steep.', hi: 'लगभग 100 पक्की सीढ़ियां चढ़नी होती हैं। रेलिंग की सुविधा उपलब्ध है।' },
      photographyTips: { en: 'Stand at the central temple entrance and shoot a symmetrical 360-degree panorama framing the concentric columns.', hi: 'केंद्रीय मंदिर के सामने से खंभों की कतारों का 360 डिग्री पैनोरमा शॉट लें।' },
      safetyAdvisory: { en: 'Monkeys occasionally visit the steps; keep small food packets and glasses secured.', hi: 'सीढ़ियों पर बंदरों से खाने की वस्तुएं संभालकर रखें।' }
    },
    evidenceSources: [
      { title: 'MP Tourism Board Mitawali Destination Profile', url: 'https://www.mptourism.com/destination-morena.php', type: 'Official State Tourism' },
      { title: 'Archaeological Survey of India Epigraphia Indica Vol. 1', url: 'https://asibhopal.nic.in', type: 'ASI Epigraphic Evidence' }
    ]
  },
  {
    id: 'garhi_padhavali',
    name: {
      en: 'Garhi Padhavali Fortress & Temple',
      hi: 'गढ़ी पढ़ावली दुर्ग एवं मंदिर'
    },
    tagline: {
      en: 'The "Mini Khajuraho of Chambal" with Astonishing Sculpted Stone Friezes',
      hi: '"चंबल का मिनी खजुराहो" — रामायण व महाभारत की अद्भुत पाषाण नक्काशी'
    },
    badge: {
      en: 'Mini Khajuraho • Ornate Mukhamandapa',
      hi: 'मिनी खजुराहो • भव्य मुखमंडप'
    },
    district: { en: 'Morena, Madhya Pradesh', hi: 'मुरैना, मध्य प्रदेश' },
    zone: 'chambal',
    category: 'asi_heritage',
    coordinates: [26.4319, 78.2255],
    heroImage: '/images/places/padhavali.jpg',
    gallery: [
      {
        url: '/images/places/padhavali.jpg',
        caption: { en: 'Surviving 10th-century carved pillared open pavilion (Mukhamandapa)', hi: '10वीं सदी का भव्य उत्कीर्ण मुखमंडप' }
      },
      {
        url: '/images/places/bateshwar.jpg',
        caption: { en: 'Intricately carved mythological ceilings depicting Dashavatara and Samudra Manthan', hi: 'दशावतार और समुद्र मंथन दर्शाती छत की नक्काशी' }
      }
    ],
    history: {
      dynasty: { en: 'Kachchhapaghata Dynasty / Jat Rulers of Gohad', hi: 'कच्छपघात राजवंश / गोहद के जाट शासक' },
      period: { en: '10th Century CE (Fortified in late 18th century)', hi: '10वीं शताब्दी ईस्वी (18वीं सदी में दुर्ग रूप)' },
      chronicle: {
        en: 'Originally built in the 10th century as a magnificent Shiva temple complex. In the 18th century, the Jat rulers of Gohad fortified the surrounding perimeter with high stone bastions and ramparts, creating a defensive fortress (Garhi) while sheltering the extraordinary temple mandapa inside.',
        hi: 'मूल रूप से 10वीं सदी में निर्मित विशाल शिव मंदिर। 18वीं सदी में गोहद के जाट राजाओं ने मंदिर के चारों ओर मजबूत प्राचीर व बुर्ज बनाकर इसे गढ़ी (किले) का रूप दिया।'
      },
      asiSignificance: {
        en: 'Nicknamed the "Mini Khajuraho of Chambal", its open pillared Mukhamandapa contains an unparalleled density of 1,000+ exquisite miniature stone relief panels covering every square inch of pillars, beams, and ceilings.',
        hi: '"चंबल का मिनी खजुराहो" कहे जाने वाले इस मंडप के हर खंभे, शहतीर और छत पर 1000 से अधिक बारीक पाषाण मूर्तियां उकेरी गई हैं।'
      }
    },
    culture: {
      significance: {
        en: 'Visual encyclopedia of medieval Indian sculptural brilliance, illustrating epics with dramatic narrative motion.',
        hi: 'मध्यकालीन मूर्तिकला का जीवंत विश्वकोश, जिसमें प्राचीन गाथाएं सजीव प्रतीत होती हैं।'
      },
      mythology: {
        en: 'Panels narrate Ramayana, Mahabharata, Lord Shiva\'s wedding procession, Krishna Leela, Samudra Manthan, and the incarnations of Vishnu.',
        hi: 'रामायण, महाभारत, शिव विवाह, कृष्ण लीला, समुद्र मंथन और भगवान विष्णु के 10 अवतारों का चित्रण।'
      },
      livingTradition: {
        en: 'A quiet, reverent archaeological sanctuary frequented by historians, art students, and discerning heritage explorers.',
        hi: 'कला के पारखियों, शोधकर्ताओं और पर्यटकों के लिए शांतिपूर्ण प्रेरणा स्थल।'
      }
    },
    architecture: {
      style: { en: 'High Nagara Stone Mandapa on Fortified Plinth', hi: 'दुर्ग अधिष्ठान पर नागर पाषाण मंडप' },
      engineeringHighlights: {
        en: [
          'High stepped stone plinth guarded by two monumental stone guardian lions at entrance',
          'Coffered ceiling rosettes carved into concentric floral and geometric patterns',
          'Bracket figures (Surasundaris and Gandharvas) projecting outwards with graceful anatomy',
          'Defensive 18th-century battlements with embrasures and watchtowers'
        ],
        hi: [
          'प्रवेश द्वार पर दो विशाल पाषाण सिंहों द्वारा सुरक्षित ऊंचा अधिष्ठान',
          'कमल के फूलों से सुसज्जित अलंकृत छतें',
          'स्तंभों पर सुरसुंदरियों और उड़ते गंधर्वों की नक्काशी',
          'किलेबंदी के बुर्ज और सुरक्षा चौकियां'
        ]
      },
      architecturalNotes: {
        en: 'The juxtaposition of a delicate 10th-century classical Hindu temple porch nestled inside rugged 18th-century martial ramparts is unique in India.',
        hi: '10वीं सदी के कोमल मंदिर स्थापत्य और 18वीं सदी के कठोर दुर्ग का यह अनूठा संगम भारत में विरला है।'
      }
    },
    howToReach: {
      fromHub: { en: '35 km north of Gwalior City; 5 km from Bateshwar', hi: 'ग्वालियर से 35 किमी उत्तर; बटेश्वर से मात्र 5 किमी' },
      nearestRail: { en: 'Gwalior Junction (GWL) — 35 km', hi: 'ग्वालियर जंक्शन — 35 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 28 km', hi: 'ग्वालियर हवाई अड्डा — 28 किमी' },
      roadCondition: { en: 'Excellent paved road with clear ASI direction boards', hi: 'ASI संकेतक बोर्ड सहित उत्कृष्ट पक्की सड़क' },
      taxiEstimate: { en: 'Located midway on the Gwalior-Mitawali-Bateshwar loop', hi: 'ग्वालियर-मितावली-बटेश्वर सर्किट के ठीक मध्य में' },
      returnFeasibility: { en: 'High — Takes 45–60 minutes to thoroughly inspect and photograph.', hi: 'अत्यंत सुगम — 45 से 60 मिनट में संपूर्ण अवलोकन संभव।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
      entryFee: { en: 'Free entry (ASI protected)', hi: 'निःशुल्क (ASI संरक्षित)' },
      bestSlot: { en: '10:00 AM – 2:00 PM (optimal ambient daylight illuminates the ceiling panels)', hi: 'सुबह 10:00 से दोपहर 2:00 बजे (छत की नक्काशी पर सर्वोत्तम प्रकाश)' },
      accessibilityScore: 7,
      accessibilityNotes: { en: 'Gentle ramp leads to fort entrance; only a few steps to the temple plinth.', hi: 'किले के द्वार तक रैंप, मंडप तक कुछ ही सीढ़ियां।' },
      photographyTips: { en: 'Carry a lens with good close-up capability or macro mode to capture micro-details on friezes.', hi: 'मूर्तियों की बारीक नक्काशी हेतु क्लोज-अप व जूम लेंस अत्यंत उपयोगी है।' },
      safetyAdvisory: { en: 'Clean surroundings with lawn gardens maintained by ASI.', hi: 'ASI द्वारा सुंदर बगीचे व स्वच्छ परिसर।' }
    },
    evidenceSources: [
      { title: 'Archaeological Survey of India Bhopal Circle Monument Register', url: 'https://asibhopal.nic.in', type: 'ASI National Register' },
      { title: 'District Gazetteers of Madhya Pradesh — Morena', url: 'https://morena.nic.in/', type: 'Government Record' }
    ]
  },
  {
    id: 'kakanmath_suhania',
    name: {
      en: 'Kakanmath Shiva Temple (Suhania)',
      hi: 'ककनमठ शिव मंदिर (सुहानिया)'
    },
    tagline: {
      en: '115-Foot Monumental Shiva Spire Built Without Mortar or Cement',
      hi: 'बिना चूने-गारे के गुरुत्वाकर्षण पर टिका 115 फीट ऊंचा गगनचुंबी शिवालय'
    },
    badge: {
      en: 'Gravity-Defying Dry Masonry • 115-ft Tower',
      hi: 'अद्भुत ड्राई मेसनरी • 115 फीट शिखर'
    },
    district: { en: 'Morena, Madhya Pradesh', hi: 'मुरैना, मध्य प्रदेश' },
    zone: 'chambal',
    category: 'ancient_temple',
    coordinates: [26.5411, 78.2427],
    heroImage: '/images/places/kakanmath.jpg',
    gallery: [
      {
        url: '/images/places/kakanmath.jpg',
        caption: { en: 'The colossal 115-ft ruin standing tall amidst rustic Morena farmlands', hi: 'खेतों के बीच गर्व से खड़ा 115 फीट ऊंचा विशाल पाषाण शिखर' }
      },
      {
        url: '/images/places/padhavali.jpg',
        caption: { en: 'Dry masonry stones balanced purely by interlocking weight and gravity', hi: 'गुरुत्वाकर्षण और सटीक खांचों पर संतुलित विशाल शिलाखंड' }
      }
    ],
    history: {
      dynasty: { en: 'Kachchhapaghata Dynasty', hi: 'कच्छपघात राजवंश' },
      period: { en: '1015 to 1035 CE (Early 11th Century)', hi: '1015 से 1035 ईस्वी (11वीं सदी)' },
      chronicle: {
        en: 'Commissioned by King Kirttiraja around 1015 CE to fulfill a vow made by his queen Kakanvati, a fervent devotee of Lord Shiva. The temple originally possessed a multi-pillared sabhamandapa, subsidiary shrines, and an imposing entrance gopuram that collapsed over centuries of warfare and earthquakes, leaving the central spire defying time.',
        hi: 'कच्छपघात नरेश कीर्तिराज द्वारा अपनी शिवभक्त रानी ककनावती की मनोकामना पूर्ति हेतु 1015 ई. में निर्मित। समय के थपेड़ों और युद्धों के बाद भी इसका गगनचुंबी शिखर आज भी सीना ताने खड़ा है।'
      },
      asiSignificance: {
        en: 'An architectural marvel of medieval civil engineering: its soaring 115-foot tower stands without a single drop of mortar or adhesive, held in equilibrium purely by gravity and interlocking tongue-and-groove stonework.',
        hi: 'बिना किसी सीमेंट, गारे या चूने के बना यह 115 फीट ऊंचा मंदिर मध्यकालीन सिविल इंजीनियरिंग का बेजोड़ चमत्कार है।'
      }
    },
    culture: {
      significance: {
        en: 'Dedicated to Lord Shiva, radiating raw ancient grandeur and monastic solitude.',
        hi: 'भगवान शिव को समर्पित, प्राचीन भव्यता और विहंगम आध्यात्मिक ऊर्जा का केंद्र।'
      },
      mythology: {
        en: 'Local folklore romanticizes that the colossal temple was miraculously erected overnight by celestial spirits, lending it an aura of mythic enchantment.',
        hi: 'लोक मान्यता है कि इसे एक ही रात में देवदूतों ने रचा था; इसकी बनावट देखकर हर कोई दांतों तले उंगली दबा लेता है।'
      },
      livingTradition: {
        en: 'Villagers perform puja at the Shivalinga in the inner sanctum, especially on Mondays and during Sawan.',
        hi: 'गर्भगृह में स्थापित शिवलिंग पर सावन व सोमवार को ग्रामीण श्रद्धापूर्वक पूजन करते हैं।'
      }
    },
    architecture: {
      style: { en: 'Monumental High Nagara Shikhara', hi: 'भव्य नागर शिखर स्थापत्य' },
      engineeringHighlights: {
        en: [
          'Rises over 35 meters (115 ft) atop a massive 5-meter elevated stone Jagati terrace',
          'Constructed solely using dry-stone masonry with interlocking sandstone slabs',
          'Sanctum ambulatory path (Pradakshina Patha) engineered with open stone vents',
          'Intricate carved sculptures of Dikpalas, celestial nymphs, and Shiva manifestations'
        ],
        hi: [
          '5 मीटर ऊंचे विशाल पाषाण चबूतरे पर 35 मीटर (115 फीट) ऊंचा शिखर',
          'पूरी तरह सूखी चिनाई (ड्राई मेसनरी) पर आधारित निर्माण',
          'गर्भगृह के चारों ओर प्रदक्षिणा पथ',
          'दिक्पालों, अप्सराओं और शिव रूपों की प्राचीन नक्काशी'
        ]
      },
      architecturalNotes: {
        en: 'The exposed core shows how ancient Indian architects utilized interior weight counter-balancing to prevent vertical towers from toppling.',
        hi: 'आंतरिक भार संतुलन की प्राचीन भारतीय तकनीक का यह सर्वश्रेष्ठ उदाहरण है।'
      }
    },
    howToReach: {
      fromHub: { en: '65 km north-east of Gwalior City; 20 km from Morena town', hi: 'ग्वालियर से 65 किमी उत्तर-पूर्व; मुरैना नगर से 20 किमी' },
      nearestRail: { en: 'Morena Railway Station (MRA) — 22 km; Gwalior (GWL) — 65 km', hi: 'मुरैना रेलवे स्टेशन — 22 किमी; ग्वालियर — 65 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 60 km', hi: 'ग्वालियर हवाई अड्डा — 60 किमी' },
      roadCondition: { en: 'Rural paved road traversing scenic agricultural mustard belts (peaceful driving)', hi: 'सरसों के खेतों से होकर गुजरती शांतिपूर्ण ग्रामीण पक्की सड़क' },
      taxiEstimate: { en: 'Can be combined with Gwalior/Morena day tour (₹2,200 – ₹2,600 full day)', hi: 'ग्वालियर/मुरैना संपूर्ण दिवस टूर में शामिल (~₹2,400)' },
      returnFeasibility: { en: 'Feasible — Recommended to visit in midday between 11 AM and 3 PM.', hi: 'सुगम — दोपहर 11 से 3 बजे के मध्य भ्रमण सर्वोत्तम।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
      entryFee: { en: 'Free entry (Protected monument)', hi: 'निःशुल्क प्रवेश' },
      bestSlot: { en: 'October to February; mid-morning or late afternoon golden light', hi: 'अक्टूबर से फरवरी; दोपहर पूर्व या सुनहरी शाम' },
      accessibilityScore: 6,
      accessibilityNotes: { en: 'Open lawn surround; climbing into the sanctum involves walking on uneven stone slabs.', hi: 'आसपास समतल घास; गर्भगृह के भीतर जाने हेतु पत्थरों पर सावधानी रखें।' },
      photographyTips: { en: 'Step back into the nearby fields to capture the solitary temple tower rising dramatically against the horizon.', hi: 'खेतों के बीच से क्षितिज को छूते मंदिर का ड्रामैटिक शॉट लें।' },
      safetyAdvisory: { en: 'Do not attempt to climb outer crumbling ledges. Stay on firm ground paths.', hi: 'बाहरी पत्थरों पर चढ़ने का जोखिम न लें।' }
    },
    evidenceSources: [
      { title: 'ASI Bhopal Circle Suhania Monograph', url: 'https://asibhopal.nic.in', type: 'Official ASI Research' },
      { title: 'MP Tourism Chambal Circuit Guide', url: 'https://www.mptourism.com/', type: 'Official Tourism Guide' }
    ]
  },
  {
    id: 'gwalior_fort_mp',
    name: {
      en: 'Gwalior Fort & Man Singh Palace',
      hi: 'ग्वालियर किला एवं मानसिंह महल'
    },
    tagline: {
      en: 'The "Pearl in the Necklace of the Castles of Hind"',
      hi: 'बाबर द्वारा प्रशंसित "भारत के किलों का मोती" — अजेय पहाड़ी दुर्ग'
    },
    badge: {
      en: 'Gibraltar of India • 6th Century Citadel',
      hi: 'भारत का जिब्राल्टर • 6वीं सदी का दुर्ग'
    },
    district: { en: 'Gwalior, Madhya Pradesh', hi: 'ग्वालियर, मध्य प्रदेश' },
    zone: 'gwalior',
    category: 'fort_palace',
    coordinates: [26.2295, 78.1691],
    heroImage: '/images/places/gwalior_fort.jpg',
    gallery: [
      {
        url: '/images/places/gwalior_fort.jpg',
        caption: { en: 'Man Singh Palace facade with brilliant turquoise and yellow enamel tiles', hi: 'मानसिंह महल की नीली व पीली चमकीली टाइलों का भव्य अग्रभाग' }
      },
      {
        url: '/images/places/sas_bahu.jpg',
        caption: { en: 'Sas Bahu Temples — Colossal rock-cut Jain Tirthankara statues along the Urvai Gate ascent', hi: 'उरवाई गेट मार्ग पर चट्टानों में तराशी गई विशाल जैन तीर्थंकर प्रतिमाएं' }
      }
    ],
    history: {
      dynasty: { en: 'Tomar Rajput Dynasty / Scindia Dynasty', hi: 'तोमर राजपूत राजवंश / सिंधिया राजवंश' },
      period: { en: '6th Century CE foundation; 1486–1516 Palace era', hi: '6वीं सदी में नींव; 1486-1516 मान मंदिर काल' },
      chronicle: {
        en: 'Perched on a sheer 3-km-long sandstone precipice, Gwalior Fort was founded in the 6th century by Raja Suraj Sen. It reached its cultural zenith under Raja Man Singh Tomar (1486–1516), who built the famed Man Mandir Palace and patronized legendary musician Tansen. It was later the pivotal battleground of Rani Lakshmibai during the 1857 First War of Independence.',
        hi: '3 किमी लंबी बलुआ पत्थर की पहाड़ी पर स्थित यह दुर्ग 6वीं सदी में राजा सूरज सेन द्वारा स्थापित हुआ। राजा मानसिंह तोमर (1486-1516) के काल में इसका सांस्कृतिक उत्कर्ष हुआ और 1857 में वीरांगना लक्ष्मीबाई की अमर कर्मभूमि बना।'
      },
      asiSignificance: {
        en: 'Described by Mughal Emperor Babur as "the pearl among gems of the fortresses of Hind", the fort encompasses 6 major palaces, the 11th-century Sas Bahu Temple, the soaring 100-ft Teli Ka Mandir, and the colossal rock-hewn Jain colossi.',
        hi: 'बाबर ने इसे "हिंद के किलों का मोती" कहा था। इसमें 6 महल, सास-बहू मंदिर, तेली का मंदिर और विशाल शैलकृत जैन तीर्थंकर प्रतिमाएं हैं।'
      }
    },
    culture: {
      significance: {
        en: 'Epicenter of Rajput chivalry, classical Indian music (Gwalior Gharana & Dhrupad), and freedom struggle history.',
        hi: 'राजपूत शौर्य, ध्रुपद व ग्वालियर घराना संगीत और स्वाधीनता संग्राम का अमर केंद्र।'
      },
      mythology: {
        en: 'Named after the sage Gwalipa, who cured King Suraj Sen of leprosy with water from the sacred Suraj Kund spring atop the plateau.',
        hi: 'ऋषि ग्वालिपा के नाम पर नामकरण, जिन्होंने सूरज कुंड के पवित्र जल से राजा सूरज सेन का कुष्ठ रोग ठीक किया था।'
      },
      livingTradition: {
        en: 'Annual Tansen Music Festival (Tansen Samaroh) held in December, and daily evening Sound & Light laser spectacles at the palace ramparts.',
        hi: 'प्रतिवर्ष दिसंबर में तानसेन संगीत समारोह और प्रतिदिन शाम को मनोहारी लाइट एंड साउंड शो।'
      }
    },
    architecture: {
      style: { en: 'Early Tomar Rajput Palace Architecture', hi: 'तोमर राजपूत राजप्रासाद स्थापत्य' },
      engineeringHighlights: {
        en: [
          'Vibrant turquoise blue and yellow glazed ceramic tile friezes depicting ducks, elephants, and peacocks',
          'Complex multi-level underground acoustic chambers (Jhula Ghar and Kesar Kothi)',
          'High circular bastions crowned with domed chhatris overlooking the city',
          'Massive stone gates (Hathi Pol, Alamgiri Gate, Urvai Gate) designed to withstand battering rams'
        ],
        hi: [
          'नीली व पीली चमकीली टाइलों पर बत्तखों, हाथियों व मोरों के सुंदर अलंकरण',
          'किले के नीचे बने बहुमंजिला भूमिगत झूला घर व केसर कोठी',
          'शहर का विहंगम दृश्य दिखाते गुंबददार बुर्ज और छतरियां',
          'हाथी पोल व उरवाई गेट जैसे अभेद्य प्रवेश द्वार'
        ]
      },
      architecturalNotes: {
        en: 'The exterior tilework represents the earliest and finest preserved glazed tile artistry on any Hindu palace in India.',
        hi: 'भारत के किसी भी हिंदू महल पर सुरक्षित चमकीली टाइलों की कला का यह सबसे प्राचीन व सुंदर उदाहरण है।'
      }
    },
    howToReach: {
      fromHub: { en: 'Situated right in the heart of Gwalior City (accessible via Urvai Gate or Eastern Ramp)', hi: 'ग्वालियर शहर के केंद्र में (उरवाई गेट से वाहनों का सीधा मार्ग)' },
      nearestRail: { en: 'Gwalior Junction (GWL) — 4 km', hi: 'ग्वालियर जंक्शन — 4 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 12 km', hi: 'ग्वालियर हवाई अड्डा — 12 किमी' },
      roadCondition: { en: 'Metalled road goes all the way up to fort plateau parking through Urvai Gate', hi: 'उरवाई गेट से किले के शीर्ष पार्किंग तक पक्की सड़क' },
      taxiEstimate: { en: 'Auto-rickshaw: ₹150; Taxi: ₹300–₹500', hi: 'ऑटो-रिक्शा: ₹150; टैक्सी: ₹300–₹500' },
      returnFeasibility: { en: 'Peak Feasibility — Centrally located in city with 24/7 public transport.', hi: 'अत्यंत सुगम — शहर के बीच स्थित, 24 घंटे परिवहन उपलब्ध।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:30 PM (Palaces open 9:00 AM – 5:00 PM; Light & Sound show: 7:30 PM)', hi: 'सुबह 6:00 से शाम 6:30 बजे (लाइट एंड साउंड शो: 7:30 बजे)' },
      entryFee: { en: '₹75 for Indians, ₹300 for Foreigners; Sound & Light show: ₹100', hi: 'भारतीय: ₹75, विदेशी: ₹300; लाइट एंड साउंड: ₹100' },
      bestSlot: { en: 'Morning 8:00 AM for quiet exploration or 5:00 PM for sunset & evening show', hi: 'प्रातः 8:00 बजे अथवा सायं 5:00 बजे सूर्यास्त व शो हेतु' },
      accessibilityScore: 7,
      accessibilityNotes: { en: 'Vehicles reach fort top; ramps available at Man Singh Palace entrance.', hi: 'वाहन ऊपर तक जा सकते हैं; मानसिंह महल प्रवेश पर रैंप उपलब्ध।' },
      photographyTips: { en: 'Shoot the blue tiles from the outer lawn with morning sun; sunset from the western ramparts overlooks the entire valley.', hi: 'मान मंदिर की नीली टाइलों का प्रातःकालीन प्रकाश में फोटो लें।' },
      safetyAdvisory: { en: 'Hire only government-badged MP Tourism guides at the ticketing counter.', hi: 'काउंटर से केवल अधिकृत एमपी टूरिज्म गाइड ही लें।' }
    },
    evidenceSources: [
      { title: 'Archaeological Survey of India Gwalior Fort Guide', url: 'https://asibhopal.nic.in', type: 'Official ASI Guide' },
      { title: 'MP Tourism Gwalior Destination Portal', url: 'https://www.mptourism.com/destination-gwalior.php', type: 'Official Tourism Portal' }
    ]
  },
  {
    id: 'orchha_palace_complex',
    name: {
      en: 'Orchha Palace Complex & Chaturbhuj Temple',
      hi: 'ओरछा राजमहल एवं चतुर्भुज मंदिर'
    },
    tagline: {
      en: 'A Poetic 16th-Century Bundela Royal Island on the Betwa River',
      hi: 'बेतवा नदी के पावन द्वीप पर बसा 16वीं सदी का स्वप्निल बुंदेला राजप्रासाद'
    },
    badge: {
      en: 'Royal Bundelkhand • Betwa Riverfront',
      hi: 'शाही बुंदेलखंड • बेतवा रिवरफ्रंट'
    },
    district: { en: 'Niwari (Near Jhansi), Madhya Pradesh', hi: 'निवाड़ी (झांसी के निकट), मध्य प्रदेश' },
    zone: 'bundelkhand',
    category: 'fort_palace',
    coordinates: [25.3508, 78.6436],
    heroImage: '/images/places/orchha_palace.jpg',
    gallery: [
      {
        url: '/images/places/orchha_palace.jpg',
        caption: { en: 'Jahangir Mahal with its elegant multi-tiered stone jaalis and royal courtyards', hi: 'जहाँगीर महल के अलंकृत झरोखे, छतरियां और विशाल आंगन' }
      },
      {
        url: '/images/places/kakanmath.jpg',
        caption: { en: 'Sunset reflection of the 14 Royal Chhatris across the waters of the Betwa River', hi: 'बेतवा नदी के शांत जल में 14 शाही छतरियों का स्वर्णिम सूर्यास्त' }
      }
    ],
    history: {
      dynasty: { en: 'Bundela Rajput Dynasty', hi: 'बुंदेला राजपूत राजवंश' },
      period: { en: '1501 to 1627 CE (16th–17th Century)', hi: '1501 से 1627 ईस्वी' },
      chronicle: {
        en: 'Founded in 1501 by Bundela chieftain Rudra Pratap Singh along a horseshoe bend of the Betwa River. Orchha reached architectural glory under Raja Bir Singh Deo, who constructed the magnificent Jahangir Mahal in 1605 to welcome Mughal Emperor Jahangir. The Raja Mahal retains brilliant mineral frescoes depicting Hindu epics and royal court life.',
        hi: '1501 में रुद्र प्रताप सिंह द्वारा बेतवा नदी के द्वीप पर स्थापित। राजा बीर सिंह देव ने 1605 में सम्राट जहाँगीर के स्वागत में भव्य जहाँगीर महल बनाया। राजा महल में आज भी प्राकृतिक रंगों से बने मनोहारी भित्तिचित्र सुरक्षित हैं।'
      },
      asiSignificance: {
        en: 'Orchha is on UNESCO’s tentative World Heritage list, praised for its intact preservation of a complete medieval Bundela court city including palaces, temples, cenotaphs, and riverside pleasure pavilions.',
        hi: 'ओरछा यूनेस्को की विश्व धरोहर संभावित सूची में शामिल है, जिसे मध्यकालीन बुंदेली दरबारी नगर का अनूठा उदाहरण माना गया है।'
      }
    },
    culture: {
      significance: {
        en: 'World-renowned for Ram Raja Temple — the only shrine on earth where Lord Rama is venerated with a royal daily police Guard of Honour as a crowned reigning monarch.',
        hi: 'विश्व का एकमात्र मंदिर जहां भगवान राम को राजा के रूप में प्रतिदिन पुलिस द्वारा सशस्त्र गार्ड ऑफ ऑनर दिया जाता है।'
      },
      mythology: {
        en: 'Queen Ganeshkunwari brought the holy idol from Ayodhya under a pact that wherever it rested first would become its eternal throne — which became the Queen’s Palace, now the Ram Raja Temple.',
        hi: 'महारानी गणेशकुंवरि अयोध्या से बाल रूप राम को ओरछा लाई थीं। जहां पहली बार मूर्ति रखी गई, वही स्थान आज राम राजा मंदिर है।'
      },
      livingTradition: {
        en: 'Evening Sandhya Aarti at 7:30 PM with bugles, drums, and gun salutes; tranquil kayaking on the Betwa River.',
        hi: 'सायं 7:30 बजे तोप व बंदूकों की सलामी के साथ भव्य राम राजा आरती; बेतवा में नौकायन।'
      }
    },
    architecture: {
      style: { en: 'Bundela Rajput-Mughal Synthesis', hi: 'बुंदेला राजपूत-मुगल समन्वय स्थापत्य' },
      engineeringHighlights: {
        en: [
          'Four-storey quadrilateral palace surrounding a grand central open courtyard',
          'Stone bracketed balconies (Jharokhas) and pierced trellis jaalis providing natural cross-ventilation',
          'Soaring 344-foot spire of Chaturbhuj Temple resembling a sacred basilica',
          'Spiritual riverside cenotaphs (Chhatris) engineered with multi-tiered cupolas'
        ],
        hi: [
          'केंद्रीय प्रांगण के चारों ओर चार मंजिला भव्य चतुष्कोणीय महल',
          'झरोखे, नक्काशीदार पत्थर की जालियां और प्राकृतिक वायु संचार व्यवस्था',
          'चतुर्भुज मंदिर का 344 फीट ऊंचा विशाल शिखर',
          'बेतवा नदी के तट पर बनी 14 बहुमंजिला शाही छतरियां'
        ]
      },
      architecturalNotes: {
        en: 'The defensive moat connected directly to the Betwa River, creating a self-sustaining natural moat barrier.',
        hi: 'किले की खाई सीधे बेतवा नदी से जुड़ी थी, जिससे यह प्राकृतिक जलदुर्ग बन गया।'
      }
    },
    howToReach: {
      fromHub: { en: '18 km from Jhansi Railway Station (~25 mins); 120 km south of Gwalior (~2.5 hrs)', hi: 'झांसी रेलवे स्टेशन से मात्र 18 किमी (25 मिनट); ग्वालियर से 120 किमी दक्षिण' },
      nearestRail: { en: 'VGL Jhansi Junction (VGLJ) — 18 km (Major national rail stop on Delhi-Mumbai corridor)', hi: 'वीरांगना लक्ष्मीबाई झांसी जंक्शन (VGLJ) — 18 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 125 km; Khajuraho Airport (HJR) — 170 km', hi: 'ग्वालियर हवाई अड्डा — 125 किमी' },
      roadCondition: { en: 'Smooth 4-lane highway connecting Jhansi to Orchha bypass', hi: 'झांसी से ओरछा तक बेहतरीन 4 लेन हाईवे' },
      taxiEstimate: { en: 'Auto from Jhansi Station: ₹250–₹350; Taxi: ₹600–₹800', hi: 'झांसी से ऑटो: ₹250–₹350; टैक्सी: ₹600–₹800' },
      returnFeasibility: { en: 'Exceptional Feasibility — Superb railway connectivity from Jhansi to all major Indian cities.', hi: 'अत्यंत सुगम — झांसी से देश के सभी शहरों हेतु वंदे भारत व राजधानी ट्रेनें।' }
    },
    practicalInfo: {
      timings: { en: 'Palaces: 9:00 AM – 5:00 PM; Ram Raja Temple: 8:00 AM – 12:30 PM & 7:00 PM – 10:00 PM', hi: 'महल: सुबह 9:00 से शाम 5:00 बजे; मंदिर: प्रातः 8:00-12:30 व सायं 7:00-10:00' },
      entryFee: { en: '₹100 for Indians, ₹400 for Foreigners (Single combined ticket for Jahangir Mahal, Raja Mahal & Chhatris)', hi: 'भारतीय: ₹100, विदेशी: ₹400 (संयुक्त टिकट)' },
      bestSlot: { en: 'Afternoon 2:30 PM for Palaces, followed by Betwa Sunset at 5:30 PM and Ram Raja Aarti at 7:30 PM', hi: 'दोपहर 2:30 बजे महल, 5:30 बजे बेतवा सूर्यास्त और 7:30 बजे राम राजा आरती' },
      accessibilityScore: 7,
      accessibilityNotes: { en: 'Flat paved stone paths throughout island; golf carts available at main gate.', hi: 'परिसर में समतल पक्के रास्ते; गोल्फ कार्ट उपलब्ध।' },
      photographyTips: { en: 'Stand on the bridge or opposite riverbank at sunset to capture the silhouette of the Chhatris mirrored on the water.', hi: 'सूर्यास्त के समय पुल से छतरियों का जल में बनने वाला प्रतिबिंब फोटो के लिए सर्वोत्तम है।' },
      safetyAdvisory: { en: 'River currents can be brisk during monsoons; wear lifejackets if taking river rafting or boating.', hi: 'बेतवा में नौकायन के समय लाइफ जैकेट अवश्य पहनें।' }
    },
    evidenceSources: [
      { title: 'UNESCO World Heritage Tentative List — Orchha Historical Ensemble', url: 'https://whc.unesco.org/en/tentativelists/6410/', type: 'UNESCO Official Dossier' },
      { title: 'MP Tourism Board Orchha Destination Guide', url: 'https://www.mptourism.com/destination-orchha.php', type: 'Official State Tourism' }
    ]
  },
  {
    id: 'koshak_mahal_chanderi',
    name: {
      en: 'Koshak Mahal & Chanderi Heritage',
      hi: 'कोषक महल एवं चंदेरी धरोहर'
    },
    tagline: {
      en: '15th-Century Malwa Sultanate Palace & Handloom Weaver Capital',
      hi: '15वीं सदी का मालवा सल्तनत स्थापत्य एवं विश्वविख्यात चंदेरी हथकरघा धरोहर'
    },
    badge: {
      en: 'Malwa Sultanate • Silk Handloom Hub',
      hi: 'मालवा सल्तनत • विश्वप्रसिद्ध सिल्क बुनकर'
    },
    district: { en: 'Ashoknagar, Madhya Pradesh', hi: 'अशोकनगर, मध्य प्रदेश' },
    zone: 'malwa',
    category: 'fort_palace',
    coordinates: [24.7170, 78.1180],
    heroImage: '/images/places/koshak_mahal.jpg',
    gallery: [
      {
        url: '/images/places/koshak_mahal.jpg',
        caption: { en: 'Geometric symmetrical arched corridors constructed in local white sandstone', hi: 'स्थानीय सफेद बलुआ पत्थर में तराशे गए खूबसूरत मेहराबदार गलियारे' }
      },
      {
        url: '/images/places/chanderi_fort.jpg',
        caption: { en: 'Chanderi Kirti Durg — The four distinct interconnected palace quadrants rising three storeys high', hi: 'तीन मंजिलों तक फैले परस्पर जुड़े चार भव्य पाषाण खंड' }
      }
    ],
    history: {
      dynasty: { en: 'Malwa Sultanate (Khilji Dynasty)', hi: 'मालवा सल्तनत (खिलजी राजवंश)' },
      period: { en: '1445 CE (15th Century)', hi: '1445 ईस्वी' },
      chronicle: {
        en: 'Commissioned by Sultan Mahmud Khilji of Malwa in 1445 CE to commemorate his victory over Sultan Mahmud Sharqi of Jaunpur. Originally conceived as a seven-storey victory palace, three imposing storeys were completed, boasting four distinct quadrantal mansions interconnected by arched breezeways.',
        hi: 'मालवा के सुल्तान महमूद खिलजी द्वारा 1445 ई. में जौनपुर पर विजय स्मारक के रूप में निर्मित। सात मंजिला महल की योजना में से तीन भव्य तल निर्मित हुए।'
      },
      asiSignificance: {
        en: 'The finest surviving example of secular Malwa Sultanate palace architecture in northern Madhya Pradesh, protected and landscaped by the Archaeological Survey of India.',
        hi: 'उत्तरी मध्य प्रदेश में मालवा सल्तनत के गैर-धार्मिक स्थापत्य का यह सबसे उत्कृष्ट उदाहरण है, जिसे ASI द्वारा संरक्षित किया गया है।'
      }
    },
    culture: {
      significance: {
        en: 'Gateway to Chanderi’s legendary 700-year-old weaving legacy of gold zari and pure silk Chanderi sarees (Geographical Indication protected).',
        hi: 'चंदेरी की 700 वर्ष पुरानी हथकरघा कला, सोने की जरी और शुद्ध सिल्क साड़ियों की विश्वविख्यात संस्कृति।'
      },
      mythology: {
        en: 'Chanderi is rooted in Mahabharata antiquity as Chedi kingdom ruled by King Shishupala, mentioned in Vedic texts.',
        hi: 'महाभारत कालीन चेदि राज्य की राजधानी, जिसका राजा शिशुपाल था।'
      },
      livingTradition: {
        en: 'Visiting traditional handloom weaver colonies in Pranpur and Chanderi town, watching master artisans weave delicate silk fabrics.',
        hi: 'प्राणपुर और चंदेरी के बुनकर मुहल्लों में जाकर पारंपरिक हथकरघा पर बुनाई देखना।'
      }
    },
    architecture: {
      style: { en: 'Malwa Islamic Sultanate Architecture', hi: 'मालवा सल्तनत इस्लामी स्थापत्य' },
      engineeringHighlights: {
        en: [
          'Square 115-foot plan with equal-sized quadrantal pavilions oriented north-south-east-west',
          'Broad arched open galleries allowing natural summer breeze circulation',
          'Local white sandstone blocks fitted with exceptional geometric precision',
          'Pierced screen openings overlooking the surrounding agricultural plains'
        ],
        hi: [
          '115 फीट चौकोर नक्शा जिसमें चारों दिशाओं में समान आकार के चार भवन हैं',
          'शीतल हवा के संचार के लिए विशाल मेहराबदार गलियारे',
          'सफेद बलुआ पत्थर की अत्यंत सटीक ज्यामितीय चिनाई',
          'चारों ओर खेतों का विहंगम दृश्य दिखाते नक्काशीदार झरोखे'
        ]
      },
      architecturalNotes: {
        en: 'The intersecting central corridors create a monumental cruciform passage connecting all four wings.',
        hi: 'मध्य में परस्पर काटते गलियारे चारों खंडों को जोड़ते हैं।'
      }
    },
    howToReach: {
      fromHub: { en: '4 km from Chanderi town; 38 km from Lalitpur; 105 km from Jhansi', hi: 'चंदेरी कस्बे से 4 किमी; ललितपुर से 38 किमी; झांसी से 105 किमी' },
      nearestRail: { en: 'Lalitpur Junction (LAR) — 38 km; Ashoknagar — 65 km; Jhansi (VGLJ) — 105 km', hi: 'ललितपुर जंक्शन — 38 किमी; झांसी — 105 किमी' },
      nearestAir: { en: 'Gwalior Airport (GWL) — 210 km; Bhopal Airport (BHO) — 220 km', hi: 'ग्वालियर हवाई अड्डा — 210 किमी' },
      roadCondition: { en: 'Paved state highway from Lalitpur / Jhansi passing through scenic Vindhya hillocks', hi: 'ललितपुर/झांसी से विंध्याचल की पहाड़ियों से होकर गुजरता पक्का स्टेट हाईवे' },
      taxiEstimate: { en: 'Taxi from Lalitpur Railway Station: ₹800–₹1,200', hi: 'ललितपुर से टैक्सी: ₹800–₹1,200' },
      returnFeasibility: { en: 'Feasible — Combine with Chanderi Fort, Badal Mahal Gate, and Pranpur Craft Village.', hi: 'सुगम — चंदेरी किला, बादल महल गेट और प्राणपुर शिल्प ग्राम के साथ एक दिन का संपूर्ण भ्रमण।' }
    },
    practicalInfo: {
      timings: { en: '6:00 AM – 6:00 PM', hi: 'सुबह 6:00 से शाम 6:00 बजे' },
      entryFee: { en: '₹25 for Indians, ₹300 for Foreigners', hi: 'भारतीय: ₹25, विदेशी: ₹300' },
      bestSlot: { en: 'November to February; morning 9:00 AM – 12:00 PM', hi: 'नवंबर से फरवरी; प्रातः 9:00 से 12:00 बजे' },
      accessibilityScore: 7,
      accessibilityNotes: { en: 'Clean lawns surround the monument; ground floor is fully flat and accessible.', hi: 'चारों ओर स्वच्छ बगीचे; भूतल पूरी तरह समतल व सुलभ।' },
      photographyTips: { en: 'Frame the symmetrical arched doors aligned sequentially to create infinite depth perspective.', hi: 'एक के बाद एक मेहराबों से गुजरते परिप्रेक्ष्य की सिमेट्रिकल फोटोग्राफी करें।' },
      safetyAdvisory: { en: 'Combine with visits to authentic weaver co-operatives in town to buy authentic GI-tagged Chanderi sarees.', hi: 'शहर में प्रामाणिक बुनकर समितियों से सीधे वस्त्र खरीद का अनुभव लें।' }
    },
    evidenceSources: [
      { title: 'Archaeological Survey of India Chanderi Inscription Register', url: 'https://asibhopal.nic.in', type: 'ASI Epigraphic Register' },
      { title: 'Madhya Pradesh Tourism Chanderi Heritage Guide', url: 'https://www.mptourism.com/destination-chanderi.php', type: 'Official MP Tourism' }
    ]
  }
];

interface MPSitesShowcaseProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onFocusMapLocation: (coords: [number, number]) => void;
  onAskAI: (prompt: string) => void;
  onAddPlaceToItinerary?: (place: any) => void;
}

export function MPSitesShowcase({
  theme,
  language,
  onFocusMapLocation,
  onAskAI,
  onAddPlaceToItinerary
}: MPSitesShowcaseProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(MP_HERITAGE_SITES[0].id);
  const [activeTab, setActiveTab] = useState<'history' | 'culture' | 'architecture' | 'reach' | 'practical'>('history');
  const [zoneFilter, setZoneFilter] = useState<'all' | 'chambal' | 'gwalior' | 'bundelkhand' | 'malwa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  const selectedSite = MP_HERITAGE_SITES.find(s => s.id === selectedSiteId) || MP_HERITAGE_SITES[0];

  const filteredSites = MP_HERITAGE_SITES.filter(site => {
    const matchesZone = zoneFilter === 'all' || site.zone === zoneFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      site.name.en.toLowerCase().includes(q) || 
      site.name.hi.includes(q) ||
      site.district.en.toLowerCase().includes(q) ||
      site.history.dynasty.en.toLowerCase().includes(q);
    return matchesZone && matchesSearch;
  });

  const zones = [
    { id: 'all' as const, label: { en: 'All MP Heritage Sites', hi: 'सभी म.प्र. धरोहरें' }, count: MP_HERITAGE_SITES.length },
    { id: 'chambal' as const, label: { en: 'Chambal Heritage Corridor (Morena)', hi: 'चंबल परिपथ (मुरैना)' }, count: MP_HERITAGE_SITES.filter(s => s.zone === 'chambal').length },
    { id: 'gwalior' as const, label: { en: 'Gwalior Royal Citadel', hi: 'ग्वालियर दुर्ग' }, count: MP_HERITAGE_SITES.filter(s => s.zone === 'gwalior').length },
    { id: 'bundelkhand' as const, label: { en: 'Bundelkhand (Orchha)', hi: 'बुंदेलखंड (ओरछा)' }, count: MP_HERITAGE_SITES.filter(s => s.zone === 'bundelkhand').length },
    { id: 'malwa' as const, label: { en: 'Malwa (Chanderi)', hi: 'मालवा (चंदेरी)' }, count: MP_HERITAGE_SITES.filter(s => s.zone === 'malwa').length }
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] p-4 md:p-6 lg:p-8 space-y-6 select-text">
      {/* Top Banner / Destination Portal Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="editorial-card rounded-2xl p-5 md:p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-white shadow-xs">
                Madhya Pradesh Tourism Guide
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                ASI Protected Heritage
              </span>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                {language === 'hi' ? 'चंबल • ग्वालियर • बुंदेलखंड • मालवा' : 'Chambal • Gwalior • Bundelkhand • Malwa'}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-display">
              {language === 'hi' 
                ? 'बियॉन्ड द फोर्ट — मध्य प्रदेश की पुरातात्विक व सांस्कृतिक धरोहरें'
                : 'Beyond the Fort — Archaeological & Cultural Wonders of Madhya Pradesh'}
            </h1>

            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              {language === 'hi'
                ? 'ग्वालियर दुर्ग, मुरैना के बटेश्वर (200 मंदिर), मितावली, गढ़ी पढ़ावली और ककनमठ से लेकर ओरछा और चंदेरी के महलों का प्रामाणिक ऐतिहासिक, वास्तुशिल्पीय व यात्रा मार्गदर्शक।'
                : 'A curated historical and travel guide to extraordinary medieval monuments across Morena, Gwalior Citadel, Orchha Riverfront Palaces, and Chanderi.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
            <button
              onClick={() => onAskAI('मध्य प्रदेश की अनदेखी धरोहरों (बटेश्वर, मितावली, पढ़ावली, ककनमठ) का 4 घंटे का संपूर्ण हेरिटेज टूर प्लान बताएं।')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-primary)] text-white shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'टूर प्लान बनाएं' : 'Plan Heritage Tour'}</span>
            </button>
          </div>
        </div>

        {/* Zone Filters & Search */}
        <div className="mt-5 pt-4 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {zones.map(z => {
              const isSelected = zoneFilter === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => setZoneFilter(z.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-white border-transparent shadow-xs'
                      : 'glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{language === 'hi' ? z.label.hi : z.label.en}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                    {z.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'धरोहर या राजवंश खोजें...' : 'Search monument, dynasty...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full glass border border-[var(--glass-border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Layout: Left Thumbnails List & Right Deep-Dive Page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Destination Cards Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'धरोहर स्थल तालिका' : 'Heritage Destinations'} ({filteredSites.length})</span>
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              {language === 'hi' ? 'विवरण देखने के लिए चुनें' : 'Click card to view details'}
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredSites.map(site => {
              const isSelected = site.id === selectedSiteId;
              return (
                <motion.div
                  key={site.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'editorial-card border-[var(--accent-primary)] shadow-md bg-[var(--accent-primary)]/5'
                      : 'glass border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50'
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 border border-[var(--glass-border)]">
                    <img 
                      src={site.heroImage} 
                      alt={site.name.en}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                        {language === 'hi' ? site.badge.hi : site.badge.en}
                      </span>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] truncate mt-1">
                        {language === 'hi' ? site.name.hi : site.name.en}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[var(--accent-primary)] flex-shrink-0" />
                        <span>{language === 'hi' ? site.district.hi : site.district.en}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] pt-1 border-t border-[var(--glass-border)]/50">
                      <span>{language === 'hi' ? site.history.period.hi : site.history.period.en}</span>
                      <span className="font-semibold text-[var(--accent-primary)] flex items-center gap-0.5">
                        {language === 'hi' ? 'विस्तार' : 'Explore'} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Comprehensive Destination Showcase Article */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSite.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="editorial-card rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden bg-[var(--card-bg)] backdrop-blur-md"
            >
              {/* Monument Hero Header with Badges */}
              <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
                <img 
                  src={selectedSite.heroImage} 
                  alt={selectedSite.name.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-orange-600 text-white shadow-lg backdrop-blur-md">
                    {language === 'hi' ? selectedSite.badge.hi : selectedSite.badge.en}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFocusMapLocation(selectedSite.coordinates)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold glass text-white border border-white/20 shadow-md hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      title="Focus on map"
                    >
                      <Navigation className="w-3.5 h-3.5 text-orange-400" />
                      <span>{language === 'hi' ? 'मानचित्र में देखें' : 'View on Map'}</span>
                    </button>
                  </div>
                </div>

                {/* Title & Tagline Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-orange-300 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? selectedSite.district.hi : selectedSite.district.en}</span>
                    <span>•</span>
                    <span>{language === 'hi' ? selectedSite.history.dynasty.hi : selectedSite.history.dynasty.en}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white drop-shadow-md">
                    {language === 'hi' ? selectedSite.name.hi : selectedSite.name.en}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 max-w-2xl font-medium">
                    {language === 'hi' ? selectedSite.tagline.hi : selectedSite.tagline.en}
                  </p>
                </div>
              </div>

              {/* Photo Showcase Strip with Clickable Lightbox */}
              {selectedSite.gallery && selectedSite.gallery.length > 0 && (
                <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--glass-border)]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>{language === 'hi' ? 'प्रामाणिक छायाचित्र गैलरी' : 'Authentic Site Gallery'}</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {language === 'hi' ? 'बड़ा देखने के लिए क्लिक करें' : 'Click photo to enlarge'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedSite.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveLightboxImage(img.url)}
                        className="group relative h-24 sm:h-28 rounded-xl overflow-hidden cursor-pointer border border-[var(--glass-border)]"
                      >
                        <img 
                          src={img.url} 
                          alt={img.caption.en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                          <p className="text-[10px] text-white font-medium text-center line-clamp-2">
                            {language === 'hi' ? img.caption.hi : img.caption.en}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Tab Bar for the Deep-Dive Sections */}
              <div className="px-4 border-b border-[var(--glass-border)] flex items-center gap-2 overflow-x-auto scrollbar-hide bg-[var(--bg-primary)]">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'history'
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'इतिहास व राजवंश' : 'History & Dynasties'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('culture')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'culture'
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'संस्कृति व महत्व' : 'Culture & Purpose'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'architecture'
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'वास्तुकला व इंजीनियरिंग' : 'Architecture & Civil Art'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('reach')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'reach'
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पहुंचने का मार्ग व टैक्सी' : 'How to Reach & Transit'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('practical')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'practical'
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'समय, टिकट व सलाह' : 'Visiting Hours & Tips'}</span>
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-5 md:p-6 space-y-5">
                {/* 1. History & Dynasty Tab */}
                {activeTab === 'history' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'संबंधित राजवंश' : 'Ruling Dynasty'}
                        </span>
                        <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                          {language === 'hi' ? selectedSite.history.dynasty.hi : selectedSite.history.dynasty.en}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'ऐतिहासिक कालखंड' : 'Historical Period'}
                        </span>
                        <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                          {language === 'hi' ? selectedSite.history.period.hi : selectedSite.history.period.en}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {language === 'hi' ? '📜 ऐतिहासिक गाथा एवं पुरातात्विक पृष्ठभूमि' : '📜 Historical Narrative & Archaeological Background'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {language === 'hi' ? selectedSite.history.chronicle.hi : selectedSite.history.chronicle.en}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === 'hi' ? 'ASI संरक्षण एवं पुनरुद्धार अभिलेख' : 'ASI Conservation & Archaeological Record'}</span>
                      </h4>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                        {language === 'hi' ? selectedSite.history.asiSignificance.hi : selectedSite.history.asiSignificance.en}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 2. Culture & Purpose Tab */}
                {activeTab === 'culture' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        {language === 'hi' ? 'भ्रमण का उद्देश्य एवं आध्यात्मिक महत्व (Travel Cause)' : 'Travel Purpose & Spiritual Significance'}
                      </span>
                      <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                        {language === 'hi' ? selectedSite.culture.significance.hi : selectedSite.culture.significance.en}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {language === 'hi' ? '🕉️ पौराणिक आख्यान एवं देव स्वरूप' : '🕉️ Mythology & Deities'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {language === 'hi' ? selectedSite.culture.mythology.hi : selectedSite.culture.mythology.en}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-primary)] space-y-1">
                      <h5 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        <span>{language === 'hi' ? 'जीवंत लोक परंपरा एवं त्यौहार' : 'Living Traditions & Seasonal Festivals'}</span>
                      </h5>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {language === 'hi' ? selectedSite.culture.livingTradition.hi : selectedSite.culture.livingTradition.en}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3. Architecture & Civil Art Tab */}
                {activeTab === 'architecture' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        {language === 'hi' ? 'स्थापत्य शैली' : 'Architectural Style'}
                      </span>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                        {language === 'hi' ? selectedSite.architecture.style.hi : selectedSite.architecture.style.en}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {language === 'hi' ? '📐 इंजीनियरिंग एवं संरचनात्मक विशेषताएं' : '📐 Civil Engineering & Structural Highlights'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(language === 'hi' ? selectedSite.architecture.engineeringHighlights.hi : selectedSite.architecture.engineeringHighlights.en).map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-[var(--text-primary)]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        {language === 'hi' ? 'वास्तुशिल्पीय विश्लेषण' : 'Architectural Overview'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {language === 'hi' ? selectedSite.architecture.architecturalNotes.hi : selectedSite.architecture.architecturalNotes.en}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 4. How to Reach & Transit Tab */}
                {activeTab === 'reach' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] space-y-1">
                        <div className="flex items-center gap-1.5 text-orange-500 text-xs font-bold">
                          <Car className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'सड़क मार्ग' : 'Road Distance'}</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] font-medium">
                          {language === 'hi' ? selectedSite.howToReach.fromHub.hi : selectedSite.howToReach.fromHub.en}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-500 text-xs font-bold">
                          <Train className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'निकटतम रेलवे स्टेशन' : 'Nearest Railway'}</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] font-medium">
                          {language === 'hi' ? selectedSite.howToReach.nearestRail.hi : selectedSite.howToReach.nearestRail.en}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-500 text-xs font-bold">
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'हवाई अड्डा' : 'Nearest Airport'}</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] font-medium">
                          {language === 'hi' ? selectedSite.howToReach.nearestAir.hi : selectedSite.howToReach.nearestAir.en}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'सड़क की स्थिति' : 'Road Condition & Surface'}
                        </span>
                        <p className="text-xs sm:text-sm text-[var(--text-primary)] font-medium mt-0.5">
                          {language === 'hi' ? selectedSite.howToReach.roadCondition.hi : selectedSite.howToReach.roadCondition.en}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {language === 'hi' ? 'अनुमानित टैक्सी / कैब किराया (Taxi Fare Estimate)' : 'Estimated Cab / Taxi Fare'}
                        </span>
                        <p className="text-xs sm:text-sm text-[var(--text-primary)] font-bold mt-0.5">
                          {language === 'hi' ? selectedSite.howToReach.taxiEstimate.hi : selectedSite.howToReach.taxiEstimate.en}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                          {language === 'hi' ? 'वापसी यात्रा व समय सीमा (Return Journey Feasibility)' : 'Return Feasibility & Deadline Safety'}
                        </span>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {language === 'hi' ? selectedSite.howToReach.returnFeasibility.hi : selectedSite.howToReach.returnFeasibility.en}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. Visiting Hours & Tips Tab */}
                {activeTab === 'practical' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'खुलने का समय' : 'Visiting Hours'}
                        </span>
                        <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                          {language === 'hi' ? selectedSite.practicalInfo.timings.hi : selectedSite.practicalInfo.timings.en}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'प्रवेश शुल्क' : 'Entry Ticket'}
                        </span>
                        <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                          {language === 'hi' ? selectedSite.practicalInfo.entryFee.hi : selectedSite.practicalInfo.entryFee.en}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {language === 'hi' ? 'सर्वोत्तम समय स्लॉट' : 'Best Visiting Slot'}
                        </span>
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                          {language === 'hi' ? selectedSite.practicalInfo.bestSlot.hi : selectedSite.practicalInfo.bestSlot.en}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-blue-500" />
                            <span>{language === 'hi' ? 'फोटोग्राफी सुझाव' : 'Photography Advice'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {language === 'hi' ? selectedSite.practicalInfo.photographyTips.hi : selectedSite.practicalInfo.photographyTips.en}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{language === 'hi' ? 'सुगमता रेटिंग (Accessibility)' : 'Accessibility Rating'}</span>
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            {selectedSite.practicalInfo.accessibilityScore}/10
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {language === 'hi' ? selectedSite.practicalInfo.accessibilityNotes.hi : selectedSite.practicalInfo.accessibilityNotes.en}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>{language === 'hi' ? 'सुरक्षा एवं सावधानी परामर्श' : 'Safety Advisory & Practical Precautions'}</span>
                      </h4>
                      <p className="text-xs text-[var(--text-primary)] mt-1">
                        {language === 'hi' ? selectedSite.practicalInfo.safetyAdvisory.hi : selectedSite.practicalInfo.safetyAdvisory.en}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Evidence & Registry Sources Box */}
                <div className="pt-4 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)]">{language === 'hi' ? 'प्रमाणित स्रोत:' : 'Evidence Grounding:'}</span>
                    {selectedSite.evidenceSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 rounded-md glass border border-[var(--glass-border)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors flex items-center gap-1"
                      >
                        <span>{source.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Ribbon */}
                <div className="pt-3 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFocusMapLocation(selectedSite.coordinates)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent-primary)] text-white shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'मानचित्र पर रूट देखें' : 'View Route on Map'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const q = language === 'hi'
                          ? `${selectedSite.name.hi} का विस्तृत इतिहास, स्थापत्य, और ग्वालियर से 4 घंटे का भ्रमण रूट प्लान बताएं।`
                          : `Tell me the complete history, architecture, and a 4-hour travel route from Gwalior for ${selectedSite.name.en}.`;
                        onAskAI(q);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold glass border border-[var(--glass-border)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>{language === 'hi' ? 'घूमो AI से पूछें' : 'Ask Ghumo AI'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.origin + `?site=${selectedSite.id}`);
                        toast.success(language === 'hi' ? 'धरोहर लिंक कॉपी किया गया!' : 'Heritage link copied to clipboard!');
                      }
                    }}
                    className="p-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Share site"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Photo Viewing */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={activeLightboxImage} 
              alt="Enlarged heritage view"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
