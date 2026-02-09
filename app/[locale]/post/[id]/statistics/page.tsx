import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { callLaravel } from '@/lib/laravelClient'
import PostStatisticsClient from './statisticsClient'

type ApiResponse<T> = { success?: boolean; data?: T; message?: string }

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function PostStatisticsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/auth/sign-in`)
  }

  const postRes = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiResponse<any>
  const post = postRes?.data
  if (!post) notFound()

  const sessionUserId = Number((session as any)?.user?.id)
  const ownerId = Number(post?.user_id)
  if (!sessionUserId || !ownerId || sessionUserId !== ownerId) {
    notFound()
  }

  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 29)

  const statsRes = (await callLaravel(
    `/api/posts/${id}/statistics?from=${encodeURIComponent(isoDate(from))}&to=${encodeURIComponent(isoDate(to))}`,
    { method: 'GET' }
  )) as ApiResponse<any>

  const initial = statsRes?.data ?? null

  return (
    <main>
      <PostStatisticsClient locale={locale as any} postId={id} post={post} initial={initial} />
    </main>
  )
}

