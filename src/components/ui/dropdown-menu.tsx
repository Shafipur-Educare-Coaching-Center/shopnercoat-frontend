'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cn } from '@/lib/utils';

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root {...props} />;
}

interface DropdownMenuTriggerProps
  extends React.ComponentProps<typeof MenuPrimitive.Trigger> {
  asChild?: boolean;
}

function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return <MenuPrimitive.Trigger render={children} {...props} />;
  }
  return <MenuPrimitive.Trigger {...props}>{children}</MenuPrimitive.Trigger>;
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  side = 'bottom',
  align = 'end',
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup> & {
  sideOffset?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} sideOffset={sideOffset} align={align}>
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 text-slate-800 shadow-[0_12px_36px_rgba(20,40,90,0.12)] backdrop-blur-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 outline-hidden',
            className
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

interface DropdownMenuItemProps
  extends React.ComponentProps<typeof MenuPrimitive.Item> {
  asChild?: boolean;
}

function DropdownMenuItem({
  asChild,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  if (asChild && React.isValidElement(children)) {
    return (
      <MenuPrimitive.Item
        data-slot="dropdown-menu-item"
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-hidden transition-colors hover:bg-slate-100/80 hover:text-slate-900 focus:bg-slate-100/80 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
          className
        )}
        render={children}
        {...props}
      />
    );
  }
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-hidden transition-colors hover:bg-slate-100/80 hover:text-slate-900 focus:bg-slate-100/80 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Item>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1.5 my-1 h-px bg-slate-200/80', className)}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn(
        'px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
