# 🕌 Darshan 360 (D360) — Architectural Blueprint, Features & UI Status Report

> **Platform**: Darshan 360 AI Operating System  
> **Parent Entity**: EduFutura Technologies Pvt. Ltd.  
> **Target Region**: Uttar Pradesh Sacred Pilgrimage, Multimodal Transit & Cultural Heritage Circuits  
> **Tech Stack**: React 18, TypeScript, Vite 6, Tailwind CSS v4, Motion (Framer Motion), Leaflet, Firebase Auth, Google Gemini AI, Capacitor  

---

## 📑 Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Complete Features Inventory](#2-complete-features-inventory)
   - [2.1 Interactive 360° Sacred Heritage & Ghat Map](#21-interactive-360-sacred-heritage--ghat-map)
   - [2.2 Disha AI — Bilingual Spiritual Travel Copilot](#22-disha-ai--bilingual-spiritual-travel-copilot)
   - [2.3 Multimodal Travel Price Comparison & Aggregation Engine](#23-multimodal-travel-price-comparison--aggregation-engine)
   - [2.4 Mission Shakti 1090 Women Safety & Voice SOS System](#24-mission-shakti-1090-women-safety--voice-sos-system)
   - [2.5 Live Cultural Bulletins, Aarti Telemetry & News](#25-live-cultural-bulletins-aarti-telemetry--news)
   - [2.6 Firebase Authentication & User Session Manager](#26-firebase-authentication--user-session-manager)
   - [2.7 Mobile PWA & Capacitor Android Native Shell](#27-mobile-pwa--capacitor-android-native-shell)
3. [Current Status of the UI (In-Depth Analysis)](#3-current-status-of-the-ui-in-depth-analysis)
   - [3.1 Visual Contrast: Landing Page vs. Core App Explorer](#31-visual-contrast-landing-page-vs-core-app-explorer)
   - [3.2 Design System & Token Comparison](#32-design-system--token-comparison)
   - [3.3 Responsive Breakpoints & Viewport States](#33-responsive-breakpoints--viewport-states)
4. [UI Harmonization Blueprint (Unifying Landing Page & App UI)](#4-ui-harmonization-blueprint)
5. [Project Architecture & Component Sitemap](#5-project-architecture--component-sitemap)
6. [Environment Variables & Setup Guide](#6-environment-variables--setup-guide)

---

## 1. Executive Summary & Purpose

**Darshan 360 (D360)** is an AI-powered travel operating system designed specifically for pilgrims, cultural tourists, solo female travelers, and families visiting Uttar Pradesh.

The system addresses three critical pain points in spiritual and cultural tourism:
1. **Navigation & Timing Uncertainty**: Temple darshan queues, aarti schedules, and station-return deadlines (e.g., catching a train in 3 hours).
2. **Fragmented Travel Costs**: Need to manually switch between UPSRTC buses, Indian Railways trains, private cabs (Uber/Ola/MakeMyTrip), and hotel booking apps.
3. **Safety for Female & Solo Travelers**: Hands-free voice emergency detection connected to UP Police 1090 and trusted guardians.

---

## 2. Complete Features Inventory

### 2.1 Interactive 360° Sacred Heritage & Ghat Map
- **File**: `src/app/components/MapPanel.tsx`
- **Capabilities**:
  - Covers **75+ districts** and major sacred circuits (Varanasi/Kashi, Ayodhya, Mathura-Vrindavan, Prayagraj, Agra, Sarnath, Chitrakoot, Kushinagar, Jhansi).
  - High-resolution map tiles with custom divine marker pins, category filters (*Temples*, *Ghats*, *Monuments*, *Buddhist Circuit*).
  - **Click-to-Chat & Add-to-Trip**: Direct popup interactions allowing users to ask Disha AI about a place or append it to their Copilot itinerary.
  - **Circuit Waypoints**: Ramayana Circuit, Braj-Mughal Triangle, Awadh-Buddhist Route.
  - **Live Crowd Density & Aarti Indicators**: Shows estimated queue times and evening aarti countdowns.

### 2.2 Disha AI — Bilingual Spiritual Travel Copilot
- **Files**: `src/app/components/ChatPanel.tsx`, `src/app/components/CopilotTimeline.tsx`, `src/app/services/geminiService.ts`, `src/app/services/copilotService.ts`
- **Capabilities**:
  - Powered by **Google Gemini AI** with bilingual prompt engineering (English & हिन्दी).
  - **Voice Input (STT)** with animated wave frequency indicator.
  - **Voice Output (TTS)** with natural audio playback and stop controls.
  - **Station-Return Time Guard**: Enforces strict return deadlines (e.g., *"I have 3 hours from Cantt Railway Station"*).
  - **Dynamic Re-planner**: 1-click *"Running 20m Late"* button dynamically adjusts all remaining stops.
  - **In-Chat Interactive Action Cards**: Renders embedded navigation buttons, image lightboxes, and quick preset queries.

### 2.3 Multimodal Travel Price Comparison & Aggregation Engine
- **Files**: `src/app/components/TravelComparisonPanel.tsx`, `src/app/engine/types/travel.types.ts`, `src/app/engine/adapters/*`
- **Capabilities**:
  - Provider-agnostic metasearch engine architecture.
  - Compares across **5 transport & hospitality categories**:
    - 🚌 **Buses**: UPSRTC Janrath, Shatabdi AC, Volvo, Ordinary Express, private sleeper coaches.
    - 🚆 **Trains**: Vande Bharat Express, Shatabdi, Superfast Express, Intercity SF.
    - 🚕 **Cabs / Taxis**: Sedan, SUV, Prime, Outstation cabs with fuel and toll breakdown.
    - ✈️ **Flights**: Direct flights between Lucknow (LKO), Varanasi (VNS), Ayodhya (AYJ), and Gorakhpur.
    - 🏨 **Hotels / Stays**: Verified pilgrim dharamshalas, UPSTDC tourist bungalows, and premium boutique hotels.
  - **Interactive Controls**: Sort by *Cheapest (सस्ता)*, *Fastest (तेज़)*, or *Highest Rated (रेटिंग)*.
  - **Fare Breakdown Drawer**: Base fare, GST, passenger service fees, luggage policy, cancellation policy, and verified provider booking redirect.

### 2.4 Mission Shakti 1090 Women Safety & Voice SOS System
- **Files**: `src/app/components/WomenSafetyPanel.tsx`, `src/app/services/voiceSosService.ts`, `src/app/services/safetyService.ts`
- **Capabilities**:
  - **Real-Time Voice Keyword Detection**: Continuously monitors audio in background for distress keywords (*"I am in danger"*, *"बचाओ"*, *"help me"*, *"आपातकाल"*).
  - **Auto-Trigger Emergency Siren**: High-decibel audio oscillator beacon designed to disorient attackers and attract nearby help.
  - **5-Digit Encrypted Live Sharing Code**: Generates a fast, memorable session code (e.g. `77645`) for guardians to track real-time coordinates.
  - **1-Click Multi-Channel Dispatch**:
    - Instant Gmail pre-filled draft to `edufutura01.mayank@gmail.com` and custom guardian emails.
    - WhatsApp emergency message with Google Maps GPS link.
    - Direct phone dialer links to **1090 (Women Power Line)** and **112 (Police Emergency)**.
  - **Global Alert Banner**: High-priority red modal overlay appears across the entire website if distress is triggered in any panel.

### 2.5 Live Cultural Bulletins, Aarti Telemetry & News
- **Files**: `src/app/components/NewsPanel.tsx`, `src/app/services/newsScraperService.ts`
- **Capabilities**:
  - Curated and live-scraped bulletins on temple opening timings, Aarti pass procedures, Maha Kumbh / Magh Mela guidelines, and ropeway schedules.
  - Filterable by tags: *Aarti*, *Festivals*, *Advisory*, *Transit*.

### 2.6 Firebase Authentication & User Session Manager
- **Files**: `src/app/config/firebase.ts`, `src/app/services/firebaseAuthService.ts`, `src/app/components/AuthModal.tsx`
- **Capabilities**:
  - Official **Firebase Auth SDK (v12.19.0)** initialization with local persistence.
  - **Email & Password Authentication**: Sign-in, registration with name and phone number.
  - **Google OAuth 1-Tap**: Popup authentication with avatar synchronization.
  - **Password Recovery**: Automated reset email dispatch.
  - **1-Click Guest Yatri Pass**: Immediate exploration with an anonymous guest session without mandatory login friction.
  - Seamless state synchronization across header, drawer, and modals.

### 2.7 Mobile PWA & Capacitor Android Native Shell
- **Files**: `src/app/components/android/AndroidAppShell.tsx`, `public/manifest.webmanifest`, `public/sw.js`
- **Capabilities**:
  - Automatically activates native Android shell when running inside Capacitor (`@capacitor/android`).
  - Standalone PWA installability on iOS Safari and Android Chrome with offline service worker caching.
  - Fixed mobile bottom navigation with 48px+ touch targets and safe-area inset support.

---

## 3. Current Status of the UI (In-Depth Analysis)

### 3.1 Visual Contrast: Landing Page vs. Core App Explorer

The user observed that **"the landing page and the ui of app is too different"**. Here is the technical breakdown of why this visual difference exists:

| UI Attribute | Core App UI (`App.tsx`, `MapPanel`, `ChatPanel`) | Landing Page (`LandingPage.tsx`) | Impact of Difference |
| :--- | :--- | :--- | :--- |
| **Aesthetic Paradigm** | **Saffron-Gold Sacred Neumorphism & Glass** | **Modern Tailwind SaaS Marketing Style** | App feels like a spiritual dashboard; Landing Page feels like a modern SaaS landing page. |
| **Background Treatment** | CSS variables: `var(--bg-primary)`, `var(--glass-surface)`, subtle parchment/stone gradients. | Tailwind `bg-white dark:bg-stone-950` with amber blurred radial glow spheres. | Background luminosity and texture do not match smoothly across transitions. |
| **Typography Hierarchy** | Serif and classical titles (`Cinzel`, `Playfair Display`), paired with `Plus Jakarta Sans`. | Tailwind default sans font stack with standard weights (`font-black`, `font-bold`). | Header and title fonts change when switching from landing to app. |
| **Navigation Elements** | Segmented pill container (`glass rounded-full p-1`) with animated active indicators. | Standard horizontal text links with standard hover states. | Top bar layout changes structure and height between the two pages. |
| **Border & Radius Style** | Rounded-2xl to rounded-full pills with subtle amber/gold glass borders (`var(--glass-border)`). | Rounded-3xl cards with 1px border (`border-amber-500/20`). | Card corners and shadows have differing radius geometry. |
| **Atmospheric Themes** | Explicitly styled **Morning Sun (गोल्डन प्रभात)** vs. **Evening Aarti (दिव्य संध्या)** themes. | Standard Dark/Light mode toggle that approximates the colors but uses generic Tailwind classes. | Night/evening mode on landing page is deep stone gray, while the app is deep midnight indigo-amber. |

---

### 3.2 Design System & Token Comparison

#### Core App Tokens (`src/styles/index.css`)
```css
:root[data-theme='morning'] {
  --bg-primary: #fdfbf7;
  --bg-secondary: #f4ede4;
  --accent-primary: #d97706; /* Saffron Amber */
  --accent-secondary: #ea580c; /* Deep Orange */
  --text-primary: #1c1917;
  --glass-border: rgba(217, 119, 6, 0.18);
  --font-display: 'Cinzel', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}

:root[data-theme='evening'] {
  --bg-primary: #0c0a09;
  --bg-secondary: #1c1917;
  --accent-primary: #f59e0b; /* Golden Glow */
  --accent-secondary: #f97316;
  --text-primary: #f5f5f4;
  --glass-border: rgba(245, 158, 11, 0.22);
}
```

#### Landing Page Token Usage
- The Landing Page previously used raw Tailwind classes like `bg-stone-50 dark:bg-stone-900`, `border-stone-200`, `text-stone-900`.
- **Resulting Gap**: It bypassed the `--bg-primary`, `--accent-primary`, and `--font-display` variables declared in `index.css`.

---

### 3.3 Responsive Breakpoints & Viewport States

1. **Desktop Viewport (`>= 1024px`)**:
   - **App**: Dual Split-Screen view with interactive Leaflet map on right, AI chat / copilot on left, top segmented navigation bar.
   - **Landing Page**: 4-column destination grids, centered hero, sticky top navigation.
2. **Tablet Viewport (`768px – 1023px`)**:
   - **App**: Collapsible sidebars, drawer-based Copilot timeline.
   - **Landing Page**: 2-column feature card grids, wrapping CTA buttons.
3. **Mobile Viewport (`< 768px`)**:
   - **App**: Fixed bottom tab bar (`chat`, `map`, `copilot`, `news`, `safety`, `compare`), full-screen single panel, safe-area-inset padding.
   - **Landing Page**: Stacked cards, pull-down bottom sheet for Auth, full-width touch buttons.

---

## 4. UI Harmonization Blueprint

To make the Landing Page and the App UI feel 100% unified, cohesive, and premium, the following design harmonization principles are applied:

1. **Adopt Identical Typography**:
   - Replace standard sans headings in `LandingPage.tsx` with `font-display` (`Cinzel` / `Playfair Display`) to match `DARSHAN 360°` in `App.tsx`.
2. **Apply Theme CSS Variables to Landing Page**:
   - Change background container from `bg-white dark:bg-stone-950` to `bg-[var(--bg-primary)] text-[var(--text-primary)]`.
   - Change card backgrounds to `glass` and borders to `border-[var(--glass-border)]`.
3. **Harmonize Header Navigation Bar**:
   - Use the same pill navigation design (`glass rounded-full p-1 border border-[var(--glass-border)]`) on the Landing Page as used in the App header.
4. **Synchronize Atmosphere Switching**:
   - The toggle on the Landing Page should directly set `data-theme="morning"` or `data-theme="evening"`, applying the exact same warm temple glow palette across both views.
5. **Shared Auth Modal Architecture**:
   - `AuthModal.tsx` already uses `bg-[var(--bg-primary)]` and glassmorphic elevations, acting as the visual bridge between the landing page and the app.

---

## 5. Project Architecture & Component Sitemap

```
src/
├── main.tsx                           # App entry point & root DOM render
├── styles/
│   └── index.css                      # Master Design System (Morning/Evening tokens, fonts, glass classes)
├── data/
│   └── up-comprehensive-database.ts    # 75+ UP Destinations, coordinates, aarti timings & history
├── app/
│   ├── App.tsx                        # Master Orchestrator, layout switcher & global alerts
│   ├── config/
│   │   └── firebase.ts                # Firebase Auth Singleton configuration
│   ├── engine/                        # Multimodal Travel Price Engine
│   │   ├── types/travel.types.ts      # Provider, Route & Price schemas
│   │   ├── adapters/                  # UPSRTC, IRCTC, Ola/Uber, MMT adapters
│   │   └── TravelComparisonEngine.ts  # Metasearch aggregator
│   ├── services/
│   │   ├── firebaseAuthService.ts     # Firebase Auth service (Google, Email, Guest)
│   │   ├── voiceSosService.ts         # Hands-free speech recognition SOS listener
│   │   ├── safetyService.ts           # Emergency audio oscillator siren generator
│   │   ├── geminiService.ts           # Gemini AI spiritual assistant client
│   │   ├── copilotService.ts          # Itinerary generator & 20m late replanner
│   │   └── newsScraperService.ts      # Live UP Tourism bulletin aggregator
│   └── components/
│       ├── LandingPage.tsx            # Unified Homepage & Platform Showcase
│       ├── AuthModal.tsx              # Mobile-First Bottom Sheet / Desktop Glass Auth Modal
│       ├── MapPanel.tsx               # 360° Heritage Map & River Ghats (Leaflet)
│       ├── ChatPanel.tsx              # Disha AI Bilingual Voice Concierge
│       ├── TravelComparisonPanel.tsx  # Multimodal Travel Fare Comparison Engine
│       ├── WomenSafetyPanel.tsx       # Mission Shakti 1090 Live GPS & SOS Console
│       ├── NewsPanel.tsx              # Aarti Timings, Bulletins & Crowd Telemetry
│       ├── CopilotTimeline.tsx        # Interactive Route Schedule Drawer
│       ├── LoadingScreen.tsx          # Sacred Splash Loader
│       └── android/
│           └── AndroidAppShell.tsx    # Native Android Capacitor Experience
```

---

## 6. Environment Variables & Setup Guide

### Required `.env` Configuration
Create a `.env` file in the root directory:

```ini
# Google Gemini AI Key (for Disha AI Copilot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Authentication (Optional: app falls back to local guest sessions if unconfigured)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run local dev server (default port: 5173)
npm run dev

# 3. Build production bundle
npm run build
```

### Direct Navigation URLs
- **Landing Page**: `http://localhost:5173/?landing=true`
- **Main Interactive App**: `http://localhost:5173/` or `http://localhost:5173/?landing=false`
- **Travel Price Compare Directly**: `http://localhost:5173/?mode=compare`
- **Women Safety 1090 Console Directly**: `http://localhost:5173/?mode=safety&safety_code=77645`

---

*Report prepared for EduFutura Technologies Pvt. Ltd. • Darshan 360 Architecture Team*
