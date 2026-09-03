# Darshan 360 - Uttar Pradesh AI Travel Companion

Darshan 360 is an AI-powered spiritual, cultural, and heritage tourism platform dedicated to **Uttar Pradesh**, built with React 18, TypeScript, Tailwind CSS v4, and Leaflet.

## Two Core Pillars
1. **Bilingual AI Travel Assistant (Disha AI)**:
   - Available in **Hindi (हिन्दी)** and **English (EN)**.
   - **Speech-to-Text (STT)** voice input with live recording wave animation.
   - **Text-to-Speech (TTS)** voice player with natural voice synthesis and play/stop controls.
   - Explanatory responses detailing the **travel cause**, spiritual & cultural purpose, history, timings, budget breakdowns, and darshan rules.
   - **Live UP Tourism News & Bulletins**: Real-time updates on Maha Kumbh / Magh Mela, Ram Mandir online Aarti passes, Kashi Vishwanath corridor rules, Varanasi ropeway, and Braj Holi.
   - **In-Chat Interactive Maps**: Route previews and coordinates with one-click full-screen map navigation.
   - **In-Chat Image Galleries**: High-definition photo showcases with lightbox zoom.
   - **Safety & Scam Advisory**: Prevention tips for boat overcharging, fake VIP passes, and emergency numbers.

2. **Interactive Uttar Pradesh Tourism Map**:
   - Covers Ayodhya, Varanasi / Kashi, Mathura, Vrindavan, Agra, Prayagraj, Lucknow, Sarnath, Kushinagar, Chitrakoot, and Jhansi.
   - Category filters: Temples & Pilgrimages, Ghats & Rivers, Heritage Forts, Buddhist Circuit, Historical Monuments.
   - Pre-configured Circuit Routes (Ramayana Circuit, Braj-Mughal Triangle, Awadh-Buddhist Route).
   - Click-to-chat popup cards triggering instant inquiries with Disha AI.
   - Split view, Full Chat, and Full Map layout modes.

## Architecture
- `src/app/App.tsx`: Main layout manager with mode switches, language toggles, and day/night themes.
- `src/app/components/ChatPanel.tsx`: Disha AI interface with voice input/output, map cards, and photo galleries.
- `src/app/components/MapPanel.tsx`: Leaflet UP interactive map with filters, routes, and custom category pins.
- `src/app/services/uttarPradeshService.ts`: Curated UP database (destinations, causes, news, scams, routes).
- `src/app/services/geminiService.ts`: Gemini integration with domain knowledge, intent parsing, and offline fallback.
- `src/app/services/speechService.ts`: Web Speech Recognition & Synthesis API wrapper for Hindi and English.
