import { useState } from 'react';
import { HelpCircle, X, Lightbulb, Map, MessageCircle, Ship } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

export function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: Map,
      title: 'Interactive Map',
      description: 'Click markers to see details. Use filter chips to show/hide locations.',
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Ask Darshan 360 anything about sacred heritage sites. Use quick action buttons for common queries.',
    },
    {
      icon: Ship,
      title: 'Boat Booking',
      description: 'Click the floating "Book Boat Ride" button to see all available experiences.',
    },
    {
      icon: Lightbulb,
      title: 'Theme Toggle',
      description: 'Switch between Morning and Evening modes using the top-right button.',
    },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="glass rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
      >
        <HelpCircle className="w-5 h-5 text-[var(--accent-primary)]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
            >
              <div className="glass rounded-2xl p-6 shadow-2xl border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    Quick Guide
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-[var(--accent-primary)] hover:bg-opacity-20 transition-all"
                  >
                    <X className="w-5 h-5 text-[var(--text-primary)]" />
                  </button>
                </div>

                <div className="space-y-4">
                  {tips.map((tip, index) => {
                    const Icon = tip.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-primary)] bg-opacity-20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {tip.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white"
                >
                  Got it!
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
