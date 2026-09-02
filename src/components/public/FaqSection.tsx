'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { FadeIn } from '@/components/animations/FadeIn';
import { FAQ_DATA } from '@/data/faqData';

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [activeAccordion, setActiveAccordion] = useState<string>('gen-1');

  const currentCategory =
    FAQ_DATA.find((cat) => cat.id === activeCategory) || FAQ_DATA[0];

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const selected = FAQ_DATA.find((cat) => cat.id === categoryId);
    if (selected && selected.items.length > 0) {
      setActiveAccordion(selected.items[0].id);
    }
  };

  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#FAF8FF] via-white to-[#E8F8F5]/60 border-b border-border/50">
      {/* Subtle ambient decorative glows */}
      <div
        className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase mb-3.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Support
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.08}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.16}>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Our platform is built to help you navigate medical admissions seamlessly. Find answers
              to common questions about requirements, procedures, and support.
            </p>
          </FadeIn>
        </div>

        {/* FAQ Main Card Wrapper matching reference design */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Category Tabs Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {/* Mobile / Tablet Horizontal Scroll Bar */}
              <div className="flex lg:hidden overflow-x-auto no-scrollbar pb-2 gap-2 -mx-2 px-2">
                {FAQ_DATA.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all select-none flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#E8F8F5] border border-teal-200/80 text-teal-800 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Desktop Vertical Tabs */}
              <div className="hidden lg:flex flex-col gap-2.5">
                {FAQ_DATA.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`relative w-full flex items-center justify-between px-4.5 py-3.5 rounded-xl text-left text-sm md:text-base font-semibold transition-all duration-200 select-none ${
                        isActive
                          ? 'bg-[#E8F8F5] border border-teal-200/80 text-teal-800 shadow-2xs'
                          : 'bg-white/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-teal-700 shrink-0 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Accordion Content with animated transitions */}
            <div className="lg:col-span-8 min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    value={activeAccordion}
                    onValueChange={(val) => setActiveAccordion(val)}
                  >
                    {currentCategory.items.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger iconVariant="plus-minus">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
