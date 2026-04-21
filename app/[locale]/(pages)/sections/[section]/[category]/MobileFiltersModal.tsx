'use client'

import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { BsFilter } from 'react-icons/bs'
import { useParams } from 'next/navigation'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

import type { City } from '@/lib/api/cities'
import type { Field } from '@/lib/api/fields'
import PostsFilterPanel from './PostsFilterPanel'

export default function MobileFiltersModal({
  fields,
  cities,
}: {
  fields: Field[]
  cities: City[]
}) {
  const [open, setOpen] = useState(false)
  const params = useParams<{ locale?: string }>()
  const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  const locale: SupportedLocale = (localeFromParams && isSupportedLocale(localeFromParams)) ? localeFromParams : DEFAULT_LOCALE

  return (
    <>
      <div className="d-lg-none">
        <Button variant="primary" className="w-100" onClick={() => setOpen(true)}>
          <BsFilter className="me-2" />
          {t('filter.filterResults', locale)}
        </Button>
      </div>

      <Modal show={open} onHide={() => setOpen(false)} centered size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{t('filter.filterResults', locale)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostsFilterPanel fields={fields} cities={cities} onClick={() => setOpen(false)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t('filter.close', locale)}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


