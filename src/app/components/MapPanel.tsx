import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Search, 
  Layers, 
  Compass, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Waves,
  Footprints,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UP_PLACES, UP_TRAVEL_ROUTES, getAllUPGhats, type UPPlace, type UPRoute } from '../services/uttarPradeshService';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Category Color Pin creator
function createCustomIcon(category: string, isHighlighted: boolean = false) {
  let color = '#EA580C'; // orange default
  let badgeIcon = '🛕';

  if (category === 'ghat') {
    color = '#0284C7'; // river blue
    badgeIcon = '🌊';
  } else if (category === 'temple') {
    color = '#EA580C'; // saffron
    badgeIcon = '🛕';
  } else if (category === 'heritage') {
    color = '#9333EA'; // royal purple
    badgeIcon = '🏰';
  } else if (category === 'buddhist') {
    color = '#EAB308'; // golden
    badgeIcon = '☸️';
  } else if (category === 'monument') {
    color = '#10B981'; // emerald
    badgeIcon = '🏛️';
  }

  const size = isHighlighted ? 46 : 38;
  const svgIcon = `
    <div style="position: relative; width: ${size}px; height: ${size + 10}px; display: flex; flex-direction: column; align-items: center;">
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${color}; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.35); 
        border: 2.5px solid #FFFFFF;
      ">
        <span style="transform: rotate(45deg); font-size: ${isHighlighted ? '18px' : '15px'};">${badgeIcon}</span>
      </div>
      <div style="
        width: 8px; 
        height: 8px; 
        background: rgba(0,0,0,0.3); 
        border-radius: 50%; 
        margin-top: -2px; 
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -size - 5]
  });
}

// Subcomponent to dynamically control map bounds and animations
function MapViewManager({
  places,
  routeWaypoints,
  focusCenter
}: {
  places: UPPlace[];
  routeWaypoints: [number, number][] | null;
  focusCenter: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (focusCenter) {
      map.flyTo(focusCenter, 14, { duration: 1.2 });
      return;
    }

    if (routeWaypoints && routeWaypoints.length > 1) {
      const bounds = L.latLngBounds(routeWaypoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
      return;
    }

    if (places.length > 0 && places.length < UP_PLACES.length) {
      const coords = places.map(p => p.coordinates);
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: true });
    }
  }, [places, routeWaypoints, focusCenter, map]);

  return null;
}

interface MapPanelProps {
  theme: 'morning' | 'evening';
  language: 'en' | 'hi';
  onSelectPlaceForChat?: (prompt: string) => void;
  selectedCoordinates?: [number, number] | null;
  activeRouteWaypoints?: [number, number][] | null;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export function MapPanel({
  theme,
  language,
  onSelectPlaceForChat,
  selectedCoordinates,
  activeRouteWaypoints,
  isFullScreen = false,
  onToggleFullScreen
}: MapPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [focusCenter, setFocusCenter] = useState<[number, number] | null>(null);

  // Sync external coordinates from Chat
  useEffect(() => {
    if (selectedCoordinates) {
      setFocusCenter(selectedCoordinates);
    }
  }, [selectedCoordinates]);

  // Filter Categories
  const filterCategories = [
    { id: 'all', label: { en: 'All Destinations', hi: 'सभी स्थल' }, icon: Layers, count: UP_PLACES.length },
    { id: 'ghat', label: { en: 'All Holy Ghats', hi: 'सभी पावन घाट' }, icon: Waves, count: getAllUPGhats().length },
    { id: 'temple', label: { en: 'Temples & Mandirs', hi: 'पवित्र मंदिर' }, icon: Sparkles, count: UP_PLACES.filter(p => p.category === 'temple').length },
    { id: 'heritage', label: { en: 'Heritage & Forts', hi: 'विरासत एवं दुर्ग' }, icon: Compass, count: UP_PLACES.filter(p => p.category === 'heritage').length },
    { id: 'buddhist', label: { en: 'Buddhist Circuit', hi: 'बौद्ध परिपथ' }, icon: Footprints, count: UP_PLACES.filter(p => p.category === 'buddhist').length },
    { id: 'monument', label: { en: 'Monuments', hi: 'ऐतिहासिक स्मारक' }, icon: MapPin, count: UP_PLACES.filter(p => p.category === 'monument').length },
  ];

  // Filtered places
  const filteredPlaces = UP_PLACES.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    
    if (!searchQuery.trim()) return matchesCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      place.name.toLowerCase().includes(q) ||
      place.hindiName.includes(q) ||
      place.city.toLowerCase().includes(q) ||
      place.hindiCity.includes(q) ||
      place.tags.some(tag => tag.includes(q)) ||
      (q === 'ghat' && place.category === 'ghat');

    return matchesCategory && matchesSearch;
  });

  const activeRoute = UP_TRAVEL_ROUTES.find(r => r.id === activeRouteId);
  const currentRoutePolyline = activeRouteWaypoints || (activeRoute ? activeRoute.waypoints : null);

  const tileUrl = theme === 'morning'
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const handleResetMap = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveRouteId(null);
    setFocusCenter([26.7956, 82.1943]); // Center back to UP
  };

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden bg-white/50 dark:bg-black/40">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Search Box */}
          <div className="flex-1 max-w-sm glass glass-dimmed rounded-full px-3.5 py-2 flex items-center gap-2 shadow-xl border border-[var(--glass-border)] backdrop-blur-md">
            <Search className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusCenter(null);
              }}
              placeholder={language === 'hi' ? 'उत्तर प्रदेश के घाट, मंदिर, शहर खोजें...' : 'Search UP ghats, temples, cities...'}
              className="bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Reset & Full-Screen */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetMap}
              className="glass p-2.5 rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
              title={language === 'hi' ? 'मानचित्र रीसेट करें' : 'Reset View to All UP'}
            >
              <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
            </button>

            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                className="glass p-2.5 rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Map'}
              >
                {isFullScreen ? (
                  <Minimize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide pointer-events-auto">
          {filterCategories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setFocusCenter(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-md border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white border-transparent shadow-orange-500/30 ring-2 ring-orange-400/50'
                    : 'glass text-[var(--text-primary)] border-[var(--glass-border)] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? cat.label.hi : cat.label.en}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                  {cat.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Leaflet Map */}
      <div className="w-full h-full">
        <MapContainer
          center={[26.7956, 82.1943]}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />

          <MapViewManager
            places={filteredPlaces}
            routeWaypoints={currentRoutePolyline}
            focusCenter={focusCenter}
          />

          {/* Markers */}
          {filteredPlaces.map(place => {
            const isMatch = focusCenter && Math.abs(focusCenter[0] - place.coordinates[0]) < 0.001;
            return (
              <Marker
                key={place.id}
                position={place.coordinates}
                icon={createCustomIcon(place.category, !!isMatch)}
              >
                <Popup className="custom-popup" maxWidth={330}>
                  <div className="p-3 space-y-2 text-[var(--text-primary)] font-sans">
                    {/* Photo thumbnail */}
                    {place.images.length > 0 && (
                      <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={place.images[0].url}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="glass rounded-full px-2 py-0.5 text-[10px] font-semibold text-white bg-black/60 backdrop-blur-md">
                            {language === 'hi' ? place.categoryLabel.hi : place.categoryLabel.en}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="glass rounded-full px-2 py-0.5 text-[10px] font-medium text-white bg-black/60">
                            📍 {language === 'hi' ? place.hindiCity : place.city}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                        {language === 'hi' ? place.hindiName : place.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {language === 'hi' ? place.description.hi : place.description.en}
                      </p>
                    </div>

                    {/* Travel Cause / Significance */}
                    <div className="bg-orange-500/10 dark:bg-orange-500/20 p-2 rounded-lg border border-orange-500/20">
                      <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider block">
                        {language === 'hi' ? '✨ आध्यात्मिक व सांस्कृतिक महत्व' : '✨ Spiritual & Cultural Cause'}
                      </span>
                      <p className="text-[11px] text-[var(--text-primary)] line-clamp-2 mt-0.5">
                        {language === 'hi' ? place.travelCause.hi : place.travelCause.en}
                      </p>
                    </div>

                    {/* Accessibility & Timings */}
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1 border-t border-[var(--glass-border)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--accent-primary)]" />
                        {language === 'hi' ? place.timings.hi.split('(')[0] : place.timings.en.split('(')[0]}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ♿ {place.accessibilityRating}/10
                      </span>
                    </div>

                    {/* Ask AI Trigger Button */}
                    {onSelectPlaceForChat && (
                      <button
                        onClick={() => {
                          const prompt = language === 'hi'
                            ? `मुझे ${place.hindiName} (${place.hindiCity}) के दर्शन, इतिहास, यात्रा कारण, भीड़ की स्थिति और फोटो के बारे में बताएं।`
                            : `Tell me detailed travel causes, history, crowd status, timings, routes, and photos for ${place.name} in ${place.city}.`;
                          onSelectPlaceForChat(prompt);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all mt-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'दिशा AI से इस स्थल की जानकारी लें' : 'Ask Disha AI about this place'}</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Active Route Polyline */}
          {currentRoutePolyline && currentRoutePolyline.length > 1 && (
            <Polyline
              positions={currentRoutePolyline}
              pathOptions={{
                color: '#EA580C',
                weight: 5,
                opacity: 0.85,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Bottom Route Selector Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] pointer-events-none flex justify-center">
        <div className="glass glass-dimmed rounded-2xl p-2 shadow-2xl border border-[var(--glass-border)] flex items-center gap-1.5 overflow-x-auto max-w-full pointer-events-auto backdrop-blur-md">
          <span className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider px-2 flex items-center gap-1 flex-shrink-0">
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'तीर्थ परिपथ (Routes):' : 'Circuits & Routes:'}</span>
          </span>
          {UP_TRAVEL_ROUTES.map(route => {
            const isRouteActive = activeRouteId === route.id;
            return (
              <button
                key={route.id}
                onClick={() => {
                  if (isRouteActive) {
                    setActiveRouteId(null);
                    setFocusCenter(null);
                  } else {
                    setActiveRouteId(route.id);
                    setFocusCenter(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  isRouteActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg ring-2 ring-orange-400/50'
                    : 'bg-white/70 dark:bg-black/50 text-[var(--text-primary)] hover:bg-white/90'
                }`}
              >
                <span>{language === 'hi' ? route.name.hi.split('(')[0] : route.name.en.split('(')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 ml-0.5">
                  {route.distanceKm} km
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}