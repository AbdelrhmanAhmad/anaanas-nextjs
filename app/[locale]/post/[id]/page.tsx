import type { Metadata } from 'next'
import { Card, Col, Container, Row, Table } from 'react-bootstrap'
import PostCard from '@/components/cards/PostCard'
import { callLaravel } from '@/lib/laravelClient'
import PostImagesGallery from './PostImagesGallery'
import PostViewTracker from './PostViewTracker'

export const metadata: Metadata = { title: 'Post Details' }

type ApiPostDetailsResponse = {
  success?: boolean
  data?: any
  message?: string
}

function pickLocalizedName(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (typeof value[locale] === 'string') return value[locale]
    if (typeof value.en === 'string') return value.en
    if (typeof value.ar === 'string') return value.ar
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export default async function PostDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
  if (!json?.success || !json?.data) {
    return (
      <main>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="alert alert-danger mb-0">Failed to load post details</div>
            </Col>
          </Row>
        </Container>
      </main>
    )
  }

  const post = json.data
  const postImages: Array<{ url: string; alt?: string }> = Array.isArray(post?.post_images)
    ? post.post_images
      .map((img: any) => ({
        url: img?.image_full_url || img?.image,
        alt: post?.title,
      }))
      .filter((x: any) => Boolean(x.url))
    : []

  const postData = post?.post_data
  const attributesAndOptions = Array.isArray(postData?.attributes_and_options) ? postData.attributes_and_options : []

  // Use PostCard for interactions/comments, but avoid duplicating the gallery media here.
  const postForCard = { ...post, post_images: [] }

  return (
    <main>
      <PostViewTracker postId={id} postUserId={post?.user_id} />
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">

            <PostCard post={postForCard}
              banner={
                postImages && postImages.length > 0 ?  <Card className="card-body mb-3">
                  <PostImagesGallery images={postImages} title={post?.title} />
                </Card> :null
                 
              }

              attributesAndOptions={
                <Card className="card-body mt-3">
                  <h5 className="mb-3">تفاصيل الإعلان</h5>

                  {attributesAndOptions.length === 0 ? (
                    <div className="text-muted">لا توجد خصائص متاحة لهذا الإعلان.</div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped bordered hover size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>الخاصية</th>
                            <th>القيمة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attributesAndOptions.map((row: any, idx: number) => {
                            const attrName = pickLocalizedName(row?.attribute?.name, locale) || row?.attribute?.slug || `#${idx + 1}`

                            const singleOptName = pickLocalizedName(row?.option?.name, locale)
                            const multiOptNames = Array.isArray(row?.options)
                              ? row.options.map((o: any) => pickLocalizedName(o?.name, locale)).filter(Boolean)
                              : []

                            const value = singleOptName || (multiOptNames.length ? multiOptNames.join('، ') : '')

                            return (
                              <tr key={idx}>
                                <td>{attrName}</td>
                                <td>{value || '-'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card>
              }

            />


          </Col>
        </Row>
      </Container>
    </main>
  )
}
