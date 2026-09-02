'use client';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/lib/animations';

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  separator?: string;
}

export function CountUp({ 
  to, 
  duration = ANIMATION_CONFIG.duration.slow,
  decimals = 0,
  separator = ''
}: CountUpProps) {
  const count = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const formatted = useTransform(count, (latest) => {
    // Determine rounding based on decimals
    const factor = Math.pow(10, decimals);
    const value = Math.round(latest * factor) / factor;
    
    // Format to string
    let str = value.toFixed(decimals);
    
    // Add separator if specified (e.g. comma)
    if (separator) {
      const parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      str = parts.join('.');
    }
    
    return str;
  });

  useEffect(() => {
    count.set(to);
  }, [count, to]);

  return <motion.span>{formatted}</motion.span>;
}
