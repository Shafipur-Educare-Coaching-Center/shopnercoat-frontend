import { cn } from "@/lib/utils";

export function MedicalLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="font-heading font-bold text-lg tracking-tight text-primary">
        ShopnerCoat
      </span>
    </div>
  );
}
