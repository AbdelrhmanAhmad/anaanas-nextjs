import type { Metadata } from 'next'

import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

import NotificationsClient from './components/NotificationsClient'

type RouteParams = { locale?: string }

export const metadata: Metadata = {
  title: 'Notifications',
}

const NotificationsPage = async ({ params }: { params: Promise<RouteParams> }) => {
  const { locale: rawLocale } = await params
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  return <NotificationsClient locale={locale} />
}

export default NotificationsPage
