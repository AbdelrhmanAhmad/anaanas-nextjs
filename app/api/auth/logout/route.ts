import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { callLaravel } from '@/lib/laravelClient'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (session?.accessToken) {
      try {
        // Call Laravel logout endpoint
        await callLaravel('/api/auth/logout', {
          method: 'POST',
        })
      } catch (error) {
        // Log error but continue with NextAuth signout
        console.error('Laravel logout error:', error)
      }
    }

    // Return success - client will handle NextAuth signOut
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, message: 'Failed to logout' }, { status: 500 })
  }
}

