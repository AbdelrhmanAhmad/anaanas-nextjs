import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '50'
    const beforeId = searchParams.get('before_id')

    let url = `/api/chats/${chatId}/messages?page=${page}&per_page=${perPage}`
    if (beforeId) {
      url += `&before_id=${beforeId}`
    }

    const data = await callLaravel(url, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching messages:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
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
    console.error('Error sending message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

