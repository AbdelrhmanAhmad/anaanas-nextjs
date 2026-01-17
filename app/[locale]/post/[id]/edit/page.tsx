import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Col, Container, Row } from 'react-bootstrap'

import { authOptions } from '@/auth'
import CreatePostCard from '@/components/cards/CreatePostCard'
import { callLaravel } from '@/lib/laravelClient'

type ApiPostDetailsResponse = {
  success?: boolean
  data?: any
  message?: string
}

export default async function EditPostPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/auth/sign-in?redirectTo=/${locale}/post/${id}/edit`)
  }

  const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
  if (!json?.success || !json?.data) {
    return (
      <main>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="alert alert-danger mb-0">Failed to load post</div>
            </Col>
          </Row>
        </Container>
      </main>
    )
  }

  const post = json.data
  const ownerId = post?.user_id ?? post?.user?.id
  const currentUserId = (session as any)?.user?.id

  if (ownerId == null || currentUserId == null || String(ownerId) !== String(currentUserId)) {
    // Not allowed to edit someone else's post
    redirect(`/${locale}/post/${id}`)
  }

  return (
    <main>
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <h4 className="mb-3">تعديل المنشور</h4>
            <CreatePostCard mode="edit" postId={id} locale={locale} initialPost={post} />
          </Col>
        </Row>
      </Container>
    </main>
  )
}


