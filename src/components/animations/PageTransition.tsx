'use client';
import { motion } from 'framer-motion';
import { variants, transitions } from '@/lib/animations';

export function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={transitions.smoothTween}
      className={className}
    >
      {children}
    </motion.div>
  );
}
