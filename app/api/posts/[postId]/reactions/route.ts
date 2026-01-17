import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(_request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params
  const response = await callLaravel(`/api/posts/${postId}/reactions`, { method: 'GET' })
  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params
  try {
    const body = await request.json()
    const response = await callLaravel(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to react' },
      { status: 500 }
    )
  }
}


