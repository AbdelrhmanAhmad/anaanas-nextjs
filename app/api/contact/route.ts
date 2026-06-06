import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const land = searchParams.get('land') || 'ar'
    const body = await request.json().catch(() => ({}))

    const data = await callLaravel(`/api/contact?land=${encodeURIComponent(land)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit contact form'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 422 })
  }
}
