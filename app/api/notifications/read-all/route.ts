import { NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function POST() {
  try {
    const data = await callLaravel('/api/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to mark notifications as read'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
