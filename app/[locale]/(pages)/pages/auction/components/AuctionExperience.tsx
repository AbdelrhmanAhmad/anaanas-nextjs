'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button, Form, Modal, Toast, ToastContainer } from 'react-bootstrap'

import styles from '../auction.module.css'
import AuctionHeader from './AuctionHeader'
import TrendingAds from './TrendingAds'
import LiveAuctions from './LiveAuctions'
import { t } from '@/lib/translations'
import { fetchAuctions, placeAuctionBid, toggleAuctionWatch, type AuctionSort } from '@/lib/api/auctions'
import { fetchSections } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import LoginRequiredDialog from '@/components/dialogs/LoginRequiredDialog'

export default function AuctionExperience({ locale }: { locale: any }) {
  const { data: session, status } = useSession()
  const accessToken = (session as any)?.accessToken as string | undefined

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [sectionId, setSectionId] = useState<number | undefined>(undefined)
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [hasImages, setHasImages] = useState<'all' | 'with' | 'without'>('all')
  const [sort, setSort] = useState<AuctionSort>('newest')
  const [query, setQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showLoginRequired, setShowLoginRequired] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string; bg: 'success' | 'danger' | 'info' }>({
    show: false,
    message: '',
    bg: 'info',
  })
  const [bidModal, setBidModal] = useState<{
    show: boolean
    postId?: number | string
    title?: string
    minBid?: number
    amount: string
  }>({ show: false, amount: '' })

  useEffect(() => {
    void (async () => {
      const sec = await fetchSections(locale)
      setSections(sec)
    })()
  }, [locale])

  useEffect(() => {
    if (!sectionId) {
      setCategories([])
      setCategoryId(undefined)
      return
    }
    void (async () => {
      const cats = await fetchCategoriesBySectionId(sectionId, locale)
      setCategories(cats)
      setCategoryId(undefined)
    })()
  }, [sectionId, locale])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setLoading(true)
      try {
        const json = await fetchAuctions({
          land: locale,
          q: query.trim() || undefined,
          hasImages: hasImages === 'all' ? undefined : hasImages === 'with',
          sort,
          sectionId,
          categoryId,
          perPage: 20,
        })
        if (!mounted) return
        setRows(Array.isArray(json?.data) ? json.data : [])
      } catch {
        if (!mounted) return
        setRows([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void run()
    return () => {
      mounted = false
    }
  }, [locale, query, hasImages, sort, sectionId, categoryId, refreshKey])

  const trendingItems = useMemo(() => {
    return rows.slice(0, 6).map((it) => ({
      id: it?.id,
      title: it?.post?.title || t('auction.trending.brand', locale),
      meta: it?.status === 'live' ? t('auction.trending.metaNow', locale) : t('auction.trending.metaHot', locale),
      price: `$${Number(it?.current_price ?? 0).toLocaleString()}`,
    }))
  }, [rows, locale])

  const openBidDialog = (item: any) => {
    const postId = item?.post?.id || item?.id
    const currentPrice = Number(item?.current_price ?? 0)
    const minIncrement = Number(item?.min_increment ?? 1)
    const minBid = currentPrice + minIncrement
    setBidModal({
      show: true,
      postId,
      title: item?.post?.title || (locale === 'ar' ? 'مزاد' : 'Auction'),
      minBid,
      amount: String(minBid),
    })
  }

  const handleBid = async (item: any) => {
    if (status !== 'authenticated' || !accessToken) {
      setShowLoginRequired(true)
      return
    }
    openBidDialog(item)
  }

  const submitBid = async () => {
    if (!bidModal.postId) return
    const amount = Number(bidModal.amount)
    if (!Number.isFinite(amount) || amount <= 0 || (bidModal.minBid != null && amount < bidModal.minBid)) {
      setToast({
        show: true,
        message: locale === 'ar' ? `قيمة المزايدة يجب أن تكون ${bidModal.minBid} أو أعلى` : `Bid must be ${bidModal.minBid} or higher`,
        bg: 'danger',
      })
      return
    }
    try {
      await placeAuctionBid(bidModal.postId, { amount }, accessToken)
      setRefreshKey((x) => x + 1)
      setBidModal({ show: false, amount: '' })
      setToast({
        show: true,
        message: locale === 'ar' ? 'تمت المزايدة بنجاح' : 'Bid placed successfully',
        bg: 'success',
      })
    } catch (e: any) {
      setToast({
        show: true,
        message: e?.message || (locale === 'ar' ? 'فشلت المزايدة' : 'Failed to place bid'),
        bg: 'danger',
      })
    }
  }

  const handleWatch = async (item: any) => {
    const postId = item?.post?.id || item?.id
    if (status !== 'authenticated' || !accessToken) {
      setShowLoginRequired(true)
      return
    }
    try {
      await toggleAuctionWatch(postId, accessToken)
      setRefreshKey((x) => x + 1)
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

  return (
    <div className={styles.cardSurface}>
      <AuctionHeader
        locale={locale}
        query={query}
        onQueryChange={setQuery}
        onPostAd={() => {
          window.location.href = `/${locale}/pages/auction-posts`
        }}
      />

      <div className="d-flex gap-2 flex-wrap mt-3">
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 200 }}
          value={sectionId ? String(sectionId) : ''}
          onChange={(e) => setSectionId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">{locale === 'ar' ? 'كل الأقسام' : 'All sections'}</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 220 }}
          value={categoryId ? String(categoryId) : ''}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
          disabled={!sectionId}
        >
          <option value="">{locale === 'ar' ? 'كل الفئات' : 'All categories'}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`btn btn-sm ${hasImages === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setHasImages('all')}
        >
          {locale === 'ar' ? 'كل المنشورات' : 'All'}
        </button>
        <button
          type="button"
          className={`btn btn-sm ${hasImages === 'with' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setHasImages('with')}
        >
          {locale === 'ar' ? 'بصور' : 'With Images'}
        </button>
        <button
          type="button"
          className={`btn btn-sm ${hasImages === 'without' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setHasImages('without')}
        >
          {locale === 'ar' ? 'بدون صور' : 'Without Images'}
        </button>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 220 }}
          value={sort}
          onChange={(e) => setSort(e.target.value as AuctionSort)}
        >
          <option value="newest">{locale === 'ar' ? 'الأحدث' : 'Newest'}</option>
          <option value="oldest">{locale === 'ar' ? 'الأقدم' : 'Oldest'}</option>
          <option value="price_asc">{locale === 'ar' ? 'السعر تصاعدي' : 'Price Low-High'}</option>
          <option value="price_desc">{locale === 'ar' ? 'السعر تنازلي' : 'Price High-Low'}</option>
          <option value="ending_soon">{locale === 'ar' ? 'تنتهي قريباً' : 'Ending Soon'}</option>
        </select>
        <Link className="btn btn-warning btn-sm ms-auto" href={`/${locale}/pages/auction-posts`}>
          {locale === 'ar' ? 'لوحة إدارة المزاد' : 'Auction Dashboard'}
        </Link>
      </div>

      <div className="mt-4">
        <TrendingAds locale={locale} items={trendingItems} />
      </div>

      <div className="mt-4">
        <LiveAuctions locale={locale} items={rows} onBid={handleBid} onWatch={handleWatch} loading={loading} />
      </div>

      <Modal show={bidModal.show} onHide={() => setBidModal({ show: false, amount: '' })} centered>
        <Modal.Header closeButton>
          <Modal.Title>{locale === 'ar' ? 'مزايدة جديدة' : 'Place a bid'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2 fw-semibold">{bidModal.title}</div>
          <div className="text-muted small mb-3">
            {locale === 'ar' ? 'أقل قيمة مقبولة:' : 'Minimum accepted:'} ${Number(bidModal.minBid ?? 0).toLocaleString()}
          </div>
          <Form.Group>
            <Form.Label>{locale === 'ar' ? 'قيمة المزايدة' : 'Bid amount'}</Form.Label>
            <Form.Control
              type="number"
              value={bidModal.amount}
              onChange={(e) => setBidModal((p) => ({ ...p, amount: e.target.value }))}
              min={bidModal.minBid}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBidModal({ show: false, amount: '' })}>
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="warning" onClick={() => void submitBid()}>
            {locale === 'ar' ? 'تأكيد المزايدة' : 'Confirm bid'}
          </Button>
        </Modal.Footer>
      </Modal>

      <LoginRequiredDialog show={showLoginRequired} onHide={() => setShowLoginRequired(false)} locale={locale} />

      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toast.bg} onClose={() => setToast((p) => ({ ...p, show: false }))} show={toast.show} delay={2400} autohide>
          <Toast.Body className={toast.bg === 'danger' ? 'text-white' : ''}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

