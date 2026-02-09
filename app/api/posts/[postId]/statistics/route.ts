import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params
  try {
    const from = request.nextUrl.searchParams.get('from')
    const to = request.nextUrl.searchParams.get('to')

    const qs = new URLSearchParams()
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)

    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    const response = await callLaravel(`/api/posts/${postId}/statistics${suffix}`, { method: 'GET' })
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch statistics'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

