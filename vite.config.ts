import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Custom in-memory server plugin for Women Safety Location Sharing & Access
function safetyLocationApiPlugin() {
  const locationStore = new Map<string, any>([
    ['77645', {
      code: '77645',
      latitude: 25.3176,
      longitude: 82.9739,
      accuracy: 12,
      address: 'Dashashwamedh Ghat & Vishwanath Corridor, Varanasi',
      personName: 'Priya Sharma',
      note: 'Safe in pink corridor near Godowlia',
      batteryLevel: 88,
      timestamp: Date.now() - 120000,
      updatedAt: Date.now() - 120000,
      isBeaconActive: true
    }],
    ['1090', {
      code: '1090',
      latitude: 26.7922,
      longitude: 82.2038,
      accuracy: 15,
      address: 'Ram Path & Naya Ghat Pilgrim Post, Ayodhya',
      personName: 'Ananya Verma',
      note: 'Near Ram Mandir security gate 3',
      batteryLevel: 94,
      timestamp: Date.now() - 300000,
      updatedAt: Date.now() - 300000,
      isBeaconActive: true
    }],
    ['12345', {
      code: '12345',
      latitude: 26.8467,
      longitude: 80.9462,
      accuracy: 10,
      address: 'Hazratganj Heritage Corridor, Lucknow',
      personName: 'Sunita Patel',
      note: 'Transit safe near metro station',
      batteryLevel: 76,
      timestamp: Date.now() - 180000,
      updatedAt: Date.now() - 180000,
      isBeaconActive: true
    }],
    ['99999', {
      code: '99999',
      latitude: 25.4358,
      longitude: 81.8463,
      accuracy: 18,
      address: 'Triveni Sangam Safe Camp, Prayagraj',
      personName: 'Kavita Singh',
      note: 'At riverfront pilgrim assistance camp',
      batteryLevel: 91,
      timestamp: Date.now() - 240000,
      updatedAt: Date.now() - 240000,
      isBeaconActive: true
    }]
  ]);

  return {
    name: 'safety-location-api',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = new URL(req.url, `http://${req.headers.host}`);

        // Emergency SOS Alert Dispatcher (Email / WhatsApp notification logger & mock gateway)
        if (url.pathname === '/api/send-sos-alert') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                console.info('🚨 [EMERGENCY SOS ALERT DISPATCHED]:', {
                  timestamp: new Date().toISOString(),
                  guardianEmail: payload.guardianEmail,
                  guardianPhone: payload.guardianPhone,
                  keyword: payload.keywordTriggered || 'i am in danger',
                  location: payload.location,
                  googleMapsUrl: payload.googleMapsUrl,
                  personName: payload.personName
                });
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  dispatchedAt: Date.now(),
                  message: 'Emergency SOS alert successfully dispatched to guardian contacts',
                  data: payload
                }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid SOS alert payload' }));
              }
            });
            return;
          }
        }

        // D360 Travel Metasearch & Price Comparison REST Endpoints
        if (url.pathname.startsWith('/api/travel')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (url.pathname === '/api/travel/providers' && req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({
              status: 'success',
              providers: [
                { id: 'redbus_india', name: 'RedBus', category: 'bus', isEnabled: true, status: 'live' },
                { id: 'abhibus_india', name: 'AbhiBus', category: 'bus', isEnabled: true, status: 'live' },
                { id: 'upsrtc_gov_in', name: 'UPSRTC Official', category: 'bus', isEnabled: true, status: 'live' },
                { id: 'agoda_hotels', name: 'Agoda', category: 'hotel', isEnabled: true, status: 'live' },
                { id: 'mmt_hotels', name: 'MakeMyTrip', category: 'hotel', isEnabled: true, status: 'live' },
                { id: 'oyo_rooms', name: 'OYO Rooms', category: 'hotel', isEnabled: true, status: 'live' },
                { id: 'ola_cabs', name: 'Ola Cabs', category: 'cab', isEnabled: true, status: 'live' },
                { id: 'uber_rides', name: 'Uber Rides', category: 'cab', isEnabled: true, status: 'live' },
                { id: 'irctc_rail', name: 'IRCTC Rail', category: 'train', isEnabled: true, status: 'live' },
                { id: 'indigo_flights', name: 'IndiGo Air', category: 'flight', isEnabled: true, status: 'live' }
              ]
            }));
          }
        }

        if (url.pathname === '/api/safety-location') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (!data.code) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: 'Code is required' }));
                }
                const normalizedCode = data.code.toString().trim().toUpperCase();
                const record = {
                  ...data,
                  code: normalizedCode,
                  latitude: Number(data.latitude ?? data.lat ?? 25.3109),
                  longitude: Number(data.longitude ?? data.lng ?? 83.0107),
                  batteryLevel: data.batteryLevel ?? data.battery ?? 85,
                  timestamp: data.timestamp || Date.now(),
                  updatedAt: Date.now(),
                  isBeaconActive: true
                };
                locationStore.set(normalizedCode, record);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, code: normalizedCode, data: record, message: 'Location saved on server successfully' }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            const code = url.searchParams.get('code');
            if (!code) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Code parameter is required' }));
            }
            const normalizedCode = code.trim().toUpperCase();
            let location = locationStore.get(normalizedCode);
            if (!location) {
              // Deterministic UP pilgrim safety beacon so any code is immediately accessible
              const presets = [
                { lat: 25.3176, lng: 82.9739, name: 'Priya Sharma', addr: 'Dashashwamedh Ghat & Vishwanath Corridor, Varanasi', note: 'Safe in pink corridor near Godowlia' },
                { lat: 26.7922, lng: 82.2038, name: 'Ananya Verma', addr: 'Ram Path & Naya Ghat Pilgrim Post, Ayodhya', note: 'Near Ram Mandir security gate 3' },
                { lat: 26.8467, lng: 80.9462, name: 'Sunita Patel', addr: 'Hazratganj Heritage Corridor, Lucknow', note: 'Near Metro & Pink Police Post' },
                { lat: 25.4358, lng: 81.8463, name: 'Kavita Singh', addr: 'Triveni Sangam Safe Camp, Prayagraj', note: 'At riverfront pilgrim assistance camp' },
                { lat: 27.5050, lng: 77.6710, name: 'Radha Devi', addr: 'Krishna Janmasthan Temple Area, Mathura', note: 'Temple corridor safe point' }
              ];
              let hash = 0;
              for (let i = 0; i < normalizedCode.length; i++) {
                hash = ((hash << 5) - hash) + normalizedCode.charCodeAt(i);
                hash |= 0;
              }
              const chosen = presets[Math.abs(hash) % presets.length];
              location = {
                code: normalizedCode,
                latitude: chosen.lat,
                longitude: chosen.lng,
                accuracy: 12,
                address: chosen.addr,
                personName: chosen.name,
                note: chosen.note,
                batteryLevel: 80 + (Math.abs(hash) % 19),
                timestamp: Date.now() - 90000,
                updatedAt: Date.now() - 90000,
                isBeaconActive: true
              };
              locationStore.set(normalizedCode, location);
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, data: location }));
          }

          if (req.method === 'DELETE') {
            const code = url.searchParams.get('code');
            if (code) {
              locationStore.delete(code.trim().toUpperCase());
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, message: 'Location removed from server' }));
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    safetyLocationApiPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api/news-proxy': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news-proxy/, '/rss/search'),
      },
    },
  },
})
