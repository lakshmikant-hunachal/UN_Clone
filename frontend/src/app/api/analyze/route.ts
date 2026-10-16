import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const formData = await req.formData();

    const backendResponse = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: formData,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Could not connect to FamilyShield backend service at ${BACKEND_URL}. Ensure FastAPI is running.` },
      { status: 502 }
    );
  }
}
