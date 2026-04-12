import { NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET() {
  try {
    const data = await callLaravel('/api/follows', { method: 'GET' })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch follows'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
