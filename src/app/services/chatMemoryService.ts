// Ghumo India Chat Memory & Session Management Service
// Provides persistent storage of chat history across reloads and is architected
// as a drop-in repository ready for Firebase Firestore / Cloud DB integration.

import type { InChatImage, InChatMapData } from './geminiService';
import type { TripItinerary } from './copilotService';
import type { UPNewsEvent } from './uttarPradeshService';
import type { DistrictCrowdStatus, ScrapedNewsItem } from './newsScraperService';

export interface StoredChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string; // ISO string
  images?: InChatImage[];
  mapData?: InChatMapData;
  copilotItinerary?: TripItinerary;
  newsItems?: UPNewsEvent[];
  districtCrowdStatus?: DistrictCrowdStatus;
  scrapedNews?: ScrapedNewsItem[];
}

export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  language: 'en' | 'hi';
  messages: StoredChatMessage[];
  activeItinerary?: TripItinerary | null;
}

export interface ChatSessionMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

const STORAGE_KEY_PREFIX = 'ghumo_india_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'ghumo_india_active_session_id';

class LocalChatMemoryManager {
  private getStorageKey(sessionId: string): string {
    return `${STORAGE_KEY_PREFIX}_${sessionId}`;
  }

  // Get active session ID or create a new one
  public getOrCreateActiveSessionId(): string {
    let activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!activeId) {
      activeId = this.createNewSessionId();
      localStorage.setItem(ACTIVE_SESSION_KEY, activeId);
    }
    return activeId;
  }

  public createNewSessionId(): string {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
    return id;
  }

  // Save or update an entire session
  public saveSession(session: ChatSession): void {
    try {
      const key = this.getStorageKey(session.id);
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(session));

      // Update session index registry
      this.updateSessionIndex(session);
    } catch (e) {
      console.warn('Chat memory save error (localStorage quota?):', e);
    }
  }

  // Load a session by ID
  public loadSession(sessionId: string): ChatSession | null {
    try {
      const raw = localStorage.getItem(this.getStorageKey(sessionId));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load chat session:', e);
      return null;
    }
  }

  // Append a message to the active session
  public appendMessage(sessionId: string, message: StoredChatMessage, activeItinerary?: TripItinerary | null): void {
    let session = this.loadSession(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        title: message.type === 'user' ? message.content.slice(0, 32) : 'Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en',
        messages: [],
        activeItinerary: activeItinerary || null
      };
    }

    // Generate meaningful title from first user query
    if (session.messages.length === 0 && message.type === 'user') {
      session.title = message.content.length > 36 ? `${message.content.slice(0, 36)}...` : message.content;
    }

    session.messages.push(message);
    if (activeItinerary) {
      session.activeItinerary = activeItinerary;
    }

    this.saveSession(session);
  }

  // List all saved conversation sessions
  public listSessions(): ChatSessionMetadata[] {
    try {
      const rawIndex = localStorage.getItem(`${STORAGE_KEY_PREFIX}_index`);
      if (!rawIndex) return [];
      return JSON.parse(rawIndex);
    } catch (e) {
      return [];
    }
  }

  // Delete a specific session
  public deleteSession(sessionId: string): void {
    localStorage.removeItem(this.getStorageKey(sessionId));
    const sessions = this.listSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_index`, JSON.stringify(sessions));
    if (localStorage.getItem(ACTIVE_SESSION_KEY) === sessionId) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }

  // Clear all chat memory
  public clearAllMemory(): void {
    const sessions = this.listSessions();
    sessions.forEach(s => localStorage.removeItem(this.getStorageKey(s.id)));
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_index`);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  private updateSessionIndex(session: ChatSession): void {
    const list = this.listSessions().filter(s => s.id !== session.id);
    list.unshift({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length
    });
    // Keep last 30 sessions in local storage index
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_index`, JSON.stringify(list.slice(0, 30)));
  }
}

export const chatMemory = new LocalChatMemoryManager();

/**
 * FIREBASE / CLOUD REPOSITORY INTERFACE
 * When you are ready to integrate Firebase Firestore, implement this interface.
 * Your UI and Ghumo AI components will interact with this same signature!
 */
export interface ChatMemoryRepository {
  getOrCreateSession(userId: string, sessionId?: string): Promise<ChatSession>;
  saveMessage(userId: string, sessionId: string, message: StoredChatMessage): Promise<void>;
  listUserSessions(userId: string): Promise<ChatSessionMetadata[]>;
  deleteSession(userId: string, sessionId: string): Promise<void>;
}
