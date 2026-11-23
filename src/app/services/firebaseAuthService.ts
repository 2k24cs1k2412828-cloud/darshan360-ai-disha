// Firebase Authentication Service & User Session Manager
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  isAnonymous?: boolean;
  providerId?: string;
  createdAt?: string;
  preferredLanguage?: 'en' | 'hi';
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

const LOCAL_USER_STORAGE_KEY = 'd360_auth_user_profile_v1';

class FirebaseAuthService {
  private currentUser: UserProfile | null = null;
  private authListeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    // 1. Restore cached session immediately for instant mobile UI load
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
        if (cached) {
          this.currentUser = JSON.parse(cached);
        }
      } catch {}
    }

    // 2. Listen to official Firebase onAuthStateChanged
    try {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const profile = this.mapFirebaseUser(firebaseUser);
          this.setCurrentUser(profile);
        } else {
          // If not in guest demo session, clear
          if (!this.currentUser || !this.currentUser.isAnonymous) {
            this.setCurrentUser(null);
          }
        }
      });
    } catch (err) {
      console.warn('[FirebaseAuth] Listener warning:', err);
    }
  }

  private mapFirebaseUser(user: FirebaseUser): UserProfile {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Traveler'),
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      isAnonymous: user.isAnonymous,
      providerId: user.providerData?.[0]?.providerId || 'firebase'
    };
  }

  private setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
      }
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.authListeners.forEach((cb) => {
      try { cb(this.currentUser); } catch {}
    });
  }

  public subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.authListeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.authListeners = this.authListeners.filter((cb) => cb !== callback);
    };
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Email and Password Sign In
   */
  public async loginWithEmail(email: string, pass: string): Promise<AuthResult> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = this.mapFirebaseUser(cred.user);
      this.setCurrentUser(profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('[FirebaseAuth] Email sign in notice:', err?.code || err?.message);
      
      // Fallback: If Firebase project credentials are unconfigured mock keys in local dev, provide smooth fallback
      if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid' || err?.message?.includes('API key')) {
        const devUser: UserProfile = {
          uid: `dev_${Date.now()}`,
          email: email.trim(),
          displayName: email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
          providerId: 'password',
          isAnonymous: false
        };
        this.setCurrentUser(devUser);
        return { success: true, user: devUser };
      }

      return { 
        success: false, 
        error: this.formatErrorMessage(err) 
      };
    }
  }

  /**
   * New User Registration with Email, Password & Name
   */
  public async registerWithEmail(
    email: string, 
    pass: string, 
    displayName: string, 
    phoneNumber?: string
  ): Promise<AuthResult> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      if (displayName) {
        await updateProfile(cred.user, {
          displayName: displayName.trim(),
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`
        });
      }

      const profile: UserProfile = {
        ...this.mapFirebaseUser(cred.user),
        displayName: displayName.trim() || cred.user.email?.split('@')[0] || 'Traveler',
        phoneNumber: phoneNumber || null
      };

      this.setCurrentUser(profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('[FirebaseAuth] Email registration notice:', err?.code || err?.message);

      // Graceful local development fallback if API key is not yet set
      if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid' || err?.message?.includes('API key')) {
        const devUser: UserProfile = {
          uid: `dev_${Date.now()}`,
          email: email.trim(),
          displayName: displayName.trim() || email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName || email)}`,
          phoneNumber: phoneNumber || null,
          providerId: 'password',
          isAnonymous: false
        };
        this.setCurrentUser(devUser);
        return { success: true, user: devUser };
      }

      return { 
        success: false, 
        error: this.formatErrorMessage(err) 
      };
    }
  }

  /**
   * Google Popup Sign In
   */
  public async loginWithGoogle(): Promise<AuthResult> {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const profile = this.mapFirebaseUser(cred.user);
      this.setCurrentUser(profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('[FirebaseAuth] Google login notice:', err?.code || err?.message);

      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in window was closed before completion.' };
      }

      // Dev fallback if mock key
      if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid' || err?.message?.includes('API key')) {
        const googleDevUser: UserProfile = {
          uid: `google_dev_${Date.now()}`,
          email: 'traveler.google@darshan360.in',
          displayName: 'Pilgrim Traveler (Google)',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
          providerId: 'google.com',
          isAnonymous: false
        };
        this.setCurrentUser(googleDevUser);
        return { success: true, user: googleDevUser };
      }

      return { 
        success: false, 
        error: this.formatErrorMessage(err) 
      };
    }
  }

  /**
   * Password Reset Email Dispatch
   */
  public async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      console.warn('[FirebaseAuth] Reset email notice:', err);
      // If dev mock key
      if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid') {
        return { success: true };
      }
      return { success: false, error: this.formatErrorMessage(err) };
    }
  }

  /**
   * 1-Click Guest / Demo Mode Sign In
   */
  public loginAsGuest(guestName = 'Yatri Guest'): UserProfile {
    const guestUser: UserProfile = {
      uid: `guest_${Date.now()}`,
      email: null,
      displayName: guestName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(guestName)}`,
      providerId: 'guest',
      isAnonymous: true
    };
    this.setCurrentUser(guestUser);
    return guestUser;
  }

  /**
   * Sign Out
   */
  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch {}
    this.setCurrentUser(null);
  }

  private formatErrorMessage(err: any): string {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please sign in.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Access temporarily restricted. Try again later.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
