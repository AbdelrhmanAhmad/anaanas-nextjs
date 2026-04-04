'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import styles from '../auction-posts.module.css'
import { fetchSections } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import { fetchCountries } from '@/lib/api/countries'
import { fetchCitiesByCountryId } from '@/lib/api/cities'
import {
  createAuction,
  deleteAuction,
  fetchAuctionStatistics,
  fetchMyAuctions,
  updateAuction,
} from '@/lib/api/auctions'

export default function AuctionPostsExperience({ locale }: { locale: any }) {
  const { data: session, status } = useSession()
  const accessToken = (session as any)?.accessToken as string | undefined
  const searchParams = useSearchParams()

  const [sections, setSections] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [mine, setMine] = useState<any[]>([])
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [images, setImages] = useState<File[]>([])

  const [form, setForm] = useState({
    section_id: '',
    category_id: '',
    country_id: '',
    city_id: '',
    title: '',
    description: '',
    start_price: '',
    min_increment: '1',
    reserve_price: '',
    end_at: '',
  })

  const statsPostId = useMemo(() => {
    const raw = searchParams.get('stats')
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  }, [searchParams])

  const loadMine = async () => {
    if (!accessToken) return
    const json = await fetchMyAuctions(accessToken)
    setMine(Array.isArray(json?.data) ? json.data : [])
  }

  useEffect(() => {
    void (async () => {
      const [sec, ctry] = await Promise.all([fetchSections(locale), fetchCountries()])
      setSections(sec)
      setCountries(ctry)
    })()
  }, [locale])

  useEffect(() => {
    const sid = Number(form.section_id)
    if (!sid) {
      setCategories([])
      return
    }
    void (async () => {
      const cats = await fetchCategoriesBySectionId(sid, locale)
      setCategories(cats)
    })()
  }, [form.section_id, locale])

  useEffect(() => {
    const cid = Number(form.country_id)
    if (!cid) {
      setCities([])
      return
    }
    void (async () => {
      const c = await fetchCitiesByCountryId(cid)
      setCities(c)
    })()
  }, [form.country_id])

  useEffect(() => {
    if (status !== 'authenticated' || !accessToken) return
    void loadMine()
  }, [status, accessToken])

  useEffect(() => {
    if (!statsPostId || !accessToken) return
    void (async () => {
      try {
        const json = await fetchAuctionStatistics(statsPostId, accessToken)
        setStats(json?.data ?? null)
      } catch {
        setStats(null)
      }
    })()
  }, [statsPostId, accessToken])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return
    setLoading(true)
    setMessage('')
    try {
      const payload = {
        section_id: Number(form.section_id),
        category_id: Number(form.category_id),
        country_id: Number(form.country_id),
        city_id: Number(form.city_id),
        title: form.title,
        description: form.description || undefined,
        start_price: Number(form.start_price),
        min_increment: Number(form.min_increment || '1'),
        reserve_price: form.reserve_price ? Number(form.reserve_price) : undefined,
        end_at: form.end_at,
      }

      if (editingPostId) {
        await updateAuction(editingPostId, payload, accessToken, images)
        setMessage(locale === 'ar' ? 'تم تعديل المزاد بنجاح' : 'Auction updated successfully')
      } else {
        await createAuction(payload, accessToken, images)
        setMessage(locale === 'ar' ? 'تم إنشاء المزاد بنجاح' : 'Auction created successfully')
      }
      setEditingPostId(null)
      setForm({
        section_id: '',
        category_id: '',
        country_id: '',
        city_id: '',
        title: '',
        description: '',
        start_price: '',
        min_increment: '1',
        reserve_price: '',
        end_at: '',
      })
      setImages([])
      await loadMine()
    } catch (err: any) {
      setMessage(err?.message || (locale === 'ar' ? 'فشل حفظ المزاد' : 'Failed to save auction'))
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (postId: number) => {
    if (!accessToken) return
    if (!confirm(locale === 'ar' ? 'حذف المزاد؟' : 'Delete auction?')) return
    await deleteAuction(postId, accessToken)
    await loadMine()
  }

  return (
    <div className={styles.outerCard}>
      <div className={styles.headerRow}>
        <div className={styles.brandLeft}>
          <span className={styles.brandName}>ANANAS</span>
          <span className={styles.brandPine} aria-hidden="true">
            🍍
          </span>
        </div>
        <div className={styles.brandRight}>{locale === 'ar' ? 'لوحة إدارة المزادات' : 'Auction Control Center'}</div>
      </div>

      {status !== 'authenticated' ? (
        <div className="alert alert-warning mt-3">{locale === 'ar' ? 'سجل الدخول لإدارة المزادات' : 'Sign in to manage auctions'}</div>
      ) : (
        <>
          <form className="row g-3 mt-1" onSubmit={onSubmit}>
            <div className="col-md-6">
              <label className="form-label">{locale === 'ar' ? 'القسم' : 'Section'}</label>
              <select className="form-select" value={form.section_id} onChange={(e) => setForm((p) => ({ ...p, section_id: e.target.value, category_id: '' }))} required>
                <option value="">{locale === 'ar' ? 'اختر القسم' : 'Select section'}</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">{locale === 'ar' ? 'الفئة' : 'Category'}</label>
              <select className="form-select" value={form.category_id} onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))} required>
                <option value="">{locale === 'ar' ? 'اختر الفئة' : 'Select category'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">{locale === 'ar' ? 'الدولة' : 'Country'}</label>
              <select className="form-select" value={form.country_id} onChange={(e) => setForm((p) => ({ ...p, country_id: e.target.value, city_id: '' }))} required>
                <option value="">{locale === 'ar' ? 'اختر الدولة' : 'Select country'}</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">{locale === 'ar' ? 'المدينة' : 'City'}</label>
              <select className="form-select" value={form.city_id} onChange={(e) => setForm((p) => ({ ...p, city_id: e.target.value }))} required>
                <option value="">{locale === 'ar' ? 'اختر المدينة' : 'Select city'}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label">{locale === 'ar' ? 'عنوان المزاد' : 'Auction title'}</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">{locale === 'ar' ? 'تاريخ الإنهاء' : 'End time'}</label>
              <input type="datetime-local" className="form-control" value={form.end_at} onChange={(e) => setForm((p) => ({ ...p, end_at: e.target.value }))} required />
            </div>
            <div className="col-12">
              <label className="form-label">{locale === 'ar' ? 'الوصف' : 'Description'}</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label">{locale === 'ar' ? 'صور المزاد (متعددة)' : 'Auction images (multiple)'}</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="form-control"
                onChange={(e) => setImages(Array.from(e.target.files ?? []))}
              />
              {images.length > 0 ? (
                <div className="small text-muted mt-1">
                  {locale === 'ar' ? `تم اختيار ${images.length} صورة` : `${images.length} image(s) selected`}
                </div>
              ) : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">{locale === 'ar' ? 'سعر البداية' : 'Start price'}</label>
              <input type="number" className="form-control" value={form.start_price} onChange={(e) => setForm((p) => ({ ...p, start_price: e.target.value }))} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">{locale === 'ar' ? 'أقل زيادة' : 'Min increment'}</label>
              <input type="number" className="form-control" value={form.min_increment} onChange={(e) => setForm((p) => ({ ...p, min_increment: e.target.value }))} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">{locale === 'ar' ? 'سعر الحجز (اختياري)' : 'Reserve price (optional)'}</label>
              <input type="number" className="form-control" value={form.reserve_price} onChange={(e) => setForm((p) => ({ ...p, reserve_price: e.target.value }))} />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-warning" type="submit" disabled={loading}>
                {editingPostId ? (locale === 'ar' ? 'تحديث المزاد' : 'Update auction') : (locale === 'ar' ? 'إنشاء مزاد' : 'Create auction')}
              </button>
              {editingPostId ? (
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingPostId(null)}>
                  {locale === 'ar' ? 'إلغاء التعديل' : 'Cancel edit'}
                </button>
              ) : null}
            </div>
            {message ? <div className="col-12"><div className="alert alert-info mb-0">{message}</div></div> : null}
          </form>

          <hr className="my-4" />

          <h5 className="mb-3">{locale === 'ar' ? 'مزاداتي' : 'My auctions'}</h5>
          <div className="row g-3">
            {mine.map((lot) => (
              <div className="col-md-6" key={lot.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="mb-1">{lot?.post?.title}</h6>
                    <div className="small text-muted mb-2">
                      {locale === 'ar' ? 'الحالة' : 'Status'}: {lot.status} - {locale === 'ar' ? 'العروض' : 'Bids'}: {lot.bids_count}
                    </div>
                    <div className="fw-bold">${Number(lot.current_price ?? 0).toLocaleString()}</div>
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditingPostId(Number(lot.post_id))
                          setForm((p) => ({
                            ...p,
                            section_id: String(lot?.post?.section_id ?? ''),
                            category_id: String(lot?.post?.category_id ?? ''),
                            country_id: String(lot?.post?.country_id ?? ''),
                            city_id: String(lot?.post?.city_id ?? ''),
                            title: lot?.post?.title ?? '',
                            description: lot?.post?.description ?? '',
                            start_price: String(lot.start_price ?? ''),
                            min_increment: String(lot.min_increment ?? '1'),
                            reserve_price: lot.reserve_price != null ? String(lot.reserve_price) : '',
                            end_at: lot.end_at ? String(lot.end_at).slice(0, 16) : '',
                          }))
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => void onDelete(Number(lot.post_id))}>
                        {locale === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={async () => {
                          if (!accessToken) return
                          const json = await fetchAuctionStatistics(Number(lot.post_id), accessToken)
                          setStats(json?.data ?? null)
                        }}
                      >
                        {locale === 'ar' ? 'إحصائيات' : 'Stats'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats ? (
            <div className="card mt-4">
              <div className="card-body">
                <h6 className="mb-3">{locale === 'ar' ? 'إحصائيات المزاد' : 'Auction statistics'}: {stats.title}</h6>
                <div className="row g-3">
                  <div className="col-md-3"><div className="p-2 bg-light rounded">{locale === 'ar' ? 'السعر الحالي' : 'Current price'}: ${Number(stats.current_price ?? 0).toLocaleString()}</div></div>
                  <div className="col-md-3"><div className="p-2 bg-light rounded">{locale === 'ar' ? 'عدد العروض' : 'Bids count'}: {stats.bids_count ?? 0}</div></div>
                  <div className="col-md-3"><div className="p-2 bg-light rounded">{locale === 'ar' ? 'المتابعون' : 'Watchers'}: {stats.watchers_count ?? 0}</div></div>
                  <div className="col-md-3"><div className="p-2 bg-light rounded">{locale === 'ar' ? 'الحالة' : 'Status'}: {stats.status}</div></div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

