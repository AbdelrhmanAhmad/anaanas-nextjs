'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { Button, Card, CardBody, CardFooter } from 'react-bootstrap'
import { BsGlobe2, BsHouseDoorFill } from 'react-icons/bs'
import clsx from 'clsx'
import styles from './SideBar.module.css'

import { currentYear, developedBy, developedByLink } from '@/context/constants'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import type { Section } from '@/lib/api/sections'
import { t } from '@/lib/translations'
import LanguageSelectorModal from './LanguageSelectorModal'

type SideBarProps = {
  sections: Section[]
  locale?: string
}

const SideBar = ({ sections, locale: localeProp }: SideBarProps) => {
  const [showModal, setShowModal] = useState(false)
  const [targetLocale, setTargetLocale] = useState<SupportedLocale | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams<{ locale?: string }>()

  const currentLocale: SupportedLocale = useMemo(() => {
    if (localeProp && isSupportedLocale(localeProp)) {
      return localeProp
    }
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
  }, [localeProp, params?.locale, pathname])

  const copy = useMemo(
    () =>
      currentLocale === 'ar'
        ? {
            triggerLabel: 'تغيير اللغة',
            modalTitle: 'اختر اللغة المفضلة لديك',
            modalSubtitle: 'سنقوم بتحديث المحتوى فوراً بناءً على اختيارك.',
            actionHint: 'اضغط على اللغة المطلوبة للاستمرار',
            confirmation: 'جارٍ تفعيل اللغة الجديدة...',
            currentLabel: 'اللغة الحالية',
            inactiveHint: 'انقر للتبديل',
          }
        : {
            triggerLabel: 'Change language',
            modalTitle: 'Choose your preferred language',
            modalSubtitle: 'The experience will instantly match your selection.',
            actionHint: 'Tap a card to continue',
            confirmation: 'Switching to the new language...',
            currentLabel: 'Current language',
            inactiveHint: 'Tap to switch',
          },
    [currentLocale],
  )

  const localeCards: Record<
    SupportedLocale,
    {
      title: string
      subtitle: string
      badge: string
    }
  > = {
    ar: {
      title: 'العربية',
      subtitle: 'تجربة عربية كاملة مع اتجاه RTL',
      badge: 'AR',
    },
    en: {
      title: 'English',
      subtitle: 'A clean LTR experience for global users',
      badge: 'EN',
    },
  }

  const buildLocalizedPath = (nextLocale: SupportedLocale) => {
    if (!pathname) {
      return `/${nextLocale}`
    }

    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) {
      segments.push(nextLocale)
    } else if (isSupportedLocale(segments[0])) {
      segments[0] = nextLocale
    } else {
      segments.unshift(nextLocale)
    }

    const nextPath = `/${segments.join('/')}`
    const queryString = searchParams?.toString()

    return queryString ? `${nextPath}?${queryString}` : nextPath
  }

  const handleSwitchLocale = (nextLocale: SupportedLocale) => {
    if (nextLocale === currentLocale) {
      return
    }
    setTargetLocale(nextLocale)

    const targetPath = buildLocalizedPath(nextLocale)
    startTransition(() => {
      // router.push(targetPath)
      location.href = targetPath
    })
  }

  const normalizedPath = pathname?.replace(/\/$/, '')
  const homeHref = `/${currentLocale}`

  const isHomeActive =
    normalizedPath === homeHref || normalizedPath === `${homeHref}/home` || normalizedPath === `${homeHref}/` || normalizedPath === ''

  return (
    <>
      <Card className="overflow-hidden h-100 pt-5 ">
        <CardBody className="pt-0">
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <Link
                className={clsx(styles.menuLink, { [styles.menuLinkActive]: isHomeActive })}
                href={homeHref}
              >
                <span className={styles.menuIcon}>
                  <BsHouseDoorFill />
                </span>
                <span className={styles.menuText}>
                  {currentLocale === 'ar' ? 'الرئيسية' : 'Home'}
                </span>
              </Link>
            </li>
            {sections.length === 0 ? (
              <li className="text-muted small">{t('sidebar.noSections', currentLocale)}</li>
            ) : (
              sections.map((section) => (
                <li key={section.id} className={styles.menuItem}>
                  <Link
                    className={clsx(styles.menuLink, {
                      [styles.menuLinkActive]:
                        normalizedPath?.startsWith(`/${currentLocale}/sections/${section.slug}`) ?? false,
                    })}
                    href={`/${currentLocale}/sections/${section.slug}`}
                  >
                    <span className={styles.menuIcon}>
                      {section.icon ? (
                        <Image
                          src={section.icon}
                          unoptimized
                          alt={section.name}
                          height={50}
                          width={50}
                        />
                      ) : (
                        <span className={styles.menuEmoji} aria-hidden="true">
                          🔹
                        </span>
                      )}
                    </span>
                    <span className={styles.menuText}>{section.name}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </CardBody>

        <CardFooter className="text-center py-2">
          <Button variant="link" size="sm" href="/profile/feed">
            {t('sidebar.viewProfile', currentLocale)}{' '}
          </Button>
        </CardFooter>
      </Card>

      <Button variant="outline-primary" className="w-100 mt-4 language-switch-btn d-flex align-items-center justify-content-center gap-2" onClick={() => setShowModal(true)}>
        <BsGlobe2 />
        <span>{copy.triggerLabel}</span>
      </Button>

      <ul className="nav small mt-4 justify-content-center lh-1">
        {/* <li className="nav-item">
          <Link className="nav-link" href="/profile/about">
            {t('sidebar.aboutUs', currentLocale)}
          </Link>
        </li> */}
        {/* <li className="nav-item">
          <Link className="nav-link" href="/settings/account">
            {t('sidebar.settings', currentLocale)}
          </Link>
        </li> */}
        {/* <li className="nav-item">
          <Link className="nav-link" target="_blank" rel="noreferrer" href={developedByLink}>
            {t('sidebar.support', currentLocale)}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" target="_blank" rel="noreferrer" href="#">
            {t('sidebar.feedback', currentLocale)}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/help">
            {t('sidebar.help', currentLocale)}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/privacy-terms">
            {t('sidebar.privacyTerms', currentLocale)}
          </Link>
        </li> */}
        
      </ul>

      <p className="small text-center mt-1">
        ©{currentYear}{' '}
        <a className="text-reset" target="_blank" rel="noreferrer" href={developedByLink}>
          {' '}
          {developedBy}{' '}
        </a>
      </p>

      <LanguageSelectorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        copy={copy}
        currentLocale={currentLocale}
        isPending={isPending}
        targetLocale={targetLocale}
        localeCards={localeCards}
        onSwitchLocale={handleSwitchLocale}
      />
    </>
  )
}

export default SideBar
