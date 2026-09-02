'use client';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/lib/animations';

export function CountUp({ to, duration = ANIMATION_CONFIG.duration.slow }: { to: number, duration?: number }) {
  const count = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    count.set(to);
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
}
