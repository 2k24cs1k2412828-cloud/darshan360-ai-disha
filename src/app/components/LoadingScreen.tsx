import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import darshanLogo from '../../images/WhatsApp_Image_2025-11-27_at_2.16.38_PM-removebg-preview.png';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#FAF8F5] dark:bg-stone-950"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 rounded-2xl bg-white/90 p-2 shadow-2xl flex items-center justify-center overflow-hidden border border-amber-500/20"
        >
          <img
            src={darshanLogo}
            alt="Darshan 360 logo"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-[#2C1810] dark:text-amber-100 mb-2 font-display tracking-tight"
        >
          Darshan 360
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[#5A4A3A] dark:text-stone-400 mb-6 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          Uttar Pradesh & Heritage Pilgrimage AI Portal
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 rounded-full bg-[#FF9933]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 rounded-full bg-[#FF9933]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 rounded-full bg-[#FF9933]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-[#5A4A3A] dark:text-stone-400 mt-6"
        >
          Preparing your sacred journey...
        </motion.p>
      </div>
    </motion.div>
  );
}
