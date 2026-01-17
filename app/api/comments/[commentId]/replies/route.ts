import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(request: NextRequest, context: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await context.params
  const url = new URL(request.url)
  const page = url.searchParams.get('page') ?? '1'
  const perPage = url.searchParams.get('per_page') ?? '10'

  const response = await callLaravel(`/api/comments/${commentId}/replies?page=${page}&per_page=${perPage}`, {
    method: 'GET',
  })

  return NextResponse.json(response, { status: 200 })
}


