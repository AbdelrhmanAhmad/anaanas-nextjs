/** Canonical site origin for robots, sitemap, metadata (no trailing slash). */
export function getPublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) {
    try {
      return new URL(raw.replace(/\/$/, '')).origin
    } catch {
      /* ignore */
    }
  }
  return 'https://anaanas.com'
}
