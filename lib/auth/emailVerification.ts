import type { SupportedLocale } from '@/lib/localization'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'

export type ApiErrorPayload = {
  error_code?: string
  message?: string
  success?: boolean
}

const EMAIL_VERIFY_MESSAGE_MARKERS = [
  'email_not_verified',
  'يجب تأكيد بريدك',
  'verify your email',
  'must verify your email',
]

let fetchInterceptorInstalled = false
let onEmailNotVerifiedCallback: ((payload: ApiErrorPayload) => void) | null = null

export function resolveLocaleFromPathname(pathname?: string): SupportedLocale {
  if (!pathname) return DEFAULT_LOCALE
  const segment = pathname.split('/').filter(Boolean)[0]
  return isSupportedLocale(segment) ? segment : DEFAULT_LOCALE
}

export function isOnEmailVerificationPage(pathname?: string): boolean {
  const path =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : undefined)
  return Boolean(path?.includes('/auth/verify-email'))
}

export function redirectToEmailVerification(locale?: SupportedLocale | string): void {
  if (typeof window === 'undefined') return
  if (isOnEmailVerificationPage()) return

  const loc = isSupportedLocale(locale) ? locale : resolveLocaleFromPathname(window.location.pathname)
  const target = `/${loc}/auth/verify-email`

  window.location.assign(target)
}

export function isEmailNotVerifiedError(payload: ApiErrorPayload | null | undefined): boolean {
  if (!payload) return false
  if (payload.error_code === 'email_not_verified') return true

  const message = (payload.message ?? '').toLowerCase()
  return EMAIL_VERIFY_MESSAGE_MARKERS.some((marker) => message.includes(marker.toLowerCase()))
}

export function registerEmailVerificationHandler(handler: (payload: ApiErrorPayload) => void) {
  onEmailNotVerifiedCallback = handler
}

export function installEmailVerificationFetchInterceptor(
  onBlocked: (payload: ApiErrorPayload) => void,
): void {
  registerEmailVerificationHandler(onBlocked)

  if (typeof window === 'undefined' || fetchInterceptorInstalled) return

  const nativeFetch = window.fetch.bind(window)

  window.fetch = async (...args) => {
    const response = await nativeFetch(...args)

    try {
      const requestUrl =
        typeof args[0] === 'string'
          ? args[0]
          : args[0] instanceof Request
            ? args[0].url
            : String(args[0])

      if (
        requestUrl.includes('/api/auth/email/') ||
        requestUrl.includes('/auth/verify-email')
      ) {
        return response
      }

      if (response.status === 403 || response.status === 500) {
        const clone = response.clone()
        const payload = (await clone.json().catch(() => ({}))) as ApiErrorPayload
        if (
          isEmailNotVerifiedError(payload) &&
          onEmailNotVerifiedCallback &&
          !isOnEmailVerificationPage()
        ) {
          onEmailNotVerifiedCallback(payload)
        }
      }
    } catch {
      /* ignore interceptor errors */
    }

    return response
  }

  fetchInterceptorInstalled = true
}

export function handleEmailVerificationBlock(
  payload: ApiErrorPayload | null | undefined,
  locale?: SupportedLocale | string,
): boolean {
  if (!isEmailNotVerifiedError(payload)) {
    return false
  }

  if (isOnEmailVerificationPage()) {
    return true
  }

  if (onEmailNotVerifiedCallback) {
    onEmailNotVerifiedCallback(payload)
    return true
  }

  redirectToEmailVerification(locale)
  return true
}
