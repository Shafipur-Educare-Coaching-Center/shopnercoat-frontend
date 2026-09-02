import { NextRequest, NextResponse } from 'next/server';
import { catchAsync } from '@/lib/server/catchAsync';
import { getVerifiedToken, getAccessToken } from '@/lib/server/getTokens';
import { API_BASE_URL } from '@/constants';

export const POST = catchAsync(async (req: NextRequest) => {
  const verifiedToken = await getVerifiedToken();
  const accessToken = await getAccessToken();
  const token = verifiedToken || accessToken; // allow upload during profile completion or from dashboard

  const formData = await req.formData();

  const backendRes = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
});
