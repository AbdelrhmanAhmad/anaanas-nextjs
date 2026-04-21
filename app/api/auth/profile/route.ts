import { callLaravel } from '@/lib/laravelClient'
import { NextRequest, NextResponse } from 'next/server'
import FormDataNode from 'form-data'

export async function GET(_request: NextRequest) {
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

/**
 * Append a scalar (string/number/boolean/null) to a FormData instance.
 * Arrays/objects are JSON-encoded so Laravel can still read them as strings
 * (Laravel accepts booleans as "true"/"false"/"1"/"0" in multipart payloads).
 */
function appendScalar(fd: FormDataNode, key: string, value: any) {
  if (value === undefined) return
  if (value === null) {
    fd.append(key, '')
    return
  }
  if (typeof value === 'boolean') {
    fd.append(key, value ? '1' : '0')
    return
  }
  if (typeof value === 'object') {
    fd.append(key, JSON.stringify(value))
    return
  }
  fd.append(key, String(value))
}

export async function PUT(request: NextRequest) {
  try {
    const contentType = (request.headers.get('content-type') || '').toLowerCase()
    const laravelFormData = new FormDataNode()
    // Method spoofing for Laravel: PHP does not auto-populate $_FILES on PUT
    // multipart requests, so we always POST to Laravel with _method=PUT.
    laravelFormData.append('_method', 'PUT')

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      // Multipart / URL-encoded path: copy scalar fields and forward files verbatim.
      const formData = await request.formData()

      for (const [key, value] of formData.entries()) {
        if (key === 'avatar_file' || key === 'cover_image_file') continue
        // `value` is either a string (scalar) or File — but File is only used for avatar/cover.
        if (typeof value === 'string') {
          appendScalar(laravelFormData, key, value)
        }
      }

      const avatarFile = formData.get('avatar_file') as File | null
      if (avatarFile && avatarFile.size > 0) {
        const buffer = Buffer.from(await avatarFile.arrayBuffer())
        laravelFormData.append('avatar_file', buffer, {
          filename: avatarFile.name,
          contentType: avatarFile.type,
        })
      }

      const coverFile = formData.get('cover_image_file') as File | null
      if (coverFile && coverFile.size > 0) {
        const buffer = Buffer.from(await coverFile.arrayBuffer())
        laravelFormData.append('cover_image_file', buffer, {
          filename: coverFile.name,
          contentType: coverFile.type,
        })
      }
    } else {
      // Treat anything else (including application/json) as JSON.
      // Laravel expects multipart because the controller uses `hasFile()` — we translate.
      let json: Record<string, any> = {}
      try {
        json = await request.json()
      } catch {
        // allow empty bodies without crashing
        json = {}
      }

      Object.keys(json || {}).forEach((key) => {
        // No file uploads in the JSON path — files must use multipart.
        if (key === 'avatar_file' || key === 'cover_image_file') return
        appendScalar(laravelFormData, key, (json as any)[key])
      })
    }

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
      method: 'POST',
      headers,
      body: laravelFormData as any,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: (data as any)?.message || `Failed to update profile: ${res.status}`,
          errors: (data as any)?.errors,
        },
        { status: res.status },
      )
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
