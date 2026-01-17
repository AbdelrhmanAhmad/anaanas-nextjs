import { NextRequest, NextResponse } from 'next/server'
import { callLaravel } from '@/lib/laravelClient'
import type { CreatePostData } from '@/lib/api/posts'

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostData = await request.json()

    // التحقق من البيانات المطلوبة
    if (!body.section_id || !body.category_id || !body.city_id || !body.price) {
      return NextResponse.json(
        { success: false, message: 'البيانات المطلوبة غير مكتملة' },
        { status: 400 }
      )
    }

    // إرسال الطلب إلى Laravel باستخدام callLaravel (يضيف التوكن تلقائياً)
    const response = await callLaravel('/api/post', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الإعلان',
      },
      { status: 500 }
    )
  }
}


