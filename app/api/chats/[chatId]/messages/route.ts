import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import { respondWithLaravelError } from '@/lib/api/respondWithLaravelError'

export async function GET(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '50'
    const beforeId = searchParams.get('before_id')
    const afterAt = searchParams.get('after_at')

    let url = `/api/chats/${chatId}/messages?page=${page}&per_page=${perPage}`
    if (beforeId) {
      url += `&before_id=${beforeId}`
    }
    if (afterAt) {
      url += `&after_at=${encodeURIComponent(afterAt)}`
    }

    const data = await callLaravel(url, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return respondWithLaravelError(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const body = await request.json()

    const data = await callLaravel(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return respondWithLaravelError(error)
  }
}
