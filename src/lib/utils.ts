import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes Bangladeshi mobile numbers into 11-digit format: 01XXXXXXXXX
 */
export function normalizeMobileNumber(raw: string): string {
  let cleaned = raw.replace(/\D/g, '');
  if (cleaned.startsWith('8801')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('881')) {
    cleaned = '0' + cleaned.substring(2);
  }
  return cleaned;
}
