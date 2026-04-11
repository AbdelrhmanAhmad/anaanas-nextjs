'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { BsCloudArrowUp, BsHourglassSplit, BsPlusLg, BsTrash } from 'react-icons/bs'
import clsx from 'clsx'

import { t, type SupportedLocale } from '@/lib/translations'
import styles from './WizardPostPhotosStep.module.css'

export type WizardPostPhotosExisting = { id: number | string; url: string }

const MAX_PHOTOS = 5
const MAX_BYTES = 5 * 1024 * 1024

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const

function formatBytes(n: number, locale: string) {
  const mb = n / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = n / 1024
  return `${Math.max(1, Math.round(kb))} KB`
}

function rejectionsToMessages(rejections: FileRejection[], loc: SupportedLocale): string[] {
  const out: string[] = []
  for (const r of rejections) {
    for (const e of r.errors) {
      if (e.code === 'file-too-large') {
        out.push(t('createPost.photos.errTooLarge', loc))
      } else if (e.code === 'file-invalid-type') {
        out.push(t('createPost.photos.errBadType', loc))
      } else if (e.code === 'too-many-files') {
        out.push(t('createPost.photos.errSomeSkipped', loc))
      }
    }
  }
  return [...new Set(out)]
}

export type WizardPostPhotosStepClassNames = {
  section: string
  sectionTitle: string
  sectionHint: string
  badgeSoft: string
}

export type WizardPostPhotosStepProps = {
  locale: string
  classNames: WizardPostPhotosStepClassNames
  dir?: 'rtl' | 'ltr'
  images: File[]
  onImagesChange: (next: File[]) => void
  dropzoneKey: number
  isEdit?: boolean
  existingImages?: WizardPostPhotosExisting[]
  deletingImageId?: string | null
  onDeleteExistingImage?: (img: WizardPostPhotosExisting) => void | Promise<void>
}

export default function WizardPostPhotosStep({
  locale,
  classNames: cn,
  dir = 'rtl',
  images,
  onImagesChange,
  dropzoneKey,
  isEdit = false,
  existingImages = [],
  deletingImageId = null,
  onDeleteExistingImage,
}: WizardPostPhotosStepProps) {
  const loc = (locale === 'en' ? 'en' : 'ar') as SupportedLocale
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f))
    setPreviewUrls(urls)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [images])

  const slotsLeft = Math.max(0, MAX_PHOTOS - images.length)
  const atCapacity = images.length >= MAX_PHOTOS

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const fromReject = rejectionsToMessages(fileRejections, loc)

      if (atCapacity) {
        setErrors([...new Set([t('createPost.photos.errSlotsFull', loc), ...fromReject])])
        return
      }

      const remaining = MAX_PHOTOS - images.length
      const toAdd = acceptedFiles.slice(0, remaining)
      const skippedDueToCap = acceptedFiles.length > remaining
      const capMsg = skippedDueToCap ? [t('createPost.photos.errSomeSkipped', loc)] : []
      setErrors([...new Set([...fromReject, ...capMsg])])

      if (toAdd.length > 0) {
        onImagesChange([...images, ...toAdd])
      }
    },
    [atCapacity, images, loc, onImagesChange],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_BYTES,
    maxFiles: Math.max(1, slotsLeft),
    disabled: atCapacity,
    noClick: true,
    noKeyboard: true,
  })

  const removeAt = (idx: number) => {
    onImagesChange(images.filter((_, i) => i !== idx))
    setErrors([])
  }

  const rootProps = getRootProps({
    className: clsx(
      styles.dropShell,
      isDragActive && !atCapacity && styles.dropShellActive,
      atCapacity && styles.dropShellDisabled,
    ),
  })

  return (
    <section className={cn.section} dir={dir}>
      <div className={styles.topRow}>
        <div className={styles.topRowText}>
          <h3 className={cn.sectionTitle}>{t('createPost.photos.title', loc)}</h3>
          <p className={cn.sectionHint}>{t('createPost.photos.hint', loc)}</p>
        </div>
        {images.length > 0 && (
          <span className={cn.badgeSoft}>
            {images.length} / {MAX_PHOTOS} {t('createPost.photos.badgeSuffix', loc)}
          </span>
        )}
      </div>

      <p className={styles.rulesStrip}>{t('createPost.photos.rules', loc)}</p>

      {errors.length > 0 && (
        <div className={styles.errorList} role="alert">
          <ul>
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {isEdit && existingImages.length > 0 && (
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <h4 className={styles.subTitle}>{t('createPost.photos.savedTitle', loc)}</h4>
          </div>
          <p className={styles.subHint}>{t('createPost.photos.savedHint', loc)}</p>
          <div className={styles.grid}>
            {existingImages.map((img) => (
              <figure key={String(img.id)} className={styles.tile}>
                <img src={img.url} alt="" className={styles.tileImg} />
                {onDeleteExistingImage && (
                  <button
                    type="button"
                    className={styles.savedDelete}
                    disabled={deletingImageId === String(img.id)}
                    aria-label={t('createPost.photos.deleteSaved', loc)}
                    onClick={(e) => {
                      e.stopPropagation()
                      void onDeleteExistingImage(img)
                    }}
                  >
                    {deletingImageId === String(img.id) ? (
                      <BsHourglassSplit size={18} className={styles.spinIcon} aria-hidden />
                    ) : (
                      <BsTrash size={18} aria-hidden />
                    )}
                  </button>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <h4 className={styles.subTitle}>{t('createPost.photos.newTitle', loc)}</h4>
        </div>

        <div {...rootProps}>
          <input key={dropzoneKey} {...getInputProps()} />

          <div className={styles.grid}>
            {images.map((file, i) => (
              <figure key={`${file.name}-${file.size}-${file.lastModified}-${i}`} className={styles.tile}>
                {previewUrls[i] && (
                  <img src={previewUrls[i]} alt="" className={styles.tileImg} />
                )}
                <button
                  type="button"
                  className={styles.tileRemove}
                  aria-label={t('createPost.photos.removeAria', loc)}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAt(i)
                  }}
                >
                  <BsTrash size={17} aria-hidden />
                </button>
                <figcaption className={styles.tileMeta}>
                  <span className={styles.tileName} title={file.name}>
                    {file.name}
                  </span>
                  <span className={styles.tileSize}>{formatBytes(file.size, locale)}</span>
                </figcaption>
              </figure>
            ))}

            {!atCapacity && (
              <button
                type="button"
                className={styles.addTile}
                onClick={(e) => {
                  e.stopPropagation()
                  open()
                }}
              >
                <span className={styles.addIcon}>
                  <BsPlusLg size={22} aria-hidden />
                </span>
                <span>{t('createPost.photos.addSlot', loc)}</span>
              </button>
            )}
          </div>

          <p className={styles.dropFooter}>
            {isDragActive && !atCapacity ? (
              <span className="d-inline-flex align-items-center gap-1">
                <BsCloudArrowUp aria-hidden />
                {t('createPost.photos.dropActive', loc)}
              </span>
            ) : (
              t('createPost.photos.dropHint', loc)
            )}
          </p>
        </div>

        {atCapacity && (
          <p className={styles.fullNote}>{t('createPost.photos.errSlotsFull', loc)}</p>
        )}
      </div>
    </section>
  )
}
