import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { getAccessToken } from '@/lib/server/getTokens';
import { API_BASE_URL } from '@/constants';

export const dynamic = 'force-dynamic';

export const GET = catchAsync(async (_req: NextRequest) => {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE_URL}/exams/admin/stats`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
});
