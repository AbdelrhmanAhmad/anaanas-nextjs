import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

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

