import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(_request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params

  // We proxy to Laravel to avoid CORS and keep a stable API surface for the UI
  const url = new URL(_request.url)
  const page = url.searchParams.get('page') ?? '1'
  const perPage = url.searchParams.get('per_page') ?? '10'

  // Use callLaravel so the backend can compute liked_by_me when a session exists.
  const response = await callLaravel(`/api/posts/${postId}/comments?page=${page}&per_page=${perPage}`, {
    method: 'GET',
  })

  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params

  try {
    const body = await request.json()

    const response = await callLaravel(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التعليق',
      },
      { status: 500 }
    )
  }
}


