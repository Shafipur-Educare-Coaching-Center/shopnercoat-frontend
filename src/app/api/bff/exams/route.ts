import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { API_BASE_URL } from '@/constants';

export const GET = catchAsync(async (req: NextRequest) => {
  const ifNoneMatch = req.headers.get('if-none-match');

  const backendRes = await fetch(`${API_BASE_URL}/exams`, {
    headers: {
      ...(ifNoneMatch && { 'if-none-match': ifNoneMatch }),
    },
    next: { revalidate: 60 },
  });

  if (backendRes.status === 304) return new NextResponse(null, { status: 304 });

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  const etag = backendRes.headers.get('etag');
  if (etag) res.headers.set('etag', etag);

  return res;
});
