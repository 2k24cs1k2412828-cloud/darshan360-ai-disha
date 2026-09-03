# 🕌 Darshan 360 — Uttar Pradesh AI Travel Companion

<div align="center">

![Darshan 360 Banner](https://img.shields.io/badge/Darshan%20360-AI%20Travel%20Companion-orange?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered spiritual, cultural & heritage tourism platform for Uttar Pradesh**

[✨ Features](#-features) · [🚀 Getting Started](#-getting-started) · [🏗️ Architecture](#️-architecture) · [🗺️ Covered Destinations](#️-covered-destinations) · [🛡️ .env Setup](#️-environment-variables) · [📦 Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Darshan 360** is a bilingual, AI-powered travel companion designed specifically for pilgrims and tourists exploring the rich spiritual and cultural heritage of **Uttar Pradesh, India**. Built for the **GWL Hackathon**, it combines real-time AI guidance, interactive maps, voice interaction, and curated local knowledge to create an unparalleled travel experience.

Whether you're planning a visit to the ghats of **Varanasi**, seeking darshan at **Ram Mandir, Ayodhya**, or exploring the **Taj Mahal in Agra** — Disha AI has you covered, in Hindi or English.

---

## ✨ Features

### 🤖 Disha AI — Bilingual Travel Assistant
- **Bilingual Support**: Seamlessly switch between **Hindi (हिन्दी)** and **English**
- **Voice Input (STT)**: Speech-to-Text with live recording wave animation using the Web Speech API
- **Voice Output (TTS)**: Natural voice synthesis with play/stop controls
- **Smart Responses**: Covers travel causes, spiritual significance, history, temple timings, budget breakdowns, and darshan rules
- **Live UP Tourism News**: Real-time updates on Maha Kumbh / Magh Mela, Ram Mandir online Aarti passes, Kashi Vishwanath corridor rules, Varanasi ropeway, and Braj Holi
- **In-Chat Interactive Maps**: Route previews with one-click full-screen map navigation
- **In-Chat Image Galleries**: High-definition photo showcases with lightbox zoom
- **Safety & Scam Advisory**: Tips to avoid boat overcharging, fake VIP passes, plus emergency numbers
- **Itinerary Generator**: AI-curated day-wise travel itineraries
- **Service Booking Modal**: Boat booking, guided tours, and more

### 🗺️ Interactive UP Tourism Map
- Covers **11+ major destinations** across Uttar Pradesh
- **Category Filters**: Temples & Pilgrimages, Ghats & Rivers, Heritage Forts, Buddhist Circuit, Historical Monuments
- **Pre-configured Circuit Routes**:
  - 🏹 Ramayana Circuit
  - 🕌 Braj-Mughal Triangle
  - ☸️ Awadh-Buddhist Route
- **Click-to-Chat popup cards** — trigger instant AI inquiries directly from the map
- **Layout Modes**: Split View, Full Chat, Full Map

### 🎨 UI/UX Highlights
- Day / Night theme toggle
- Glassmorphism design with smooth animations
- Responsive layout with resizable panels
- Darshan 360 Insights dashboard
- Heritage Gallery with masonry layout

---

## 🗺️ Covered Destinations

| City | Highlights |
|------|------------|
| **Ayodhya** | Ram Mandir, Hanuman Garhi, Saryu Ghat |
| **Varanasi / Kashi** | Kashi Vishwanath, Dashashwamedh Ghat, Ganga Aarti |
| **Mathura** | Krishna Janmabhoomi, Dwarkadhish Temple |
| **Vrindavan** | Banke Bihari Temple, ISKCON, Prem Mandir |
| **Agra** | Taj Mahal, Agra Fort, Fatehpur Sikri |
| **Prayagraj** | Triveni Sangam, Anand Bhavan, Kumbh Mela grounds |
| **Lucknow** | Bara Imambara, Rumi Darwaza, Chota Imambara |
| **Sarnath** | Dhamek Stupa, Deer Park, Sarnath Museum |
| **Kushinagar** | Mahaparinirvana Temple, Ramabhar Stupa |
| **Chitrakoot** | Kamadgiri, Hanuman Dhara, Gupt Godavari |
| **Jhansi** | Jhansi Fort, Rani Mahal |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** `>= 18.x`
- **npm** or **pnpm** (pnpm recommended)
- A **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/darshan-360.git
cd darshan-360
```

### 2. Set Up Environment Variables

> ⚠️ **IMPORTANT**: Never commit your `.env` file to GitHub. It is already added to `.gitignore`.

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then open `.env` and add your key:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at **`http://localhost:5173`**

### 5. Build for Production

```bash
npm run build
# or
pnpm build
```

The output will be in the `dist/` folder.

---

## 🛡️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for the Disha AI assistant |

> 💡 **Offline Fallback**: If no API key is provided or the API call fails, the app falls back to curated local responses from `uttarPradeshService.ts`.

---

## 🏗️ Architecture

```
darshan-360/
├── src/
│   ├── main.tsx                        # App entry point
│   ├── app/
│   │   ├── App.tsx                     # Root layout: themes, mode switches, language toggle
│   │   ├── components/
│   │   │   ├── ChatPanel.tsx           # Disha AI chat: voice I/O, map cards, photo galleries
│   │   │   ├── MapPanel.tsx            # Leaflet interactive UP map: filters, routes, pins
│   │   │   ├── Darshan360Insights.tsx  # Tourism insights dashboard
│   │   │   ├── HeritageGallery.tsx     # Masonry photo gallery
│   │   │   ├── ServiceBookingModal.tsx # Booking interface (boats, guides, etc.)
│   │   │   ├── BoatBookingModal.tsx    # Ganga boat booking flow
│   │   │   ├── HelpGuide.tsx          # Onboarding help guide
│   │   │   ├── LoadingScreen.tsx       # Splash loading screen
│   │   │   └── MapMarkerPopup.tsx      # Map click-to-chat popup cards
│   │   └── services/
│   │       ├── geminiService.ts        # Gemini AI integration with intent parsing & fallback
│   │       ├── uttarPradeshService.ts  # Curated UP database (87KB of structured data)
│   │       ├── speechService.ts        # Web Speech API wrapper (Hindi + English STT/TTS)
│   │       ├── itineraryService.ts     # AI itinerary generation service
│   │       ├── scamDetectionService.ts # Scam & safety advisory engine
│   │       └── madhyaPradeshService.ts # Extended MP destination data
│   ├── data/                           # Static datasets
│   ├── images/                         # Local image assets
│   └── styles/                         # Global CSS styles
├── index.html
├── vite.config.ts
├── postcss.config.mjs
├── package.json
├── .env.example                        # Template for environment setup
└── .gitignore
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 + Emotion |
| **UI Components** | Radix UI + MUI + shadcn/ui |
| **Maps** | Leaflet + React-Leaflet |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Voice** | Web Speech API (STT + TTS) |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React + MUI Icons |
| **Routing** | React Router v7 |
| **Charts** | Recharts |
| **Markdown** | react-markdown + markdown-it |

---

## 🗒️ `.env.example`

Create this file and commit it (without real keys) so other contributors know what variables to set:

```bash
# .env.example
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🙈 `.gitignore` Checklist

Make sure your `.gitignore` includes:

```gitignore
# Environment variables — NEVER commit these
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build output
dist/
dist.zip

# Editor / OS files
.DS_Store
*.log
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🏆 Built For

> **GWL Hackathon** — AI-powered solutions for spiritual & cultural tourism in Uttar Pradesh, India.

---

<div align="center">

Made with ❤️ for the pilgrims and travellers of Uttar Pradesh

**Jai Shri Ram 🙏 | Har Har Mahadev 🕉️ | Jai Mata Di 🪔**

</div>
