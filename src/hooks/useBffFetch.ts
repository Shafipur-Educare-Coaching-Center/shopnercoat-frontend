'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { bffFetch } from '@/lib/client/bffClient';

interface UseBffFetchOptions {
  params?: Record<string, string | number | undefined>;
  deps?: any[];
}

export function useBffFetch<T>(url: string | null, options: UseBffFetchOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);
  
  const etagRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { params, deps = [] } = options;
  const paramsString = params ? JSON.stringify(params) : '';

  const refetch = useCallback(async () => {
    if (!url) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const res = await bffFetch<T>(url, {
        params,
        signal: abortControllerRef.current.signal,
        etag: etagRef.current || undefined,
      });

      if (res.status === 304) {
        // Not modified, keep existing data
      } else {
        setData(res.data);
        if (res.etag) {
          etagRef.current = res.etag;
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [url, paramsString]);

  useEffect(() => {
    if (url) {
      refetch();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, paramsString, ...deps]);

  return { data, isLoading, error, refetch };
}
