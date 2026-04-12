import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const perPage = sp.get('per_page') || '20'
    const page = sp.get('page') || '1'
    const land = sp.get('land') || 'ar'
    const data = await callLaravel(`/api/notifications?per_page=${perPage}&page=${page}&land=${land}`, {
      method: 'GET',
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
