/**
 * Country used to scope similar / more-from-section listings on post detail.
 * Prefer the viewed post's country; fall back to portal country (subdomain).
 */
export function resolveListingCountryId(
  post: Record<string, unknown> | null | undefined,
  portalCountryId?: number,
): number | undefined {
  const nestedCountry = post?.country
  const nestedId =
    nestedCountry && typeof nestedCountry === 'object' && nestedCountry !== null && 'id' in nestedCountry
      ? Number((nestedCountry as { id?: unknown }).id)
      : 0

  const fromPost = Number(post?.country_id ?? nestedId ?? 0)
  if (fromPost > 0) return fromPost

  if (portalCountryId != null && portalCountryId > 0) return portalCountryId

  return undefined
}
