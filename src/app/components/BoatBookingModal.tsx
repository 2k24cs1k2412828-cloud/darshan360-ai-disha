import { X, Users, Clock, Star, Calendar, Sunrise, Moon, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface BoatBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const boatOptions = [
  {
    id: 1,
    title: 'Sunrise Shared Boat Ride',
    description: 'Experience the magical sunrise with other travelers. Perfect for budget-conscious youth.',
    image: 'https://images.unsplash.com/photo-1768844335653-7593a132c203?w=600',
    price: '₹500',
    duration: '2 hours',
    capacity: '12 people',
    rating: 4.9,
    time: '5:30 AM - 7:30 AM',
    icon: Sunrise,
    popular: true,
  },
  {
    id: 2,
    title: 'Evening Aarti Boat Experience',
    description: 'Witness the spectacular Ganga Aarti from the perfect vantage point on the river.',
    image: 'https://images.unsplash.com/photo-1763186868095-d63ef07ae843?w=600',
    price: '₹800',
    duration: '1.5 hours',
    capacity: '15 people',
    rating: 5.0,
    time: '6:00 PM - 7:30 PM',
    icon: Moon,
    popular: true,
  },
  {
    id: 3,
    title: 'Premium Spiritual Guided Tour',
    description: 'Private boat with expert guide explaining the spiritual significance of all 84 ghats.',
    image: 'https://images.unsplash.com/photo-1664823711178-1a0db71930e6?w=600',
    price: '₹3,500',
    duration: '3 hours',
    capacity: '6 people',
    rating: 4.8,
    time: 'Flexible timing',
    icon: Sparkles,
    popular: false,
  },
];

export function BoatBookingModal({ isOpen, onClose }: BoatBookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto p-0 bg-[var(--bg-secondary)] border-[var(--glass-border)]">
        <DialogTitle className="sr-only">Book Your Boat Experience</DialogTitle>
        <DialogDescription className="sr-only">
          Choose from our curated boat ride experiences in Varanasi including sunrise rides, evening Aarti tours, and premium guided experiences.
        </DialogDescription>
        
        <div className="sticky top-0 z-10 glass p-6 flex items-center justify-between border-b border-[var(--glass-border)]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Book Your Boat Experience</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Choose from our curated boat ride experiences</p>
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

        <div className="p-6 space-y-4">
          {boatOptions.map((boat, index) => {
            const Icon = boat.icon;
            return (
              <motion.div
                key={boat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-[var(--glass-border)]"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-[300px] h-[200px] relative">
                    <img
                      src={boat.image}
                      alt={boat.title}
                      className="w-full h-full object-cover"
                    />
                    {boat.popular && (
                      <div className="absolute top-3 right-3 bg-[var(--accent-primary)] text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Popular
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-[var(--accent-primary)] bg-opacity-20">
                            <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{boat.title}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                              <span className="text-sm font-semibold text-[var(--text-primary)]">{boat.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[var(--accent-primary)]">{boat.price}</div>
                          <div className="text-xs text-[var(--text-secondary)]">per person</div>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] mb-4">{boat.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>{boat.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Users className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>{boat.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>{boat.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}