import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MapPin, 
  Image as ImageIcon, 
  Navigation, 
  Compass, 
  Newspaper, 
  Maximize2, 
  AlertTriangle, 
  Languages, 
  Check, 
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse, type InChatMapData, type InChatImage } from '../services/geminiService';
import { 
  startVoiceRecognition, 
  speakMessage, 
  stopSpeaking, 
  isSpeechRecognitionSupported, 
  isSpeechSynthesisSupported 
} from '../services/speechService';
import { UP_NEWS_UPDATES, type UPNewsEvent } from '../services/uttarPradeshService';

interface ChatPanelProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onFocusMapLocation?: (coords: [number, number], routeWaypoints?: [number, number][]) => void;
  layoutMode?: 'split' | 'fullchat' | 'fullmap';
  onSwitchToMap?: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  images?: InChatImage[];
  mapData?: InChatMapData;
  newsItems?: UPNewsEvent[];
  isSpeaking?: boolean;
}

export function ChatPanel({
  theme,
  language,
  onLanguageChange,
  onFocusMapLocation,
  layoutMode = 'split',
  onSwitchToMap,
  externalPrompt,
  onClearExternalPrompt
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognitionInstance, setSpeechRecognitionInstance] = useState<any>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [activeImageLightbox, setActiveImageLightbox] = useState<InChatImage | null>(null);
  const [showNewsBanner, setShowNewsBanner] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(2);

  // Bilingual Initial Greeting
  useEffect(() => {
    const greeting = language === 'hi'
      ? `🙏 **जय श्री राम! हर हर महादेव!**

मैं **दिशा एआई (Disha AI)** हूँ, उत्तर प्रदेश पर्यटन का आधिकारिक एआई साथी।

मैं आपको उत्तर प्रदेश के सभी प्रमुख तीर्थों (अयोध्या, काशी, मथुरा-वृंदावन, प्रयागराज, चित्रकूट, सारनाथ), ऐतिहासिक धरोहरों (ताजमहल, बड़ा इमामबाड़ा), यात्रा के आध्यात्मिक कारणों, ताज़ा समाचारों, दर्शन नियमों एवं यात्रा मार्गों की संपूर्ण जानकारी दे सकता हूँ।

_आप मुझसे किसी भी स्थान का मार्ग, फोटो, समय अथवा ताज़ा अपडेट्स पूछ सकते हैं या बोलकर सवाल कर सकते हैं!_`
      : `🙏 **Namaste & Welcome to Uttar Pradesh Tourism!**

I am **Disha AI**, your intelligent travel companion powered by Darshan 360 & UP Tourism research.

I can guide you through spiritual travel causes, multi-day itineraries, live news updates, darshan booking rules (Ram Mandir, Kashi Vishwanath), interactive routes, and high-definition photography across Uttar Pradesh.

_Ask me anything in English or Hindi, request routes & photos, or use the microphone to speak!_`;

    setMessages([
      {
        id: 1,
        type: 'ai',
        content: greeting,
        timestamp: new Date(),
      }
    ]);
  }, [language]);

  // Handle external prompt dispatched from map popup
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleUserSendMessage(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Quick Action Chips in active language
  const quickActions = language === 'hi' ? [
    { id: 1, label: '📊 मथुरा-वृंदावन: कितनी भीड़ है? जाने लायक है?', query: 'मथुरा और वृंदावन में अभी कितनी भीड़ है? क्या अभी जाने लायक है या नहीं और कैसे जाएं?' },
    { id: 2, label: '🌊 उत्तर प्रदेश के सभी प्रमुख पावन घाट', query: 'उत्तर प्रदेश के सभी प्रमुख पावन घाट दिखाएं और उनकी सूची मैप सहित दें।' },
    { id: 3, label: '🛕 अयोध्या राम मंदिर: भीड़, आरती पास व दर्शन', query: 'अयोध्या राम मंदिर में अभी भीड़ की स्थिति, आरती पास नियम और दर्शन का समय बताएं।' },
    { id: 4, label: '🗺️ अयोध्या से काशी-प्रयागराज रूट व ट्रैक', query: 'अयोध्या से वाराणसी और प्रयागराज का पूरा यात्रा मार्ग (रूट और ट्रैक) मैप सहित दिखाएं।' },
    { id: 5, label: '🎪 महाकुंभ / माघ मेला ताज़ा समाचार व घाट', query: 'प्रयागराज महाकुंभ और माघ मेले के ताज़ा अपडेट्स, स्नान घाट और टेंट सिटी की स्थिति बताएं।' },
    { id: 6, label: '📸 ताजमहल व आगरा किला फोटो व टूर गाइड', query: 'ताजमहल और आगरा किले की फोटो दिखाएं और घूमने का पूरा प्लान बताएं।' }
  ] : [
    { id: 1, label: '📊 Mathura-Vrindavan Crowd & Feasibility', query: 'How is the crowd in Mathura & Vrindavan right now? Is it recommended to visit now and how to reach?' },
    { id: 2, label: '🌊 All Sacred Ghats of Uttar Pradesh', query: 'Show me all prominent sacred river ghats in Uttar Pradesh with map markers and photos.' },
    { id: 3, label: '🛕 Ayodhya Ram Mandir Crowd & Passes', query: 'What is the current crowd status, darshan wait time, and online aarti pass rules for Ram Mandir Ayodhya?' },
    { id: 4, label: '🗺️ Ayodhya to Varanasi & Prayagraj Track', query: 'Show me the complete pilgrimage route and map track from Ayodhya to Varanasi and Prayagraj.' },
    { id: 5, label: '🎪 Maha Kumbh / Magh Mela Live News', query: 'What are the latest updates, bathing ghats, and tent city bookings for Maha Kumbh in Prayagraj?' },
    { id: 6, label: '📸 Taj Mahal Photos & Sunrise Tour', query: 'Show photos of Taj Mahal and Agra Fort and give a 1-day itinerary with ticketing rules.' }
  ];

  const getNextId = () => {
    const id = messageIdCounter.current;
    messageIdCounter.current += 1;
    return id;
  };

  // Send Message Handler
  const handleUserSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Add user message
    const userMsg: Message = {
      id: getNextId(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare history
    const history = messages.slice(-6).map(m => ({
      role: m.type === 'user' ? 'user' : 'model',
      content: m.content
    }));

    try {
      const aiResponse = await getGeminiResponse(text, history, language);

      const assistantMsg: Message = {
        id: getNextId(),
        type: 'ai',
        content: aiResponse.text,
        timestamp: new Date(),
        images: aiResponse.images,
        mapData: aiResponse.mapData,
        newsItems: aiResponse.newsItems
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If response includes map data, auto notify main map
      if (aiResponse.mapData && onFocusMapLocation) {
        onFocusMapLocation(aiResponse.mapData.center, aiResponse.mapData.routePath);
      }

    } catch (err) {
      console.error('AI chat response error:', err);
      const errorMsg: Message = {
        id: getNextId(),
        type: 'ai',
        content: language === 'hi'
          ? 'क्षमा करें, नेटवर्क में कुछ विलंब हो रहा है। कृपया पुनः प्रयास करें। मैं उत्तर प्रदेश के सभी तीर्थों एवं ऐतिहासिक स्थलों की जानकारी हेतु उपलब्ध हूँ।'
          : 'I apologize for the brief connectivity delay. Please try asking again. I am ready to guide you across all destinations in Uttar Pradesh.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice Input (Speech to Text)
  const toggleVoiceInput = () => {
    if (isRecording) {
      if (speechRecognitionInstance) {
        speechRecognitionInstance.stop();
      }
      setIsRecording(false);
      return;
    }

    const rec = startVoiceRecognition({
      language,
      onResult: (transcript) => {
        setInputValue(transcript);
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        setIsRecording(false);
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (rec) {
      setSpeechRecognitionInstance(rec);
      setIsRecording(true);
    }
  };

  // Text-to-Speech (Voice Playback)
  const handleToggleSpeakMessage = (msg: Message) => {
    if (speakingMessageId === msg.id) {
      stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    stopSpeaking();
    setSpeakingMessageId(msg.id);

    speakMessage({
      text: msg.content,
      language,
      onStart: () => {
        setSpeakingMessageId(msg.id);
      },
      onEnd: () => {
        setSpeakingMessageId(null);
      },
      onError: () => {
        setSpeakingMessageId(null);
      }
    });
  };

  // Format markdown helper
  const renderFormattedMarkdown = (text: string) => {
    // Basic rich parser for clean formatting
    return text
      .split('\n')
      .map((line, idx) => {
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-base font-bold text-[var(--accent-primary)] mt-3 mb-1.5 flex items-center gap-1.5">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-lg font-extrabold text-[var(--text-primary)] mt-3 mb-2">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.substring(2);
          return (
            <li key={idx} className="ml-4 list-disc text-sm text-[var(--text-primary)] leading-relaxed my-0.5">
              <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-sm text-[var(--text-primary)] leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--accent-primary)]">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic opacity-90">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs">$1</code>');
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-transparent overflow-hidden">
      {/* Top Language & Quick Info Header */}
      <div className="px-4 py-2.5 border-b border-[var(--glass-border)] glass flex items-center justify-between gap-3 backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{language === 'hi' ? 'दिशा AI (उत्तर प्रदेश पर्यटन)' : 'Disha AI (UP Tourism)'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                ● Live AI
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {language === 'hi' ? 'द्विभाषी यात्रा सलाहकार व गाइड' : 'Bilingual Travel Companion & Guide'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Latest News Toggle */}
          <button
            onClick={() => setShowNewsBanner(!showNewsBanner)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all border ${
              showNewsBanner
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'glass text-[var(--text-primary)] border-[var(--glass-border)] hover:bg-orange-500/10'
            }`}
            title={language === 'hi' ? 'उत्तर प्रदेश पर्यटन समाचार व अलर्ट' : 'UP Tourism Live Bulletins'}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'ताज़ा समाचार' : 'UP Updates'}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <div className="glass rounded-full p-0.5 flex items-center border border-[var(--glass-border)]">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Latest News Banner */}
      <AnimatePresence>
        {showNewsBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass border-b border-[var(--glass-border)] overflow-hidden bg-orange-500/10 dark:bg-orange-950/40 p-3 z-10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-4 h-4" />
                {language === 'hi' ? 'उत्तर प्रदेश पर्यटन: ताज़ा समाचार व दिशानिर्देश' : 'UP Tourism: Live Updates & Guidelines'}
              </span>
              <button
                onClick={() => setShowNewsBanner(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {UP_NEWS_UPDATES.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleUserSendMessage(language === 'hi' ? `मुझे ${item.title.hi} के बारे में विस्तार से बताएं।` : `Tell me more details about: ${item.title.en}`);
                    setShowNewsBanner(false);
                  }}
                  className="glass p-2.5 rounded-xl cursor-pointer hover:border-[var(--accent-primary)] transition-all border border-[var(--glass-border)]"
                >
                  <div className="flex items-center justify-between text-[10px] text-[var(--accent-primary)] font-semibold mb-1">
                    <span>📍 {item.city}</span>
                    <span>📅 {item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">
                    {language === 'hi' ? item.title.hi : item.title.en}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                    {language === 'hi' ? item.summary.hi : item.summary.en}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 min-h-0"
      >
        {messages.map((msg) => {
          const isAI = msg.type === 'ai';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              <div className={`max-w-[90%] md:max-w-[82%] rounded-2xl p-4 shadow-lg border backdrop-blur-md ${
                isAI 
                  ? 'glass border-[var(--glass-border)] text-[var(--text-primary)] rounded-tl-sm' 
                  : 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white border-transparent rounded-tr-sm'
              }`}>
                {/* Message Header for AI */}
                {isAI && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'दिशा AI' : 'Disha AI'}</span>
                    </div>

                    {/* Text-to-Speech Play Button */}
                    <button
                      onClick={() => handleToggleSpeakMessage(msg)}
                      className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-xs font-medium ${
                        speakingMessageId === msg.id
                          ? 'bg-orange-500 text-white animate-pulse'
                          : 'glass hover:text-[var(--accent-primary)] text-[var(--text-secondary)]'
                      }`}
                      title={speakingMessageId === msg.id ? 'Stop Voice' : (language === 'hi' ? 'आवाज़ में सुनें' : 'Listen with AI Voice')}
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span className="text-[10px] hidden sm:inline">{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] hidden sm:inline">{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Message Text Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {renderFormattedMarkdown(msg.content)}
                </div>

                {/* In-Chat Image Gallery Component */}
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)]">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'दर्शन एवं फोटो गैलरी' : 'Visual Gallery & Highlights'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImageLightbox(img)}
                          className="group relative h-40 rounded-xl overflow-hidden cursor-pointer shadow-md border border-[var(--glass-border)] hover:scale-[1.02] transition-all"
                        >
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-white leading-tight">{img.title}</span>
                            {img.caption && (
                              <span className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{img.caption}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-Chat Interactive Map Card Component */}
                {msg.mapData && (
                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <div className="glass rounded-xl p-3 border border-orange-500/30 bg-orange-500/5 dark:bg-orange-950/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)]">
                          <MapPin className="w-4 h-4" />
                          <span>{msg.mapData.title}</span>
                        </div>
                        {msg.mapData.distanceKm && (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            🛣️ ~{msg.mapData.distanceKm} km
                          </span>
                        )}
                      </div>

                      {/* Landmarks List in Route */}
                      <div className="space-y-1 my-2">
                        {msg.mapData.markers.slice(0, 4).map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                            <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold">{m.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* View Full Map Action Button */}
                      <button
                        onClick={() => {
                          if (msg.mapData && onFocusMapLocation) {
                            onFocusMapLocation(msg.mapData.center, msg.mapData.routePath);
                          }
                          onSwitchToMap?.();
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'पूरा मैप देखें एवं नेविगेट करें' : 'Open in Full Screen Interactive Map'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[var(--text-secondary)] mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-[var(--text-secondary)] glass rounded-full px-4 py-2 w-max shadow-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            <span>{language === 'hi' ? 'दिशा AI जानकारी जुटा रही है...' : 'Disha AI is exploring UP tourism knowledge...'}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Horizontal Quick Action Chips */}
      <div className="px-3 py-1.5 border-t border-[var(--glass-border)] glass flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0">
        {quickActions.map(action => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUserSendMessage(action.query)}
            className="px-3 py-1 rounded-full text-xs font-medium glass hover:bg-orange-500/10 hover:border-[var(--accent-primary)] text-[var(--text-primary)] transition-all whitespace-nowrap border border-[var(--glass-border)] shadow-sm"
          >
            {action.label}
          </motion.button>
        ))}
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-3 glass border-t border-[var(--glass-border)] backdrop-blur-md flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Microphone Button */}
          {isSpeechRecognitionSupported() && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-full transition-all shadow-md flex items-center justify-center ${
                isRecording
                  ? 'bg-red-500 text-white animate-ping ring-4 ring-red-300'
                  : 'glass text-[var(--accent-primary)] hover:bg-orange-500/10 border border-[var(--glass-border)]'
              }`}
              title={isRecording ? 'Stop Recording' : (language === 'hi' ? 'बोलकर प्रश्न पूछें' : 'Speak to AI')}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Text Input Box */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isRecording 
                  ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now') 
                  : (language === 'hi' ? 'उत्तर प्रदेश के किसी भी धाम, मार्ग, फोटो या समाचार के बारे में पूछें...' : 'Ask about any UP temple, history, route, photos, or news...')
              }
              className="w-full px-4 py-2.5 rounded-full glass border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`p-2.5 rounded-full transition-all shadow-md flex items-center justify-center ${
              inputValue.trim() && !isTyping
                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:scale-105 shadow-orange-500/30'
                : 'glass opacity-50 cursor-not-allowed text-[var(--text-secondary)]'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Fullscreen Lightbox Modal for Photos */}
      <AnimatePresence>
        {activeImageLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageLightbox(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden glass border border-white/20">
              <img
                src={activeImageLightbox.url}
                alt={activeImageLightbox.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-md p-4 text-white">
                <h3 className="text-base font-bold">{activeImageLightbox.title}</h3>
                {activeImageLightbox.caption && (
                  <p className="text-xs text-white/80 mt-1">{activeImageLightbox.caption}</p>
                )}
              </div>
              <button
                onClick={() => setActiveImageLightbox(null)}
                className="absolute top-3 right-3 glass text-white p-2 rounded-full hover:bg-white/20"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}