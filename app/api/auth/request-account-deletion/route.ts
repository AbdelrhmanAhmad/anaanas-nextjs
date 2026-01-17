import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await callLaravel('/api/auth/request-account-deletion', {
      method: 'POST',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error requesting account deletion:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to request account deletion'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

