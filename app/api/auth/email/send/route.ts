import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const land = request.nextUrl.searchParams.get('land') || 'ar'
    const data = await callLaravel(`/api/auth/email/send?land=${encodeURIComponent(land)}`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send verification code'
    return NextResponse.json({ success: false, message }, { status: 422 })
  }
}
