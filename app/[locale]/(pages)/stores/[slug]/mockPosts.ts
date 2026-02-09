export type StoreMockPost = {
  id: string
  title: { ar: string; en: string }
  price: number
  city: { ar: string; en: string }
  created_at: string
  image_url?: string
  tags?: string[]
}

export function buildMockPosts(storeSlug: string): StoreMockPost[] {
  const now = Date.now()
  const base = [
    {
      id: `${storeSlug}-1`,
      title: { ar: 'إعلان مميز — حالة ممتازة', en: 'Featured ad — Great condition' },
      price: 12500,
      city: { ar: 'عمّان', en: 'Amman' },
      created_at: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      tags: ['مميز', 'ضمان'],
    },
    {
      id: `${storeSlug}-2`,
      title: { ar: 'عرض اليوم — خصم محدود', en: "Today’s deal — Limited discount" },
      price: 890,
      city: { ar: 'إربد', en: 'Irbid' },
      created_at: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      tags: ['خصم', 'عرض'],
    },
    {
      id: `${storeSlug}-3`,
      title: { ar: 'خيار اقتصادي — مناسب للجميع', en: 'Budget option — Great value' },
      price: 320,
      city: { ar: 'الزرقاء', en: 'Zarqa' },
      created_at: new Date(now - 1000 * 60 * 60 * 55).toISOString(),
      tags: ['اقتصادي'],
    },
  ]
  return base
}

