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
        { status: 401 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const land = searchParams.get('land') || 'ar'
    const query = new URLSearchParams({ land }).toString()

    const data = await callLaravel(`/api/post/creation-limit?${query}`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching post creation limit:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to check post creation limit'

    if (errorMessage.includes('Unauthenticated')) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 },
      )
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
