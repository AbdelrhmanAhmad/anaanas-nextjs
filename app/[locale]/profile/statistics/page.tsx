import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { callLaravel } from '@/lib/laravelClient'
import ProfileStatisticsClient from './statisticsClient'

type ApiResponse<T> = { success?: boolean; data?: T; message?: string }

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function ProfileStatisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/auth/sign-in`)
  }

  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 29)

  const statsRes = (await callLaravel(
    `/api/posts/my-statistics?from=${encodeURIComponent(isoDate(from))}&to=${encodeURIComponent(isoDate(to))}`,
    { method: 'GET' }
  )) as ApiResponse<any>

  const initial = statsRes?.data ?? null

  return (
    <main>
      <ProfileStatisticsClient locale={locale as any} initial={initial} />
    </main>
  )
}
