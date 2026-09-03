import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { getAccessToken } from '@/lib/server/getTokens';
import { API_BASE_URL } from '@/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = catchAsync(async (req: NextRequest) => {
  const token = await getAccessToken();
  const ifNoneMatch = req.headers.get('if-none-match');

  const backendRes = await fetch(`${API_BASE_URL}/students/me`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(ifNoneMatch && { 'if-none-match': ifNoneMatch }),
    },
    cache: 'no-store',
  });

  if (backendRes.status === 304) return new NextResponse(null, { status: 304 });

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });
  
  const etag = backendRes.headers.get('etag');
  if (etag) res.headers.set('etag', etag);
  
  return res;
});

export const PATCH = catchAsync(async (req: NextRequest) => {
  const token = await getAccessToken();
  const body = await req.json();

  const backendRes = await fetch(`${API_BASE_URL}/students/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
});
