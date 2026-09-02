interface BffFetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
  etag?: string;
}

export async function bffFetch<T>(path: string, options: BffFetchOptions = {}) {
  const { params, etag, ...customConfig } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (etag) {
    headers['if-none-match'] = etag;
  }
  
  if (customConfig.headers) {
    Object.assign(headers, customConfig.headers);
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  let url = path;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, config);
  
  if (response.status === 304) {
    return { status: 304, data: null as unknown as T };
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: any = new Error(data.message || 'API Error');
    error.statusCode = response.status;
    error.errors = data.errors;
    error.hint = data.hint;
    throw error;
  }

  return {
    status: response.status,
    data: data.data as T,
    meta: data.meta,
    etag: response.headers.get('etag'),
  };
}
