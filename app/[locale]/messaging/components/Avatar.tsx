'use client'

import Image from 'next/image'
import { useState } from 'react'

import styles from '../messaging.module.css'
import { getInitials, resolveAvatar } from './messagingHelpers'

type AvatarProps = {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
  alt?: string
}

/**
 * Always-renderable avatar:
 *  - resolves S3/CloudFront/Next-static paths through `resolveMediaUrl`
 *  - falls back to a coloured initials circle when there is no image or
 *    the image fails to load
 */
export default function Avatar({ src, name, size = 44, className, alt }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const resolved = resolveAvatar(src)
  const showFallback = errored || !resolved

  if (showFallback) {
    return (
      <div
        className={`${styles.convoAvatarFallback} ${className || ''}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
        aria-label={alt || name || ''}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <Image
      src={resolved}
      alt={alt || name || ''}
      width={size}
      height={size}
      className={`${styles.convoAvatar} ${className || ''}`}
      style={{ width: size, height: size }}
      onError={() => setErrored(true)}
      unoptimized
    />
  )
}
