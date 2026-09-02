'use client';
import { motion } from 'framer-motion';
import { variants, ANIMATION_CONFIG } from '@/lib/animations';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = 'up', className }: FadeInProps) {
  let variant: any = variants.fadeInUp;
  if (direction === 'none') variant = variants.fadeIn;
  else if (direction === 'left') variant = variants.slideInLeft;
  else if (direction === 'right') variant = variants.slideInRight;

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{ ...ANIMATION_CONFIG.spring.gentle, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
