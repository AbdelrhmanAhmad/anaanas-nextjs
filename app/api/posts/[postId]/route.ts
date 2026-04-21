import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params
    if (!postId) {
      return NextResponse.json({ success: false, message: 'Post ID is required' }, { status: 400 })
    }

    const land = request.nextUrl.searchParams.get('land')
    const qs = new URLSearchParams()
    if (land) qs.set('land', land)
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    const response = await callLaravel(`/api/posts/${postId}${suffix}`, { method: 'GET' })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error fetching post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params

    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      )
    }

    // إرسال طلب الحذف إلى Laravel
    const response = await callLaravel(`/api/posts/${postId}`, {
      method: 'DELETE',
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error deleting post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete post'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

