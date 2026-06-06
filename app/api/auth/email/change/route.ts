import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const land = request.nextUrl.searchParams.get('land') || 'ar'
    const body = await request.json().catch(() => ({}))
    const data = await callLaravel(`/api/auth/email/change?land=${encodeURIComponent(land)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to change email'
    return NextResponse.json({ success: false, message }, { status: 422 })
  }
}
