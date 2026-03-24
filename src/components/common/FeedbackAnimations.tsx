import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';

// Slide out animation for deletions
export function SlideOut({ children, isVisible }: { children: ReactNode; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, x: 0, height: 'auto' }}
          exit={{ opacity: 0, x: 300, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shake animation for errors
export function Shake({ trigger, children }: { trigger: boolean; children: ReactNode }) {
  return (
    <motion.div
      animate={
        trigger
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Scale pop for success actions
export function ScalePop({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation for lists
export function StaggerList({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Confetti launcher
export async function launchConfetti() {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'],
    });
  } catch {
    // canvas-confetti not available, silently skip
  }
}

// Number counter animation
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}
