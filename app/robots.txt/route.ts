import { headers } from 'next/headers'

import { resolveSeoOrigin } from '@/lib/seo/resolveSeoOrigin'

export const revalidate = 86400

const DISALLOW_PATHS = [
  '/api',
  '/admin',
  '/login',
  '/register',
  '/dashboard',
  '/profile',
  '/favorites',
  '/chat',
  '/messages',
  '/messaging',
  '/notifications',
  '/settings',
  '/auth',
  '/my-store',
  '/stores/new',
]

export async function GET() {
  const origin = await resolveSeoOrigin()
  const host = origin.replace(/^https?:\/\//, '')

  const lines = [
    'User-agent: *',
    'Allow: /',
    ...DISALLOW_PATHS.map((path) => `Disallow: ${path}`),
    'Disallow: /*/search',
    'Disallow: /*?sort=',
    'Disallow: /*?filter=',
    'Disallow: /*?utm_',
    'Disallow: /*?q=',
    `Sitemap: ${origin}/sitemap.xml`,
    `Host: ${host}`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
