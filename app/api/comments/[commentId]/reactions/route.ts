import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'
import { respondWithLaravelError } from '@/lib/api/respondWithLaravelError'

export async function GET(request: NextRequest, context: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await context.params
  const response = await callLaravel(`/api/comments/${commentId}/reactions`, { method: 'GET' })
  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest, context: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await context.params
  try {
    const body = await request.json()
    const response = await callLaravel(`/api/comments/${commentId}/reactions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return respondWithLaravelError(error)
  }
}


