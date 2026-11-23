// Firebase Configuration & Initialization
// Platform: Darshan 360 (D360) • EduFutura Technologies Pvt. Ltd.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoD360DarshanEduFuturaAuthKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "darshan360-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "darshan360-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "darshan360-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109823471029",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109823471029:web:98f12a34b56c78"
};

// Initialize Firebase App as Singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Local Persistence for persistent sessions across tabs and browser restarts
try {
  setPersistence(auth, browserLocalPersistence);
} catch (err) {
  console.warn('[Firebase] Persistence init warning:', err);
}

// Google Auth Provider setup
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
