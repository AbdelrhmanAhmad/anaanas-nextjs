import Image from 'next/image'
import { Button, Card, CardBody, CardHeader, Col, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
import { FaCameraRetro, FaPlus } from 'react-icons/fa'
import type { Metadata } from 'next'

import GlightBox from '@/components/GlightBox'
import { fetchMyImages } from '@/lib/api/posts'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import {
  BsBookmark,
  BsBookmarkCheck,
  BsChatFill,
  BsChatLeftTextFill,
  BsEnvelope,
  BsFlag,
  BsHandThumbsUpFill,
  BsHeartFill,
  BsLink,
  BsPencilSquare,
  BsPersonX,
  BsReplyFill,
  BsShare,
  BsSlashCircle,
  BsThreeDots,
  BsXCircle,
} from 'react-icons/bs'
import Link from 'next/link'

import avatar4 from '@/assets/images/avatar/04.jpg'
import avatar5 from '@/assets/images/avatar/05.jpg'

export const metadata: Metadata = { title: 'Media' }

const Media = async () => {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/sign-in')
  }

  // Fetch user's post images
  let images: any[] = []
  let error: string | null = null
  
  try {
    const response = await fetchMyImages({ page: 1, perPage: 20 })
    images = Array.isArray(response?.data) ? response.data : []
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load images'
    console.error('Error fetching images:', e)
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="alert alert-danger">{error}</div>
        </CardBody>
      </Card>
    )
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-5">
            <p className="text-muted mb-0">لا توجد صور بعد</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="d-sm-flex align-items-center justify-content-between border-0 pb-0">
        <h5 className="card-title">Photos</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          {images.map((img) => {
            const imageUrl = img.image_full_url || img.image
            if (!imageUrl) return null
            
            return (
              <Col sm={6} md={4} lg={3} key={img.id}>
                <GlightBox href={imageUrl} data-gallery="image-popup">
                  <Image 
                    className="rounded img-fluid" 
                    src={imageUrl} 
                    alt={img.post?.title || 'Post image'} 
                    width={300}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  />
                </GlightBox>
              </Col>
            )
          })}
        </Row>
      </CardBody>
    </Card>
  )
}
export default Media
