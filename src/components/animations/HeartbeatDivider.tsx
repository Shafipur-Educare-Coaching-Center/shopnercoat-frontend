'use client';

import { motion } from 'framer-motion';

export function HeartbeatDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden text-primary/30 pointer-events-none" aria-hidden="true">
      <svg 
        viewBox="0 0 1200 100" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-[60px] md:h-[100px]"
      >
        <motion.path
          d="M -200 50 L 520 50 L 530 40 L 550 80 L 570 15 L 590 75 L 600 50 L 1400 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
    </div>
  );
}
