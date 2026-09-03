// Speech Service for Darshan 360 (Uttar Pradesh AI Travel Companion)
// Handles Speech-to-Text (Voice Input) & Text-to-Speech (AI Voice Playback) in Hindi & English

// Type definitions for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

// Clean markdown syntax for natural voice synthesis
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/[*_~`#>-]/g, ' ')               // markdown markers
    .replace(/⚠️|🙏|🛕|🏰|🌊|🍽️|📸|💡|🎫|💰|🎯|📅|🚨|•/g, '') // emojis / symbols
    .replace(/\s+/g, ' ')                     // excessive spaces
    .trim();
}

// Check speech recognition browser support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

// Check speech synthesis support
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

// Initialize and start Speech-to-Text
export function startVoiceRecognition({
  language = 'en',
  onResult,
  onError,
  onEnd,
}: {
  language: 'en' | 'hi';
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}): any {
  const win = window as unknown as IWindow;
  const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRec) {
    onError(language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता।' : 'Voice input not supported in your browser.');
    return null;
  }

  try {
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript) {
        onResult(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err: any) {
    console.error('Speech recognition start failed:', err);
    onError(err.message || 'Speech recognition error');
    return null;
  }
}

// Text-to-Speech Engine
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakMessage({
  text,
  language = 'en',
  onStart,
  onEnd,
  onError,
}: {
  text: string;
  language: 'en' | 'hi';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}): void {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  stopSpeaking();

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Language settings
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Select best voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const targetLang = language === 'hi' ? 'hi' : 'en';
    const matchedVoice = voices.find(v => 
      (v.lang.toLowerCase().includes(targetLang) || v.lang.toLowerCase().includes('in')) &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('India') || v.default)
    ) || voices.find(v => v.lang.toLowerCase().includes(targetLang));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (err) => {
    currentUtterance = null;
    onError?.(err);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isCurrentlySpeaking(): boolean {
  if (typeof window === 'undefined') return false;
  return window.speechSynthesis?.speaking || false;
}
