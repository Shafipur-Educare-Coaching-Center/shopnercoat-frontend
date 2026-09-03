import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { getAccessToken } from '@/lib/server/getTokens';
import { API_BASE_URL } from '@/constants';

export const dynamic = 'force-dynamic';

export const GET = catchAsync(async (req: NextRequest) => {
  const token = await getAccessToken();
  const { searchParams } = new URL(req.url);
  const limit   = searchParams.get('limit')    ?? '10';
  const page    = searchParams.get('page')     ?? '1';
  const category = searchParams.get('category') ?? '';

  const qs = new URLSearchParams({ limit, page, ...(category && { category }) });
  const res = await fetch(`${API_BASE_URL}/admin/audit-logs?${qs}`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
});
