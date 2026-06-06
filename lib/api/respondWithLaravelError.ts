import { NextResponse } from 'next/server'
import { laravelErrorBody } from '@/lib/api/laravelApiError'

export function respondWithLaravelError(error: unknown) {
  const { status, body } = laravelErrorBody(error)
  return NextResponse.json(body, { status })
}
