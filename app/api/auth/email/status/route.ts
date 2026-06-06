import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const land = request.nextUrl.searchParams.get('land') || 'ar'
    const data = await callLaravel(`/api/auth/email/status?land=${encodeURIComponent(land)}`)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load email verification status'
    return NextResponse.json({ success: false, message }, { status: 422 })
  }
}
