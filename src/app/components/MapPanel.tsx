import { useState, useEffect, useMemo, useRef } from 'react';
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
  Fullscreen,
  Shrink,
  Columns2,
  Waves,
  Footprints,
  Clock,
  X,
  ArrowUpDown,
  Route,
  Trees,
  UtensilsCrossed,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Plus,
  Droplets,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MP_PLACES as UP_PLACES, 
  MP_TRAVEL_ROUTES as UP_TRAVEL_ROUTES, 
  type MPPlace as UPPlace, 
  type MPRoute as UPRoute,
  calculateDynamicMPRoute as calculateDynamicUPRoute,
  MP_CITY_COORDINATES as UP_CITY_COORDINATES,
  MP_LANDMARK_COORDINATES as UP_LANDMARK_COORDINATES
} from '../../data/mp-comprehensive-database';
import type { TripItinerary } from '../services/copilotService';
import { getAuthenticTourismImage } from '../services/tourismImageService';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Category Color Pin creator
function createCustomIcon(category: string, isHighlighted: boolean = false) {
  let color = '#EA580C'; // orange default (temple)
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
  } else if (category === 'nature') {
    color = '#059669'; // forest green
    badgeIcon = '🌲';
  } else if (category === 'food') {
    color = '#D97706'; // warm amber/culinary
    badgeIcon = '🍲';
  } else if (category === 'waterfall') {
    color = '#0284C7'; // deep sky blue
    badgeIcon = '💧';
  } else if (category === 'craft') {
    color = '#D946EF'; // rich fuchsia/magenta
    badgeIcon = '🎨';
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

// Custom Numbered Pin Creator for AI Travel Copilot Itinerary Stops
function createCopilotNumberedIcon(
  stopNumber: number,
  status: 'completed' | 'current' | 'upcoming'
) {
  let bgColor = '#4F46E5'; // royal indigo default
  let borderColor = '#FFFFFF';
  let haloHtml = '';

  if (status === 'completed') {
    bgColor = '#10B981'; // emerald green
  } else if (status === 'current') {
    bgColor = '#EA580C'; // glowing saffron
    borderColor = '#FEF08A'; // golden border
    haloHtml = `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(234, 88, 12, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -1;"></div>`;
  }

  const size = status === 'current' ? 38 : 32;
  const content = status === 'completed' ? '✓' : `${stopNumber}`;

  const svgIcon = `
    <div style="position: relative; width: ${size}px; height: ${size + 6}px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      ${haloHtml}
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${bgColor}; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 4px 14px rgba(0,0,0,0.4); 
        border: 2.5px solid ${borderColor};
        color: #FFFFFF;
        font-weight: 900;
        font-size: ${status === 'current' ? '15px' : '13px'};
        font-family: sans-serif;
      ">
        ${content}
      </div>
      <div style="
        width: 6px; 
        height: 6px; 
        background: rgba(0,0,0,0.35); 
        border-radius: 50%; 
        margin-top: 1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-copilot-marker',
    html: svgIcon,
    iconSize: [size, size + 6],
    iconAnchor: [size / 2, size + 3],
    popupAnchor: [0, -size - 3]
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
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, animate: true });
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
  isWindowFullScreen?: boolean;
  onToggleWindowFullScreen?: () => void;
  onClearActiveRoute?: () => void;
  activeItinerary?: TripItinerary | null;
  onAddPlaceToItinerary?: (place: UPPlace) => void;
}

export function MapPanel({
  theme,
  language,
  onSelectPlaceForChat,
  selectedCoordinates,
  activeRouteWaypoints,
  isFullScreen = false,
  onToggleFullScreen,
  isWindowFullScreen,
  onToggleWindowFullScreen,
  onClearActiveRoute,
  activeItinerary,
  onAddPlaceToItinerary
}: MapPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [focusCenter, setFocusCenter] = useState<[number, number] | null>(null);

  // Directions & Navigation Drawer State
  const [isDirectionsOpen, setIsDirectionsOpen] = useState<boolean>(false);
  const [directionsFrom, setDirectionsFrom] = useState<string>('Gwalior');
  const [directionsTo, setDirectionsTo] = useState<string>('Orchha');
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState<boolean>(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState<boolean>(false);
  const [calculatedRoute, setCalculatedRoute] = useState<ReturnType<typeof calculateDynamicUPRoute>>(null);

  // Google Maps & Satellite Layer Selector State (100% Free Forever)
  const [mapLayerType, setMapLayerType] = useState<'google-streets' | 'google-satellite' | 'google-terrain' | 'carto'>('google-streets');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const layerMenuRef = useRef<HTMLDivElement>(null);

  // Close search suggestions & layer menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (layerMenuRef.current && !layerMenuRef.current.contains(event.target as Node)) {
        setIsLayerMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync external coordinates from Chat
  useEffect(() => {
    if (selectedCoordinates) {
      setFocusCenter(selectedCoordinates);
    }
  }, [selectedCoordinates]);

  // List of all popular MP cities and landmarks for route autocomplete
  const routeLocationOptions = useMemo(() => {
    const list: Array<{ id: string; name: string; hindi: string; type: 'city' | 'landmark' }> = [];
    
    // Cities
    Object.entries(UP_CITY_COORDINATES).forEach(([key, val]) => {
      list.push({ id: key, name: val.name, hindi: val.hindi, type: 'city' });
    });

    // Landmarks
    Object.entries(UP_LANDMARK_COORDINATES).forEach(([key, val]) => {
      list.push({ id: key, name: `${val.name} (${val.city})`, hindi: `${val.hindi} (${val.city})`, type: 'landmark' });
    });

    return list;
  }, []);

  // Compute live search autocomplete results
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 1) return [];

    return UP_PLACES.filter(place => {
      return (
        place.name.toLowerCase().includes(q) ||
        place.hindiName.includes(q) ||
        place.city.toLowerCase().includes(q) ||
        place.hindiCity.includes(q) ||
        place.tags.some(tag => tag.includes(q))
      );
    }).slice(0, 6);
  }, [searchQuery]);

  // Filter Categories for Madhya Pradesh Tourism
  const filterCategories = [
    { id: 'all', label: { en: 'All MP Sites', hi: 'सभी म.प्र. स्थल' }, icon: Layers, count: UP_PLACES.length },
    { id: 'heritage', label: { en: 'Forts & Palaces', hi: 'किले व राजमहल' }, icon: Compass, count: UP_PLACES.filter(p => p.category === 'heritage').length },
    { id: 'temple', label: { en: 'Ancient Temples', hi: 'प्राचीन मंदिर' }, icon: Sparkles, count: UP_PLACES.filter(p => p.category === 'temple').length },
    { id: 'monument', label: { en: 'Memorials & Museums', hi: 'स्मारक व संग्रहालय' }, icon: MapPin, count: UP_PLACES.filter(p => p.category === 'monument').length },
    { id: 'buddhist', label: { en: 'Buddhist Stupas', hi: 'बौद्ध महातीर्थ' }, icon: Footprints, count: UP_PLACES.filter(p => p.category === 'buddhist').length },
    { id: 'waterfall', label: { en: 'Waterfalls & Rivers', hi: 'जलप्रपात व नदियां' }, icon: Droplets, count: UP_PLACES.filter(p => p.category === 'waterfall').length },
    { id: 'craft', label: { en: 'Chanderi Craft', hi: 'चंदेरी शिल्प' }, icon: Palette, count: UP_PLACES.filter(p => p.category === 'craft').length },
  ];

  // Filtered places: only display markers when user explicitly selects a category filter, searches, or focuses a place
  const filteredPlaces = useMemo(() => {
    // 1. If user typed a search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return UP_PLACES.filter(place => {
        const matchesSearch = 
          place.name.toLowerCase().includes(q) ||
          place.hindiName.includes(q) ||
          place.city.toLowerCase().includes(q) ||
          place.hindiCity.includes(q) ||
          place.tags.some(tag => tag.includes(q)) ||
          (q === 'ghat' && place.category === 'ghat');

        const matchesCat = !selectedCategory || selectedCategory === 'all' || place.category === selectedCategory;
        return matchesSearch && matchesCat;
      });
    }

    // 2. If a specific place was chosen from Chat or focused
    if (focusCenter) {
      const focusedPlace = UP_PLACES.find(place => 
        Math.abs(focusCenter[0] - place.coordinates[0]) < 0.01 && 
        Math.abs(focusCenter[1] - place.coordinates[1]) < 0.01
      );
      if (focusedPlace && !selectedCategory) {
        return [focusedPlace];
      }
    }

    // 3. Clean map by default: only show markers when user explicitly clicks a category filter!
    if (!selectedCategory) {
      return [];
    }

    if (selectedCategory === 'all') {
      return UP_PLACES;
    }

    return UP_PLACES.filter(place => place.category === selectedCategory);
  }, [searchQuery, selectedCategory, focusCenter]);

  // Active circuit route
  const activeCircuit = UP_TRAVEL_ROUTES.find(r => r.id === activeRouteId);
  
  // Resolved polyline coordinates: dynamic calculation > copilot itinerary > external chat route > circuit route > null
  const currentRoutePolyline = calculatedRoute 
    ? calculatedRoute.waypoints 
    : (activeItinerary && activeItinerary.stops.length > 1
        ? activeItinerary.stops.map(s => s.coordinates)
        : (activeRouteWaypoints || (activeCircuit ? activeCircuit.waypoints : null)));

  // Dynamic Tile Configuration for Google Maps & Satellite
  const currentTileConfig = useMemo(() => {
    switch (mapLayerType) {
      case 'google-satellite':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          subdomains: ['0', '1', '2', '3'],
          attribution: '&copy; Google Maps Satellite Imagery',
          maxZoom: 20
        };
      case 'google-terrain':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          subdomains: ['0', '1', '2', '3'],
          attribution: '&copy; Google Maps Terrain',
          maxZoom: 20
        };
      case 'carto':
        return {
          url: theme === 'morning'
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          subdomains: ['a', 'b', 'c'],
          attribution: '&copy; OpenStreetMap & CARTO',
          maxZoom: 19
        };
      case 'google-streets':
      default:
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['0', '1', '2', '3'],
          attribution: '&copy; Google Maps',
          maxZoom: 20
        };
    }
  }, [mapLayerType, theme]);

  // Handle route calculation
  const handleCalculateRoute = () => {
    if (!directionsFrom.trim() || !directionsTo.trim()) return;
    const res = calculateDynamicUPRoute(directionsFrom, directionsTo);
    if (res) {
      setCalculatedRoute(res);
      setActiveRouteId(null);
      setFocusCenter(res.waypoints[0]);
    }
  };

  // Swap Origin and Destination
  const handleSwapDirections = () => {
    const temp = directionsFrom;
    setDirectionsFrom(directionsTo);
    setDirectionsTo(temp);
    if (calculatedRoute) {
      const res = calculateDynamicUPRoute(directionsTo, temp);
      if (res) {
        setCalculatedRoute(res);
      }
    }
  };

  // Clear all routes
  const handleClearRoute = () => {
    setCalculatedRoute(null);
    setActiveRouteId(null);
    if (onClearActiveRoute) {
      onClearActiveRoute();
    }
    setFocusCenter([26.7956, 82.1943]);
  };

  // Pre-fill directions from marker popup
  const handleSetDirectionsFromPlace = (place: UPPlace, asOrigin: boolean) => {
    setIsDirectionsOpen(true);
    if (asOrigin) {
      setDirectionsFrom(place.name);
      if (directionsTo) {
        const res = calculateDynamicUPRoute(place.name, directionsTo);
        if (res) setCalculatedRoute(res);
      }
    } else {
      setDirectionsTo(place.name);
      if (directionsFrom) {
        const res = calculateDynamicUPRoute(directionsFrom, place.name);
        if (res) setCalculatedRoute(res);
      }
    }
  };

  const handleResetMap = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveRouteId(null);
    setCalculatedRoute(null);
    if (onClearActiveRoute) onClearActiveRoute();
    setFocusCenter([26.0, 78.3]); // Center back to MP Heritage Corridor
  };

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden bg-white/50 dark:bg-black/40">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Search Box with Live Autocomplete */}
          <div ref={searchBoxRef} className="relative flex-1 max-w-sm">
            <div className="glass glass-dimmed rounded-full px-3.5 py-2 flex items-center gap-2 shadow-xl border border-[var(--glass-border)] backdrop-blur-md">
              <Search className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setFocusCenter(null);
                }}
                placeholder={language === 'hi' ? 'मध्य प्रदेश के किले, मंदिर, शहर खोजें (ग्वालियर, ओरछा, बटेश्वर)...' : 'Search MP places, forts, temples (Gwalior, Orchha, Bateshwar)...'}
                className="bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none w-full font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1.5 glass rounded-2xl p-1.5 shadow-2xl border border-[var(--glass-border)] backdrop-blur-xl z-[1200] max-h-72 overflow-y-auto"
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--glass-border)] mb-1">
                    {language === 'hi' ? 'खोज परिणाम' : 'Suggested Places'} ({searchSuggestions.length})
                  </div>
                  {searchSuggestions.map(place => (
                    <button
                      key={place.id}
                      onClick={() => {
                        setFocusCenter(place.coordinates);
                        setSearchQuery(language === 'hi' ? place.hindiName : place.name);
                        setIsSearchFocused(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base flex-shrink-0">
                          {place.category === 'ghat' ? '🌊' : 
                           place.category === 'heritage' ? '🏰' : 
                           place.category === 'buddhist' ? '☸️' : 
                           place.category === 'monument' ? '🏛️' : 
                           place.category === 'nature' ? '🌲' : 
                           place.category === 'food' ? '🍲' : '🛕'}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {language === 'hi' ? place.hindiName : place.name}
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)] truncate">
                            📍 {language === 'hi' ? place.hindiCity : place.city}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] font-medium flex-shrink-0 ml-2">
                        {language === 'hi' ? place.categoryLabel.hi : place.categoryLabel.en}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons: Directions, Reset & Full-Screen */}
          <div className="flex items-center gap-1.5">
            {/* Directions Drawer Toggle */}
            <button
              onClick={() => setIsDirectionsOpen(prev => !prev)}
              className={`px-3 py-2 rounded-full shadow-lg transition-all text-xs font-bold flex items-center gap-1.5 border border-[var(--glass-border)] ${
                isDirectionsOpen || calculatedRoute
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'glass text-[var(--text-primary)] hover:scale-105'
              }`}
              title={language === 'hi' ? 'मध्य प्रदेश हाईवे मार्ग व दिशाएं' : 'MP Highway Directions'}
            >
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'दूरी व दिशाएं' : 'Directions'}
              </span>
              {calculatedRoute && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>

            {/* Google Maps Layer Switcher */}
            <div className="relative" ref={layerMenuRef}>
              <button
                onClick={() => setIsLayerMenuOpen(prev => !prev)}
                className={`px-3 py-2 rounded-full shadow-lg transition-all text-xs font-bold border border-[var(--glass-border)] cursor-pointer flex items-center gap-1.5 ${
                  isLayerMenuOpen
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'glass text-[var(--text-primary)] hover:scale-105'
                }`}
                title={language === 'hi' ? 'गूगल मैप्स लेयर बदलें' : 'Map Layers (Streets, Satellite, Terrain)'}
              >
                <Layers className={`w-4 h-4 flex-shrink-0 ${isLayerMenuOpen ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
                <span className="text-xs font-semibold whitespace-nowrap">
                  {mapLayerType === 'google-streets'
                    ? (language === 'hi' ? 'गूगल मैप्स' : 'Google Maps')
                    : mapLayerType === 'google-satellite'
                    ? (language === 'hi' ? 'सैटेलाइट' : 'Satellite')
                    : mapLayerType === 'google-terrain'
                    ? (language === 'hi' ? 'टेरेन' : 'Terrain')
                    : (language === 'hi' ? 'वेक्टर मैप' : 'Vector Map')}
                </span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${isLayerMenuOpen ? 'rotate-180 text-white' : 'text-[var(--text-secondary)]'}`} />
              </button>

              <AnimatePresence>
                {isLayerMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-11 z-50 min-w-[170px] glass rounded-2xl shadow-2xl p-1.5 border border-[var(--glass-border)] flex flex-col gap-1 backdrop-blur-xl bg-white/95 dark:bg-neutral-900/95"
                  >
                    <button
                      onClick={() => { setMapLayerType('google-streets'); setIsLayerMenuOpen(false); }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        mapLayerType === 'google-streets'
                          ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                          : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">🗺️ Google Streets</span>
                      {mapLayerType === 'google-streets' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => { setMapLayerType('google-satellite'); setIsLayerMenuOpen(false); }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        mapLayerType === 'google-satellite'
                          ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                          : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">🛰️ Google Satellite</span>
                      {mapLayerType === 'google-satellite' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => { setMapLayerType('google-terrain'); setIsLayerMenuOpen(false); }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        mapLayerType === 'google-terrain'
                          ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                          : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">⛰️ Google Terrain</span>
                      {mapLayerType === 'google-terrain' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => { setMapLayerType('carto'); setIsLayerMenuOpen(false); }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        mapLayerType === 'carto'
                          ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                          : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">🎨 Clean Vector</span>
                      {mapLayerType === 'carto' && <span className="text-xs">✓</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Map */}
            <button
              onClick={handleResetMap}
              className="glass p-2.5 rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
              title={language === 'hi' ? 'मानचित्र रीसेट करें' : 'Reset View to MP Heritage'}
            >
              <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
            </button>

            {/* Panel View Expand / Split Toggle */}
            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                className="glass p-2.5 rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium text-[var(--text-primary)] border border-[var(--glass-border)] cursor-pointer"
                title={isFullScreen ? (language === 'hi' ? 'द्वैत दृश्य में बदलें' : 'Switch to Split View') : (language === 'hi' ? 'मानचित्र विस्तृत करें' : 'Expand Map View')}
              >
                {isFullScreen ? (
                  <Columns2 className="w-4 h-4 text-[var(--accent-primary)]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[var(--accent-primary)]" />
                )}
              </button>
            )}

            {/* Dedicated Window Full Screen Toggle */}
            {onToggleWindowFullScreen && (
              <button
                onClick={onToggleWindowFullScreen}
                className={`glass p-2.5 rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium border cursor-pointer ${
                  isWindowFullScreen
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                    : 'border-[var(--glass-border)] text-[var(--text-primary)]'
                }`}
                title={
                  isWindowFullScreen
                    ? (language === 'hi' ? 'पूर्ण स्क्रीन विंडो से बाहर निकलें (Esc)' : 'Exit Full Screen Window (Esc)')
                    : (language === 'hi' ? 'पूर्ण स्क्रीन विंडो (Esc से बाहर निकलें)' : 'Full Screen Window (Press Esc to exit)')
                }
                aria-label="Toggle Full Screen Window"
              >
                {isWindowFullScreen ? (
                  <Shrink className="w-4 h-4 text-[var(--accent-primary)]" />
                ) : (
                  <Fullscreen className="w-4 h-4 text-[var(--accent-primary)]" />
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
                  setSelectedCategory(prev => prev === cat.id ? null : cat.id);
                  setFocusCenter(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-md border ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white border-transparent shadow-sm'
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

      {/* Floating Google Maps-Style Directions Drawer */}
      <AnimatePresence>
        {isDirectionsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 sm:top-28 left-3 right-3 sm:right-auto z-[1100] max-w-[calc(100vw-24px)] sm:w-96 glass rounded-2xl p-3.5 shadow-2xl border border-[var(--glass-border)] backdrop-blur-xl flex flex-col gap-3 max-h-[75vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                <Navigation className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{language === 'hi' ? 'मध्य प्रदेश यात्रा मार्ग व दूरी कैलकुलेटर' : 'MP Route & Highway Navigator'}</span>
              </div>
              <button
                onClick={() => setIsDirectionsOpen(false)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inputs: From / To with Swap */}
            <div className="space-y-2">
              {/* Origin */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-white/70 dark:bg-black/40 border border-[var(--glass-border)] rounded-xl px-2.5 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={directionsFrom}
                    onChange={(e) => setDirectionsFrom(e.target.value)}
                    onFocus={() => setIsFromDropdownOpen(true)}
                    placeholder={language === 'hi' ? 'प्रारंभिक शहर या स्थल...' : 'Origin city or landmark...'}
                    className="bg-transparent text-xs text-[var(--text-primary)] outline-none w-full font-medium"
                  />
                  <button
                    onClick={() => setIsFromDropdownOpen(prev => !prev)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isFromDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl shadow-xl border border-[var(--glass-border)] p-1 z-[1300] max-h-44 overflow-y-auto">
                    {routeLocationOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDirectionsFrom(opt.name);
                          setIsFromDropdownOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[11px] rounded-lg hover:bg-black/5 dark:hover:bg-white/10 truncate font-medium text-[var(--text-primary)]"
                      >
                        {opt.type === 'landmark' ? '🏛️ ' : '📍 '}{opt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1">
                <button
                  onClick={handleSwapDirections}
                  className="p-1 rounded-full bg-white dark:bg-neutral-800 shadow border border-[var(--glass-border)] hover:scale-110 transition-transform text-[var(--accent-primary)]"
                  title={language === 'hi' ? 'प्रस्थान व गंतव्य बदलें' : 'Swap Origin and Destination'}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Destination */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-white/70 dark:bg-black/40 border border-[var(--glass-border)] rounded-xl px-2.5 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={directionsTo}
                    onChange={(e) => setDirectionsTo(e.target.value)}
                    onFocus={() => setIsToDropdownOpen(true)}
                    placeholder={language === 'hi' ? 'गंतव्य शहर या धाम...' : 'Destination city or shrine...'}
                    className="bg-transparent text-xs text-[var(--text-primary)] outline-none w-full font-medium"
                  />
                  <button
                    onClick={() => setIsToDropdownOpen(prev => !prev)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isToDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl shadow-xl border border-[var(--glass-border)] p-1 z-[1300] max-h-44 overflow-y-auto">
                    {routeLocationOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDirectionsTo(opt.name);
                          setIsToDropdownOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[11px] rounded-lg hover:bg-black/5 dark:hover:bg-white/10 truncate font-medium text-[var(--text-primary)]"
                      >
                        {opt.type === 'landmark' ? '🏛️ ' : '📍 '}{opt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculateRoute}
              className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--accent-primary)] text-white shadow hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
            >
              <Route className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सटीक मार्ग एवं दूरी प्राप्त करें' : 'Compute Highway Route'}</span>
            </button>

            {/* Calculated Route Details Card */}
            {calculatedRoute && (
              <div className="rounded-xl p-2.5 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 space-y-2 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                    {language === 'hi' ? 'सत्यापित हाईवे ट्रैक' : 'Verified Route Track'}
                  </span>
                  <span className="text-xs font-extrabold text-[var(--text-primary)]">
                    {calculatedRoute.distanceKm} km
                  </span>
                </div>

                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  ⏱️ {calculatedRoute.estimatedDrivingTime}
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  🛣️ {language === 'hi' ? calculatedRoute.highwayName?.hi : calculatedRoute.highwayName?.en}
                </div>

                {/* Stoppages */}
                <div className="pt-1 border-t border-orange-500/20 text-[10px] text-[var(--text-secondary)] space-y-0.5">
                  <p>• {calculatedRoute.recommendedStops[0]}</p>
                  <p>• {calculatedRoute.recommendedStops[1]}</p>
                  <p>• {calculatedRoute.recommendedStops[2]}</p>
                </div>

                {/* Bottom Actions: Clear Route & Ask AI */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-orange-500/20">
                  <button
                    onClick={handleClearRoute}
                    className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-[var(--text-primary)] hover:bg-neutral-300 dark:hover:bg-neutral-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === 'hi' ? 'रूट हटाएं' : 'Clear Route'}</span>
                  </button>

                  {onSelectPlaceForChat && (
                    <button
                      onClick={() => {
                        const prompt = language === 'hi'
                          ? `${calculatedRoute.name.hi} (${calculatedRoute.distanceKm} किमी) की यात्रा योजना, टोल, प्रमुख ढाबा/स्टॉप और दर्शनीय स्थलों के बारे में बताएं।`
                          : `Tell me detailed travel tips, highway tolls, midway rest stops, and itinerary for ${calculatedRoute.name.en} (~${calculatedRoute.distanceKm} km).`;
                        onSelectPlaceForChat(prompt);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-[var(--accent-primary)] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{language === 'hi' ? 'घूमो AI परामर्श' : 'Ask Ghumo AI'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Leaflet Map */}
      <div className="w-full h-full">
        <MapContainer
          center={[26.0, 78.3]}
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            key={mapLayerType}
            attribution={currentTileConfig.attribution}
            url={currentTileConfig.url}
            subdomains={currentTileConfig.subdomains}
            maxZoom={currentTileConfig.maxZoom}
          />

          <MapViewManager
            places={filteredPlaces}
            routeWaypoints={currentRoutePolyline}
            focusCenter={focusCenter}
          />

          {/* Destination Markers */}
          {filteredPlaces.map(place => {
            const isMatch = focusCenter && Math.abs(focusCenter[0] - place.coordinates[0]) < 0.001;
            return (
              <Marker
                key={place.id}
                position={place.coordinates}
                icon={createCustomIcon(place.category, !!isMatch)}
              >
                <Popup className="custom-popup" maxWidth={340}>
                  <div className="p-3 space-y-2 text-[var(--text-primary)] font-sans">
                    {/* Photo thumbnail */}
                    {place.images.length > 0 && (
                      <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={getAuthenticTourismImage(place.id, place.name, place.images[0]?.url)}
                          alt={place.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('photo-1609342122563')) {
                              target.src = 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=800&q=80';
                            }
                          }}
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

                    {/* Click-to-Route Actions (Google Maps Style) */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => handleSetDirectionsFromPlace(place, true)}
                        className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-white/80 dark:bg-neutral-800 text-[var(--text-primary)] hover:bg-white dark:hover:bg-neutral-700 border border-[var(--glass-border)] flex items-center justify-center gap-1 transition-all"
                        title="Set as Starting Point"
                      >
                        <span>🚩 {language === 'hi' ? 'यहाँ से शुरू' : 'From Here'}</span>
                      </button>

                      <button
                        onClick={() => handleSetDirectionsFromPlace(place, false)}
                        className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-white/80 dark:bg-neutral-800 text-[var(--text-primary)] hover:bg-white dark:hover:bg-neutral-700 border border-[var(--glass-border)] flex items-center justify-center gap-1 transition-all"
                        title="Set as Destination"
                      >
                        <span>🏁 {language === 'hi' ? 'यहाँ तक मार्ग' : 'Directions To'}</span>
                      </button>
                    </div>

                    {/* Add to Copilot Itinerary Button */}
                    {onAddPlaceToItinerary && (
                      <button
                        onClick={() => onAddPlaceToItinerary(place)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 transition-all mt-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'यात्रा कोपायलट में जोड़ें (+)' : 'Add to Copilot Trip (+)'}</span>
                      </button>
                    )}

                    {/* Ask AI: Is this worth visiting? */}
                    {onSelectPlaceForChat && (
                      <button
                        onClick={() => {
                          const prompt = language === 'hi'
                            ? `क्या ${place.hindiName} (${place.hindiCity}) मेरी वर्तमान यात्रा योजना के अनुसार घूमने लायक है? इसके मुख्य आकर्षण क्या हैं?`
                            : `Is ${place.name} in ${place.city} worth visiting according to my current trip plan and schedule? What are its top highlights?`;
                          onSelectPlaceForChat(prompt);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-700 dark:text-indigo-300 border border-indigo-600/30 flex items-center justify-center gap-1.5 transition-all mt-1 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'क्या यह घूमने लायक है? (AI)' : 'Is this worth visiting? (AI)'}</span>
                      </button>
                    )}

                    {/* Ask AI Trigger Button */}
                    {onSelectPlaceForChat && (
                      <button
                        onClick={() => {
                          const prompt = language === 'hi'
                            ? `मुझे ${place.hindiName} (${place.hindiCity}) के दर्शन, इतिहास, यात्रा कारण, भीड़ की स्थिति और फोटो के बारे में बताएं।`
                            : `Tell me detailed travel causes, history, crowd status, timings, routes, and photos for ${place.name} in ${place.city}.`;
                          onSelectPlaceForChat(prompt);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[var(--accent-primary)] text-white shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 transition-all mt-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'घूमो AI से इस स्थल की जानकारी लें' : 'Ask Ghumo AI about this place'}</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* AI Travel Copilot Numbered Itinerary Markers */}
          {activeItinerary && activeItinerary.stops.map(stop => (
            <Marker
              key={stop.id}
              position={stop.coordinates}
              icon={createCopilotNumberedIcon(stop.stopNumber, stop.status)}
              zIndexOffset={1000 + stop.stopNumber}
            >
              <Popup className="custom-popup" maxWidth={320}>
                <div className="p-3 space-y-2 text-[var(--text-primary)] font-sans">
                  <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-white">
                      Stop #{stop.stopNumber}
                    </span>
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">
                      {stop.startTime} – {stop.endTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {language === 'hi' ? stop.hindiName : stop.name}
                  </h3>

                  <div className="bg-orange-500/10 dark:bg-orange-500/20 p-2 rounded-lg border border-orange-500/20 text-[10px]">
                    <span className="font-bold text-[var(--accent-primary)] uppercase block text-[9px]">
                      {language === 'hi' ? '✨ चयन का कारण' : '✨ Why This Place?'}
                    </span>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {language === 'hi' ? stop.whyThisPlaceHi : stop.whyThisPlace}
                    </p>
                  </div>

                  {onSelectPlaceForChat && (
                    <button
                      onClick={() => {
                        const prompt = language === 'hi'
                          ? `मुझे पड़ाव ${stop.stopNumber} (${stop.hindiName}) के बारे में विस्तृत सुझाव और समय सीमा बताएं।`
                          : `Tell me detailed tips and visiting guidance for Stop ${stop.stopNumber}: ${stop.name}.`;
                        onSelectPlaceForChat(prompt);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-[var(--accent-primary)] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-all mt-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'घूमो AI से इस पड़ाव की सलाह लें' : 'Consult Ghumo AI about this stop'}</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Active Route Polyline with Solid Styling */}
          {currentRoutePolyline && currentRoutePolyline.length > 1 && (
            <Polyline
              positions={currentRoutePolyline}
              pathOptions={{
                color: '#EA580C',
                weight: 5.5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Bottom Route Selector Bar with Pre-configured Circuits & Active Route Banner */}
      <div className="absolute bottom-20 lg:bottom-3 left-3 right-3 z-[1000] pointer-events-none flex flex-col items-center gap-2">
        {/* Helper Hint when map is in clean view */}
        {!selectedCategory && !searchQuery.trim() && !focusCenter && !currentRoutePolyline && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-full px-3.5 py-1.5 shadow-lg border border-[var(--glass-border)] flex items-center gap-2 backdrop-blur-md pointer-events-auto text-[11px] font-medium text-[var(--text-secondary)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'मानचित्र पर स्थल देखने हेतु ऊपर दिए गए किसी फिल्टर (मंदिर, घाट, किले) पर टैप करें'
                : 'Select a filter category above (Temples, Ghats, Forts) to display markers'}
            </span>
          </motion.div>
        )}

        {/* Active Route Indicator Banner if Route is Plotted */}
        {calculatedRoute && (
          <div className="pointer-events-auto glass rounded-full px-4 py-1.5 shadow-xl border border-[var(--glass-border)] flex items-center gap-3 backdrop-blur-md">
            <span className="text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
              <Route className="w-4 h-4" />
              <span>{calculatedRoute.distanceKm} km • {calculatedRoute.estimatedDrivingTime}</span>
            </span>
            <button
              onClick={handleClearRoute}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>{language === 'hi' ? 'रूट साफ़ करें' : 'Clear Route'}</span>
            </button>
          </div>
        )}

        {/* Circuit Buttons */}
        <div className="glass glass-dimmed rounded-2xl p-2 shadow-2xl border border-[var(--glass-border)] flex items-center gap-1.5 overflow-x-auto max-w-full pointer-events-auto backdrop-blur-md">
          <span className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider px-2 flex items-center gap-1 flex-shrink-0">
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'तीर्थ परिपथ (Routes):' : 'Circuits & Routes:'}</span>
          </span>
          {UP_TRAVEL_ROUTES.map(route => {
            const isRouteActive = activeRouteId === route.id && !calculatedRoute;
            return (
              <button
                key={route.id}
                onClick={() => {
                  if (isRouteActive) {
                    setActiveRouteId(null);
                    setFocusCenter(null);
                  } else {
                    setCalculatedRoute(null);
                    setActiveRouteId(route.id);
                    setFocusCenter(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  isRouteActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
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