import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import { respondWithLaravelError } from '@/lib/api/respondWithLaravelError'

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const data = await callLaravel(`/api/posts/${postId}/chat`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return respondWithLaravelError(error)
  }
}
