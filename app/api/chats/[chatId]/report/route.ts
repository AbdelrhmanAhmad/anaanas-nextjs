import { callLaravel } from '@/lib/laravelClient'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const body = await req.json().catch(() => ({}))
    const data = await callLaravel(`/api/chats/${encodeURIComponent(chatId)}/report`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit report'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
