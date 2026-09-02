'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  value: string | string[];
  onValueChange: (value: string) => void;
  type: 'single' | 'multiple';
  collapsible?: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider');
  }
  return context;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: any) => void;
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = 'single',
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = true,
  className,
  children,
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return type === 'multiple' ? [] : '';
  });

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      let nextValue: string | string[];

      if (type === 'multiple') {
        const currentList = Array.isArray(value) ? value : [];
        if (currentList.includes(itemValue)) {
          nextValue = currentList.filter((v) => v !== itemValue);
        } else {
          nextValue = [...currentList, itemValue];
        }
      } else {
        if (value === itemValue && collapsible) {
          nextValue = '';
        } else {
          nextValue = itemValue;
        }
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [type, value, collapsible, controlledValue, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        type,
        collapsible,
      }}
    >
      <div className={cn('space-y-3', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within an AccordionItem');
  }
  return context;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selectedValue } = useAccordion();
    const isOpen = Array.isArray(selectedValue)
      ? selectedValue.includes(value)
      : selectedValue === value;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          className={cn(
            'rounded-xl border border-slate-200 bg-white transition-all overflow-hidden',
            isOpen ? 'border-slate-300 shadow-xs' : 'hover:border-slate-300',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconVariant?: 'plus-minus' | 'chevron';
  children: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, iconVariant = 'plus-minus', children, ...props }, ref) => {
    const { onValueChange } = useAccordion();
    const { value, isOpen } = useAccordionItem();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onValueChange(value)}
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'flex w-full items-center justify-between px-5 py-4 text-left font-sans text-sm md:text-base font-medium transition-colors select-none',
          isOpen
            ? 'bg-[#F0F7FA] text-slate-900 font-semibold'
            : 'text-slate-800 hover:bg-slate-50/80',
          className
        )}
        {...props}
      >
        <span className="pr-4 leading-snug">{children}</span>
        <div className="shrink-0 flex items-center justify-center">
          {iconVariant === 'plus-minus' ? (
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full transition-colors',
                isOpen ? 'text-teal-700' : 'text-slate-500'
              )}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </motion.div>
          ) : (
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-500 transition-transform duration-200',
                isOpen && 'rotate-180 text-primary'
              )}
            />
          )}
        </div>
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useAccordionItem();

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.24, delay: 0.05 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.15 },
              },
            }}
            className="overflow-hidden"
          >
            <div
              ref={ref}
              className={cn(
                'px-5 pt-3 pb-5 text-sm md:text-base text-slate-600 leading-relaxed font-normal bg-white border-t border-slate-100',
                className
              )}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
