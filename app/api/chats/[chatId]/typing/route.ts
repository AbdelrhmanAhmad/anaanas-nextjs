import { callLaravel } from '@/lib/laravelClient'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const data = await callLaravel(`/api/chats/${encodeURIComponent(chatId)}/typing`, { method: 'POST' })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to broadcast typing'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
