import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString()
    const data = await callLaravel(`/api/posts${query ? `?${query}` : ''}`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
