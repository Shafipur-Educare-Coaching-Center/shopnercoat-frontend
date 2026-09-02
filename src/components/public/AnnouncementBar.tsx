'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBarProps {
  id?: string;
  message?: string;
}

export function AnnouncementBar({ 
  id = 'default-urgent', 
  message = 'Registration for 2024-25 session is now open! Limited seats available.' 
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage to see if user already dismissed this specific announcement
    const dismissed = sessionStorage.getItem(`announcement_dismissed_${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(`announcement_dismissed_${id}`, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-[#E6F7F5] border-b border-teal-100 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
            {/* Spacer to perfectly center the text if window allows */}
            <div className="w-8 hidden md:block shrink-0" />
            
            <div className="flex items-start md:items-center justify-center flex-1 gap-2 text-primary">
              <Megaphone className="w-4 h-4 shrink-0 mt-0.5 md:mt-0" />
              <p className="text-[13px] md:text-sm font-medium leading-snug text-center">
                {message}
              </p>
            </div>

            <button 
              onClick={handleDismiss}
              className="shrink-0 text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
