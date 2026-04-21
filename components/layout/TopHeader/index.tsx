'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, type FormEvent } from 'react'
import { BsChatLeftTextFill, BsGearFill, BsSearch } from 'react-icons/bs'

import LogoBox from '@/components/LogoBox'
import NotificationsBell from './NotificationsBell'
import ProfileDropdown from './ProfileDropdown'
import StyledHeader from './StyledHeader'
import MobileSectionsDrawer from './MobileSectionsDrawer'
import CountryDropdown from './CountryDropdown'
import BetaBadge from './BetaBadge'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const TopHeader = () => {
  const { status } = useSession()
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const locale: SupportedLocale = (() => {
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) {
      return localeFromParams
    }
    return DEFAULT_LOCALE
  })()

  const isArabic = locale === 'ar'
  const isAuthed = status === 'authenticated'

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(
      trimmed ? `/${locale}/search?q=${encodeURIComponent(trimmed)}` : `/${locale}/search`,
    )
  }

  const searchPlaceholder = isArabic ? 'ابحث في المنشورات...' : 'Search listings...'

  return (
    <StyledHeader>
      <div className="container topHeaderGrid">
        {/* ==================== START CLUSTER (brand + mobile drawer) ==================== */}
        <div className="topHeader__start">
          <MobileSectionsDrawer locale={locale} />
          <LogoBox />
          <BetaBadge locale={locale} className="d-none d-sm-inline-flex" />
        </div>

        {/* ==================== DESKTOP SEARCH (center) ==================== */}
        <form
          className="topHeader__search d-none d-lg-flex"
          role="search"
          onSubmit={handleSearch}
        >
          <div className="topHeader__searchField">
            <BsSearch className="topHeader__searchIcon" aria-hidden />
            <input
              className="form-control"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoComplete="off"
            />
          </div>
        </form>

        {/* ==================== END CLUSTER (actions) ==================== */}
        <div className="topHeader__end">
          {/* Country picker — full on desktop, compact on mobile */}
          <div className="d-none d-lg-inline-flex">
            <CountryDropdown locale={locale} />
          </div>
          <div className="d-lg-none">
            <CountryDropdown locale={locale} compact />
          </div>

          {/* Messaging (desktop only) */}
          {isAuthed && (
            <Link
              className="topHeader__iconBtn d-none d-lg-inline-flex"
              href={`/${locale}/messaging`}
              aria-label={isArabic ? 'المراسلة' : 'Messaging'}
              title={isArabic ? 'المراسلة' : 'Messaging'}
            >
              <BsChatLeftTextFill size={15} />
            </Link>
          )}

          {/* Settings (desktop only) */}
          {isAuthed && (
            <Link
              className="topHeader__iconBtn d-none d-lg-inline-flex"
              href={`/${locale}/settings/account`}
              aria-label={isArabic ? 'الإعدادات' : 'Settings'}
              title={isArabic ? 'الإعدادات' : 'Settings'}
            >
              <BsGearFill size={15} />
            </Link>
          )}

          {/* Notifications */}
          {isAuthed && <NotificationsBell locale={locale} />}

          {/* Profile */}
          <ProfileDropdown locale={locale} />
        </div>

        {/* ==================== MOBILE SEARCH (wraps to new row) ==================== */}
        <form
          className="topHeader__searchMobile d-lg-none"
          role="search"
          onSubmit={handleSearch}
        >
          <div className="topHeader__searchField">
            <BsSearch className="topHeader__searchIcon" aria-hidden />
            <input
              className="form-control"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoComplete="off"
            />
          </div>
        </form>
      </div>

      <style jsx global>{`
        /* ----- Header wrapper polish ----- */
        .topNav {
          padding-top: 0.45rem;
          padding-bottom: 0.45rem;
        }

        .topNav .container.topHeaderGrid {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          row-gap: 8px;
        }

        /* ----- Start cluster (brand + mobile drawer) ----- */
        .topHeader__start {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 0 0 auto;
          min-width: 0;
        }

        .topHeader__start .navbar-brand {
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: center;
        }

        /* Logo sizing per breakpoint */
        .topNav .navbar-brand-item {
          width: 56px !important;
          height: 56px !important;
          object-fit: contain;
        }

        /* ----- End cluster (actions) ----- */
        .topHeader__end {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex: 0 0 auto;
          margin-inline-start: auto; /* pushes to logical end in LTR & RTL */
        }

        /* ----- Search (desktop, centered between start and end) ----- */
        .topHeader__search {
          flex: 1 1 320px;
          min-width: 240px;
          max-width: 540px;
          margin-inline: auto;
        }

        .topHeader__searchField {
          position: relative;
          width: 100%;
        }

        .topHeader__searchField .form-control {
          background: #f4f5f8;
          border: 1px solid transparent;
          border-radius: 999px;
          padding-inline: 44px 16px; /* start for icon, end for text */
          height: 40px;
          font-size: 0.9rem;
          transition: background-color 0.18s ease, border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .topHeader__searchField .form-control:focus {
          background: #fff;
          border-color: rgba(255, 193, 7, 0.4);
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.12);
          outline: none;
        }

        .topHeader__searchIcon {
          position: absolute;
          inset-inline-start: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 14px;
          pointer-events: none;
        }

        /* ----- Mobile search: full width row below the top cluster ----- */
        .topHeader__searchMobile {
          flex: 1 1 100%;
          order: 99;
          /* Subtle separator to visually split the two rows */
          margin-top: 4px;
          padding-top: 6px;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
        }

        .topHeader__searchMobile .form-control {
          height: 38px;
          font-size: 0.88rem;
        }

        .topHeader__searchMobile .topHeader__searchField .form-control {
          padding-inline: 40px 14px;
        }

        .topHeader__searchMobile .topHeader__searchIcon {
          inset-inline-start: 14px;
        }

        /* ----- Generic icon button (used for chat/settings/etc) ----- */
        .topHeader__iconBtn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f4f5f8;
          color: #374151;
          text-decoration: none;
          border: 0;
          transition: background-color 0.18s ease, color 0.18s ease,
            transform 0.18s ease;
        }
        .topHeader__iconBtn:hover {
          background: #eceef2;
          color: #111827;
          transform: translateY(-1px);
        }
        .topHeader__iconBtn:focus-visible {
          outline: 2px solid rgba(255, 193, 7, 0.55);
          outline-offset: 2px;
        }

        /* Bell + Profile dropdown toggles should share the same size as iconBtn */
        .topHeader__end .nav-link.icon-md,
        .topHeader__end .dropdown-toggle.icon-md {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: #f4f5f8;
        }

        /* Neutralise legacy Bootstrap margin utilities inside the end cluster
           so the flex gap controls spacing consistently in LTR & RTL. */
        .topHeader__end .nav-item,
        .topHeader__end > * {
          margin: 0 !important;
        }

        /* Country dropdown: remove default chevron arrow */
        .countryDropdown .dropdown-toggle::after {
          display: none;
        }

        /* Dropdown menus — ensure they float (not inline) and don't overflow viewport */
        .topHeader__end .dropdown-menu,
        .countryDropdown .dropdown-menu {
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          margin-top: 6px;
        }

        /* ----- Mobile ≤ 991px: shrink brand, hide beta text becomes visible from ≥576px ----- */
        @media (max-width: 991.98px) {
          .topNav {
            padding-top: 0.35rem;
            padding-bottom: 0.35rem;
          }
          .topNav .navbar-brand-item {
            width: 40px !important;
            height: 40px !important;
          }
          .topHeader__end {
            gap: 0.3rem;
          }
          .topHeader__iconBtn,
          .topHeader__end .nav-link.icon-md,
          .topHeader__end .dropdown-toggle.icon-md {
            width: 36px;
            height: 36px;
          }
        }

        /* ----- Extra-small phones ----- */
        @media (max-width: 420px) {
          .topNav .container.topHeaderGrid {
            gap: 0.4rem;
          }
          .topNav .navbar-brand-item {
            width: 34px !important;
            height: 34px !important;
          }
        }
      `}</style>
    </StyledHeader>
  )
}

export default TopHeader
