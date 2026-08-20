import { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Image as ImageIcon, Camera, Star } from 'lucide-react';

interface HeritageImage {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  category: string;
}

const heritageImages: HeritageImage[] = [
  {
    id: 1,
    title: 'Gwalior Fort',
    location: 'Gwalior, Madhya Pradesh',
    description: 'Magnificent hilltop fort with stunning views and rich history. UNESCO World Heritage Site featuring ancient palaces and temples.',
    image: 'https://share.google/X8NHyjqXia9NxDNMq',
    rating: 4.8,
    category: 'Fort'
  },
  {
    id: 2,
    title: 'Sas Bahu Temple',
    location: 'Gwalior, Madhya Pradesh',
    description: 'Beautiful 11th-century temple complex showcasing intricate carvings and architectural marvel of the Gurjara-Pratihara dynasty.',
    image: 'https://share.google/Y4YswGCnZYrAaeVmx',
    rating: 4.6,
    category: 'Temple'
  },
  {
    id: 3,
    title: 'Jai Vilas Palace',
    location: 'Gwalior, Madhya Pradesh',
    description: 'Opulent palace blending European and Indian architecture, home to the famous Durbar Hall with crystal chandeliers.',
    image: 'https://share.google/cioEkaSMNaN7khjP3',
    rating: 4.7,
    category: 'Palace'
  },
  {
    id: 4,
    title: 'Orchha Palace Complex',
    location: 'Orchha, Madhya Pradesh',
    description: 'Royal palaces of the Bundela dynasty featuring stunning architecture, frescoes, and historical significance.',
    image: 'https://share.google/1YUfb5srd0NKJ0QYE',
    rating: 4.9,
    category: 'Palace'
  },
  {
    id: 5,
    title: 'Ram Raja Temple',
    location: 'Orchha, Madhya Pradesh',
    description: 'Unique temple where Lord Rama is worshipped as a king, featuring beautiful architecture and cultural heritage.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
    rating: 4.5,
    category: 'Temple'
  },
  {
    id: 6,
    title: 'Gwalior Fort Walls',
    location: 'Gwalior, Madhya Pradesh',
    description: 'Impressive fortification walls stretching over 3km, offering panoramic views of the surrounding landscape.',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
    rating: 4.4,
    category: 'Fort'
  }
];

interface HeritageGalleryProps {
  theme: 'morning' | 'evening';
}

export function HeritageGallery({ theme }: HeritageGalleryProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[var(--accent-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Heritage Gallery
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Explore Darshan 360's heritage journey through stunning visuals
        </p>
      </div>

      {/* Scrollable Image Gallery */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {heritageImages.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl overflow-hidden shadow-lg border border-[var(--glass-border)]"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3 glass rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {item.rating}
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="glass rounded-full px-2 py-1 text-xs font-medium text-[var(--text-primary)]">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-[var(--accent-primary)] mb-2">
                📍 {item.location}
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}