import 'server-only';
import { API_BASE_URL } from '@/constants';
import { ApiResponse } from '@/types/api.types';

interface FetchOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | undefined>;
}

export function parseApiErrorMessage(data: unknown, fallback = 'API Error'): string {
  if (!data || typeof data !== 'object') return fallback;

  const errObj = data as Record<string, unknown>;

  // 1. If data.errors is provided
  if (errObj.errors) {
    if (Array.isArray(errObj.errors)) {
      const messages = errObj.errors.map((e: unknown) => {
        if (typeof e === 'string') return e;
        if (typeof e === 'object' && e !== null) {
          const item = e as Record<string, unknown>;
          return (
            item.message ||
            item.msg ||
            item.error ||
            (item.field ? `${item.field}: ${item.message || 'invalid'}` : JSON.stringify(e))
          );
        }
        return String(e);
      });
      if (messages.length > 0) return messages.join('. ');
    } else if (typeof errObj.errors === 'object') {
      const messages = Object.entries(errObj.errors).map(([key, val]) => {
        if (Array.isArray(val)) return `${key}: ${val.join(', ')}`;
        if (typeof val === 'object' && val !== null) return `${key}: ${JSON.stringify(val)}`;
        return `${key}: ${val}`;
      });
      if (messages.length > 0) return messages.join('. ');
    }
  }

  // 2. If data.message is provided
  if (errObj.message) {
    if (Array.isArray(errObj.message)) {
      return errObj.message
        .map((m: unknown) => (typeof m === 'string' ? m : JSON.stringify(m)))
        .join('. ');
    }
    if (typeof errObj.message === 'string') {
      return errObj.message;
    }
    if (typeof errObj.message === 'object') {
      try {
        return JSON.stringify(errObj.message);
      } catch {
        return fallback;
      }
    }
  }

  // 3. If data.error is a string
  if (typeof errObj.error === 'string') {
    return errObj.error;
  }

  return fallback;
}

export interface ApiFetchError extends Error {
  statusCode?: number;
  errors?: unknown;
  raw?: unknown;
  hint?: string;
}

export async function serverFetch<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { token, params, ...customConfig } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (customConfig.headers) {
    Object.assign(headers, customConfig.headers);
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const parsedMessage = parseApiErrorMessage(data, `API Error ${response.status}`);
    const error: ApiFetchError = new Error(parsedMessage);
    error.statusCode = response.status;
    error.errors = (data as Record<string, unknown>)?.errors;
    error.raw = data;
    error.hint = (data as Record<string, unknown>)?.hint as string | undefined;
    throw error;
  }

  return data as ApiResponse<T>;
}
