import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

export function catchAsync(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: any): Promise<NextResponse> => {
    try {
      return await handler(req, ctx);
    } catch (error: any) {
      console.error('[API Route Error]', error);
      const status = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      return NextResponse.json(
        { success: false, message, errors: error.errors, hint: error.hint },
        { status }
      );
    }
  };
}
