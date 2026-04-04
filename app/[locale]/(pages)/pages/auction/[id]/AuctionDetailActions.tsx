'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Form, Modal, Toast, ToastContainer } from 'react-bootstrap'
import LoginRequiredDialog from '@/components/dialogs/LoginRequiredDialog'
import { placeAuctionBid, toggleAuctionWatch } from '@/lib/api/auctions'

type Props = {
  locale: string
  postId: number
  currentPrice: number
  minIncrement: number
  watchedByMe: boolean
}

export default function AuctionDetailActions({
  locale,
  postId,
  currentPrice,
  minIncrement,
  watchedByMe,
}: Props) {
  const { data: session, status } = useSession()
  const accessToken = (session as any)?.accessToken as string | undefined

  const [watching, setWatching] = useState(watchedByMe)
  const [showBid, setShowBid] = useState(false)
  const [bidAmount, setBidAmount] = useState(String(currentPrice + minIncrement))
  const [showLogin, setShowLogin] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string; bg: 'success' | 'danger' }>({
    show: false,
    message: '',
    bg: 'success',
  })

  const ensureAuth = () => {
    if (status !== 'authenticated' || !accessToken) {
      setShowLogin(true)
      return false
    }
    return true
  }

  const onToggleWatch = async () => {
    if (!ensureAuth()) return
    try {
      const json = await toggleAuctionWatch(postId, accessToken)
      setWatching(Boolean(json?.watched))
      setToast({
        show: true,
        message: locale === 'ar' ? 'تم تحديث المتابعة' : 'Watch status updated',
        bg: 'success',
      })
    } catch (e: any) {
      setToast({
        show: true,
        message: e?.message || (locale === 'ar' ? 'فشلت العملية' : 'Action failed'),
        bg: 'danger',
      })
    }
  }

  const onSubmitBid = async () => {
    if (!ensureAuth()) return
    const amount = Number(bidAmount)
    const minAccepted = currentPrice + minIncrement
    if (!Number.isFinite(amount) || amount < minAccepted) {
      setToast({
        show: true,
        message: locale === 'ar' ? `الحد الأدنى ${minAccepted}` : `Minimum is ${minAccepted}`,
        bg: 'danger',
      })
      return
    }
    try {
      await placeAuctionBid(postId, { amount }, accessToken)
      setShowBid(false)
      setToast({
        show: true,
        message: locale === 'ar' ? 'تمت المزايدة بنجاح، حدّث الصفحة' : 'Bid placed successfully, refresh to see latest',
        bg: 'success',
      })
    } catch (e: any) {
      setToast({
        show: true,
        message: e?.message || (locale === 'ar' ? 'فشلت المزايدة' : 'Bid failed'),
        bg: 'danger',
      })
    }
  }

  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        <Button variant="warning" onClick={() => setShowBid(true)}>
          {locale === 'ar' ? 'مزايدة الآن' : 'Bid now'}
        </Button>
        <Button variant={watching ? 'dark' : 'outline-dark'} onClick={() => void onToggleWatch()}>
          {watching ? (locale === 'ar' ? 'تتم المتابعة' : 'Watching') : locale === 'ar' ? 'متابعة' : 'Watch'}
        </Button>
      </div>

      <Modal show={showBid} onHide={() => setShowBid(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{locale === 'ar' ? 'إرسال مزايدة' : 'Place your bid'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="small text-muted mb-2">
            {locale === 'ar' ? 'أقل مزايدة مسموحة' : 'Minimum allowed'}: {currentPrice + minIncrement}
          </div>
          <Form.Control type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBid(false)}>
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="warning" onClick={() => void onSubmitBid()}>
            {locale === 'ar' ? 'تأكيد المزايدة' : 'Confirm bid'}
          </Button>
        </Modal.Footer>
      </Modal>

      <LoginRequiredDialog show={showLogin} onHide={() => setShowLogin(false)} locale={locale as any} />

      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toast.bg} show={toast.show} onClose={() => setToast((p) => ({ ...p, show: false }))} delay={2400} autohide>
          <Toast.Body className={toast.bg === 'danger' ? 'text-white' : ''}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

