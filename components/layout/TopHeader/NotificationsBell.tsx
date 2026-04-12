'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { BsBellFill } from 'react-icons/bs'

import type { SupportedLocale } from '@/lib/localization'

type NotificationItem = {
  id: number | string
  title: string
  body?: string
  url?: string
  is_read?: boolean
  created_at?: string
}

export default function NotificationsBell({ locale }: { locale: SupportedLocale }) {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)

  const text = useMemo(
    () =>
      locale === 'ar'
        ? {
            title: 'الإشعارات',
            empty: 'لا توجد إشعارات حالياً',
            viewAll: 'عرض الكل',
            markAll: 'تحديد الكل كمقروء',
          }
        : {
            title: 'Notifications',
            empty: 'No notifications yet',
            viewAll: 'View all',
            markAll: 'Mark all as read',
          },
    [locale],
  )

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?per_page=8&land=${locale}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      const json = await res.json().catch(() => ({}))
      if (json?.success) {
        setItems(Array.isArray(json.data) ? json.data : [])
        setUnread(Number(json.unread_count ?? 0))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    const id = window.setInterval(() => void load(), 15000)
    return () => window.clearInterval(id)
  }, [locale])

  const markRead = async (id: number | string) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({}),
    })
    void load()
  }

  const markAll = async () => {
    await fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({}),
    })
    void load()
  }

  return (
    <Dropdown as="li" autoClose="outside" className="nav-item ms-2" align="end">
      <DropdownToggle className="content-none nav-link bg-light icon-md btn btn-light p-0">
        {unread > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: 10 }}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        )}
        <BsBellFill size={15} />
      </DropdownToggle>
      <DropdownMenu className="dropdown-animation dropdown-menu-end p-0 shadow-lg border-0" style={{ minWidth: 320 }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <strong>{text.title}</strong>
          <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => void markAll()}>
            {text.markAll}
          </button>
        </div>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          {loading && <div className="p-3 small text-muted">…</div>}
          {!loading && items.length === 0 && <div className="p-3 small text-muted">{text.empty}</div>}
          {items.map((n) => {
            const href = n.url ? (n.url.startsWith('/') ? `/${locale}${n.url}` : n.url) : '#'
            return (
              <Link
                key={String(n.id)}
                href={href}
                onClick={() => void markRead(n.id)}
                className={`d-block px-3 py-2 text-decoration-none border-bottom ${n.is_read ? '' : 'bg-light'}`}
              >
                <div className="small fw-semibold text-dark">{n.title}</div>
                {n.body ? <div className="small text-muted mt-1">{n.body}</div> : null}
              </Link>
            )
          })}
        </div>
        <div className="p-2 text-center">
          <Link href={`/${locale}/profile/feed`} className="small text-decoration-none">
            {text.viewAll}
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}
