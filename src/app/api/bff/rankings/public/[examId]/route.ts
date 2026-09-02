import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { API_BASE_URL } from '@/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = catchAsync(async (
  req: NextRequest,
  context: { params: Promise<{ examId: string }> }
) => {
  const { examId } = await context.params;
  const token = req.cookies.get('accessToken')?.value || req.cookies.get('token')?.value;

  // 1. Try primary backend endpoint /rankings/public/:examId
  try {
    const backendRes = await fetch(`${API_BASE_URL}/rankings/public/${examId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: 'no-store',
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : data?.data?.metadata?.topRankers || data?.metadata?.topRankers || [];

      if (list && Array.isArray(list) && list.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.warn(`BFF primary /rankings/public/${examId} failed:`, err);
  }

  // 2. Fallback: If token is present, try /results/admin/exam/:examId
  if (token) {
    try {
      const backendRes = await fetch(`${API_BASE_URL}/results/admin/exam/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn(`BFF fallback /results/admin/exam/${examId} failed:`, err);
    }
  }

  return NextResponse.json({ data: [] });
});
