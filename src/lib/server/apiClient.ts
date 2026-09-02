import 'server-only';
import { API_BASE_URL } from '@/constants';
import { ApiResponse } from '@/types/api.types';

interface FetchOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | undefined>;
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
    const error: any = new Error(data.message || 'API Error');
    error.statusCode = response.status;
    error.errors = data.errors;
    error.hint = data.hint;
    throw error;
  }

  return data;
}
