'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button, Form, Modal, InputGroup } from 'react-bootstrap'
import { BsFacebook, BsLinkedin, BsTwitterX, BsWhatsapp, BsLink45Deg } from 'react-icons/bs'

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp'

function buildShareUrl(platform: Platform, postUrl: string, message: string) {
  const u = encodeURIComponent(postUrl)
  const t = encodeURIComponent(message)

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`
    case 'twitter':
      // X (Twitter) supports text + url
      return `https://twitter.com/intent/tweet?text=${t}&url=${u}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${message} ${postUrl}`)}`
  }
}

export default function SharePostModal({
  show,
  onHide,
  postId,
  postUrl,
  title,
  defaultMessage,
}: {
  show: boolean
  onHide: () => void
  postId: string
  postUrl: string
  title?: string
  defaultMessage: string
}) {
  const [platform, setPlatform] = useState<Platform>('facebook')
  const [message, setMessage] = useState(defaultMessage)
  const [busy, setBusy] = useState(false)

  // Use useState to prevent hydration mismatch - only calculate on client
  const [absolutePostUrl, setAbsolutePostUrl] = useState(postUrl)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (postUrl.startsWith('http://') || postUrl.startsWith('https://')) {
        setAbsolutePostUrl(postUrl)
      } else {
        setAbsolutePostUrl(`${window.location.origin}${postUrl}`)
      }
    }
  }, [postUrl])

  const shareLink = useMemo(() => buildShareUrl(platform, absolutePostUrl, message), [platform, absolutePostUrl, message])

  const onConfirm = async () => {
    setBusy(true)
    try {
      // log event (keepalive so it isn't dropped on navigation)
      await fetch(`/api/posts/${postId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          event: 'post_share',
          meta: {
            platform,
            post_url: postUrl,
            share_url: shareLink,
            message,
            title,
          },
        }),
        keepalive: true,
      })

      // copy platform share URL
      await navigator.clipboard.writeText(shareLink)

      // open share URL in new tab (nice UX)
      window.open(shareLink, '_blank', 'noopener,noreferrer')

      onHide()
    } catch (e) {
      console.error('Share failed', e)
    } finally {
      setBusy(false)
    }
  }

  const onCopyPostUrl = async () => {
    try {
      await navigator.clipboard.writeText(absolutePostUrl)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>مشاركة المنشور</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>رابط المنشور</Form.Label>
          <InputGroup>
            <Form.Control value={absolutePostUrl} readOnly />
            <Button variant="outline-secondary" onClick={onCopyPostUrl} title="نسخ رابط المنشور">
              <BsLink45Deg />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>منصة المشاركة</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={platform === 'facebook' ? 'primary' : 'outline-primary'}
              onClick={() => setPlatform('facebook')}
            >
              <BsFacebook className="me-2" />
              فيسبوك
            </Button>
            <Button
              variant={platform === 'twitter' ? 'dark' : 'outline-dark'}
              onClick={() => setPlatform('twitter')}
            >
              <BsTwitterX className="me-2" />
              تويتر
            </Button>
            <Button
              variant={platform === 'linkedin' ? 'info' : 'outline-info'}
              onClick={() => setPlatform('linkedin')}
            >
              <BsLinkedin className="me-2" />
              لينكدإن
            </Button>
            <Button
              variant={platform === 'whatsapp' ? 'success' : 'outline-success'}
              onClick={() => setPlatform('whatsapp')}
            >
              <BsWhatsapp className="me-2" />
              واتساب
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>الرسالة</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Form.Text className="text-muted">سيتم استخدام الرسالة عند إنشاء رابط المشاركة للمنصات التي تدعم نصًا.</Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>رابط المشاركة (سيتم نسخه عند التأكيد)</Form.Label>
          <Form.Control value={shareLink} readOnly />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={busy}>
          إلغاء
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={busy}>
          {busy ? 'جارٍ...' : 'تأكيد المشاركة'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


