import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params
    const data = await callLaravel(`/api/chats/${chatId}/read`, {
      method: 'POST',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error marking chat as read:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark chat as read'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

