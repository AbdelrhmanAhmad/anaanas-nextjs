import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import FormDataNode from 'form-data'

export async function GET(request: NextRequest) {
  try {
    const data = await callLaravel('/api/auth/me', {
      method: 'GET',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Build request body - handle both JSON fields and files
    const body: Record<string, any> = {}
    
    // Copy all non-file fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'avatar_file' && key !== 'cover_image_file') {
        body[key] = value
      }
    }

    // Prepare FormData for Laravel using form-data package
    const laravelFormData = new FormDataNode()
    
    // Add JSON fields
    Object.keys(body).forEach(key => {
      if (body[key] !== null && body[key] !== undefined) {
        laravelFormData.append(key, String(body[key]))
      }
    })

    // Add files if present
    const avatarFile = formData.get('avatar_file') as File | null
    const coverFile = formData.get('cover_image_file') as File | null
    
    if (avatarFile && avatarFile.size > 0) {
      // Convert File to Buffer for Node.js
      const arrayBuffer = await avatarFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      laravelFormData.append('avatar_file', buffer, {
        filename: avatarFile.name,
        contentType: avatarFile.type,
      })
    }
    
    if (coverFile && coverFile.size > 0) {
      // Convert File to Buffer for Node.js
      const arrayBuffer = await coverFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      laravelFormData.append('cover_image_file', buffer, {
        filename: coverFile.name,
        contentType: coverFile.type,
      })
    }

    // Get session for auth token
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/auth')
    const session = await getServerSession(authOptions)
    const accessToken = (session as any)?.accessToken

    const headers: HeadersInit = {
      Accept: 'application/json',
      ...laravelFormData.getHeaders(),
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const { getApiUrl } = await import('@/lib/api/config')
    const res = await fetch(getApiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers,
      body: laravelFormData as any,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update profile: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
