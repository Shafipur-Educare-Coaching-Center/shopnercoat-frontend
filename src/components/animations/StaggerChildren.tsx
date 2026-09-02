'use client';
import { motion } from 'framer-motion';
import { variants } from '@/lib/animations';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerChildren({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div
      variants={variants.staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div variants={variants.staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
