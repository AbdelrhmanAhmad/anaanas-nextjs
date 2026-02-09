'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BsChatLeftTextFill, BsGearFill, BsShop } from 'react-icons/bs'

import LogoBox from '@/components/LogoBox'
import CollapseMenu from './CollapseMenu'
import MobileMenuToggle from './MobileMenuToggle'
import NotificationDropdown from './NotificationDropdown'
import ProfileDropdown from './ProfileDropdown'
import StyledHeader from './StyledHeader'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const TopHeader = () => {
  const params = useParams<{ locale?: string }>()
  
  // Get locale from params or default
  const locale: SupportedLocale = (() => {
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) {
      return localeFromParams
    }
    return DEFAULT_LOCALE
  })()

  return (
    <StyledHeader>
      <div className="container">
        <LogoBox />

        <MobileMenuToggle />

        <CollapseMenu isSearch locale={locale} />

        <ul className="nav flex-nowrap align-items-center ms-sm-3 list-unstyled">
          <li className="nav-item ms-2">
            <Link className="nav-link bg-light icon-md btn btn-light p-0" href={`/${locale}/messaging`}>
              <BsChatLeftTextFill size={15} />
            </Link>
          </li>

          <li className="nav-item ms-2">
            <Link className="nav-link bg-light icon-md btn btn-light p-0" href={`/${locale}/settings/account`}>
              <BsGearFill size={15} />
            </Link>
          </li>


          {/* متجري    */}
          <li className="nav-item ms-2">
            <Link
              className="nav-link bg-light icon-md btn btn-light p-0"
              href={`/${locale}/my-store`}
              title={locale === 'ar' ? 'متجري' : 'My store'}
            >
              <BsShop size={15} />
            </Link>
          </li>

          {/* <NotificationDropdown /> */}

          <ProfileDropdown locale={locale} />
        </ul>
      </div>
    </StyledHeader>
  )
}

export default TopHeader
