'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'

import type { Category } from '@/lib/api/categories'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

type SectionSidebarProps = {
  categories: Category[]
}

const SectionSidebar = ({ categories }: SectionSidebarProps) => {
  const pathname = usePathname()
  const params = useParams<{ locale?: string; section?: string }>()

  const currentLocale: SupportedLocale = useMemo(() => {
    const localeFromParams = Array.isArray(params?.locale) ? params?.locale[0] : params?.locale
    if (isSupportedLocale(localeFromParams)) {
      return localeFromParams
    }
    if (pathname) {
      const segments = pathname.split('/').filter(Boolean)
      const maybeLocale = segments[0]
      if (isSupportedLocale(maybeLocale)) {
        return maybeLocale
      }
    }
    return DEFAULT_LOCALE
  }, [params?.locale, pathname])

  const sectionSlug = useMemo(() => {
    const fromParams = Array.isArray(params?.section) ? params?.section[0] : params?.section
    if (fromParams) return fromParams

    if (!pathname) return ''
    const segments = pathname.split('/').filter(Boolean)
    // /{locale}/{section}/...
    return segments[1] ?? ''
  }, [params?.section, pathname])

  return (
    <div className="card overflow-hidden h-100 pt-5 w-100">
      <div className="card-body pt-0">
        <ul className="nav nav-link-secondary flex-column fw-bold gap-2">
          {categories.length === 0 ? (
            <li className="nav-item text-muted small">لا توجد تصنيفات متاحة حاليًا</li>
          ) :
          
          <>
              <li className="nav-item">
              <Link className="nav-link" href={`/${currentLocale}`}>
                <span> الاقسام</span>
              </Link>
          </li>
          
          <li className="nav-item">
              <Link className="nav-link" href={`/${currentLocale}/${sectionSlug}`}>
                <span> الكل</span>
              </Link>
          </li>
      
           { categories.map((category) => (
              <li key={category.id} className="nav-item">
                <Link
                  className="nav-link"
                  // يمكن لاحقًا تعديل الـ URL بناءً على شكل روابط التصنيفات المطلوب
                  href={`/${currentLocale}/${sectionSlug}/${category.slug}`}>
                  {category.icon && (
                    <Image
                      src={category.icon}
                      unoptimized
                      alt={category.name}
                      height={20}
                      width={20}
                      className="me-2 h-20px fa-fw"
                    />
                  )}
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </>
          
          
          }
        </ul>
      </div>
    </div>
  )
}

export default SectionSidebar


