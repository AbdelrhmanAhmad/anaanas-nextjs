import type { Metadata } from 'next'
import { Col } from 'react-bootstrap'

import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SideBar from '@/components/layout/SideBar'
import { fetchSections } from '@/lib/api/sections'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import { getContactPageCopy, t } from '@/lib/translations'

import ContactForm from './ContactForm'
import styles from './contact.module.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE
  const title = `${t('contact.title', locale)} | ANANAS`
  const description = t('contact.subtitle', locale)

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/contact` },
    openGraph: { title, description, type: 'website', url: `/${locale}/contact` },
    twitter: { card: 'summary_large_image', title, description },
  }
}

const ContactPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE
  const sections = await fetchSections(locale, { revalidateSeconds: 300 })
  const copy = getContactPageCopy(locale)

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <FeedLayoutClient locale={locale} sidebar={<SideBar sections={sections} locale={locale} />}>
          <Col md={8} lg={6} className="mx-auto">
            <ContactForm locale={locale} copy={copy} />
          </Col>
        </FeedLayoutClient>
      </div>
    </div>
  )
}

export default ContactPage
