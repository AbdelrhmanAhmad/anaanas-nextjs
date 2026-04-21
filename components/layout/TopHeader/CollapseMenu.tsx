'use client'
import { Collapse } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import AppMenu from './AppMenu'
import { useLayoutContext } from '@/context/useLayoutContext'
import { BsSearch } from 'react-icons/bs'
import type { SupportedLocale } from '@/lib/localization'

const CollapseMenu = ({ isSearch, locale = 'ar' }: { isSearch?: boolean; locale?: SupportedLocale }) => {
  const {
    mobileMenu: { open },
  } = useLayoutContext()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    const target = trimmed
      ? `/${locale}/search?q=${encodeURIComponent(trimmed)}`
      : `/${locale}/search`
    router.push(target)
  }

  return (
    <Collapse in={open} className="navbar-collapse">
      <div>
        {isSearch && (
          <div className="nav mt-3 mt-lg-0 flex-nowrap align-items-center px-4 px-lg-0">
            <div className="nav-item w-100">
              <form className="rounded position-relative" role="search" onSubmit={handleSubmit}>
                <input
                  className="form-control ps-5 bg-light"
                  type="search"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={locale === 'ar' ? 'ابحث في المنشورات...' : 'Search listings...'}
                  aria-label={locale === 'ar' ? 'بحث' : 'Search'}
                  autoComplete="off"
                />
                <button
                  className="btn bg-transparent px-2 py-0 position-absolute top-50 start-0 translate-middle-y"
                  type="submit"
                  aria-label={locale === 'ar' ? 'بحث' : 'Search'}
                >
                  <BsSearch className="fs-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        <AppMenu />
      </div>
    </Collapse>
  )
}

export default CollapseMenu
