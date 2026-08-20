import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { MapMarkerPopup } from './MapMarkerPopup';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPanelProps {
  theme: 'morning' | 'evening';
  compact?: boolean;
}

interface MarkerData {
  id: number;
  position: [number, number];
  title: string;
  description: string;
  image: string;
  category: string;
  categoryType: string;
}

const categories = [
  { id: 'hidden', label: 'Hidden Gems', color: '#8B5CF6' },
  { id: 'heritage', label: 'Heritage Tours', color: '#3B82F6' },
  { id: 'youth', label: 'Youth Picks', color: '#EC4899' },
  { id: 'cultural', label: 'Cultural Sites', color: '#F59E0B' },
  { id: 'airport', label: 'From Airport', color: '#10B981' },
  { id: 'budget', label: 'Budget Travel', color: '#6366F1' },
  { id: 'night', label: 'Night Vibes', color: '#8B5CF6' },
];

const markers: MarkerData[] = [
  {
    id: 1,
    position: [26.2315, 78.1734],
    title: 'Gwalior Fort',
    description: 'Magnificent hilltop fort with stunning views. UNESCO World Heritage Site with rich history.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
    category: 'Fort',
    categoryType: 'heritage',
  },
  {
    id: 2,
    position: [26.2183, 78.1828],
    title: 'Sas Bahu Temple',
    description: 'Beautiful 11th-century temple complex. Architectural marvel with intricate carvings.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
    category: 'Temple',
    categoryType: 'cultural',
  },
  {
    id: 3,
    position: [26.2123, 78.1576],
    title: 'Jai Vilas Palace',
    description: 'Opulent palace with Durbar Hall. Mix of European and Indian architecture.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
    category: 'Palace',
    categoryType: 'heritage',
  },
  {
    id: 4,
    position: [25.3518, 78.6408],
    title: 'Orchha Palace Complex',
    description: 'Royal palaces of Bundela dynasty. Stunning architecture and historical significance.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
    category: 'Palace',
    categoryType: 'heritage',
  },
  {
    id: 5,
    position: [25.3472, 78.6369],
    title: 'Ram Raja Temple',
    description: 'Unique temple where Lord Rama is worshipped as a king. Rich cultural heritage.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
    category: 'Temple',
    categoryType: 'cultural',
  },
  {
    id: 6,
    position: [26.2933, 78.2281],
    title: 'Gwalior Airport',
    description: 'Rajmata Vijaya Raje Scindia Air Terminal. Your gateway to Darshan 360 heritage experiences.',
    image: 'https://images.unsplash.com/photo-1759256243611-502772ac391b?w=400',
    category: 'Airport',
    categoryType: 'airport',
  },
  {
    id: 7,
    position: [26.2250, 78.1800],
    title: 'Hidden Heritage Café',
    description: 'Rooftop café with fort views. Perfect spot for cultural immersion and local cuisine.',
    image: 'https://images.unsplash.com/photo-1768844335653-7593a132c203?w=400',
    category: 'Hidden Spot',
    categoryType: 'hidden',
  },
];

// Polyline from Airport to Gwalior Fort
const routePath: [number, number][] = [
  [26.2933, 78.2281], // Gwalior Airport
  [26.2800, 78.2000],
  [26.2500, 78.1850],
  [26.2315, 78.1734], // Gwalior Fort
];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function MapPanel({ theme, compact = false }: MapPanelProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(['youth', 'spiritual']);
  const [showRoute, setShowRoute] = useState(true);
  const [mapCenter] = useState<[number, number]>([26.2183, 78.1828]); // Gwalior center

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredMarkers = markers.filter(marker =>
    activeFilters.length === 0 || activeFilters.includes(marker.categoryType)
  );

  const handleExplore = (marker: MarkerData) => {
    toast.success(`Exploring ${marker.title}`, {
      description: 'Opening detailed information...',
    });
  };

  const handleAddToPlan = (marker: MarkerData) => {
    toast.success(`Added ${marker.title} to your plan`, {
      description: 'Check your itinerary on the right panel',
    });
  };

  return (
    <div className="relative h-full w-full rounded-3xl overflow-hidden">
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapController center={mapCenter} />
        <TileLayer
          url={
            theme === 'morning'
              ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Route Polyline */}
        {showRoute && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: theme === 'morning' ? '#FF9933' : '#FFD700',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* Markers */}
        {filteredMarkers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup className="custom-popup" closeButton={false}>
              <MapMarkerPopup
                title={marker.title}
                description={marker.description}
                image={marker.image}
                category={marker.category}
                onExplore={() => handleExplore(marker)}
                onAddToPlan={() => handleAddToPlan(marker)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Filter Chips Overlay */}
      <div className={`absolute top-2 left-2 right-2 z-[1000] ${compact ? 'top-1 left-1 right-1' : 'top-4 left-4 right-4'}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl shadow-xl max-w-full ${compact ? 'p-2' : 'p-4'}`}
        >
          <div className={`flex items-center gap-2 mb-2 ${compact ? 'mb-1' : 'mb-3'}`}>
            <Navigation className={`text-[var(--accent-primary)] ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={`font-semibold text-[var(--text-primary)] ${compact ? 'text-xs' : 'text-sm'}`}>
              {compact ? 'Filters' : 'Filter Places'}
            </span>
          </div>
          <div className={`flex flex-wrap gap-1 ${compact ? 'gap-1' : 'gap-2'}`}>
            {categories.slice(0, compact ? 4 : categories.length).map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFilter(category.id)}
                className={`rounded-full font-medium transition-all duration-300 ${
                  compact
                    ? 'px-2 py-1 text-xs'
                    : 'px-3 py-1.5 text-xs'
                } ${
                  activeFilters.includes(category.id)
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:bg-opacity-20'
                }`}
              >
                {compact ? category.label.split(' ')[0] : category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Route Toggle */}
      <div className={`absolute z-[1000] ${compact ? 'bottom-1 left-1' : 'bottom-4 left-4'}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRoute(!showRoute)}
          className={`glass shadow-xl flex items-center gap-2 ${compact ? 'rounded-lg px-2 py-1.5' : 'rounded-xl px-4 py-2.5'}`}
        >
          <Navigation className={`text-[var(--accent-primary)] ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
          <span className={`font-medium text-[var(--text-primary)] ${compact ? 'text-xs' : 'text-sm'}`}>
            {showRoute ? 'Hide' : 'Show'}
          </span>
        </motion.button>
      </div>

      {/* Emergency Button */}
      {!compact && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-full p-3.5 shadow-xl bg-red-500 bg-opacity-90 hover:bg-opacity-100 transition-all"
            onClick={() => toast.error('Emergency Services', { description: 'Dial: +91-112 (Tourist Helpline)' })}
          >
            <AlertCircle className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      )}
    </div>
  );
}