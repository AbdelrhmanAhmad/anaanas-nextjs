import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''

    const queryParams = new URLSearchParams()
    if (from) queryParams.set('from', from)
    if (to) queryParams.set('to', to)

    const data = await callLaravel(`/api/posts/my-statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching my statistics:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch statistics'

    if (errorMessage.includes('Unauthenticated')) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
