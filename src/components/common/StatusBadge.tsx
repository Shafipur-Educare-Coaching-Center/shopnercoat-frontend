import { STATUS_COLORS, STATUS_LABELS } from '@/constants/enums';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';
  const label = STATUS_LABELS[status] || status;
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", colorClass, className)}>
      {label}
    </span>
  );
}
