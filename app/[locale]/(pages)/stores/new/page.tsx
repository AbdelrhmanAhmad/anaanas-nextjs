import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import StoreOnboardingClient from './StoreOnboardingClient'

export const metadata: Metadata = { title: 'Register store' }

export default async function StoreNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE

  return (
    <main className="container py-4 py-md-5 mt-5">
      <StoreOnboardingClient locale={locale} />
    </main>
  )
}

