import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const data = await callLaravel(`/api/posts/${postId}/chat`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching chat:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chat'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

