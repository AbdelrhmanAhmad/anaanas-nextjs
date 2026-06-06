import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const land = searchParams.get('land') || 'ar'
    const body = await request.json().catch(() => ({}))

    const data = await callLaravel(`/api/account/verification-request?land=${encodeURIComponent(land)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error submitting verification request:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit verification request'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 422 })
  }
}
