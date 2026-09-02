'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';

function TooltipProvider({
  delay = 150,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

interface TooltipTriggerProps
  extends React.ComponentProps<typeof TooltipPrimitive.Trigger> {
  asChild?: boolean;
}

function TooltipTrigger({ asChild, children, ...props }: TooltipTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return <TooltipPrimitive.Trigger render={children} {...props} />;
  }
  return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>;
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  sideOffset?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner className="z-[9999]" side={side} sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            'z-[9999] overflow-hidden rounded-xl bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 border border-slate-700/80 select-none pointer-events-none',
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
