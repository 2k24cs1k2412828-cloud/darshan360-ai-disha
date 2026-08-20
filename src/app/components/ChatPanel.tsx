import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, MapPin, Image as ImageIcon, Link as LinkIcon, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse } from '../services/geminiService';

interface ChatPanelProps {
  theme: 'morning' | 'evening';
  onBookBoat: () => void;
  layoutMode?: 'split' | 'fullchat';
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  hasImage?: boolean;
  imageUrl?: string;
  hasMapHighlight?: boolean;
  hasLink?: boolean;
  linkText?: string;
}

const quickActions = [
  { id: 1, label: 'Plan My Spiritual Trip', icon: Sparkles },
  { id: 2, label: 'Temple Darshan at Sunrise', icon: Sparkles },
  { id: 3, label: 'Evening Aarti Experience', icon: Sparkles },
  { id: 4, label: 'Hidden Spiritual Gems', icon: MapPin },
  { id: 5, label: 'Guide from Airport', icon: MapPin },
  { id: 6, label: 'Budget Pilgrimage Trip Under ₹5,000', icon: Sparkles },
  { id: 7, label: 'Discover Heritage Ecosystem', icon: Sparkles },
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'ai',
    content: "Namaste! 🙏 I'm Darshan 360, your smart spiritual travel companion. I can help you discover hidden heritage sites, cultural stories, regional travel circuits, community-led experiences, and personalized itineraries. What would you like to explore?",
    timestamp: new Date(),
  },
];

export function ChatPanel({ theme, onBookBoat, layoutMode = 'split' }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'int'>('en');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(initialMessages.length + 1);

  useEffect(() => {
    // Auto scroll to bottom only when new messages arrive
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [messages]);

  const handleScrollAreaScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    // Show button if user is NOT at the bottom
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setShowScrollToBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollToBottom(false);
  };

  const getNextMessageId = () => {
    const id = messageIdCounter.current;
    messageIdCounter.current += 1;
    return id;
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-like syntax to styled text
    // This is a simple formatter that handles common patterns without requiring a full markdown library
    
    let html = content
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em>
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br/>')
      // Bullet points: * text -> • text (styled)
      .replace(/^\* /gm, '• ')
      // Numbered lists: numbers stay as is
      // Code: `text` -> <code>text</code>
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return html;
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Build conversation history for context
    const conversationHistory = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    try {
      const response = await getGeminiResponse(userMessage, conversationHistory);
      
      const aiResponse: Message = {
        id: getNextMessageId(),
        type: 'ai',
        content: response.text,
        timestamp: new Date(),
        hasImage: response.hasImage,
        imageUrl: response.imageUrl,
        hasMapHighlight: response.hasMapHighlight,
        hasLink: response.hasLink,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorResponse: Message = {
        id: getNextMessageId(),
        type: 'ai',
        content: "I apologize for the technical difficulty. Please try again in a moment. I'm here to help with information about Varanasi's attractions, boat rides, food recommendations, and travel tips!",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
    
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: getNextMessageId(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    handleAIResponse(inputValue);
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: getNextMessageId(),
      type: 'user',
      content: action,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    handleAIResponse(action);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  const cycleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : prev === 'hi' ? 'int' : 'en'));
  };

  const languageLabels = {
    en: 'EN',
    hi: 'हि',
    int: 'INT',
  };

  // Modern ChatGPT-style UI for both desktop and mobile
  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-3 py-3 sm:px-4 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-sm sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] sm:text-base">Darshan 360</h2>
              <p className="text-xs text-[var(--text-secondary)]">Your smart spiritual guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={cycleLanguage}
              className="border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
            >
              <Languages className="mr-1 h-4 w-4" />
              {languageLabels[language]}
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScrollAreaScroll}
        className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:gap-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[92%] sm:max-w-[82%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  {message.type === 'user' ? (
                    <div className="rounded-2xl bg-[var(--accent-primary)] px-3 py-2.5 text-sm text-white shadow-sm sm:px-4 sm:py-3 sm:text-base">
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-sm sm:px-4 sm:py-3 sm:text-base">
                      <div className="space-y-2">
                        {message.content.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>

                      {message.hasImage && message.imageUrl && (
                        <div className="mt-3 overflow-hidden rounded-xl">
                          <img src={message.imageUrl} alt="Preview" className="h-40 w-full object-cover" />
                        </div>
                      )}

                      {message.hasMapHighlight && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--accent-primary)]/10 p-2 text-xs text-[var(--accent-primary)]">
                          <MapPin className="h-4 w-4" />
                          <span>Location highlighted on map</span>
                        </div>
                      )}

                      {message.type === 'ai' && message.content.includes('boat') && (
                        <Button
                          size="sm"
                          onClick={onBookBoat}
                          className="mt-3 w-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)]"
                        >
                          Book Boat Ride →
                        </Button>
                      )}
                    </div>
                  )}

                  <span className={`mt-1 block text-[10px] text-[var(--text-secondary)] sm:text-xs ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-3 py-3 shadow-sm sm:px-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]" style={{ animationDelay: '0s' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && !isTyping && (
        <div className="border-t border-[var(--glass-border)] bg-[var(--bg-primary)]/80 px-3 py-3 sm:px-4 sm:py-4">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-2">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-left text-sm text-[var(--text-primary)] transition-all hover:bg-[var(--accent-primary)]/10"
                >
                  <Icon className="h-4 w-4 text-[var(--accent-primary)]" />
                  <span>{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-[var(--glass-border)] bg-[var(--bg-primary)]/90 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4 md:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-2 shadow-sm sm:gap-3 sm:p-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Darshan 360..."
              className="flex-1 border-0 bg-transparent px-2 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] sm:px-3 sm:py-2 sm:text-base"
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleRecording}
              className={`rounded-xl p-2.5 transition-all sm:p-3 ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white'
              }`}
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="rounded-xl bg-[var(--accent-primary)] p-2.5 text-white transition-all hover:bg-[var(--accent-secondary)] disabled:cursor-not-allowed disabled:opacity-50 sm:p-3"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--text-secondary)] sm:text-xs">
            Powered by Darshan 360
          </p>
        </div>
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={scrollToBottom}
            className="fixed bottom-28 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white shadow-lg sm:right-6"
            title="Go to latest message"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14l5 5 5-5z" />
            </svg>
            
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}