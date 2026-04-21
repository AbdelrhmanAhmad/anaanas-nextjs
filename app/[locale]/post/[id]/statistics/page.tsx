import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import PostStatisticsClient from './statisticsClient'

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

  return (
    <main>
      <PostStatisticsClient locale={locale as any} postId={id} />
    </main>
  )
}

