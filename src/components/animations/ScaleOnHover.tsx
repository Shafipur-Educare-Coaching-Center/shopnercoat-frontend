'use client';
import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from '@/lib/animations';

export function ScaleOnHover({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={ANIMATION_CONFIG.spring.snappy}
      className={className}
    >
      {children}
    </motion.div>
  );
}
