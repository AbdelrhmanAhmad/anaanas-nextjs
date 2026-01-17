import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '20'

    const queryParams = new URLSearchParams({
      page,
      per_page: perPage,
    })

    const data = await callLaravel(`/api/posts/my-images?${queryParams.toString()}`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching my images:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch my images'
    
    if (errorMessage.includes('Unauthenticated')) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
