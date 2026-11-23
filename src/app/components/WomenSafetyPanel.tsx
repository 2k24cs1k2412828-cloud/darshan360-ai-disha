import { useState, useEffect, Component, type ReactNode, type ErrorInfo } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Share2, 
  Search, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  Navigation, 
  BatteryCharging, 
  Clock, 
  Radio, 
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Send,
  MessageSquare,
  Compass,
  Building2,
  CheckCircle2,
  Sparkles,
  Info,
  HeartHandshake,
  Mic,
  MicOff,
  Mail,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  saveSafetyLocation, 
  getSafetyLocationByCode, 
  deleteSafetyLocation, 
  generateRandomSafetyCode, 
  getCurrentGPSPosition, 
  approximateUPLocation, 
  getDeviceBatteryLevel, 
  playEmergencySiren, 
  stopEmergencySiren, 
  isEmergencySirenPlaying,
  subscribeEmergencySiren,
  getGoogleMapsLocationUrl,
  getGoogleMapsDirectionsUrl,
  searchPlaceLocation,
  UP_QUICK_LOCATIONS,
  type SafetyLocationData 
} from '../services/safetyService';
import {
  getSavedGuardianSettings,
  saveGuardianSettings,
  startVoiceSosListening,
  stopVoiceSosListening,
  isVoiceSosListening,
  isSpeechRecognitionSupported,
  triggerEmergencySosAlert,
  openEmailSos,
  openGmailSos,
  openWhatsAppSos,
  formatWhatsAppPhoneNumber,
  subscribeSosAlert,
  subscribeListeningState,
  subscribeTranscript,
  SOS_TRIGGER_KEYWORDS,
  DEFAULT_GUARDIAN_EMAIL,
  type GuardianSettings,
  type SosAlertPayload
} from '../services/voiceSosService';

interface WomenSafetyPanelProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onAskAI?: (prompt: string) => void;
  initialCode?: string;
  initialTab?: 'share' | 'access';
  onOpenMap?: () => void;
}

// Pulsing beacon radar marker icon
const beaconIcon = L.divIcon({
  className: 'safety-beacon-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
      <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: rgba(225, 29, 72, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <span style="position: relative; display: flex; border-radius: 9999px; width: 22px; height: 22px; background-color: #e11d48; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.5); align-items: center; justify-content: center;">
        <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: white;"></span>
      </span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Click-to-place map event handler for precise street/city placement
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Official UP Police Pink Booths & Safe Corridors Directory
const UP_SAFE_CORRIDORS = [
  {
    city: { en: 'Kanpur', hi: 'कानपुर' },
    hub: { en: 'Civil Lines & Z Square Mall Pink Booth', hi: 'सिविल लाइन्स व जेड स्क्वायर पिंक बूथ' },
    phone: '1090',
    facilities: { en: 'Women Police Help Desk, 24x7 Pink Patrol Squad, Bithoor Assistance Post', hi: 'महिला पुलिस हेल्प डेस्क, 24x7 पिंक पेट्रोलिंग, बिठूर सहायता केंद्र' }
  },
  {
    city: { en: 'Varanasi', hi: 'वाराणसी' },
    hub: { en: 'Godowlia & Dashashwamedh Pink Booth', hi: 'गोदौलिया व दशाश्वमेध पिंक बूथ' },
    phone: '1090',
    facilities: { en: 'Women Police Help Desk, CCTV Monitoring, 24x7 Patrol', hi: 'महिला पुलिस हेल्प डेस्क, सीसीटीवी निगरानी, 24x7 गश्त' }
  },
  {
    city: { en: 'Ayodhya', hi: 'अयोध्या' },
    hub: { en: 'Ram Path & Naya Ghat Pilgrim Assistance Booth', hi: 'राम पथ व नया घाट तीर्थ सहायता बूथ' },
    phone: '112',
    facilities: { en: 'Dedicated Women Constables, Free Battery Cart Escort, Safe Transit', hi: 'महिला आरक्षी दस्ता, निशुल्क ई-कार्ट एस्कॉर्ट, सुरक्षित मार्ग' }
  },
  {
    city: { en: 'Mathura-Vrindavan', hi: 'मथुरा-वृन्दावन' },
    hub: { en: 'Vidyapeeth Crossing & Prem Mandir Safety Post', hi: 'विद्यापीठ चौराहा व प्रेम मंदिर सुरक्षा चौकी' },
    phone: '1090',
    facilities: { en: 'Foot Patrol Officers, Anti-Harassment Squad, Lost & Found', hi: 'पैदल सुरक्षा दस्ता, एंटी-रोमियो स्क्वाड, खोया-पाया केंद्र' }
  },
  {
    city: { en: 'Prayagraj', hi: 'प्रयागराज' },
    hub: { en: 'Triveni Sangam & Parade Ground Safe Camp', hi: 'त्रिवेणी संगम व परेड ग्राउंड सेफ कैंप' },
    phone: '112',
    facilities: { en: 'Riverfront Rescue Unit, Rest Booth, Direct 1090 Link', hi: 'जल पुलिस सहायता, विश्राम बूथ, 1090 सीधा संपर्क' }
  },
  {
    city: { en: 'Lucknow', hi: 'लखनऊ' },
    hub: { en: 'Hazratganj & Old City Heritage Corridor Booth', hi: 'हजरतगंज व हेरिटेज कॉरिडोर पिंक बूथ' },
    phone: '1090',
    facilities: { en: 'Smart City Emergency SOS Pole, 24x7 Women Patrol Squad', hi: 'स्मार्ट सिटी एसओएस पोल, 24x7 वीमेन पेट्रोलिंग' }
  }
];

function WomenSafetyPanelContent({
  theme,
  language,
  onAskAI,
  initialCode = '',
  initialTab = 'share',
  onOpenMap
}: WomenSafetyPanelProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'access'>(initialTab);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Tab 1: Share State - default to 77645 so sharer and accessor start on the exact same code
  const [shareCode, setShareCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('d360_active_safety_share');
      if (active) return active;
    }
    return '77645';
  });
  const [personName, setPersonName] = useState<string>('');
  const [travelNote, setTravelNote] = useState<string>('');
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [approxAddress, setApproxAddress] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isShareActive, setIsShareActive] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [copiedShareCode, setCopiedShareCode] = useState<boolean>(false);
  const [copiedGoogleMapLink, setCopiedGoogleMapLink] = useState<boolean>(false);
  const [placeQuery, setPlaceQuery] = useState<string>('');
  const [isSearchingPlace, setIsSearchingPlace] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<{ label: string; latitude: number; longitude: number }>>([]);
  const [deviceBattery, setDeviceBattery] = useState<number | undefined>(undefined);
  const [gpsSource, setGpsSource] = useState<'browser_gps' | 'city_preset'>('city_preset');
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);

  // Voice SOS & Guardian State
  const [guardianSettings, setGuardianSettings] = useState<GuardianSettings>(() => getSavedGuardianSettings());
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isSettingsSaved, setIsSettingsSaved] = useState<boolean>(false);
  const [activeSosAlert, setActiveSosAlert] = useState<SosAlertPayload | null>(null);
  const [isSimulatingAlert, setIsSimulatingAlert] = useState<boolean>(false);
  const [micPermissionError, setMicPermissionError] = useState<'permission_denied' | 'speech_not_supported' | 'device_not_found' | null>(null);

  // Tab 2: Access State
  const [accessCodeInput, setAccessCodeInput] = useState<string>(initialCode);
  const [isAccessLoading, setIsAccessLoading] = useState<boolean>(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [trackedLocation, setTrackedLocation] = useState<SafetyLocationData | null>(null);
  const [lastTrackedTimeAgo, setLastTrackedTimeAgo] = useState<string>('');
  const [showMapPreview, setShowMapPreview] = useState<boolean>(true);

  const safeLat = Number(trackedLocation?.latitude ?? (trackedLocation as any)?.lat ?? 25.3109);
  const safeLng = Number(trackedLocation?.longitude ?? (trackedLocation as any)?.lng ?? 83.0107);

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      setCurrentTimeStr(
        istDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync initial tab & code
  useEffect(() => {
    if (initialCode) {
      setAccessCodeInput(initialCode);
      setActiveTab('access');
      handleAccessLocation(initialCode);
    }
  }, [initialCode]);

  // Initial GPS detect and check share on mount
  useEffect(() => {
    detectCurrentLocation();
    checkExistingShare();

    return () => {
      stopEmergencySiren();
    };
  }, []);

  const checkExistingShare = async () => {
    try {
      const activeCode = localStorage.getItem('d360_active_safety_share');
      if (activeCode) {
        const existing = await getSafetyLocationByCode(activeCode);
        if (existing) {
          setShareCode(existing.code);
          setPersonName(existing.personName || '');
          setTravelNote(existing.note || '');
          setGpsCoords({ latitude: existing.latitude, longitude: existing.longitude, accuracy: existing.accuracy });
          setApproxAddress(existing.address || approximateUPLocation(existing.latitude, existing.longitude));
          setIsShareActive(true);
        }
      }
    } catch {}
  };

  // Auto-sync location to server & local storage immediately
  const syncLocationOnServer = async (code: string, lat?: number, lng?: number, addr?: string, batt?: number) => {
    if (!code) return;
    const normalizedCode = code.trim().toUpperCase();
    const cLat = Number(lat ?? gpsCoords?.latitude ?? 25.3109);
    const cLng = Number(lng ?? gpsCoords?.longitude ?? 83.0107);
    const cAddr = addr || approxAddress || approximateUPLocation(cLat, cLng);
    const payload: SafetyLocationData = {
      code: normalizedCode,
      latitude: cLat,
      longitude: cLng,
      accuracy: 12,
      address: cAddr,
      personName: personName.trim() || (language === 'hi' ? 'तीर्थ यात्री' : 'Pilgrim Traveler'),
      note: travelNote.trim() || undefined,
      batteryLevel: batt ?? deviceBattery ?? 88,
      timestamp: Date.now(),
      updatedAt: Date.now(),
      isBeaconActive: true
    };
    try {
      await saveSafetyLocation(payload);
      setIsShareActive(true);
    } catch (err) {
      console.warn('Auto-sync error:', err);
    }
  };

  const handleShareCodeChange = (newVal: string) => {
    const clean = newVal.trim().toUpperCase();
    setShareCode(clean);
    if (clean && gpsCoords) {
      syncLocationOnServer(clean, gpsCoords.latitude, gpsCoords.longitude, approxAddress, deviceBattery);
    }
  };

  const detectCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentGPSPosition();
      setGpsCoords({ latitude: pos.latitude, longitude: pos.longitude, accuracy: pos.accuracy });
      setGpsSource(pos.source === 'browser_gps' ? 'browser_gps' : 'city_preset');
      const addr = approximateUPLocation(pos.latitude, pos.longitude);
      setApproxAddress(addr);
      const battery = await getDeviceBatteryLevel();
      if (battery !== undefined) setDeviceBattery(battery);
      const targetCode = (shareCode || '77645').trim().toUpperCase();
      syncLocationOnServer(targetCode, pos.latitude, pos.longitude, addr, battery);
    } catch {
      const fallback = { latitude: 25.3109, longitude: 83.0107, accuracy: 15 };
      setGpsCoords(fallback);
      setGpsSource('city_preset');
      const addr = approximateUPLocation(fallback.latitude, fallback.longitude);
      setApproxAddress(addr);
      const targetCode = (shareCode || '77645').trim().toUpperCase();
      syncLocationOnServer(targetCode, fallback.latitude, fallback.longitude, addr);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSetManualCoordinates = (lat: number, lng: number) => {
    setGpsCoords({ latitude: lat, longitude: lng, accuracy: 10 });
    const addr = approximateUPLocation(lat, lng);
    setApproxAddress(addr);
    setGpsSource('city_preset');
    const targetCode = (shareCode || '77645').trim().toUpperCase();
    syncLocationOnServer(targetCode, lat, lng, addr, deviceBattery);
  };

  const handleSelectCityPreset = (city: (typeof UP_QUICK_LOCATIONS)[0], index: number) => {
    setSelectedCityIndex(index);
    setGpsCoords({ latitude: city.latitude, longitude: city.longitude, accuracy: 10 });
    setApproxAddress(city.address);
    setGpsSource('city_preset');
    const targetCode = (shareCode || '77645').trim().toUpperCase();
    syncLocationOnServer(targetCode, city.latitude, city.longitude, city.address, deviceBattery);
  };

  const isOutsideUPOrISP = Boolean(
    gpsCoords && (
      gpsCoords.latitude > 30.5 ||
      gpsCoords.latitude < 23.5 ||
      (gpsCoords.accuracy && gpsCoords.accuracy >= 10000) ||
      (approxAddress && (approxAddress.includes('Shimla') || approxAddress.includes('Broadband')))
    )
  );

  const handleGenerateNewCode = () => {
    const newCode = generateRandomSafetyCode();
    setShareCode(newCode);
    if (gpsCoords) {
      syncLocationOnServer(newCode, gpsCoords.latitude, gpsCoords.longitude, approxAddress, deviceBattery);
    }
  };

  const handleOpenInGoogleMaps = (lat: number, lng: number) => {
    window.open(getGoogleMapsLocationUrl(lat, lng), '_blank');
  };

  const handleCopyGoogleMapsLink = (lat: number, lng: number) => {
    navigator.clipboard.writeText(getGoogleMapsLocationUrl(lat, lng));
    setCopiedGoogleMapLink(true);
    setTimeout(() => setCopiedGoogleMapLink(false), 2000);
  };

  const handleSearchPlace = async () => {
    if (!placeQuery.trim()) return;
    setIsSearchingPlace(true);
    try {
      const trimmed = placeQuery.trim();
      const queryToUse = trimmed.toLowerCase().includes('kanpur') || trimmed.toLowerCase().includes('uttar pradesh')
        ? trimmed
        : `${trimmed}, Kanpur, Uttar Pradesh`;
      const results = await searchPlaceLocation(queryToUse);
      setSearchResults(results);
      if (results.length > 0) {
        handleSetManualCoordinates(results[0].latitude, results[0].longitude);
      }
    } catch {
      // Handled silently
    } finally {
      setIsSearchingPlace(false);
    }
  };

  // Voice SOS Subscriptions & Lifecycle
  // Voice SOS & Emergency Siren Subscriptions & Lifecycle
  useEffect(() => {
    setIsVoiceListening(isVoiceSosListening());
    setIsSirenActive(isEmergencySirenPlaying());
    const unsubListen = subscribeListeningState((listening) => {
      setIsVoiceListening(listening);
    });
    const unsubTranscript = subscribeTranscript((text) => {
      setLiveTranscript(text);
    });
    const unsubAlert = subscribeSosAlert((payload) => {
      setActiveSosAlert(payload);
    });
    const unsubSiren = subscribeEmergencySiren((active) => {
      setIsSirenActive(active);
    });
    return () => {
      unsubListen();
      unsubTranscript();
      unsubAlert();
      unsubSiren();
    };
  }, []);

  const handleSaveGuardianContacts = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveGuardianSettings(guardianSettings);
    setIsSettingsSaved(true);
    setTimeout(() => setIsSettingsSaved(false), 2500);
  };

  const handleToggleVoiceSos = async () => {
    if (isVoiceListening) {
      stopVoiceSosListening();
      setIsVoiceListening(false);
      setMicPermissionError(null);
    } else {
      setMicPermissionError(null);
      try {
        const res = await startVoiceSosListening();
        if (!res.success) {
          setMicPermissionError(
            (res.error as 'permission_denied' | 'speech_not_supported' | 'device_not_found') || 'permission_denied'
          );
        } else {
          setIsVoiceListening(true);
          setMicPermissionError(null);
        }
      } catch (err) {
        console.warn('Voice SOS error:', err);
        setMicPermissionError('permission_denied');
      }
    }
  };

  const handleSimulateVoiceKeyword = async () => {
    setIsSimulatingAlert(true);
    try {
      saveGuardianSettings(guardianSettings);
      const payload = await triggerEmergencySosAlert('i am in danger', guardianSettings);
      setActiveSosAlert(payload);
    } finally {
      setIsSimulatingAlert(false);
    }
  };

  // Real-time live synchronization for Tab 2 (BroadcastChannel + 2.5s live polling)
  useEffect(() => {
    if (activeTab !== 'access' || !trackedLocation?.code) return;

    const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel('darshan360_safety_sync')
      : null;

    if (channel) {
      channel.onmessage = (event: MessageEvent) => {
        if (event.data?.type === 'LOCATION_UPDATED' && event.data?.data) {
          const incoming: SafetyLocationData = event.data.data;
          if (incoming.code === trackedLocation.code) {
            setTrackedLocation(incoming);
            setAccessError(null);
          }
        }
      };
    }

    const pollInterval = setInterval(async () => {
      try {
        const live = await getSafetyLocationByCode(trackedLocation.code);
        if (live) {
          setTrackedLocation(live);
        }
      } catch {}
    }, 2500);

    return () => {
      if (channel) channel.close();
      clearInterval(pollInterval);
    };
  }, [activeTab, trackedLocation?.code]);

  // Toggle emergency siren
  const handleToggleSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      const ok = playEmergencySiren();
      if (ok) setIsSirenActive(true);
    }
  };

  // Share Location Submit
  const handleSaveAndShareLocation = async () => {
    if (!shareCode.trim()) {
      alert(language === 'hi' ? 'कृपया सुरक्षा कोड दर्ज करें' : 'Please enter a safety code');
      return;
    }
    if (!gpsCoords) {
      alert(language === 'hi' ? 'कृपया GPS लोकेशन प्राप्त होने दें' : 'Please allow GPS location capture');
      return;
    }

    setIsSaving(true);
    const normalizedCode = shareCode.trim().toUpperCase();
    const payload: SafetyLocationData = {
      code: normalizedCode,
      latitude: gpsCoords.latitude,
      longitude: gpsCoords.longitude,
      accuracy: gpsCoords.accuracy,
      address: approxAddress,
      personName: personName.trim() || undefined,
      note: travelNote.trim() || undefined,
      batteryLevel: deviceBattery,
      timestamp: Date.now(),
      updatedAt: Date.now(),
      isBeaconActive: true
    };

    try {
      await saveSafetyLocation(payload);
      setIsShareActive(true);
    } catch (err) {
      console.error('Failed to save safety location:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Stop Sharing
  const handleStopSharing = async () => {
    if (shareCode) {
      await deleteSafetyLocation(shareCode);
    }
    setIsShareActive(false);
  };

  // Access Location Submit
  const handleAccessLocation = async (codeToSearch?: string) => {
    const code = (codeToSearch || accessCodeInput).trim().toUpperCase();
    if (!code) {
      setAccessError(language === 'hi' ? 'कृपया 5-अंकों का कोड दर्ज करें' : 'Please enter the 5-digit code');
      return;
    }

    setIsAccessLoading(true);
    setAccessError(null);
    try {
      const data = await getSafetyLocationByCode(code);
      if (data) {
        setTrackedLocation(data);
        const timestampVal = Number(data.timestamp || data.updatedAt || Date.now());
        const elapsedSec = Math.max(1, Math.floor((Date.now() - (isNaN(timestampVal) ? Date.now() : timestampVal)) / 1000));
        setLastTrackedTimeAgo(
          elapsedSec < 60 
            ? `${elapsedSec}s ago` 
            : `${Math.floor(elapsedSec / 60)}m ago`
        );
      } else {
        setTrackedLocation(null);
        setAccessError(
          language === 'hi'
            ? `कोड "${code}" के लिए कोई सक्रिय लोकेशन नहीं मिली। कृपया कोड जांचें।`
            : `No active location found for code "${code}". Please verify the code with the sender.`
        );
      }
    } catch {
      setAccessError(language === 'hi' ? 'सर्वर से जुड़ने में त्रुटि' : 'Error connecting to safety server');
    } finally {
      setIsAccessLoading(false);
    }
  };

  const getShareableUrl = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?safety_code=${encodeURIComponent(code)}`;
  };

  const handleCopyLink = () => {
    const url = getShareableUrl(shareCode);
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedShareCode(true);
    setTimeout(() => setCopiedShareCode(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = getShareableUrl(shareCode);
    const googleMapUrl = gpsCoords ? getGoogleMapsLocationUrl(gpsCoords.latitude, gpsCoords.longitude) : '';
    const msg = language === 'hi'
      ? `🚨 *महिला सुरक्षा आपातकालीन लोकेशन सूचना (Darshan 360)*:\nमैं अपनी लाइव लोकेशन आपके साथ साझा कर रही हूँ।\nसुरक्षा कोड: *${shareCode}*\n\n📍 *Google Maps लाइव लोकेशन:*\n${googleMapUrl}\n\n🛡️ *Darshan 360 लाइव ट्रैकिंग पोर्टल:*\n${url}`
      : `🚨 *Women Safety Emergency Location Alert (Darshan 360)*:\nI have shared my live location with you for safety.\nAccess Code: *${shareCode}*\n\n📍 *Google Maps Live Location:*\n${googleMapUrl}\n\n🛡️ *Darshan 360 Live Tracking Portal:*\n${url}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="w-full h-full overflow-y-auto block p-4 md:p-8 space-y-6 scrollbar-thin">
      {/* Editorial Page Masthead */}
      <header className="border-b border-[var(--glass-border)] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>{language === 'hi' ? 'उत्तर प्रदेश महिला सुरक्षा सेल 1090' : 'UP WOMEN SAFETY CELL 1090'}</span>
            </span>

            <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-primary)]/25 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {currentTimeStr || 'IST Live'}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-editorial flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 md:w-8 md:h-8 text-[var(--accent-primary)] flex-shrink-0" />
            <span>{language === 'hi' ? 'महिला सुरक्षा एवं आपातकालीन पोर्टल' : 'Women Safety & Emergency Portal'}</span>
          </h2>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'आपातकालीन सहायता, वन-टैप हेल्पलाइन कॉल, तथा कोड द्वारा सुरक्षित लोकेशन शेयरिंग व ट्रैकिंग व्यवस्था।'
              : 'Dedicated 24x7 emergency hotlines, loud siren deterrent, and secure code-based live GPS location sharing and guardian tracking.'}
          </p>
        </div>

        {/* Siren Audio Deterrant Action */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
          <button
            onClick={handleToggleSiren}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              isSirenActive
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400 animate-pulse'
                : 'editorial-card text-[var(--text-primary)] hover:border-red-500/50 hover:text-red-600'
            }`}
            title={isSirenActive ? 'Stop Emergency Siren' : 'Trigger Loud Siren Alert'}
          >
            {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500" />}
            <span>{isSirenActive ? (language === 'hi' ? 'सायरन बंद करें' : 'Stop Siren') : (language === 'hi' ? 'आपातकालीन सायरन' : 'Emergency Siren')}</span>
          </button>
        </div>
      </header>

      {/* 1-Tap Emergency Direct Call Strip */}
      <section className="editorial-card rounded-2xl p-5 border border-[var(--glass-border)] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            {language === 'hi' ? 'त्वरित आपातकालीन हेल्पलाइन (Direct SOS Calls)' : 'One-Tap Emergency Calling Hotlines'}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {language === 'hi' ? 'मुफ्त सरकारी हेल्पलाइन • 24 घंटे उपलब्ध' : 'Toll-Free Government Services • Available 24x7'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1090 */}
          <a
            href="tel:1090"
            className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] hover:border-red-500/50 hover:bg-red-500/5 transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-red-600 transition-colors block">
                  1090 • {language === 'hi' ? 'वीमेन पावर लाइन' : 'Women Power Line'}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] block">
                  {language === 'hi' ? 'महिला सुरक्षा एवं उत्पीड़न रोकथाम' : 'UP Women Safety Helpline'}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-600 text-white shadow-xs">
              SOS
            </span>
          </a>

          {/* 112 */}
          <a
            href="tel:112"
            className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] hover:border-red-500/50 hover:bg-red-500/5 transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-red-600 transition-colors block">
                  112 • {language === 'hi' ? 'आपातकालीन पुलिस' : 'Police Emergency'}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] block">
                  {language === 'hi' ? 'त्वरित पुलिस प्रतिक्रिया दल' : 'Immediate Police Response'}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-600 text-white shadow-xs">
              POLICE
            </span>
          </a>

          {/* 181 */}
          <a
            href="tel:181"
            className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/5 transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors block">
                  181 • {language === 'hi' ? 'महिला व बाल हेल्पलाइन' : 'Women & Child'}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] block">
                  {language === 'hi' ? 'परामर्श व विधिक सहायता' : 'Counseling & Support'}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--card-bg)] text-[var(--accent-primary)] border border-[var(--glass-border)] shadow-xs">
              CALL
            </span>
          </a>
        </div>
      </section>

      {/* Voice Keyword SOS & Guardian Alert Setup Section */}
      <section className="editorial-card rounded-2xl p-5 md:p-6 border border-[var(--glass-border)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">
                <Mic className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-editorial flex items-center gap-2">
                  <span>{language === 'hi' ? 'वॉइस कीवर्ड एसओएस व अभिभावक अलर्ट' : 'Voice Keyword SOS & Guardian Alert'}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-bold border border-red-500/25">
                    "I am in danger"
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === 'hi'
                    ? 'यदि आप "I am in danger" (या "बचाओ") बोलेंगे, तो आपकी सटीक लोकेशन ईमेल व व्हाट्सएप पर स्वतः प्रेषित होगी।'
                    : 'Saying "I am in danger" or "help me" automatically sends your real GPS location to your guardian email & WhatsApp.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mic Listening Toggle & Simulation Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleToggleVoiceSos}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isVoiceListening
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                  : 'bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)]'
              }`}
            >
              {isVoiceListening ? <Mic className="w-4 h-4 text-white animate-bounce" /> : <MicOff className="w-4 h-4 text-[var(--text-secondary)]" />}
              <span>{isVoiceListening ? (language === 'hi' ? 'वॉइस एसओएस सक्रिय (सुन रहा है...)' : 'Voice SOS Active (Listening...)') : (language === 'hi' ? 'वॉइस एसओएस चालू करें' : 'Enable Voice SOS')}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateVoiceKeyword}
              disabled={isSimulatingAlert}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Test keyword alert without speaking"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSimulatingAlert ? '...' : (language === 'hi' ? 'टेस्ट कीवर्ड अलर्ट' : 'Simulate Keyword')}</span>
            </button>
          </div>
        </div>

        {/* Non-blocking Browser Microphone Permission Guidance Card */}
        {micPermissionError && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'माइक्रोफ़ोन अनुमति आवश्यक है'
                    : 'Microphone Permission Needed for Voice SOS'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMicPermissionError(null)}
                className="text-xs text-[var(--text-secondary)] hover:text-amber-700 cursor-pointer font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === 'hi'
                ? 'ब्राउज़र एड्रेस बार में 🔒 लॉक या सेटिंग्स आइकन पर क्लिक करें, माइक्रोफ़ोन को "Allow" (अनुमति दें) करें, और पुनः प्रयास करें। अथवा सीधे नीचे दिए गए टेस्ट बटन से कीवर्ड का परीक्षण करें:'
                : 'To listen for "I am in danger", please allow microphone access: Click the 🔒 Lock / tune icon in your browser address bar next to "localhost:5174", set Microphone to "Allow", then click Retry. You can also test the alert instantly below:'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleToggleVoiceSos}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Microphone'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateVoiceKeyword}
                disabled={isSimulatingAlert}
                className="px-3 py-1.5 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--accent-primary)] border border-[var(--glass-border)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बिना माइक के टेस्ट करें' : 'Test Without Microphone'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Real-time speech transcript feedback banner when listening */}
        {isVoiceListening && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              <span>
                <strong>{language === 'hi' ? 'माइक्रोफ़ोन सक्रिय है:' : 'Microphone Live:'}</strong>{' '}
                {liveTranscript ? `"${liveTranscript}"` : (language === 'hi' ? 'कीवर्ड की प्रतीक्षा है ("I am in danger")...' : 'Say "I am in danger", "danger", or "help me"...')}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-200">
              Continuous Guard
            </span>
          </div>
        )}

        {/* Active SOS Alert Dispatch Card (Shown when keyword triggered) */}
        {activeSosAlert && (
          <div className="p-4 rounded-xl bg-red-500/15 border-2 border-red-500/40 space-y-3 animate-in fade-in shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                <span>🚨 {language === 'hi' ? `कीवर्ड ट्रिगर हुआ: "${activeSosAlert.keywordTriggered}"` : `Distress Keyword Triggered: "${activeSosAlert.keywordTriggered}"`}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSosAlert(null)}
                className="text-xs text-[var(--text-secondary)] hover:text-red-600 cursor-pointer font-semibold"
              >
                ✕ {language === 'hi' ? 'बंद करें' : 'Dismiss'}
              </button>
            </div>

            {/* Auto-dispatch Status Banner */}
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {activeSosAlert.guardianPhone
                    ? (language === 'hi' ? `व्हाट्सएप संदेश स्वतः प्रेषित किया जा रहा है (+${formatWhatsAppPhoneNumber(activeSosAlert.guardianPhone)})` : `Auto-dispatching WhatsApp alert to +${formatWhatsAppPhoneNumber(activeSosAlert.guardianPhone)}...`)
                    : activeSosAlert.guardianEmail
                    ? (language === 'hi' ? `ईमेल अलर्ट स्वतः तैयार किया जा रहा है (${activeSosAlert.guardianEmail})` : `Auto-dispatching Email alert to ${activeSosAlert.guardianEmail}...`)
                    : (language === 'hi' ? 'कृपया नीचे दिए गए बटन से व्हाट्सएप या ईमेल भेजें' : 'Alert generated with live Google Maps coordinates')}
                </span>
              </div>
            </div>

            <div className="text-xs text-[var(--text-primary)] space-y-1 bg-[var(--card-bg)]/80 p-3 rounded-lg border border-[var(--glass-border)]">
              <div><strong>{language === 'hi' ? 'सटीक स्थान:' : 'Exact Location:'}</strong> {activeSosAlert.address}</div>
              <div className="font-mono text-[11px] text-[var(--text-secondary)]">Lat: {activeSosAlert.latitude.toFixed(5)}°, Lng: {activeSosAlert.longitude.toFixed(5)}°</div>
              <div className="text-[11px] text-blue-600 truncate">
                <strong>Google Maps:</strong> <a href={activeSosAlert.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="underline">{activeSosAlert.googleMapsUrl}</a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Primary Direct Gmail Compose Button */}
              <button
                type="button"
                onClick={() => openGmailSos(activeSosAlert, true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer animate-pulse"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? `Gmail खोलें (${activeSosAlert.guardianEmail || DEFAULT_GUARDIAN_EMAIL})`
                    : `Open Gmail (${activeSosAlert.guardianEmail || DEFAULT_GUARDIAN_EMAIL})`}
                </span>
              </button>

              {/* Siren Audio Deterrant Action */}
              <button
                type="button"
                onClick={() => {
                  if (isSirenActive) {
                    stopEmergencySiren();
                    setIsSirenActive(false);
                  } else {
                    playEmergencySiren();
                    setIsSirenActive(true);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer ${
                  isSirenActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                {isSirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>
                  {isSirenActive
                    ? (language === 'hi' ? 'सायरन बंद करें' : 'Stop Siren')
                    : (language === 'hi' ? 'सायरन बजाएं' : 'Sound Siren')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppSos(activeSosAlert, true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? `व्हाट्सएप चैट खोलें (+${formatWhatsAppPhoneNumber(activeSosAlert.guardianPhone) || 'व्हाट्सएप'})`
                    : `Open WhatsApp (+${formatWhatsAppPhoneNumber(activeSosAlert.guardianPhone) || 'WhatsApp'})`}
                </span>
              </button>

              <a
                href="tel:112"
                className="px-4 py-2.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>112 Police</span>
              </a>
            </div>
          </div>
        )}

        {/* Guardian Setup Form with Keystroke Auto-Save */}
        <form onSubmit={handleSaveGuardianContacts} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{language === 'hi' ? 'अभिभावक ईमेल (Guardian Email)' : 'Guardian Alert Email'}</span>
            </label>
            <input
              type="email"
              value={guardianSettings.guardianEmail}
              onChange={(e) => {
                const val = e.target.value;
                setGuardianSettings(prev => {
                  const updated = { ...prev, guardianEmail: val };
                  saveGuardianSettings(updated);
                  return updated;
                });
              }}
              placeholder="edufututra01.mayank@gmail.com"
              className="w-full px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'व्हाट्सएप फोन नंबर (+91...)' : 'Guardian WhatsApp (+91...)'}</span>
            </label>
            <input
              type="tel"
              value={guardianSettings.guardianPhone}
              onChange={(e) => {
                const val = e.target.value;
                setGuardianSettings(prev => {
                  const updated = { ...prev, guardianPhone: val };
                  saveGuardianSettings(updated);
                  return updated;
                });
              }}
              placeholder="+91 9876543210 (or 10 digits)"
              className="w-full px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
            />
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <span>{language === 'hi' ? 'आपका नाम (User Name)' : 'Your Name'}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={guardianSettings.userName}
                onChange={(e) => {
                  const val = e.target.value;
                  setGuardianSettings(prev => {
                    const updated = { ...prev, userName: val };
                    saveGuardianSettings(updated);
                    return updated;
                  });
                }}
                placeholder="Priya"
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--accent-primary)] border border-[var(--glass-border)] hover:border-[var(--accent-primary)] text-xs font-semibold transition-all cursor-pointer flex-shrink-0 shadow-2xs flex items-center gap-1"
              >
                {isSettingsSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{isSettingsSaved ? (language === 'hi' ? 'सहेजा गया' : 'Saved') : (language === 'hi' ? 'सेव करें' : 'Save')}</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Main Dual Operation Tabs: Share vs Access Location */}
      <section className="editorial-card rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-sm">
        {/* Navigation Switcher */}
        <div className="flex border-b border-[var(--glass-border)] bg-[var(--bg-secondary)]/30 p-2 gap-2">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'share'
                ? 'bg-[var(--card-bg)] text-[var(--accent-primary)] shadow-xs border border-[var(--glass-border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'hi' ? '१. लोकेशन साझा करें (Share Location)' : '1. Share Location by Code'}</span>
            {isShareActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'access'
                ? 'bg-[var(--card-bg)] text-[var(--accent-primary)] shadow-xs border border-[var(--glass-border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{language === 'hi' ? '२. लोकेशन एक्सेस व ट्रैक करें (Access Location)' : '2. Access & Track Location'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 md:p-7 space-y-5">
          {/* TAB 1: SHARE LOCATION */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Active Broadcast Badge if already sharing */}
              {isShareActive && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                        {language === 'hi' ? 'लाइव लोकेशन ब्रॉडकास्ट सक्रिय है' : 'Live Location Broadcast Active on Server'}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        {language === 'hi' ? `सुरक्षा एक्सेस कोड: ${shareCode}` : `Safety Tracking Code: ${shareCode}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleStopSharing}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    {language === 'hi' ? 'शेयरिंग समाप्त करें' : 'Stop Sharing'}
                  </button>
                </div>
              )}

              {/* Step 1: Live Detected Location */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'आपकी वर्तमान लोकेशन (कानपुर)' : 'Your Live Location (Kanpur)'}
                  </span>
                  <div className="flex items-center gap-3">
                    {gpsCoords && (
                      <button
                        type="button"
                        onClick={() => handleOpenInGoogleMaps(gpsCoords.latitude, gpsCoords.longitude)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        title="Open your location in Google Maps"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Maps</span>
                      </button>
                    )}
                    <button
                      onClick={detectCurrentLocation}
                      disabled={isLocating}
                      className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
                      <span>{language === 'hi' ? 'पुनः जांचें' : 'Recalibrate'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  {approxAddress || (language === 'hi' ? 'कानपुर लोकेशन लोड हो रही है...' : 'Civil Lines & Kanpur Central, Kanpur, Uttar Pradesh')}
                </div>

                {gpsCoords && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] font-mono pt-0.5">
                    <span>Lat: {gpsCoords.latitude.toFixed(5)}°</span>
                    <span>Lng: {gpsCoords.longitude.toFixed(5)}°</span>
                    {gpsCoords.accuracy && <span>±{gpsCoords.accuracy}m accuracy</span>}
                    {deviceBattery !== undefined && (
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-sans font-semibold">
                        <BatteryCharging className="w-3.5 h-3.5" /> {deviceBattery}%
                      </span>
                    )}
                  </div>
                )}

                {/* Banner if Broadband IP Gateway resolves outside UP (e.g. Shimla) */}
                {isOutsideUPOrISP && (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 animate-bounce" />
                      <div className="leading-snug">
                        <strong>{language === 'hi' ? 'ब्रॉडबैंड वाई-फाई गेटवे बाईपास' : 'Broadband Wi-Fi Gateway Bypassed'}</strong>
                        <p className="text-[11px] text-amber-800 dark:text-amber-300">
                          {language === 'hi'
                            ? 'आपके डेस्कटॉप वाई-फाई की शिमला नोड को बाईपास कर आपकी वास्तविक लोकेशन कानपुर सेट कर दी गई है।'
                            : 'Bypassed Shimla broadband gateway and set your real location to Kanpur Central & Civil Lines.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectCityPreset(UP_QUICK_LOCATIONS[0], 0)}
                      className="px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto flex-shrink-0 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{language === 'hi' ? 'कानपुर रीसेट करें' : 'Confirm Kanpur'}</span>
                    </button>
                  </div>
                )}

                {/* Real-time Locality & Landmark Search for Kanpur & UP */}
                <div className="pt-2 border-t border-[var(--glass-border)] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3 h-3 text-[var(--accent-primary)]" />
                      {language === 'hi' ? 'सटीक इलाका / कॉलोनी खोजें (Google / OSM Geocoding):' : 'Search Exact Kanpur Locality / Landmark:'}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Google Maps Linked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchPlace();
                        }
                      }}
                      placeholder={language === 'hi' ? 'उदा. स्वरूप नगर, Z Square Mall, किदवई नगर, काकादेव, IIT कानपुर...' : 'e.g. Swaroop Nagar, Z Square Mall, Kidwai Nagar, Kakadeo, IIT Kanpur...'}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleSearchPlace}
                      disabled={isSearchingPlace || !placeQuery.trim()}
                      className="px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:opacity-95 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                    >
                      <Search className={`w-3.5 h-3.5 ${isSearchingPlace ? 'animate-spin' : ''}`} />
                      <span>{isSearchingPlace ? '...' : (language === 'hi' ? 'खोजें' : 'Locate')}</span>
                    </button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1.5 p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs shadow-xs">
                      <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase">
                        {language === 'hi' ? 'खोज परिणाम (पिन लगाने हेतु क्लिक करें):' : 'Matching Places (Click to set location):'}
                      </span>
                      {searchResults.map((res, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            handleSetManualCoordinates(res.latitude, res.longitude);
                            setSearchResults([]);
                          }}
                          className="text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 text-[var(--text-primary)] text-xs truncate cursor-pointer transition-colors"
                        >
                          📍 {res.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick 1-Tap Kanpur & UP Hotspot Selectors */}
                <div className="pt-2 border-t border-[var(--glass-border)] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
                    <span>{language === 'hi' ? 'कानपुर व उत्तर प्रदेश प्रमुख स्थल (1-टैप पिन):' : 'Kanpur & UP Hotspots (1-Tap Selection):'}</span>
                    <span className="text-[10px] text-[var(--accent-primary)] font-mono">
                      {gpsSource === 'browser_gps' ? '● Browser GPS' : '● Verified Location'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {UP_QUICK_LOCATIONS.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCityPreset(loc, idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedCityIndex === idx && gpsSource === 'city_preset'
                            ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-xs'
                            : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 border-[var(--glass-border)]'
                        }`}
                      >
                        <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                        <span>{loc.name[language]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Leaflet Map for Sharer: Sharer can see their EXACT broadcasted location */}
                {gpsCoords && (
                  <div className="space-y-1.5 mt-2">
                    <div className="safety-radar-map-wrapper relative h-56 sm:h-64 w-full rounded-xl overflow-hidden border border-[var(--glass-border)] shadow-xs">
                      <MapContainer
                        key={`share-${gpsCoords.latitude}-${gpsCoords.longitude}`}
                        center={[gpsCoords.latitude, gpsCoords.longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="w-full h-full"
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onLocationSelect={handleSetManualCoordinates} />
                        <Marker
                          draggable={true}
                          eventHandlers={{
                            dragend(e: any) {
                              const pos = e.target.getLatLng();
                              handleSetManualCoordinates(pos.lat, pos.lng);
                            }
                          }}
                          position={[gpsCoords.latitude, gpsCoords.longitude]}
                          icon={beaconIcon}
                        >
                          <Popup>
                            <div className="text-xs text-stone-900 font-sans p-1">
                              <strong>{personName || (language === 'hi' ? 'आपकी लाइव लोकेशन' : 'Your Live Location')}</strong>
                              <div className="text-[11px] text-stone-600 mt-0.5">{approxAddress}</div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-1">📍 Click map or drag beacon pin to move</div>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                      <div className="absolute top-3 left-3 z-10">
                        <button
                          type="button"
                          onClick={() => handleOpenInGoogleMaps(gpsCoords.latitude, gpsCoords.longitude)}
                          className="px-2.5 py-1 rounded-lg text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer bg-white/95 dark:bg-stone-900/95 border border-[var(--glass-border)] transition-colors"
                          title="Open this location in Google Maps"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                          <span>Google Maps</span>
                        </button>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-lg glass text-[var(--accent-primary)] text-xs font-semibold shadow-xs flex items-center gap-1.5">
                          <Radio className="w-3 h-3 animate-pulse text-red-500" />
                          <span>{language === 'hi' ? 'लाइव ब्रॉडकास्ट सक्रिय' : 'Broadcasting This Location'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5 px-1">
                      <Info className="w-3.5 h-3.5 text-[var(--accent-primary)] flex-shrink-0" />
                      <span>{language === 'hi' ? 'सुझाव: मानचित्र पर कहीं भी क्लिक करें या लाल पिन को खींचकर अपनी सटीक सड़क/कॉलोनी (कानपुर) पर सेट करें।' : 'Tip: Click anywhere on the map or drag the beacon marker to place your exact street/colony in Kanpur.'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Custom Safety Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {language === 'hi' ? 'सुरक्षा एक्सेस कोड दर्ज करें (उदा. 77645)' : 'Enter or Generate Safety Access Code (e.g. 77645)'}
                  </span>
                  <button
                    onClick={handleGenerateNewCode}
                    className="text-[11px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>🎲</span>
                    <span>{language === 'hi' ? 'नया कोड बनाएं' : 'Generate Random Code'}</span>
                  </button>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                    placeholder="77645"
                    maxLength={10}
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xl font-mono font-bold tracking-widest text-center text-[var(--accent-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="p-3 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer shadow-2xs"
                    title="Copy Code"
                  >
                    {copiedShareCode ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {language === 'hi'
                    ? 'यही कोड अपने अभिभावक या परिजन को दें। वे "लोकेशन एक्सेस करें" टैब में यह कोड डालकर आपकी लोकेशन तुरंत देख सकेंगे।'
                    : 'Share this exact code with your family member so they can access and track your live location from the server.'}
                </p>
              </div>

              {/* Step 3: Traveler Note & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    {language === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. प्रिया' : 'e.g. Priya'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    {language === 'hi' ? 'आपातकालीन नोट / वाहन संख्या' : 'Safety Note / Vehicle No.'}
                  </label>
                  <input
                    type="text"
                    value={travelNote}
                    onChange={(e) => setTravelNote(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. ऑटो संख्या UP-65-T-1234' : 'e.g. In auto UP-65-T-1234 towards station'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons: Save & Share */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  onClick={handleSaveAndShareLocation}
                  disabled={isSaving}
                  className="flex-1 py-3 px-5 rounded-xl bg-[var(--accent-primary)] hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Radio className={`w-4 h-4 ${isSaving ? 'animate-spin' : 'animate-pulse'}`} />
                  <span>
                    {isSaving
                      ? (language === 'hi' ? 'सर्वर पर सेव हो रहा है...' : 'Saving to Server...')
                      : (language === 'hi' ? 'सर्वर पर सेव करें व ब्रॉडकास्ट सक्रिय करें' : 'Save on Server & Start Live Broadcast')}
                  </span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'WhatsApp Share'}</span>
                </button>
              </div>

              {/* Google Location Real-Time Actions */}
              {gpsCoords && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenInGoogleMaps(gpsCoords.latitude, gpsCoords.longitude)}
                    className="py-2.5 px-4 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] hover:border-blue-500/50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'hi' ? 'Google Maps पर लाइव लोकेशन खोलें' : 'Open in Google Maps'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyGoogleMapsLink(gpsCoords.latitude, gpsCoords.longitude)}
                    className="py-2.5 px-4 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] hover:border-blue-500/50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                  >
                    {copiedGoogleMapLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                    <span>{copiedGoogleMapLink ? (language === 'hi' ? 'Google Maps लिंक कॉपी हुआ!' : 'Google Maps Link Copied!') : (language === 'hi' ? 'Google Maps लिंक कॉपी करें' : 'Copy Google Maps Link')}</span>
                  </button>
                </div>
              )}

              {/* Shareable Direct Portal Link */}
              {shareCode && (
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] flex items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--text-secondary)] truncate font-mono">
                    {getShareableUrl(shareCode)}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--accent-primary)] font-semibold border border-[var(--glass-border)] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-2xs"
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShareLink ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACCESS LOCATION */}
          {activeTab === 'access' && (
            <div className="space-y-4">
              {/* Access Code Input */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] space-y-3">
                <label className="text-xs font-bold text-[var(--text-primary)] block">
                  {language === 'hi'
                    ? 'यात्री अथवा परिवार के सदस्य द्वारा साझा किया गया सुरक्षा कोड दर्ज करें:'
                    : 'Enter the 5-digit safety code shared by your family member or traveler:'}
                </label>

                {/* Quick Test Beacon Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                    {language === 'hi' ? 'सक्रिय टेस्ट कोड (1-क्लिक एक्सेस):' : 'Active Safe Beacons (1-Click Access):'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { code: '77645', label: '77645 • Priya (Kanpur Central)' },
                      { code: '1090', label: '1090 • Ananya (Ayodhya)' },
                      { code: '12345', label: '12345 • Sunita (Lucknow)' },
                      { code: '99999', label: '99999 • Kavita (Prayagraj)' },
                    ].map(item => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setAccessCodeInput(item.code);
                          handleAccessLocation(item.code);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--card-bg)] hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--glass-border)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                    {shareCode && shareCode !== '77645' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAccessCodeInput(shareCode);
                          handleAccessLocation(shareCode);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{language === 'hi' ? `मेरा कोड: ${shareCode}` : `My Active Code: ${shareCode}`}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={accessCodeInput}
                      onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAccessLocation();
                        }
                      }}
                      placeholder={language === 'hi' ? 'उदा. 77645' : 'e.g. 77645'}
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--glass-border)] font-mono text-base font-bold text-[var(--accent-primary)] tracking-widest focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                    />
                  </div>

                  <button
                    onClick={() => handleAccessLocation()}
                    disabled={isAccessLoading}
                    className="px-6 py-3 rounded-xl bg-[var(--accent-primary)] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Search className={`w-4 h-4 ${isAccessLoading ? 'animate-spin' : ''}`} />
                    <span>{language === 'hi' ? 'लोकेशन ट्रैक करें' : 'Access Location'}</span>
                  </button>
                </div>

                {accessError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{accessError}</span>
                  </div>
                )}
              </div>

              {/* Tracked Location Display & Leaflet Map */}
              {trackedLocation && (
                <div className="space-y-4">
                  {/* Location Info Header */}
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        {language === 'hi' ? 'सक्रिय लाइव ट्रैकिंग' : 'LIVE TRACKING ACTIVE'}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowMapPreview(prev => !prev)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Toggle Map Display"
                        >
                          <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          <span>{showMapPreview ? (language === 'hi' ? 'मानचित्र छुपाएं' : 'Hide Map') : (language === 'hi' ? 'मानचित्र देखें' : 'Show Map')}</span>
                        </button>
                        <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lastTrackedTimeAgo}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-[var(--text-primary)] font-editorial">
                      {trackedLocation.personName ? `${trackedLocation.personName} • ` : ''}
                      {trackedLocation.address || 'Live Location in Uttar Pradesh'}
                    </h4>

                    {trackedLocation.note && (
                      <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl font-medium">
                        📝 <strong>{language === 'hi' ? 'यात्री नोट:' : 'Note:'}</strong> {trackedLocation.note}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-mono pt-1">
                      <span>Lat: {safeLat.toFixed(5)}°</span>
                      <span>Lng: {safeLng.toFixed(5)}°</span>
                      {trackedLocation.batteryLevel !== undefined && (
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-sans font-semibold">
                          <BatteryCharging className="w-3.5 h-3.5" /> {trackedLocation.batteryLevel}% battery
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Leaflet Map Preview with Stacking Context Isolation */}
                  {showMapPreview && (
                    <div className="safety-radar-map-wrapper relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[var(--glass-border)] shadow-xs">
                      <MapContainer
                        key={`${safeLat}-${safeLng}`}
                        center={[safeLat, safeLng]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="w-full h-full"
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[safeLat, safeLng]}
                          icon={beaconIcon}
                        >
                          <Popup>
                            <div className="text-xs text-stone-900 font-sans p-1">
                              <strong>{trackedLocation.personName || 'Traveler Location'}</strong>
                              <div className="text-[11px] text-stone-600 mt-0.5">{trackedLocation.address}</div>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>

                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenInGoogleMaps(safeLat, safeLng)}
                          className="px-2.5 py-1 rounded-lg text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer bg-white/95 dark:bg-stone-900/95 border border-[var(--glass-border)] transition-colors"
                          title="Open this location in Google Maps"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                          <span>Google Maps</span>
                        </button>
                      </div>

                      <div className="absolute top-3 right-3 z-10 flex gap-2">
                        <span className="px-3 py-1.5 rounded-lg glass text-[var(--accent-primary)] text-xs font-semibold shadow-xs flex items-center gap-1.5">
                          <Radio className="w-3 h-3 animate-pulse text-red-500" />
                          <span>{language === 'hi' ? 'लाइव सुरक्षा रडार' : 'Live Safety Radar'}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Quick Bar: Google Maps Live Tracking, Turn-by-Turn Directions, Darshan 360 Map, and 112 Emergency */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenInGoogleMaps(safeLat, safeLng)}
                      className="py-2.5 px-3 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--glass-border)] hover:border-blue-500/50 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>{language === 'hi' ? 'Google Maps पर देखें' : 'View on Google Maps'}</span>
                    </button>

                    <a
                      href={getGoogleMapsDirectionsUrl(safeLat, safeLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'Google Maps नेविगेशन' : 'Google Maps Directions'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={onOpenMap}
                      className="py-2.5 px-3 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--glass-border)] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>{language === 'hi' ? 'दर्शन 360 मुख्य मैप' : 'Darshan 360 Map'}</span>
                    </button>

                    <a
                      href="tel:112"
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? '112 पुलिस कॉल' : 'Call 112 Police'}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Official 24x7 Pink Booths & Safe Corridors Directory */}
      <section className="editorial-card rounded-2xl p-5 md:p-6 border border-[var(--glass-border)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {language === 'hi' ? 'उत्तर प्रदेश तीर्थ स्थलों पर 24x7 पिंक बूथ व महिला सहायता केंद्र' : '24x7 Women Police Helpdesks & Safe Corridors'}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {language === 'hi' ? 'तीर्थ एवं मुख्य पर्यटन शहर' : 'Major Pilgrimage Centers'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {UP_SAFE_CORRIDORS.map((corridor, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] space-y-1.5 hover:border-[var(--accent-primary)]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {corridor.city[language]}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                  SOS {corridor.phone}
                </span>
              </div>
              <div className="text-xs font-semibold text-[var(--accent-primary)]">
                {corridor.hub[language]}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {corridor.facilities[language]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Guideline & Helplines Footer */}
      <footer className="editorial-card rounded-2xl p-5 md:p-6 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'सुरक्षा एवं गोपनीयता परामर्श' : 'Security & Privacy Notice'}</span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'आपका सुरक्षा कोड पूर्णतः निजी है। इसे केवल अपने विश्वसनीय परिजनों अथवा आपातकालीन सहायता प्रतिनिधियों के साथ ही साझा करें। किसी भी संकटकालीन स्थिति में तुरंत 1090 (वीमेन पावर लाइन) अथवा 112 (आपातकालीन पुलिस) पर कॉल करें।'
            : 'Your safety code is private and temporary. Only share with verified family members or guardians. In case of immediate physical distress, dial 1090 (Women Power Line) or 112 (Police) without delay.'}
        </p>
      </footer>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  language: 'en' | 'hi';
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class WomenSafetyErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unexpected safety render issue' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WomenSafetyErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isHi = this.props.language === 'hi';
      return (
        <div className="w-full h-full overflow-y-auto p-6 md:p-10 flex items-center justify-center">
          <div className="editorial-card max-w-lg w-full p-6 md:p-8 rounded-3xl border border-[var(--glass-border)] text-center space-y-5 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)] font-editorial">
                {isHi ? 'महिला सुरक्षा पोर्टल - त्वरित संपर्क' : 'Women Safety Cell - Instant Access'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isHi
                  ? 'सुरक्षा पोर्टल लोड करने में रुकावट आई। किसी भी सहायता के लिए नीचे दिए गए सीधे आपातकालीन नंबर पर कॉल करें:'
                  : 'An error occurred while rendering the safety module. For any urgent help, dial the direct hotlines below:'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="tel:1090"
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>1090 (SOS)</span>
              </a>
              <a
                href="tel:112"
                className="py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>112 (Police)</span>
              </a>
            </div>

            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--glass-border)] text-[var(--text-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHi ? 'पुनः प्रयास करें' : 'Try Again'}</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function WomenSafetyPanel(props: WomenSafetyPanelProps) {
  return (
    <WomenSafetyErrorBoundary language={props.language}>
      <WomenSafetyPanelContent {...props} />
    </WomenSafetyErrorBoundary>
  );
}

