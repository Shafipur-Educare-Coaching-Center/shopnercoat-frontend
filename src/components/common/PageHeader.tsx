import React from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, className, children }: { title: string, description?: string, className?: string, children?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-heading">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
