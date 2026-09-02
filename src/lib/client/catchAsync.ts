import { toast } from 'sonner';

export function catchAsyncClient<T>(fn: (...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T | void> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    }
  };
}
