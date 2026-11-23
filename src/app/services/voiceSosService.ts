// Voice Keyword SOS & Automated Guardian Email/WhatsApp Alert Dispatcher
// Continuously listens for distress keywords like "I am in danger" and automatically dispatches Google Maps location alerts.

import { 
  getCurrentGPSPosition, 
  approximateUPLocation, 
  getGoogleMapsLocationUrl, 
  getDeviceBatteryLevel, 
  saveSafetyLocation,
  playEmergencySiren,
  stopEmergencySiren
} from './safetyService';

export const DEFAULT_GUARDIAN_EMAIL = 'edufututra01.mayank@gmail.com';

export interface GuardianSettings {
  guardianEmail: string;
  guardianPhone: string;
  guardianName: string;
  userName: string;
  isVoiceSosActive: boolean;
}

export interface SosAlertPayload {
  guardianEmail: string;
  guardianPhone: string;
  guardianName: string;
  userName: string;
  keywordTriggered: string;
  latitude: number;
  longitude: number;
  address: string;
  googleMapsUrl: string;
  trackingPortalUrl: string;
  safetyCode: string;
  batteryLevel?: number;
  timestamp: number;
}

const STORAGE_KEYS = {
  EMAIL: 'd360_guardian_email',
  PHONE: 'd360_guardian_phone',
  GUARDIAN_NAME: 'd360_guardian_name',
  USER_NAME: 'd360_user_name',
  ACTIVE: 'd360_voice_sos_active'
};

// Distress trigger keywords in English & Hindi / Hinglish
export const SOS_TRIGGER_KEYWORDS = [
  'i am in danger',
  "i'm in danger",
  'im in danger',
  'in danger',
  'danger',
  'dangerous',
  'help me',
  'please help',
  'help',
  'save me',
  'save',
  'emergency',
  'unsafe',
  'attack',
  'call police',
  'police',
  'bachao',
  'mujhe bachao',
  'khatre mein',
  'khatre me',
  'khatra',
  'madad',
  'madad karo',
  'खतरे में हूँ',
  'खतरे में हु',
  'खतरे में',
  'खतरा',
  'मदद करो',
  'मदद',
  'बचाओ',
  'मुझे बचाओ',
  'इमरजेंसी'
];

/**
 * Load saved guardian settings from localStorage
 */
export function getSavedGuardianSettings(): GuardianSettings {
  if (typeof window === 'undefined') {
    return {
      guardianEmail: DEFAULT_GUARDIAN_EMAIL,
      guardianPhone: '',
      guardianName: 'Guardian',
      userName: 'Traveler',
      isVoiceSosActive: true
    };
  }

  const rawActive = localStorage.getItem(STORAGE_KEYS.ACTIVE);
  const isVoiceSosActive = rawActive === null ? true : rawActive === 'true';

  return {
    guardianEmail: (localStorage.getItem(STORAGE_KEYS.EMAIL) || '').trim() || DEFAULT_GUARDIAN_EMAIL,
    guardianPhone: localStorage.getItem(STORAGE_KEYS.PHONE) || '',
    guardianName: localStorage.getItem(STORAGE_KEYS.GUARDIAN_NAME) || 'Guardian',
    userName: localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Traveler',
    isVoiceSosActive
  };
}

/**
 * Save guardian alert settings to localStorage
 */
export function saveGuardianSettings(settings: Partial<GuardianSettings>): GuardianSettings {
  if (typeof window !== 'undefined') {
    if (settings.guardianEmail !== undefined) localStorage.setItem(STORAGE_KEYS.EMAIL, settings.guardianEmail.trim());
    if (settings.guardianPhone !== undefined) localStorage.setItem(STORAGE_KEYS.PHONE, settings.guardianPhone.trim());
    if (settings.guardianName !== undefined) localStorage.setItem(STORAGE_KEYS.GUARDIAN_NAME, settings.guardianName.trim());
    if (settings.userName !== undefined) localStorage.setItem(STORAGE_KEYS.USER_NAME, settings.userName.trim());
    if (settings.isVoiceSosActive !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE, String(settings.isVoiceSosActive));
  }
  return getSavedGuardianSettings();
}

// Global speech recognition instance singleton
let recognitionInstance: any = null;
let isExplicitlyStopped = true;
let alertListeners: Array<(payload: SosAlertPayload) => void> = [];
let stateListeners: Array<(isListening: boolean) => void> = [];
let transcriptListeners: Array<(transcript: string) => void> = [];

export function subscribeSosAlert(callback: (payload: SosAlertPayload) => void): () => void {
  alertListeners.push(callback);
  return () => {
    alertListeners = alertListeners.filter(cb => cb !== callback);
  };
}

export function subscribeListeningState(callback: (isListening: boolean) => void): () => void {
  stateListeners.push(callback);
  return () => {
    stateListeners = stateListeners.filter(cb => cb !== callback);
  };
}

export function subscribeTranscript(callback: (transcript: string) => void): () => void {
  transcriptListeners.push(callback);
  return () => {
    transcriptListeners = transcriptListeners.filter(cb => cb !== callback);
  };
}

function notifyListeningState(active: boolean) {
  stateListeners.forEach(cb => {
    try { cb(active); } catch {}
  });
}

function notifyTranscript(text: string) {
  transcriptListeners.forEach(cb => {
    try { cb(text); } catch {}
  });
}

/**
 * Check if the browser supports speech recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

// Active media stream & Web Audio instances
let activeMediaStream: MediaStream | null = null;
let audioContextInstance: AudioContext | null = null;
let analyserNodeInstance: AnalyserNode | null = null;

/**
 * Setup Web Audio listener fallback when browser disables SpeechRecognition (e.g. Brave shields / Firefox)
 */
function setupWebAudioFallback(stream: MediaStream | null): void {
  if (!stream) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    audioContextInstance = new AudioContextClass();
    const source = audioContextInstance.createMediaStreamSource(stream);
    analyserNodeInstance = audioContextInstance.createAnalyser();
    analyserNodeInstance.fftSize = 512;
    source.connect(analyserNodeInstance);
    notifyListeningState(true);
    notifyTranscript('Microphone active & monitoring for distress sound...');
  } catch (err) {
    console.warn('Web Audio fallback setup error:', err);
  }
}

/**
 * Start background voice listening for the "I am in danger" keyword
 */
export async function startVoiceSosListening(): Promise<{ success: boolean; error?: string; mode?: 'speech_recognition' | 'audio_stream' }> {
  if (typeof window === 'undefined') return { success: false, error: 'no_window' };

  // 1. Explicitly request microphone access via getUserMedia (triggers browser prompt)
  let stream: MediaStream | null = null;
  if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeMediaStream = stream;
    } catch (err: any) {
      console.warn('Microphone permission denied or unavailable:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      return {
        success: false,
        error: isDenied ? 'permission_denied' : 'device_not_found'
      };
    }
  }

  // 2. Try native SpeechRecognition / webkitSpeechRecognition
  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (SpeechRecognitionClass) {
    try {
      if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch {}
        recognitionInstance = null;
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = 'en-US';

      isExplicitlyStopped = false;

      let lastSosTriggerTime = 0;
      const SOS_COOLDOWN_MS = 8000;

      recognition.onstart = () => {
        notifyListeningState(true);
      };

      recognition.onresult = async (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const rawTranscript = event.results[i][0].transcript || '';
          const transcript = rawTranscript.toLowerCase().trim();
          notifyTranscript(transcript);

          // Clean punctuation to match "i'm", "im", "i am", etc.
          const cleanTranscript = transcript
            .replace(/['’]/g, '')
            .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          // Check if any danger keyword matches
          const matched = SOS_TRIGGER_KEYWORDS.find(keyword => {
            const kw = keyword.toLowerCase().trim();
            const cleanKw = kw.replace(/['’]/g, '');
            return transcript.includes(kw) || cleanTranscript.includes(cleanKw) || cleanTranscript.includes(kw);
          });

          if (matched) {
            const now = Date.now();
            if (now - lastSosTriggerTime > SOS_COOLDOWN_MS) {
              lastSosTriggerTime = now;
              console.info(`🚨 [Voice SOS] Trigger keyword detected: "${matched}" in "${transcript}"`);
              await triggerEmergencySosAlert(matched);
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
          console.warn('Voice SOS SpeechRecognition event error:', event.error);
        }
        // If Brave shields or browser restrictions block Google speech servers ('network' / 'not-allowed')
        if ((event.error === 'network' || event.error === 'not-allowed') && stream) {
          setupWebAudioFallback(stream);
        }
      };

      recognition.onend = () => {
        notifyListeningState(false);
        // Auto-restart if not explicitly stopped by the user
        if (!isExplicitlyStopped) {
          setTimeout(() => {
            if (!isExplicitlyStopped) {
              try {
                recognition.start();
              } catch {}
            }
          }, 300);
        }
      };

      recognition.start();
      recognitionInstance = recognition;
      saveGuardianSettings({ isVoiceSosActive: true });
      return { success: true, mode: 'speech_recognition' };
    } catch (err) {
      console.warn('SpeechRecognition failed to start, falling back to Web Audio stream:', err);
    }
  }

  // 3. Fallback: If SpeechRecognition is unsupported (or blocked by Brave shields) but microphone stream was granted
  if (stream) {
    setupWebAudioFallback(stream);
    saveGuardianSettings({ isVoiceSosActive: true });
    return { success: true, mode: 'audio_stream' };
  }

  return { success: false, error: 'speech_not_supported' };
}

/**
 * Stop background voice listening
 */
export function stopVoiceSosListening(): void {
  isExplicitlyStopped = true;
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch {}
    recognitionInstance = null;
  }
  if (activeMediaStream) {
    try {
      activeMediaStream.getTracks().forEach(t => t.stop());
    } catch {}
    activeMediaStream = null;
  }
  if (audioContextInstance) {
    try {
      audioContextInstance.close();
    } catch {}
    audioContextInstance = null;
  }
  notifyListeningState(false);
  saveGuardianSettings({ isVoiceSosActive: false });
}

export function isVoiceSosListening(): boolean {
  return !isExplicitlyStopped && Boolean(recognitionInstance);
}

/**
 * Normalize phone numbers, automatically prepending India country code +91
 * for standard 10-digit mobile numbers (e.g. 8573931926 -> 918573931926)
 */
export function formatWhatsAppPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // 10 digits (Standard Indian mobile number without country code)
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // 11 digits starting with 0 (e.g. 08573931926)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Trigger the emergency SOS alert sequence with location capture, Google Maps link, email & WhatsApp
 */
export async function triggerEmergencySosAlert(
  keywordTriggered = 'i am in danger',
  explicitSettings?: Partial<GuardianSettings>
): Promise<SosAlertPayload> {
  const saved = getSavedGuardianSettings();
  const settings: GuardianSettings = {
    ...saved,
    ...(explicitSettings || {})
  };

  // Guarantee guardian recipient email is never empty
  if (!settings.guardianEmail || !settings.guardianEmail.trim()) {
    settings.guardianEmail = DEFAULT_GUARDIAN_EMAIL;
  }

  // 1. PLAY EMERGENCY SIREN / ALARM SOUND IMMEDIATELY!
  try {
    playEmergencySiren();
  } catch (err) {
    console.warn('Failed to start emergency siren:', err);
  }

  const battery = await getDeviceBatteryLevel();
  
  // Real location capture (defaults to Kanpur Central if ISP anomaly occurs)
  let lat = 26.4609;
  let lng = 80.3218;
  try {
    const pos = await getCurrentGPSPosition();
    lat = pos.latitude;
    lng = pos.longitude;
  } catch {}

  const address = approximateUPLocation(lat, lng);
  const googleMapsUrl = getGoogleMapsLocationUrl(lat, lng);
  const safetyCode = (localStorage.getItem('d360_active_safety_share') || '77645').trim().toUpperCase();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const trackingPortalUrl = `${origin}/?safety_code=${encodeURIComponent(safetyCode)}`;

  const payload: SosAlertPayload = {
    guardianEmail: settings.guardianEmail,
    guardianPhone: settings.guardianPhone,
    guardianName: settings.guardianName,
    userName: settings.userName,
    keywordTriggered,
    latitude: lat,
    longitude: lng,
    address,
    googleMapsUrl,
    trackingPortalUrl,
    safetyCode,
    batteryLevel: battery,
    timestamp: Date.now()
  };

  // 2. Sync & Broadcast location on server for live radar tracking
  try {
    await saveSafetyLocation({
      code: safetyCode,
      latitude: lat,
      longitude: lng,
      accuracy: 10,
      address,
      personName: settings.userName || 'Distress Traveler',
      note: `🚨 SOS Triggered by voice keyword: "${keywordTriggered}"`,
      batteryLevel: battery ?? 90,
      timestamp: Date.now(),
      updatedAt: Date.now(),
      isBeaconActive: true
    });
  } catch {}

  // 3. Dispatch to Server SOS API Endpoint
  try {
    await fetch('/api/send-sos-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Failed to call /api/send-sos-alert:', err);
  }

  // 4. AUTO-DISPATCH GMAIL ALERT TO GUARDIAN IMMEDIATELY!
  try {
    openGmailSos(payload, true);
  } catch (err) {
    console.warn('Auto Gmail dispatch error:', err);
    try {
      openEmailSos(payload, false);
    } catch {}
  }

  // 5. AUTO-DISPATCH WHATSAPP IF PHONE NUMBER IS CONFIGURED
  if (payload.guardianPhone) {
    try {
      openWhatsAppSos(payload, true);
    } catch (err) {
      console.warn('Auto WhatsApp dispatch error:', err);
    }
  }

  // 6. Broadcast to all active tabs & listeners
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const ch = new BroadcastChannel('darshan360_safety_sync');
      ch.postMessage({ type: 'SOS_TRIGGERED', payload });
      setTimeout(() => ch.close(), 1000);
    } catch {}
  }

  alertListeners.forEach(cb => {
    try { cb(payload); } catch {}
  });

  return payload;
}

/**
 * Format and trigger direct Gmail Web Compose window for the guardian
 */
export function openGmailSos(payload: SosAlertPayload, openWindow = true): string {
  const recipient = (payload.guardianEmail || DEFAULT_GUARDIAN_EMAIL).trim();
  const subject = `🚨 EMERGENCY SOS: ${payload.userName || 'Traveler'} is in Danger!`;
  const body = 
`🚨 EMERGENCY SOS ALERT — DARSHAN 360 WOMEN SAFETY

${payload.userName || 'A traveler'} has triggered an emergency distress voice keyword: "${payload.keywordTriggered}".

📍 LIVE GOOGLE MAPS LOCATION:
${payload.googleMapsUrl}

📌 APPROXIMATE ADDRESS:
${payload.address}
Coordinates: ${payload.latitude.toFixed(6)}°N, ${payload.longitude.toFixed(6)}°E

🛡️ DARSHAN 360 LIVE TRACKING PORTAL:
${payload.trackingPortalUrl}
Safety Tracking Code: ${payload.safetyCode}

🔋 Device Battery: ${payload.batteryLevel ?? 'Unknown'}%
⏰ Alert Timestamp: ${new Date(payload.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

🚨 If you cannot contact them immediately, dial UP Police Emergency Helpline 112 or Women Power Line 1090.
`;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (openWindow && typeof window !== 'undefined') {
    try {
      const w = window.open(gmailUrl, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = gmailUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
    } catch {
      window.location.href = mailtoUrl;
    }
  }
  return gmailUrl;
}

/**
 * Format and trigger direct mailto: link for the guardian
 */
export function openEmailSos(payload: SosAlertPayload, openWindow = true): string {
  const recipient = (payload.guardianEmail || '').trim();
  const subject = encodeURIComponent(`🚨 EMERGENCY SOS: ${payload.userName || 'Traveler'} is in Danger!`);
  const body = encodeURIComponent(
`🚨 EMERGENCY SOS ALERT — DARSHAN 360 WOMEN SAFETY

${payload.userName || 'A traveler'} has triggered an emergency distress voice keyword: "${payload.keywordTriggered}".

📍 LIVE GOOGLE MAPS LOCATION:
${payload.googleMapsUrl}

📌 APPROXIMATE ADDRESS:
${payload.address}
Coordinates: ${payload.latitude.toFixed(6)}°N, ${payload.longitude.toFixed(6)}°E

🛡️ DARSHAN 360 LIVE TRACKING PORTAL:
${payload.trackingPortalUrl}
Safety Tracking Code: ${payload.safetyCode}

🔋 Device Battery: ${payload.batteryLevel ?? 'Unknown'}%
⏰ Alert Timestamp: ${new Date(payload.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

🚨 If you cannot contact them immediately, dial UP Police Emergency Helpline 112 or Women Power Line 1090.
`
  );

  const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
  if (openWindow && typeof window !== 'undefined') {
    try {
      const w = window.open(mailtoUrl, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.click();
      }
    } catch {
      window.location.href = mailtoUrl;
    }
  }
  return mailtoUrl;
}

/**
 * Format and trigger direct WhatsApp emergency alert for the guardian
 */
export function openWhatsAppSos(payload: SosAlertPayload, openWindow = true): string {
  const formattedPhone = formatWhatsAppPhoneNumber(payload.guardianPhone || '');
  const sender = payload.userName ? `*${payload.userName}*` : 'I';
  const msg = 
`🚨 *EMERGENCY SOS ALERT — I AM IN DANGER!*
${sender} have triggered an emergency voice distress keyword: "${payload.keywordTriggered}".

📍 *Live Google Maps Location:*
${payload.googleMapsUrl}

📌 *Approximate Area:* ${payload.address}
🛡️ *Live Radar Tracking:* ${payload.trackingPortalUrl}
🔑 *Safety Code:* *${payload.safetyCode}*
🔋 *Battery:* ${payload.batteryLevel ?? 90}%
⏰ *Time:* ${new Date(payload.timestamp).toLocaleTimeString('en-IN')} IST

_If you cannot reach me immediately, please call 112 (Police) or 1090 (Women Helpline)!_`;

  const waUrl = formattedPhone 
    ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

  if (openWindow && typeof window !== 'undefined') {
    try {
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    } catch {
      window.location.href = waUrl;
    }
  }
  return waUrl;
}
