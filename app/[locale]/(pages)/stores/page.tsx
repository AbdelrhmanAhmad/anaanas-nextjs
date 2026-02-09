import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import StoresExplorerClient from './StoresExplorerClient'

export const metadata: Metadata = { title: 'Stores' }

export default async function StoresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE

  return (
    <main className="container py-4 py-md-5 mt-5">
      <StoresExplorerClient locale={locale} />
    </main>
  )
}

