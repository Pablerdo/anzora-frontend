import { NextRequest, NextResponse } from 'next/server';
import { imageStore } from '../webhook/route';

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get('runId');

  if (!runId) {
    return NextResponse.json({ error: 'No runId provided' }, { status: 400 });
  }

  if (imageStore[runId]) {
    return NextResponse.json({ status: 'success', imageUrl: imageStore[runId] });
  } else {
    return NextResponse.json({ status: 'pending' });
  }
}

