'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Offcanvas } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { BsList, BsGrid3X3GapFill, BsXLg, BsBoxArrowInRight } from 'react-icons/bs'

import { useAppData } from '@/context/AppDataContext'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import type { SupportedLocale } from '@/lib/localization'

type Props = {
  locale?: SupportedLocale
}

/**
 * Mobile-only slide-in drawer exposing the full section list.
 * Triggered by a hamburger button in the top header on small screens.
 */
const MobileSectionsDrawer = ({ locale = 'ar' }: Props) => {
  const [show, setShow] = useState(false)
  const { sections, loadingSections } = useAppData()
  const isArabic = locale === 'ar'

  // Lock body scroll while open (react-bootstrap already does this, but be defensive).
  useEffect(() => {
    if (!show) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [show])

  const handleOpen = () => setShow(true)
  const handleClose = () => setShow(false)

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={isArabic ? 'فتح قائمة الأقسام' : 'Open sections menu'}
        className="btn btn-light icon-md p-0 rounded-circle d-inline-flex align-items-center justify-content-center d-lg-none"
        style={{ width: 38, height: 38 }}
      >
        <BsList size={20} />
      </button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={isArabic ? 'end' : 'start'}
        className="mobileSectionsDrawer"
        backdropClassName="mobileSectionsDrawerBackdrop"
      >
        <Offcanvas.Header className="border-bottom align-items-center">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 34,
                height: 34,
                background:
                  'linear-gradient(135deg, rgba(255,193,7,0.2), rgba(255,87,51,0.25))',
              }}
            >
              <BsGrid3X3GapFill className="text-warning" />
            </span>
            <div className="lh-1">
              <div className="fw-bold">{isArabic ? 'الأقسام' : 'Sections'}</div>
              <small className="text-muted">
                {isArabic ? 'تصفح كل الفئات والأقسام' : 'Browse all categories'}
              </small>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={isArabic ? 'إغلاق' : 'Close'}
            className="btn btn-light rounded-circle icon-sm p-0 d-inline-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
          >
            <BsXLg size={14} />
          </button>
        </Offcanvas.Header>

        <Offcanvas.Body className="px-2 py-3">
          {loadingSections && (
            <div className="d-flex flex-column gap-2 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3 bg-light placeholder-glow"
                  style={{ height: 56 }}
                >
                  <span className="placeholder col-12 h-100 rounded-3" />
                </div>
              ))}
            </div>
          )}

          {!loadingSections && sections.length === 0 && (
            <div className="text-center text-muted py-5 small">
              {isArabic ? 'لا توجد أقسام متاحة' : 'No sections available'}
            </div>
          )}

          <ul className="list-unstyled d-flex flex-column gap-2 m-0">
            {sections.map((s, idx) => {
              const href = `/${locale}/${s.slug}`
              const iconSrc = s.icon ? resolveMediaUrl(s.icon) : ''
              return (
                <li key={s.id}>
                  <Link
                    href={href}
                    onClick={handleClose}
                    className="d-flex align-items-center gap-3 text-decoration-none p-2 rounded-3 sectionItem"
                    style={{
                      background: 'linear-gradient(90deg, #fff, #fafafa)',
                      border: '1px solid rgba(0,0,0,0.04)',
                      animation: `drawerItemIn .32s cubic-bezier(.2,.8,.2,1) both`,
                      animationDelay: `${Math.min(idx * 40, 280)}ms`,
                    }}
                  >
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-3 overflow-hidden flex-shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        background:
                          'linear-gradient(135deg, rgba(255,193,7,0.15), rgba(255,87,51,0.15))',
                      }}
                    >
                      {iconSrc ? (
                        <Image
                          src={iconSrc}
                          alt={s.name}
                          width={28}
                          height={28}
                          unoptimized
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <BsGrid3X3GapFill className="text-warning" size={20} />
                      )}
                    </span>
                    <span className="flex-grow-1 text-dark fw-semibold">{s.name}</span>
                    <BsBoxArrowInRight
                      className={`text-muted ${isArabic ? '' : ''}`}
                      size={16}
                      style={isArabic ? { transform: 'rotate(180deg)' } : undefined}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <style jsx global>{`
        @keyframes drawerItemIn {
          from {
            opacity: 0;
            transform: translateX(${isArabic ? '16px' : '-16px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .mobileSectionsDrawer {
          width: min(86vw, 360px) !important;
          border-radius: ${isArabic ? '18px 0 0 18px' : '0 18px 18px 0'};
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
        }
        .mobileSectionsDrawerBackdrop {
          backdrop-filter: blur(6px);
        }
        .sectionItem:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
      `}</style>
    </>
  )
}

export default MobileSectionsDrawer
