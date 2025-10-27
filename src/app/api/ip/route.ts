
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'IP not found';
  console.log(`Request received from IP: ${ip}`);
  return NextResponse.json({
    message: `Request received from IP: ${ip}. Check your application logs.`,
  });
}
