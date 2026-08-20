import { X, Anchor, Users, Clock, Star, Utensils, MapPin, Hotel, Camera, GraduationCap, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = {
  heritage: [
    {
      id: 'heritage-1',
      title: 'Gwalior Fort Sunrise Tour',
      description: 'Explore the magnificent Gwalior Fort at dawn with expert guide. Witness the sunrise over the fort walls.',
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
      price: '₹800-1200',
      duration: '3 hours',
      capacity: '20 people',
      rating: 4.9,
      time: '6:00 AM - 9:00 AM',
      icon: Anchor,
      popular: true,
      details: ['Expert guide included', 'Sunrise photography', 'Historical insights', 'Light breakfast']
    },
    {
      id: 'heritage-2',
      title: 'Orchha Palace Evening Experience',
      description: 'Experience the royal palaces of Orchha with light and sound show. Most popular cultural immersion.',
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
      price: '₹1200-1500',
      duration: '2.5 hours',
      capacity: '25 people',
      rating: 5.0,
      time: '6:00 PM - 8:30 PM',
      icon: Anchor,
      popular: true,
      details: ['Light & sound show', 'Palace interiors', 'Cultural performance', 'Photo opportunities']
    },
    {
      id: 'heritage-3',
      title: 'Combined Heritage Circuit',
      description: 'Private guided tour covering both Gwalior Fort and Orchha Palaces in one comprehensive day.',
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
      price: '₹2500-3500',
      duration: '8 hours',
      capacity: '8 people',
      rating: 4.8,
      time: 'Flexible timing',
      icon: Anchor,
      popular: false,
      details: ['Private guide', 'Transportation included', 'Lunch provided', 'Photography guide']
    },
    {
      id: 'heritage-4',
      title: 'Night Heritage Walk',
      description: 'Illuminated night tour of Gwalior Fort with storytelling and local legends.',
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
      price: '₹1000-1500',
      duration: '2 hours',
      capacity: '15 people',
      rating: 4.7,
      time: '8:00 PM - 10:00 PM',
      icon: Anchor,
      popular: false,
      details: ['Night illumination', 'Local legends', 'Storytelling session', 'Safe guided walk']
    },
  ],
  dining: [
    {
      id: 'food-1',
      title: 'Malwa Cuisine Street Food Tour',
      description: 'Taste authentic Malwa delicacies at famous local eateries in Gwalior and Orchha.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      price: '₹400-600',
      duration: '2 hours',
      capacity: '4-8 people',
      rating: 4.8,
      time: '10:00 AM - 12:00 PM',
      icon: Utensils,
      popular: true,
      details: ['Dal Bafla & Bhujia', 'Poha Jalebi', 'Local stories', 'Health certified vendors']
    },
    {
      id: 'food-2',
      title: 'Heritage Restaurant Dinner',
      description: 'Fine dining in heritage hotels serving traditional Madhya Pradesh cuisine.',
      image: 'https://images.unsplash.com/photo-1680909434905-9f9f28512531?w=600',
      price: '₹1000-2000',
      duration: '2 hours',
      capacity: '2-10 people',
      rating: 4.6,
      time: '6:00 PM onwards',
      icon: Utensils,
      popular: false,
      details: ['Traditional Malwa food', 'Heritage ambiance', 'Vegetarian focus', 'Local wines available']
    },
    {
      id: 'food-3',
      title: 'Royal Thali Experience',
      description: 'Complete traditional Madhya Pradesh meal with 12-15 dishes at heritage restaurants.',
      image: 'https://images.unsplash.com/photo-1601050915162-f3aa08993ffe?w=600',
      price: '₹200-400',
      duration: '1.5 hours',
      capacity: '1-20 people',
      rating: 4.9,
      time: '11:30 AM - 3:00 PM',
      icon: Utensils,
      popular: true,
      details: ['Home-style cooking', 'Unlimited servings', 'No preservatives', 'Royal recipes']
    },
    {
      id: 'food-4',
      title: 'Cooking Class & Meal',
      description: 'Learn to cook traditional Malwa dishes and enjoy the meal with local ingredients.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      price: '₹800-1200',
      duration: '3 hours',
      capacity: '4-6 people',
      rating: 5.0,
      time: '10:00 AM - 1:00 PM',
      icon: Utensils,
      popular: false,
      details: ['Hands-on cooking', 'Expert instruction', 'Recipe cards provided', 'Eat your creation']
    },
  ],
  accommodation: [
    {
      id: 'hotel-1',
      title: 'Budget Guesthouse',
      description: 'Clean, basic rooms with shared facilities near Dashashwamedh Ghat.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
      price: '₹300-500',
      duration: 'Per night',
      capacity: '1-2 people',
      rating: 4.3,
      time: '24/7 Available',
      icon: Hotel,
      popular: true,
      details: ['WiFi available', 'Hot water 24/7', 'Shared bathroom', 'Budget-friendly']
    },
    {
      id: 'hotel-2',
      title: 'Mid-Range Hotel',
      description: 'Comfortable rooms with private bathroom, A/C, and river view options.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      price: '₹1000-2000',
      duration: 'Per night',
      capacity: '1-3 people',
      rating: 4.5,
      time: '24/7 Available',
      icon: Hotel,
      popular: true,
      details: ['Private bathroom', 'A/C rooms', 'Roof restaurant', 'Wake-up calls available']
    },
    {
      id: 'hotel-3',
      title: 'Luxury Riverside Hotel',
      description: 'Premium accommodation with Ganges view, spa, and fine dining options.',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600',
      price: '₹3000-6000',
      duration: 'Per night',
      capacity: '1-4 people',
      rating: 4.8,
      time: '24/7 Available',
      icon: Hotel,
      popular: false,
      details: ['Ganges view', 'Spa & wellness', 'Fine dining', 'Concierge service']
    },
    {
      id: 'hotel-4',
      title: 'Spiritual Ashram Stay',
      description: 'Meditation, yoga, and spiritual training with simple accommodation.',
      image: 'https://images.unsplash.com/photo-1511081692775-24a126c3deae?w=600',
      price: '₹500-800',
      duration: 'Per night',
      capacity: '1-2 people',
      rating: 4.6,
      time: '24/7 Available',
      icon: Hotel,
      popular: false,
      details: ['Daily yoga', 'Meditation sessions', 'Vegetarian meals', 'Spiritual guidance']
    },
  ],
  guides: [
    {
      id: 'guide-1',
      title: 'City Walking Tour Guide',
      description: 'Expert guide for temple tours, ghat explorations, and historical narratives.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      price: '₹800-1200',
      duration: '4 hours',
      capacity: '1-8 people',
      rating: 4.8,
      time: 'Flexible',
      icon: GraduationCap,
      popular: true,
      details: ['Licensed guide', 'English fluent', 'Historical expertise', 'Flexible routes']
    },
    {
      id: 'guide-2',
      title: 'Photography Tour Guide',
      description: 'Guide specialized in best photography spots, angles, and lighting for each location.',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
      price: '₹1000-1500',
      duration: '3 hours',
      capacity: '1-6 people',
      rating: 4.9,
      time: 'Sunrise/Sunset',
      icon: Camera,
      popular: true,
      details: ['Professional photographer', 'Editing tips', 'Location scouting', 'Equipment advice']
    },
    {
      id: 'guide-3',
      title: 'Spiritual & Mythology Guide',
      description: 'Deep dive into Hindu mythology, spiritual practices, and sacred narratives.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      price: '₹1500-2000',
      duration: '4 hours',
      capacity: '1-6 people',
      rating: 5.0,
      time: 'Flexible',
      icon: Heart,
      popular: false,
      details: ['Sanskrit knowledge', 'Mythology expert', 'Temple rituals explained', 'Spiritual insights']
    },
    {
      id: 'guide-4',
      title: 'Accessibility Specialist Guide',
      description: 'Trained guide for differently-abled travelers with wheelchair accessibility knowledge.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      price: '₹1000-1500',
      duration: '3-4 hours',
      capacity: '1-4 people',
      rating: 4.9,
      time: 'Flexible',
      icon: MapPin,
      popular: false,
      details: ['Accessibility trained', 'Wheelchair routes', 'Accessibility ratings', 'Support provided']
    },
  ],
};

export function ServiceBookingModal({ isOpen, onClose }: ServiceBookingModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const allServices = [
    ...services.heritage,
    ...services.dining,
    ...services.accommodation,
    ...services.guides,
  ];

  const renderServiceCard = (service: any, index: number) => {
    const Icon = service.icon;
    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        onClick={() => setSelectedService(service.id)}
        className={`glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border cursor-pointer transform hover:scale-102 ${
          selectedService === service.id
            ? 'border-[var(--accent-primary)] shadow-lg'
            : 'border-[var(--glass-border)]'
        }`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[280px] h-[180px] relative">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            {service.popular && (
              <div className="absolute top-3 right-3 bg-[var(--accent-primary)] text-white text-xs px-3 py-1 rounded-full font-semibold">
                Popular
              </div>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                  {service.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Users className="w-4 h-4" />
                  {service.capacity}
                </div>
                {service.rating && (
                  <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                    <Star className="w-4 h-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                    {service.rating}/5
                  </div>
                )}
              </div>

              {selectedService === service.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-[var(--text-secondary)] mb-3 flex flex-wrap gap-2"
                >
                  {service.details.map((detail: string, i: number) => (
                    <span
                      key={i}
                      className="bg-[var(--accent-primary)] bg-opacity-10 px-2 py-1 rounded text-[var(--accent-primary)]"
                    >
                      ✓ {detail}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border)]">
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Price</p>
                <p className="text-lg font-bold text-[var(--accent-primary)]">
                  {service.price}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Booking ${service.title}\n\nPrice: ${service.price}\nDuration: ${service.duration}\n\nRedirecting to payment...`);
                }}
                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              >
                Book Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto p-0 bg-[var(--bg-secondary)] border-[var(--glass-border)]">
        <DialogTitle className="sr-only">Book Services with Darshan 360</DialogTitle>
        <DialogDescription className="sr-only">
          Browse and book all available services with Darshan 360 including heritage tours, dining, accommodation, and guided tours for your spiritual journey.
        </DialogDescription>

        <div className="sticky top-0 z-10 glass p-6 flex items-center justify-between border-b border-[var(--glass-border)]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Book Services with Darshan 360</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Explore and book curated experiences - heritage tours, dining, accommodation & guides for your spiritual journey
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="heritage" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-[var(--bg-primary)] border border-[var(--glass-border)]">
              <TabsTrigger value="heritage" className="flex items-center gap-2">
                <Anchor className="w-4 h-4" />
                <span className="hidden sm:inline">Heritage</span>
              </TabsTrigger>
              <TabsTrigger value="dining" className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span className="hidden sm:inline">Dining</span>
              </TabsTrigger>
              <TabsTrigger value="stay" className="flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                <span className="hidden sm:inline">Stay</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Guides</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="heritage" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  🏰 Heritage Tours
                </h3>
                <div className="space-y-4">
                  {services.heritage.map((service, index) =>
                    renderServiceCard(service, index)
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dining" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  🍽️ Dining & Food
                </h3>
                <div className="space-y-4">
                  {services.dining.map((service, index) =>
                    renderServiceCard(service, index)
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stay" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  🏨 Accommodation
                </h3>
                <div className="space-y-4">
                  {services.accommodation.map((service, index) =>
                    renderServiceCard(service, index)
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  👨‍🏫 Guides & Tours
                </h3>
                <div className="space-y-4">
                  {services.guides.map((service, index) =>
                    renderServiceCard(service, index)
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
