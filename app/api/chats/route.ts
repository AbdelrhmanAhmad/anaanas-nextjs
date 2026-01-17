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

    const data = await callLaravel(`/api/chats?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching chats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chats'
    
    // If it's an authentication error, return 401
    if (errorMessage.includes('Unauthenticated')) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

