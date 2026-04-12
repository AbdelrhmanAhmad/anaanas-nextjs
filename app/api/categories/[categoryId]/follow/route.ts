import { NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'

export async function GET(_request: Request, context: { params: Promise<{ categoryId: string }> }) {
  try {
    const { categoryId } = await context.params
    const data = await callLaravel(`/api/categories/${categoryId}/follow`, { method: 'GET' })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch follow status'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(_request: Request, context: { params: Promise<{ categoryId: string }> }) {
  try {
    const { categoryId } = await context.params
    const data = await callLaravel(`/api/categories/${categoryId}/follow`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update follow'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
