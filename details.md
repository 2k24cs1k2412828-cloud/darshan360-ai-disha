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

## Current Session Status (All Saved Tasks Completed)
- **Completed in this Session**:
  1. **Greeting Intent Fix**:
     - Fixed substring collision in `searchUPPlaces` (where `"hi"` collided with `"kashi"`).
     - Expanded stop words and added strict whole-word / prefix matching.
     - Added dedicated welcoming concierge response in `geminiService.ts` for greetings ("hi", "hello", "namaste", "pranam", "radhe radhe") without triggering Kashi Vishwanath markers, random routes, or false image galleries.
  2. **Google Maps-Like Experience**:
     - Built floating **Directions & Distance Calculator Drawer** on the map with Origin/Destination fields, landmark/city autocomplete, swap button (⇅), and instant highway route computation.
     - Route calculation outputs road distance (km), estimated driving duration, primary expressway/highway corridor name (e.g. Agra-Lucknow Expressway, Yamuna Expressway, Purvanchal Expressway, Bundelkhand Expressway, NH-19 GT Road, NH-27, NH-330), milestones, and a one-click **Clear Route** button.
     - Marker Popups equipped with **"Directions From Here" (🚩)** and **"Directions To Here" (🏁)** quick buttons.
     - Upgraded map search bar with **Live Autocomplete Dropdown** (smooth `flyTo` and popup opening on select).
     - Eliminated random default route polylines; map now only displays polylines when a route is explicitly selected.
  3. **Rich Destination Database & Categories**:
     - Expanded to **72 verified destinations** across all major Uttar Pradesh circuits.
     - Added 2 new primary categories with custom pins and chips:
       - **Nature & Wildlife (`nature`)**: Dudhwa National Park, Pilibhit Tiger Reserve, Katarniaghat, Chandra Prabha & Rajdari Falls, Sur Sarovar Keetham Lake, Hastinapur Grasslands, Saman Bird Sanctuary.
       - **Food & Bazaars (`food`)**: Tunday Kababi Chowk (Lucknow), Thaggu Ke Laddu (Kanpur), Kashi Vishwanath Chaat Gali (Varanasi), Brijwasi Peda (Mathura), Prakash Kulfi Aminabad, Agra Petha Mandi.
     - Added landmark resolution dictionary in `up-comprehensive-database.ts` with collision prevention (e.g., `agra` vs `prayagraj`).
  4. **AI Automation**:
     - Seamless route data and coordinate synchronization between Disha AI Chat and Leaflet Map.
   5. **AI Travel Copilot (Interactive AI + Map Co-Planning System)**:
     - **Natural Language Trip Generation**: Understands natural conversational prompts (e.g. *"I have 3 hours in Varanasi near Cantt railway station and need to return in 3 hours"*) with time allocations, transit modes, and safety buffers.
     - **Synchronized Map Route & Numbered Markers**: Renders numbered sequential stops (`1`, `2`, `3`...) on the map with visual states: completed (`✓`), current (`📍`), and upcoming (`→`).
     - **Dynamic Replanning**: Supports *"running 20m late"*, *"remove stop"*, *"add cafe"*, *"walk less"*, and *"make it cheaper"*.
     - **Interactive Copilot Timeline Drawer**: Slide-out drawer with one-tap actions (`+15m stay`, `Skip`, `Mark Done`), safety buffer tracking, and `✨ Optimize My Trip` (shortest travel distance heuristics).
     - **In-Chat Itinerary Card**: Rich preview card inside chat bubbles with instant *"Open Timeline"* and *"View on Map"* triggers.
     - **Map-to-AI Interactivity**: Every destination popup features *"Add to Copilot Trip"* and *"Is this worth visiting? (AI)"*.
   6. **Bot Multi-Service Optimization & Native Mobile Experience**:
     - **Cross-Service Intelligence**: Disha AI synthesizes Copilot trip itineraries, real-time district crowd metrics, live ground news bulletins, and scam advisories into unified responses.
     - **Sub-Millisecond Response Caching**: In-memory cache for repeated inquiries.
     - **100% Desktop View Preserved**: Dual-pillar layout (`lg:grid-cols-12`) and desktop header remain completely intact on screens >= 1024px.
     - **First-Class Mobile Phone Experience (< 1024px)**:
       - Compact mobile header without horizontal wrapping or cramped elements.
       - Native-feeling **Mobile Bottom Navigation Bar** with 4 key tabs: 💬 Disha AI, 🗺️ Map, 🧭 Copilot, 📰 News.
       - Full-screen height on mobile for Chat and Map without vertical compression.
       - Seamless mobile cross-pillar switches: tapping "View on Map" in chat opens Map; tapping "Ask Disha AI" on map opens Chat.
