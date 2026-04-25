import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import defaultUserAvatar from '@/assets/images/avatar/user-default.svg'

/** Resolve any avatar candidate (path/url) to an always-renderable string. */
export function resolveAvatar(input?: string | null): string {
  if (!input) return defaultUserAvatar.src
  const resolved = resolveMediaUrl(input)
  return resolved || defaultUserAvatar.src
}

/** Resolve a post image to a renderable URL or null when missing. */
export function resolvePostImage(input?: string | null): string | null {
  if (!input) return null
  return resolveMediaUrl(input) || null
}

/** Two-letter initials from a display name (used as avatar fallback). */
export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const cleaned = name.trim()
  if (!cleaned) return '?'
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Compact relative time used for conversation list rows. */
export function formatConvoTime(iso: string | null | undefined, locale: SupportedLocale): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.round(diffMs / 60000)

  if (diffMin < 1) return t('messaging.justNow', locale)
  if (diffMin < 60) return t('messaging.minutesAgo', locale).replace('{n}', String(diffMin))

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) {
    return d.toLocaleTimeString(locale === 'ar' ? 'ar' : 'en', { hour: '2-digit', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  if (isYesterday) return t('messaging.yesterday', locale)

  const diffDays = Math.floor(diffMs / (24 * 3600 * 1000))
  if (diffDays < 7) return t('messaging.daysAgo', locale).replace('{n}', String(diffDays))

  return d.toLocaleDateString(locale === 'ar' ? 'ar' : 'en', { day: 'numeric', month: 'short' })
}

/** Time of a single message bubble. */
export function formatMessageTime(iso: string | null | undefined, locale: SupportedLocale): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(locale === 'ar' ? 'ar' : 'en', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Day-separator label between groups of messages (Today / Yesterday / date). */
export function formatDayLabel(iso: string, locale: SupportedLocale): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) return t('messaging.today', locale)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  if (isYesterday) return t('messaging.yesterday', locale)
  return d.toLocaleDateString(locale === 'ar' ? 'ar' : 'en', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

/** Day key (yyyy-mm-dd) used to group consecutive messages by day. */
export function dayKey(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/**
 * Build a stable client_id for optimistic message sends. The backend will
 * echo the same id back on `chat.message.created` so we can replace the
 * pending bubble with the persisted one.
 */
export function generateClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
