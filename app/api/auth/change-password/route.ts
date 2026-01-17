import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await callLaravel('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error changing password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to change password'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
