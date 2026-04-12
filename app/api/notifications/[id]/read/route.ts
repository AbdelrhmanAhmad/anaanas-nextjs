import { NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const data = await callLaravel(`/api/notifications/${id}/read`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update notification'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
